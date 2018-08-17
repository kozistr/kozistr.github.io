---
layout: post
title: LK v4.16.x - kernfs_get - warn
author: zer0day
categories: lk
---

kernfs_get - warn

posted & found by [zer0day](https://kozistr.github.io/)

## tl;dr

Found in *LK v4.16.0-rc6*.

## Call Trace (Dump)

```c
[   58.664584] Call Trace:
[   58.664825]  dump_stack+0x10a/0x1dd
[   58.665129]  ? _atomic_dec_and_lock+0x163/0x163
[   58.665539]  ? kernfs_get+0x40/0x130
[   58.665857]  panic+0x1b3/0x3a4
[   58.666129]  ? add_taint.cold.3+0x16/0x16
[   58.666486]  ? __warn.cold.6+0x17c/0x1a4
[   58.666867]  ? kernfs_get+0x10c/0x130
[   58.667180]  __warn.cold.6+0x197/0x1a4
[   58.667524]  ? kernfs_get+0x10c/0x130
[   58.667838]  ? report_bug+0x1fb/0x270
[   58.668154]  ? fixup_bug.part.9+0x32/0x80
[   58.668506]  ? do_error_trap+0x28c/0x360
[   58.668840]  ? lock_acquire+0x4a0/0x4a0
[   58.669178]  ? do_general_protection+0x310/0x310
[   58.669601]  ? do_raw_spin_trylock+0x190/0x190
[   58.670012]  ? __lock_is_held+0xad/0x140
[   58.670450]  ? trace_hardirqs_off_thunk+0x1a/0x1c
[   58.670858]  ? invalid_op+0x1b/0x40
[   58.671198]  ? kernfs_get+0x10c/0x130
[   58.671519]  ? kernfs_get+0x10c/0x130
[   58.671833]  ? kernfs_evict_inode+0x60/0x60
[   58.672203]  ? kernfs_path_from_node+0x60/0x60
[   58.672584]  ? __kernfs_remove+0x277/0xa60
[   58.672948]  ? kernfs_dir_fop_release+0x40/0x40
[   58.673346]  ? save_trace+0x300/0x300
[   58.673653]  ? __kmem_cache_create+0x14b/0x480
[   58.674075]  ? save_trace+0x300/0x300
[   58.674402]  ? __lock_is_held+0xad/0x140
[   58.674731]  ? kernfs_name_hash+0xad/0xe0
[   58.675113]  ? kernfs_remove_by_name_ns+0x4f/0xb0
[   58.675503]  ? sysfs_slab_add+0x172/0x230
[   58.675867]  ? __kmem_cache_create+0x234/0x480
[   58.676291]  ? kmem_cache_alloc+0x262/0x2a0
[   58.676697]  ? kmem_cache_create_usercopy+0x266/0x390
[   58.677199]  ? kmem_cache_create+0xd/0x10
[   58.677547]  ? hashtab_cache_init+0x20/0x30
[   58.677992]  ? security_load_policy+0x1c6/0xec0
[   58.678385]  ? security_get_bools+0x620/0x620
[   58.678786]  ? __alloc_pages_nodemask+0x91e/0xbe0
[   58.679196]  ? save_trace+0x300/0x300
[   58.679517]  ? save_trace+0x300/0x300
[   58.679897]  ? __vmalloc_node_range+0x1af/0x6d0
[   58.680324]  ? save_trace+0x300/0x300
[   58.680700]  ? find_held_lock+0x32/0x1b0
[   58.681089]  ? __might_fault+0x104/0x1b0
[   58.681508]  ? lock_acquire+0x4a0/0x4a0
[   58.681837]  ? lock_downgrade+0x6e0/0x6e0
[   58.682264]  ? __might_fault+0x177/0x1b0
[   58.682620]  ? sel_write_load+0x244/0x1620
[   58.683039]  ? perf_trace_lock_acquire+0xeb/0x930
[   58.683472]  ? sel_read_bool+0x240/0x240
[   58.683818]  ? __lock_is_held+0xad/0x140
[   58.684224]  ? rcu_note_context_switch+0x710/0x710
[   58.684648]  ? lock_acquire+0x4a0/0x4a0
[   58.685009]  ? save_trace+0x300/0x300
[   58.685379]  ? _cond_resched+0x10/0x20
[   58.685730]  ? __inode_security_revalidate+0xd5/0x130
[   58.686159]  ? avc_policy_seqno+0x5/0x10
[   58.686522]  ? selinux_file_permission+0x79/0x440
[   58.686927]  ? security_file_permission+0x82/0x1d0
[   58.687375]  ? do_iter_write+0x3c3/0x530
[   58.687722]  ? rcu_sync_lockdep_assert+0x69/0xa0
[   58.688164]  ? __sb_start_write+0x1ff/0x290
[   58.688609]  ? vfs_writev+0x1d3/0x330
[   58.688968]  ? rcutorture_record_progress+0x10/0x10
[   58.689403]  ? vfs_iter_write+0xa0/0xa0
[   58.689731]  ? __fd_install+0x290/0x6e0
[   58.690062]  ? __fget_light+0x28c/0x3a0
[   58.690450]  ? fget_raw+0x20/0x20
[   58.690746]  ? rcu_pm_notify+0xc0/0xc0
[   58.691081]  ? SyS_futex+0x261/0x31e
[   58.691432]  ? SyS_futex+0x26a/0x31e
[   58.691787]  ? do_pwritev+0x190/0x220
[   58.692146]  ? do_writev+0x2a0/0x2a0
[   58.692501]  ? security_file_ioctl+0x76/0xb0
[   58.692906]  ? do_syscall_64+0xb0/0x7a0
[   58.693311]  ? SyS_preadv2+0x70/0x70
[   58.693646]  ? do_syscall_64+0x23e/0x7a0
[   58.694019]  ? _raw_spin_unlock_irq+0x24/0x40
[   58.694405]  ? finish_task_switch+0x1c2/0x740
[   58.694805]  ? syscall_return_slowpath+0x470/0x470
[   58.695229]  ? syscall_return_slowpath+0x2df/0x470
[   58.695687]  ? prepare_exit_to_usermode+0x330/0x330
[   58.696143]  ? entry_SYSCALL_64_after_hwframe+0x52/0xb7
[   58.696603]  ? trace_hardirqs_off_thunk+0x1a/0x1c
[   58.697010]  ? entry_SYSCALL_64_after_hwframe+0x42/0xb7
[   58.697669] Dumping ftrace buffer:
[   58.698098]    (ftrace buffer empty)
[   58.698417] Kernel Offset: 0x23000000 from 0xffffffff81000000 (relocation range: 0xffffffff80000000-0xffffffffbfffffff)
[   58.699323] Rebooting in 86400 seconds..
```

## Code

In  ```fs/kernfs/dir.c Line 494```.

```c
/**
 * kernfs_get - get a reference count on a kernfs_node
 * @kn: the target kernfs_node
 */
void kernfs_get(struct kernfs_node *kn)
{
	if (kn) {
		WARN_ON(!atomic_read(&kn->count));
		atomic_inc(&kn->count);
	}
}
```

**End**
