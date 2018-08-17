---
layout: post
title: LK v4.17.x - e1000_update_stats - soft lockup
author: zer0day
categories: lk
---

e1000_update_stats - soft lockup

posted & found by [zer0day](https://kozistr.github.io/)

## tl;dr

Got from syzkaller & Found in LK v4.17.0-rc1.

## Call Trace (Dump)

Here's a dmesg.

```c
watchdog: BUG: soft lockup - CPU#0 stuck for 22s! [kworker/0:1:24]
Modules linked in:
irq event stamp: 22544
hardirqs last  enabled at (22543): [<ffffffff90a00a60>] restore_regs_and_return_to_kernel+0x0/0x30
hardirqs last disabled at (22544): [<ffffffff90a00964>] interrupt_entry+0xc4/0xe0 arch/x86/entry/entry_64.S:625
softirqs last  enabled at (22532): [<ffffffff8fe4cc31>] neigh_periodic_work+0x6b1/0xa90 net/core/neighbour.c:862
softirqs last disabled at (22528): [<ffffffff8fe4c65b>] neigh_periodic_work+0xdb/0xa90 net/core/neighbour.c:794
CPU: 0 PID: 24 Comm: kworker/0:1 Not tainted 4.17.0-rc1+ #34
Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS 1.10.2-1ubuntu1 04/01/2014
Workqueue: events e1000_watchdog
RIP: 0010:arch_local_irq_restore arch/x86/include/asm/paravirt.h:783 [inline]
RIP: 0010:__raw_spin_unlock_irqrestore include/linux/spinlock_api_smp.h:160 [inline]
RIP: 0010:_raw_spin_unlock_irqrestore+0x4b/0x60 kernel/locking/spinlock.c:184
RSP: 0018:ffff88006c13f4c0 EFLAGS: 00000293 ORIG_RAX: ffffffffffffff13
RAX: 0000000000000007 RBX: 0000000000000293 RCX: 0000000000000000
RDX: 0000000000000000 RSI: 0000000000000000 RDI: 0000000000000293
RBP: ffff880066e82de0 R08: ffffed000cdd05bd R09: ffff88006c0736b8
R10: 0000000000000000 R11: 0000000000000000 R12: 0000000000000000
R13: ffff880066e82bc0 R14: ffff880066e82fb8 R15: ffff880066e82180
FS:  0000000000000000(0000) GS:ffff88006d000000(0000) knlGS:0000000000000000
CS:  0010 DS: 0000 ES: 0000 CR0: 0000000080050033
CR2: 00007f4393533000 CR3: 0000000061aec000 CR4: 00000000000006f0
DR0: 0000000000000000 DR1: 0000000000000000 DR2: 0000000000000000
DR3: 0000000000000000 DR6: 00000000fffe0ff0 DR7: 0000000000000400
Call Trace:
 spin_unlock_irqrestore include/linux/spinlock.h:365 [inline]
 e1000_update_stats+0x13ed/0x1d60 drivers/net/ethernet/intel/e1000/e1000_main.c:3768
 e1000_watchdog+0x335/0x11a0 drivers/net/ethernet/intel/e1000/e1000_main.c:2521
Code: 51 76 fd f6 c7 02 75 19 48 89 df 57 9d 0f 1f 44 00 00 e8 19 5d 74 fd 65 ff 0d 72 06 6f 6f 5b 5d c3 e8 ea e8 74 fd 48 89 df 57 9d <0f> 1f 44 00 00 eb e5 0f 1f 40 00 66 2e 0f 1f 84 00 00 00 00 00 
watchdog: BUG: soft lockup - CPU#0 stuck for 21s! [kworker/0:1:24]
Modules linked in:
irq event stamp: 22987
hardirqs last  enabled at (22986): [<ffffffff90a00a60>] restore_regs_and_return_to_kernel+0x0/0x30
hardirqs last disabled at (22987): [<ffffffff90a00964>] interrupt_entry+0xc4/0xe0 arch/x86/entry/entry_64.S:625
softirqs last  enabled at (22958): [<ffffffff90c006f6>] __do_softirq+0x6f6/0xa8b kernel/softirq.c:311
softirqs last disabled at (22979): [<ffffffff8df539fb>] invoke_softirq kernel/softirq.c:365 [inline]
softirqs last disabled at (22979): [<ffffffff8df539fb>] irq_exit+0x19b/0x1c0 kernel/softirq.c:405
CPU: 0 PID: 24 Comm: kworker/0:1 Tainted: G             L    4.17.0-rc1+ #34
Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS 1.10.2-1ubuntu1 04/01/2014
Workqueue: events e1000_watchdog
RIP: 0010:arch_local_irq_enable arch/x86/include/asm/paravirt.h:793 [inline]
RIP: 0010:__do_softirq+0x26c/0xa8b kernel/softirq.c:269
RSP: 0018:ffff88006d007cb0 EFLAGS: 00000246 ORIG_RAX: ffffffffffffff13
RAX: 0000000000000007 RBX: ffff88006c072e40 RCX: 0000000000000000
RDX: 0000000000000000 RSI: 0000000000000000 RDI: ffff88006c07366c
RBP: 1ffff1000da00fe1 R08: 0000000000000000 R09: ffff88006c0736b8
R10: 0000000000000000 R11: 0000000000000000 R12: 0000000000000000
R13: 0000000000000282 R14: 0000000000000000 R15: dffffc0000000000
FS:  0000000000000000(0000) GS:ffff88006d000000(0000) knlGS:0000000000000000
CS:  0010 DS: 0000 ES: 0000 CR0: 0000000080050033
CR2: 000000c42ac0b140 CR3: 000000001ec22000 CR4: 00000000000006f0
DR0: 0000000000000000 DR1: 0000000000000000 DR2: 0000000000000000
DR3: 0000000000000000 DR6: 00000000fffe0ff0 DR7: 0000000000000400
Call Trace:
 <IRQ>
 invoke_softirq kernel/softirq.c:365 [inline]
 irq_exit+0x19b/0x1c0 kernel/softirq.c:405
 exiting_irq arch/x86/include/asm/apic.h:525 [inline]
 smp_apic_timer_interrupt+0x162/0x6d0 arch/x86/kernel/apic/apic.c:1052
 apic_timer_interrupt+0xf/0x20 arch/x86/entry/entry_64.S:863
 </IRQ>
RIP: 0010:arch_local_irq_restore arch/x86/include/asm/paravirt.h:783 [inline]
RIP: 0010:__raw_spin_unlock_irqrestore include/linux/spinlock_api_smp.h:160 [inline]
RIP: 0010:_raw_spin_unlock_irqrestore+0x4b/0x60 kernel/locking/spinlock.c:184
RSP: 0018:ffff88006c13f4c0 EFLAGS: 00000293 ORIG_RAX: ffffffffffffff13
RAX: 0000000000000007 RBX: 0000000000000293 RCX: 0000000000000000
RDX: 0000000000000000 RSI: 0000000000000000 RDI: 0000000000000293
RBP: ffff880066e82de0 R08: ffffed000cdd05bd R09: ffff88006c0736b8
R10: 0000000000000000 R11: 0000000000000000 R12: 0000000000000000
R13: ffff880066e82bc0 R14: ffff880066e82fb8 R15: ffff880066e82180
 spin_unlock_irqrestore include/linux/spinlock.h:365 [inline]
 e1000_update_stats+0x13ed/0x1d60 drivers/net/ethernet/intel/e1000/e1000_main.c:3768
 e1000_watchdog+0x335/0x11a0 drivers/net/ethernet/intel/e1000/e1000_main.c:2521
Code: 34 0a 00 00 00 48 c1 e8 03 4c 01 f8 48 89 44 24 20 48 c7 c0 80 a2 02 00 65 c7 00 00 00 00 00 e8 2b be 47 fd fb 66 0f 1f 44 00 00 <b8> ff ff ff ff 48 c7 44 24 08 00 91 80 91 41 0f bc c5 83 c0 01 
...
**********************************************************
**   NOTICE NOTICE NOTICE NOTICE NOTICE NOTICE NOTICE   **
**                                                      **
** trace_printk() being used. Allocating extra memory.  **
**                                                      **
** This means that this is a DEBUG kernel and it is     **
** unsafe for production use.                           **
**                                                      **
** If you see this message and you are not debugging    **
** the kernel, report this immediately to your vendor!  **
**                                                      **
**   NOTICE NOTICE NOTICE NOTICE NOTICE NOTICE NOTICE   **
**********************************************************
...
```

I'll update a post later...

**End**
