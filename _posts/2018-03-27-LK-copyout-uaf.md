---
layout: post
title: LK v4.16.x - copyout - uaf
author: zer0day
categories: lk
---

copyout - use after free *Read*

posted & found by [zer0day](https://kozistr.github.io/)

## tl;dr

Got from syzkaller & Found in LK v4.16.0-rc7. Maybe, I think it's not the one..., just happened by weird kernel options...

## Call Trace (Dump)

Here's a dump.

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
