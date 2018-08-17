---
layout: post
title: LK v4.17.x - qlist_free_all - kernel paging request
comments: true
---

qlist_free_all - unable to handle kernel paging request

posted & found by [zer0day](https://kozistr.github.io/)

## tl;dr

Found on LK v4.17.0+.

## Call Trace (Dump)

Here's a syzkaller's report.

```c
BUG: unable to handle kernel paging request at 00000be050002008
PGD 0 P4D 0 
Oops: 0000 [#1] SMP KASAN PTI
CPU: 0 PID: 10987 Comm: udevd Not tainted 4.17.0+ #9
Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS 1.10.2-1ubuntu1 04/01/2014
RIP: 0010:virt_to_head_page include/linux/mm.h:638 [inline]
RIP: 0010:qlink_to_cache mm/kasan/quarantine.c:127 [inline]
RIP: 0010:qlist_free_all+0x7b/0xc0 mm/kasan/quarantine.c:163
Code: df 48 85 db 75 db 48 89 f0 4c 01 f0 72 54 4c 89 fa 48 2b 15 d7 bf 3e 03 48 01 d0 48 c1 e8 0c 48 c1 e0 06 48 03 05 b5 bf 3e 03 <48> 8b 50 08 48 8d 4a ff 83 e2 01 48 0f 45 c1 48 8b 78 18 eb a2 49 
RSP: 0018:ffff880063eef8f0 EFLAGS: 00010207
RAX: 00000be050002000 RBX: 0000000000000000 RCX: 0000000000000000
RDX: 000077ff80000000 RSI: 0008001400080004 RDI: 0000000000000000
RBP: 0008001400080004 R08: 0000000000000001 R09: 0000000000000000
R10: 0000000000000000 R11: 0000000000000001 R12: ffffffffa99fd7d2
R13: ffff880063eef928 R14: 0000000080000000 R15: ffffffff80000000
FS:  00007f9b8de627a0(0000) GS:ffff88006d000000(0000) knlGS:0000000000000000
CS:  0010 DS: 0000 ES: 0000 CR0: 0000000080050033
CR2: 00000be050002008 CR3: 0000000067e9e000 CR4: 00000000000006f0
```

## Code

```c
L A T E R
```

## PoC

Skip~

**End**