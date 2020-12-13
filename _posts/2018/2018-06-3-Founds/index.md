---
title: Linux Kernel - 2018-06- Founds
date: 2018-06-17
update: 2018-06-20
tags:
  - Security
  - Linux-Kernel
keywords:
  - 0-day
  - Bug
---

## _decode_session6 - soft lockup

Got from syzkaller & Found in LK v4.17.0-rc7.

### Call Trace (Dump)

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

## rb_insert_color - general page fault

Found on LK v4.17.0+. lead to null-dereference.

### Call Trace (Dump)

```c
kasan: CONFIG_KASAN_INLINE enabled
kasan: GPF could be caused by NULL-ptr deref or user memory access
general protection fault: 0000 [#1] SMP KASAN PTI
CPU: 0 PID: 2795 Comm: poc Not tainted 4.17.0+ #9
Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS 1.10.2-1ubuntu1 04/01/2014
RIP: 0010:rb_insert_color+0x17e/0x1010
Code: 22 09 00 00 49 8b 2c 24 40 f6 c5 01 0f 85 0a 02 00 00 49 bf 00 00 00 00 00 fc ff df 48 8d 45 08 48 89 e9 48 89 c2 48 c1 ea 03 <42> 80 3c 3a 00 0f 85 c8 08 00 00 4c 8b 75 08 4d 39 e6 0f 84 35 02
RSP: 0018:ffff88006bfdec88 EFLAGS: 00010002
RAX: 0000000000000008 RBX: 1ffff1000d7fbd95 RCX: 0000000000000000
RDX: 0000000000000001 RSI: ffffffffb413c640 RDI: ffff88006b932bf8
RBP: 0000000000000000 R08: fffffbfff6571e2d R09: ffff88006bf4ea50
R10: fffffbfff6571e2c R11: ffffffffb2b8f163 R12: ffff88006bf4ea50
R13: ffff88006b932bf8 R14: 0000000000000246 R15: dffffc0000000000
FS:  000000000166c880(0000) GS:ffff88006d000000(0000) knlGS:0000000000000000
CS:  0010 DS: 0000 ES: 0000 CR0: 0000000080050033
CR2: 00007fff25499b98 CR3: 000000006c210000 CR4: 00000000000006f0
```


## __handle_mm_fault - general page fault

Found on LK v4.17.0+. lead to null-dereference.

### Call Trace (Dump)

```c
[  387.942047] kasan: CONFIG_KASAN_INLINE enabled
[  387.943245] kasan: GPF could be caused by NULL-ptr deref or user memory access
[  387.944498] general protection fault: 0000 [#1] SMP KASAN PTI
[  387.945408] CPU: 0 PID: 2898 Comm: poc Not tainted 4.17.0+ #9
[  387.946810] Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS 1.10.2-1ubuntu1 04/01/2014
[  387.948388] RIP: 0010:__handle_mm_fault+0x7c6/0x3eb0
[  387.949421] Code: 00 00 00 00 00 fc ff df 48 89 fa 48 c1 ea 03 80 3c 02 00 0f 85 b6 2e 00 00 48 b8 00 00 00 00 00 fc ff df 4c 89 fa 48 c1 ea 03 <80> 3c 02 00 0f 85 a5 2e 00 00 49 8b 07 48 89 84 24 d0 00 00 00 48
[  387.953249] RSP: 0000:ffff880048457728 EFLAGS: 00010206
[  387.954442] RAX: dffffc0000000000 RBX: ffff8800484577c8 RCX: ffffffffaff47487
[  387.956002] RDX: 000181014000907b RSI: 0000000000000000 RDI: ffff8800484577f8
[  387.957588] RBP: 1ffff1000908aeed R08: ffff880066e4c2c0 R09: 0000000000000000
[  387.959145] R10: 0000000000000001 R11: 0000000000000001 R12: ffff8800000003d8
[  387.960709] R13: ffffffffb33e97e0 R14: 000ffffffffff000 R15: 000c080a000483d8
[  387.961896] kasan: CONFIG_KASAN_INLINE enabled
[  387.962193] FS:  000000c4238aa468(0000) GS:ffff88006d000000(0000) knlGS:0000000000000000
[  387.962199] CS:  0010 DS: 0000 ES: 0000 CR0: 0000000080050033
[  387.962204] CR2: 000000000047b544 CR3: 000000006af1e000 CR4: 00000000000006f0
[  387.962214] DR0: 0000000020000000 DR1: 0000000020000000 DR2: 0000000000000000
[  387.962892] kasan: GPF could be caused by NULL-ptr deref or user memory access
[  387.964386] DR3: 0000000000000000 DR6: 00000000ffff0ff0 DR7: 0000000000000600
[  387.964390] Call Trace:
[  387.964406]  ? __mark_inode_dirty+0x41c/0x1570
[  387.964441]  ? vmf_insert_mixed_mkwrite+0x90/0x90
[  387.964455]  ? find_held_lock+0x33/0x1b0
[  387.973075]  ? mark_held_locks+0xc1/0x140
[  387.973718]  ? ktime_get_coarse_real_ts64+0x1a8/0x230
[  387.974602]  ? save_trace+0x300/0x300
[  387.975738]  ? timespec_trunc+0xea/0x180
[  387.976498]  ? compat_put_timespec64+0x1a0/0x1a0
[  387.977383]  ? do_raw_spin_unlock+0xac/0x310
[  387.978225]  ? find_held_lock+0x33/0x1b0
[  387.978990]  ? pipe_write+0xaf9/0xeb0
[  387.979706]  ? check_flags.part.37+0x420/0x420
[  387.980561]  ? __lock_is_held+0xad/0x140
[  387.981324]  ? lock_acquire+0x1b3/0x4a0
[  387.981919]  ? __do_page_fault+0x3e6/0xe30
[  387.982832]  ? save_trace+0x300/0x300
[  387.983662]  ? __lock_acquire+0x4f90/0x4f90
[  387.984614]  ? __vfs_write+0xfa/0x890
[  387.985448]  ? __lock_is_held+0xad/0x140
[  387.986351]  ? handle_mm_fault+0x15a/0x410
[  387.987265]  ? find_vma+0x2d/0x170
[  387.988039]  ? __do_page_fault+0x672/0xe30
[  387.988952]  ? mm_fault_error+0x360/0x360
[  387.989846]  ? ksys_write+0x192/0x240
[  387.990665]  ? async_page_fault+0x8/0x30
[  387.991531]  ? do_page_fault+0xc1/0x720
[  387.992378]  ? do_syscall_64+0x8d/0x670
[  387.993220]  ? __do_page_fault+0xe30/0xe30
[  387.994144]  ? do_syscall_64+0x488/0x670
[  387.995020]  ? syscall_slow_exit_work+0x4d0/0x4d0
[  387.996072]  ? syscall_return_slowpath+0x4e0/0x4e0
[  387.997150]  ? syscall_return_slowpath+0x342/0x4e0
[  387.998154]  ? entry_SYSCALL_64_after_hwframe+0x59/0xbe
[  387.999002]  ? async_page_fault+0x8/0x30
[  387.999685]  ? trace_hardirqs_off_thunk+0x1a/0x1c
[  388.000574]  ? async_page_fault+0x8/0x30
[  388.001180]  ? async_page_fault+0x1e/0x30
```


## bad page map - bug

Found in LK v4.17.0+.

### Call Trace (Dump)

```c
[  697.425122] kernel BUG at include/linux/mm.h:499!
[  697.425136] invalid opcode: 0000 [#1] SMP KASAN PTI
[  697.425147] CPU: 1 PID: 19619 Comm: syz-executor11 Tainted: G    B             4.17.0+ #9
[  697.425153] Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS 1.10.2-1ubuntu1 04/01/2014
[  697.425165] RIP: 0010:release_pages+0x12d2/0x22c0
[  697.425168] Code: 0f 85 ab 0e 00 00 48 8b 44 24 08 45 31 e4 48 8b 28 e9 e3 fe ff ff e8 fd 89 dd ff 48 c7 c6 e0 af 8c 8f 48 89 ef e8 2e 9e 09 00 <0f> 0b e8 e7 89 dd ff 49 8d 6d ff e9 65 f0 ff ff e8 d9 89 dd ff 4c 
[  697.425363] RSP: 0018:ffff880045d3e2f0 EFLAGS: 00010286
[  697.425372] RAX: 0000000000000000 RBX: dffffc0000000000 RCX: 0000000000000000
[  697.425378] RDX: 0000000000000000 RSI: 0000000000000000 RDI: ffffed0008ba7c50
[  697.425385] RBP: ffffea0000003600 R08: ffff8800457842c0 R09: ffffed000ce63d06
[  697.425391] R10: ffffed000ce63d06 R11: ffff88006731e837 R12: 0000000000000000
[  697.425398] R13: ffffea0000003634 R14: ffffed0008ba7c90 R15: 1ffff10008ba7c78
[  697.425406] FS:  0000000000ba1940(0000) GS:ffff880067300000(0000) knlGS:0000000000000000
[  697.425413] CS:  0010 DS: 0000 ES: 0000 CR0: 0000000080050033
[  697.425419] CR2: 00007f95ce09e349 CR3: 000000005236a000 CR4: 00000000000006e0
[  697.425426] Call Trace:
[  697.425447]  ? __pagevec_lru_add_fn+0x2570/0x2570
[  697.425459]  ? check_chain_key+0x3c0/0x3c0
[  697.425471]  ? console_unlock+0x774/0xed0
[  697.425483]  ? check_flags.part.37+0x420/0x420
[  697.425496]  ? widen_string+0xd7/0x2a0
[  697.425509]  ? format_decode+0xa50/0xa50
[  697.425525]  ? check_chain_key+0x3c0/0x3c0
[  697.425535]  ? perf_trace_lock+0xde/0x950
[  697.425544]  ? down_trylock+0x46/0x70
[  697.425552]  ? lock_acquire+0x1b3/0x4a0
[  697.425566]  ? check_chain_key+0x3c0/0x3c0
[  697.425577]  ? vprintk_emit+0x982/0xb80
[  697.425586]  ? lock_acquire+0x1b3/0x4a0
[  697.425597]  ? check_flags.part.37+0x420/0x420
[  697.425612]  ? irq_work_claim+0xa4/0xc0
[  697.425624]  ? irq_work_queue+0xb0/0x120
[  697.425635]  ? wake_up_klogd+0xc5/0x110
[  697.425645]  ? down_trylock+0x46/0x70
[  697.425662]  ? check_chain_key+0x3c0/0x3c0
[  697.425674]  ? __is_insn_slot_addr+0x251/0x3a0
[  697.425682]  ? lock_acquire+0x1b3/0x4a0
[  697.425693]  ? check_flags.part.37+0x420/0x420
[  697.425706]  ? __lock_acquire+0x4f90/0x4f90
[  697.425715]  ? vprintk_emit+0x383/0xb80
[  697.425732]  ? deref_stack_reg+0x110/0x110
[  697.425742]  ? page_mapping+0x479/0x840
[  697.425752]  ? __page_mapcount+0x410/0x410
[  697.425764]  ? __is_insn_slot_addr+0x27a/0x3a0
[  697.425776]  ? __free_insn_slot+0x6a0/0x6a0
[  697.425789]  ? rcu_is_watching+0x81/0x130
[  697.425799]  ? printk+0xa7/0xcf
[  697.425810]  ? _rcu_barrier_trace+0x450/0x450
[  697.425819]  ? mark_held_locks+0xc1/0x140
[  697.425836]  ? perf_trace_lock+0xde/0x950
[  697.425851]  ? check_chain_key+0x3c0/0x3c0
[  697.425859]  ? __writepage+0xe0/0xe0
[  697.425875]  ? dump_stack+0x1df/0x229
[  697.425885]  ? PageHuge+0x175/0x2a0
[  697.425896]  ? vma_kernel_pagesize+0xa0/0xa0
[  697.425905]  ? dump_stack+0x1e9/0x229
[  697.425917]  ? dump_stack+0x1f3/0x229
[  697.425926]  ? find_next_bit+0x101/0x130
[  697.425942]  ? free_pages_and_swap_cache+0x385/0x5c0
[  697.425956]  ? free_page_and_swap_cache+0x6d0/0x6d0
[  697.425966]  ? check_chain_key+0x3c0/0x3c0
[  697.425978]  ? unmap_page_range+0x1722/0x1fc0
[  697.425990]  ? check_flags.part.37+0x420/0x420
[  697.426007]  ? do_raw_spin_unlock+0xac/0x310
[  697.426019]  ? do_raw_spin_trylock+0x1b0/0x1b0
[  697.426031]  ? _vm_normal_page+0x112/0x270
[  697.426042]  ? __pte_alloc_kernel+0x270/0x270
[  697.426056]  ? tlb_flush_mmu_free+0xb2/0x150
[  697.426070]  ? unmap_page_range+0x172c/0x1fc0
[  697.426106]  ? _vm_normal_page+0x270/0x270
[  697.426123]  ? cpumask_any_but+0xa1/0xc0
[  697.426138]  ? flush_tlb_mm_range+0x20c/0x3e0
[  697.426147]  ? __unwind_start+0x61c/0x8e0
[  697.426163]  ? native_flush_tlb_others+0x630/0x630
[  697.426173]  ? save_trace+0x300/0x300
[  697.426188]  ? __delete_object+0x140/0x1c0
[  697.426199]  ? check_flags.part.37+0x420/0x420
[  697.426213]  ? find_held_lock+0x33/0x1b0
[  697.426227]  ? pagevec_lru_move_fn+0x240/0x330
[  697.426239]  ? check_flags.part.37+0x420/0x420
[  697.426252]  ? do_raw_spin_unlock+0xac/0x310
[  697.426264]  ? uprobe_munmap+0x138/0x400
[  697.426275]  ? do_raw_spin_trylock+0x1b0/0x1b0
[  697.426285]  ? uprobe_mmap+0xc60/0xc60
[  697.426309]  ? unmap_single_vma+0x198/0x300
[  697.426324]  ? unmap_vmas+0x11c/0x1f0
[  697.426337]  ? exit_mmap+0x27f/0x530
[  697.426348]  ? __ia32_sys_munmap+0x70/0x70
[  697.426374]  ? mmput+0x1c7/0x4e0
[  697.426385]  ? set_mm_exe_file+0x1d0/0x1d0
[  697.426397]  ? do_raw_spin_unlock+0xac/0x310
[  697.426408]  ? do_raw_spin_trylock+0x1b0/0x1b0
[  697.426419]  ? __down_interruptible+0x700/0x700
[  697.426430]  ? blocking_notifier_call_chain+0xdb/0x160
[  697.426444]  ? do_raw_spin_lock+0xb8/0x1c0
[  697.426460]  ? do_exit+0xdec/0x2480
[  697.426476]  ? release_task.part.17+0x1970/0x1970
[  697.426490]  ? lock_release+0x8e0/0x8e0
[  697.426500]  ? hrtimer_forward+0x2a0/0x2a0
[  697.426512]  ? do_raw_spin_unlock+0xac/0x310
[  697.426523]  ? do_raw_spin_trylock+0x1b0/0x1b0
[  697.426539]  ? _raw_spin_unlock_irqrestore+0x46/0x60
[  697.426555]  ? hrtimer_try_to_cancel+0xaa/0x620
[  697.426567]  ? hrtimer_run_softirq+0x210/0x210
[  697.426577]  ? check_flags.part.37+0x420/0x420
[  697.426590]  ? do_raw_spin_unlock+0xac/0x310
[  697.426601]  ? do_raw_spin_trylock+0x1b0/0x1b0
[  697.426623]  ? hrtimer_cancel+0x2f/0x40
[  697.426634]  ? futex_wait+0x571/0x980
[  697.426651]  ? futex_wait_setup+0x3c0/0x3c0
[  697.426669]  ? __hrtimer_init+0x220/0x220
[  697.426696]  ? save_trace+0x300/0x300
[  697.426713]  ? memset+0x1f/0x40
[  697.426727]  ? find_held_lock+0x33/0x1b0
[  697.426741]  ? get_signal+0x944/0x19e0
[  697.426753]  ? check_flags.part.37+0x420/0x420
[  697.426770]  ? do_group_exit+0x16e/0x3e0
[  697.426782]  ? is_current_pgrp_orphaned+0x90/0x90
[  697.426794]  ? _raw_spin_unlock_irq+0x24/0x40
[  697.426808]  ? get_signal+0x8c3/0x19e0
[  697.426824]  ? ptrace_notify+0x130/0x130
[  697.426841]  ? find_held_lock+0x33/0x1b0
[  697.426856]  ? __x64_sys_futex+0x418/0x535
[  697.426867]  ? check_flags.part.37+0x420/0x420
[  697.426884]  ? do_signal+0x92/0x1920
[  697.426895]  ? pvclock_read_flags+0x150/0x150
[  697.426905]  ? __might_fault+0x11f/0x1d0
[  697.426920]  ? setup_sigcontext+0x820/0x820
[  697.426931]  ? kvm_clock_read+0x21/0x30
[  697.426939]  ? ktime_get+0x267/0x2f0
[  697.426952]  ? ktime_get_raw_ts64+0x370/0x370
[  697.426974]  ? __x64_sys_futex+0x359/0x535
[  697.426984]  ? __x64_sys_futex+0x363/0x535
[  697.426996]  ? exit_to_usermode_loop+0x1ab/0x270
[  697.427009]  ? exit_to_usermode_loop+0x1fa/0x270
[  697.427019]  ? syscall_slow_exit_work+0x4d0/0x4d0
[  697.427029]  ? __x64_sys_timer_create+0x1d0/0x1d0
[  697.427042]  ? do_syscall_64+0x8d/0x670
[  697.427054]  ? do_syscall_64+0x5b3/0x670
[  697.427064]  ? syscall_slow_exit_work+0x4d0/0x4d0
[  697.427074]  ? syscall_return_slowpath+0x4e0/0x4e0
[  697.427085]  ? syscall_return_slowpath+0x342/0x4e0
[  697.427098]  ? entry_SYSCALL_64_after_hwframe+0x59/0xbe
[  697.427111]  ? trace_hardirqs_off_thunk+0x1a/0x1c
[  697.427126]  ? entry_SYSCALL_64_after_hwframe+0x49/0xbe
[  697.427141] Modules linked in:
[  697.427150] Dumping ftrace buffer:
[  697.427155]    (ftrace buffer empty)
[  697.427189] ---[ end trace 2dcb8303d5b0889e ]---
[  697.427200] RIP: 0010:release_pages+0x12d2/0x22c0
[  697.427202] Code: 0f 85 ab 0e 00 00 48 8b 44 24 08 45 31 e4 48 8b 28 e9 e3 fe ff ff e8 fd 89 dd ff 48 c7 c6 e0 af 8c 8f 48 89 ef e8 2e 9e 09 00 <0f> 0b e8 e7 89 dd ff 49 8d 6d ff e9 65 f0 ff ff e8 d9 89 dd ff 4c 
[  697.427396] RSP: 0018:ffff880045d3e2f0 EFLAGS: 00010286
[  697.427405] RAX: 0000000000000000 RBX: dffffc0000000000 RCX: 0000000000000000
[  697.427411] RDX: 0000000000000000 RSI: 0000000000000000 RDI: ffffed0008ba7c50
[  697.427418] RBP: ffffea0000003600 R08: ffff8800457842c0 R09: ffffed000ce63d06
[  697.427424] R10: ffffed000ce63d06 R11: ffff88006731e837 R12: 0000000000000000
[  697.427430] R13: ffffea0000003634 R14: ffffed0008ba7c90 R15: 1ffff10008ba7c78
[  697.427438] FS:  0000000000ba1940(0000) GS:ffff880067300000(0000) knlGS:0000000000000000
[  697.427445] CS:  0010 DS: 0000 ES: 0000 CR0: 0000000080050033
[  697.427451] CR2: 00007f95ce09e349 CR3: 000000005236a000 CR4: 00000000000006e0
[  697.427458] Kernel panic - not syncing: Fatal exception
[  697.434901] Dumping ftrace buffer:
[  697.434908]    (ftrace buffer empty)
[  697.434919] Kernel Offset: 0xb400000 from 0xffffffff81000000 (relocation range: 0xffffffff80000000-0xffffffffbfffffff)
[  697.629931] Rebooting in 86400 seconds..
```




## bad rss-counter state - bug

Found in LK v4.17.0+.

### Call Trace (Dump)

```c
...
[ 1251.494022] BUG: Bad rss-counter state mm:00000000bb7fc423 idx:0 val:8192
[ 1251.494998] BUG: Bad rss-counter state mm:00000000bb7fc423 idx:1 val:2
[ 1251.495890] BUG: non-zero pgtables_bytes on freeing mm: 73728
...
```


## dev_watchdog - warning

Got from syzkaller & Found in LK v4.17.0+.

### Call Trace (Dump)

```c
------------[ cut here ]------------
NETDEV WATCHDOG: eth0 (e1000): transmit queue 0 timed out
WARNING: CPU: 1 PID: 0 at net/sched/sch_generic.c:461 dev_watchdog+0x919/0xa40 net/sched/sch_generic.c:460
Kernel panic - not syncing: panic_on_warn set ...

CPU: 1 PID: 0 Comm: swapper/1 Not tainted 4.17.0+ #9
Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS 1.10.2-1ubuntu1 04/01/2014
Call Trace:
 <IRQ>
 </IRQ>
Dumping ftrace buffer:
   (ftrace buffer empty)
Kernel Offset: 0x12800000 from 0xffffffff81000000 (relocation range: 0xffffffff80000000-0xffffffffbfffffff)
Rebooting in 86400 seconds..
```


## ext4_data_block_valid - use after free Read

Found in LK v4.17.0+. Interesting one... :)

### Call Trace (Dump)

```c
[  198.171416] EXT4-fs (sda): re-mounted. Opts: noblock_validity,,errors=continue
[  198.171520] ==================================================================
[  198.173422] BUG: KASAN: use-after-free in ext4_data_block_valid+0x2c1/0x320
[  198.174371] Read of size 8 at addr ffff880065ee36a8 by task syz-executor6/12409
[  198.175341] 
[  198.175547] CPU: 0 PID: 12409 Comm: syz-executor6 Not tainted 4.17.0+ #9
[  198.176441] Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS 1.10.2-1ubuntu1 04/01/2014
[  198.177609] Call Trace:
[  198.177931]  ? dump_stack+0x138/0x229
[  198.178478]  ? dump_stack_print_info.cold.1+0x45/0x45
[  198.179109]  ? kmsg_dump_rewind_nolock+0xd9/0xd9
[  198.179785]  ? ext4_data_block_valid+0x2c1/0x320
[  198.180363]  ? print_address_description+0x60/0x25c
[  198.181055]  ? ext4_data_block_valid+0x2c1/0x320
[  198.181820]  ? kasan_report.cold.7+0xac/0x2f4
[  198.182421]  ? ext4_data_block_valid+0x2c1/0x320
[  198.183134]  ? __check_block_validity.constprop.82+0xbc/0x200
[  198.183918]  ? ext4_map_blocks+0xf5a/0x19d0
[  198.184531]  ? ext4_issue_zeroout+0x150/0x150
[  198.185152]  ? ext4_getblk+0x4b9/0x5d0
[  198.185640]  ? __lock_is_held+0xad/0x140
[  198.186140]  ? ext4_iomap_begin+0x1210/0x1210
[  198.186735]  ? mark_held_locks+0xc1/0x140
[  198.187257]  ? ext4_bread_batch+0x79/0x3f0
[  198.187795]  ? ext4_find_entry+0x612/0x1140
[  198.188335]  ? ext4_dx_find_entry+0x400/0x400
[  198.188905]  ? d_alloc+0x267/0x330
[  198.189346]  ? do_raw_spin_unlock+0xac/0x310
[  198.189899]  ? do_raw_spin_trylock+0x1b0/0x1b0
[  198.190496]  ? mark_held_locks+0xc1/0x140
[  198.191004]  ? d_lookup+0x17f/0x1e0
[  198.191475]  ? ext4_lookup+0x15a/0x6a0
[  198.191953]  ? ext4_cross_rename+0x1d20/0x1d20
[  198.192530]  ? __lookup_hash+0x12a/0x190
[  198.193029]  ? filename_create+0x1ba/0x560
[  198.193580]  ? kern_path_mountpoint+0x40/0x40
[  198.194189]  ? rcu_read_lock_sched_held+0x102/0x120
[  198.194848]  ? getname_flags+0x268/0x5a0
[  198.195366]  ? do_symlinkat+0xe7/0x260
[  198.195866]  ? __x64_sys_unlinkat+0x120/0x120
[  198.196435]  ? do_syscall_64+0x8d/0x670
[  198.196930]  ? do_syscall_64+0x165/0x670
[  198.197443]  ? syscall_return_slowpath+0x4e0/0x4e0
[  198.198049]  ? syscall_return_slowpath+0x342/0x4e0
[  198.198686]  ? prepare_exit_to_usermode+0x380/0x380
[  198.199312]  ? entry_SYSCALL_64_after_hwframe+0x59/0xbe
[  198.199986]  ? trace_hardirqs_off_thunk+0x1a/0x1c
[  198.200650]  ? entry_SYSCALL_64_after_hwframe+0x49/0xbe
[  198.201317] 
[  198.201538] Allocated by task 1:
[  198.201948] (stack is not available)
[  198.202435] 
[  198.202649] Freed by task 12388:
[  198.203062] (stack is not available)
[  198.203532] 
[  198.203742] The buggy address belongs to the object at ffff880065ee3690
[  198.203742]  which belongs to the cache ext4_system_zone of size 40
[  198.205321] The buggy address is located 24 bytes inside of
[  198.205321]  40-byte region [ffff880065ee3690, ffff880065ee36b8)
[  198.206771] The buggy address belongs to the page:
[  198.207384] page:ffffea000197b8c0 count:1 mapcount:0 mapping:ffff8800692fbc80 index:0x0
[  198.208380] flags: 0x100000000000100(slab)
[  198.208914] raw: 0100000000000100 dead000000000100 dead000000000200 ffff8800692fbc80
[  198.209879] raw: 0000000000000000 0000000080490049 00000001ffffffff 0000000000000000
[  198.210872] page dumped because: kasan: bad access detected
[  198.211581] 
[  198.211788] Memory state around the buggy address:
[  198.212388]  ffff880065ee3580: fb fb fb fb fc fc fb fb fb fb fb fc fc fb fb fb
[  198.213285]  ffff880065ee3600: fb fb fc fc fb fb fb fb fb fc fc fb fb fb fb fb
[  198.214183] >ffff880065ee3680: fc fc fb fb fb fb fb fc fc fc fc fc fc fc fc fc
[  198.215139]                                   ^
[  198.215145]  ffff880065ee3700: fc fc fc fc fc fc fc fc fc fc fc fc fc fc fc fc
[  198.215150]  ffff880065ee3780: fc fc fc fc fc fc fc fc fc fc fc fc fc fc fc fc
[  198.215152] ==================================================================
```

## kmem_cache_alloc - general page fault

Found on LK v4.17.0+. lead to null-dereference.

### Call Trace (Dump)

```c
kasan: CONFIG_KASAN_INLINE enabled
kasan: GPF could be caused by NULL-ptr deref or user memory access
general protection fault: 0000 [#1] SMP KASAN PTI
CPU: 0 PID: 30860 Comm: modprobe Not tainted 4.17.0+ #9
Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS 1.10.2-1ubuntu1 04/01/2014
RIP: 0010:prefetch_freepointer mm/slub.c:275 [inline]
RIP: 0010:slab_alloc_node mm/slub.c:2701 [inline]
RIP: 0010:slab_alloc mm/slub.c:2716 [inline]
RIP: 0010:kmem_cache_alloc+0xb0/0x290 mm/slub.c:2721
Code: 00 49 8b 1c 04 40 f6 c7 0f 0f 85 9e 01 00 00 48 8d 4a 01 4c 89 e0 65 48 0f c7 0f 0f 94 c0 84 c0 74 b0 48 85 db 74 0a 8b 45 20 <48> 8b 04 03 0f 18 08 41 f7 c5 00 80 00 00 0f 85 20 01 00 00 8b 1d 
RSP: 0018:ffff880041797ba8 EFLAGS: 00010206
RAX: 0000000000000000 RBX: 20007e0e00000a21 RCX: 0000000000067974
RDX: 0000000000067973 RSI: 00000000006000c0 RDI: 000000000002fb40
RBP: ffff88006cdfb080 R08: ffff88006d02fb40 R09: 0000000000000003
R10: 0000000000000001 R11: ffff8800417978f8 R12: ffff880045a61108
R13: 00000000006000c0 R14: ffffffffb7f62a37 R15: 0000000000000000
FS:  0000000000000000(0000) GS:ffff88006d000000(0000) knlGS:0000000000000000
CS:  0010 DS: 0000 ES: 0000 CR0: 0000000080050033
CR2: 00007f316cd22db8 CR3: 000000002c19a000 CR4: 00000000000006f0
DR0: 0000000020000000 DR1: 0000000020000000 DR2: 0000000000000000
DR3: 0000000000000000 DR6: 00000000ffff0ff0 DR7: 0000000000000600
```


## qlist_free_all - unable to handle kernel paging request

Found on LK v4.17.0+.

### Call Trace (Dump)

```c
BUG: unable to handle kernel paging request at 00000be050002008
PGD 0 P4D 0 
Oops: 0000 [#1] SMP KASAN PTI
CPU: 0 PID: 10987 Comm: udevd Not tainted 4.17.0+ #9
Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS 1.10.2-1ubuntu1 04/01/2014
RIP: 0010:virt_to_head_page include/linux/mm.h:638 [inline]
RIP: 0010:qlink_to_cache mm/kasan/quarantine.c:127 [inline]
RIP: 0010:qlist_free_all+0x7b/0xc0 mm/kasan/quarantine.c:163
Code: df 48 85 db 75 db 48 89 f0 4c 01 f0 72 54 4c 89 fa 48 2b 15 d7 bf 3e 03 48 01 d0 48 c1 e8 0c 48 c1 e0 06 48 03 05 b5 bf 3e 03 <48> 8b 50 08 48 8d 4a ff 83 e2 01 48 0f 45 c1 48 8b 78 18 eb a2 49 
RSP: 0018:ffff880063eef8f0 EFLAGS: 00010207
RAX: 00000be050002000 RBX: 0000000000000000 RCX: 0000000000000000
RDX: 000077ff80000000 RSI: 0008001400080004 RDI: 0000000000000000
RBP: 0008001400080004 R08: 0000000000000001 R09: 0000000000000000
R10: 0000000000000000 R11: 0000000000000001 R12: ffffffffa99fd7d2
R13: ffff880063eef928 R14: 0000000080000000 R15: ffffffff80000000
FS:  00007f9b8de627a0(0000) GS:ffff88006d000000(0000) knlGS:0000000000000000
CS:  0010 DS: 0000 ES: 0000 CR0: 0000000080050033
CR2: 00000be050002008 CR3: 0000000067e9e000 CR4: 00000000000006f0
```

