---
layout: post
title: LK v4.16.x - xfrm_state_find - oobs
comments: true
---

xfrm_state_find - stack out of bounds

posted & found by [zer0day](https://kozistr.github.io/)

## tl;dr

Found in *LK v4.16.0-rc6*.

stack-out-of-bounds in xfrm_state_find, 4 bytes read.

## Call Trace (Dump)

```c
[  467.981313]  dump_stack+0x10a/0x1dd
[  467.981824]  ? _atomic_dec_and_lock+0x163/0x163
[  467.982417]  ? show_regs_print_info+0x12/0x12
[  467.983088]  ? xfrm_state_find+0x3c6/0x30f0
[  467.983660]  print_address_description+0x60/0x224
[  467.984438]  ? xfrm_state_find+0x3c6/0x30f0
[  467.985208]  kasan_report+0x196/0x2a0
[  467.985839]  ? xfrm_state_find+0x2ea6/0x30f0
[  467.986510]  ? xfrm_state_find+0x2ea6/0x30f0
[  467.987035]  ? save_trace+0x300/0x300
[  467.987683]  ? xfrm_state_afinfo_get_rcu+0x170/0x170
[  467.988511]  ? find_held_lock+0x32/0x1b0
[  467.989193]  ? print_usage_bug+0x140/0x140
[  467.989939]  ? lock_acquire+0x4a0/0x4a0
[  467.990594]  ? print_usage_bug+0x140/0x140
[  467.991269]  ? rcutorture_record_progress+0x10/0x10
[  467.992089]  ? __lock_is_held+0xad/0x140
[  467.992805]  ? dequeue_task_fair+0x3730/0x3730
[  467.993593]  ? __lock_acquire+0x911/0x4670
[  467.994320]  ? __lock_acquire+0x911/0x4670
[  467.994977]  ? reweight_entity+0xfe0/0xfe0
[  467.995468]  ? put_prev_task_fair+0x70/0x70
[  467.996041]  ? debug_check_no_locks_freed+0x210/0x210
[  467.996743]  ? debug_check_no_locks_freed+0x210/0x210
[  467.997342]  ? dequeue_task_fair+0x1586/0x3730
[  467.997961]  ? print_usage_bug+0x140/0x140
[  467.998657]  ? xfrm_tmpl_resolve+0x2be/0xb30
[  467.999321]  ? __xfrm_decode_session+0xf0/0xf0
[  468.000063]  ? rcu_read_lock_sched_held+0xe4/0x120
[  468.000597]  ? fib_table_lookup+0xa64/0x1960
[  468.001290]  ? xfrm_resolve_and_create_bundle+0x134/0x27e0
[  468.002054]  ? print_usage_bug+0x140/0x140
[  468.002742]  ? save_trace+0x300/0x300
[  468.003395]  ? save_trace+0x300/0x300
[  468.003849]  ? __lock_acquire+0x911/0x4670
[  468.004300]  ? xfrm_tmpl_resolve+0xb30/0xb30
[  468.004790]  ? print_usage_bug+0x140/0x140
[  468.005249]  ? find_held_lock+0x32/0x1b0
[  468.005615]  ? xfrm_sk_policy_lookup+0x306/0x450
[  468.006131]  ? lock_acquire+0x4a0/0x4a0
[  468.006474]  ? lock_downgrade+0x6e0/0x6e0
[  468.008510]  ? refcount_inc_not_zero+0xf5/0x180
[  468.008982]  ? rcutorture_record_progress+0x10/0x10
[  468.009514]  ? xfrm_selector_match+0x36/0xdc0
[  468.010028]  ? xfrm_sk_policy_lookup+0x32f/0x450
[  468.010523]  ? xfrm_selector_match+0xdc0/0xdc0
[  468.011027]  ? xfrm_lookup+0x336/0x21a0
[  468.011376]  ? xfrm_lookup+0x336/0x21a0
[  468.011745]  ? set_load_weight+0x270/0x270
[  468.012272]  ? xfrm_policy_lookup_bytype.constprop.49+0x1700/0x1700
[  468.013118]  ? find_held_lock+0x32/0x1b0
[  468.013609]  ? ip_route_output_key_hash+0x229/0x350
[  468.014352]  ? lock_acquire+0x4a0/0x4a0
[  468.014825]  ? lock_downgrade+0x6e0/0x6e0
[  468.015359]  ? find_held_lock+0x32/0x1b0
[  468.015827]  ? rcutorture_record_progress+0x10/0x10
[  468.016418]  ? raw_sendmsg+0x89a/0x3b80
[  468.016883]  ? ip_route_output_key_hash+0x252/0x350
[  468.017519]  ? ip_route_output_key_hash_rcu+0x2c70/0x2c70
[  468.018206]  ? debug_check_no_locks_freed+0x210/0x210
[  468.018816]  ? xfrm_lookup_route+0x34/0x1a0
[  468.019364]  ? ip_route_output_flow+0x86/0xa0
[  468.019834]  ? raw_sendmsg+0xef5/0x3b80
[  468.020248]  ? raw_getsockopt+0xd0/0xd0
[  468.020691]  ? refill_pi_state_cache.part.7+0x2f0/0x2f0
[  468.021153]  ? _raw_spin_unlock_irqrestore+0x46/0x60
[  468.021590]  ? get_futex_value_locked+0xc0/0xf0
[  468.022099]  ? futex_wait_setup+0x1f9/0x380
[  468.022659]  ? save_trace+0x300/0x300
[  468.023075]  ? find_held_lock+0x32/0x1b0
[  468.023511]  ? futex_wake+0x630/0x630
[  468.023920]  ? futex_wake+0x528/0x630
[  468.024341]  ? __might_fault+0x104/0x1b0
[  468.024784]  ? lock_downgrade+0x6e0/0x6e0
[  468.025245]  ? rw_copy_check_uvector+0x227/0x2f0
[  468.025668]  ? import_iovec+0x20b/0x3d0
[  468.026105]  ? sock_has_perm+0x26e/0x360
[  468.026527]  ? selinux_secmark_relabel_packet+0xc0/0xc0
[  468.027099]  ? _copy_from_user+0x94/0x100
[  468.027534]  ? inet_sendmsg+0x12d/0x590
[  468.027947]  ? inet_sk_rebuild_header+0x1b30/0x1b30
[  468.028463]  ? SYSC_sendto+0x560/0x560
[  468.028881]  ? inet_sk_rebuild_header+0x1b30/0x1b30
[  468.029438]  ? sock_sendmsg+0xc0/0x100
[  468.029840]  ? ___sys_sendmsg+0x2e9/0x820
[  468.030237]  ? copy_msghdr_from_user+0x4f0/0x4f0
[  468.030726]  ? finish_task_switch+0x182/0x740
[  468.031282]  ? set_load_weight+0x270/0x270
[  468.031800]  ? lock_repin_lock+0x410/0x410
[  468.032354]  ? __fget_light+0x28c/0x3a0
[  468.032825]  ? __schedule+0x75c/0x1ea0
[  468.033315]  ? __sched_text_start+0x8/0x8
[  468.033813]  ? __sys_sendmmsg+0x1ce/0x590
[  468.034328]  ? SyS_sendmsg+0x40/0x40
[  468.034771]  ? fget_raw+0x20/0x20
[  468.035246]  ? selinux_netlbl_socket_setsockopt+0xf1/0x430
[  468.035925]  ? schedule+0xf0/0x3a0
[  468.036495]  ? __schedule+0x1ea0/0x1ea0
[  468.036994]  ? SyS_futex+0x261/0x31e
[  468.037455]  ? SyS_futex+0x26a/0x31e
[  468.037919]  ? exit_to_usermode_loop+0x139/0x1e0
[  468.038498]  ? do_futex+0x1f50/0x1f50
[  468.038925]  ? exit_to_usermode_loop+0x181/0x1e0
[  468.039437]  ? syscall_slow_exit_work+0x400/0x400
[  468.039964]  ? security_file_ioctl+0x76/0xb0
[  468.040460]  ? SyS_sendmmsg+0x2f/0x50
[  468.040881]  ? __sys_sendmmsg+0x590/0x590
[  468.041348]  ? do_syscall_64+0x23e/0x7a0
[  468.041861]  ? put_task_stack+0x13e/0x2c0
[  468.042306]  ? syscall_return_slowpath+0x470/0x470
[  468.042861]  ? syscall_return_slowpath+0x2df/0x470
[  468.043387]  ? prepare_exit_to_usermode+0x330/0x330
[  468.044024]  ? entry_SYSCALL_64_after_hwframe+0x52/0xb7
[  468.044647]  ? trace_hardirqs_off_thunk+0x1a/0x1c
[  468.045103]  ? entry_SYSCALL_64_after_hwframe+0x42/0xb7
[  468.045697] 
[  468.045894] The buggy address belongs to the page:
[  468.046592] page:ffffea0000b419c0 count:0 mapcount:0 mapping:0000000000000000 index:0x0
[  468.047381] flags: 0x100000000000000()
[  468.047787] raw: 0100000000000000 0000000000000000 0000000000000000 00000000ffffffff
[  468.048497] raw: 0000000000000000 ffffea0000b419e0 0000000000000000 0000000000000000
[  468.049192] page dumped because: kasan: bad access detected
[  468.049716] 
[  468.049848] Memory state around the buggy address:
[  468.050235]  ffff88002d067500: f2 f2 f2 04 f2 f2 f2 f2 f2 f2 f2 00 f2 f2 f2 f2
[  468.050903]  ffff88002d067580: f2 f2 f2 00 00 00 00 f2 f2 f2 f2 00 00 00 00 00
[  468.051517] >ffff88002d067600: 00 f2 f2 f2 f2 f2 f2 00 00 00 00 00 00 00 f2 f2
[  468.052214]                                                              ^
[  468.052943]  ffff88002d067680: f2 f2 f2 f8 f2 f2 f2 f2 f2 f2 f2 f8 f2 f2 f2 f2
[  468.053591]  ffff88002d067700: f2 f2 f2 00 f2 f2 f2 f2 f2 f2 f2 00 00 00 f2 f2
[  468.054259] ==================================================================
[  468.054863] Disabling lock debugging due to kernel taint
[  468.055380] Kernel panic - not syncing: panic_on_warn set ...
```

**End**