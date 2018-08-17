---
layout: post
title: LK v4.17.x - d_walk - soft lockup
author: zer0day
categories: lk
---

d_walk - soft lockup

posted & found by [zer0day](https://kozistr.github.io/)

## tl;dr

Got from syzkaller & Found in LK v4.17.0-rc1.

## Call Trace (Dump)

Here's a dmesg.

```c
watchdog: BUG: soft lockup - CPU#1 stuck for 22s! [syz-executor4:7810]
Modules linked in:
irq event stamp: 13333674
hardirqs last  enabled at (13333673): [<ffffffff83e06b6a>] seqcount_lockdep_reader_access include/linux/seqlock.h:83 [inline]
hardirqs last  enabled at (13333673): [<ffffffff83e06b6a>] read_seqcount_begin include/linux/seqlock.h:164 [inline]
hardirqs last  enabled at (13333673): [<ffffffff83e06b6a>] read_seqbegin include/linux/seqlock.h:433 [inline]
hardirqs last  enabled at (13333673): [<ffffffff83e06b6a>] read_seqbegin_or_lock include/linux/seqlock.h:529 [inline]
hardirqs last  enabled at (13333673): [<ffffffff83e06b6a>] d_walk+0x18a/0xa60 fs/dcache.c:1248
hardirqs last disabled at (13333674): [<ffffffff86200964>] interrupt_entry+0xc4/0xe0 arch/x86/entry/entry_64.S:625
softirqs last  enabled at (2250648): [<ffffffff864006f6>] __do_softirq+0x6f6/0xa8b kernel/softirq.c:311
softirqs last disabled at (2250639): [<ffffffff837539fb>] invoke_softirq kernel/softirq.c:365 [inline]
softirqs last disabled at (2250639): [<ffffffff837539fb>] irq_exit+0x19b/0x1c0 kernel/softirq.c:405
CPU: 1 PID: 7810 Comm: syz-executor4 Not tainted 4.17.0-rc1+ #34
Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS 1.10.2-1ubuntu1 04/01/2014
RIP: 0010:arch_local_irq_restore arch/x86/include/asm/paravirt.h:783 [inline]
RIP: 0010:lock_acquire+0x1f3/0x4a0 kernel/locking/lockdep.c:3923
RSP: 0018:ffff88003fd7f940 EFLAGS: 00000246 ORIG_RAX: ffffffffffffff13
RAX: 0000000000000007 RBX: 1ffff10007faff2c RCX: 0000000000000000
RDX: 0000000000000000 RSI: 0000000000000000 RDI: 0000000000000246
RBP: ffff88003957ae40 R08: 0000000000000003 R09: ffffffff881d38e0
R10: ffff88003957b710 R11: 0000000000000001 R12: 0000000000000000
R13: 0000000000000000 R14: 0000000000000001 R15: 0000000000000000
FS:  0000000001688940(0000) GS:ffff88006d100000(0000) knlGS:0000000000000000
CS:  0010 DS: 0000 ES: 0000 CR0: 0000000080050033
CR2: 00007ffc28f88e84 CR3: 000000003fd72000 CR4: 00000000000006e0
DR0: 0000000020000100 DR1: 0000000020000100 DR2: 0000000000000000
DR3: 0000000000000000 DR6: 00000000fffe0ff0 DR7: 0000000000000600
Call Trace:
 _raw_spin_lock_nested+0x25/0x30 kernel/locking/spinlock.c:354
 d_walk+0x359/0xa60 fs/dcache.c:1274
 shrink_dcache_parent+0x164/0x210 fs/dcache.c:1486
 vfs_rmdir+0x1cf/0x420 fs/namei.c:3850
 do_rmdir+0x3fa/0x5a0 fs/namei.c:3911
 do_syscall_64+0x148/0x5d0 arch/x86/entry/common.c:287
Code: ea 03 0f b6 14 02 48 89 f8 83 e0 07 83 c0 03 38 d0 7c 08 84 d2 0f 85 3f 02 00 00 c7 85 2c 08 00 00 00 00 00 00 48 8b 3c 24 57 9d <0f> 1f 44 00 00 48 b8 00 00 00 00 00 fc ff df 48 01 c3 48 c7 03 
watchdog: BUG: soft lockup - CPU#0 stuck for 22s! [syz-executor1:2869]
Modules linked in:
irq event stamp: 15849430
hardirqs last  enabled at (15849429): [<ffffffff83e06b6a>] seqcount_lockdep_reader_access include/linux/seqlock.h:83 [inline]
hardirqs last  enabled at (15849429): [<ffffffff83e06b6a>] read_seqcount_begin include/linux/seqlock.h:164 [inline]
hardirqs last  enabled at (15849429): [<ffffffff83e06b6a>] read_seqbegin include/linux/seqlock.h:433 [inline]
hardirqs last  enabled at (15849429): [<ffffffff83e06b6a>] read_seqbegin_or_lock include/linux/seqlock.h:529 [inline]
hardirqs last  enabled at (15849429): [<ffffffff83e06b6a>] d_walk+0x18a/0xa60 fs/dcache.c:1248
hardirqs last disabled at (15849430): [<ffffffff86200964>] interrupt_entry+0xc4/0xe0 arch/x86/entry/entry_64.S:625
softirqs last  enabled at (2389822): [<ffffffff864006f6>] __do_softirq+0x6f6/0xa8b kernel/softirq.c:311
softirqs last disabled at (2389715): [<ffffffff837539fb>] invoke_softirq kernel/softirq.c:365 [inline]
softirqs last disabled at (2389715): [<ffffffff837539fb>] irq_exit+0x19b/0x1c0 kernel/softirq.c:405
CPU: 0 PID: 2869 Comm: syz-executor1 Tainted: G             L    4.17.0-rc1+ #34
Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS 1.10.2-1ubuntu1 04/01/2014
RIP: 0010:__sanitizer_cov_trace_pc+0x0/0x50 kernel/kcov.c:146
RSP: 0018:ffff8800444d7a48 EFLAGS: 00000297 ORIG_RAX: ffffffffffffff13
RAX: 0000000000000000 RBX: ffff8800628d1c78 RCX: 0000000000000000
RDX: 0000000000000000 RSI: ffff8800628d1b88 RDI: ffff8800444d7c28
RBP: ffff8800444d7bc8 R08: ffffed000c51a382 R09: ffffed000c51a381
R10: ffff8800628d1c0b R11: 1ffff1000c51a381 R12: ffff8800628d1c08
R13: ffffed000889af6c R14: ffff8800628d0d78 R15: dffffc0000000000
FS:  000000000173a940(0000) GS:ffff88006d000000(0000) knlGS:0000000000000000
CS:  0010 DS: 0000 ES: 0000 CR0: 0000000080050033
CR2: 0000000001743c18 CR3: 0000000045180000 CR4: 00000000000006f0
DR0: 0000000020000100 DR1: 0000000020000100 DR2: 0000000000000000
DR3: 0000000000000000 DR6: 00000000fffe0ff0 DR7: 0000000000000600
Call Trace:
 d_walk+0x38c/0xa60 fs/dcache.c:1291
 shrink_dcache_parent+0x164/0x210 fs/dcache.c:1486
 vfs_rmdir+0x1cf/0x420 fs/namei.c:3850
 do_rmdir+0x3fa/0x5a0 fs/namei.c:3911
 do_syscall_64+0x148/0x5d0 arch/x86/entry/common.c:287
Code: 83 c1 01 4a 89 7c 10 e0 4a 89 74 10 e8 4a 89 54 10 f0 4a 89 4c d8 20 4c 89 08 f3 c3 0f 1f 44 00 00 66 2e 0f 1f 84 00 00 00 00 00 <65> 48 8b 04 25 80 de 01 00 65 8b 15 a0 56 5f 7c 81 e2 00 01 1f 
```

I'll update post later...

**End**
