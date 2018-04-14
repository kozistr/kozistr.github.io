---
layout: post
title: LK v4.16.x - process_preds - oobs
comments: true
---

process_preds - slab out of bounds *Read*

posted & found by [zer0day](https://kozistr.github.io/)

## tl;dr

Got from syzkaller & Found in *LK v4.16.0*. I didn't analyze yet.

Interesting one... :)

## Call Trace (Dump)

Here's syzkaller report & dmesg.

```c
BUG: KASAN: use-after-free in predicate_parse kernel/trace/trace_events_filter.c:562 [inline]
BUG: KASAN: use-after-free in process_preds+0x14f0/0x15f0 kernel/trace/trace_events_filter.c:1505
Read of size 4 at addr ffff88007951bff8 by task syz-executor7/32371

CPU: 1 PID: 32371 Comm: syz-executor7 Not tainted 4.16.0+ #30
Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS 1.10.2-1ubuntu1 04/01/2014
Call Trace:
 __dump_stack lib/dump_stack.c:77 [inline]
 dump_stack+0x11b/0x1fd lib/dump_stack.c:113
 print_address_description+0x60/0x255 mm/kasan/report.c:256
 kasan_report_error mm/kasan/report.c:354 [inline]
 kasan_report+0x196/0x2a0 mm/kasan/report.c:412

The buggy address belongs to the page:
page:ffffea0001e546c0 count:0 mapcount:0 mapping:0000000000000000 index:0x0
flags: 0x500000000000000()
raw: 0500000000000000 0000000000000000 0000000000000000 00000000ffffffff
raw: ffffea0001f4f020 ffffea0001e546a0 0000000000000000 0000000000000000
page dumped because: kasan: bad access detected

Memory state around the buggy address:
 ffff88007951be80: ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
 ffff88007951bf00: ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
>ffff88007951bf80: ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
                                                                ^
 ffff88007951c000: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
 ffff88007951c080: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
==================================================================
Kernel panic - not syncing: panic_on_warn set ...

CPU: 1 PID: 32371 Comm: syz-executor7 Tainted: G    B             4.16.0+ #30
Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS 1.10.2-1ubuntu1 04/01/2014
Call Trace:
 __dump_stack lib/dump_stack.c:77 [inline]
 dump_stack+0x11b/0x1fd lib/dump_stack.c:113
 panic+0x1c7/0x3b8 kernel/panic.c:184
 kasan_end_report+0x43/0x49 mm/kasan/report.c:180
 kasan_report_error mm/kasan/report.c:359 [inline]
 kasan_report.cold.6+0xb7/0xe3 mm/kasan/report.c:412
 predicate_parse kernel/trace/trace_events_filter.c:562 [inline]
 process_preds+0x14f0/0x15f0 kernel/trace/trace_events_filter.c:1505
Dumping ftrace buffer:
   (ftrace buffer empty)
Kernel Offset: 0x19000000 from 0xffffffff81000000 (relocation range: 0xffffffff80000000-0xffffffffbfffffff)
Rebooting in 86400 seconds..

...

[  128.247225] Read of size 4 at addr ffff88007951bff8 by task syz-executor7/32371
[  128.248159] 
[  128.248361] CPU: 1 PID: 32371 Comm: syz-executor7 Not tainted 4.16.0+ #30
[  128.249158] Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS 1.10.2-1ubuntu1 04/01/2014
[  128.250211] Call Trace:
[  128.250517]  dump_stack+0x11b/0x1fd
[  128.250966]  ? dump_stack_print_info.cold.0+0x81/0x81
[  128.251615]  ? kmsg_dump_rewind_nolock+0xd9/0xd9
[  128.252176]  print_address_description+0x60/0x255
[  128.252749]  kasan_report+0x196/0x2a0
[  128.253190]  ? process_preds+0x14f0/0x15f0
[  128.253685]  ? process_preds+0x14f0/0x15f0
[  128.254191]  ? parse_pred+0x21e0/0x21e0
[  128.254669]  ? kmem_cache_alloc_trace+0x128/0x2c0
[  128.255231]  ? create_filter+0x138/0x200
[  128.255712]  ? wait_for_completion+0x6b0/0x6b0
[  128.256266]  ? process_preds+0x15f0/0x15f0
[  128.256775]  ? __lock_is_held+0xad/0x140
[  128.257275]  ? ftrace_profile_set_filter+0x11c/0x280
[  128.257871]  ? ftrace_profile_free_filter+0x60/0x60
[  128.258450]  ? _copy_from_user+0x94/0x100
[  128.258939]  ? memdup_user+0x5a/0x90
[  128.259448]  ? _perf_ioctl+0xf0a/0x1520
[  128.259988]  ? SyS_perf_event_open+0x40/0x40
[  128.260504]  ? perf_event_ctx_lock_nested+0x1d5/0x410
[  128.261163]  ? lock_acquire+0x4a0/0x4a0
[  128.261625]  ? __fget+0x371/0x5c0
[  128.262086]  ? lock_downgrade+0x6e0/0x6e0
[  128.262581]  ? lock_acquire+0x4a0/0x4a0
[  128.263045]  ? rcu_is_watching+0x81/0x130
[  128.263549]  ? perf_event_ctx_lock_nested+0x20f/0x410
[  128.264164]  ? perf_event_ctx_lock_nested+0x339/0x410
[  128.264798]  ? perf_swevent_init+0x530/0x530
[  128.265323]  ? SyS_dup2+0x430/0x430
[  128.265751]  ? perf_ioctl+0x54/0x80
[  128.266179]  ? _perf_ioctl+0x1520/0x1520
[  128.266645]  ? do_vfs_ioctl+0x199/0x13f0
[  128.267167]  ? ioctl_preallocate+0x2a0/0x2a0
[  128.267706]  ? selinux_capable+0x40/0x40
[  128.268181]  ? __fget_light+0x299/0x3b0
[  128.268643]  ? fget_raw+0x20/0x20
[  128.269101]  ? SyS_futex+0x261/0x31e
[  128.269553]  ? SyS_futex+0x26a/0x31e
[  128.269993]  ? exit_to_usermode_loop+0x139/0x1e0
[  128.270553]  ? security_file_ioctl+0x52/0xa0
[  128.271087]  ? ksys_ioctl+0x77/0xa0
[  128.271566]  ? SyS_ioctl+0x1e/0x30
[  128.272007]  ? ksys_ioctl+0xa0/0xa0
[  128.272455]  ? do_syscall_64+0x23e/0x7a0
[  128.272954]  ? _raw_spin_unlock_irq+0x24/0x40
[  128.273531]  ? finish_task_switch+0x1c7/0x750
[  128.274070]  ? syscall_return_slowpath+0x470/0x470
[  128.274652]  ? syscall_return_slowpath+0x2df/0x470
[  128.275225]  ? prepare_exit_to_usermode+0x330/0x330
[  128.275836]  ? entry_SYSCALL_64_after_hwframe+0x52/0xb7
[  128.276480]  ? trace_hardirqs_off_thunk+0x1a/0x1c
[  128.277076]  ? entry_SYSCALL_64_after_hwframe+0x42/0xb7
[  128.277722] 
[  128.277939] The buggy address belongs to the page:
[  128.278509] page:ffffea0001e546c0 count:0 mapcount:0 mapping:0000000000000000 index:0x0
[  128.279463] flags: 0x500000000000000()
[  128.279793] raw: 0500000000000000 0000000000000000 0000000000000000 00000000ffffffff
[  128.280430] raw: ffffea0001f4f020 ffffea0001e546a0 0000000000000000 0000000000000000
[  128.281091] page dumped because: kasan: bad access detected
[  128.281569] 
[  128.281703] Memory state around the buggy address:
[  128.282101]  ffff88007951be80: ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
[  128.282718]  ffff88007951bf00: ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
[  128.283317] >ffff88007951bf80: ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
[  128.283968]                                                                 ^
[  128.284617]  ffff88007951c000: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
[  128.285243]  ffff88007951c080: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
[  128.285868] ==================================================================
[  128.286477] Disabling lock debugging due to kernel taint
[  128.286972] Kernel panic - not syncing: panic_on_warn set ...
[  128.286972] 
[  128.287618] CPU: 1 PID: 32371 Comm: syz-executor7 Tainted: G    B             4.16.0+ #30
[  128.288310] Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS 1.10.2-1ubuntu1 04/01/2014
[  128.289127] Call Trace:
[  128.289342]  dump_stack+0x11b/0x1fd
[  128.289731]  ? dump_stack_print_info.cold.0+0x81/0x81
[  128.290174]  ? trace_hardirqs_on_thunk+0x1a/0x1c
[  128.290572]  panic+0x1c7/0x3b8
[  128.290905]  ? add_taint.cold.3+0x16/0x16
[  128.291257]  ? do_raw_spin_unlock+0xac/0x310
[  128.291632]  ? do_raw_spin_unlock+0xac/0x310
[  128.292066]  kasan_end_report+0x43/0x49
[  128.292410]  kasan_report.cold.6+0xb7/0xe3
[  128.292805]  process_preds+0x14f0/0x15f0
[  128.293317]  ? process_preds+0x14f0/0x15f0
[  128.293822]  ? parse_pred+0x21e0/0x21e0
[  128.294289]  ? kmem_cache_alloc_trace+0x128/0x2c0
[  128.294853]  ? create_filter+0x138/0x200
[  128.295271]  ? wait_for_completion+0x6b0/0x6b0
[  128.295746]  ? process_preds+0x15f0/0x15f0
[  128.296172]  ? __lock_is_held+0xad/0x140
[  128.296612]  ? ftrace_profile_set_filter+0x11c/0x280
[  128.297128]  ? ftrace_profile_free_filter+0x60/0x60
[  128.297624]  ? _copy_from_user+0x94/0x100
[  128.298048]  ? memdup_user+0x5a/0x90
[  128.298430]  ? _perf_ioctl+0xf0a/0x1520
[  128.298839]  ? SyS_perf_event_open+0x40/0x40
[  128.299292]  ? perf_event_ctx_lock_nested+0x1d5/0x410
[  128.299825]  ? lock_acquire+0x4a0/0x4a0
[  128.300237]  ? __fget+0x371/0x5c0
[  128.300590]  ? lock_downgrade+0x6e0/0x6e0
[  128.301013]  ? lock_acquire+0x4a0/0x4a0
[  128.301419]  ? rcu_is_watching+0x81/0x130
[  128.301846]  ? perf_event_ctx_lock_nested+0x20f/0x410
[  128.302373]  ? perf_event_ctx_lock_nested+0x339/0x410
[  128.302899]  ? perf_swevent_init+0x530/0x530
[  128.303361]  ? SyS_dup2+0x430/0x430
[  128.303758]  ? perf_ioctl+0x54/0x80
[  128.304158]  ? _perf_ioctl+0x1520/0x1520
[  128.304620]  ? do_vfs_ioctl+0x199/0x13f0
[  128.305058]  ? ioctl_preallocate+0x2a0/0x2a0
[  128.305543]  ? selinux_capable+0x40/0x40
[  128.305972]  ? __fget_light+0x299/0x3b0
[  128.306385]  ? fget_raw+0x20/0x20
[  128.306739]  ? SyS_futex+0x261/0x31e
[  128.307118]  ? SyS_futex+0x26a/0x31e
[  128.307514]  ? exit_to_usermode_loop+0x139/0x1e0
[  128.308006]  ? security_file_ioctl+0x52/0xa0
[  128.308457]  ? ksys_ioctl+0x77/0xa0
[  128.308835]  ? SyS_ioctl+0x1e/0x30
[  128.309233]  ? ksys_ioctl+0xa0/0xa0
[  128.309646]  ? do_syscall_64+0x23e/0x7a0
[  128.310112]  ? _raw_spin_unlock_irq+0x24/0x40
[  128.310625]  ? finish_task_switch+0x1c7/0x750
[  128.311133]  ? syscall_return_slowpath+0x470/0x470
[  128.311713]  ? syscall_return_slowpath+0x2df/0x470
[  128.312291]  ? prepare_exit_to_usermode+0x330/0x330
[  128.312882]  ? entry_SYSCALL_64_after_hwframe+0x52/0xb7
[  128.313511]  ? trace_hardirqs_off_thunk+0x1a/0x1c
[  128.314046]  ? entry_SYSCALL_64_after_hwframe+0x42/0xb7
[  128.314808] Dumping ftrace buffer:
[  128.315107]    (ftrace buffer empty)
[  128.315415] Kernel Offset: 0x19000000 from 0xffffffff81000000 (relocation range: 0xffffffff80000000-0xffffffffbfffffff)
[  128.316511] Rebooting in 86400 seconds..
```

**End**