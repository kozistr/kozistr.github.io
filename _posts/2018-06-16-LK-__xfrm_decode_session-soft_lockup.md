---
layout: post
title: LK v4.17.x - __xfrm_decode_session - soft lockup
comments: true
---

__xfrm_decode_session - soft lockup

posted & found by [zer0day](https://kozistr.github.io/)

## tl;dr

Got from syzkaller & Found in LK v4.17.0-rc5.

## Call Trace (Dump)

Here's a syzkaller's report.

```c
watchdog: BUG: soft lockup - CPU#1 stuck for 23s! [syz-executor1:6644]
Modules linked in:
irq event stamp: 54949
hardirqs last  enabled at (54948): [<ffffffff84e00a60>] restore_regs_and_return_to_kernel+0x0/0x30
hardirqs last disabled at (54949): [<ffffffff84e00964>] interrupt_entry+0xc4/0xe0 arch/x86/entry/entry_64.S:625
softirqs last  enabled at (180): [<ffffffff839538d0>] tun_napi_alloc_frags drivers/net/tun.c:1476 [inline]
softirqs last  enabled at (180): [<ffffffff839538d0>] tun_get_user+0x1cf0/0x3a30 drivers/net/tun.c:1822
softirqs last disabled at (184): [<ffffffff8395484a>] tun_get_user+0x2c6a/0x3a30 drivers/net/tun.c:1936
CPU: 1 PID: 6644 Comm: syz-executor1 Not tainted 4.17.0-rc5 #6
Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS 1.10.2-1ubuntu1 04/01/2014
RIP: 0010:_decode_session6+0x98c/0x11d0 net/ipv6/xfrm6_policy.c:164
RSP: 0018:ffff880066b8e500 EFLAGS: 00000a03 ORIG_RAX: ffffffffffffff13
RAX: 0000000000000000 RBX: ffff88006596aa40 RCX: ffffffff845c993b
RDX: 0000000000000006 RSI: ffffc90002437000 RDI: 0000000000004b20
RBP: ffff880066b8e588 R08: ffff880067b9dc40 R09: ffff880066b8e678
R10: ffffed000cd71cd9 R11: ffff880066b8e6cf R12: ffff880045714b6e
R13: ffff88004571004e R14: dffffc0000000000 R15: 000000000000004e
FS:  00007fcba1674700(0000) GS:ffff88006cf00000(0000) knlGS:0000000000000000
CS:  0010 DS: 0000 ES: 0000 CR0: 0000000080050033
CR2: 0000000020010000 CR3: 0000000069702000 CR4: 00000000000006e0
Call Trace:
 __xfrm_decode_session+0x64/0x120 net/xfrm/xfrm_policy.c:2368
 xfrm_decode_session_reverse include/net/xfrm.h:1214 [inline]
 icmpv6_route_lookup+0x39b/0x710 net/ipv6/icmp.c:372
 icmp6_send+0x1862/0x2940 net/ipv6/icmp.c:551
 icmpv6_send+0x1ac/0x350 net/ipv6/ip6_icmp.c:43
 ip6_pkt_drop+0x183/0x450 net/ipv6/route.c:3559
 dst_input include/net/dst.h:450 [inline]
 ip6_rcv_finish+0x1ea/0x880 net/ipv6/ip6_input.c:71
 NF_HOOK include/linux/netfilter.h:288 [inline]
 ipv6_rcv+0xf13/0x22b0 net/ipv6/ip6_input.c:208
 __netif_receive_skb_core+0x25c5/0x3560 net/core/dev.c:4592
 __netif_receive_skb+0x27/0x1c0 net/core/dev.c:4657
 netif_receive_skb_internal+0x12d/0x7c0 net/core/dev.c:4731
 napi_frags_finish net/core/dev.c:5172 [inline]
 napi_gro_frags+0x60b/0xbc0 net/core/dev.c:5245
Code: 85 55 07 00 00 0f b7 7c 24 50 41 0f b6 44 24 01 4c 89 e2 83 e2 07 8d 44 c7 08 66 89 44 24 50 4c 89 e0 48 c1 e8 03 42 0f b6 04 30 <38> d0 7f 08 84 c0 0f 85 2d 07 00 00 45 0f b6 24 24 e9 7e fa ff 
```

I'll update a post later...

**End**
