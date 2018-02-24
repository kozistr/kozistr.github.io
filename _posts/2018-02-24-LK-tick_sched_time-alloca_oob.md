---
layout: post
title: LK - tick_sched_time - alloca out of bounds
---

tick_sched_time - alloca OOBs

posted & found by [zer0day](https://kozistr.github.io/)

## tl;dr

I just got this bug from syzkaller today on LK v4.16.0-rc2.

## Call Trace (Dump)

Here's a dump

```c
BUG: KASAN: alloca-out-of-bounds in tick_sched_handle+0x165/0x180
Read of size 8 at addr ffff880022ba7030 by task syz-executor5/3160

CPU: 0 PID: 3160 Comm: syz-executor5 Not tainted 4.16.0-rc2+ #2
Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS 1.10.2-1ubuntu1 04/01/2014
Call Trace:
 <IRQ>
 dump_stack+0x127/0x213
 print_address_description+0x60/0x22b
 kasan_report.cold.6+0xac/0x2f4
 </IRQ>

The buggy address belongs to the page:
page:ffffea00008ae9c0 count:0 mapcount:0 mapping:          (null) index:0x0
flags: 0x100000000000000()
raw: 0100000000000000 0000000000000000 0000000000000000 00000000ffffffff
raw: 0000000000000000 ffffea00008ae9e0 0000000000000000 0000000000000000
page dumped because: kasan: bad access detected

Memory state around the buggy address:
 ffff880022ba6f00: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
 ffff880022ba6f80: 00 00 00 00 00 00 00 00 00 00 00 00 ca ca ca ca
>ffff880022ba7000: 02 cb cb cb cb cb cb cb 00 00 00 00 00 00 00 00
                                     ^
 ffff880022ba7080: 00 00 00 00 00 00 00 00 00 00 00 00 00 f1 f1 f1
 ffff880022ba7100: f1 02 f2 f2 f2 f2 f2 f2 f2 00 00 00 f2 f2 f2 f2
==================================================================
Kernel panic - not syncing: panic_on_warn set ...

CPU: 0 PID: 3160 Comm: syz-executor5 Tainted: G    B            4.16.0-rc2+ #2
Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS 1.10.2-1ubuntu1 04/01/2014
Call Trace:
 <IRQ>
 dump_stack+0x127/0x213
 panic+0x1f8/0x46f
 kasan_end_report+0x43/0x49
 kasan_report.cold.6+0xc8/0x2f4
 </IRQ>
Dumping ftrace buffer:
   (ftrace buffer empty)
Kernel Offset: 0x8e00000 from 0xffffffff81000000 (relocation range: 0xffffffff80000000-0xffffffffbfffffff)
Rebooting in 86400 seconds..
2018/02/24 05:33:21 reproducing crash 'KASAN: alloca-out-of-bounds Read in tick_sched_handle': final repro crashed as (corrupted=false):
==================================================================
BUG: KASAN: alloca-out-of-bounds in tick_sched_handle+0x165/0x180
Read of size 8 at addr ffff880022ba7030 by task syz-executor5/3160

CPU: 0 PID: 3160 Comm: syz-executor5 Not tainted 4.16.0-rc2+ #2
Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS 1.10.2-1ubuntu1 04/01/2014
Call Trace:
 <IRQ>
 dump_stack+0x127/0x213
 print_address_description+0x60/0x22b
 kasan_report.cold.6+0xac/0x2f4
 </IRQ>

The buggy address belongs to the page:
page:ffffea00008ae9c0 count:0 mapcount:0 mapping:          (null) index:0x0
flags: 0x100000000000000()
raw: 0100000000000000 0000000000000000 0000000000000000 00000000ffffffff
raw: 0000000000000000 ffffea00008ae9e0 0000000000000000 0000000000000000
page dumped because: kasan: bad access detected

Memory state around the buggy address:
 ffff880022ba6f00: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
 ffff880022ba6f80: 00 00 00 00 00 00 00 00 00 00 00 00 ca ca ca ca
>ffff880022ba7000: 02 cb cb cb cb cb cb cb 00 00 00 00 00 00 00 00
                                     ^
 ffff880022ba7080: 00 00 00 00 00 00 00 00 00 00 00 00 00 f1 f1 f1
 ffff880022ba7100: f1 02 f2 f2 f2 f2 f2 f2 f2 00 00 00 f2 f2 f2 f2
==================================================================
Kernel panic - not syncing: panic_on_warn set ...

CPU: 0 PID: 3160 Comm: syz-executor5 Tainted: G    B            4.16.0-rc2+ #2
Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS 1.10.2-1ubuntu1 04/01/2014
Call Trace:
 <IRQ>
 dump_stack+0x127/0x213
 panic+0x1f8/0x46f
 kasan_end_report+0x43/0x49
 kasan_report.cold.6+0xc8/0x2f4
 </IRQ>
Dumping ftrace buffer:
   (ftrace buffer empty)
Kernel Offset: 0x8e00000 from 0xffffffff81000000 (relocation range: 0xffffffff80000000-0xffffffffbfffffff)
Rebooting in 86400 seconds..
```

## PoC

Here's a reproducible code.

```c
#define _GNU_SOURCE

#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>

void main(int argc, char *argv[]) {
	openat(0xffffffffffffff9c, "/dev/vga_arbiter\x00", 0x0, 0x0);  // openat$vga_arbiter
}
``` 

**End**