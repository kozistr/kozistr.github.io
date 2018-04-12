---
layout: post
title: LK v4.16.x - xxx - memory leak
comments: true
---

xxx - memory leak

posted & found by [zer0day](https://kozistr.github.io/)

## tl;dr

Found on LK v4.16.x. Leaked bytes seem like the part of the Kprobe-tracing event logs.

```c
> /sys/kernel/debug/tracing/events/kprobes/myprobe/format
...
print fmt: "(%lx) dfd=%lx filename=%lx flags=%lx mode=%lx", REC->__probe_ip,
REC->dfd, REC->filename, REC->flags, REC->mode
...
```

Maybe,`that file cannot be opened without *root* perm, but its contents just leaked with Medium IL...

weird...

Of course, enabling some ops to support kprobe stuff so that using kprobe-tracing.

## Call Trace (Dump)

Here's a kmemleak message.

```c
[   98.213278] kmemleak: 1 new suspected memory leaks (see /sys/kernel/debug/kmemleak)
[  104.438838] kmemleak: 2 new suspected memory leaks (see /sys/kernel/debug/kmemleak)
...
  hex dump (first 32 bytes):
    22 28 25 6c 78 29 22 2c 20 52 45 43 2d 3e 5f 5f  "(%lx)", REC->__
    70 72 6f 62 65 5f 69 70 00 6b 6b 6b 6b 6b 6b a5  probe_ip.kkkkkk.
```

**End**
