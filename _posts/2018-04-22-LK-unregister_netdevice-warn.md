---
layout: post
title: LK v4.17.x - unregister_netdevice - warn
author: zer0day
categories: lk
---

unregister_netdevice - waiting for DEV to become free

posted & found by [zer0day](https://kozistr.github.io/)

## tl;dr

Got from syzkaller & Found in LK v4.17.0-rc1.

## Call Trace (Dump)

Here's a dmesg.

```c
...
[  292.993864] unregister_netdevice: waiting for lo to become free. Usage count = 5
...
```

## PoC

Later...

**End**
