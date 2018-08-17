---
layout: post
title: LK v4.16.x - process_preds - uaf/oobs
author: zer0day
categories: lk
---

process_preds - slab out of bounds *Write* / use after free *Read/Write*

posted & found by [zer0day](https://kozistr.github.io/)

## tl;dr

Found in *LK v4.16.0*. Interesting one... :)

## Call Trace (Dump)

Here's dmesg.

```c
zero@zer0day:/tmp$ uname -a
Linux zer0day 4.16.0+ #30 SMP Fri Apr 13 14:35:45 KST 2018 x86_64 GNU/Linux
zero@zer0day:/tmp$ id
uid=1000(zero) gid=1000(zero) groups=1000(zero)
zero@zer0day:/tmp$ gcc -o poc poc.c
zero@zer0day:/tmp$ ./poc
[  123.540060] ==================================================================
[  123.541879] BUG: KASAN: slab-out-of-bounds in process_preds+0x14c2/0x15f0
[  123.543111] Write of size 4 at addr ffff8800672544c0 by task poc/2770
[  123.544485] 
[  123.544813] CPU: 1 PID: 2770 Comm: poc Not tainted 4.16.0+ #30
...
[  123.643127] BUG: unable to handle kernel paging request at ffff87f93e164984
[  123.644861] PGD 0 P4D 0 
[  123.645532] Oops: 0000 [#1] SMP KASAN PTI
[  123.646535] Modules linked in:
[  123.647309] CPU: 1 PID: 2770 Comm: poc Tainted: G    B             4.16.0+ #30
[  123.649070] Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS 1.10.2-1ubuntu1 04/01/2014
...
```

And another...

```c
[  111.493097] BUG: KASAN: use-after-free in process_preds+0x14c2/0x15f0
[  111.493773] Write of size 4 at addr ffff88001feabff8 by task syz-executor5/25857
[  111.494553] 
[  111.494735] CPU: 0 PID: 25857 Comm: syz-executor5 Not tainted 4.16.0+ #30
[  111.495449] Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS 1.10.2-1ubuntu1 04/01/2014
[  111.496378] Call Trace:
[  111.496651]  dump_stack+0x11b/0x1fd
[  111.497029]  ? dump_stack_print_info.cold.0+0x81/0x81
[  111.497547]  ? kmsg_dump_rewind_nolock+0xd9/0xd9
[  111.498026]  print_address_description+0x60/0x255
[  111.498468]  kasan_report+0x196/0x2a0
[  111.498842]  ? process_preds+0x14c2/0x15f0
[  111.499259]  ? process_preds+0x14c2/0x15f0
[  111.499618]  ? parse_pred+0x21e0/0x21e0
[  111.499969]  ? kmem_cache_alloc_trace+0x128/0x2c0
[  111.500376]  ? create_filter+0x138/0x200
[  111.500711]  ? wait_for_completion+0x6b0/0x6b0
[  111.501112]  ? process_preds+0x15f0/0x15f0
[  111.501466]  ? __lock_is_held+0xad/0x140
[  111.501805]  ? ftrace_profile_set_filter+0x11c/0x280
[  111.502227]  ? ftrace_profile_free_filter+0x60/0x60
[  111.502649]  ? _copy_from_user+0x94/0x100
[  111.503006]  ? memdup_user+0x5a/0x90
[  111.503328]  ? _perf_ioctl+0xf0a/0x1520
[  111.503736]  ? SyS_perf_event_open+0x40/0x40
[  111.504194]  ? perf_event_ctx_lock_nested+0x1d5/0x410
[  111.504730]  ? lock_acquire+0x4a0/0x4a0
[  111.505152]  ? lock_downgrade+0x6e0/0x6e0
[  111.505581]  ? rcu_is_watching+0x81/0x130
[  111.506024]  ? perf_event_ctx_lock_nested+0x20f/0x410
[  111.506565]  ? perf_event_ctx_lock_nested+0x339/0x410
[  111.507099]  ? perf_swevent_init+0x530/0x530
[  111.507558]  ? SyS_dup2+0x430/0x430
[  111.507936]  ? perf_ioctl+0x54/0x80
[  111.508310]  ? _perf_ioctl+0x1520/0x1520
[  111.508726]  ? do_vfs_ioctl+0x199/0x13f0
[  111.509163]  ? perf_event_set_output+0x580/0x580
[  111.509571]  ? ioctl_preallocate+0x2a0/0x2a0
[  111.509936]  ? selinux_capable+0x40/0x40
[  111.510348]  ? __fget_light+0x299/0x3b0
[  111.510672]  ? fget_raw+0x20/0x20
[  111.510959]  ? SyS_futex+0x261/0x31e
[  111.511275]  ? SyS_futex+0x26a/0x31e
[  111.511591]  ? security_file_ioctl+0x52/0xa0
[  111.512061]  ? ksys_ioctl+0x77/0xa0
[  111.512437]  ? SyS_ioctl+0x1e/0x30
[  111.512802]  ? ksys_ioctl+0xa0/0xa0
[  111.513174]  ? do_syscall_64+0x23e/0x7a0
[  111.513580]  ? _raw_spin_unlock_irq+0x24/0x40
[  111.514027]  ? finish_task_switch+0x1c7/0x750
[  111.514475]  ? syscall_return_slowpath+0x470/0x470
[  111.514970]  ? syscall_return_slowpath+0x2df/0x470
[  111.515459]  ? prepare_exit_to_usermode+0x330/0x330
[  111.515960]  ? entry_SYSCALL_64_after_hwframe+0x52/0xb7
[  111.516487]  ? trace_hardirqs_off_thunk+0x1a/0x1c
[  111.516982]  ? entry_SYSCALL_64_after_hwframe+0x42/0xb7
[  111.517498] 
[  111.517634] The buggy address belongs to the page:
[  111.518032] page:ffffea00007faac0 count:0 mapcount:0 mapping:0000000000000000 index:0x0
[  111.518693] flags: 0x100000000000000()
[  111.519014] raw: 0100000000000000 0000000000000000 0000000000000000 00000000ffffffff
[  111.519864] raw: ffffea000070d020 ffffea00007faaa0 ffff88002687ab30 0000000000000000
[  111.520512] page dumped because: kasan: bad access detected
[  111.520985] 
[  111.521129] Memory state around the buggy address:
[  111.521532]  ffff88001feabe80: ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
[  111.522145]  ffff88001feabf00: ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
[  111.522716] >ffff88001feabf80: ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
[  111.523257]                                                                 ^
[  111.523914]  ffff88001feac000: fc 00 00 00 00 00 00 fc fc fc fc fc fc fc fc fc
[  111.524663]  ffff88001feac080: fc fc fc fc fc fc fc fc fc fc fc fc fc fc fc fc
[  111.525416] ==================================================================
[  111.526048] Disabling lock debugging due to kernel taint
[  111.526523] Kernel panic - not syncing: panic_on_warn set ...
[  111.526523] 
[  111.527088] CPU: 0 PID: 25857 Comm: syz-executor5 Tainted: G    B             4.16.0+ #30
[  111.527698] Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS 1.10.2-1ubuntu1 04/01/2014
[  111.528362] Call Trace:
[  111.528559]  dump_stack+0x11b/0x1fd
[  111.528878]  ? dump_stack_print_info.cold.0+0x81/0x81
[  111.529394]  ? trace_hardirqs_on_thunk+0x1a/0x1c
[  111.529865]  panic+0x1c7/0x3b8
[  111.530183]  ? add_taint.cold.3+0x16/0x16
[  111.530595]  ? do_raw_spin_unlock+0xac/0x310
[  111.531030]  ? do_raw_spin_unlock+0xac/0x310
[  111.531489]  kasan_end_report+0x43/0x49
[  111.531901]  kasan_report.cold.6+0xb7/0xe3
[  111.532338]  process_preds+0x14c2/0x15f0
[  111.532761]  ? process_preds+0x14c2/0x15f0
[  111.533140]  ? parse_pred+0x21e0/0x21e0
[  111.533550]  ? kmem_cache_alloc_trace+0x128/0x2c0
[  111.534049]  ? create_filter+0x138/0x200
[  111.534469]  ? wait_for_completion+0x6b0/0x6b0
[  111.534940]  ? process_preds+0x15f0/0x15f0
[  111.535377]  ? __lock_is_held+0xad/0x140
[  111.535798]  ? ftrace_profile_set_filter+0x11c/0x280
[  111.536357]  ? ftrace_profile_free_filter+0x60/0x60
[  111.536873]  ? _copy_from_user+0x94/0x100
[  111.537221]  ? memdup_user+0x5a/0x90
[  111.537500]  ? _perf_ioctl+0xf0a/0x1520
[  111.537796]  ? SyS_perf_event_open+0x40/0x40
[  111.538124]  ? perf_event_ctx_lock_nested+0x1d5/0x410
[  111.538527]  ? lock_acquire+0x4a0/0x4a0
[  111.538824]  ? lock_downgrade+0x6e0/0x6e0
[  111.539165]  ? rcu_is_watching+0x81/0x130
[  111.539490]  ? perf_event_ctx_lock_nested+0x20f/0x410
[  111.539873]  ? perf_event_ctx_lock_nested+0x339/0x410
[  111.540257]  ? perf_swevent_init+0x530/0x530
[  111.540585]  ? SyS_dup2+0x430/0x430
[  111.540856]  ? perf_ioctl+0x54/0x80
[  111.541179]  ? _perf_ioctl+0x1520/0x1520
[  111.541479]  ? do_vfs_ioctl+0x199/0x13f0
[  111.541783]  ? perf_event_set_output+0x580/0x580
[  111.542138]  ? ioctl_preallocate+0x2a0/0x2a0
[  111.542465]  ? selinux_capable+0x40/0x40
[  111.542765]  ? __fget_light+0x299/0x3b0
[  111.543083]  ? fget_raw+0x20/0x20
[  111.543422]  ? SyS_futex+0x261/0x31e
[  111.543780]  ? SyS_futex+0x26a/0x31e
[  111.544142]  ? security_file_ioctl+0x52/0xa0
[  111.544531]  ? ksys_ioctl+0x77/0xa0
[  111.544801]  ? SyS_ioctl+0x1e/0x30
[  111.545119]  ? ksys_ioctl+0xa0/0xa0
[  111.545479]  ? do_syscall_64+0x23e/0x7a0
[  111.545780]  ? _raw_spin_unlock_irq+0x24/0x40
[  111.546115]  ? finish_task_switch+0x1c7/0x750
[  111.546451]  ? syscall_return_slowpath+0x470/0x470
[  111.546816]  ? syscall_return_slowpath+0x2df/0x470
[  111.547183]  ? prepare_exit_to_usermode+0x330/0x330
[  111.547562]  ? entry_SYSCALL_64_after_hwframe+0x52/0xb7
[  111.547960]  ? trace_hardirqs_off_thunk+0x1a/0x1c
[  111.548320]  ? entry_SYSCALL_64_after_hwframe+0x42/0xb7
[  111.548872] Dumping ftrace buffer:
[  111.549185]    (ftrace buffer empty)
[  111.549496] Kernel Offset: 0xe00000 from 0xffffffff81000000 (relocation range: 0xffffffff80000000-0xffffffffbfffffff)
[  111.550359] Rebooting in 86400 seconds..
```

**End**
