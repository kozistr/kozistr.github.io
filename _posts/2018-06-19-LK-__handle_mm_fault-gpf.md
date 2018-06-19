---
layout: post
title: LK v4.17.x - __handle_mm_fault - general page fault
comments: true
---

__handle_mm_fault - general page fault

posted & found by [zer0day](https://kozistr.github.io/)

## tl;dr

Found on LK v4.17.0+. leaded to null-dereference. Not analyzed yet...

## Call Trace (Dump)

Here's a report.

```c
[  387.942047] kasan: CONFIG_KASAN_INLINE enabled
[  387.943245] kasan: GPF could be caused by NULL-ptr deref or user memory access
[  387.944498] general protection fault: 0000 [#1] SMP KASAN PTI
[  387.945408] CPU: 0 PID: 2898 Comm: poc Not tainted 4.17.0+ #9
[  387.946810] Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS 1.10.2-1ubuntu1 04/01/2014
[  387.948388] RIP: 0010:__handle_mm_fault+0x7c6/0x3eb0
[  387.949421] Code: 00 00 00 00 00 fc ff df 48 89 fa 48 c1 ea 03 80 3c 02 00 0f 85 b6 2e 00 00 48 b8 00 00 00 00 00 fc ff df 4c 89 fa 48 c1 ea 03 <80> 3c 02 00 0f 85 a5 2e 00 00 49 8b 07 48 89 84 24 d0 00 00 00 48
[  387.953249] RSP: 0000:ffff880048457728 EFLAGS: 00010206
[  387.954442] RAX: dffffc0000000000 RBX: ffff8800484577c8 RCX: ffffffffaff47487
[  387.956002] RDX: 000181014000907b RSI: 0000000000000000 RDI: ffff8800484577f8
[  387.957588] RBP: 1ffff1000908aeed R08: ffff880066e4c2c0 R09: 0000000000000000
[  387.959145] R10: 0000000000000001 R11: 0000000000000001 R12: ffff8800000003d8
[  387.960709] R13: ffffffffb33e97e0 R14: 000ffffffffff000 R15: 000c080a000483d8
[  387.961896] kasan: CONFIG_KASAN_INLINE enabled
[  387.962193] FS:  000000c4238aa468(0000) GS:ffff88006d000000(0000) knlGS:0000000000000000
[  387.962199] CS:  0010 DS: 0000 ES: 0000 CR0: 0000000080050033
[  387.962204] CR2: 000000000047b544 CR3: 000000006af1e000 CR4: 00000000000006f0
[  387.962214] DR0: 0000000020000000 DR1: 0000000020000000 DR2: 0000000000000000
[  387.962892] kasan: GPF could be caused by NULL-ptr deref or user memory access
[  387.964386] DR3: 0000000000000000 DR6: 00000000ffff0ff0 DR7: 0000000000000600
[  387.964390] Call Trace:
[  387.964406]  ? __mark_inode_dirty+0x41c/0x1570
[  387.964441]  ? vmf_insert_mixed_mkwrite+0x90/0x90
[  387.964455]  ? find_held_lock+0x33/0x1b0
[  387.973075]  ? mark_held_locks+0xc1/0x140
[  387.973718]  ? ktime_get_coarse_real_ts64+0x1a8/0x230
[  387.974602]  ? save_trace+0x300/0x300
[  387.975738]  ? timespec_trunc+0xea/0x180
[  387.976498]  ? compat_put_timespec64+0x1a0/0x1a0
[  387.977383]  ? do_raw_spin_unlock+0xac/0x310
[  387.978225]  ? find_held_lock+0x33/0x1b0
[  387.978990]  ? pipe_write+0xaf9/0xeb0
[  387.979706]  ? check_flags.part.37+0x420/0x420
[  387.980561]  ? __lock_is_held+0xad/0x140
[  387.981324]  ? lock_acquire+0x1b3/0x4a0
[  387.981919]  ? __do_page_fault+0x3e6/0xe30
[  387.982832]  ? save_trace+0x300/0x300
[  387.983662]  ? __lock_acquire+0x4f90/0x4f90
[  387.984614]  ? __vfs_write+0xfa/0x890
[  387.985448]  ? __lock_is_held+0xad/0x140
[  387.986351]  ? handle_mm_fault+0x15a/0x410
[  387.987265]  ? find_vma+0x2d/0x170
[  387.988039]  ? __do_page_fault+0x672/0xe30
[  387.988952]  ? mm_fault_error+0x360/0x360
[  387.989846]  ? ksys_write+0x192/0x240
[  387.990665]  ? async_page_fault+0x8/0x30
[  387.991531]  ? do_page_fault+0xc1/0x720
[  387.992378]  ? do_syscall_64+0x8d/0x670
[  387.993220]  ? __do_page_fault+0xe30/0xe30
[  387.994144]  ? do_syscall_64+0x488/0x670
[  387.995020]  ? syscall_slow_exit_work+0x4d0/0x4d0
[  387.996072]  ? syscall_return_slowpath+0x4e0/0x4e0
[  387.997150]  ? syscall_return_slowpath+0x342/0x4e0
[  387.998154]  ? entry_SYSCALL_64_after_hwframe+0x59/0xbe
[  387.999002]  ? async_page_fault+0x8/0x30
[  387.999685]  ? trace_hardirqs_off_thunk+0x1a/0x1c
[  388.000574]  ? async_page_fault+0x8/0x30
[  388.001180]  ? async_page_fault+0x1e/0x30
```

## Code

Skip!

**End**
