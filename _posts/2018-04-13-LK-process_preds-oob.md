---
layout: post
title: LK v4.16.x - process_preds - oobs
comments: true
---

process_preds - slab out of bounds *Write*

posted & found by [zer0day](https://kozistr.github.io/)

## tl;dr

Got from syzkaller & Found in *LK v4.16.0*. I didn't analyze yet.

Interesting one... :)

## Call Trace (Dump)

Here's syzkaller report.

```c
BUG: KASAN: slab-out-of-bounds in predicate_parse kernel/trace/trace_events_filter.c:557 [inline]
BUG: KASAN: slab-out-of-bounds in process_preds+0x14c2/0x15f0 kernel/trace/trace_events_filter.c:1505
Write of size 4 at addr ffff88007a09b038 by task syz-executor1/15737

CPU: 0 PID: 15737 Comm: syz-executor1 Not tainted 4.16.0+ #30
Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS 1.10.2-1ubuntu1 04/01/2014
Call Trace:
 __dump_stack lib/dump_stack.c:77 [inline]
 dump_stack+0x11b/0x1fd lib/dump_stack.c:113
 print_address_description+0x60/0x255 mm/kasan/report.c:256
 kasan_report_error mm/kasan/report.c:354 [inline]
 kasan_report+0x196/0x2a0 mm/kasan/report.c:412

Allocated by task 15746:
 set_track mm/kasan/kasan.c:460 [inline]
 kasan_kmalloc+0xbf/0xe0 mm/kasan/kasan.c:553
 kmem_cache_alloc_trace+0x128/0x2c0 mm/slub.c:2768
 kmalloc include/linux/slab.h:512 [inline]
 kzalloc include/linux/slab.h:701 [inline]
 sctp_add_bind_addr+0xce/0x450 net/sctp/bind_addr.c:159
 sctp_copy_local_addr_list+0x4b3/0x5e0 net/sctp/protocol.c:180
 sctp_copy_one_addr+0x4e/0x120 net/sctp/bind_addr.c:449
 sctp_bind_addr_copy+0x153/0x340 net/sctp/bind_addr.c:71
 sctp_sendmsg_new_asoc+0x34c/0xfb0 net/sctp/socket.c:1747
 sctp_sendmsg+0x144d/0x1990 net/sctp/socket.c:2096
 inet_sendmsg+0x12d/0x590 net/ipv4/af_inet.c:798
 sock_sendmsg_nosec net/socket.c:629 [inline]
 sock_sendmsg+0xc0/0x100 net/socket.c:639
 __sys_sendto+0x340/0x540 net/socket.c:1789
 SYSC_sendto net/socket.c:1801 [inline]
 SyS_sendto+0x3b/0x50 net/socket.c:1797
 do_syscall_64+0x23e/0x7a0 arch/x86/entry/common.c:287

Freed by task 14849:
 set_track mm/kasan/kasan.c:460 [inline]
 __kasan_slab_free+0x125/0x170 mm/kasan/kasan.c:521
 slab_free_hook mm/slub.c:1388 [inline]
 slab_free_freelist_hook mm/slub.c:1415 [inline]
 slab_free mm/slub.c:2988 [inline]
 kfree+0x10c/0x360 mm/slub.c:3944

The buggy address belongs to the object at ffff88007a09aea8
 which belongs to the cache kmalloc-64 of size 64
The buggy address is located 336 bytes to the right of
 64-byte region [ffff88007a09aea8, ffff88007a09aee8)
The buggy address belongs to the page:
page:ffffea0001e82680 count:1 mapcount:0 mapping:0000000000000000 index:0x0 compound_mapcount: 0
flags: 0x500000000008100(slab|head)
raw: 0500000000008100 0000000000000000 0000000000000000 0000000100130013
raw: ffffea0001f44aa0 ffffea0001f4eba0 ffff88002dc0f740 0000000000000000
page dumped because: kasan: bad access detected

Memory state around the buggy address:
 ffff88007a09af00: fc fc fc fc fc fc fc fc fc fc fc fc fc fc fc fc
 ffff88007a09af80: fc fc fc fc fc fc fc fc fc fc fc fc fc fc fc fc
>ffff88007a09b000: fc fc fc fc fc fc fc fc fc 00 00 00 00 00 00 fc
                                        ^
 ffff88007a09b080: fc fc fc fc fc fc fc fc fc fc fc fc fc fc fc fc
 ffff88007a09b100: fc fc fc fc fc fc fc fc fc fc fc fc fc fc fc fc
```

**End**
