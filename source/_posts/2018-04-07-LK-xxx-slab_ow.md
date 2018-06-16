---
layout: post
title: LK v4.16.x - xxx - slab overwritten
comments: true
---

xxx - slab padding overwritten

posted & found by [zer0day](https://kozistr.github.io/)

## tl;dr

Got from syzkaller & Found in *LK v4.16.0*. 

Just another slab stuffs... I didn't analyze yet.

## Call Trace (Dump)

```c
[  232.959395] BUG selinux_file_security (Not tainted): Padding overwritten. 0x00000000ee4aa18f-0x000000003704f4a5
[  232.960284] -----------------------------------------------------------------------------
[  232.960284] 
[  232.961111] Disabling lock debugging due to kernel taint
[  232.961552] INFO: Slab 0x00000000a9c66b55 objects=22 used=22 fp=0x          (null) flags=0x100000000008101
[  232.962383] CPU: 0 PID: 12841 Comm: syz-executor7 Tainted: G    B            4.16.0+ #28
[  232.963070] Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS 1.10.2-1ubuntu1 04/01/2014
[  232.963773] Call Trace:
[  232.964002]  dump_stack+0x11b/0x201
[  232.964294]  ? dma_direct_map_sg+0x26f/0x26f
[  232.964642]  slab_err+0xab/0xcf
[  232.964931]  ? memchr_inv+0x264/0x330
[  232.965242]  slab_pad_check.part.45.cold.81+0x23/0x75
[  232.965664]  ? check_slab+0xa4/0xd0
[  232.965962]  ? free_debug_processing+0x1f7/0x270
[  232.966343]  ? qlist_free_all+0x32/0xc0
[  232.966656]  ? __slab_free+0x241/0x390
[  232.966974]  ? mark_held_locks+0xa8/0xf0
[  232.967296]  ? _raw_spin_unlock_irqrestore+0x46/0x60
[  232.967698]  ? qlist_free_all+0x32/0xc0
[  232.968041]  ? qlist_free_all+0x32/0xc0
[  232.968360]  ? qlist_free_all+0x47/0xc0
[  232.968676]  ? quarantine_reduce+0x166/0x1a0
[  232.969032]  ? kasan_kmalloc+0x95/0xe0
[  232.969342]  ? __pmd_alloc+0x8c/0x4d0
[  232.969644]  ? kmem_cache_alloc+0xde/0x2a0
[  232.969989]  ? __pmd_alloc+0x8c/0x4d0
[  232.970312]  ? __pud_alloc+0x187/0x240
[  232.970639]  ? __handle_mm_fault+0x12e5/0x3210
[  232.971040]  ? debug_check_no_locks_freed+0x210/0x210
[  232.971451]  ? vm_insert_mixed_mkwrite+0x30/0x30
[  232.971821]  ? deref_stack_reg+0xab/0x110
[  232.972188]  ? update_curr+0x30f/0xa60
[  232.972496]  ? nohz_balance_exit_idle.part.84+0x3d0/0x3d0
[  232.972953]  ? print_usage_bug+0x140/0x140
[  232.973299]  ? rcu_process_callbacks+0x25b0/0x25b0
[  232.973690]  ? __save_stack_trace+0x7d/0xf0
[  232.974105]  ? follow_huge_addr+0x5/0x10
[  232.974537]  ? follow_page_mask+0x129/0x14f0
[  232.975006]  ? save_trace+0x300/0x300
[  232.975428]  ? save_trace+0x300/0x300
[  232.975864]  ? gup_pgd_range+0x2430/0x2430
[  232.976380]  ? pick_next_task_fair+0xf17/0x1770
[  232.976894]  ? save_trace+0x300/0x300
[  232.977297]  ? __lock_is_held+0xad/0x140
[  232.977741]  ? handle_mm_fault+0x12e/0x390
[  232.978215]  ? __get_user_pages+0x619/0x13f0
[  232.978720]  ? follow_page_mask+0x14f0/0x14f0
[  232.979226]  ? _raw_spin_unlock_irq+0x24/0x40
[  232.979730]  ? finish_task_switch+0x186/0x750
[  232.980240]  ? set_load_weight+0x270/0x270
[  232.980690]  ? lock_repin_lock+0x410/0x410
[  232.981041]  ? __schedule+0x752/0x1d10
[  232.981407]  ? rcu_is_watching+0x81/0x130
[  232.981741]  ? __lock_is_held+0xad/0x140
[  232.982072]  ? get_user_pages_remote+0x1fe/0x3b0
[  232.982447]  ? copy_strings.isra.24+0x352/0xc10
[  232.982809]  ? remove_arg_zero+0x5c0/0x5c0
[  232.983158]  ? fsnotify+0x3b0/0x11a0
[  232.983531]  ? fsnotify_first_mark+0x2c0/0x2c0
[  232.983940]  ? vfs_read+0x15f/0x330
[  232.984224]  ? kernel_read+0xa6/0x110
[  232.984523]  ? prepare_binprm+0x654/0x8d0
[  232.984855]  ? install_exec_creds+0x160/0x160
[  232.985209]  ? copy_strings_kernel+0xa0/0x110
[  232.985562]  ? do_execveat_common.isra.33+0x120c/0x2320
[  232.985998]  ? __do_page_fault+0xb70/0xb70
[  232.986415]  ? prepare_bprm_creds+0x110/0x110
[  232.986857]  ? deactivate_slab.isra.67+0x47c/0x5b0
[  232.987210]  ? retint_kernel+0x10/0x10
[  232.987494]  ? trace_hardirqs_on_thunk+0x1a/0x1c
[  232.987831]  ? __do_page_fault+0x39a/0xb70
[  232.988181]  ? retint_kernel+0x10/0x10
[  232.988468]  ? strncpy_from_user+0x172/0x400
[  232.988854]  ? strncpy_from_user+0x2f1/0x400
[  232.989296]  ? rcu_pm_notify+0xc0/0xc0
[  232.989656]  ? mpi_free.cold.1+0x21/0x21
[  232.990012]  ? rcu_read_lock_sched_held+0xe4/0x120
[  232.990402]  ? getname_flags+0x24d/0x560
[  232.990741]  ? SyS_execve+0x34/0x40
[  232.991069]  ? compat_SyS_execveat+0x60/0x60
[  232.991426]  ? do_syscall_64+0x23e/0x7a0
[  232.991740]  ? _raw_spin_unlock_irq+0x24/0x40
[  232.992121]  ? finish_task_switch+0x1c7/0x750
[  232.992480]  ? syscall_return_slowpath+0x470/0x470
[  232.992882]  ? syscall_return_slowpath+0x2df/0x470
[  232.993265]  ? prepare_exit_to_usermode+0x330/0x330
[  232.993644]  ? retint_user+0x18/0x18
[  232.993927]  ? async_page_fault+0x2f/0x50
[  232.994223]  ? trace_hardirqs_off_thunk+0x1a/0x1c
[  232.994576]  ? entry_SYSCALL_64_after_hwframe+0x42/0xb7
[  232.994971] Padding 00000000ee4aa18f: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
[  232.995651] Padding 000000009a3fbdea: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
[  232.996335] Padding 0000000092deced6: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
[  232.997092] Padding 00000000c723a940: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
[  232.997825] Padding 000000007de31a44: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
[  232.998536] Padding 0000000097ccfd3f: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
[  232.999221] FIX selinux_file_security: Restoring 0x00000000ee4aa18f-0x000000003704f4a5=0x5a
```

**End**