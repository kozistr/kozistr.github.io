---
layout: post
title: LK v4.16.x - skb_release_data - uaf
comments: true
---

skb_release_data - use after free *Write*

posted & found by [zer0day](https://kozistr.github.io/)

## tl;dr

Got from syzkaller & Found in LK v4.16.0. I didn't analyze yet..

## Call Trace (Dump)

Here's a syzkaller report.

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

## PoC

*Skip~*

[2018-04-10] Maybe, it is *reproducible* under some conditions..:( So it needs more works to be generic PoC. 

**End**