---
layout: post
title: LK v4.17.x - set_precision - warn
author: zer0day
categories: lk
---

set_precision - warning

posted & found by [zer0day](https://kozistr.github.io/)

## tl;dr

Got from syzkaller & Found in LK v4.17.0+.

## Call Trace (Dump)

Here's a dmesg.

```c
...
precision 1047645 too large
WARNING: CPU: 0 PID: 12208 at lib/vsprintf.c:2164 set_precision+0xb8/0xe0 lib/vsprintf.c:2164
Kernel panic - not syncing: panic_on_warn set ...

CPU: 0 PID: 12208 Comm: syz-executor14 Not tainted 4.17.0+ #9
Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS 1.10.2-1ubuntu1 04/01/2014
Call Trace:
Dumping ftrace buffer:
   (ftrace buffer empty)
Kernel Offset: 0x8200000 from 0xffffffff81000000 (relocation range: 0xffffffff80000000-0xffffffffbfffffff)
...
```

## PoC

Later...

**End**
