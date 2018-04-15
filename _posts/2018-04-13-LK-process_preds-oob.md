---
layout: post
title: LK v4.16.x - process_preds - oobs
comments: true
---

process_preds - slab out of bounds *Write*

posted & found by [zer0day](https://kozistr.github.io/)

## tl;dr

Found in *LK v4.16.0*. Interesting one... :)

## Call Trace (Dump)

Here's dmesg.

```c
zero@zer0day:/tmp$ uname -a
Linux zer0day 4.16.0+ #30 SMP Fri Apr 13 14:35:45 KST 2018 x86_64 GNU/Linux
zero@zer0day:/tmp$ id
uid=1000(zero) gid=1000(zero) groups=1000(zero)
zero@zer0day:/tmp$ gcc -o poc poc.c
zero@zer0day:/tmp$ ./poc
[  123.540060] ==================================================================
[  123.541879] BUG: KASAN: slab-out-of-bounds in process_preds+0x14c2/0x15f0
[  123.543111] Write of size 4 at addr ffff8800672544c0 by task poc/2770
[  123.544485] 
[  123.544813] CPU: 1 PID: 2770 Comm: poc Not tainted 4.16.0+ #30
...
[  123.643127] BUG: unable to handle kernel paging request at ffff87f93e164984
[  123.644861] PGD 0 P4D 0 
[  123.645532] Oops: 0000 [#1] SMP KASAN PTI
[  123.646535] Modules linked in:
[  123.647309] CPU: 1 PID: 2770 Comm: poc Tainted: G    B             4.16.0+ #30
[  123.649070] Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS 1.10.2-1ubuntu1 04/01/2014
...
```

**End**
