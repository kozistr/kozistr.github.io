---
layout: post
title: LK v4.16.x - iptunnel_handle_offloads - uaf
comments: true
---

iptunnel_handle_offloads - use after free *Read*

posted & found by [zer0day](https://kozistr.github.io/)

## tl;dr

Got from syzkaller & Found in LK v4.16.0-rc7. Nor verified yet, also, maybe happened by kinda options...

## Call Trace (Dump)

Here's a syzkaller report.

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