---
layout: post
title: LK v4.17.x - pcpu_create_chunk - memory leak
comments: true
---

pcpu_create_chunk - memory leak

posted & found by [zer0day](https://kozistr.github.io/)

## tl;dr

Found on LK v4.17.x. Details are Later...

## kmemleak message

```c
unreferenced object 0xffffc90000538000 (size 8192):
  comm "poc", pid 10557, jiffies 4294785036 (age 9.722s)
  hex dump (first 32 bytes):
    00 04 00 00 00 00 00 00 00 04 00 00 00 04 00 00  ................
    00 00 00 00 00 04 00 00 00 00 00 00 00 04 00 00  ................
  backtrace:
    [<00000000ec587bbf>] __vmalloc+0x63/0x80
    [<0000000047066f5b>] pcpu_mem_zalloc+0x89/0xd0
    [<00000000a75fa3be>] pcpu_create_chunk+0x211/0x960
    [<0000000088bef858>] pcpu_alloc+0xf1b/0x12b0
    [<0000000071dc4e5e>] array_map_alloc+0x4f3/0x5f0
    [<00000000b61a2dcb>] map_create+0x3ab/0xee0
    [<00000000006870c4>] __x64_sys_bpf+0x2a9/0x470
    [<00000000bb572e98>] do_syscall_64+0x165/0x670
    [<000000003a252153>] entry_SYSCALL_64_after_hwframe+0x49/0xbe
    [<000000006f02ac52>] 0xffffffffffffffff
```

## PoC

...

**End**
