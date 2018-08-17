---
layout: post
title: LK v4.17.x - hpet_open - soft lockup
author: zer0day
categories: lk
---

hpet_open - soft lockup

posted & found by [zer0day](https://kozistr.github.io/)

## tl;dr

Got from syzkaller & Found in LK v4.17.0-rc1.

## Call Trace (Dump)

Here's a dmesg.

```c
hrtimer: interrupt took 3048710 ns
watchdog: BUG: soft lockup - CPU#1 stuck for 28s! [syz-fuzzer:2773]
Modules linked in:
irq event stamp: 161094
hardirqs last  enabled at (161093): [<ffffffffb6f2d744>] __raw_spin_unlock_irq include/linux/spinlock_api_smp.h:168 [inline]
hardirqs last  enabled at (161093): [<ffffffffb6f2d744>] _raw_spin_unlock_irq+0x24/0x40 kernel/locking/spinlock.c:192
hardirqs last disabled at (161094): [<ffffffffb7000964>] interrupt_entry+0xc4/0xe0 arch/x86/entry/entry_64.S:625
softirqs last  enabled at (160916): [<ffffffffb72006f6>] __do_softirq+0x6f6/0xa8b kernel/softirq.c:311
softirqs last disabled at (160899): [<ffffffffb45539fb>] invoke_softirq kernel/softirq.c:365 [inline]
softirqs last disabled at (160899): [<ffffffffb45539fb>] irq_exit+0x19b/0x1c0 kernel/softirq.c:405
CPU: 1 PID: 2773 Comm: syz-fuzzer Not tainted 4.17.0-rc1+ #34
Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS 1.10.2-1ubuntu1 04/01/2014
RIP: 0010:arch_local_irq_enable arch/x86/include/asm/paravirt.h:793 [inline]
RIP: 0010:__raw_spin_unlock_irq include/linux/spinlock_api_smp.h:168 [inline]
RIP: 0010:_raw_spin_unlock_irq+0x2b/0x40 kernel/locking/spinlock.c:192
RSP: 0018:ffff880064fff728 EFLAGS: 00000246 ORIG_RAX: ffffffffffffff13
RAX: 0000000000000007 RBX: ffffffffb8103620 RCX: 0000000000000000
RDX: 0000000000000000 RSI: 0000000000000000 RDI: ffff8800699bcd6c
RBP: 0000000000000032 R08: fffffbfff70206c5 R09: ffff8800699bcd90
R10: 0000000000000000 R11: 0000000000000000 R12: ffff880064fff778
R13: 0000000000000032 R14: 0000000000000000 R15: 0000000000000002
FS:  000000c4202eb868(0000) GS:ffff88006d100000(0000) knlGS:0000000000000000
CS:  0010 DS: 0000 ES: 0000 CR0: 0000000080050033
CR2: 000000c42bb4e0d0 CR3: 000000006bf92000 CR4: 00000000000006e0
DR0: 0000000000000000 DR1: 0000000000000000 DR2: 0000000000000000
DR3: 0000000000000000 DR6: 00000000fffe0ff0 DR7: 0000000000000400
Call Trace:
 spin_unlock_irq include/linux/spinlock.h:360 [inline]
 hpet_timer_set_irq drivers/char/hpet.c:221 [inline]
 hpet_open+0x33d/0x710 drivers/char/hpet.c:293
 misc_open+0x35f/0x4d0 drivers/char/misc.c:154
 chrdev_open+0x21f/0x6b0 fs/char_dev.c:417
 do_dentry_open+0x65c/0xe70 fs/open.c:784
 vfs_open+0x11c/0x200 fs/open.c:906
 do_last fs/namei.c:3365 [inline]
 path_openat+0xb1f/0x3320 fs/namei.c:3500
 do_filp_open+0x255/0x380 fs/namei.c:3535
 do_sys_open+0x4b0/0x640 fs/open.c:1093
 do_syscall_64+0x148/0x5d0 arch/x86/entry/common.c:287
Code: 53 48 8b 54 24 08 48 89 fb 48 8d 7f 18 be 01 00 00 00 e8 09 53 75 fd 48 89 df e8 c1 51 76 fd e8 4c e9 74 fd fb 66 0f 1f 44 00 00 <65> ff 0d be 06 0f 49 5b c3 66 90 66 2e 0f 1f 84 00 00 00 00 00 
INFO: rcu_sched self-detected stall on CPU
	1-...!: (1 GPs behind) idle=2e6/1/4611686018427387906 softirq=27263/27266 fqs=0 
	 (t=343249 jiffies g=6526 c=6525 q=52)
rcu_sched kthread starved for 343249 jiffies! g6526 c6525 f0x0 RCU_GP_WAIT_FQS(3) ->state=0x402 ->cpu=0
RCU grace-period kthread stack dump:
rcu_sched       I20568     9      2 0x80000000
Call Trace:
INFO: rcu_sched detected stalls on CPUs/tasks:
 schedule+0xf0/0x3a0 kernel/sched/core.c:3549
 schedule_timeout+0x113/0x210 kernel/time/timer.c:1801
 rcu_gp_kthread+0xf20/0x3a00 kernel/rcu/tree.c:2231
 kthread+0x32b/0x3f0 kernel/kthread.c:238
 ret_from_fork+0x3a/0x50 arch/x86/entry/entry_64.S:412
NMI backtrace for cpu 1
CPU: 1 PID: 2773 Comm: syz-fuzzer Tainted: G             L    4.17.0-rc1+ #34
Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS 1.10.2-1ubuntu1 04/01/2014
Call Trace:
 <IRQ>
 __dump_stack lib/dump_stack.c:77 [inline]
 dump_stack+0x11b/0x1fd lib/dump_stack.c:113
 nmi_cpu_backtrace.cold.2+0x19/0x5d lib/nmi_backtrace.c:103
 </IRQ>
	0-...!: (1 GPs behind) idle=1a6/1/4611686018427387906 softirq=37557/37559 fqs=53 
	(detected by 0, t=232 jiffies, g=6527, c=6526, q=315)
NMI backtrace for cpu 0
CPU: 0 PID: 2765 Comm: syz-fuzzer Tainted: G             L    4.17.0-rc1+ #34
Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS 1.10.2-1ubuntu1 04/01/2014
Call Trace:
 <IRQ>
 __dump_stack lib/dump_stack.c:77 [inline]
 dump_stack+0x11b/0x1fd lib/dump_stack.c:113
 nmi_cpu_backtrace.cold.2+0x19/0x5d lib/nmi_backtrace.c:103
 </IRQ>
```

I'll update a post later...

**End**
