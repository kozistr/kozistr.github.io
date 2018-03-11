---
layout: post
title: LK v4.16.x - sctp_id2assoc - uaf
comments: true
---

sctp_id2assoc - use after free

posted & found by [zer0day](https://kozistr.github.io/)

## tl;dr

Found in LK v4.16.0-rc4.

## Call Trace (Dump)

Here's a dump.

```c
[   50.782403] Call Trace:
[   50.782662]  dump_stack+0x10a/0x1dd
[   50.783020]  ? _atomic_dec_and_lock+0x163/0x163
[   50.783469]  ? show_regs_print_info+0x12/0x12
[   50.783925]  print_address_description+0x60/0x224
[   50.784395]  kasan_report+0x196/0x2a0
[   50.784758]  ? sctp_id2assoc+0x350/0x370
[   50.785139]  ? sctp_id2assoc+0x350/0x370
[   50.785497]  ? sctp_wfree+0x660/0x660
[   50.785818]  ? __might_fault+0x177/0x1b0
[   50.786163]  ? sctp_getsockopt+0x402e/0x721a
[   50.786555]  ? _raw_spin_unlock_irq+0x24/0x40
[   50.786931]  ? finish_task_switch+0x1c2/0x740
[   50.787304]  ? finish_task_switch+0x182/0x740
[   50.787683]  ? sctp_getsockopt_peeloff_common+0x350/0x350
[   50.788143]  ? lock_repin_lock+0x410/0x410
[   50.788503]  ? __schedule+0x752/0x1ce0
[   50.788835]  ? select_task_rq_fair+0x1196/0x35d0
[   50.789231]  ? print_usage_bug+0x140/0x140
[   50.789616]  ? save_trace+0x300/0x300
[   50.789946]  ? active_load_balance_cpu_stop+0xfb0/0xfb0
[   50.790429]  ? put_prev_task_fair+0x70/0x70
[   50.790812]  ? find_held_lock+0x32/0x1b0
[   50.791165]  ? schedule+0xf0/0x3a0
[   50.791484]  ? __schedule+0x1ce0/0x1ce0
[   50.791842]  ? __lock_acquire+0x911/0x4670
[   50.792223]  ? rcu_note_context_switch+0x710/0x710
[   50.792656]  ? futex_wait_setup+0x128/0x380
[   50.793053]  ? debug_check_no_locks_freed+0x210/0x210
[   50.793526]  ? get_futex_value_locked+0xc0/0xf0
[   50.793947]  ? futex_wait_setup+0x1f9/0x380
[   50.794343]  ? find_held_lock+0x32/0x1b0
[   50.794686]  ? futex_wake+0x630/0x630
[   50.795016]  ? futex_wake+0x528/0x630
[   50.795343]  ? drop_futex_key_refs.isra.13+0x51/0xa0
[   50.795778]  ? futex_wait+0x637/0x930
[   50.796132]  ? futex_wait_setup+0x380/0x380
[   50.796521]  ? mark_wake_futex+0xba/0x1d0
[   50.796877]  ? wake_up_q+0x97/0xe0
[   50.797177]  ? drop_futex_key_refs.isra.13+0x51/0xa0
[   50.797621]  ? futex_wake+0x2ac/0x630
[   50.797952]  ? save_trace+0x300/0x300
[   50.798270]  ? lock_acquire+0x4a0/0x4a0
[   50.798624]  ? finish_task_switch+0x182/0x740
[   50.799014]  ? do_futex+0x7da/0x1f50
[   50.799341]  ? find_held_lock+0x32/0x1b0
[   50.799683]  ? lock_acquire+0x4a0/0x4a0
[   50.800017]  ? lock_downgrade+0x6e0/0x6e0
[   50.800365]  ? set_load_weight+0x270/0x270
[   50.800730]  ? rcutorture_record_progress+0x10/0x10
[   50.801179]  ? __fget+0x386/0x5b0
[   50.801496]  ? iterate_fd+0x3d0/0x3d0
[   50.801837]  ? find_held_lock+0x32/0x1b0
[   50.802181]  ? release_sock+0x1d0/0x280
[   50.802537]  ? lock_acquire+0x4a0/0x4a0
[   50.802897]  ? __fget_light+0x28c/0x3a0
[   50.803230]  ? rcutorture_record_progress+0x10/0x10
[   50.803648]  ? sock_has_perm+0x26e/0x360
[   50.804023]  ? selinux_secmark_relabel_packet+0xc0/0xc0
[   50.804535]  ? schedule+0xf0/0x3a0
[   50.804953]  ? __release_sock+0x350/0x350
[   50.805394]  ? mark_held_locks+0xa8/0xf0
[   50.805837]  ? SyS_getsockopt+0x153/0x310
[   50.806279]  ? SyS_getsockopt+0x153/0x310
[   50.806732]  ? SyS_setsockopt+0x340/0x340
[   50.807173]  ? exit_to_usermode_loop+0x181/0x1e0
[   50.807670]  ? syscall_slow_exit_work+0x400/0x400
[   50.808058]  ? do_syscall_64+0xb0/0x7a0
[   50.808359]  ? SyS_setsockopt+0x340/0x340
[   50.808692]  ? do_syscall_64+0x23e/0x7a0
[   50.809007]  ? _raw_spin_unlock_irq+0x24/0x40
[   50.809350]  ? finish_task_switch+0x1c2/0x740
[   50.809726]  ? syscall_return_slowpath+0x470/0x470
[   50.810106]  ? syscall_return_slowpath+0x2df/0x470
[   50.810480]  ? prepare_exit_to_usermode+0x330/0x330
[   50.810876]  ? entry_SYSCALL_64_after_hwframe+0x52/0xb7
[   50.811284]  ? trace_hardirqs_off_thunk+0x1a/0x1c
[   50.811666]  ? entry_SYSCALL_64_after_hwframe+0x42/0xb7
[   50.812079] 
[   50.812206] Allocated by task 11561:
[   50.812505]  kasan_kmalloc+0xbf/0xe0
[   50.812798]  kmem_cache_alloc_trace+0x142/0x2f0
[   50.813150]  sctp_association_new+0x10e/0x2060
[   50.813525]  __sctp_connect+0x5a3/0xc20
[   50.813827]  __sctp_setsockopt_connectx+0x61/0xc0
[   50.814355]  sctp_getsockopt+0x163d/0x721a
[   50.814760] 
[   50.814920] Freed by task 11551:
[   50.815252]  __kasan_slab_free+0x12c/0x170
[   50.815655]  kfree+0xf3/0x2e0
[   50.815953]  sctp_association_put+0x20b/0x300
[   50.816385]  sctp_association_free+0x631/0x880
[   50.816831]  sctp_do_sm+0x2b04/0x65d0
[   50.817198] 
[   50.817359] The buggy address belongs to the object at ffff88007d62b300
[   50.817359]  which belongs to the cache kmalloc-4096 of size 4096
[   50.818653] The buggy address is located 32 bytes inside of
[   50.818653]  4096-byte region [ffff88007d62b300, ffff88007d62c300)
[   50.819783] The buggy address belongs to the page:
[   50.820258] page:ffffea0001f58a00 count:1 mapcount:0 mapping:0000000000000000 index:0x0 compound_mapcount: 0
[   50.821216] flags: 0x500000000008100(slab|head)
[   50.821660] raw: 0500000000008100 0000000000000000 0000000000000000 0000000180070007
[   50.822410] raw: 0000000000000000 0000000100000001 ffff88002dc02c00 0000000000000000
[   50.823160] page dumped because: kasan: bad access detected
[   50.823701] 
[   50.823860] Memory state around the buggy address:
[   50.824350]  ffff88007d62b200: fc fc fc fc fc fc fc fc fc fc fc fc fc fc fc fc
[   50.825062]  ffff88007d62b280: fc fc fc fc fc fc fc fc fc fc fc fc fc fc fc fc
[   50.825733] >ffff88007d62b300: fb fb fb fb fb fb fb fb fb fb fb fb fb fb fb fb
[   50.826388]                                ^
[   50.826776]  ffff88007d62b380: fb fb fb fb fb fb fb fb fb fb fb fb fb fb fb fb
[   50.827424]  ffff88007d62b400: fb fb fb fb fb fb fb fb fb fb fb fb fb fb fb fb
[   50.828079] ==================================================================
[   50.828719] Disabling lock debugging due to kernel taint
[   50.829292] Kernel panic - not syncing: panic_on_warn set ...
[   50.829292] 
[   50.830148] CPU: 1 PID: 11561 Comm: rs:main Q:Reg Tainted: G    B            4.16.0-rc4+ #9
```

**End**
