---
layout: post
title: LK v4.15.x - spinlock recursion, deadlock
comments: true
---

spin-lock recursion bug (leading to deadlock)

posted & found by ![zer0day](https://kozistr.github.io/)

## tl;dr
There's no any recursion check on spin-lock where i found (not exact). So when executed recursively, deadlock is triggered.
It needs to check current and calling thread id so that avoiding deadlock at recursive cases.

Below is p-sudo code for the patch.
```c
# spinlock - lock

...
long recursiveLockCount = 0;
...

if(ownThreadId == calledThreadId) {
	++recursiveLockCount;
	assert(recursiveLockCount > 0);
	return;
}
...

# spinlock - unlock

...
if(recursiveLockCount) {
	assert(ownThreadId == calledThreadId);
	--recursiveLockCount;
	return;
}
...
```

But as i know, at futex(spin lock), recursive stuff cannot be implemented kinda some reasons...
So, actually i don't know this part well, my recommendation for solving deadlock problem on queue_work is using mutex instead of spin-lock at security aspect, not performance...

## Call Trace (Dump)
```c
Call Trace:
 __dump_stack lib/dump_stack.c:17 [inline]
 dump_stack+0x104/0x1c5 lib/dump_stack.c:53
 spin_bug kernel/locking/spinlock_debug.c:75 [inline]
 debug_spin_lock_before kernel/locking/spinlock_debug.c:84 [inline]
 do_raw_spin_lock+0x18c/0x1d0 kernel/locking/spinlock_debug.c:112
 rq_lock kernel/sched/sched.h:1766 [inline]
 ttwu_queue kernel/sched/core.c:1863 [inline]
 try_to_wake_up+0x98e/0x14e0 kernel/sched/core.c:2078
 wake_up_worker kernel/workqueue.c:839 [inline]
 insert_work+0x384/0x4d0 kernel/workqueue.c:1312
 __queue_work+0x537/0x1160 kernel/workqueue.c:1462
 queue_work_on+0x8f/0xa0 kernel/workqueue.c:1487
 queue_work include/linux/workqueue.h:488 [inline]
 call_usermodehelper_exec+0x2a7/0x470 kernel/umh.c:439
 call_modprobe kernel/kmod.c:99 [inline]
 __request_module+0x3ff/0xc00 kernel/kmod.c:171
 inet6_create+0xc56/0x1200 net/ipv6/af_inet6.c:156
 __sock_create+0x4c8/0x810 net/socket.c:1265
 sock_create net/socket.c:1305 [inline]
 SYSC_socket net/socket.c:1335 [inline]
 SyS_socket+0xdb/0x190 net/socket.c:1315
 entry_SYSCALL_64_fastpath+0x1f/0x96
RIP: 0033:0x4565b9
RSP: 002b:00007f85ab8b2bd8 EFLAGS: 00000216 ORIG_RAX: 0000000000000029
RAX: ffffffffffffffda RBX: 00007f85ab8b3700 RCX: 00000000004565b9
RDX: 0000000000000004 RSI: 0000000000000800 RDI: 000000000000000a
RBP: 00007ffc612e5ac0 R08: 0000000000000000 R09: 0000000000000000
R10: 0000000000000000 R11: 0000000000000216 R12: 00007ffc612e5a3e
R13: 00007ffc612e5a3f R14: 00007f85ab8b3700 R15: 00007f85ab8b39c0
```

## POC

skip!

**End**