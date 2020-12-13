---
title: Linux Kernel - 2018-06-2 Founds
date: 2018-06-12
update: 2018-06-14
tags:
  - Security
  - Linux-Kernel
keywords:
  - 0-day
  - Bug
---

## create_filter - memory leak

Found on LK v4.17.x.

### kmemleak message

```c
unreferenced object 0xffff880069abee18 (size 8):
  comm "poc", pid 14081, jiffies 4294976277 (age 10.671s)
  hex dump (first 8 bytes):
    02 00 00 00 00 00 00 00                          ........
  backtrace:
    [<00000000f15d2c1d>] create_filter+0xa6/0x250
    [<00000000be54913e>] ftrace_profile_set_filter+0x119/0x2b0
    [<0000000006f0d3d0>] _perf_ioctl+0x1134/0x1ab0
    [<00000000505ea0fc>] perf_ioctl+0x54/0x80
    [<00000000dfc7d1ee>] do_vfs_ioctl+0x1c6/0x15f0
    [<00000000482ffdb2>] ksys_ioctl+0x9b/0xc0
    [<00000000082e2070>] __x64_sys_ioctl+0x6f/0xb0
    [<000000005a913096>] do_syscall_64+0x165/0x670
    [<0000000065ee7513>] entry_SYSCALL_64_after_hwframe+0x49/0xbe
    [<000000005b168a0c>] 0xffffffffffffffff
```

## pcpu_create_chunk - memory leak

Found on LK v4.17.x.

### kmemleak message

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


## set_precision - warning

Got from syzkaller & Found in LK v4.17.0+.

### Call Trace (Dump)

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


