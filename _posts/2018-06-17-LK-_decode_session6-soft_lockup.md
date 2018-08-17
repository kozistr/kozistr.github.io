---
layout: post
title: LK v4.17.x - _decode_session6 - soft lockup
author: zer0day
categories: lk
---

_decode_session6 - soft lockup

posted & found by [zer0day](https://kozistr.github.io/)

## tl;dr

Got from syzkaller & Found in LK v4.17.0-rc7.

## Call Trace (Dump)

Here's a syzkaller's report.

```c
watchdog: BUG: soft lockup - CPU#1 stuck for 22s! [syz-executor3:10493]
Modules linked in:
irq event stamp: 50309
hardirqs last  enabled at (50308): [<ffffffff9fc00a60>] restore_regs_and_return_to_kernel+0x0/0x30
hardirqs last disabled at (50309): [<ffffffff9fc00964>] interrupt_entry+0xc4/0xe0 arch/x86/entry/entry_64.S:625
softirqs last  enabled at (94): [<ffffffff9e747190>] tun_napi_alloc_frags drivers/net/tun.c:1481 [inline]
softirqs last  enabled at (94): [<ffffffff9e747190>] tun_get_user+0x1cf0/0x3a30 drivers/net/tun.c:1827
softirqs last disabled at (106): [<ffffffff9e74810a>] tun_get_user+0x2c6a/0x3a30 drivers/net/tun.c:1941
CPU: 1 PID: 10493 Comm: syz-executor3 Not tainted 4.17.0-rc7+ #8
Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS 1.10.2-1ubuntu1 04/01/2014
RIP: 0010:__read_once_size include/linux/compiler.h:188 [inline]
RIP: 0010:check_kcov_mode kernel/kcov.c:69 [inline]
RIP: 0010:write_comp_data+0x1e/0x70 kernel/kcov.c:122
RSP: 0018:ffff8800529de598 EFLAGS: 00000246 ORIG_RAX: ffffffffffffff13
RAX: 0000000000000002 RBX: 0000000000000003 RCX: ffffffff9f3bdcb9
RDX: 0000000000000000 RSI: 0000000000000011 RDI: 0000000000000001
RBP: ffffffffa04e0220 R08: ffff88002bbedc40 R09: ffff8800529de748
R10: ffffed000a53bcf3 R11: ffff8800529de79f R12: 0000000000000000
R13: 0000000000000001 R14: 000000000000000a R15: 000000000000004e
FS:  00007f0f35952700(0000) GS:ffff88006cf00000(0000) knlGS:0000000000000000
CS:  0010 DS: 0000 ES: 0000 CR0: 0000000080050033
CR2: 000000002000f000 CR3: 0000000052436000 CR4: 00000000000006e0
Call Trace:
 __sanitizer_cov_trace_switch+0x4f/0x90 kernel/kcov.c:224
 _decode_session6+0x4b9/0x11d0 net/ipv6/xfrm6_policy.c:156
 __xfrm_decode_session+0x64/0x120 net/xfrm/xfrm_policy.c:2368
 xfrm_decode_session_reverse include/net/xfrm.h:1214 [inline]
 icmpv6_route_lookup+0x39b/0x710 net/ipv6/icmp.c:372
 icmp6_send+0x1862/0x2940 net/ipv6/icmp.c:551
 icmpv6_param_prob+0x27/0x40 net/ipv6/icmp.c:598
 ip6_tlvopt_unknown net/ipv6/exthdrs.c:106 [inline]
 ip6_parse_tlv+0x694/0x770 net/ipv6/exthdrs.c:190
 ipv6_parse_hopopts+0x280/0x570 net/ipv6/exthdrs.c:863
 ipv6_rcv+0xdee/0x22b0 net/ipv6/ip6_input.c:196
 __netif_receive_skb_core+0x25c5/0x3560 net/core/dev.c:4592
 __netif_receive_skb+0x27/0x1c0 net/core/dev.c:4657
 netif_receive_skb_internal+0x12d/0x7c0 net/core/dev.c:4731
 napi_frags_finish net/core/dev.c:5172 [inline]
 napi_gro_frags+0x60b/0xbc0 net/core/dev.c:5245
 tun_get_user+0x2c93/0x3a30 drivers/net/tun.c:1950
 tun_chr_write_iter+0xb0/0x147 drivers/net/tun.c:1995
 call_write_iter include/linux/fs.h:1784 [inline]
 do_iter_readv_writev+0x62e/0x8a0 fs/read_write.c:680
 do_iter_write+0x183/0x5e0 fs/read_write.c:959
 vfs_writev+0x1f1/0x360 fs/read_write.c:1004
 do_writev+0xf7/0x2e0 fs/read_write.c:1039
 do_syscall_64+0x165/0x670 arch/x86/entry/common.c:287
 entry_SYSCALL_64_after_hwframe+0x49/0xbe
RIP: 0033:0x459040
RSP: 002b:00007f0f35951b60 EFLAGS: 00000293 ORIG_RAX: 0000000000000014
RAX: ffffffffffffffda RBX: 00000000000000fc RCX: 0000000000459040
RDX: 0000000000000001 RSI: 00007f0f35951bd0 RDI: 00000000000000fc
RBP: 00007f0f35951bd0 R08: 0000000000000000 R09: 0000000000000000
R10: 000000000000fdef R11: 0000000000000293 R12: 0000000000000001
R13: 00000000000006ac R14: 0000000000000000 R15: 00000000006e9100
Code: fc ff ff e8 65 92 ce ff 90 90 90 90 90 65 4c 8b 04 25 c0 de 01 00 65 8b 05 a0 c4 fb 62 a9 00 01 1f 00 75 58 41 8b 80 e0 11 00 00 <83> f8 03 75 4c 49 8b 80 e8 11 00 00 45 8b 80 e4 11 00 00 48 81 
```

I'll update a post later...

**End**
