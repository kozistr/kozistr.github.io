---
title: Linux Kernel - 2018-06-2 Founds
date: 2018-06-12
update: 2018-06-16
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




## __xfrm_policy_check - general page fault

Found on LK v4.17.0+. lead to null-dereference.

### Call Trace (Dump)

```c
[  758.398101] kasan: GPF could be caused by NULL-ptr deref or user memory access
[  758.403122] general protection fault: 0000 [#1] SMP KASAN PTI
[  758.404402] CPU: 1 PID: 18 Comm: ksoftirqd/1 Not tainted 4.17.0+ #9
[  758.405809] Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS 1.10.2-1ubuntu1 04/01/2014
[  758.413827] RIP: 0010:__xfrm_policy_check+0x28c/0x2280
[  758.414978] Code: 89 c6 e8 e7 86 dd fd 45 85 e4 0f 85 71 02 00 00 e8 c9 85 dd fd 48 8d 7b 08 48 b8 00 00 00 00 00 fc ff df 48 89 fa 48 c1 ea 03 <80> 3c 02 00 0f 85 a1 1c 00 00 48 8b 5b 08 48 85 db 74 14 e8 9c 85 
[  758.419274] RSP: 0018:ffff88006c666828 EFLAGS: 00010202
[  758.423272] RAX: dffffc0000000000 RBX: 0000000000000000 RCX: ffffffff9ba8c807
[  758.424848] RDX: 0000000000000001 RSI: 0000000000000000 RDI: 0000000000000008
[  758.433162] RBP: ffff88006c666b50 R08: ffff88006c6442c0 R09: ffffed000da2451a
[  758.434732] R10: 0000000000000001 R11: ffff88006d1228d3 R12: 0000000000000001
[  758.436297] R13: 0000000000000000 R14: 000000000000000a R15: ffff88003df54500
[  758.437868] FS:  0000000000000000(0000) GS:ffff88006d100000(0000) knlGS:0000000000000000
[  758.439623] CS:  0010 DS: 0000 ES: 0000 CR0: 0000000080050033
[  758.442808] CR2: ffffffffff600400 CR3: 0000000065db8000 CR4: 00000000000006e0
[  758.444373] Call Trace:
[  758.452834]  ? __xfrm_route_forward+0x640/0x640
[  758.453850]  ? __lock_acquire+0xa74/0x4f90
[  758.454778]  ? check_flags.part.37+0x420/0x420
[  758.455771]  ? dequeue_task_fair+0x4ae0/0x4ae0
[  758.456781]  ? __lock_acquire+0x4f90/0x4f90
[  758.457727]  ? __local_bh_enable_ip+0x124/0x1a0
[  758.458746]  ? ip6t_do_table+0xbea/0x15a0
[  758.459652]  ? __local_bh_enable_ip+0x124/0x1a0
[  758.460673]  ? save_trace+0x300/0x300
[  758.461519]  ? icmpv6_rcv+0xb08/0x19c0
[  758.462922]  ? icmpv6_notify+0x870/0x870
[  758.473310]  ? ip6_input_finish+0x438/0x1af0
[  758.474292]  ? ip6_rcv_finish+0x880/0x880
[  758.475191]  ? nf_hook_slow+0x114/0x1c0
[  758.476060]  ? ip6_input+0xe3/0x630
[  758.476866]  ? ip6_input_finish+0x1af0/0x1af0
[  758.477844]  ? ip6_rcv_finish+0x880/0x880
[  758.478750]  ? find_held_lock+0x33/0x1b0
[  758.479634]  ? ipv6_rcv+0x1a0f/0x2090
[  758.480474]  ? ip6_rcv_finish+0x1ea/0x880
[  758.481374]  ? ip6_make_skb+0x5b0/0x5b0
[  758.482240]  ? rcu_is_watching+0x81/0x130
[  758.483147]  ? nf_hook_slow+0x114/0x1c0
[  758.484013]  ? ipv6_rcv+0xef6/0x2090
[  758.493457]  ? ip6_input+0x630/0x630
[  758.494292]  ? ip6_make_skb+0x5b0/0x5b0
[  758.495158]  ? __lock_acquire+0xa74/0x4f90
[  758.496076]  ? find_next_and_bit+0x177/0x1d0
[  758.497050]  ? ip6_input+0x630/0x630
[  758.497863]  ? __netif_receive_skb_core+0x23e2/0x3570
[  758.498981]  ? nf_ingress+0x9d0/0x9d0
[  758.499812]  ? update_group_capacity+0xb10/0xb10
[  758.500853]  ? __lock_acquire+0xa74/0x4f90
[  758.501775]  ? print_usage_bug+0x140/0x140
[  758.502699]  ? lock_release+0x8e0/0x8e0
[  758.513246]  ? print_usage_bug+0x140/0x140
[  758.514187]  ? _raw_spin_unlock_irqrestore+0x46/0x60
[  758.515298]  ? __lock_acquire+0xa74/0x4f90
[  758.516220]  ? update_blocked_averages+0x19ae/0x2c70
[  758.517336]  ? find_busiest_group+0xe1/0x1740
[  758.518307]  ? save_trace+0x300/0x300
[  758.519137]  ? find_held_lock+0x33/0x1b0
[  758.520019]  ? lock_acquire+0x1b3/0x4a0
[  758.520896]  ? process_backlog+0x1e4/0x760
[  758.521818]  ? __lock_acquire+0x4f90/0x4f90
[  758.522756]  ? do_raw_spin_trylock+0x1b0/0x1b0
[  758.523764]  ? rcu_is_watching+0x81/0x130
[  758.524675]  ? _rcu_barrier_trace+0x450/0x450
[  758.534016]  ? __netif_receive_skb+0x27/0x1c0
[  758.535008]  ? process_backlog+0x257/0x760
[  758.535931]  ? rcu_gp_kthread+0x3cf0/0x3cf0
[  758.536890]  ? net_rx_action+0x6e5/0x1710
[  758.537794]  ? check_flags.part.37+0x420/0x420
[  758.538787]  ? napi_complete_done+0x5d0/0x5d0
[  758.539760]  ? lock_pin_lock+0x340/0x340
[  758.540658]  ? save_trace+0x300/0x300
[  758.541485]  ? pick_next_task_fair+0x6cb/0x18a0
[  758.542492]  ? rebalance_domains+0x372/0xc40
[  758.551306]  ? find_held_lock+0x33/0x1b0
[  758.552184]  ? finish_task_switch+0x1c7/0x780
[  758.553142]  ? check_flags.part.37+0x420/0x420
[  758.554112]  ? finish_task_switch+0x186/0x780
[  758.557391]  ? do_raw_spin_unlock+0xac/0x310
[  758.558316]  ? do_raw_spin_trylock+0x1b0/0x1b0
[  758.559266]  ? find_held_lock+0x33/0x1b0
[  758.573321]  ? _raw_spin_unlock_irq+0x24/0x40
[  758.574261]  ? finish_task_switch+0x27b/0x780
[  758.575211]  ? set_load_weight+0x270/0x270
[  758.576103]  ? lock_repin_lock+0x410/0x410
[  758.577008]  ? __schedule+0x6c8/0x1c80
[  758.577855]  ? rcu_is_watching+0x81/0x130
[  758.578752]  ? lock_repin_lock+0x410/0x410
[  758.579655]  ? rcu_pm_notify+0xc0/0xc0
[  758.580489]  ? __do_softirq+0x2b1/0xa80
[  758.581321]  ? pci_mmcfg_check_reserved+0x170/0x170
[  758.582355]  ? __irqentry_text_end+0x1f9795/0x1f9795
[  758.583406]  ? retint_kernel+0x10/0x10
[  758.584215]  ? schedule+0xf0/0x3a0
[  758.584957]  ? __schedule+0x1c80/0x1c80
[  758.585791]  ? rcu_note_context_switch+0x710/0x710
[  758.586810]  ? run_ksoftirqd+0x2e/0x50
[  758.587621]  ? takeover_tasklets+0x8e0/0x8e0
[  758.588544]  ? run_ksoftirqd+0x29/0x50
[  758.613420]  ? smpboot_thread_fn+0x3bd/0x7f0
[  758.614474]  ? sort_range+0x30/0x30
[  758.615319]  ? do_raw_spin_lock+0xb8/0x1c0
[  758.616301]  ? _raw_spin_unlock_irqrestore+0x46/0x60
[  758.617436]  ? sort_range+0x30/0x30
[  758.618231]  ? sort_range+0x30/0x30
[  758.619478]  ? kthread+0x339/0x400
[  758.621088]  ? kthread_create_worker_on_cpu+0xe0/0xe0
[  758.623485]  ? ret_from_fork+0x3a/0x50
[  758.625174] Modules linked in:
[  758.626598] Dumping ftrace buffer:
[  758.628140]    (ftrace buffer empty)
[  758.629857] ---[ end trace bce99c3ba534df6a ]---
[  758.632020] RIP: 0010:__xfrm_policy_check+0x28c/0x2280
[  758.634057] Code: 89 c6 e8 e7 86 dd fd 45 85 e4 0f 85 71 02 00 00 e8 c9 85 dd fd 48 8d 7b 08 48 b8 00 00 00 00 00 fc ff df 48 89 fa 48 c1 ea 03 <80> 3c 02 00 0f 85 a1 1c 00 00 48 8b 5b 08 48 85 db 74 14 e8 9c 85 
[  758.656587] RSP: 0018:ffff88006c666828 EFLAGS: 00010202
[  758.657738] RAX: dffffc0000000000 RBX: 0000000000000000 RCX: ffffffff9ba8c807
[  758.659234] RDX: 0000000000000001 RSI: 0000000000000000 RDI: 0000000000000008
[  758.661676] RBP: ffff88006c666b50 R08: ffff88006c6442c0 R09: ffffed000da2451a
[  758.663278] R10: 0000000000000001 R11: ffff88006d1228d3 R12: 0000000000000001
[  758.664822] R13: 0000000000000000 R14: 000000000000000a R15: ffff88003df54500
[  758.667171] FS:  0000000000000000(0000) GS:ffff88006d100000(0000) knlGS:0000000000000000
[  758.678044] CS:  0010 DS: 0000 ES: 0000 CR0: 0000000080050033
[  758.679296] CR2: ffffffffff600400 CR3: 0000000065db8000 CR4: 00000000000006e0
[  758.680804] Kernel panic - not syncing: Fatal exception in interrupt
[  758.682315] Dumping ftrace buffer:
[  758.682795]    (ftrace buffer empty)
[  758.684660] Kernel Offset: 0x18400000 from 0xffffffff81000000 (relocation range: 0xffffffff80000000-0xffffffffbfffffff)
[  758.687236] Rebooting in 86400 seconds..
```


## __xfrm_decode_session - soft lockup

Got from syzkaller & Found in LK v4.17.0-rc5.

### Call Trace (Dump)

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

