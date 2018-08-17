---
layout: post
title: LK v4.16.x - strlen - oobs
author: zer0day
categories: lk
---

strlen - slab out of bounds *Read*

posted & found by [zer0day](https://kozistr.github.io/)

## tl;dr

Got from syzkaller & Found in *LK v4.16.0*. I didn't analyze yet.

Interesting one... :)

## Call Trace (Dump)

```c
[   66.494709] BUG: KASAN: slab-out-of-bounds in strlen+0x8e/0xa0
[   66.495406] Read of size 1 at addr ffff88007be71348 by task syz-executor0/12148
[   66.496244] 
[   66.496444] CPU: 1 PID: 12148 Comm: syz-executor0 Not tainted 4.16.0+ #28
[   66.497263] Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS 1.10.2-1ubuntu1 04/01/2014
[   66.498275] Call Trace:
[   66.498584]  dump_stack+0x11b/0x201
[   66.499017]  ? dma_direct_map_sg+0x26f/0x26f
[   66.499527]  ? show_regs_print_info+0x12/0x12
[   66.500078]  print_address_description+0x60/0x224
[   66.500642]  kasan_report+0x196/0x2a0
[   66.501095]  ? strlen+0x8e/0xa0
[   66.501484]  ? strlen+0x8e/0xa0
[   66.501873]  ? kstrdup+0x21/0x70
[   66.502291]  ? alloc_trace_kprobe+0x131/0xa10
[   66.502808]  ? kprobe_dispatcher+0x110/0x110
[   66.503344]  ? perf_kprobe_init+0x82/0x1f0
[   66.503821]  ? create_local_trace_kprobe+0xa8/0x4c0
[   66.504394]  ? alloc_symbol_cache+0x1c0/0x1c0
[   66.504905]  ? perf_kprobe_init+0x82/0x1f0
[   66.505428]  ? kmem_cache_alloc_trace+0x116/0x2b0
[   66.506004]  ? perf_kprobe_init+0x147/0x1f0
[   66.506503]  ? rcu_seq_end+0x120/0x120
[   66.506962]  ? perf_kprobe_event_init+0xa8/0x120
[   66.507511]  ? perf_try_init_event+0xcb/0x2a0
[   66.508041]  ? perf_event_alloc+0x1623/0x2540
[   66.508583]  ? perf_try_init_event+0x2a0/0x2a0
[   66.509110]  ? lock_acquire+0x4a0/0x4a0
[   66.509591]  ? mutex_lock_io_nested+0x16b0/0x16b0
[   66.510160]  ? perf_trace_lock_acquire+0xeb/0x930
[   66.510733]  ? perf_trace_lock_acquire+0xeb/0x930
[   66.511321]  ? perf_trace_lock+0x950/0x950
[   66.511812]  ? save_trace+0x300/0x300
[   66.512276]  ? save_trace+0x300/0x300
[   66.512777]  ? find_held_lock+0x32/0x1b0
[   66.513288]  ? ptrace_may_access+0x33/0x40
[   66.513784]  ? lock_acquire+0x4a0/0x4a0
[   66.514268]  ? do_raw_spin_unlock+0xac/0x310
[   66.514819]  ? do_raw_spin_trylock+0x1b0/0x1b0
[   66.515361]  ? __ptrace_may_access+0x48d/0x7d0
[   66.515963]  ? SYSC_perf_event_open+0x48d/0x2ab0
[   66.516552]  ? perf_event_set_output+0x580/0x580
[   66.517119]  ? schedule+0xf0/0x3a0
[   66.517609]  ? SyS_futex+0x261/0x31e
[   66.518039]  ? SyS_futex+0x26a/0x31e
[   66.518500]  ? exit_to_usermode_loop+0x139/0x1e0
[   66.519050]  ? do_futex+0x1f50/0x1f50
[   66.519518]  ? exit_to_usermode_loop+0x181/0x1e0
[   66.520080]  ? syscall_slow_exit_work+0x400/0x400
[   66.520668]  ? do_syscall_64+0xb0/0x7a0
[   66.521148]  ? SYSC_perf_event_open+0x2ab0/0x2ab0
[   66.521700]  ? do_syscall_64+0x23e/0x7a0
[   66.522186]  ? _raw_spin_unlock_irq+0x24/0x40
[   66.522736]  ? finish_task_switch+0x1c7/0x750
[   66.523270]  ? syscall_return_slowpath+0x470/0x470
[   66.523899]  ? syscall_return_slowpath+0x2df/0x470
[   66.524542]  ? prepare_exit_to_usermode+0x330/0x330
[   66.525148]  ? entry_SYSCALL_64_after_hwframe+0x52/0xb7
[   66.525808]  ? trace_hardirqs_off_thunk+0x1a/0x1c
[   66.526395]  ? entry_SYSCALL_64_after_hwframe+0x42/0xb7
[   66.527080] 
[   66.527297] Allocated by task 12148:
[   66.527749]  kasan_kmalloc+0xbf/0xe0
[   66.528187]  kmem_cache_alloc_trace+0x116/0x2b0
[   66.528795]  perf_kprobe_init+0x82/0x1f0
[   66.529328]  perf_kprobe_event_init+0xa8/0x120
[   66.529854]  perf_try_init_event+0xcb/0x2a0
[   66.530401]  perf_event_alloc+0x1623/0x2540
[   66.530889]  SYSC_perf_event_open+0x48d/0x2ab0
[   66.531430]  do_syscall_64+0x23e/0x7a0
[   66.531836] 
[   66.532015] Freed by task 18:
[   66.532368]  __kasan_slab_free+0x12c/0x170
[   66.532857]  kfree+0xf3/0x310
[   66.533193]  rcu_process_callbacks+0x9b4/0x25b0
[   66.533706]  __do_softirq+0x2a3/0xa8b
[   66.534104] 
[   66.534257] The buggy address belongs to the object at ffff88007be712c8
[   66.534257]  which belongs to the cache kmalloc-128 of size 128
[   66.535590] The buggy address is located 0 bytes to the right of
[   66.535590]  128-byte region [ffff88007be712c8, ffff88007be71348)
[   66.536688] The buggy address belongs to the page:
[   66.537323] page:ffffea0001ef9c00 count:1 mapcount:0 mapping:0000000000000000 index:0xffff88007be701e8 compound_mapcount: 0
[   66.538824] flags: 0x500000000008100(slab|head)
[   66.539438] raw: 0500000000008100 0000000000000000 ffff88007be701e8 0000000100110006
[   66.540500] raw: ffffea0001f716a0 ffff88007f800980 ffff88002800f480 0000000000000000
[   66.541612] page dumped because: kasan: bad access detected
[   66.542354] 
[   66.542581] Memory state around the buggy address:
[   66.543224]  ffff88007be71200: fc fc fc fc fc fc fc fc fc fc fc fc fc fc fc fc
[   66.544213]  ffff88007be71280: fc fc fc fc fc fc fc fc fc 00 00 00 00 00 00 00
[   66.545299] >ffff88007be71300: 00 00 00 00 00 00 00 00 00 fc fc fc fc fc fc fc
[   66.546268]                                               ^
[   66.546962]  ffff88007be71380: fc fc fc fc fc fc fc fc fc fc fc fc fc fc fc fc
[   66.547667]  ffff88007be71400: fc fc fc fc fc fc fc fc fc fc fc fc fc fc fc fc
```

**End**
