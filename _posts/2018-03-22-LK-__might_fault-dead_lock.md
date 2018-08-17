---
layout: post
title: LK v4.16.x - __might_fault - dead lock
author: zer0day
categories: lk
---

__might_fault - dead lock

posted & found by [zer0day](https://kozistr.github.io/)

## tl;dr

Got from syzkaller & Found in *LK v4.16.0-rc6*.

## Call Trace (Dump)

```c
WARNING: possible circular locking dependency detected
4.16.0-rc6+ #21 Not tainted
------------------------------------------------------
syz-executor3/13637 is trying to acquire lock:
 (&mm->mmap_sem){++++}, at: [<0000000083693474>] __might_fault+0xd4/0x1b0 mm/memory.c:4570

but task is already holding lock:
 (&rp->fetch_lock){+.+.}, at: [<000000001f43922c>] mon_bin_read+0x5e/0x5f0 drivers/usb/mon/mon_bin.c:813

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
 
1 lock held by syz-executor3/13637:
 #0:  (&rp->fetch_lock){+.+.}, at: [<000000001f43922c>] mon_bin_read+0x5e/0x5f0 drivers/usb/mon/mon_bin.c:813

stack backtrace:
CPU: 1 PID: 13637 Comm: syz-executor3 Not tainted 4.16.0-rc6+ #21
Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS 1.10.2-1ubuntu1 04/01/2014
Call Trace:
 __dump_stack lib/dump_stack.c:17 [inline]
 dump_stack+0x10a/0x1dd lib/dump_stack.c:53
 print_circular_bug.isra.33+0x3fe/0x437 kernel/locking/lockdep.c:1223
 check_prev_add kernel/locking/lockdep.c:1863 [inline]
 check_prevs_add kernel/locking/lockdep.c:1976 [inline]
 validate_chain kernel/locking/lockdep.c:2417 [inline]
 __lock_acquire.cold.54+0x57b/0x8e4 kernel/locking/lockdep.c:3431
```

**End**
