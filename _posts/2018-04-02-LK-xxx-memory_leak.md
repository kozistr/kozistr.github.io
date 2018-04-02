---
layout: post
title: LK v4.16.x - xxx - memory leak
comments: true
---

anon_vma_chain - memory leak

posted & found by [zer0day](https://kozistr.github.io/)

## tl;dr

Found in LK v4.16.0-rc7.

I'll update more info about this bug later... Not yet analyzed...

## Call Trace (Dump)

Here's a kmemleak message.

```c
[  171.804669] kmemleak: 1 new suspected memory leaks (see /sys/kernel/debug/kmemleak)
[  178.286239] kmemleak: 1 new suspected memory leaks (see /sys/kernel/debug/kmemleak)
...

  hex dump (first 32 bytes):
    00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
    00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
```

**End**
