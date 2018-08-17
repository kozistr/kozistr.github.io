---
layout: post
title: LK v4.17.x - kmem_cache_alloc - general page fault
author: zer0day
categories: lk
---

kmem_cache_alloc - general page fault

posted & found by [zer0day](https://kozistr.github.io/)

## tl;dr

Found on LK v4.17.0+. leaded to null-dereference. Not analyzed yet...

## Call Trace (Dump)

Here's a syzkaller's report.

```c
kasan: CONFIG_KASAN_INLINE enabled
kasan: GPF could be caused by NULL-ptr deref or user memory access
general protection fault: 0000 [#1] SMP KASAN PTI
CPU: 0 PID: 30860 Comm: modprobe Not tainted 4.17.0+ #9
Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS 1.10.2-1ubuntu1 04/01/2014
RIP: 0010:prefetch_freepointer mm/slub.c:275 [inline]
RIP: 0010:slab_alloc_node mm/slub.c:2701 [inline]
RIP: 0010:slab_alloc mm/slub.c:2716 [inline]
RIP: 0010:kmem_cache_alloc+0xb0/0x290 mm/slub.c:2721
Code: 00 49 8b 1c 04 40 f6 c7 0f 0f 85 9e 01 00 00 48 8d 4a 01 4c 89 e0 65 48 0f c7 0f 0f 94 c0 84 c0 74 b0 48 85 db 74 0a 8b 45 20 <48> 8b 04 03 0f 18 08 41 f7 c5 00 80 00 00 0f 85 20 01 00 00 8b 1d 
RSP: 0018:ffff880041797ba8 EFLAGS: 00010206
RAX: 0000000000000000 RBX: 20007e0e00000a21 RCX: 0000000000067974
RDX: 0000000000067973 RSI: 00000000006000c0 RDI: 000000000002fb40
RBP: ffff88006cdfb080 R08: ffff88006d02fb40 R09: 0000000000000003
R10: 0000000000000001 R11: ffff8800417978f8 R12: ffff880045a61108
R13: 00000000006000c0 R14: ffffffffb7f62a37 R15: 0000000000000000
FS:  0000000000000000(0000) GS:ffff88006d000000(0000) knlGS:0000000000000000
CS:  0010 DS: 0000 ES: 0000 CR0: 0000000080050033
CR2: 00007f316cd22db8 CR3: 000000002c19a000 CR4: 00000000000006f0
DR0: 0000000020000000 DR1: 0000000020000000 DR2: 0000000000000000
DR3: 0000000000000000 DR6: 00000000ffff0ff0 DR7: 0000000000000600
```

## Code

Skip!

**End**
