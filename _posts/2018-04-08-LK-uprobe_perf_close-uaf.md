---
layout: post
title: LK v4.16.x - uprobe_perf_close - uaf
author: zer0day
categories: lk
---

uprobe_perf_close - use after free *Read*

posted & found by [zer0day](https://kozistr.github.io/)

## tl;dr

Got from syzkaller & Found in LK v4.16.0. I didn't analyze yet..

## Call Trace (Dump)

Here's a syzkaller report.

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
