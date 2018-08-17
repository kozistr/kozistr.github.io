---
layout: post
title: LK v4.16.x - perf_exclude_event - oobs
author: zer0day
categories: lk
---

perf_exclude_event - alloca Out Of Bounds

posted & found by [zer0day](https://kozistr.github.io/)

## tl;dr

Got from syzkaller & Found in LK v4.16.0-rc4. Only Call Trace (Dump).

## Call Trace (Dump)

Here's a dump.

```c
[   45.867098] BUG: KASAN: alloca-out-of-bounds in perf_exclude_event+0x17e/0x190 kernel/events/core.c:7521
[   45.867976] Read of size 8 at addr ffff880022efeae0 by task syz-executor7/7812
[   45.868795] 
[   45.869000] CPU: 0 PID: 7812 Comm: syz-executor7 Not tainted 4.16.0-rc4 #6
[   45.869791] Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS 1.10.2-1ubuntu1 04/01/2014
[   45.870801] Call Trace:
[   45.871096]  <IRQ>
[   45.871352]  dump_stack+0x127/0x213
[   45.871771]  ? _atomic_dec_and_lock+0x18d/0x18d
[   45.872299]  ? show_regs_print_info+0x12/0x12
[   45.872816]  ? perf_exclude_event+0x17e/0x190
[   45.873337]  print_address_description+0x60/0x22b
[   45.873886]  ? perf_exclude_event+0x17e/0x190
[   45.874407]  kasan_report.cold.6+0xac/0x2f4
[   45.874913]  ? perf_exclude_event+0x17e/0x190
[   45.875437]  ? perf_swevent_hrtimer+0x28c/0x500
[   45.875970]  ? save_trace+0x300/0x300
[   45.876399]  ? scsi_finish_command+0x611/0x810
[   45.876920]  ? perf_iterate_ctx+0x420/0x420
[   45.877439]  ? save_trace+0x300/0x300
[   45.877870]  ? rcu_nmi_exit+0x742/0x970
[   45.878333]  ? find_held_lock+0x33/0x1b0
[   45.878824]  ? save_trace+0x300/0x300
[   45.879328]  ? save_trace+0x300/0x300
[   45.879918]  ? lock_acquire+0x4a0/0x4a0
[   45.880438]  ? save_trace+0x300/0x300
[   45.880882]  ? enqueue_hrtimer+0x171/0x500
[   45.881373]  ? do_raw_spin_trylock+0x190/0x190
[   45.881920]  ? save_trace+0x300/0x300
[   45.882369]  ? __lock_is_held+0xad/0x140
[   45.882860]  ? __hrtimer_run_queues+0x379/0x1000
[   45.883414]  ? perf_iterate_ctx+0x420/0x420
[   45.883907]  ? hrtimer_interrupt+0x10b/0x730
[   45.884432]  ? hrtimer_init+0x430/0x430
[   45.884889]  ? lock_downgrade+0x6d0/0x6d0
[   45.885382]  ? rcu_read_lock_sched_held+0x102/0x120
[   45.885958]  ? pvclock_read_flags+0x150/0x150
[   45.886476]  ? __lock_is_held+0xad/0x140
[   45.886952]  ? kvm_clock_read+0x21/0x30
[   45.887423]  ? ktime_get_update_offsets_now+0x324/0x400
[   45.888048]  ? do_timer+0x40/0x40
[   45.888449]  ? save_trace+0x300/0x300
[   45.888884]  ? rcu_read_lock_sched_held+0x102/0x120
[   45.889470]  ? hpet_assign_irq+0x1e0/0x1e0
[   45.889991]  ? hrtimer_interrupt+0x2e9/0x730
[   45.890512]  ? smp_apic_timer_interrupt+0x14d/0x710
[   45.891093]  ? smp_call_function_single_interrupt+0x660/0x660
[   45.891778]  ? handle_edge_irq+0x322/0x840
[   45.892270]  ? task_prio+0x50/0x50
[   45.892695]  ? _raw_spin_unlock+0x1f/0x30
[   45.893172]  ? trace_hardirqs_off_thunk+0x1a/0x1c
[   45.893767]  ? apic_timer_interrupt+0xf/0x20
[   45.894266]  </IRQ>
[   45.894546]  ? crypto_shash_update+0x23d/0x2a0
[   45.895075]  ? kasan_disable_current+0x20/0x20
[   45.895627]  ? crypto_shash_update+0x24d/0x2a0
[   45.896161]  ? ext4_inode_csum.isra.59+0x562/0xef0
[   45.896726]  ? ext4_journalled_zero_new_buffers+0x4e0/0x4e0
[   45.897421]  ? trace_hardirqs_on_thunk+0x1a/0x1c
[   45.897974]  ? retint_kernel+0x10/0x10
[   45.898434]  ? retint_kernel+0x10/0x10
[   45.898917]  ? trace_hardirqs_on_thunk+0x1a/0x1c
[   45.899470]  ? retint_kernel+0x10/0x10
[   45.899925]  ? ext4_inode_csum_set+0x17c/0x370
[   45.900450]  ? ext4_mark_iloc_dirty+0x1709/0x2cc0
[   45.901030]  ? ext4_chunk_trans_blocks+0x20/0x20
[   45.901578]  ? jbd2_journal_add_journal_head+0x3b0/0x560
[   45.902205]  ? jbd2_write_access_granted.part.8+0x264/0x410
[   45.902851]  ? jbd2_journal_write_metadata_buffer+0xf80/0xf80
[   45.903498]  ? rcu_note_context_switch+0x710/0x710
[   45.904022]  ? jbd2_journal_put_journal_head+0x3b1/0x54f
[   45.904594]  ? jbd2_journal_get_write_access+0x6b/0xb0
[   45.905153]  ? __ext4_journal_get_write_access+0x143/0x200
[   45.905795]  ? ext4_mark_inode_dirty+0x220/0xac0
[   45.906307]  ? ext4_dirty_inode+0x8d/0xb0
[   45.906776]  ? ext4_expand_extra_isize+0x560/0x560
[   45.907316]  ? __lock_is_held+0xad/0x140
[   45.907857]  ? ext4_setattr+0x2a90/0x2a90
[   45.908361]  ? __ext4_journal_start_sb+0x175/0x5d0
[   45.908950]  ? ext4_dirty_inode+0x5b/0xb0
[   45.909480]  ? ext4_journal_abort_handle.isra.4+0x250/0x250
[   45.910212]  ? __lock_is_held+0xad/0x140
[   45.910774]  ? ext4_setattr+0x2a90/0x2a90
[   45.911330]  ? ext4_dirty_inode+0x8d/0xb0
[   45.911855]  ? __mark_inode_dirty+0x798/0x1570
[   45.912431]  ? redirty_tail+0x200/0x200
[   45.912947]  ? preempt_schedule_common+0x1d/0x50
[   45.913551]  ? _cond_resched+0x18/0x20
[   45.914033]  ? filemap_fault+0x5bf/0x1c30
[   45.914555]  ? mark_held_locks+0xc1/0x140
[   45.915048]  ? retint_kernel+0x10/0x10
[   45.915536]  ? trace_hardirqs_on_thunk+0x1a/0x1c
[   45.916149]  ? retint_kernel+0x10/0x10
[   45.916662]  ? current_kernel_time64+0x189/0x200
[   45.917293]  ? current_kernel_time64+0x1a4/0x200
[   45.917909]  ? generic_update_time+0x26a/0x430
[   45.918426]  ? put_itimerspec64+0x2f0/0x2f0
[   45.918923]  ? dentry_needs_remove_privs.part.24+0x60/0x60
[   45.919546]  ? lock_acquire+0x1b3/0x4a0
[   45.920005]  ? dentry_needs_remove_privs.part.24+0x60/0x60
[   45.920639]  ? file_update_time+0x383/0x620
[   45.921172]  ? current_time+0xc0/0xc0
[   45.921646]  ? rcu_read_lock_sched_held+0x102/0x120
[   45.922306]  ? rcu_sync_lockdep_assert+0x6f/0xb0
[   45.922886]  ? __sb_start_write+0x171/0x2f0
[   45.923421]  ? ext4_page_mkwrite+0x1db/0x1320
[   45.923976]  ? futex_wake+0x6d0/0x6d0
[   45.924411]  ? ext4_change_inode_journal_flag+0x3f0/0x3f0
[   45.925015]  ? ext4_filemap_fault+0x75/0xa4
[   45.925552]  ? __down_interruptible+0x700/0x700
[   45.926145]  ? do_page_mkwrite+0x137/0x470
[   45.926673]  ? __do_fault+0x3f0/0x3f0
[   45.927169]  ? wake_up_page_bit+0x610/0x610
[   45.927745]  ? __handle_mm_fault+0x448/0x3940
[   45.928264]  ? __handle_mm_fault+0x1e62/0x3940
[   45.928808]  ? vm_insert_mixed_mkwrite+0x30/0x30
[   45.929363]  ? save_trace+0x300/0x300
[   45.929839]  ? find_held_lock+0x33/0x1b0
[   45.930336]  ? print_usage_bug+0x140/0x140
[   45.930820]  ? exit_robust_list+0x290/0x290
[   45.931322]  ? print_usage_bug+0x140/0x140
[   45.931790]  ? print_usage_bug+0x140/0x140
[   45.932317]  ? lock_acquire+0x4a0/0x4a0
[   45.932748]  ? lock_acquire+0x4a0/0x4a0
[   45.933213]  ? print_usage_bug+0x140/0x140
[   45.933748]  ? do_raw_spin_trylock+0x190/0x190
[   45.934293]  ? save_trace+0x300/0x300
[   45.934742]  ? mark_held_locks+0xc1/0x140
[   45.935224]  ? find_held_lock+0x33/0x1b0
[   45.935695]  ? retint_kernel+0x10/0x10
[   45.936147]  ? mark_held_locks+0xc1/0x140
[   45.936623]  ? retint_kernel+0x10/0x10
[   45.937106]  ? save_trace+0x300/0x300
[   45.937611]  ? mark_held_locks+0xc1/0x140
[   45.938192]  ? retint_kernel+0x10/0x10
[   45.938672]  ? trace_hardirqs_on_thunk+0x1a/0x1c
[   45.939215]  ? retint_kernel+0x10/0x10
[   45.939611]  ? handle_mm_fault+0x15a/0x410
[   45.940175]  ? __do_page_fault+0x672/0xe30
[   45.940700]  ? mm_fault_error+0x360/0x360
[   45.941258]  ? SyS_clock_settime+0x230/0x230
[   45.941801]  ? async_page_fault+0x2f/0x50
[   45.942153]  ? do_page_fault+0xc1/0x720
[   45.942536]  ? __do_page_fault+0xe30/0xe30
[   45.942955]  ? exit_to_usermode_loop+0x1c6/0x230
[   45.943435]  ? syscall_return_slowpath+0x4e0/0x4e0
[   45.943889]  ? syscall_return_slowpath+0x342/0x4e0
[   45.944351]  ? retint_user+0x18/0x18
[   45.944721]  ? async_page_fault+0x2f/0x50
[   45.945180]  ? trace_hardirqs_off_thunk+0x1a/0x1c
[   45.945734]  ? async_page_fault+0x2f/0x50
[   45.946290]  ? async_page_fault+0x45/0x50
[   45.946824] 
[   45.947035] The buggy address belongs to the page:
[   45.947726] page:ffffea00008bbf80 count:0 mapcount:0 mapping:0000000000000000 index:0x0
[   45.948791] flags: 0x100000000000000()
[   45.949241] raw: 0100000000000000 0000000000000000 0000000000000000 00000000ffffffff
[   45.950342] raw: 0000000000000000 dead000000000200 0000000000000000 0000000000000000
[   45.951364] page dumped because: kasan: bad access detected
[   45.952057] 
[   45.952367] Memory state around the buggy address:
[   45.953002]  ffff880022efe980: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
[   45.953821]  ffff880022efea00: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
[   45.954860] >ffff880022efea80: 00 00 00 00 ca ca ca ca 02 cb cb cb cb cb cb cb
[   45.955823]                                                        ^
[   45.956398]  ffff880022efeb00: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
[   45.957172]  ffff880022efeb80: 00 00 00 f1 f1 f1 f1 02 f2 f2 f2 f2 f2 f2 f2 00
[   45.958089] ==================================================================
[   45.958800] Disabling lock debugging due to kernel taint
[   45.959376] Kernel panic - not syncing: panic_on_warn set ...
[   45.959376] 
[   45.959999] CPU: 0 PID: 7812 Comm: syz-executor7 Tainted: G    B            4.16.0-rc4 #6
[   45.960804] Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS 1.10.2-1ubuntu1 04/01/2014
[   45.961596] Call Trace:
[   45.961811]  <IRQ>
[   45.962030]  dump_stack+0x127/0x213
[   45.962440]  ? _atomic_dec_and_lock+0x18d/0x18d
[   45.962954]  panic+0x1f8/0x46f
[   45.963226]  ? add_taint.cold.5+0x16/0x16
[   45.963553]  ? add_taint+0x21/0x50
[   45.963825]  ? perf_exclude_event+0x17e/0x190
[   45.964222]  kasan_end_report+0x43/0x49
[   45.964525]  kasan_report.cold.6+0xc8/0x2f4
[   45.964911]  ? perf_exclude_event+0x17e/0x190
[   45.965295]  ? perf_swevent_hrtimer+0x28c/0x500
[   45.965795]  ? save_trace+0x300/0x300
[   45.966188]  ? scsi_finish_command+0x611/0x810
[   45.966716]  ? perf_iterate_ctx+0x420/0x420
[   45.967079]  ? save_trace+0x300/0x300
[   45.967399]  ? rcu_nmi_exit+0x742/0x970
[   45.967797]  ? find_held_lock+0x33/0x1b0
[   45.968138]  ? save_trace+0x300/0x300
[   45.968501]  ? save_trace+0x300/0x300
[   45.968824]  ? lock_acquire+0x4a0/0x4a0
[   45.969160]  ? save_trace+0x300/0x300
[   45.969534]  ? enqueue_hrtimer+0x171/0x500
[   45.969893]  ? do_raw_spin_trylock+0x190/0x190
[   45.970309]  ? save_trace+0x300/0x300
[   45.970656]  ? __lock_is_held+0xad/0x140
[   45.970999]  ? __hrtimer_run_queues+0x379/0x1000
[   45.971508]  ? perf_iterate_ctx+0x420/0x420
[   45.971873]  ? hrtimer_interrupt+0x10b/0x730
[   45.972324]  ? hrtimer_init+0x430/0x430
[   45.972663]  ? lock_downgrade+0x6d0/0x6d0
[   45.973047]  ? rcu_read_lock_sched_held+0x102/0x120
[   45.973472]  ? pvclock_read_flags+0x150/0x150
[   45.973889]  ? __lock_is_held+0xad/0x140
[   45.974284]  ? kvm_clock_read+0x21/0x30
[   45.974686]  ? ktime_get_update_offsets_now+0x324/0x400
[   45.975245]  ? do_timer+0x40/0x40
[   45.975596]  ? save_trace+0x300/0x300
[   45.976009]  ? rcu_read_lock_sched_held+0x102/0x120
[   45.976572]  ? hpet_assign_irq+0x1e0/0x1e0
[   45.976989]  ? hrtimer_interrupt+0x2e9/0x730
[   45.977367]  ? smp_apic_timer_interrupt+0x14d/0x710
[   45.977947]  ? smp_call_function_single_interrupt+0x660/0x660
[   45.978485]  ? handle_edge_irq+0x322/0x840
[   45.978808]  ? task_prio+0x50/0x50
[   45.979078]  ? _raw_spin_unlock+0x1f/0x30
[   45.979487]  ? trace_hardirqs_off_thunk+0x1a/0x1c
[   45.979981]  ? apic_timer_interrupt+0xf/0x20
[   45.980424]  </IRQ>
[   45.980611]  ? crypto_shash_update+0x23d/0x2a0
[   45.980950]  ? kasan_disable_current+0x20/0x20
[   45.981380]  ? crypto_shash_update+0x24d/0x2a0
[   45.981765]  ? ext4_inode_csum.isra.59+0x562/0xef0
[   45.982281]  ? ext4_journalled_zero_new_buffers+0x4e0/0x4e0
[   45.982830]  ? trace_hardirqs_on_thunk+0x1a/0x1c
[   45.983316]  ? retint_kernel+0x10/0x10
[   45.983706]  ? retint_kernel+0x10/0x10
[   45.984134]  ? trace_hardirqs_on_thunk+0x1a/0x1c
[   45.984642]  ? retint_kernel+0x10/0x10
[   45.985038]  ? ext4_inode_csum_set+0x17c/0x370
[   45.985499]  ? ext4_mark_iloc_dirty+0x1709/0x2cc0
[   45.986034]  ? ext4_chunk_trans_blocks+0x20/0x20
[   45.986437]  ? jbd2_journal_add_journal_head+0x3b0/0x560
[   45.987001]  ? jbd2_write_access_granted.part.8+0x264/0x410
[   45.987726]  ? jbd2_journal_write_metadata_buffer+0xf80/0xf80
[   45.988386]  ? rcu_note_context_switch+0x710/0x710
[   45.988941]  ? jbd2_journal_put_journal_head+0x3b1/0x54f
[   45.989555]  ? jbd2_journal_get_write_access+0x6b/0xb0
[   45.990150]  ? __ext4_journal_get_write_access+0x143/0x200
[   45.990780]  ? ext4_mark_inode_dirty+0x220/0xac0
[   45.991317]  ? ext4_dirty_inode+0x8d/0xb0
[   45.991783]  ? ext4_expand_extra_isize+0x560/0x560
[   45.992336]  ? __lock_is_held+0xad/0x140
[   45.992794]  ? ext4_setattr+0x2a90/0x2a90
[   45.993266]  ? __ext4_journal_start_sb+0x175/0x5d0
[   45.993818]  ? ext4_dirty_inode+0x5b/0xb0
[   45.994288]  ? ext4_journal_abort_handle.isra.4+0x250/0x250
[   45.994930]  ? __lock_is_held+0xad/0x140
[   45.995391]  ? ext4_setattr+0x2a90/0x2a90
[   45.995860]  ? ext4_dirty_inode+0x8d/0xb0
[   45.996326]  ? __mark_inode_dirty+0x798/0x1570
[   45.996841]  ? redirty_tail+0x200/0x200
[   45.997294]  ? preempt_schedule_common+0x1d/0x50
[   45.997851]  ? _cond_resched+0x18/0x20
[   45.998289]  ? filemap_fault+0x5bf/0x1c30
[   45.998728]  ? mark_held_locks+0xc1/0x140
[   45.999165]  ? retint_kernel+0x10/0x10
[   45.999571]  ? trace_hardirqs_on_thunk+0x1a/0x1c
[   46.000071]  ? retint_kernel+0x10/0x10
[   46.000479]  ? current_kernel_time64+0x189/0x200
[   46.000977]  ? current_kernel_time64+0x1a4/0x200
[   46.001484]  ? generic_update_time+0x26a/0x430
[   46.001959]  ? put_itimerspec64+0x2f0/0x2f0
[   46.002414]  ? dentry_needs_remove_privs.part.24+0x60/0x60
[   46.003026]  ? lock_acquire+0x1b3/0x4a0
[   46.003463]  ? dentry_needs_remove_privs.part.24+0x60/0x60
[   46.004050]  ? file_update_time+0x383/0x620
[   46.004511]  ? current_time+0xc0/0xc0
[   46.004927]  ? rcu_read_lock_sched_held+0x102/0x120
[   46.005492]  ? rcu_sync_lockdep_assert+0x6f/0xb0
[   46.006020]  ? __sb_start_write+0x171/0x2f0
[   46.006505]  ? ext4_page_mkwrite+0x1db/0x1320
[   46.007011]  ? futex_wake+0x6d0/0x6d0
[   46.007444]  ? ext4_change_inode_journal_flag+0x3f0/0x3f0
[   46.008083]  ? ext4_filemap_fault+0x75/0xa4
[   46.008564]  ? __down_interruptible+0x700/0x700
[   46.009079]  ? do_page_mkwrite+0x137/0x470
[   46.009532]  ? __do_fault+0x3f0/0x3f0
[   46.009938]  ? wake_up_page_bit+0x610/0x610
[   46.010420]  ? __handle_mm_fault+0x448/0x3940
[   46.010910]  ? __handle_mm_fault+0x1e62/0x3940
[   46.011389]  ? vm_insert_mixed_mkwrite+0x30/0x30
[   46.011915]  ? save_trace+0x300/0x300
[   46.012341]  ? find_held_lock+0x33/0x1b0
[   46.012772]  ? print_usage_bug+0x140/0x140
[   46.013216]  ? exit_robust_list+0x290/0x290
[   46.013701]  ? print_usage_bug+0x140/0x140
[   46.014177]  ? print_usage_bug+0x140/0x140
[   46.014634]  ? lock_acquire+0x4a0/0x4a0
[   46.015048]  ? lock_acquire+0x4a0/0x4a0
[   46.015463]  ? print_usage_bug+0x140/0x140
[   46.015904]  ? do_raw_spin_trylock+0x190/0x190
[   46.016383]  ? save_trace+0x300/0x300
[   46.016784]  ? mark_held_locks+0xc1/0x140
[   46.017230]  ? find_held_lock+0x33/0x1b0
[   46.017678]  ? retint_kernel+0x10/0x10
[   46.018163]  ? mark_held_locks+0xc1/0x140
[   46.018618]  ? retint_kernel+0x10/0x10
[   46.019038]  ? save_trace+0x300/0x300
[   46.019464]  ? mark_held_locks+0xc1/0x140
[   46.019913]  ? retint_kernel+0x10/0x10
[   46.020311]  ? trace_hardirqs_on_thunk+0x1a/0x1c
[   46.020782]  ? retint_kernel+0x10/0x10
[   46.021192]  ? handle_mm_fault+0x15a/0x410
[   46.021711]  ? __do_page_fault+0x672/0xe30
[   46.022230]  ? mm_fault_error+0x360/0x360
[   46.022738]  ? SyS_clock_settime+0x230/0x230
[   46.023278]  ? async_page_fault+0x2f/0x50
[   46.023782]  ? do_page_fault+0xc1/0x720
[   46.024267]  ? __do_page_fault+0xe30/0xe30
[   46.024782]  ? exit_to_usermode_loop+0x1c6/0x230
[   46.025326]  ? syscall_return_slowpath+0x4e0/0x4e0
[   46.025880]  ? syscall_return_slowpath+0x342/0x4e0
[   46.026432]  ? retint_user+0x18/0x18
[   46.026854]  ? async_page_fault+0x2f/0x50
[   46.027320]  ? trace_hardirqs_off_thunk+0x1a/0x1c
[   46.027912]  ? async_page_fault+0x2f/0x50
[   46.028432]  ? async_page_fault+0x45/0x50
[   46.029012] Dumping ftrace buffer:
[   46.029472]    (ftrace buffer empty)
[   46.029930] Kernel Offset: 0x25a00000 from 0xffffffff81000000 (relocation range: 0xffffffff80000000-0xffffffffbfffffff)
[   46.031275] Rebooting in 86400 seconds..
```

**End**
