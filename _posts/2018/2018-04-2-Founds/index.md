---
title: Linux Kernel - 2018-04-2 Founds
date: 2018-04-02
update: 2018-04-07
tags:
  - Security
  - Linux-Kernel
keywords:
  - 0-day
  - Bug
---

## skb_release_data - use after free Write

Got from syzkaller & Found in LK v4.16.0.

[2018-04-10] Maybe, it is *reproducible* under some conditions :( So it needs more works to be generic PoC.

### Call Trace (Dump)

```c
BUG: KASAN: use-after-free in atomic_sub_return include/asm-generic/atomic-instrumented.h:258 [inline]
BUG: KASAN: use-after-free in skb_release_data+0x15f/0x740 net/core/skbuff.c:559
Write of size 4 at addr ffff880079c4f6e8 by task syz-executor4/16207

CPU: 1 PID: 16207 Comm: syz-executor4 Not tainted 4.16.0+ #28
Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS 1.10.2-1ubuntu1 04/01/2014
Call Trace:
 __dump_stack lib/dump_stack.c:17 [inline]
 dump_stack+0x11b/0x201 lib/dump_stack.c:53
 print_address_description+0x60/0x224 mm/kasan/report.c:256
 kasan_report_error mm/kasan/report.c:354 [inline]
 kasan_report+0x196/0x2a0 mm/kasan/report.c:412

Allocated by task 16207:
 set_track mm/kasan/kasan.c:459 [inline]
 kasan_kmalloc+0xbf/0xe0 mm/kasan/kasan.c:552
 slab_post_alloc_hook mm/slab.h:443 [inline]
 slab_alloc_node mm/slub.c:2725 [inline]
 __kmalloc_node_track_caller+0x11c/0x3b0 mm/slub.c:4338
 __kmalloc_reserve.isra.41+0x37/0xc0 net/core/skbuff.c:137
 __alloc_skb+0x11b/0x6c0 net/core/skbuff.c:205
 alloc_skb include/linux/skbuff.h:987 [inline]
 alloc_skb_with_frags+0x102/0x640 net/core/skbuff.c:5248
 sock_alloc_send_pskb+0x743/0x950 net/core/sock.c:2088
 packet_alloc_skb net/packet/af_packet.c:2803 [inline]
 packet_snd net/packet/af_packet.c:2894 [inline]
 packet_sendmsg+0x22a1/0x5960 net/packet/af_packet.c:2969
 sock_sendmsg_nosec net/socket.c:629 [inline]
 sock_sendmsg+0xc0/0x100 net/socket.c:639
 __sys_sendto+0x340/0x540 net/socket.c:1789
 SYSC_sendto net/socket.c:1801 [inline]
 SyS_sendto+0x3b/0x50 net/socket.c:1797
 do_syscall_64+0x23e/0x7a0 arch/x86/entry/common.c:287

Freed by task 16207:
 set_track mm/kasan/kasan.c:459 [inline]
 __kasan_slab_free+0x12c/0x170 mm/kasan/kasan.c:520
 slab_free_hook mm/slub.c:1393 [inline]
 slab_free_freelist_hook mm/slub.c:1414 [inline]
 slab_free mm/slub.c:2968 [inline]
 kfree+0xf3/0x310 mm/slub.c:3917
 skb_free_head+0x83/0xa0 net/core/skbuff.c:550
 skb_release_data+0x57d/0x740 net/core/skbuff.c:570
 skb_release_all+0x46/0x60 net/core/skbuff.c:627
 __kfree_skb net/core/skbuff.c:641 [inline]
 consume_skb+0x153/0x490 net/core/skbuff.c:701
 packet_rcv+0x152/0x1570 net/packet/af_packet.c:2162
 dev_queue_xmit_nit+0x84f/0xbe0 net/core/dev.c:2018
 xmit_one net/core/dev.c:3049 [inline]
 dev_hard_start_xmit+0x15a/0xa30 net/core/dev.c:3069
 __dev_queue_xmit+0xe2f/0x2680 net/core/dev.c:3584

The buggy address belongs to the object at ffff880079c4f608
 which belongs to the cache kmalloc-512 of size 512
The buggy address is located 224 bytes inside of
 512-byte region [ffff880079c4f608, ffff880079c4f808)
The buggy address belongs to the page:
page:ffffea0001e71300 count:1 mapcount:0 mapping:0000000000000000 index:0xffff880079c4f968 compound_mapcount: 0
flags: 0x500000000008100(slab|head)
raw: 0500000000008100 0000000000000000 ffff880079c4f968 0000000100120010
raw: ffffea0001e55620 ffff88007f8014c0 ffff88002dc0ce00 0000000000000000
page dumped because: kasan: bad access detected

Memory state around the buggy address:
 ffff880079c4f580: fc fc fc fc fc fc fc fc fc fc fc fc fc fc fc fc
 ffff880079c4f600: fc fb fb fb fb fb fb fb fb fb fb fb fb fb fb fb
>ffff880079c4f680: fb fb fb fb fb fb fb fb fb fb fb fb fb fb fb fb
                                                          ^
 ffff880079c4f700: fb fb fb fb fb fb fb fb fb fb fb fb fb fb fb fb
 ffff880079c4f780: fb fb fb fb fb fb fb fb fb fb fb fb fb fb fb fb
```


## uprobe_perf_close - use after free Read

Got from syzkaller & Found in LK v4.16.0.

### Call Trace (Dump)

```c
BUG: KASAN: use-after-free in uprobe_perf_close+0x3de/0x520 kernel/trace/trace_uprobe.c:1048
Read of size 4 at addr ffff88007a4baf0c by task syzkaller591669/2952

CPU: 1 PID: 2952 Comm: syzkaller591669 Not tainted 4.16.0+ #28
Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS 1.10.2-1ubuntu1 04/01/2014
Call Trace:
 __dump_stack lib/dump_stack.c:17 [inline]
 dump_stack+0x11b/0x201 lib/dump_stack.c:53
 print_address_description+0x60/0x224 mm/kasan/report.c:256
 kasan_report_error mm/kasan/report.c:354 [inline]
 kasan_report+0x196/0x2a0 mm/kasan/report.c:412

Allocated by task 2952:
 set_track mm/kasan/kasan.c:459 [inline]
 kasan_kmalloc+0xbf/0xe0 mm/kasan/kasan.c:552
 slab_post_alloc_hook mm/slab.h:443 [inline]
 slab_alloc_node mm/slub.c:2725 [inline]
 kmem_cache_alloc_node+0x125/0x2f0 mm/slub.c:2761
 alloc_task_struct_node kernel/fork.c:157 [inline]
 dup_task_struct kernel/fork.c:770 [inline]
 copy_process.part.47+0x159a/0x2730 kernel/fork.c:1631
 copy_process kernel/fork.c:1606 [inline]
 _do_fork+0x208/0x1000 kernel/fork.c:2087
 do_syscall_64+0x23e/0x7a0 arch/x86/entry/common.c:287

Freed by task 9:
 set_track mm/kasan/kasan.c:459 [inline]
 __kasan_slab_free+0x12c/0x170 mm/kasan/kasan.c:520
 slab_free_hook mm/slub.c:1393 [inline]
 slab_free_freelist_hook mm/slub.c:1414 [inline]
 slab_free mm/slub.c:2968 [inline]
 kmem_cache_free+0xbf/0x2e0 mm/slub.c:2990
 free_task_struct kernel/fork.c:162 [inline]
 free_task+0x142/0x1b0 kernel/fork.c:391
 __put_task_struct+0x2a4/0x580 kernel/fork.c:657
 put_task_struct include/linux/sched/task.h:96 [inline]
 delayed_put_task_struct+0x2f7/0x3d0 kernel/exit.c:180
 __rcu_reclaim kernel/rcu/rcu.h:178 [inline]
 rcu_do_batch kernel/rcu/tree.c:2675 [inline]
 invoke_rcu_callbacks kernel/rcu/tree.c:2930 [inline]
 __rcu_process_callbacks kernel/rcu/tree.c:2897 [inline]
 rcu_process_callbacks+0xb29/0x25b0 kernel/rcu/tree.c:2914
 __do_softirq+0x2a3/0xa8b kernel/softirq.c:285

The buggy address belongs to the object at ffff88007a4baec0
 which belongs to the cache task_struct of size 5504
The buggy address is located 76 bytes inside of
 5504-byte region [ffff88007a4baec0, ffff88007a4bc440)
The buggy address belongs to the page:
page:ffffea0001e92e00 count:1 mapcount:0 mapping:0000000000000000 index:0x0 compound_mapcount: 0
flags: 0x500000000008100(slab|head)
raw: 0500000000008100 0000000000000000 0000000000000000 0000000100050005
raw: ffffea0001f32a20 ffff88007f835960 ffff88007f85c040 0000000000000000
page dumped because: kasan: bad access detected

Memory state around the buggy address:
 ffff88007a4bae00: fc fc fc fc fc fc fc fc fc fc fc fc fc fc fc fc
 ffff88007a4bae80: fc fc fc fc fc fc fc fc fb fb fb fb fb fb fb fb
>ffff88007a4baf00: fb fb fb fb fb fb fb fb fb fb fb fb fb fb fb fb
                      ^
 ffff88007a4baf80: fb fb fb fb fb fb fb fb fb fb fb fb fb fb fb fb
 ffff88007a4bb000: fb fb fb fb fb fb fb fb fb fb fb fb fb fb fb fb
```

**End**


## alloc_vmap_area - unable to handle kernel paging request

Found on LK v4.16.0. Seems weird...

### Call Trace (Dump)

```c
[  420.823887] BUG: unable to handle kernel paging request at ffffffffffffffd0
[  420.824743] PGD 29e24067 P4D 29e24067 PUD 29e26067 PMD 0 
[  420.825278] Oops: 0000 [#1] SMP KASAN PTI
[  420.825627] Dumping ftrace buffer:
[  420.825932]    (ftrace buffer empty)
[  420.826243] Modules linked in:
[  420.826507] CPU: 1 PID: 2313 Comm: poc Tainted: G    B            4.16.0+ #28
[  420.827179] Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS 1.10.2-1ubuntu1 04/01/2014
[  420.827905] RIP: 0010:alloc_vmap_area+0x2eb/0x820
[  420.828341] RSP: 0018:ffff880024c37750 EFLAGS: 00010213
[  420.828812] RAX: 1ffffffffffffffa RBX: ffffffffffffffd0 RCX: ffffffffb96ce6f4
[  420.829424] RDX: 0000000000000000 RSI: 0000000000000004 RDI: ffff880079c323b8
[  420.830008] RBP: 0000000000002000 R08: fffffbfff792f555 R09: fffffbfff792f554
[  420.830667] R10: ffffffffbc97aaa3 R11: 1ffffffff792f554 R12: 0000000000000000
[  420.831289] R13: dffffc0000000000 R14: 0000000000000000 R15: 0000000000000000
[  420.831928] FS:  0000000000cb8940(0000) GS:ffff88007fc00000(0000) knlGS:0000000000000000
[  420.832693] CS:  0010 DS: 0000 ES: 0000 CR0: 0000000080050033
[  420.833228] CR2: ffffffffffffffd0 CR3: 0000000019976000 CR4: 00000000000006e0
[  420.833827] DR0: 0000000020000100 DR1: 0000000020000100 DR2: 0000000000000000
[  420.834455] DR3: 0000000000000000 DR6: 00000000fffe0ff0 DR7: 0000000000000600
[  420.835040] Call Trace:
[  420.835286]  ? purge_vmap_area_lazy+0x40/0x40
[  420.835654]  ? __get_vm_area_node+0xab/0x340
[  420.836048]  ? kmem_cache_alloc_node_trace+0x169/0x300
[  420.836514]  ? __get_vm_area_node+0xe5/0x340
[  420.836883]  ? __vmalloc_node_range+0xaf/0x6d0
[  420.837290]  ? alloc_counters.isra.10+0xad/0x6b0
[  420.837682]  ? __might_fault+0x104/0x1b0
[  420.838047]  ? alloc_counters.isra.10+0xad/0x6b0
[  420.838452]  ? vzalloc+0x63/0x80
[  420.838745]  ? alloc_counters.isra.10+0xad/0x6b0
[  420.839131]  ? alloc_counters.isra.10+0xad/0x6b0
[  420.839547]  ? __lockdep_init_map+0xdf/0x4d0
[  420.839896]  ? ipt_error+0x20/0x20
[  420.840203]  ? xt_find_table_lock+0x108/0x3e0
[  420.840582]  ? do_ipt_get_ctl+0x6c1/0x9e0
[  420.840911]  ? module_unload_free+0x510/0x510
[  420.841309]  ? get_info+0x610/0x610
[  420.841596]  ? lock_acquire+0x1a5/0x4a0
[  420.841928]  ? lock_acquire+0x4a0/0x4a0
[  420.842279]  ? lock_downgrade+0x6e0/0x6e0
[  420.842630]  ? __do_page_fault+0x302/0xb70
[  420.842988]  ? nf_getsockopt+0x62/0xc0
[  420.843332]  ? ip_getsockopt+0x14e/0x1f0
[  420.843680]  ? do_ip_getsockopt+0x1fd0/0x1fd0
[  420.844046]  ? sock_alloc_file+0x28e/0x4c0
[  420.844448]  ? tcp_getsockopt+0x7b/0xc0
[  420.844848]  ? __sys_getsockopt+0x153/0x310
[  420.845282]  ? up_read+0x17/0x110
[  420.845674]  ? kernel_setsockopt+0x1b0/0x1b0
[  420.846125]  ? __sys_socket+0x156/0x1f0
[  420.846458]  ? security_file_ioctl+0x76/0xb0
[  420.846818]  ? syscall_slow_exit_work+0x400/0x400
[  420.847222]  ? SyS_getsockopt+0x32/0x40
[  420.847544]  ? __sys_getsockopt+0x310/0x310
[  420.847893]  ? do_syscall_64+0x23e/0x7a0
[  420.848223]  ? trace_hardirqs_on_thunk+0x1a/0x1c
[  420.848610]  ? syscall_return_slowpath+0x470/0x470
[  420.849075]  ? __do_page_fault+0x39a/0xb70
[  420.849428]  ? syscall_return_slowpath+0x2df/0x470
[  420.849852]  ? prepare_exit_to_usermode+0x330/0x330
[  420.850274]  ? prepare_exit_to_usermode+0x22b/0x330
[  420.850699]  ? perf_trace_sys_enter+0xc30/0xc30
[  420.851101]  ? trace_hardirqs_off_thunk+0x1a/0x1c
[  420.851513]  ? entry_SYSCALL_64_after_hwframe+0x42/0xb7
[  420.852062] Code: 60 aa 97 bc 0f 84 55 02 00 00 49 8d 5c 24 d0 e8 dc 19 d4 ff 48 89 d8 48 c1 e8 03 42 80 3c 28 00 0f 85 75 04 00 00 48 3b 6c 24 10 <4d> 8b 64 24 d0 0f 87 29 02 00 00 4c 39 e5 0f 86 20 02 00 00 e8 
[  420.854196] RIP: alloc_vmap_area+0x2eb/0x820 RSP: ffff880024c37750
[  420.854875] CR2: ffffffffffffffd0
[  420.855247] ---[ end trace efc5824732863059 ]---
[  420.855755] Kernel panic - not syncing: Fatal exception
[  420.856303] Dumping ftrace buffer:
[  420.856645]    (ftrace buffer empty)
[  420.856980] Kernel Offset: 0x38000000 from 0xffffffff81000000 (relocation range: 0xffffffff80000000-0xffffffffbfffffff)
[  420.857911] Rebooting in 86400 seconds..
```

### Code

```c
   0:   60                      (bad)  
   1:   aa                      stos   BYTE PTR es:[rdi],al
   2:   97                      xchg   edi,eax
   3:   bc 0f 84 55 02          mov    esp,0x255840f
   8:   00 00                   add    BYTE PTR [rax],al
   a:   49 8d 5c 24 d0          lea    rbx,[r12-0x30]
   f:   e8 dc 19 d4 ff          call   0xffffffffffd419f0
  14:   48 89 d8                mov    rax,rbx
  17:   48 c1 e8 03             shr    rax,0x3
  1b:   42 80 3c 28 00          cmp    BYTE PTR [rax+r13*1],0x0
  20:   0f 85 75 04 00 00       jne    0x49b
  26:   48 3b 6c 24 10          cmp    rbp,QWORD PTR [rsp+0x10]
  2b:  *4d 8b 64 24 d0          mov    r12,QWORD PTR [r12-0x30]
  30:   0f 87 29 02 00 00       ja     0x25f
  36:   4c 39 e5                cmp    rbp,r12
  39:   0f 86 20 02 00 00       jbe    0x25f
  3f:   e8                      .byte 0xe8
```



## xxx - memory leak

Found on LK v4.16.x. Leaked bytes seem like the part of the Kprobe-tracing event logs.

```c
> /sys/kernel/debug/tracing/events/kprobes/myprobe/format
...
print fmt: "(%lx) dfd=%lx filename=%lx flags=%lx mode=%lx", REC->__probe_ip,
REC->dfd, REC->filename, REC->flags, REC->mode
...
```

Maybe,`that file cannot be opened without *root* perm, but its contents just leaked with Medium IL...

Of course, enabling some ops to support kprobe stuff so that using kprobe-tracing.

### Call Trace (Dump)

```c
[   98.213278] kmemleak: 1 new suspected memory leaks (see /sys/kernel/debug/kmemleak)
[  104.438838] kmemleak: 2 new suspected memory leaks (see /sys/kernel/debug/kmemleak)
...
  hex dump (first 32 bytes):
    22 28 25 6c 78 29 22 2c 20 52 45 43 2d 3e 5f 5f  "(%lx)", REC->__
    70 72 6f 62 65 5f 69 70 00 6b 6b 6b 6b 6b 6b a5  probe_ip.kkkkkk.
```

**End**


## process_preds - slab out of bounds Write / use after free Read/Write

Found in *LK v4.16.0*.

### Call Trace (Dump)

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

