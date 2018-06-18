---
layout: post
title: LK v4.17.x - rb_insert_color - general page fault
comments: true
---

rb_insert_color - general page fault

posted & found by [zer0day](https://kozistr.github.io/)

## tl;dr

Found on LK v4.17.0+. leaded to null-dereference. Not analyzed yet...

## Call Trace (Dump)

Here's a report.

```c
kasan: CONFIG_KASAN_INLINE enabled
kasan: GPF could be caused by NULL-ptr deref or user memory access
general protection fault: 0000 [#1] SMP KASAN PTI
CPU: 0 PID: 2795 Comm: poc Not tainted 4.17.0+ #9
Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS 1.10.2-1ubuntu1 04/01/2014
RIP: 0010:rb_insert_color+0x17e/0x1010
Code: 22 09 00 00 49 8b 2c 24 40 f6 c5 01 0f 85 0a 02 00 00 49 bf 00 00 00 00 00 fc ff df 48 8d 45 08 48 89 e9 48 89 c2 48 c1 ea 03 <42> 80 3c 3a 00 0f 85 c8 08 00 00 4c 8b 75 08 4d 39 e6 0f 84 35 02
RSP: 0018:ffff88006bfdec88 EFLAGS: 00010002
RAX: 0000000000000008 RBX: 1ffff1000d7fbd95 RCX: 0000000000000000
RDX: 0000000000000001 RSI: ffffffffb413c640 RDI: ffff88006b932bf8
RBP: 0000000000000000 R08: fffffbfff6571e2d R09: ffff88006bf4ea50
R10: fffffbfff6571e2c R11: ffffffffb2b8f163 R12: ffff88006bf4ea50
R13: ffff88006b932bf8 R14: 0000000000000246 R15: dffffc0000000000
FS:  000000000166c880(0000) GS:ffff88006d000000(0000) knlGS:0000000000000000
CS:  0010 DS: 0000 ES: 0000 CR0: 0000000080050033
CR2: 00007fff25499b98 CR3: 000000006c210000 CR4: 00000000000006f0
```

## Code

Skip!

**End**
