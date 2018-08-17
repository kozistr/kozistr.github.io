---
layout: post
title: LK v4.16.x - mon_bin_read - possible deadlock
author: zer0day
categories: lk
---

mon_bin_read - possible circular locking dependency detected

posted & found by [zer0day](https://kozistr.github.io/)

## tl;dr

Got from syzkaller & Found in LK v4.16.0. Maybe, this post is similar with the past post (mon_bin_vma... stuff...).

## Call Trace (Dump)

Here's a syzkaller report.

```c
WARNING: possible circular locking dependency detected
4.16.0+ #28 Not tainted
------------------------------------------------------
syz-executor3/12637 is trying to acquire lock:
00000000548b0ec6 (&mm->mmap_sem){++++}, at: __might_fault+0xd4/0x1b0 mm/memory.c:4571

but task is already holding lock:
00000000edee7e51 (&rp->fetch_lock){+.+.}, at: mon_bin_read+0x5e/0x5f0 drivers/usb/mon/mon_bin.c:813

which lock already depends on the new lock.


the existing dependency chain (in reverse order) is:

-> #1 (&rp->fetch_lock){+.+.}:

-> #0 (&mm->mmap_sem){++++}:

other info that might help us debug this:

 Possible unsafe locking scenario:

       CPU0                    CPU1
       ----                    ----
  lock(&rp->fetch_lock);
                               lock(&mm->mmap_sem);
                               lock(&rp->fetch_lock);
  lock(&mm->mmap_sem);

 *** DEADLOCK ***

1 lock held by syz-executor3/12637:
 #0: 00000000edee7e51 (&rp->fetch_lock){+.+.}, at: mon_bin_read+0x5e/0x5f0 drivers/usb/mon/mon_bin.c:813

stack backtrace:
CPU: 0 PID: 12637 Comm: syz-executor3 Not tainted 4.16.0+ #28
Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS 1.10.2-1ubuntu1 04/01/2014
Call Trace:
 __dump_stack lib/dump_stack.c:17 [inline]
 dump_stack+0x11b/0x201 lib/dump_stack.c:53
 print_circular_bug.isra.33+0x3fe/0x437 kernel/locking/lockdep.c:1223
 check_prev_add kernel/locking/lockdep.c:1863 [inline]
 check_prevs_add kernel/locking/lockdep.c:1976 [inline]
 validate_chain kernel/locking/lockdep.c:2417 [inline]
 __lock_acquire.cold.54+0x5b3/0x90e kernel/locking/lockdep.c:3431
unregister_netdevice: waiting for lo to become free. Usage count = 3
```

**End**
