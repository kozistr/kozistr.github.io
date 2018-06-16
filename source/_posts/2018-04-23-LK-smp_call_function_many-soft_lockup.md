---
layout: post
title: LK v4.17.x - smp_call_function_many - soft lockup
comments: true
---

smp_call_function_many - soft lockup

posted & found by [zer0day](https://kozistr.github.io/)

## tl;dr

Got from syzkaller & Found in LK v4.17.0-rc1.

## Call Trace (Dump)

Here's a dmesg.

```c
watchdog: BUG: soft lockup - CPU#1 stuck for 21s! [syz-fuzzer:2758]
Modules linked in:
irq event stamp: 937580
hardirqs last  enabled at (937579): [<ffffffff87000a60>] restore_regs_and_return_to_kernel+0x0/0x30
hardirqs last disabled at (937580): [<ffffffff87000964>] interrupt_entry+0xc4/0xe0 arch/x86/entry/entry_64.S:625
softirqs last  enabled at (891764): [<ffffffff872006f6>] __do_softirq+0x6f6/0xa8b kernel/softirq.c:311
softirqs last disabled at (891755): [<ffffffff845539fb>] invoke_softirq kernel/softirq.c:365 [inline]
softirqs last disabled at (891755): [<ffffffff845539fb>] irq_exit+0x19b/0x1c0 kernel/softirq.c:405
CPU: 1 PID: 2758 Comm: syz-fuzzer Not tainted 4.17.0-rc1+ #34
Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS 1.10.2-1ubuntu1 04/01/2014
RIP: 0010:rep_nop arch/x86/include/asm/processor.h:667 [inline]
RIP: 0010:cpu_relax arch/x86/include/asm/processor.h:672 [inline]
RIP: 0010:csd_lock_wait kernel/smp.c:108 [inline]
RIP: 0010:smp_call_function_single+0x3b8/0x510 kernel/smp.c:302
RSP: 0000:ffff88006652e9c0 EFLAGS: 00000293 ORIG_RAX: ffffffffffffff13
RAX: ffff88006bffc540 RBX: ffff88006652ea38 RCX: ffffffff8477e0e6
RDX: 0000000000000000 RSI: 0000000000000000 RDI: ffff88006652ea38
RBP: ffff88006652eb20 R08: ffffed000da05791 R09: ffff88006bffcdb8
R10: 0000000000000000 R11: 0000000000000000 R12: 0000000000000001
R13: dffffc0000000000 R14: 0000000000000000 R15: ffffed000cca5d54
FS:  000000c42023dc68(0000) GS:ffff88006d100000(0000) knlGS:0000000000000000
CS:  0010 DS: 0000 ES: 0000 CR0: 0000000080050033
CR2: 00007f6ca68cd650 CR3: 0000000060ed6000 CR4: 00000000000006e0
DR0: 0000000000000000 DR1: 0000000000000000 DR2: 0000000000000000
DR3: 0000000000000000 DR6: 00000000fffe0ff0 DR7: 0000000000000400
Call Trace:
 smp_call_function_many+0x6b0/0x820 kernel/smp.c:434
 native_flush_tlb_others+0xec/0x620 arch/x86/mm/tlb.c:595
 flush_tlb_others arch/x86/include/asm/paravirt.h:309 [inline]
 flush_tlb_mm_range+0x255/0x400 arch/x86/mm/tlb.c:644
 flush_tlb_page arch/x86/include/asm/tlbflush.h:526 [inline]
 ptep_clear_flush+0x1a8/0x1f0 mm/pgtable-generic.c:87
 wp_page_copy+0x97e/0x1c40 mm/memory.c:2527
 do_wp_page+0x46c/0x2240 mm/memory.c:2776
 handle_pte_fault mm/memory.c:3979 [inline]
 __handle_mm_fault+0x1b21/0x32f0 mm/memory.c:4087
 handle_mm_fault+0x12e/0x390 mm/memory.c:4124
 __do_page_fault+0x517/0xb70 arch/x86/mm/fault.c:1399
 do_page_fault+0xc1/0x610 arch/x86/mm/fault.c:1474
 async_page_fault+0x1e/0x30 arch/x86/entry/entry_64.S:1163
RIP: 0033:0x41cfa7
RSP: 002b:000000c4201d3cb0 EFLAGS: 00010246
RAX: 000000c420016000 RBX: 0000000000000000 RCX: 0000000000000000
RDX: 00007f6ca68dd4c0 RSI: 0000000000000000 RDI: 00007f6ca68cd650
RBP: 000000c4201d3cd0 R08: 0000000000000000 R09: 0000000000000000
R10: 0000000000000001 R11: 0000000000000286 R12: 00000000000000ff
R13: 0000000000000020 R14: 00007f6ca68d9000 R15: 0000000000000010
Code: 00 00 fc ff df 44 89 bc 24 e0 00 00 00 48 c1 e8 03 4c 01 e8 41 83 e7 01 c6 00 f8 74 53 49 89 c7 48 83 c3 18 e8 7a a6 0a 00 f3 90 <48> 89 da 41 c6 07 04 48 c1 ea 03 42 0f b6 14 2a 84 d2 74 09 80 
watchdog: BUG: soft lockup - CPU#0 stuck for 37s! [kworker/0:1:24]
Modules linked in:
irq event stamp: 18446
hardirqs last  enabled at (18445): [<ffffffff86f2d7a6>] __raw_spin_unlock_irqrestore include/linux/spinlock_api_smp.h:160 [inline]
hardirqs last  enabled at (18445): [<ffffffff86f2d7a6>] _raw_spin_unlock_irqrestore+0x46/0x60 kernel/locking/spinlock.c:184
hardirqs last disabled at (18446): [<ffffffff87000964>] interrupt_entry+0xc4/0xe0 arch/x86/entry/entry_64.S:625
softirqs last  enabled at (18432): [<ffffffff8644cc31>] neigh_periodic_work+0x6b1/0xa90 net/core/neighbour.c:862
softirqs last disabled at (18428): [<ffffffff8644c65b>] neigh_periodic_work+0xdb/0xa90 net/core/neighbour.c:794
CPU: 0 PID: 24 Comm: kworker/0:1 Tainted: G             L    4.17.0-rc1+ #34
Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS 1.10.2-1ubuntu1 04/01/2014
Workqueue: events e1000_watchdog
RIP: 0010:arch_local_irq_restore arch/x86/include/asm/paravirt.h:783 [inline]
RIP: 0010:__raw_spin_unlock_irqrestore include/linux/spinlock_api_smp.h:160 [inline]
RIP: 0010:_raw_spin_unlock_irqrestore+0x4b/0x60 kernel/locking/spinlock.c:184
RSP: 0018:ffff88006c14f4c0 EFLAGS: 00000293 ORIG_RAX: ffffffffffffff13
RAX: 0000000000000007 RBX: 0000000000000293 RCX: 0000000000000000
RDX: 0000000000000000 RSI: 0000000000000000 RDI: 0000000000000293
RBP: ffff880066e8ade0 R08: ffffed000cdd15bd R09: ffff88006c0736b8
R10: 0000000000000000 R11: 0000000000000000 R12: 0000000000000000
R13: ffff880066e8abc0 R14: ffff880066e8afb8 R15: ffff880066e8a180
FS:  0000000000000000(0000) GS:ffff88006d000000(0000) knlGS:0000000000000000
CS:  0010 DS: 0000 ES: 0000 CR0: 0000000080050033
CR2: 000000c42d98e000 CR3: 00000000614ac000 CR4: 00000000000006f0
DR0: 0000000000000000 DR1: 0000000000000000 DR2: 0000000000000000
DR3: 0000000000000000 DR6: 00000000fffe0ff0 DR7: 0000000000000400
Call Trace:
 spin_unlock_irqrestore include/linux/spinlock.h:365 [inline]
 e1000_update_stats+0x13ed/0x1d60 drivers/net/ethernet/intel/e1000/e1000_main.c:3768
 e1000_watchdog+0x335/0x11a0 drivers/net/ethernet/intel/e1000/e1000_main.c:2521
Code: 51 76 fd f6 c7 02 75 19 48 89 df 57 9d 0f 1f 44 00 00 e8 19 5d 74 fd 65 ff 0d 72 06 0f 79 5b 5d c3 e8 ea e8 74 fd 48 89 df 57 9d <0f> 1f 44 00 00 eb e5 0f 1f 40 00 66 2e 0f 1f 84 00 00 00 00 00 
```

I'll update a post later...

**End**
