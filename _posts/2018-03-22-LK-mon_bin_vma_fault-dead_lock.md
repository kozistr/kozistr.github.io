---
layout: post
title: LK v4.16.x - mon_bin_vma_fault - dead lock
author: zer0day
categories: lk
---

mon_bin_vma_fault - dead lock

posted & found by [zer0day](https://kozistr.github.io/)

## tl;dr

Got from syzkaller & Found in *LK v4.16.0-rc6*.

## Call Trace (Dump)

```c
[  105.403185] WARNING: possible circular locking dependency detected
[  105.403862] 4.16.0-rc6+ #21 Not tainted
[  105.404291] ------------------------------------------------------
[  105.404959] syz-executor4/18491 is trying to acquire lock:
[  105.405516]  (&rp->fetch_lock){+.+.}, at: [<000000004f37fa18>] mon_bin_vma_fault+0xc9/0x3b0
[  105.406243] 
[  105.406243] but task is already holding lock:
[  105.406727]  (&mm->mmap_sem){++++}, at: [<00000000106c8ac7>] __mm_populate+0x29e/0x410
[  105.407392] 
[  105.407392] which lock already depends on the new lock.
[  105.407392] 
[  105.408085] 
[  105.408085] the existing dependency chain (in reverse order) is:
[  105.408707] 
[  105.408707] -> #1 (&mm->mmap_sem){++++}:
[  105.409322] 
[  105.409322] -> #0 (&rp->fetch_lock){+.+.}:
[  105.409916] 
[  105.409916] other info that might help us debug this:
[  105.409916] 
[  105.410766]  Possible unsafe locking scenario:
[  105.410766] 
[  105.411313]        CPU0                    CPU1
[  105.411807]        ----                    ----
[  105.412296]   lock(&mm->mmap_sem);
[  105.412672]                                lock(&rp->fetch_lock);
[  105.413300]                                lock(&mm->mmap_sem);
[  105.413944]   lock(&rp->fetch_lock);
[  105.414286] 
[  105.414286]  *** DEADLOCK ***
[  105.414286] 
[  105.414844] 1 lock held by syz-executor4/18491:
[  105.415306]  #0:  (&mm->mmap_sem){++++}, at: [<00000000106c8ac7>] __mm_populate+0x29e/0x410
[  105.416133] 
[  105.416133] stack backtrace:
[  105.416577] CPU: 0 PID: 18491 Comm: syz-executor4 Not tainted 4.16.0-rc6+ #21
[  105.417270] Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS 1.10.2-1ubuntu1 04/01/2014
[  105.418181] Call Trace:
[  105.418455]  dump_stack+0x10a/0x1dd
[  105.418872]  ? _atomic_dec_and_lock+0x163/0x163
[  105.419324]  ? __mm_populate+0x29e/0x410
[  105.419714]  ? __mm_populate+0x29e/0x410
[  105.420105]  print_circular_bug.isra.33+0x3fe/0x437
[  105.420588]  ? print_circular_bug_header+0x11b/0x11b
[  105.421073]  ? find_usage_backwards+0x30/0x30
[  105.421504]  __lock_acquire.cold.54+0x57b/0x8e4
[  105.421945]  ? lock_acquire+0x4a0/0x4a0
[  105.422341]  ? debug_check_no_locks_freed+0x210/0x210
[  105.422836]  ? set_next_entity+0x10c9/0x2d80
[  105.423255]  ? __lock_is_held+0xad/0x140
[  105.423647]  ? reweight_entity+0xfe0/0xfe0
[  105.424059]  ? print_usage_bug+0x140/0x140
[  105.424495]  ? put_prev_task_fair+0x70/0x70
[  105.424909]  ? __lock_acquire+0x911/0x4670
[  105.425323]  ? task_tick_fair+0x1ff0/0x1ff0
[  105.425731]  ? dequeue_task_fair+0x1586/0x3730
[  105.426169]  ? debug_check_no_locks_freed+0x210/0x210
[  105.426671]  ? perf_trace_lock_acquire+0xeb/0x930
[  105.427128]  ? __lock_acquire+0x911/0x4670
[  105.427540]  ? put_prev_task_fair+0x70/0x70
[  105.427950]  ? perf_trace_lock+0x950/0x950
[  105.428364]  ? debug_check_no_locks_freed+0x210/0x210
[  105.428856]  ? save_trace+0x300/0x300
[  105.429232]  ? print_usage_bug+0x140/0x140
[  105.429640]  ? print_usage_bug+0x140/0x140
[  105.430041]  ? print_usage_bug+0x140/0x140
[  105.430470]  ? lock_acquire+0x1a5/0x4a0
[  105.430868]  ? mon_bin_vma_fault+0xc9/0x3b0
[  105.431298]  ? lock_downgrade+0x6e0/0x6e0
[  105.431705]  ? mon_bin_vma_fault+0xc9/0x3b0
[  105.432099]  ? rcu_note_context_switch+0x710/0x710
[  105.432560]  ? print_usage_bug+0x140/0x140
[  105.432962]  ? mon_bin_vma_fault+0xc9/0x3b0
[  105.433374]  ? __mutex_lock+0x178/0x19d0
[  105.433757]  ? mon_bin_vma_fault+0xc9/0x3b0
[  105.434181]  ? check_chain_key+0x3c0/0x3c0
[  105.434588]  ? mon_bin_vma_fault+0xc9/0x3b0
[  105.434998]  ? __lock_acquire+0x911/0x4670
[  105.435420]  ? mark_held_locks+0xa8/0xf0
[  105.435807]  ? mutex_lock_io_nested+0x1830/0x1830
[  105.436311]  ? print_usage_bug+0x140/0x140
[  105.436733]  ? print_usage_bug+0x140/0x140
[  105.437152]  ? debug_check_no_locks_freed+0x210/0x210
[  105.437636]  ? __page_frag_cache_drain+0x1b0/0x1b0
[  105.438105]  ? print_usage_bug+0x140/0x140
[  105.438515]  ? deref_stack_reg+0xab/0x110
[  105.438909]  ? __read_once_size_nocheck.constprop.8+0x10/0x10
[  105.439478]  ? print_usage_bug+0x140/0x140
[  105.439879]  ? print_usage_bug+0x140/0x140
[  105.440283]  ? print_usage_bug+0x140/0x140
[  105.440695]  ? unwind_next_frame+0x11c2/0x1d10
[  105.441137]  ? __save_stack_trace+0x59/0xf0
[  105.441553]  ? print_usage_bug+0x140/0x140
[  105.441970]  ? __lock_acquire+0x911/0x4670
[  105.442349]  ? debug_check_no_locks_freed+0x210/0x210
[  105.442867]  ? debug_check_no_locks_freed+0x210/0x210
[  105.443368]  ? _cond_resched+0x10/0x20
[  105.443753]  ? mon_bin_vma_fault+0xc9/0x3b0
[  105.444176]  ? mon_bin_vma_fault+0xc9/0x3b0
[  105.444594]  ? mon_alloc_buff+0x200/0x200
[  105.444997]  ? print_usage_bug+0x140/0x140
[  105.445434]  ? __lock_acquire+0x911/0x4670
[  105.445869]  ? debug_check_no_locks_freed+0x210/0x210
[  105.446330]  ? __do_fault+0xe2/0x380
[  105.446696]  ? print_bad_pte+0x5d0/0x5d0
[  105.447078]  ? debug_check_no_locks_freed+0x210/0x210
[  105.447555]  ? debug_check_no_locks_freed+0x210/0x210
[  105.448060]  ? unlink_anon_vmas+0x3e2/0x920
[  105.448485]  ? unlink_anon_vmas+0x1ef/0x920
[  105.448910]  ? __handle_mm_fault+0x1206/0x31b0
[  105.449347]  ? vm_insert_mixed_mkwrite+0x30/0x30
[  105.449804]  ? __lock_acquire+0x911/0x4670
[  105.450208]  ? perf_trace_lock+0x950/0x950
[  105.450622]  ? debug_check_no_locks_freed+0x210/0x210
[  105.451104]  ? perf_trace_lock_acquire+0xeb/0x930
[  105.451534]  ? perf_trace_lock_acquire+0xeb/0x930
[  105.452029]  ? pud_huge+0x5c/0xc0
[  105.452346]  ? pmd_huge+0xe0/0xe0
[  105.452710]  ? perf_trace_lock_acquire+0xeb/0x930
[  105.453303]  ? follow_page_mask+0x129/0x14c0
[  105.453825]  ? save_trace+0x300/0x300
[  105.454194]  ? perf_trace_lock+0x950/0x950
[  105.454546]  ? save_trace+0x300/0x300
[  105.454886]  ? gup_pgd_range+0x22f0/0x22f0
[  105.455241]  ? save_trace+0x300/0x300
[  105.455556]  ? save_trace+0x300/0x300
[  105.455891]  ? save_stack+0x89/0xb0
[  105.456174]  ? __lock_is_held+0xad/0x140
[  105.456489]  ? handle_mm_fault+0x12e/0x390
[  105.456852]  ? __get_user_pages+0x619/0x13e0
[  105.457202]  ? follow_page_mask+0x14c0/0x14c0
[  105.457557]  ? vma_set_page_prot+0x155/0x220
[  105.457943]  ? vma_wants_writenotify+0x430/0x430
[  105.458291]  ? __mm_populate+0x29e/0x410
[  105.458587]  ? lock_downgrade+0x6e0/0x6e0
[  105.459002]  ? rcu_note_context_switch+0x710/0x710
[  105.459481]  ? populate_vma_page_range+0x201/0x2f0
[  105.459953]  ? get_user_pages_unlocked+0x4a0/0x4a0
[  105.460427]  ? vmacache_find+0x58/0x270
[  105.460810]  ? vmacache_update+0xc9/0x120
[  105.461206]  ? __mm_populate+0x222/0x410
[  105.461589]  ? populate_vma_page_range+0x2f0/0x2f0
[  105.462022]  ? security_mmap_file+0x13b/0x170
[  105.462393]  ? vm_mmap_pgoff+0x226/0x260
[  105.462784]  ? vma_is_stack_for_current+0xb0/0xb0
[  105.463147]  ? SyS_futex+0x261/0x31e
[  105.463425]  ? SyS_futex+0x26a/0x31e
[  105.463753]  ? SyS_mmap_pgoff+0x445/0x5c0
[  105.464159]  ? find_mergeable_anon_vma+0xc0/0xc0
[  105.464608]  ? security_file_ioctl+0x76/0xb0
[  105.465034]  ? do_syscall_64+0xb0/0x7a0
[  105.465410]  ? align_vdso_addr+0x50/0x50
[  105.465808]  ? do_syscall_64+0x23e/0x7a0
[  105.466196]  ? exit_to_usermode_loop+0x181/0x1e0
[  105.466645]  ? _raw_spin_unlock_irq+0x24/0x40
[  105.467082]  ? syscall_return_slowpath+0x470/0x470
[  105.467555]  ? syscall_return_slowpath+0x2df/0x470
[  105.468055]  ? entry_SYSCALL_64_after_hwframe+0x52/0xb7
[  105.468561]  ? trace_hardirqs_off_thunk+0x1a/0x1c
[  105.469029]  ? entry_SYSCALL_64_after_hwframe+0x42/0xb7
```

**End**
