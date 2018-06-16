---
layout: post
title: LK v4.17.x - create_filter - memory leak
comments: true
---

create_filter - memory leak

posted & found by [zer0day](https://kozistr.github.io/)

## tl;dr

It's been a while. I've been busy these days because of school stuffs... :(

Found on LK v4.17.x. Details are Later...

## kmemleak message

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

## PoC

...

**End**
