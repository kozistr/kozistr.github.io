---
layout: post
title: LK v4.17.x - __sctp_v6_cmp_addr - oobs
author: zer0day
categories: lk
---

__sctp_v6_cmp_addr - slab out of bounds *Read*

posted & found by [zer0day](https://kozistr.github.io/)

## tl;dr

Found in *LK v4.17.0-rc1*.

slab-out-of-bounds in __sctp_v6_cmp_addr, 8 bytes read.

## Demo Log

```c
zero@zer0day:/tmp$ gcc -o poc poc.c
zero@zer0day:/tmp$ ./poc
[   53.074578] ==================================================================
[   53.077133] BUG: KASAN: slab-out-of-bounds in __sctp_v6_cmp_addr+0x3e4/0x440
[   53.079233] Read of size 8 at addr ffff880066c03530 by task poc/2777
[   53.081111] 
[   53.081589] CPU: 1 PID: 2777 Comm: poc Not tainted 4.17.0-rc1+ #34
[   53.083186] Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS 1.10.2-1ubuntu1 04/01/2014
[   53.085896] Call Trace:
[   53.086652]  dump_stack+0x11b/0x1fd
[   53.087714]  ? dump_stack_print_info.cold.0+0x81/0x81
[   53.089250]  ? kmsg_dump_rewind_nolock+0xd9/0xd9
[   53.090597]  ? sctp_bind_addr_conflict+0xf5/0x450
[   53.091913]  print_address_description+0x60/0x255
[   53.093161]  kasan_report+0x196/0x2a0
[   53.094020]  ? __sctp_v6_cmp_addr+0x3e4/0x440
[   53.095031]  ? __sctp_v6_cmp_addr+0x3e4/0x440
[   53.096037]  ? sctp_inet6_cmp_addr+0x12c/0x170
[   53.097070]  ? sctp_bind_addr_conflict+0x25c/0x450
[   53.098160]  ? sctp_bind_addr_match+0x3b0/0x3b0
[   53.099339]  ? sctp_get_port_local+0x884/0x1320
[   53.100532]  ? sctp_set_owner_w+0x4f0/0x4f0
[   53.101680]  ? rcu_is_watching+0x81/0x130
[   53.102749]  ? inet_addr_type+0x250/0x360
[   53.103853]  ? sctp_bind_addr_match+0x280/0x3b0
[   53.105093]  ? sctp_bind_addrs_to_raw+0x310/0x310
[   53.106378]  ? sctp_v4_available+0xee/0x1c0
[   53.107552]  ? sctp_do_bind+0x259/0x680
[   53.108612]  ? sctp_bindx_add+0x93/0x1b0
[   53.109767]  ? sctp_setsockopt_bindx+0x16c/0x2e0
[   53.111023]  ? sctp_setsockopt+0x251b/0x61d0
[   53.112119]  ? __lock_acquire+0x9f2/0x4840
[   53.112977]  ? sctp_setsockopt_paddr_thresholds+0x4e0/0x4e0
[   53.114445]  ? unwind_next_frame+0x11c2/0x1d10
[   53.115618]  ? __save_stack_trace+0x59/0xf0
[   53.116740]  ? debug_check_no_locks_freed+0x210/0x210
[   53.118064]  ? do_syscall_64+0x148/0x5d0
[   53.119163]  ? unwind_next_frame+0x286/0x1d10
[   53.120400]  ? __x64_sys_socket+0x6f/0xb0
[   53.121504]  ? deref_stack_reg+0x110/0x110
[   53.122664]  ? find_held_lock+0x32/0x1b0
[   53.123787]  ? __save_stack_trace+0x7d/0xf0
[   53.124999]  ? do_syscall_64+0x148/0x5d0
[   53.126094]  ? save_stack+0x89/0xb0
[   53.127069]  ? kasan_kmalloc+0xbf/0xe0
[   53.128071]  ? kmem_cache_alloc+0xf0/0x2b0
[   53.129086]  ? selinux_file_alloc_security+0xa9/0x180
[   53.130808]  ? security_file_alloc+0x42/0x90
[   53.132377]  ? get_empty_filp+0x194/0x4e0
[   53.133657]  ? alloc_file+0x24/0x3a0
[   53.135352]  ? sock_alloc_file+0x1f5/0x4c0
[   53.136794]  ? __sys_socket+0x136/0x1f0
[   53.138026]  ? __x64_sys_socket+0x6f/0xb0
[   53.139260]  ? do_syscall_64+0x148/0x5d0
[   53.140431]  ? create_object+0x7b2/0xb40
[   53.141664]  ? start_scan_thread+0x70/0x70
[   53.142866]  ? selinux_file_alloc_security+0xa9/0x180
[   53.144341]  ? debug_mutex_init+0x17/0x60
[   53.145512]  ? save_trace+0x300/0x300
[   53.146648]  ? debug_mutex_init+0x28/0x60
[   53.147752]  ? __mutex_init+0x1e0/0x260
[   53.148740]  ? housekeeping_affine+0x20/0x20
[   53.149854]  ? find_held_lock+0x32/0x1b0
[   53.150944]  ? __fd_install+0x267/0x6e0
[   53.152013]  ? lock_acquire+0x4a0/0x4a0
[   53.153035]  ? lock_downgrade+0x6e0/0x6e0
[   53.154083]  ? rcu_is_watching+0x81/0x130
[   53.155140]  ? sock_has_perm+0x275/0x370
[   53.156171]  ? selinux_secmark_relabel_packet+0xc0/0xc0
[   53.157567]  ? fget_raw+0x20/0x20
[   53.158481]  ? selinux_netlbl_socket_setsockopt+0xf1/0x430
[   53.159909]  ? selinux_netlbl_sock_rcv_skb+0x600/0x600
[   53.161257]  ? selinux_socket_setsockopt+0x5d/0x70
[   53.162504]  ? __sys_setsockopt+0x160/0x340
[   53.163592]  ? kernel_accept+0x2f0/0x2f0
[   53.164657]  ? __sys_socket+0x156/0x1f0
[   53.165680]  ? lock_acquire+0x4a0/0x4a0
[   53.166683]  ? __x64_sys_setsockopt+0xba/0x150
[   53.167834]  ? do_syscall_64+0x148/0x5d0
[   53.168834]  ? syscall_return_slowpath+0x470/0x470
[   53.170045]  ? syscall_return_slowpath+0x2df/0x470
[   53.171320]  ? prepare_exit_to_usermode+0x330/0x330
[   53.172597]  ? entry_SYSCALL_64_after_hwframe+0x59/0xbe
[   53.174020]  ? trace_hardirqs_off_thunk+0x1a/0x1c
[   53.175280]  ? entry_SYSCALL_64_after_hwframe+0x49/0xbe
[   53.176729] 
[   53.177195] Allocated by task 2777:
[   53.178120]  kasan_kmalloc+0xbf/0xe0
[   53.179056]  __kmalloc_node+0x14a/0x4a0
[   53.180062]  kvmalloc_node+0xa2/0xe0
[   53.181051]  vmemdup_user+0x28/0x90
[   53.181992]  sctp_setsockopt_bindx+0x5b/0x2e0
[   53.183087]  sctp_setsockopt+0x251b/0x61d0
[   53.184136] 
[   53.184542] Freed by task 1186:
[   53.185433]  __kasan_slab_free+0x125/0x170
[   53.186504]  kfree+0x10c/0x360
[   53.187290] 
[   53.187714] The buggy address belongs to the object at ffff880066c03520
[   53.187714]  which belongs to the cache kmalloc-16 of size 16
[   53.190837] The buggy address is located 0 bytes to the right of
[   53.190837]  16-byte region [ffff880066c03520, ffff880066c03530)
[   53.193987] The buggy address belongs to the page:
[   53.195253] page:ffffea00019b0080 count:1 mapcount:0 mapping:0000000000000000 index:0x0 compound_mapcount: 0
[   53.197773] flags: 0x100000000008100(slab|head)
[   53.198972] raw: 0100000000008100 0000000000000000 0000000000000000 0000000100160016
[   53.200961] raw: ffffea000199d8a0 ffff880066c004a0 ffff880066c0fa00 0000000000000000
[   53.202891] page dumped because: kasan: bad access detected
[   53.204040] 
[   53.204407] Memory state around the buggy address:
[   53.205733]  ffff880066c03400: fc fc fc fc fc fc fc fc fc fc fc fc fc fc fc fc
[   53.208193]  ffff880066c03480: fc fc fc fc fc fc fc fc fc fc fc fc fc fc fc fc
[   53.210926] >ffff880066c03500: fc fc fc fc 00 00 fc fc fc fc fc fc fc fc fc fc
[   53.213639]                                      ^
[   53.215473]  ffff880066c03580: fc fc fc fc fc fc fc fc fc fc fc fc fc fc fc fc
[   53.218217]  ffff880066c03600: fc fc fc fc fc fc fc fc fc fc fc fc fc fc fc fc
[   53.220957] ==================================================================
[   53.223428] Disabling lock debugging due to kernel taint

Message from syslogd@zer0day at Apr 21 11:06:20 ...
 kernel:[   53.195253] page:ffffea00019b0080 count:1 mapcount:0 mapping:0000000000000000 index:0x0 compound_mapcount: 0

Message from syslogd@zer0day at Apr 21 11:06:20 ...
 kernel:[   53.197773] flags: 0x100000000008100(slab|head)

zero@zer0day:/tmp$ uname -a
Linux zer0day 4.17.0-rc1+ #34 SMP Sat Apr 21 17:01:13 KST 2018 x86_64 GNU/Linux
```

**End**
