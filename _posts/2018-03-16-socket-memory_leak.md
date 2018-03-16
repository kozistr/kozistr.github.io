---
layout: post
title: LK v4.16.x - socket - memory leak
comments: true
---

socket - memory leak

posted & found by [zer0day](https://kozistr.github.io/)

## tl;dr

Got from syzkaller & Found in *LK v4.16.0-rc5* with enabling ```CONFIG_FAULT_INJECTION```.

Actually, i had a few of leaks related to ```socket$sctp``` worked in the past version of LK (maybe v4.14.x somewhere...).
But i just forgot my dumps & codes... :(

Anyway, that is not related to this post :)...

It seems like not useful leaks... But, maybe?, i should test/try more cases.

## Call Trace (Dump)

Here's a dmesg.

```c
[  144.332562] FAULT_INJECTION: forcing a failure.
[  144.332562] name failslab, interval 1, probability 0, space 0, times 0
[  144.333783] CPU: 0 PID: 6129 Comm: syz-executor4 Not tainted 4.16.0-rc5+ #12
[  144.334423] Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS 1.10.2-1ubuntu1 04/01/2014
[  144.335236] Call Trace:
[  144.335453]  dump_stack+0xb9/0x11b
[  144.335788]  should_fail.cold.3+0x3d/0x4f
[  144.336155]  ? should_failslab+0x5e/0x90
[  144.336533]  ? kmem_cache_alloc_trace+0x244/0x340
[  144.336945]  ? sctp_auth_shkey_create+0x33/0x80
[  144.337350]  ? sctp_endpoint_new+0x1be/0x3b0
[  144.337798]  ? sctp_init_sock+0x219/0x3b0
[  144.338233]  ? sctp_destroy_sock+0x140/0x140
[  144.338662]  ? inet6_create+0x35f/0x630
[  144.339063]  ? __sock_create+0x231/0x3e0
[  144.339470]  ? SyS_socket+0x5e/0xc0
[  144.339843]  ? do_syscall_64+0x73/0x1f0
[  144.340348]  ? entry_SYSCALL_64_after_hwframe+0x42/0xb7
[  144.817626] kmemleak: 2 new suspected memory leaks (see /sys/kernel/debug/kmemleak)
[  150.885525] kmemleak: 2 new suspected memory leaks (see /sys/kernel/debug/kmemleak)
2018/03/12 14:50:35 BUG: memory leak
ferenced object 0xffff8e356d2e0880 (size 1872):
  comm "syz-executor4", pid 6106, jiffies 4294811594 (age 6.629s)
  hex dump (first 32 bytes):
    00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
    0a 00 07 40 00 00 00 00 00 00 00 00 00 00 00 00  ...@............
  backtrace:
    [<000000004c693a10>] 0xffffffffffffffff

2018/03/12 14:50:35 BUG: memory leak
unreferenced object 0xffff8e357a154760 (size 32):
  comm "syz-executor4", pid 6106, jiffies 4294811594 (age 6.636s)
  hex dump (first 32 bytes):
    00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
    03 00 00 00 03 00 00 00 0f 00 00 00 00 00 00 00  ................
  backtrace:
    [<000000004c693a10>] 0xffffffffffffffff
```

**End**