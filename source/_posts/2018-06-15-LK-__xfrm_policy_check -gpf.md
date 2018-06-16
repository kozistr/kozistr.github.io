---
layout: post
title: LK v4.17.x - __xfrm_policy_check - general page fault
comments: true
---

__xfrm_policy_check - general page fault

posted & found by [zer0day](https://kozistr.github.io/)

## tl;dr

Found on LK v4.17.0+. leaded to null-dereference. Not analyzed yet...

## Call Trace (Dump)

Here's a dmesg & Call Trace.

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

## Code

Skip!

**End**
