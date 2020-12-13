---
title: Linux Kernel - 2018-03-4 Founds
date: 2018-03-24
update: 2018-03-30
tags:
  - Security
  - Linux-Kernel
keywords:
  - 0-day
  - Bug
---

## dev_hard_start_xmit - soft lockup

Found in LK v4.16.0-rc7. ```CPU#0``` stuck for 30s.

### Call Trace (Dump)

```c
[  268.822032] Modules linked in:
[  268.822287] irq event stamp: 10299
[  268.822555] hardirqs last  enabled at (10298): [<0000000006ab7d5b>] restore_regs_and_return_to_kernel+0x0/0x30
[  268.823301] hardirqs last disabled at (10299): [<000000005cde897b>] interrupt_entry+0xc0/0xe0
[  268.823941] softirqs last  enabled at (10260): [<00000000f0685d4e>] __do_softirq+0x6f6/0xa8b
[  268.824575] softirqs last disabled at (10263): [<00000000de954a09>] irq_exit+0x19b/0x1c0

[  268.832693] Call Trace:
[  268.832888]  <IRQ>
[  268.833069]  ? e1000_clean+0x1be0/0x1be0
[  268.833373]  ? packet_rcv_spkt+0x121/0x570
[  268.833689]  ? packet_mmap+0x5b0/0x5b0
[  268.833981]  ? rcutorture_record_progress+0x10/0x10
[  268.834364]  ? save_trace+0x300/0x300
[  268.834648]  ? dev_queue_xmit_nit+0x898/0xbe0
[  268.834988]  ? napi_busy_loop+0xb20/0xb20
[  268.835300]  ? __lock_is_held+0xad/0x140
[  268.835630]  dev_hard_start_xmit+0x224/0xa30
[  268.835974]  ? validate_xmit_skb_list+0x110/0x110
[  268.836335]  ? netif_skb_features+0x578/0x8a0
[  268.836674]  ? __skb_gso_segment+0x780/0x780
[  268.837006]  ? lock_acquire+0x1a5/0x4a0
[  268.837303]  ? sch_direct_xmit+0x27c/0x990
[  268.837620]  ? validate_xmit_skb.isra.113+0x3ce/0xae0
[  268.838014]  ? lock_downgrade+0x6e0/0x6e0
[  268.838332]  ? netif_skb_features+0x8a0/0x8a0
[  268.838668]  ? __local_bh_enable_ip+0xea/0x1b0
[  268.839016]  sch_direct_xmit+0x303/0x990
[  268.839323]  ? dev_watchdog+0x960/0x960
[  268.839623]  ? __lock_is_held+0xad/0x140
[  268.839931]  ? __qdisc_run+0x70a/0x16b0
[  268.840232]  ? sch_direct_xmit+0x990/0x990
[  268.840547]  ? lock_acquire+0x1a5/0x4a0
[  268.840847]  ? _raw_spin_unlock+0x1f/0x30
[  268.841155]  ? pfifo_fast_enqueue+0x372/0x590
[  268.841490]  ? mini_qdisc_pair_init+0x150/0x150
[  268.841867]  ? rcu_pm_notify+0xc0/0xc0
[  268.842171]  ? __dev_queue_xmit+0x196c/0x2660
[  268.842512]  ? netdev_pick_tx+0x260/0x260
[  268.842824]  ? ___slab_alloc+0x567/0x600
[  268.843128]  ? __alloc_skb+0x119/0x6c0
[  268.843420]  ? __lock_is_held+0xad/0x140
[  268.843729]  ? rcu_read_lock_sched_held+0xe4/0x120
[  268.844094]  ? __kmalloc_node_track_caller+0x318/0x3b0
[  268.844483]  ? __alloc_skb+0x119/0x6c0
[  268.844775]  ? memset+0x1f/0x40
[  268.845021]  ? __alloc_skb+0x50e/0x6c0
[  268.845311]  ? netdev_alloc_frag+0x80/0x80
[  268.845626]  ? print_usage_bug+0x140/0x140
[  268.845941]  ? save_trace+0x300/0x300
[  268.846274]  ? save_trace+0x300/0x300
[  268.846568]  ? memcpy+0x34/0x50
[  268.846816]  ? memset+0x1f/0x40
[  268.847064]  ? arp_create+0x623/0x860
[  268.847348]  ? ether_setup+0x2d0/0x2d0
[  268.847642]  ? arp_send_dst.part.17+0x1ad/0x220
[  268.847990]  ? arp_xmit+0x130/0x130
[  268.848264]  ? mark_held_locks+0xa8/0xf0
[  268.848569]  ? arp_solicit+0xbd9/0x1260
[  268.848871]  ? arp_rcv+0x620/0x620
[  268.849135]  ? neigh_probe+0x65/0xf0
[  268.849419]  ? memzero_explicit+0xa/0x10
[  268.849723]  ? lock_downgrade+0x6e0/0x6e0
[  268.850041]  ? crng_backtrack_protect+0x80/0x80
[  268.850397]  ? do_raw_write_trylock+0x190/0x190
[  268.850743]  ? refcount_inc_not_zero+0xf5/0x180
[  268.851090]  ? refcount_add+0x50/0x50
[  268.851377]  ? arp_rcv+0x620/0x620
[  268.851655]  ? neigh_probe+0xbb/0xf0
[  268.851933]  ? neigh_timer_handler+0x6ae/0xc70
[  268.852276]  ? __neigh_for_each_release+0x450/0x450
[  268.852650]  ? __lock_is_held+0xad/0x140
[  268.852958]  ? call_timer_fn+0x23a/0x7f0
[  268.853261]  ? __neigh_for_each_release+0x450/0x450
[  268.853633]  ? process_timeout+0x40/0x40
[  268.853935]  ? find_held_lock+0x32/0x1b0
[  268.854249]  ? __run_timers+0x688/0xa30
[  268.854547]  ? lock_acquire+0x4a0/0x4a0
[  268.854842]  ? find_held_lock+0x32/0x1b0
[  268.855145]  ? lock_downgrade+0x6e0/0x6e0
[  268.855455]  ? do_raw_spin_trylock+0x190/0x190
[  268.855802]  ? _raw_spin_unlock_irq+0x24/0x40
[  268.856134]  ? __neigh_for_each_release+0x450/0x450
[  268.856507]  ? __neigh_for_each_release+0x450/0x450
[  268.856878]  ? __run_timers+0x693/0xa30
[  268.857179]  ? msleep_interruptible+0x140/0x140
[  268.857529]  ? timerqueue_add+0x1c8/0x270
[  268.857839]  ? save_trace+0x300/0x300
[  268.858129]  ? enqueue_hrtimer+0x168/0x480
[  268.858443]  ? retrigger_next_event+0x1d0/0x1d0
[  268.858796]  ? find_held_lock+0x32/0x1b0
[  268.859113]  ? clockevents_program_event+0x124/0x2d0
[  268.859491]  ? lock_acquire+0x1a5/0x4a0
[  268.859794]  ? hrtimer_init+0x3b0/0x3b0
[  268.860103]  ? rcu_pm_notify+0xc0/0xc0
[  268.860399]  ? run_timer_softirq+0x48/0x70
[  268.860716]  ? __do_softirq+0x2a3/0xa8b
[  268.861018]  ? __irqentry_text_end+0x1f9917/0x1f9917
[  268.861398]  ? do_raw_spin_trylock+0x190/0x190
[  268.861758]  ? lapic_next_event+0x50/0x80
[  268.862067]  ? clockevents_program_event+0xff/0x2d0
[  268.862466]  ? tick_program_event+0x7e/0x100
[  268.862915]  ? hrtimer_interrupt+0x535/0x6e0
[  268.863347]  ? irq_exit+0x19b/0x1c0
[  268.863679]  ? smp_apic_timer_interrupt+0x162/0x6d0
[  268.864189]  ? smp_call_function_single_interrupt+0x650/0x650
[  268.864781]  ? smp_thermal_interrupt+0x710/0x710
[  268.865270]  ? ioapic_ir_ack_level+0xc0/0xc0
[  268.865714]  ? _raw_spin_unlock+0x1f/0x30
[  268.866080]  ? handle_fasteoi_irq+0x1d8/0x500
[  268.866515]  ? task_prio+0x50/0x50
[  268.866882]  ? trace_hardirqs_off_thunk+0x1a/0x1c
[  268.867331]  ? apic_timer_interrupt+0xf/0x20
[  268.867745]  </IRQ>
```

### Code

> Code : <br> 
> c8 00 00 00 48 c1 ea 03 48 01 c3 48 b8 00 00 00 00 00 fc ff df 0f b6 04 02 84 c0 74 08 3c 03 0f 8e 5f 2b 00 00 41 8b 47 18 89 03 <31> db e9 a7 0c 00 00 e8 6d 7e aa fe 83 fb 03 0f 86 f0 1c 00 00

```c
   0:   c8 00 00 00             enter  0x0,0x0
   4:   48 c1 ea 03             shr    rdx,0x3
   8:   48 01 c3                add    rbx,rax
   b:   48 b8 00 00 00 00 00    movabs rax,0xdffffc0000000000
  12:   fc ff df 
  15:   0f b6 04 02             movzx  eax,BYTE PTR [rdx+rax*1]
  19:   84 c0                   test   al,al
  1b:   74 08                   je     0x25
  1d:   3c 03                   cmp    al,0x3
  1f:   0f 8e 5f 2b 00 00       jle    0x2b84
  25:   41 8b 47 18             mov    eax,DWORD PTR [r15+0x18]
  29:   89 03                   mov    DWORD PTR [rbx],eax
  2b:  *31 db                   xor    ebx,ebx
  2d:   e9 a7 0c 00 00          jmp    0xcd9
  32:   e8 6d 7e aa fe          call   0xfffffffffeaa7ea4
  37:   83 fb 03                cmp    ebx,0x3
  3a:   0f 86 f0 1c 00 00       jbe    0x1d30
```

**End**




## iptunnel_handle_offloads - use after free Read

Got from syzkaller & Found in LK v4.16.0-rc7. Nor verified yet.

### Call Trace (Dump)

```c
BUG: KASAN: use-after-free in skb_is_gso include/linux/skbuff.h:4031 [inline]
BUG: KASAN: use-after-free in iptunnel_handle_offloads+0x4ee/0x620 net/ipv4/ip_tunnel_core.c:170
Read of size 2 at addr ffff88007f97986c by task syz-executor2/11467

CPU: 1 PID: 11467 Comm: syz-executor2 Not tainted 4.16.0-rc7+ #27
Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS 1.10.2-1ubuntu1 04/01/2014
Call Trace:
 __dump_stack lib/dump_stack.c:17 [inline]
 dump_stack+0x10a/0x1dd lib/dump_stack.c:53
 print_address_description+0x60/0x224 mm/kasan/report.c:256
 kasan_report_error mm/kasan/report.c:354 [inline]
 kasan_report+0x196/0x2a0 mm/kasan/report.c:412

Allocated by task 11467:
 set_track mm/kasan/kasan.c:459 [inline]
 kasan_kmalloc+0xbf/0xe0 mm/kasan/kasan.c:552
 slab_post_alloc_hook mm/slab.h:443 [inline]
 slab_alloc_node mm/slub.c:2725 [inline]
 __kmalloc_node_track_caller+0x11c/0x3b0 mm/slub.c:4338
 __kmalloc_reserve.isra.41+0x37/0xc0 net/core/skbuff.c:137
 __alloc_skb+0x119/0x6c0 net/core/skbuff.c:205
 alloc_skb include/linux/skbuff.h:983 [inline]
 alloc_skb_with_frags+0x102/0x640 net/core/skbuff.c:5227
 sock_alloc_send_pskb+0x71a/0x920 net/core/sock.c:2085
 packet_alloc_skb net/packet/af_packet.c:2803 [inline]
 packet_snd net/packet/af_packet.c:2894 [inline]
 packet_sendmsg+0x228e/0x59a0 net/packet/af_packet.c:2969
 sock_sendmsg_nosec net/socket.c:630 [inline]
 sock_sendmsg+0xc0/0x100 net/socket.c:640
 SYSC_sendto+0x33c/0x560 net/socket.c:1747
 do_syscall_64+0x23e/0x7a0 arch/x86/entry/common.c:287

Freed by task 11467:
 set_track mm/kasan/kasan.c:459 [inline]
 __kasan_slab_free+0x12c/0x170 mm/kasan/kasan.c:520
 slab_free_hook mm/slub.c:1393 [inline]
 slab_free_freelist_hook mm/slub.c:1414 [inline]
 slab_free mm/slub.c:2968 [inline]
 kfree+0xf3/0x310 mm/slub.c:3917
 skb_free_head+0x83/0xa0 net/core/skbuff.c:550
 skb_release_data+0x553/0x720 net/core/skbuff.c:570
 skb_release_all+0x46/0x60 net/core/skbuff.c:627
 __kfree_skb net/core/skbuff.c:641 [inline]
 kfree_skb+0x150/0x490 net/core/skbuff.c:659
 packet_rcv_fanout+0x219/0x7b0 net/packet/af_packet.c:1442
 dev_queue_xmit_nit+0x84f/0xbe0 net/core/dev.c:1991
 xmit_one net/core/dev.c:3022 [inline]
 dev_hard_start_xmit+0x15a/0xa30 net/core/dev.c:3042
 __dev_queue_xmit+0xe1d/0x2660 net/core/dev.c:3557

The buggy address belongs to the object at ffff88007f9797a8
 which belongs to the cache kmalloc-512 of size 512
The buggy address is located 196 bytes inside of
 512-byte region [ffff88007f9797a8, ffff88007f9799a8)
The buggy address belongs to the page:
page:ffffea0001fe5e00 count:1 mapcount:0 mapping:0000000000000000 index:0xffff88007f978a28 compound_mapcount: 0
flags: 0x500000000008100(slab|head)
raw: 0500000000008100 0000000000000000 ffff88007f978a28 0000000100120009
raw: ffffea0001e83a20 ffff88007f8014c0 ffff88002dc0ce00 0000000000000000
page dumped because: kasan: bad access detected

Memory state around the buggy address:
 ffff88007f979700: fc fc fc fc fc fc fc fc fc fc fc fc fc fc fc fc
 ffff88007f979780: fc fc fc fc fc fb fb fb fb fb fb fb fb fb fb fb
>ffff88007f979800: fb fb fb fb fb fb fb fb fb fb fb fb fb fb fb fb
                                                          ^
 ffff88007f979880: fb fb fb fb fb fb fb fb fb fb fb fb fb fb fb fb
 ffff88007f979900: fb fb fb fb fb fb fb fb fb fb fb fb fb fb fb fb
==================================================================

```

**End**


## copyout - use after free Read

Got from syzkaller & Found in LK v4.16.0-rc7.

### Call Trace (Dump)

```c
[   46.055481] BUG: KASAN: use-after-free in copyout+0x78/0xb0
[   46.056136] Read of size 10 at addr ffff88007acdefc8 by task syz-executor5/6348
[   46.056979] 
[   46.057163] CPU: 1 PID: 6348 Comm: syz-executor5 Not tainted 4.16.0-rc7+ #27
[   46.057999] Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS 1.10.2-1ubuntu1 04/01/2014
[   46.059080] Call Trace:
[   46.059411]  dump_stack+0x10a/0x1dd
[   46.059853]  ? _atomic_dec_and_lock+0x163/0x163
[   46.060422]  ? show_regs_print_info+0x12/0x12
[   46.060969]  print_address_description+0x60/0x224
[   46.061562]  kasan_report+0x196/0x2a0
[   46.062021]  ? copyout+0x78/0xb0
[   46.062452]  ? copyout+0x78/0xb0
[   46.062874]  ? _copy_to_iter+0x242/0x1220
[   46.063399]  ? futex_wake+0x528/0x630
[   46.063867]  ? check_stack_object+0x76/0x90
[   46.064402]  ? iov_iter_zero+0x1150/0x1150
[   46.064904]  ? __check_object_size+0x89/0x540
[   46.065452]  ? usercopy_warn+0xf0/0xf0
[   46.065912]  ? __skb_recv_datagram+0x1bf/0x270
[   46.066481]  ? rcu_pm_notify+0xc0/0xc0
[   46.066979]  ? skb_copy_datagram_iter+0x193/0x9c0
[   46.067591]  ? skb_recv_datagram+0xca/0x120
[   46.067951]  ? skb_kill_datagram+0x100/0x100
[   46.068356]  ? __might_fault+0x177/0x1b0
[   46.068715]  ? _copy_from_user+0x94/0x100
[   46.069059]  ? rw_copy_check_uvector+0x227/0x2f0
[   46.069522]  ? packet_recvmsg+0x252/0x14e0
[   46.069880]  ? packet_rcv_spkt+0x570/0x570
[   46.070243]  ? __might_fault+0x177/0x1b0
[   46.070679]  ? copy_msghdr_from_user+0x354/0x4f0
[   46.071181]  ? security_socket_recvmsg+0x8b/0xc0
[   46.071708]  ? packet_rcv_spkt+0x570/0x570
[   46.072153]  ? sock_recvmsg+0xc2/0x110
[   46.072573]  ? __sock_recv_wifi_status+0x1e0/0x1e0
[   46.073039]  ? ___sys_recvmsg+0x26c/0x5e0
[   46.073384]  ? SYSC_recvfrom+0x560/0x560
[   46.073751]  ? fput+0xa/0x130
[   46.074006]  ? SYSC_sendto+0x3ff/0x560
[   46.074331]  ? SYSC_connect+0x420/0x420
[   46.074691]  ? fget_raw+0x20/0x20
[   46.075055]  ? selinux_netlbl_socket_setsockopt+0xf1/0x430
[   46.075624]  ? __sys_recvmsg+0xc9/0x200
[   46.075955]  ? SyS_sendmmsg+0x50/0x50
[   46.076280]  ? SyS_futex+0x261/0x31e
[   46.076600]  ? SyS_futex+0x26a/0x31e
[   46.076927]  ? security_file_ioctl+0x76/0xb0
[   46.077299]  ? SyS_recvmsg+0x27/0x40
[   46.077618]  ? __sys_recvmsg+0x200/0x200
[   46.077957]  ? do_syscall_64+0x23e/0x7a0
[   46.078296]  ? _raw_spin_unlock_irq+0x24/0x40
[   46.078679]  ? finish_task_switch+0x1c2/0x740
[   46.079054]  ? syscall_return_slowpath+0x470/0x470
[   46.079469]  ? syscall_return_slowpath+0x2df/0x470
[   46.080003]  ? prepare_exit_to_usermode+0x330/0x330
[   46.080482]  ? entry_SYSCALL_64_after_hwframe+0x52/0xb7
[   46.081024]  ? trace_hardirqs_off_thunk+0x1a/0x1c
[   46.081488]  ? entry_SYSCALL_64_after_hwframe+0x42/0xb7
[   46.081947] 
[   46.082180] Allocated by task 6378:
[   46.082484]  kasan_kmalloc+0xbf/0xe0
[   46.082803]  __kmalloc_node_track_caller+0x11c/0x3b0
[   46.083287]  __kmalloc_reserve.isra.41+0x37/0xc0
[   46.083717]  __alloc_skb+0x119/0x6c0
[   46.084018]  alloc_skb_with_frags+0x102/0x640
[   46.084388]  sock_alloc_send_pskb+0x71a/0x920
[   46.084761]  packet_sendmsg+0x228e/0x59a0
[   46.085170]  sock_sendmsg+0xc0/0x100
[   46.085563]  SYSC_sendto+0x33c/0x560
[   46.085898]  do_syscall_64+0x23e/0x7a0
[   46.086216] 
[   46.086353] Freed by task 6378:
[   46.086702]  __kasan_slab_free+0x12c/0x170
[   46.087092]  kfree+0xf3/0x310
[   46.087352]  skb_free_head+0x83/0xa0
[   46.087685]  skb_release_data+0x553/0x720
[   46.087994]  skb_release_all+0x46/0x60
[   46.088284]  kfree_skb+0x150/0x490
[   46.088548]  sit_tunnel_xmit+0x15d/0x2e30
[   46.088984]  dev_hard_start_xmit+0x224/0xa30
[   46.089494]  __dev_queue_xmit+0xe1d/0x2660
[   46.089973] 
[   46.090160] The buggy address belongs to the object at ffff88007acdef48
[   46.090160]  which belongs to the cache kmalloc-512 of size 512
[   46.091284] The buggy address is located 128 bytes inside of
[   46.091284]  512-byte region [ffff88007acdef48, ffff88007acdf148)
[   46.092320] The buggy address belongs to the page:
[   46.092728] page:ffffea0001eb3700 count:1 mapcount:0 mapping:0000000000000000 index:0xffff88007acdd0e8 compound_mapcount: 0
[   46.093651] flags: 0x500000000008100(slab|head)
[   46.094049] raw: 0500000000008100 0000000000000000 ffff88007acdd0e8 0000000100120009
[   46.094689] raw: ffffea0001eb2120 ffff88007f8014c0 ffff88002dc0ce00 0000000000000000
[   46.095387] page dumped because: kasan: bad access detected
[   46.095914] 
[   46.096058] Memory state around the buggy address:
[   46.096461]  ffff88007acdee80: fc fc fc fc fc fc fc fc fc fc fc fc fc fc fc fc
[   46.097068]  ffff88007acdef00: fc fc fc fc fc fc fc fc fc fb fb fb fb fb fb fb
[   46.097663] >ffff88007acdef80: fb fb fb fb fb fb fb fb fb fb fb fb fb fb fb fb
[   46.098274]                                               ^
[   46.098746]  ffff88007acdf000: fb fb fb fb fb fb fb fb fb fb fb fb fb fb fb fb
[   46.099374]  ffff88007acdf080: fb fb fb fb fb fb fb fb fb fb fb fb fb fb fb fb
[   46.100056] ==================================================================

[   46.103377] Call Trace:
[   46.103632]  dump_stack+0x10a/0x1dd
[   46.103936]  ? _atomic_dec_and_lock+0x163/0x163
[   46.104325]  ? trace_hardirqs_on_thunk+0x1a/0x1c
[   46.104717]  panic+0x1b3/0x3a4
[   46.104991]  ? add_taint.cold.3+0x16/0x16
[   46.105351]  ? add_taint+0x15/0x40
[   46.105644]  ? add_taint+0x15/0x40
[   46.105938]  kasan_end_report+0x43/0x49
[   46.106358]  kasan_report.cold.5+0xb7/0xe3
[   46.106779]  copyout+0x78/0xb0
[   46.107104]  ? copyout+0x78/0xb0
[   46.107434]  ? _copy_to_iter+0x242/0x1220
...
[   46.107911]  ? futex_wake+0x528/0x630
[   46.108557]  ? check_stack_object+0x76/0x90
...
[   46.108945]  ? iov_iter_zero+0x1150/0x1150
[   46.109645]  ? __check_object_size+0x89/0x540
[   46.110092]  ? usercopy_warn+0xf0/0xf0
[   46.110549]  ? __skb_recv_datagram+0x1bf/0x270
[   46.111112]  ? rcu_pm_notify+0xc0/0xc0
[   46.111584]  ? skb_copy_datagram_iter+0x193/0x9c0
[   46.112141]  ? skb_recv_datagram+0xca/0x120
[   46.112535]  ? skb_kill_datagram+0x100/0x100
[   46.112985]  ? __might_fault+0x177/0x1b0
[   46.113499]  ? _copy_from_user+0x94/0x100
[   46.113994]  ? rw_copy_check_uvector+0x227/0x2f0
[   46.114456]  ? packet_recvmsg+0x252/0x14e0
[   46.114850]  ? packet_rcv_spkt+0x570/0x570
[   46.115314]  ? __might_fault+0x177/0x1b0
[   46.115836]  ? copy_msghdr_from_user+0x354/0x4f0
[   46.116432]  ? security_socket_recvmsg+0x8b/0xc0
[   46.116992]  ? packet_rcv_spkt+0x570/0x570
[   46.117491]  ? sock_recvmsg+0xc2/0x110
[   46.117927]  ? __sock_recv_wifi_status+0x1e0/0x1e0
[   46.118468]  ? ___sys_recvmsg+0x26c/0x5e0
[   46.118882]  ? SYSC_recvfrom+0x560/0x560
[   46.119444]  ? fput+0xa/0x130
[   46.119782]  ? SYSC_sendto+0x3ff/0x560
[   46.120224]  ? SYSC_connect+0x420/0x420
[   46.120611]  ? fget_raw+0x20/0x20
[   46.120946]  ? selinux_netlbl_socket_setsockopt+0xf1/0x430
[   46.121505]  ? __sys_recvmsg+0xc9/0x200
[   46.121892]  ? SyS_sendmmsg+0x50/0x50
[   46.122282]  ? SyS_futex+0x261/0x31e
[   46.122654]  ? SyS_futex+0x26a/0x31e
[   46.123063]  ? security_file_ioctl+0x76/0xb0
[   46.123589]  ? SyS_recvmsg+0x27/0x40
[   46.124007]  ? __sys_recvmsg+0x200/0x200
[   46.124419]  ? do_syscall_64+0x23e/0x7a0
[   46.124815]  ? _raw_spin_unlock_irq+0x24/0x40
[   46.125286]  ? finish_task_switch+0x1c2/0x740
[   46.125719]  ? syscall_return_slowpath+0x470/0x470
[   46.126212]  ? syscall_return_slowpath+0x2df/0x470
[   46.126741]  ? prepare_exit_to_usermode+0x330/0x330
[   46.127282]  ? entry_SYSCALL_64_after_hwframe+0x52/0xb7
[   46.127953]  ? trace_hardirqs_off_thunk+0x1a/0x1c
[   46.128478]  ? entry_SYSCALL_64_after_hwframe+0x42/0xb7
[   46.129062] Dumping ftrace buffer:
[   46.129406]    (ftrace buffer empty)
[   46.129773] Kernel Offset: 0x2b000000 from 0xffffffff81000000 (relocation range: 0xffffffff80000000-0xffffffffbfffffff)
[   46.130866] Rebooting in 86400 seconds..
```

**End**


## anon_vma_chain - slab padding/red zone overwritten

Got from syzkaller & Found in LK v4.16.0-rc7.

### Call Trace (Dump)

> INFO: Slab ADDR objects=18 used=18 fp=0x (null) flags=ADDR

```c
BUG anon_vma_chain (Not tainted): Padding overwritten. 0x000000006fe6e975-0x00000000d2999cdc
-----------------------------------------------------------------------------

Disabling lock debugging due to kernel taint
INFO: Slab 0x00000000b505159c objects=18 used=18 fp=0x          (null) flags=0x500000000008101
CPU: 1 PID: 12071 Comm: ip Tainted: G    B            4.16.0-rc6+ #21
Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS 1.10.2-1ubuntu1 04/01/2014
Call Trace:
 __dump_stack lib/dump_stack.c:17 [inline]
 dump_stack+0x10a/0x1dd lib/dump_stack.c:53
 slab_err+0xab/0xcf mm/slub.c:724
 slab_pad_check.part.45.cold.81+0x23/0x75 mm/slub.c:864
Padding 000000006fe6e975: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
Padding 000000004938624c: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
Padding 000000003a30b2bc: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
Padding 00000000abc764f9: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
Padding 00000000e374b01e: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
Padding 00000000ddff5969: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
Padding 000000008d39c33b: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
Padding 000000005f158a09: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
Padding 000000007427554b: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
Padding 000000002e5ffe30: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
Padding 000000002180c90a: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
Padding 000000004e6decb0: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
Padding 000000007a43f35b: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
Padding 00000000751350b0: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
Padding 00000000c53b393e: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
Padding 00000000740423c9: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
Padding 0000000028288523: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
Padding 00000000a7a07601: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
Padding 0000000033ab7532: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
Padding 00000000eb1cbbd8: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
Padding 00000000fadd1252: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
Padding 00000000a40a3d13: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
Padding 00000000752136f1: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
Padding 00000000d39d6b17: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
Padding 00000000a577fdeb: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
Padding 000000009f2fb35a: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
FIX anon_vma_chain: Restoring 0x000000006fe6e975-0x00000000d2999cdc=0x5a

=============================================================================
BUG anon_vma_chain (Tainted: G    B           ): Redzone overwritten
-----------------------------------------------------------------------------

INFO: 0x00000000d2aea25c-0x00000000b7560b65. First byte 0x0 instead of 0xcc
INFO: Slab 0x00000000b505159c objects=18 used=18 fp=0x          (null) flags=0x500000000008101
INFO: Object 0x000000009f2cb95c @offset=5624 fp=0x          (null)

Redzone 00000000d2aea25c: 00 00 00 00 00 00 00 00                          ........
Object 000000009f2cb95c: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
Object 000000008c540521: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
Object 0000000024e5d905: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
Object 0000000087d66cf6: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
Object 0000000040aaa316: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
Redzone 000000006172e99c: 00 00 00 00 00 00 00 00                          ........
Padding 00000000624f770f: 00 00 00 00 00 00 00 00                          ........
CPU: 1 PID: 12071 Comm: ip Tainted: G    B            4.16.0-rc6+ #21
Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS 1.10.2-1ubuntu1 04/01/2014
Call Trace:
 __dump_stack lib/dump_stack.c:17 [inline]
 dump_stack+0x10a/0x1dd lib/dump_stack.c:53
 check_bytes_and_report.cold.80+0x40/0x6f mm/slub.c:770
FIX anon_vma_chain: Restoring 0x00000000d2aea25c-0x00000000b7560b65=0xcc

FIX anon_vma_chain: Object at 0x000000009f2cb95c not freed
=============================================================================
BUG anon_vma_chain (Tainted: G    B           ): Redzone overwritten
-----------------------------------------------------------------------------

INFO: 0x00000000ee235c64-0x000000003480ff57. First byte 0x0 instead of 0xcc
INFO: Slab 0x00000000b505159c objects=18 used=18 fp=0x          (null) flags=0x500000000008101
INFO: Object 0x00000000660a475d @offset=8 fp=0x          (null)

Redzone 00000000ee235c64: 00 00 00 00 00 00 00 00                          ........
Object 00000000660a475d: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
Object 00000000e6e68d84: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
Object 00000000a7674d61: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
Object 00000000e5085e46: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
Object 000000003b1a98f7: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
Redzone 00000000dde82ea3: 00 00 00 00 00 00 00 00                          ........
Padding 00000000c33cf2e2: 00 00 00 00 00 00 00 00                          ........
CPU: 1 PID: 12082 Comm: sh Tainted: G    B            4.16.0-rc6+ #21
Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS 1.10.2-1ubuntu1 04/01/2014
Call Trace:
 __dump_stack lib/dump_stack.c:17 [inline]
 dump_stack+0x10a/0x1dd lib/dump_stack.c:53
 check_bytes_and_report.cold.80+0x40/0x6f mm/slub.c:770
FIX anon_vma_chain: Restoring 0x00000000ee235c64-0x000000003480ff57=0xcc

FIX anon_vma_chain: Object at 0x00000000660a475d not freed
=============================================================================
BUG anon_vma_chain (Tainted: G    B           ): Redzone overwritten
-----------------------------------------------------------------------------

INFO: 0x000000005f350485-0x0000000076389ac8. First byte 0x0 instead of 0xcc
INFO: Slab 0x00000000b505159c objects=18 used=18 fp=0x          (null) flags=0x500000000008101
INFO: Object 0x0000000015376e75 @offset=5192 fp=0x          (null)

Redzone 000000005f350485: 00 00 00 00 00 00 00 00                          ........
Object 0000000015376e75: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
Object 00000000f0e35b16: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
Object 0000000030f1a66b: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
Object 000000007ac4d59f: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
Object 000000008924595b: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
Redzone 00000000d93f0449: 00 00 00 00 00 00 00 00                          ........
Padding 0000000052bc5876: 00 00 00 00 00 00 00 00                          ........
CPU: 0 PID: 12097 Comm: modprobe Tainted: G    B            4.16.0-rc6+ #21
Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS 1.10.2-1ubuntu1 04/01/2014
Call Trace:
 __dump_stack lib/dump_stack.c:17 [inline]
 dump_stack+0x10a/0x1dd lib/dump_stack.c:53
 check_bytes_and_report.cold.80+0x40/0x6f mm/slub.c:770
FIX anon_vma_chain: Restoring 0x000000005f350485-0x0000000076389ac8=0xcc

FIX anon_vma_chain: Object at 0x0000000015376e75 not freed
=============================================================================
BUG anon_vma_chain (Tainted: G    B           ): Redzone overwritten
-----------------------------------------------------------------------------

INFO: 0x0000000090d05828-0x00000000640c301f. First byte 0x0 instead of 0xcc
INFO: Slab 0x00000000b505159c objects=18 used=18 fp=0x          (null) flags=0x500000000008101
INFO: Object 0x00000000c3a2e01a @offset=2168 fp=0x          (null)

Redzone 0000000090d05828: 00 00 00 00 00 00 00 00                          ........
Object 00000000c3a2e01a: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
Object 00000000d974dda9: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
Object 00000000d6a18047: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
Object 00000000c5c1e97d: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
Object 0000000024798423: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
Redzone 000000009b3bd61d: 00 00 00 00 00 00 00 00                          ........
Padding 000000001712f520: 00 00 00 00 00 00 00 00                          ........
CPU: 1 PID: 12113 Comm: modprobe Tainted: G    B            4.16.0-rc6+ #21
Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS 1.10.2-1ubuntu1 04/01/2014
Call Trace:
 __dump_stack lib/dump_stack.c:17 [inline]
 dump_stack+0x10a/0x1dd lib/dump_stack.c:53
 check_bytes_and_report.cold.80+0x40/0x6f mm/slub.c:770
FIX anon_vma_chain: Restoring 0x0000000090d05828-0x00000000640c301f=0xcc

FIX anon_vma_chain: Object at 0x00000000c3a2e01a not freed
=============================================================================
BUG kmalloc-64 (Tainted: G    B           ): Padding overwritten. 0x00000000e2e92ca3-0x00000000de7fbde8
-----------------------------------------------------------------------------

INFO: Slab 0x0000000010fbf3d8 objects=19 used=19 fp=0x          (null) flags=0x500000000008101
CPU: 1 PID: 12160 Comm: modprobe Tainted: G    B            4.16.0-rc6+ #21
Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS 1.10.2-1ubuntu1 04/01/2014
Call Trace:
 __dump_stack lib/dump_stack.c:17 [inline]
 dump_stack+0x10a/0x1dd lib/dump_stack.c:53
 slab_err+0xab/0xcf mm/slub.c:724
 slab_pad_check.part.45.cold.81+0x23/0x75 mm/slub.c:864
Padding 00000000e2e92ca3: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
Padding 000000003b73d901: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
Padding 00000000e1534de7: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
Padding 000000009cad5477: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
Padding 000000003b32512b: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
Padding 0000000066d813c6: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
Padding 00000000d0266b36: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
Padding 000000000bb47526: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
Padding 00000000e0046aa9: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
Padding 00000000020f9edd: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
Padding 00000000fa9d2db1: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
Padding 000000001f39e3a5: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
Padding 000000003da23d9d: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
Padding 000000006882d379: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
Padding 0000000013778799: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
Padding 000000000b973d86: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
Padding 000000000e58426f: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
Padding 00000000f2649fb2: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
FIX kmalloc-64: Restoring 0x00000000e2e92ca3-0x00000000de7fbde8=0x5a

=============================================================================
BUG kmalloc-64 (Tainted: G    B           ): Redzone overwritten
-----------------------------------------------------------------------------

INFO: 0x0000000084bd3121-0x00000000edba746e. First byte 0x0 instead of 0xcc
INFO: Slab 0x0000000010fbf3d8 objects=19 used=19 fp=0x          (null) flags=0x500000000008101
INFO: Object 0x000000003d33a159 @offset=6248 fp=0x          (null)

Redzone 0000000084bd3121: 00 00 00 00 00 00 00 00                          ........
Object 000000003d33a159: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
Object 000000003dbc71c6: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
Object 00000000aef4ebae: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
Object 00000000d8014f8b: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
Redzone 0000000005f86c21: 00 00 00 00 00 00 00 00                          ........
Padding 0000000035d8a4ed: 00 00 00 00 00 00 00 00                          ........
CPU: 1 PID: 12160 Comm: modprobe Tainted: G    B            4.16.0-rc6+ #21
Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS 1.10.2-1ubuntu1 04/01/2014
Call Trace:
 __dump_stack lib/dump_stack.c:17 [inline]
 dump_stack+0x10a/0x1dd lib/dump_stack.c:53
 check_bytes_and_report.cold.80+0x40/0x6f mm/slub.c:770
FIX kmalloc-64: Restoring 0x0000000084bd3121-0x00000000edba746e=0xcc

FIX kmalloc-64: Object at 0x000000003d33a159 not freed
=============================================================================
BUG kmalloc-64 (Tainted: G    B           ): Redzone overwritten
-----------------------------------------------------------------------------

INFO: 0x00000000f8dca494-0x0000000099d1331e. First byte 0x0 instead of 0xcc
INFO: Slab 0x0000000010fbf3d8 objects=19 used=19 fp=0x          (null) flags=0x500000000008101
INFO: Object 0x0000000053a1a9e8 @offset=840 fp=0x          (null)

Redzone 00000000f8dca494: 00 00 00 00 00 00 00 00                          ........
Object 0000000053a1a9e8: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
Object 0000000007841875: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
Object 000000000e92da29: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
Object 000000004ae2b4f0: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
Redzone 00000000d40f7f3a: 00 00 00 00 00 00 00 00                          ........
Padding 000000003da1fdd4: 00 00 00 00 00 00 00 00                          ........
CPU: 1 PID: 12023 Comm: syz-executor0 Tainted: G    B            4.16.0-rc6+ #21
Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS 1.10.2-1ubuntu1 04/01/2014
Call Trace:
 __dump_stack lib/dump_stack.c:17 [inline]
 dump_stack+0x10a/0x1dd lib/dump_stack.c:53
 check_bytes_and_report.cold.80+0x40/0x6f mm/slub.c:770
FIX kmalloc-64: Restoring 0x00000000f8dca494-0x0000000099d1331e=0xcc

FIX kmalloc-64: Object at 0x0000000053a1a9e8 not freed
=============================================================================
BUG kmalloc-64 (Tainted: G    B           ): Redzone overwritten
-----------------------------------------------------------------------------

INFO: 0x00000000d7a78f15-0x0000000055e37950. First byte 0x0 instead of 0xcc
INFO: Slab 0x0000000010fbf3d8 objects=19 used=19 fp=0x          (null) flags=0x500000000008101
INFO: Object 0x000000006aa17a7d @offset=6664 fp=0x          (null)

Redzone 00000000d7a78f15: 00 00 00 00 00 00 00 00                          ........
Object 000000006aa17a7d: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
Object 000000005951e69c: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
Object 00000000151f58dd: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
Object 000000007b7e4602: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
Redzone 00000000ed905c40: 00 00 00 00 00 00 00 00                          ........
Padding 000000003045bfb1: 00 00 00 00 00 00 00 00                          ........
CPU: 1 PID: 12023 Comm: syz-executor0 Tainted: G    B            4.16.0-rc6+ #21
Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS 1.10.2-1ubuntu1 04/01/2014
Call Trace:
 __dump_stack lib/dump_stack.c:17 [inline]
 dump_stack+0x10a/0x1dd lib/dump_stack.c:53
 check_bytes_and_report.cold.80+0x40/0x6f mm/slub.c:770
FIX kmalloc-64: Restoring 0x00000000d7a78f15-0x0000000055e37950=0xcc

FIX kmalloc-64: Object at 0x000000006aa17a7d not freed
=============================================================================
BUG task_struct (Tainted: G    B           ): Padding overwritten. 0x00000000f74e5132-0x0000000051a28b29
```

**End**


