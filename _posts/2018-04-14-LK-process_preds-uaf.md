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

Here's syzkaller report.

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
```

**End**