---
layout: post
title: LK v4.16.x - seq_read - deadlock
comments: true
---

seq_read - possible circular locking (leading to deadlock)

posted & found by [zer0day](https://kozistr.github.io/)

## tl;dr

I'll just add a Call Trace (Dump) only because it isn't important as well and the dump will explain sufficiently :).

## Call Trace (Dump)

```c
WARNING: possible circular locking dependency detected
4.16.0-rc1+ #15 Not tainted
------------------------------------------------------
syz-executor2/10621 is trying to acquire lock:
 (&p->lock){+.+.}, at: [<00000000dad12130>] seq_read+0x51/0x560 fs/seq_file.c:165

but task is already holding lock:
 (&pipe->mutex/1){+.+.}, at: [<000000009e27b116>] pipe_lock_nested fs/pipe.c:62 [inline]
 (&pipe->mutex/1){+.+.}, at: [<000000009e27b116>] pipe_lock+0x25/0x30 fs/pipe.c:70

which lock already depends on the new lock.


the existing dependency chain (in reverse order) is:

-> #2 (&pipe->mutex/1){+.+.}:
       __pipe_lock fs/pipe.c:83 [inline]
       fifo_open+0x77/0x3c0 fs/pipe.c:921
       do_dentry_open+0x276/0x400 fs/open.c:752
       vfs_open+0x5d/0xb0 fs/open.c:866
       do_last fs/namei.c:3378 [inline]
       path_openat+0x25b/0x1040 fs/namei.c:3518
       do_filp_open+0xb9/0x150 fs/namei.c:3553
       do_open_execat+0xa6/0x200 fs/exec.c:849
       do_execveat_common.isra.32+0x33d/0xbb0 fs/exec.c:1740
       do_execve fs/exec.c:1847 [inline]
       SYSC_execve fs/exec.c:1928 [inline]
       SyS_execve+0x34/0x40 fs/exec.c:1923
       do_syscall_64+0x74/0x210 arch/x86/entry/common.c:287
       entry_SYSCALL_64_after_hwframe+0x26/0x9b

-> #1 (&sig->cred_guard_mutex){+.+.}:
       lock_trace+0x1f/0x70 fs/proc/base.c:408
       proc_pid_stack+0x73/0x120 fs/proc/base.c:444
       proc_single_show+0x4d/0x80 fs/proc/base.c:747
       seq_read+0x10f/0x560 fs/seq_file.c:237
       __vfs_read+0x50/0x1d0 fs/read_write.c:411
       vfs_read+0xc0/0x1a0 fs/read_write.c:447
       SYSC_read fs/read_write.c:573 [inline]
       SyS_read+0x60/0xe0 fs/read_write.c:566
       do_syscall_64+0x74/0x210 arch/x86/entry/common.c:287
       entry_SYSCALL_64_after_hwframe+0x26/0x9b

-> #0 (&p->lock){+.+.}:
       __mutex_lock_common kernel/locking/mutex.c:756 [inline]
       __mutex_lock+0x7a/0x9f0 kernel/locking/mutex.c:893
       seq_read+0x51/0x560 fs/seq_file.c:165
       proc_reg_read+0x65/0xc0 fs/proc/inode.c:218
       do_loop_readv_writev fs/read_write.c:673 [inline]
       do_iter_read+0x19f/0x1f0 fs/read_write.c:897
       vfs_readv+0x96/0xe0 fs/read_write.c:959
       kernel_readv fs/splice.c:361 [inline]
       default_file_splice_read+0x241/0x3e0 fs/splice.c:416
       do_splice_to+0x8c/0xc0 fs/splice.c:880
       do_splice fs/splice.c:1173 [inline]
       SYSC_splice fs/splice.c:1402 [inline]
       SyS_splice+0x7ba/0x820 fs/splice.c:1382
       do_syscall_64+0x74/0x210 arch/x86/entry/common.c:287
       entry_SYSCALL_64_after_hwframe+0x26/0x9b

other info that might help us debug this:

Chain exists of:
  &p->lock --> &sig->cred_guard_mutex --> &pipe->mutex/1

 Possible unsafe locking scenario:

       CPU0                    CPU1
       ----                    ----
  lock(&pipe->mutex/1);
                               lock(&sig->cred_guard_mutex);
                               lock(&pipe->mutex/1);
  lock(&p->lock);

 *** DEADLOCK ***
```

Skip the Call Trace (Stack backtrace).

## PoC

Skip ~

**End**