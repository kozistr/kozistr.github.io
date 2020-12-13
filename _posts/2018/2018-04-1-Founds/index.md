---
title: Linux Kernel - 2018-04-1 Founds
date: 2018-04-02
update: 2018-04-07
tags:
  - Security
  - Linux-Kernel
keywords:
  - 0-day
  - Bug
---

## anon_vma_chain - memory leak

Found in LK v4.16.0-rc7.

### Call Trace (Dump)

```c
[  171.804669] kmemleak: 1 new suspected memory leaks (see /sys/kernel/debug/kmemleak)
[  178.286239] kmemleak: 1 new suspected memory leaks (see /sys/kernel/debug/kmemleak)
...

  hex dump (first 32 bytes):
    00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
    00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
```

**End**



## kmalloc-1024 - slab padding/red zone overwritten

Got from syzkaller & Found in LK v4.16.0-rc7.

### Call Trace (Dump)

> BUG kmalloc-1024 (Not tainted): Padding overwritten. 0x000000007f0b2d60-0x00000000dd7f0dc3

```c
BUG kmalloc-1024 (Not tainted): Padding overwritten. 0x000000007f0b2d60-0x00000000dd7f0dc3
-----------------------------------------------------------------------------

INFO: Slab 0x0000000063ffd7ff objects=23 used=23 fp=0x          (null) flags=0x100000000008100
CPU: 0 PID: 1483 Comm: kworker/u7:2 Tainted: G    B            4.16.0-rc7+ #27
Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS 1.10.2-1ubuntu1 04/01/2014
Workqueue: writeback wb_workfn (flush-8:0)
Call Trace:
 __dump_stack lib/dump_stack.c:17 [inline]
 dump_stack+0x10a/0x1dd lib/dump_stack.c:53
 slab_err+0xab/0xcf mm/slub.c:724
 slab_pad_check.part.45.cold.81+0x23/0x75 mm/slub.c:864
Padding 000000007f0b2d60: 7c 43 ff ff 6c 68 00 00 4c 45 ff ff d4 68 00 00  |C..lh..LE...h..
Padding 000000003af22bbd: 6c 46 ff ff 24 69 00 00 dc 46 ff ff 3c 69 00 00  lF..$i...F..<i..
Padding 00000000b50ac743: 4c 47 ff ff 7c 69 00 00 bc 48 ff ff cc 69 00 00  LG..|i...H...i..
Padding 0000000030bf91d5: ac 4a ff ff 1c 6a 00 00 2c 4b ff ff 34 6a 00 00  .J...j..,K..4j..
Padding 00000000bc619d2c: 4c 4c ff ff 7c 6a 00 00 6c 4c ff ff 94 6a 00 00  LL..|j..lL...j..
Padding 00000000701b8583: 7c 4c ff ff ac 6a 00 00 8c 4c ff ff c4 6a 00 00  |L...j...L...j..
Padding 00000000df9b3224: dc 4c ff ff ec 6a 00 00 1c 4d ff ff 0c 6b 00 00  .L...j...M...k..
Padding 0000000098785f2a: bc 4d ff ff 34 6b 00 00 cc 4d ff ff 4c 6b 00 00  .M..4k...M..Lk..
Padding 00000000f5631e10: 5c 4e ff ff 74 6b 00 00 6c 4e ff ff 8c 6b 00 00  \N..tk..lN...k..
Padding 00000000fc83404a: 7c 4e ff ff a4 6b 00 00 8c 4e ff ff bc 6b 00 00  |N...k...N...k..
Padding 00000000cc48aadc: 9c 4e ff ff d4 6b 00 00 3c 4f ff ff fc 6b 00 00  .N...k..<O...k..
Padding 00000000847141b5: 4c 4f ff ff 14 6c 00 00 ec 4f ff ff 3c 6c 00 00  LO...l...O..<l..
Padding 000000008f8c53f2: fc 4f ff ff 54 6c 00 00 9c 50 ff ff 7c 6c 00 00  .O..Tl...P..|l..
Padding 00000000cf546a42: ac 50 ff ff 94 6c 00 00 0c 51 ff ff e4 6c 00 00  .P...l...Q...l..
Padding 00000000d4eca897: 2c 52 ff ff 0c 6d 00 00 7c 53 ff ff 74 6d 00 00  ,R...m..|S..tm..
Padding 00000000a02c95f5: 5c 54 ff ff 9c 6d 00 00 dc 54 ff ff dc 6d 00 00  \T...m...T...m..
Padding 000000002d310f31: 8c 55 ff ff fc 6d 00 00 fc 55 ff ff 34 6e 00 00  .U...m...U..4n..
Padding 00000000fafd1dc9: 1c 57 ff ff 84 6e 00 00 9c 5c ff ff ec 6e 00 00  .W...n...\...n..
Padding 00000000bcb78224: 1c 66 ff ff 3c 6f 00 00 6c 66 ff ff 5c 6f 00 00  .f..<o..lf..\o..
Padding 000000008bb546c8: 7c 66 ff ff 74 6f 00 00 4c 67 ff ff 9c 6f 00 00  |f..to..Lg...o..
Padding 000000007443e4a8: 5c 68 ff ff fc 6f 00 00 7c 68 ff ff 14 70 00 00  \h...o..|h...p..
Padding 000000009f2c9fb7: 0c 69 ff ff 3c 70 00 00 5c 6a ff ff 9c 70 00 00  .i..<p..\j...p..
Padding 0000000012fab070: cc 6a ff ff b4 70 00 00 dc 6a ff ff cc 70 00 00  .j...p...j...p..
Padding 00000000c3c1ff6f: ec 6a ff ff e4 70 00 00 9c 6b ff ff 0c 71 00 00  .j...p...k...q..
Padding 000000009e70e7bc: 8c 6c ff ff 3c 71 00 00 2c 6d ff ff 64 71 00 00  .l..<q..,m..dq..
Padding 00000000fa87c884: 4c 6e ff ff b4 71 00 00 fc 6e ff ff ec 71 00 00  Ln...q...n...q..
Padding 0000000099e55e6b: ec 6f ff ff 24 72 00 00 4c 70 ff ff 4c 72 00 00  .o..$r..Lp..Lr..
Padding 000000000ada5079: 0c 71 ff ff 74 72 00 00 5c 71 ff ff 9c 72 00 00  .q..tr..\q...r..
Padding 00000000eb83fdc1: dc 73 ff ff cc 72 00 00 5c 74 ff ff ec 72 00 00  .s...r..\t...r..
Padding 000000002c60ed6f: dc 75 ff ff 24 73 00 00 dc 77 ff ff 54 73 00 00  .u..$s...w..Ts..
Padding 00000000e1c20d9f: ec 78 ff ff 7c 73 00 00 1c 7b ff ff ac 73 00 00  .x..|s...{...s..
Padding 0000000057727abe: 3c 7c ff ff f4 73 00 00 2c 7e ff ff 44 74 00 00  <|...s..,~..Dt..
Padding 00000000843e5549: fc 7e ff ff 94 74 00 00 dc 7f ff ff bc 74 00 00  .~...t.......t..
Padding 0000000099ac4b9b: 9c 80 ff ff e4 74 00 00 dc 84 ff ff 14 75 00 00  .....t.......u..
Padding 00000000aed5f95a: 4c 86 ff ff 64 75 00 00 1c 88 ff ff b4 75 00 00  L...du.......u..
Padding 00000000cca14eaa: 14 00 00 00 00 00 00 00 01 7a 52 00 01 78 10 01  .........zR..x..
Padding 0000000013d0cab9: 1b 0c 07 08 90 01 00 00 24 00 00 00 1c 00 00 00  ........$.......
Padding 000000000fadbec6: 20 c0 fc ff c0 02 00 00 00 0e 10 46 0e 18 4a 0f   ..........F..J.
Padding 000000009562ce88: 0b 77 08 80 00 3f 1a 3b 2a 33 24 22 00 00 00 00  .w...?.;*3$"....
Padding 00000000eb0a5ed7: 4c 00 00 00 44 00 00 00 18 c9 fc ff 35 02 00 00  L...D.......5...
Padding 00000000def647b9: 00 42 0e 10 8f 02 45 0e 18 8e 03 45 0e 20 8d 04  .B....E....E. ..
Padding 0000000053c6234e: 42 0e 28 8c 05 44 0e 30 86 06 44 0e 38 83 07 47  B.(..D.0..D.8..G
Padding 0000000077e484a6: 0e 80 01 03 6e 01 0a 0e 38 44 0e 30 41 0e 28 42  ....n...8D.0A.(B
Padding 000000005ff2f3cf: 0e 20 42 0e 18 42 0e 10 42 0e 08 48 0b 00 00 00  . B..B..B..H....
Padding 0000000096f4153f: 4c 00 00 00 94 00 00 00 08 cb fc ff 92 02 00 00  L...............
Padding 00000000d2d9949e: 00 42 0e 10 8f 02 45 0e 18 8e 03 42 0e 20 8d 04  .B....E....B. ..
Padding 000000009d5f7ebd: 42 0e 28 8c 05 44 0e 30 86 06 41 0e 38 83 07 46  B.(..D.0..A.8..F
Padding 00000000e8a1ffd1: 0e a0 01 02 63 0a 0e 38 43 0e 30 41 0e 28 42 0e  ....c..8C.0A.(B.
Padding 000000005631cf1d: 20 42 0e 18 42 0e 10 42 0e 08 41 0b 00 00 00 00   B..B..B..A.....
Padding 00000000706ffa28: 34 00 00 00 e4 00 00 00 58 cd fc ff 77 00 00 00  4.......X...w...
Padding 0000000050c8bdc3: 00 41 0e 10 86 02 44 0e 18 83 03 44 0e 20 02 57  .A....D....D. .W
Padding 00000000a32c239e: 0a 0e 18 41 0e 10 41 0e 08 4e 0b 44 0e 18 41 0e  ...A..A..N.D..A.
Padding 0000000015759079: 10 41 0e 08 00 00 00 00 14 00 00 00 1c 01 00 00  .A..............
Padding 0000000003cacb1b: a0 cd fc ff 0f 00 00 00 00 00 00 00 00 00 00 00  ................
Padding 000000008606175c: 1c 00 00 00 34 01 00 00 98 cd fc ff 82 00 00 00  ....4...........
Padding 000000003c098351: 00 44 0e 10 83 02 02 6f 0a 0e 08 4d 0b 41 0e 08  .D.....o...M.A..
Padding 00000000764b030a: 34 00 00 00 54 01 00 00 08 ce fc ff ca 00 00 00  4...T...........
Padding 0000000082e4ce0a: 00 42 0e 10 8c 02 46 0e 18 86 03 41 0e 20 83 04  .B....F....A. ..
Padding 00000000fb72479f: 02 96 0a 0e 18 44 0e 10 42 0e 08 4b 0b 53 0e 18  .....D..B..K.S..
Padding 00000000e21bacdb: 44 0e 10 42 0e 08 00 00 34 00 00 00 8c 01 00 00  D..B....4.......
Padding 00000000d0aef8fc: a0 ce fc ff 4f 00 00 00 00 41 0e 10 86 02 44 0e  ....O....A....D.
Padding 000000009cf8ba3d: 18 83 03 44 0e 20 6f 0a 0e 18 44 0e 10 41 0e 08  ...D. o...D..A..
Padding 00000000b9b64409: 4b 0b 44 0e 18 41 0e 10 41 0e 08 00 00 00 00 00  K.D..A..A.......
Padding 000000009b867efb: 1c 00 00 00 c4 01 00 00 b8 ce fc ff 23 00 00 00  ............#...
Padding 000000000be125de: 00 44 0e 10 83 02 5e 0e 08 00 00 00 00 00 00 00  .D....^.........
Padding 00000000782485b6: 1c 00 00 00 e4 01 00 00 c8 ce fc ff 38 00 00 00  ............8...
Padding 00000000e2a0117f: 00 41 0e 10 83 02 4a 0e 20 6b 0e 10 41 0e 08 00  .A....J. k..A...
Padding 0000000000968500: 24 00 00 00 04 02 00 00 e8 ce fc ff 77 00 00 00  $...........w...
Padding 0000000015dc235c: 00 44 0e 10 83 02 68 0a 0e 08 44 0b 7b 0a 0e 08  .D....h...D.{...
Padding 00000000ce2d98dc: 45 0b 46 0e 08 00 00 00 24 00 00 00 2c 02 00 00  E.F.....$...,...
FIX kmalloc-1024: Restoring 0x000000007f0b2d60-0x00000000dd7f0dc3=0x5a

BUG kmalloc-1024 (Tainted: G    B           ): Redzone overwritten
-----------------------------------------------------------------------------

INFO: 0x000000003c0d68da-0x000000006627d529. First byte 0x74 instead of 0xbb
INFO: Allocated in 0x6c6365642064656c age=4288204118 cpu=1634755954 pid=1650419058
	0x736e6f6974617261
	0x206c61636f6c2027
	0x2e6261746d7973
INFO: Freed in 0x79706f635f746163 age=4294825300 cpu=1633902457 pid=1633840236
	0x6361626c6c61635f
	0x6b
INFO: Slab 0x0000000063ffd7ff objects=23 used=23 fp=0x          (null) flags=0x100000000008100
INFO: Object 0x0000000004edb325 @offset=15144 fp=0x00000000ecd1348d

Redzone 000000003c0d68da: 74 79 70 65 2c 20 62 75                          type, bu
Object 0000000004edb325: 74 20 69 74 20 77 61 73 20 61 6c 72 65 61 64 79  t it was already
Object 00000000335eaff7: 20 64 65 63 6c 61 72 65 64 20 61 73 20 61 6e 20   declared as an 
Object 00000000fa3716c7: 61 74 74 72 69 62 75 74 65 2e 00 00 00 00 00 00  attribute.......
Object 000000003a0538c8: 62 61 73 65 5f 72 6f 6c 65 20 21 3d 20 28 28 76  base_role != ((v
Object 00000000d6826906: 6f 69 64 20 2a 29 30 29 20 26 26 20 62 61 73 65  oid *)0) && base
Object 00000000540c71c0: 5f 72 6f 6c 65 2d 3e 66 6c 61 76 6f 72 20 3d 3d  _role->flavor ==
Object 0000000094207091: 20 31 00 00 00 00 00 00 6e 65 77 5f 74 79 70 65   1......new_type
Object 0000000041e18a90: 20 21 3d 20 28 28 76 6f 69 64 20 2a 29 30 29 20   != ((void *)0) 
Object 00000000a53fc715: 26 26 20 6e 65 77 5f 74 79 70 65 2d 3e 66 6c 61  && new_type->fla
Object 000000004007c881: 76 6f 72 20 3d 3d 20 31 00 00 00 00 00 00 00 00  vor == 1........
Object 00000000c52a713f: 43 6f 75 6c 64 20 6e 6f 74 20 66 69 6e 64 20 73  Could not find s
Object 000000008bb09284: 63 6f 70 65 20 69 6e 66 6f 72 6d 61 74 69 6f 6e  cope information
Object 000000009ccd8411: 20 66 6f 72 20 63 6c 61 73 73 20 25 73 00 00 00   for class %s...
Object 00000000f070a0bd: 54 61 72 67 65 74 20 6f 66 20 6c 69 6e 6b 20 77  Target of link w
Object 0000000051096b90: 61 73 20 6e 6f 74 20 61 20 62 61 73 65 20 70 6f  as not a base po
Object 00000000c678acb4: 6c 69 63 79 2e 00 00 00 54 72 69 65 64 20 74 6f  licy....Tried to
Object 00000000ea86d450: 20 6c 69 6e 6b 20 69 6e 20 61 20 70 6f 6c 69 63   link in a polic
Object 00000000dfb1963b: 79 20 74 68 61 74 20 77 61 73 20 6e 6f 74 20 61  y that was not a
Object 000000004319a8ca: 20 6d 6f 64 75 6c 65 2e 00 00 00 00 00 00 00 00   module.........
Object 0000000099034a51: 54 72 69 65 64 20 74 6f 20 6c 69 6e 6b 20 69 6e  Tried to link in
Object 000000009169cdf9: 20 61 20 6e 6f 6e 2d 4d 4c 53 20 6d 6f 64 75 6c   a non-MLS modul
Object 000000001b02449a: 65 20 77 69 74 68 20 61 6e 20 4d 4c 53 20 62 61  e with an MLS ba
Object 000000003efa1ff3: 73 65 2e 00 00 00 00 00 54 72 69 65 64 20 74 6f  se......Tried to
Object 000000005e541e59: 20 6c 69 6e 6b 20 69 6e 20 61 6e 20 4d 4c 53 20   link in an MLS 
Object 00000000fbb78863: 6d 6f 64 75 6c 65 20 77 69 74 68 20 61 20 6e 6f  module with a no
Object 000000008f5b63ad: 6e 2d 4d 4c 53 20 62 61 73 65 2e 00 00 00 00 00  n-MLS base......
Object 00000000be018c8f: 45 72 72 6f 72 20 77 68 69 6c 65 20 6e 6f 72 6d  Error while norm
Object 00000000e88c5bf6: 61 6c 69 7a 69 6e 67 20 63 6f 6e 64 69 74 69 6f  alizing conditio
Object 00000000d5490613: 6e 61 6c 73 20 77 69 74 68 69 6e 20 74 68 65 20  nals within the 
Object 00000000c03832ba: 6d 6f 64 75 6c 65 20 25 73 2e 00 00 00 00 00 00  module %s.......
Object 000000007ac42efb: 45 72 72 6f 72 20 77 68 69 6c 65 20 6e 6f 72 6d  Error while norm
Object 00000000cf6d9ddb: 61 6c 69 7a 69 6e 67 20 63 6f 6e 64 69 74 69 6f  alizing conditio
Object 00000000483b542f: 6e 61 6c 73 20 77 69 74 68 69 6e 20 74 68 65 20  nals within the 
Object 000000009a2837d6: 62 61 73 65 20 6d 6f 64 75 6c 65 2e 00 00 00 00  base module.....
Object 00000000e8da9592: 6d 6f 64 75 6c 65 2d 3e 6d 61 70 5b 35 5d 5b 63  module->map[5][c
Object 0000000057d7664e: 75 72 5f 65 78 70 72 2d 3e 62 6f 6f 6c 20 2d 20  ur_expr->bool - 
Object 00000000f0accf04: 31 5d 20 21 3d 20 30 00 44 65 74 65 72 6d 69 6e  1] != 0.Determin
Object 0000000091805bc8: 69 6e 67 20 77 68 69 63 68 20 61 76 72 75 6c 65  ing which avrule
Object 00000000c4c00959: 73 20 74 6f 20 65 6e 61 62 6c 65 2e 00 00 00 00  s to enable.....
Object 000000004415bfe0: 25 73 27 73 20 67 6c 6f 62 61 6c 20 72 65 71 75  %s's global requ
Object 0000000046e460da: 69 72 65 6d 65 6e 74 73 20 77 65 72 65 20 6e 6f  irements were no
Object 00000000cdbe3b78: 74 20 6d 65 74 3a 20 63 6c 61 73 73 20 25 73 2c  t met: class %s,
Object 00000000523806bf: 20 70 65 72 6d 69 73 73 69 6f 6e 20 25 73 00 00   permission %s..
Object 00000000d16a59a5: 25 73 27 73 20 67 6c 6f 62 61 6c 20 72 65 71 75  %s's global requ
Object 00000000917c2eca: 69 72 65 6d 65 6e 74 73 20 77 65 72 65 20 6e 6f  irements were no
Object 00000000b194ee1c: 74 20 6d 65 74 3a 20 25 73 20 25 73 00 00 00 00  t met: %s %s....
Object 000000000ad8b34b: 25 73 5b 25 64 5d 27 73 20 6f 70 74 69 6f 6e 61  %s[%d]'s optiona
Object 000000005b652c29: 6c 20 72 65 71 75 69 72 65 6d 65 6e 74 73 20 77  l requirements w
Object 00000000b3b7db56: 65 72 65 20 6e 6f 74 20 6d 65 74 3a 20 63 6c 61  ere not met: cla
Object 0000000050afe408: 73 73 20 25 73 2c 20 70 65 72 6d 69 73 73 69 6f  ss %s, permissio
Object 00000000af8777f9: 6e 20 25 73 00 00 00 00 25 73 5b 25 64 5d 27 73  n %s....%s[%d]'s
Object 00000000ed2e0c4f: 20 67 6c 6f 62 61 6c 20 72 65 71 75 69 72 65 6d   global requirem
Object 00000000a38109b6: 65 6e 74 73 20 77 65 72 65 20 6e 6f 74 20 6d 65  ents were not me
Object 00000000727933b7: 74 3a 20 63 6c 61 73 73 20 25 73 2c 20 70 65 72  t: class %s, per
Object 000000006cd62167: 6d 69 73 73 69 6f 6e 20 25 73 00 00 00 00 00 00  mission %s......
Object 00000000d4d51859: 25 73 5b 25 64 5d 27 73 20 6f 70 74 69 6f 6e 61  %s[%d]'s optiona
Object 00000000202541f8: 6c 20 72 65 71 75 69 72 65 6d 65 6e 74 73 20 77  l requirements w
Object 0000000072844a33: 65 72 65 20 6e 6f 74 20 6d 65 74 3a 20 25 73 20  ere not met: %s 
Object 0000000024231452: 25 73 00 00 00 00 00 00 25 73 5b 25 64 5d 27 73  %s......%s[%d]'s
Object 000000003163801f: 20 67 6c 6f 62 61 6c 20 72 65 71 75 69 72 65 6d   global requirem
Object 00000000cb0c9a59: 65 6e 74 73 20 77 65 72 65 20 6e 6f 74 20 6d 65  ents were not me
Object 000000004f71b8df: 74 3a 20 25 73 20 25 73 00 00 00 00 00 00 00 00  t: %s %s........
Object 0000000025b8ddc6: 50 6f 70 75 6c 61 74 69 6e 67 20 72 6f 6c 65 2d  Populating role-
Object 0000000083a48d57: 61 74 74 72 69 62 75 74 65 20 72 65 6c 61 74 69  attribute relati
Redzone 00000000ab86f028: 6f 6e 73 68 69 70 20 66                          onship f
Padding 000000006b830c57: 70 79 5f 63 61 6c 6c 62                          py_callb
CPU: 0 PID: 1483 Comm: kworker/u7:2 Tainted: G    B            4.16.0-rc7+ #27
Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS 1.10.2-1ubuntu1 04/01/2014
Workqueue: writeback wb_workfn (flush-8:0)
Call Trace:
 __dump_stack lib/dump_stack.c:17 [inline]
 dump_stack+0x10a/0x1dd lib/dump_stack.c:53
 check_bytes_and_report.cold.80+0x40/0x6f mm/slub.c:770
FIX kmalloc-1024: Restoring 0x000000003c0d68da-0x000000006627d529=0xbb

FIX kmalloc-1024: Marking all objects used
kasan: CONFIG_KASAN_INLINE enabled
kasan: GPF could be caused by NULL-ptr deref or user memory access
general protection fault: 0000 [#1] SMP KASAN PTI
Dumping ftrace buffer:
   (ftrace buffer empty)
Modules linked in:
CPU: 0 PID: 2843 Comm: syz-executor7 Tainted: G    B            4.16.0-rc7+ #27
Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS 1.10.2-1ubuntu1 04/01/2014
RIP: 0010:neigh_flush_dev+0x1d1/0x7f0 net/core/neighbour.c:246
RSP: 0018:ffff88007a5062f0 EFLAGS: 00010202
RAX: 0cae640e4decc45e RBX: 657320726f662073 RCX: ffffffff835801c3
RDX: 0000000000000000 RSI: 0000000000000050 RDI: 657320726f6622f3
RBP: 1ffff1000f4a0c6e R08: 1ffff1000f4a0c2e R09: 0000000000000000
R10: 0000000098471c2f R11: 0000000000000000 R12: ffff88002d5d4c5d
R13: 0000000000000001 R14: ffff880023126b88 R15: dffffc0000000000
FS:  000000000282e940(0000) GS:ffff88002e000000(0000) knlGS:0000000000000000
CS:  0010 DS: 0000 ES: 0000 CR0: 0000000080050033
CR2: 00007fe70c00d068 CR3: 000000002a822000 CR4: 00000000000006f0
DR0: 0000000020000100 DR1: 0000000020000100 DR2: 0000000000000000
DR3: 0000000000000000 DR6: 00000000fffe0ff0 DR7: 0000000000000600
Call Trace:
 neigh_ifdown+0x47/0x260 net/core/neighbour.c:293
 rt6_disable_ip+0x55b/0x740 net/ipv6/route.c:3809
 addrconf_ifdown+0x13e/0x13a0 net/ipv6/addrconf.c:3596
 addrconf_notify+0x946/0x2130 net/ipv6/addrconf.c:3520
 notifier_call_chain+0x123/0x2b0 kernel/notifier.c:93
 call_netdevice_notifiers net/core/dev.c:1725 [inline]
 dev_close_many+0x3a9/0x770 net/core/dev.c:1504
 rollback_registered_many+0x4af/0xe00 net/core/dev.c:7383
 rollback_registered+0x1b3/0x3c0 net/core/dev.c:7448
 unregister_netdevice_queue+0x2d3/0x520 net/core/dev.c:8462
 unregister_netdevice include/linux/netdevice.h:2473 [inline]
 __tun_detach+0xd0f/0xf80 drivers/net/tun.c:736
 tun_detach drivers/net/tun.c:746 [inline]
 tun_chr_close+0x40/0x50 drivers/net/tun.c:3168
 __fput+0x2f1/0x7c0 fs/file_table.c:209
 task_work_run+0x173/0x240 kernel/task_work.c:113
 exit_task_work include/linux/task_work.h:22 [inline]
 do_exit+0x979/0x17b0 kernel/exit.c:865
Code: 49 8b 1e 48 85 db 0f 84 bf 03 00 00 e8 49 58 49 fe 48 83 3c 24 00 74 46 e8 3d 58 49 fe 48 8d bb 80 02 00 00 48 89 f8 48 c1 e8 03 <42> 80 3c 38 00 0f 85 d5 05 00 00 48 8b 04 24 48 39 83 80 02 00 
RIP: neigh_flush_dev+0x1d1/0x7f0 net/core/neighbour.c:246 RSP: ffff88007a5062f0
---[ end trace 666d51d5bb7c675c ]---
```

### Code

```c
   0:   49 8b 1e                mov    rbx,QWORD PTR [r14]
   3:   48 85 db                test   rbx,rbx
   6:   0f 84 bf 03 00 00       je     0x3cb
   c:   e8 49 58 49 fe          call   0xfffffffffe49585a
  11:   48 83 3c 24 00          cmp    QWORD PTR [rsp],0x0
  16:   74 46                   je     0x5e
  18:   e8 3d 58 49 fe          call   0xfffffffffe49585a
  1d:   48 8d bb 80 02 00 00    lea    rdi,[rbx+0x280]
  24:   48 89 f8                mov    rax,rdi
  27:   48 c1 e8 03             shr    rax,0x3
  2b:  *42 80 3c 38 00          cmp    BYTE PTR [rax+r15*1],0x0
  30:   0f 85 d5 05 00 00       jne    0x60b
  36:   48 8b 04 24             mov    rax,QWORD PTR [rsp]
  3a:   48                      rex.W
  3b:   39                      .byte 0x39
  3c:   83                      .byte 0x83
  3d:   80 02 00                add    BYTE PTR [rdx],0x0
```

**End**


## get_work_pool - general page fault

Found on LK v4.16.0-rc7. leaded to null-dereference.

### Call Trace (Dump)

```c
[  981.132280] general protection fault: 0000 [#1] SMP KASAN PTI
[  981.132834] Dumping ftrace buffer:
[  981.133121]    (ftrace buffer empty)
[  981.133424] Modules linked in:
[  981.133795] CPU: 1 PID: 1024 Comm: kworker/u6:1 Not tainted 4.16.0-rc7+ #27
[  981.134510] Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS 1.10.2-1ubuntu1 04/01/2014
[  981.135333] Workqueue: netns cleanup_net
[  981.135829] RIP: 0010:get_work_pool+0x148/0x1e0
[  981.136353] RSP: 0018:ffff88002929ef18 EFLAGS: 00010002
[  981.136927] RAX: dffffc0000000000 RBX: 0000000fffffff00 RCX: ffffffffb8197397
[  981.137552] RDX: 00000001ffffffe0 RSI: ffffffffbb8f4ca0 RDI: 0000000000000046
[  981.138139] RBP: 1ffff10005253de7 R08: ffff88002929f070 R09: ffff880029338920
[  981.138854] R10: 0000000000000001 R11: 0000000000000000 R12: 1ffff10005253de3
[  981.139432] R13: 1ffff10005253e30 R14: dffffc0000000000 R15: fffffbfff77aec6b
[  981.140115] FS:  0000000000000000(0000) GS:ffff88007fc00000(0000) knlGS:0000000000000000
[  981.140811] CS:  0010 DS: 0000 ES: 0000 CR0: 0000000080050033
[  981.141372] CR2: 000000c4232e7000 CR3: 00000000274c4000 CR4: 00000000000006e0
[  981.141992] DR0: 0000000020000100 DR1: 0000000020000100 DR2: 0000000000000000
[  981.142674] DR3: 0000000000000000 DR6: 00000000fffe0ff0 DR7: 0000000000000600
[  981.143293] Call Trace:
[  981.143584]  ? trace_raw_output_workqueue_execute_start+0x100/0x100
[  981.144486]  ? deref_stack_reg+0x110/0x110
[  981.145095]  flush_work+0xcb/0x830
[  981.145585]  ? insert_work+0x3c0/0x3c0
[  981.146110]  ? print_usage_bug+0x140/0x140
[  981.146621]  ? ret_from_fork+0x3a/0x50
[  981.147064]  ? save_stack+0x89/0xb0
[  981.147458]  ? __kasan_slab_free+0x12c/0x170
[  981.148005]  ? kfree+0xf3/0x310
[  981.148454]  ? xfrm_net_exit+0x11/0x30
[  981.148955]  ? ops_exit_list.isra.6+0xa1/0x140
[  981.149514]  ? cleanup_net+0x622/0xbc0
[  981.150070]  ? process_one_work+0xafd/0x1970
[  981.150659]  ? worker_thread+0x21a/0x1830
[  981.151191]  ? kthread+0x32b/0x3f0
[  981.151616]  ? ret_from_fork+0x3a/0x50
[  981.152077]  ? __delete_object+0x133/0x1b0
[  981.152625]  ? lock_acquire+0x4a0/0x4a0
[  981.153221]  xfrm_policy_fini+0xae/0x4d0
[  981.153755]  ? xfrm_policy_flush+0x470/0x470
[  981.154335]  ? _raw_write_unlock_irqrestore+0x46/0x60
[  981.154988]  ? mark_held_locks+0xa8/0xf0
[  981.155435]  ? quarantine_put+0xc1/0x160
[  981.155934]  ? __kasan_slab_free+0x141/0x170
[  981.156546]  ? xfrm_net_exit+0x11/0x30
[  981.157027]  ? xfrm_policy_fini+0x4d0/0x4d0
[  981.157563]  xfrm_net_exit+0x19/0x30
[  981.158013]  ops_exit_list.isra.6+0xa1/0x140
[  981.158639]  cleanup_net+0x622/0xbc0
[  981.159131]  ? peernet2id_alloc+0x330/0x330
[  981.159639]  ? __lock_acquire+0x840/0x4670
[  981.160164]  ? save_trace+0x300/0x300
[  981.160660]  ? find_held_lock+0x32/0x1b0
[  981.161172]  ? save_trace+0x300/0x300
[  981.161646]  ? lock_acquire+0x1a5/0x4a0
[  981.162132]  ? process_one_work+0xa3f/0x1970
[  981.162644]  ? finish_task_switch+0x182/0x740
[  981.163184]  ? lock_downgrade+0x6e0/0x6e0
[  981.163783]  ? do_raw_spin_trylock+0x190/0x190
[  981.164377]  ? __lock_is_held+0xad/0x140
[  981.164866]  process_one_work+0xafd/0x1970
[  981.165377]  ? _raw_spin_unlock_irq+0x24/0x40
[  981.165955]  ? drain_workqueue+0x560/0x560
[  981.166670]  ? lock_repin_lock+0x410/0x410
[  981.167349]  ? __schedule+0x75c/0x1ea0
[  981.167810]  ? __sched_text_start+0x8/0x8
[  981.168348]  ? select_task_rq_fair+0x1177/0x35d0
[  981.169101]  ? save_trace+0x300/0x300
[  981.169600]  ? lock_acquire+0x4a0/0x4a0
[  981.170140]  ? __read_once_size_nocheck.constprop.8+0x10/0x10
[  981.170813]  ? lock_downgrade+0x6e0/0x6e0
[  981.171376]  ? find_held_lock+0x32/0x1b0
[  981.171851]  ? lock_acquire+0x1a5/0x4a0
[  981.172370]  ? worker_thread+0x467/0x1830
[  981.172853]  ? lock_downgrade+0x6e0/0x6e0
[  981.173387]  ? do_raw_spin_trylock+0x190/0x190
[  981.173925]  worker_thread+0x21a/0x1830
[  981.174691]  ? do_raw_spin_trylock+0x190/0x190
[  981.175253]  ? process_one_work+0x1970/0x1970
[  981.175789]  ? find_held_lock+0x32/0x1b0
[  981.176345]  ? _raw_spin_unlock_irq+0x24/0x40
[  981.176899]  ? _raw_spin_unlock_irq+0x24/0x40
[  981.177480]  ? finish_task_switch+0x1c2/0x740
[  981.178058]  ? finish_task_switch+0x182/0x740
[  981.178608]  ? set_load_weight+0x270/0x270
[  981.179158]  ? lock_repin_lock+0x410/0x410
[  981.179794]  ? __schedule+0x75c/0x1ea0
[  981.180430]  ? __sched_text_start+0x8/0x8
[  981.181023]  ? kmem_cache_alloc_trace+0x116/0x2b0
[  981.181688]  ? kthread+0x98/0x3f0
[  981.182180]  ? save_trace+0x300/0x300
[  981.182703]  ? create_object+0x799/0xb40
[  981.183289]  ? schedule+0xf0/0x3a0
[  981.183883]  ? lock_acquire+0x4a0/0x4a0
[  981.184539]  ? __schedule+0x1ea0/0x1ea0
[  981.185213]  ? wait_woken+0x260/0x260
[  981.185838]  ? do_raw_spin_trylock+0x190/0x190
[  981.186489]  ? __lockdep_init_map+0xdf/0x4d0
[  981.187031]  ? __init_waitqueue_head+0x89/0x140
[  981.187610]  ? _raw_spin_unlock_irqrestore+0x46/0x60
[  981.188213]  ? process_one_work+0x1970/0x1970
[  981.188729]  ? process_one_work+0x1970/0x1970
[  981.189283]  kthread+0x32b/0x3f0
[  981.189714]  ? kthread_create_worker_on_cpu+0xe0/0xe0
[  981.190430]  ret_from_fork+0x3a/0x50
[  981.190997] Code: 28 00 00 00 0f 85 8c 00 00 00 48 83 c4 60 5b 5d 41 5c c3 30 db e8 69 e6 27 00 48 89 da 48 b8 00 00 00 00 00 fc ff df 48 c1 ea 03 <80> 3c 02 00 75 6a 48 8b 1b eb a6 e8 48 e6 27 00 e8 a3 82 14 00 
[  981.193585] RIP: get_work_pool+0x148/0x1e0 RSP: ffff88002929ef18
[  981.194350] ---[ end trace f68a6ddbb826daeb ]---
[  981.194897] Kernel panic - not syncing: Fatal exception
[  981.195715] Dumping ftrace buffer:
[  981.196118]    (ftrace buffer empty)
[  981.196618] Kernel Offset: 0x37000000 from 0xffffffff81000000 (relocation range: 0xffffffff80000000-0xffffffffbfffffff)
[  981.197790] Rebooting in 86400 seconds..
```

### Code

```c
   0:   28 00                   sub    BYTE PTR [rax],al
   2:   00 00                   add    BYTE PTR [rax],al
   4:   0f 85 8c 00 00 00       jne    0x96
   a:   48 83 c4 60             add    rsp,0x60
   e:   5b                      pop    rbx
   f:   5d                      pop    rbp
  10:   41 5c                   pop    r12
  12:   c3                      ret    
  13:   30 db                   xor    bl,bl
  15:   e8 69 e6 27 00          call   0x27e683
  1a:   48 89 da                mov    rdx,rbx
  1d:   48 b8 00 00 00 00 00    movabs rax,0xdffffc0000000000
  24:   fc ff df 
  27:   48 c1 ea 03             shr    rdx,0x3
  2b:  *80 3c 02 00             cmp    BYTE PTR [rdx+rax*1],0x0
  2f:   75 6a                   jne    0x9b
  31:   48 8b 1b                mov    rbx,QWORD PTR [rbx]
  34:   eb a6                   jmp    0xffffffffffffffdc
  36:   e8 48 e6 27 00          call   0x27e683
  3b:   e8 a3 82 14 00          call   0x1482e3
```

**End**


## mon_bin_read - possible circular locking dependency detected

Got from syzkaller & Found in LK v4.16.0. Maybe, this post is similar with the past post (mon_bin_vma stuff).

### Call Trace (Dump)

```c
WARNING: possible circular locking dependency detected
4.16.0+ #28 Not tainted
------------------------------------------------------
syz-executor3/12637 is trying to acquire lock:
00000000548b0ec6 (&mm->mmap_sem){++++}, at: __might_fault+0xd4/0x1b0 mm/memory.c:4571

but task is already holding lock:
00000000edee7e51 (&rp->fetch_lock){+.+.}, at: mon_bin_read+0x5e/0x5f0 drivers/usb/mon/mon_bin.c:813

which lock already depends on the new lock.


the existing dependency chain (in reverse order) is:

-> #1 (&rp->fetch_lock){+.+.}:

-> #0 (&mm->mmap_sem){++++}:

other info that might help us debug this:

 Possible unsafe locking scenario:

       CPU0                    CPU1
       ----                    ----
  lock(&rp->fetch_lock);
                               lock(&mm->mmap_sem);
                               lock(&rp->fetch_lock);
  lock(&mm->mmap_sem);

 *** DEADLOCK ***

1 lock held by syz-executor3/12637:
 #0: 00000000edee7e51 (&rp->fetch_lock){+.+.}, at: mon_bin_read+0x5e/0x5f0 drivers/usb/mon/mon_bin.c:813

stack backtrace:
CPU: 0 PID: 12637 Comm: syz-executor3 Not tainted 4.16.0+ #28
Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS 1.10.2-1ubuntu1 04/01/2014
Call Trace:
 __dump_stack lib/dump_stack.c:17 [inline]
 dump_stack+0x11b/0x201 lib/dump_stack.c:53
 print_circular_bug.isra.33+0x3fe/0x437 kernel/locking/lockdep.c:1223
 check_prev_add kernel/locking/lockdep.c:1863 [inline]
 check_prevs_add kernel/locking/lockdep.c:1976 [inline]
 validate_chain kernel/locking/lockdep.c:2417 [inline]
 __lock_acquire.cold.54+0x5b3/0x90e kernel/locking/lockdep.c:3431
unregister_netdevice: waiting for lo to become free. Usage count = 3
```

**End**


## strlen - slab out of bounds Read

Got from syzkaller & Found in *LK v4.16.0*.

### Call Trace (Dump)

```c
[   66.494709] BUG: KASAN: slab-out-of-bounds in strlen+0x8e/0xa0
[   66.495406] Read of size 1 at addr ffff88007be71348 by task syz-executor0/12148
[   66.496244] 
[   66.496444] CPU: 1 PID: 12148 Comm: syz-executor0 Not tainted 4.16.0+ #28
[   66.497263] Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS 1.10.2-1ubuntu1 04/01/2014
[   66.498275] Call Trace:
[   66.498584]  dump_stack+0x11b/0x201
[   66.499017]  ? dma_direct_map_sg+0x26f/0x26f
[   66.499527]  ? show_regs_print_info+0x12/0x12
[   66.500078]  print_address_description+0x60/0x224
[   66.500642]  kasan_report+0x196/0x2a0
[   66.501095]  ? strlen+0x8e/0xa0
[   66.501484]  ? strlen+0x8e/0xa0
[   66.501873]  ? kstrdup+0x21/0x70
[   66.502291]  ? alloc_trace_kprobe+0x131/0xa10
[   66.502808]  ? kprobe_dispatcher+0x110/0x110
[   66.503344]  ? perf_kprobe_init+0x82/0x1f0
[   66.503821]  ? create_local_trace_kprobe+0xa8/0x4c0
[   66.504394]  ? alloc_symbol_cache+0x1c0/0x1c0
[   66.504905]  ? perf_kprobe_init+0x82/0x1f0
[   66.505428]  ? kmem_cache_alloc_trace+0x116/0x2b0
[   66.506004]  ? perf_kprobe_init+0x147/0x1f0
[   66.506503]  ? rcu_seq_end+0x120/0x120
[   66.506962]  ? perf_kprobe_event_init+0xa8/0x120
[   66.507511]  ? perf_try_init_event+0xcb/0x2a0
[   66.508041]  ? perf_event_alloc+0x1623/0x2540
[   66.508583]  ? perf_try_init_event+0x2a0/0x2a0
[   66.509110]  ? lock_acquire+0x4a0/0x4a0
[   66.509591]  ? mutex_lock_io_nested+0x16b0/0x16b0
[   66.510160]  ? perf_trace_lock_acquire+0xeb/0x930
[   66.510733]  ? perf_trace_lock_acquire+0xeb/0x930
[   66.511321]  ? perf_trace_lock+0x950/0x950
[   66.511812]  ? save_trace+0x300/0x300
[   66.512276]  ? save_trace+0x300/0x300
[   66.512777]  ? find_held_lock+0x32/0x1b0
[   66.513288]  ? ptrace_may_access+0x33/0x40
[   66.513784]  ? lock_acquire+0x4a0/0x4a0
[   66.514268]  ? do_raw_spin_unlock+0xac/0x310
[   66.514819]  ? do_raw_spin_trylock+0x1b0/0x1b0
[   66.515361]  ? __ptrace_may_access+0x48d/0x7d0
[   66.515963]  ? SYSC_perf_event_open+0x48d/0x2ab0
[   66.516552]  ? perf_event_set_output+0x580/0x580
[   66.517119]  ? schedule+0xf0/0x3a0
[   66.517609]  ? SyS_futex+0x261/0x31e
[   66.518039]  ? SyS_futex+0x26a/0x31e
[   66.518500]  ? exit_to_usermode_loop+0x139/0x1e0
[   66.519050]  ? do_futex+0x1f50/0x1f50
[   66.519518]  ? exit_to_usermode_loop+0x181/0x1e0
[   66.520080]  ? syscall_slow_exit_work+0x400/0x400
[   66.520668]  ? do_syscall_64+0xb0/0x7a0
[   66.521148]  ? SYSC_perf_event_open+0x2ab0/0x2ab0
[   66.521700]  ? do_syscall_64+0x23e/0x7a0
[   66.522186]  ? _raw_spin_unlock_irq+0x24/0x40
[   66.522736]  ? finish_task_switch+0x1c7/0x750
[   66.523270]  ? syscall_return_slowpath+0x470/0x470
[   66.523899]  ? syscall_return_slowpath+0x2df/0x470
[   66.524542]  ? prepare_exit_to_usermode+0x330/0x330
[   66.525148]  ? entry_SYSCALL_64_after_hwframe+0x52/0xb7
[   66.525808]  ? trace_hardirqs_off_thunk+0x1a/0x1c
[   66.526395]  ? entry_SYSCALL_64_after_hwframe+0x42/0xb7
[   66.527080] 
[   66.527297] Allocated by task 12148:
[   66.527749]  kasan_kmalloc+0xbf/0xe0
[   66.528187]  kmem_cache_alloc_trace+0x116/0x2b0
[   66.528795]  perf_kprobe_init+0x82/0x1f0
[   66.529328]  perf_kprobe_event_init+0xa8/0x120
[   66.529854]  perf_try_init_event+0xcb/0x2a0
[   66.530401]  perf_event_alloc+0x1623/0x2540
[   66.530889]  SYSC_perf_event_open+0x48d/0x2ab0
[   66.531430]  do_syscall_64+0x23e/0x7a0
[   66.531836] 
[   66.532015] Freed by task 18:
[   66.532368]  __kasan_slab_free+0x12c/0x170
[   66.532857]  kfree+0xf3/0x310
[   66.533193]  rcu_process_callbacks+0x9b4/0x25b0
[   66.533706]  __do_softirq+0x2a3/0xa8b
[   66.534104] 
[   66.534257] The buggy address belongs to the object at ffff88007be712c8
[   66.534257]  which belongs to the cache kmalloc-128 of size 128
[   66.535590] The buggy address is located 0 bytes to the right of
[   66.535590]  128-byte region [ffff88007be712c8, ffff88007be71348)
[   66.536688] The buggy address belongs to the page:
[   66.537323] page:ffffea0001ef9c00 count:1 mapcount:0 mapping:0000000000000000 index:0xffff88007be701e8 compound_mapcount: 0
[   66.538824] flags: 0x500000000008100(slab|head)
[   66.539438] raw: 0500000000008100 0000000000000000 ffff88007be701e8 0000000100110006
[   66.540500] raw: ffffea0001f716a0 ffff88007f800980 ffff88002800f480 0000000000000000
[   66.541612] page dumped because: kasan: bad access detected
[   66.542354] 
[   66.542581] Memory state around the buggy address:
[   66.543224]  ffff88007be71200: fc fc fc fc fc fc fc fc fc fc fc fc fc fc fc fc
[   66.544213]  ffff88007be71280: fc fc fc fc fc fc fc fc fc 00 00 00 00 00 00 00
[   66.545299] >ffff88007be71300: 00 00 00 00 00 00 00 00 00 fc fc fc fc fc fc fc
[   66.546268]                                               ^
[   66.546962]  ffff88007be71380: fc fc fc fc fc fc fc fc fc fc fc fc fc fc fc fc
[   66.547667]  ffff88007be71400: fc fc fc fc fc fc fc fc fc fc fc fc fc fc fc fc
```

**End**


## xxx - slab padding overwritten

Got from syzkaller & Found in *LK v4.16.0*. 

### Call Trace (Dump)

```c
[  232.959395] BUG selinux_file_security (Not tainted): Padding overwritten. 0x00000000ee4aa18f-0x000000003704f4a5
[  232.960284] -----------------------------------------------------------------------------
[  232.960284] 
[  232.961111] Disabling lock debugging due to kernel taint
[  232.961552] INFO: Slab 0x00000000a9c66b55 objects=22 used=22 fp=0x          (null) flags=0x100000000008101
[  232.962383] CPU: 0 PID: 12841 Comm: syz-executor7 Tainted: G    B            4.16.0+ #28
[  232.963070] Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS 1.10.2-1ubuntu1 04/01/2014
[  232.963773] Call Trace:
[  232.964002]  dump_stack+0x11b/0x201
[  232.964294]  ? dma_direct_map_sg+0x26f/0x26f
[  232.964642]  slab_err+0xab/0xcf
[  232.964931]  ? memchr_inv+0x264/0x330
[  232.965242]  slab_pad_check.part.45.cold.81+0x23/0x75
[  232.965664]  ? check_slab+0xa4/0xd0
[  232.965962]  ? free_debug_processing+0x1f7/0x270
[  232.966343]  ? qlist_free_all+0x32/0xc0
[  232.966656]  ? __slab_free+0x241/0x390
[  232.966974]  ? mark_held_locks+0xa8/0xf0
[  232.967296]  ? _raw_spin_unlock_irqrestore+0x46/0x60
[  232.967698]  ? qlist_free_all+0x32/0xc0
[  232.968041]  ? qlist_free_all+0x32/0xc0
[  232.968360]  ? qlist_free_all+0x47/0xc0
[  232.968676]  ? quarantine_reduce+0x166/0x1a0
[  232.969032]  ? kasan_kmalloc+0x95/0xe0
[  232.969342]  ? __pmd_alloc+0x8c/0x4d0
[  232.969644]  ? kmem_cache_alloc+0xde/0x2a0
[  232.969989]  ? __pmd_alloc+0x8c/0x4d0
[  232.970312]  ? __pud_alloc+0x187/0x240
[  232.970639]  ? __handle_mm_fault+0x12e5/0x3210
[  232.971040]  ? debug_check_no_locks_freed+0x210/0x210
[  232.971451]  ? vm_insert_mixed_mkwrite+0x30/0x30
[  232.971821]  ? deref_stack_reg+0xab/0x110
[  232.972188]  ? update_curr+0x30f/0xa60
[  232.972496]  ? nohz_balance_exit_idle.part.84+0x3d0/0x3d0
[  232.972953]  ? print_usage_bug+0x140/0x140
[  232.973299]  ? rcu_process_callbacks+0x25b0/0x25b0
[  232.973690]  ? __save_stack_trace+0x7d/0xf0
[  232.974105]  ? follow_huge_addr+0x5/0x10
[  232.974537]  ? follow_page_mask+0x129/0x14f0
[  232.975006]  ? save_trace+0x300/0x300
[  232.975428]  ? save_trace+0x300/0x300
[  232.975864]  ? gup_pgd_range+0x2430/0x2430
[  232.976380]  ? pick_next_task_fair+0xf17/0x1770
[  232.976894]  ? save_trace+0x300/0x300
[  232.977297]  ? __lock_is_held+0xad/0x140
[  232.977741]  ? handle_mm_fault+0x12e/0x390
[  232.978215]  ? __get_user_pages+0x619/0x13f0
[  232.978720]  ? follow_page_mask+0x14f0/0x14f0
[  232.979226]  ? _raw_spin_unlock_irq+0x24/0x40
[  232.979730]  ? finish_task_switch+0x186/0x750
[  232.980240]  ? set_load_weight+0x270/0x270
[  232.980690]  ? lock_repin_lock+0x410/0x410
[  232.981041]  ? __schedule+0x752/0x1d10
[  232.981407]  ? rcu_is_watching+0x81/0x130
[  232.981741]  ? __lock_is_held+0xad/0x140
[  232.982072]  ? get_user_pages_remote+0x1fe/0x3b0
[  232.982447]  ? copy_strings.isra.24+0x352/0xc10
[  232.982809]  ? remove_arg_zero+0x5c0/0x5c0
[  232.983158]  ? fsnotify+0x3b0/0x11a0
[  232.983531]  ? fsnotify_first_mark+0x2c0/0x2c0
[  232.983940]  ? vfs_read+0x15f/0x330
[  232.984224]  ? kernel_read+0xa6/0x110
[  232.984523]  ? prepare_binprm+0x654/0x8d0
[  232.984855]  ? install_exec_creds+0x160/0x160
[  232.985209]  ? copy_strings_kernel+0xa0/0x110
[  232.985562]  ? do_execveat_common.isra.33+0x120c/0x2320
[  232.985998]  ? __do_page_fault+0xb70/0xb70
[  232.986415]  ? prepare_bprm_creds+0x110/0x110
[  232.986857]  ? deactivate_slab.isra.67+0x47c/0x5b0
[  232.987210]  ? retint_kernel+0x10/0x10
[  232.987494]  ? trace_hardirqs_on_thunk+0x1a/0x1c
[  232.987831]  ? __do_page_fault+0x39a/0xb70
[  232.988181]  ? retint_kernel+0x10/0x10
[  232.988468]  ? strncpy_from_user+0x172/0x400
[  232.988854]  ? strncpy_from_user+0x2f1/0x400
[  232.989296]  ? rcu_pm_notify+0xc0/0xc0
[  232.989656]  ? mpi_free.cold.1+0x21/0x21
[  232.990012]  ? rcu_read_lock_sched_held+0xe4/0x120
[  232.990402]  ? getname_flags+0x24d/0x560
[  232.990741]  ? SyS_execve+0x34/0x40
[  232.991069]  ? compat_SyS_execveat+0x60/0x60
[  232.991426]  ? do_syscall_64+0x23e/0x7a0
[  232.991740]  ? _raw_spin_unlock_irq+0x24/0x40
[  232.992121]  ? finish_task_switch+0x1c7/0x750
[  232.992480]  ? syscall_return_slowpath+0x470/0x470
[  232.992882]  ? syscall_return_slowpath+0x2df/0x470
[  232.993265]  ? prepare_exit_to_usermode+0x330/0x330
[  232.993644]  ? retint_user+0x18/0x18
[  232.993927]  ? async_page_fault+0x2f/0x50
[  232.994223]  ? trace_hardirqs_off_thunk+0x1a/0x1c
[  232.994576]  ? entry_SYSCALL_64_after_hwframe+0x42/0xb7
[  232.994971] Padding 00000000ee4aa18f: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
[  232.995651] Padding 000000009a3fbdea: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
[  232.996335] Padding 0000000092deced6: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
[  232.997092] Padding 00000000c723a940: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
[  232.997825] Padding 000000007de31a44: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
[  232.998536] Padding 0000000097ccfd3f: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
[  232.999221] FIX selinux_file_security: Restoring 0x00000000ee4aa18f-0x000000003704f4a5=0x5a
```

**End**
