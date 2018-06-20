---
layout: post
title: LK v4.17.x - bad page map - bug
comments: true
---

bad page map - bug

posted & found by [zer0day](https://kozistr.github.io/)

## tl;dr

Found in LK v4.17.0+. Interesting one... :)

## Call Trace (Dump)

Here's dmesg.

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

## PoC

Skip!

**End**
