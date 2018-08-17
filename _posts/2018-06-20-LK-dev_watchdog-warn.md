---
layout: post
title: LK v4.17.x - dev_watchdog - warn
comments: true
---

dev_watchdog - warning

posted & found by [zer0day](https://kozistr.github.io/)

## tl;dr

Got from syzkaller & Found in LK v4.17.0+.

## Call Trace (Dump)

Here's a syzkaller's report.

```c
------------[ cut here ]------------
NETDEV WATCHDOG: eth0 (e1000): transmit queue 0 timed out
WARNING: CPU: 1 PID: 0 at net/sched/sch_generic.c:461 dev_watchdog+0x919/0xa40 net/sched/sch_generic.c:460
Kernel panic - not syncing: panic_on_warn set ...

CPU: 1 PID: 0 Comm: swapper/1 Not tainted 4.17.0+ #9
Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS 1.10.2-1ubuntu1 04/01/2014
Call Trace:
 <IRQ>
 </IRQ>
Dumping ftrace buffer:
   (ftrace buffer empty)
Kernel Offset: 0x12800000 from 0xffffffff81000000 (relocation range: 0xffffffff80000000-0xffffffffbfffffff)
Rebooting in 86400 seconds..
```

## PoC

Skip!

**End**