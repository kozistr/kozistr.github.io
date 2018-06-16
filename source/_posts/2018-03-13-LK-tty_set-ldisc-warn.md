---
layout: post
title: LK v4.16.x - tty_set_ldisc - warn
comments: true
---

tty_set_ldisc - warn

posted & found by [zer0day](https://kozistr.github.io/)

## tl;dr

Got from syzkaller & Found in *LK v4.16.0-rc5* with enabling ```CONFIG_FAULT_INJECTION```.

Just anther maybe meaningless posting :)

## Call Trace (Dump)

Here's a dmesg.

```c
WARNING: CPU: 0 PID: 2567 at drivers/tty/tty_ldisc.c:531 tty_ldisc_restore drivers/tty/tty_ldisc.c:531 [inline]
WARNING: CPU: 0 PID: 2567 at drivers/tty/tty_ldisc.c:531 tty_set_ldisc+0x1d6/0x2c0 drivers/tty/tty_ldisc.c:599
Kernel panic - not syncing: panic_on_warn set ...

CPU: 0 PID: 2567 Comm: syz-executor0 Not tainted 4.16.0-rc5+ #12
Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS 1.10.2-1ubuntu1 04/01/2014
Call Trace:
 __dump_stack lib/dump_stack.c:17 [inline]
 dump_stack+0xb9/0x11b lib/dump_stack.c:53
 panic+0x10a/0x2d6 kernel/panic.c:183
 __warn.cold.6+0x108/0x10f kernel/panic.c:547
Dumping ftrace buffer:
   (ftrace buffer empty)
Kernel Offset: 0x26e00000 from 0xffffffff81000000 (relocation range: 0xffffffff80000000-0xffffffffbfffffff)
Rebooting in 86400 seconds..
```

## PoC

There's no reproducible code from syz-repro, but repro-log.

```c
# {Threaded:true Collide:false Repeat:false Procs:1 Sandbox:setuid Fault:true FaultCall:5 FaultNth:1 EnableTun:true UseTmpDir:true HandleSegv:true WaitRepeat:false Debug:false Repro:false}
r0 = openat$ptmx(0xffffffffffffff9c, &(0x7f0000000180)='/dev/ptmx\x00', 0x0, 0x0)
ioctl$TCXONC(r0, 0x40045431, 0x6f7000)
poll(&(0x7f0000000080)=[{r0}], 0x1, 0x80000000)
ioctl$TIOCPKT(r0, 0x5420, &(0x7f0000000040)=0x7)
r1 = syz_open_pts(r0, 0x0)
ioctl$TIOCSETD(r1, 0x5423, &(0x7f0000000000)=0x2)
```

**End**