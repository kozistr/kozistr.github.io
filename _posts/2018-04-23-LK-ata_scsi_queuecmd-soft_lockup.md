---
layout: post
title: LK v4.17.x - ata_scsi_queuecmd - soft lockup
comments: true
---

ata_scsi_queuecmd - soft lockup

posted & found by [zer0day](https://kozistr.github.io/)

## tl;dr

Got from syzkaller & Found in LK v4.17.0-rc1.

## Call Trace (Dump)

Here's a dmesg.

```c
...
watchdog: BUG: soft lockup - CPU#0 stuck for 22s! [kworker/0:1:23]
Modules linked in:
irq event stamp: 223171
hardirqs last  enabled at (223170): [<ffffffff9c92d7a6>] __raw_spin_unlock_irqrestore include/linux/spinlock_api_smp.h:160 [inline]
hardirqs last  enabled at (223170): [<ffffffff9c92d7a6>] _raw_spin_unlock_irqrestore+0x46/0x60 kernel/locking/spinlock.c:184
hardirqs last disabled at (223171): [<ffffffff9ca00964>] interrupt_entry+0xc4/0xe0 arch/x86/entry/entry_64.S:625
softirqs last  enabled at (223104): [<ffffffff9cc006f6>] __do_softirq+0x6f6/0xa8b kernel/softirq.c:311
softirqs last disabled at (223133): [<ffffffff99f539fb>] invoke_softirq kernel/softirq.c:365 [inline]
softirqs last disabled at (223133): [<ffffffff99f539fb>] irq_exit+0x19b/0x1c0 kernel/softirq.c:405
CPU: 0 PID: 23 Comm: kworker/0:1 Not tainted 4.17.0-rc1+ #34
Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS 1.10.2-1ubuntu1 04/01/2014
Workqueue: events e1000_watchdog
RIP: 0010:arch_local_irq_restore arch/x86/include/asm/paravirt.h:783 [inline]
RIP: 0010:__raw_spin_unlock_irqrestore include/linux/spinlock_api_smp.h:160 [inline]
RIP: 0010:_raw_spin_unlock_irqrestore+0x4b/0x60 kernel/locking/spinlock.c:184
RSP: 0018:ffff88006d006bd8 EFLAGS: 00000246 ORIG_RAX: ffffffffffffff13
RAX: 0000000000000007 RBX: 0000000000000246 RCX: 0000000000000000
RDX: 0000000000000000 RSI: 0000000000000000 RDI: 0000000000000246
RBP: ffff880064c1b2a8 R08: ffffed000c983656 R09: ffff88006c074db8
R10: 0000000000000000 R11: 0000000000000000 R12: ffffffff9b6faf30
R13: ffff880064e58000 R14: 000000000000000a R15: ffff880064e58010
FS:  0000000000000000(0000) GS:ffff88006d000000(0000) knlGS:0000000000000000
CS:  0010 DS: 0000 ES: 0000 CR0: 0000000080050033
CR2: 0000000000a0e0f8 CR3: 00000000676c0000 CR4: 00000000000006f0
DR0: 0000000000000000 DR1: 0000000000000000 DR2: 0000000000000000
DR3: 0000000000000000 DR6: 00000000fffe0ff0 DR7: 0000000000000400
Call Trace:
 <IRQ>
 spin_unlock_irqrestore include/linux/spinlock.h:365 [inline]
 ata_scsi_queuecmd+0x2d7/0x690 drivers/ata/libata-scsi.c:4389
 scsi_dispatch_cmd+0x390/0xb10 drivers/scsi/scsi_lib.c:1761
 scsi_request_fn+0xba0/0x1be0 drivers/scsi/scsi_lib.c:1899
 </IRQ>
watchdog: BUG: soft lockup - CPU#1 stuck for 23s! [logrotate:2850]
Modules linked in:
irq event stamp: 253398
hardirqs last  enabled at (253397): [<ffffffff9ca00a60>] restore_regs_and_return_to_kernel+0x0/0x30
hardirqs last disabled at (253398): [<ffffffff9ca00964>] interrupt_entry+0xc4/0xe0 arch/x86/entry/entry_64.S:625
softirqs last  enabled at (253396): [<ffffffff9cc006f6>] __do_softirq+0x6f6/0xa8b kernel/softirq.c:311
softirqs last disabled at (253389): [<ffffffff99f539fb>] invoke_softirq kernel/softirq.c:365 [inline]
softirqs last disabled at (253389): [<ffffffff99f539fb>] irq_exit+0x19b/0x1c0 kernel/softirq.c:405
CPU: 1 PID: 2850 Comm: logrotate Not tainted 4.17.0-rc1+ #34
Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS 1.10.2-1ubuntu1 04/01/2014
RIP: 0010:rep_nop arch/x86/include/asm/processor.h:667 [inline]
RIP: 0010:cpu_relax arch/x86/include/asm/processor.h:672 [inline]
RIP: 0010:csd_lock_wait kernel/smp.c:108 [inline]
RIP: 0010:smp_call_function_single+0x3b8/0x510 kernel/smp.c:302
RSP: 0018:ffff8800625cf4c0 EFLAGS: 00000293
 ORIG_RAX: ffffffffffffff13
RAX: ffff880066781740 RBX: ffff8800625cf538 RCX: ffffffff9a17e0e6
RDX: 0000000000000000 RSI: 0000000000000000 RDI: ffff8800625cf538
RBP: ffff8800625cf620 R08: ffffed000da05791 R09: ffff880066781f90
Code: 
R10: 0000000000000000 R11: 0000000000000000 R12: 0000000000000001
R13: dffffc0000000000 R14: 0000000000000000 R15: ffffed000c4b9eb4
51 
FS:  00007faffc8de7a0(0000) GS:ffff88006d100000(0000) knlGS:0000000000000000
76 fd 
CS:  0010 DS: 0000 ES: 0000 CR0: 0000000080050033
CR2: 00007faffc8e3000 CR3: 00000000676c0000 CR4: 00000000000006e0
f6 c7 
DR0: 0000000000000000 DR1: 0000000000000000 DR2: 0000000000000000
02 75 
DR3: 0000000000000000 DR6: 00000000fffe0ff0 DR7: 0000000000000400
Call Trace:
19 48 
89 
df 
57 
9d 0f 
1f 44 
 smp_call_function_many+0x6b0/0x820 kernel/smp.c:434
00 00 
e8 19 
5d 74 
fd 65 
ff 0d 
 native_flush_tlb_others+0xec/0x620 arch/x86/mm/tlb.c:595
72 06 
6f 63 
5b 5d 
c3 
e8 ea 
e8 
74 
 flush_tlb_others arch/x86/include/asm/paravirt.h:309 [inline]
 flush_tlb_mm_range+0x255/0x400 arch/x86/mm/tlb.c:644
fd 48 
89 df 
57 9d 
<0f> 1f 
44 
00 00 
 tlb_flush_mmu_tlbonly+0x277/0x430 mm/memory.c:246
eb 
e5 
 tlb_flush_mmu mm/memory.c:267 [inline]
 arch_tlb_finish_mmu+0x97/0x140 mm/memory.c:283
0f 
 tlb_finish_mmu+0x119/0x1c0 mm/memory.c:433
1f 
40 00 
66 
 unmap_region+0x382/0x4e0 mm/mmap.c:2532
2e 0f 
1f 84 
00 00 
00 
00 00 
 do_munmap+0x50a/0xd50 mm/mmap.c:2744
 vm_munmap+0x102/0x180 mm/mmap.c:2763
 __do_sys_munmap mm/mmap.c:2773 [inline]
 __se_sys_munmap mm/mmap.c:2770 [inline]
 __x64_sys_munmap+0x5b/0x70 mm/mmap.c:2770
 do_syscall_64+0x148/0x5d0 arch/x86/entry/common.c:287
Code: 00 00 fc ff df 44 89 bc 24 e0 00 00 00 48 c1 e8 03 4c 01 e8 41 83 e7 01 c6 00 f8 74 53 49 89 c7 48 83 c3 18 e8 7a a6 0a 00 f3 90 <48> 89 da 41 c6 07 04 48 c1 ea 03 42 0f b6 14 2a 84 d2 74 09 80 
```

I'll update a post later...

**End**