---
layout: post
title: LK v4.16.x - slab ... overwritten
comments: true
---

kmalloc-1024 - slab padding/red zone overwritten

posted & found by [zer0day](https://kozistr.github.io/)

## tl;dr

Got from syzkaller & Found in LK v4.16.0-rc7.

## Call Trace (Dump)

Here's a syzkaller report.

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

## Code

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
