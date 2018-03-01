---
layout: post
title: LK v4.16.x - handle_irq - oobs
---

handle_irq - alloca Out Of Bounds

posted & found by [zer0day](https://kozistr.github.io/)

## tl;dr

Found in LK v4.16.0-rc3. Only Call Trace (Dump)

## Call Trace (Dump)

Here's a dump.

```c
[  126.872106] The buggy address belongs to the page:
[  126.873381] page:ffffea0001e5b780 count:0 mapcount:0 mapping:0000000000000000 index:0xffff8800796def38
[  126.876201] flags: 0x500000000000000()
[  126.877930] raw: 0500000000000000 0000000000000000 ffff8800796def38 00000000ffffffff
[  126.882336] raw: 0000000000000000 dead000000000200 0000000000000000 0000000000000000
[  126.886285] page dumped because: kasan: bad access detected
[  126.897880] 
[  126.898480] Memory state around the buggy address:
[  126.904144]  ffff8800796ded80: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
[  126.908652]  ffff8800796dee00: 00 00 00 00 00 00 00 00 ca ca ca ca 02 cb cb cb
[  126.912659] >ffff8800796dee80: cb cb cb cb 00 00 00 00 00 00 00 00 00 00 00 00
[  126.918615]                          ^
[  126.921417]  ffff8800796def00: 00 00 00 00 00 00 00 00 f1 f1 f1 f1 02 f2 f2 f2
[  126.926521]  ffff8800796def80: f2 f2 f2 f2 00 00 00 f2 f2 f2 f2 f2 f8 f8 f8 f2
[  126.932091] ==================================================================
[  126.935986] Disabling lock debugging due to kernel taint
[  126.940258] Kernel panic - not syncing: panic_on_warn set ...
[  126.940258] 
[  126.944513] CPU: 1 PID: 2784 Comm: rs:main Q:Reg Tainted: G    B            4.16.0-rc3+ #5
[  126.950821] Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS 1.10.2-1ubuntu1 04/01/2014
[  126.957851] Call Trace:
[  126.959039]  <IRQ>
[  126.960786]  dump_stack+0x127/0x213
[  126.964331]  ? _atomic_dec_and_lock+0x18d/0x18d
[  126.967394]  panic+0x1f8/0x46f
[  126.969642]  ? add_taint.cold.5+0x16/0x16
[  126.973986]  ? add_taint+0x21/0x50
[  126.975567]  ? tick_sched_handle+0x165/0x180
[  126.978305]  kasan_end_report+0x43/0x49
[  126.982418]  kasan_report.cold.6+0xc8/0x2f4
[  126.985450]  ? tick_sched_handle+0x165/0x180
[  126.989153]  ? tick_sched_timer+0x3d/0x120
[  126.992055]  ? __hrtimer_run_queues+0x379/0x1000
[  126.995753]  ? tick_sched_do_timer+0xf0/0xf0
[  126.999109]  ? hrtimer_interrupt+0x10b/0x730
[  127.002638]  ? hrtimer_init+0x430/0x430
[  127.005806]  ? lock_downgrade+0x6d0/0x6d0
[  127.008449]  ? rcu_read_lock_sched_held+0x102/0x120
[  127.011359]  ? pvclock_read_flags+0x150/0x150
[  127.015415]  ? __lock_is_held+0xad/0x140
[  127.016680]  ? kvm_clock_read+0x21/0x30
[  127.018449]  ? ktime_get_update_offsets_now+0x324/0x400
[  127.022343]  ? do_timer+0x40/0x40
[  127.026100]  ? save_trace+0x300/0x300
[  127.028572]  ? hpet_assign_irq+0x1e0/0x1e0
[  127.032293]  ? hrtimer_interrupt+0x2e9/0x730
[  127.035420]  ? smp_apic_timer_interrupt+0x14d/0x710
[  127.039543]  ? smp_call_function_single_interrupt+0x660/0x660
[  127.043597]  ? smp_thermal_interrupt+0x800/0x800
[  127.046941]  ? handle_edge_irq+0x322/0x840
[  127.050824]  ? task_prio+0x50/0x50
[  127.053018]  ? _raw_spin_unlock+0x1f/0x30
[  127.056818]  ? trace_hardirqs_off_thunk+0x1a/0x1c
[  127.060187]  ? apic_timer_interrupt+0xf/0x20
[  127.063997]  </IRQ>
[  127.065183]  ? crypto_shash_update+0x23d/0x2a0
[  127.069177]  ? crypto_shash_update+0x241/0x2a0
[  127.072297]  ? ext4_inode_csum.isra.59+0x562/0xef0
[  127.075965]  ? ext4_journalled_zero_new_buffers+0x4e0/0x4e0
[  127.080145]  ? _rcu_barrier+0x1850/0x1d60
[  127.083742]  ? lock_acquire+0x1b3/0x4a0
[  127.086563]  ? start_this_handle+0x552/0x12e0
[  127.090225]  ? _cond_resched+0x10/0x20
[  127.092391]  ? __getblk_gfp+0xf2/0xa30
[  127.094485]  ? save_trace+0x300/0x300
[  127.099214]  ? map_id_up+0x178/0x3a0
[  127.102827]  ? make_kprojid+0x30/0x30
[  127.106915]  ? lock_downgrade+0x6d0/0x6d0
[  127.108734]  ? find_held_lock+0x33/0x1b0
[  127.111452]  ? from_kprojid+0x89/0xc0
[  127.114818]  ? ext4_inode_csum_set+0x17c/0x370
[  127.118100]  ? ext4_mark_iloc_dirty+0x1709/0x2cc0
[  127.121573]  ? ext4_chunk_trans_blocks+0x20/0x20
[  127.124125]  ? jbd2_write_access_granted.part.8+0x264/0x410
[  127.126494]  ? jbd2_journal_file_inode+0x5d0/0x5d0
[  127.132231]  ? rcu_note_context_switch+0x710/0x710
[  127.136558]  ? jbd2_journal_get_write_access+0x98/0xb0
[  127.139832]  ? __ext4_journal_get_write_access+0x143/0x200
[  127.144455]  ? ext4_mark_inode_dirty+0x220/0xac0
[  127.148711]  ? ext4_dirty_inode+0x8d/0xb0
[  127.151901]  ? ext4_expand_extra_isize+0x560/0x560
[  127.156913]  ? __lock_is_held+0xad/0x140
[  127.159695]  ? ext4_setattr+0x2a90/0x2a90
[  127.161965]  ? __ext4_journal_start_sb+0x175/0x5d0
[  127.163882]  ? ext4_dirty_inode+0x5b/0xb0
[  127.169058]  ? ext4_journal_abort_handle.isra.4+0x250/0x250
[  127.173184]  ? unlock_page+0x1bd/0x290
[  127.176281]  ? __lock_is_held+0xad/0x140
[  127.180161]  ? ext4_setattr+0x2a90/0x2a90
[  127.183370]  ? ext4_dirty_inode+0x8d/0xb0
[  127.186906]  ? __mark_inode_dirty+0x798/0x1570
[  127.190850]  ? redirty_tail+0x200/0x200
[  127.193810]  ? block_write_end+0x200/0x200
[  127.208307]  ? find_held_lock+0x33/0x1b0
[  127.210718]  ? lock_acquire+0x1b3/0x4a0
[  127.215065]  ? lock_acquire+0x4a0/0x4a0
[  127.217898]  ? lock_downgrade+0x6d0/0x6d0
[  127.227462]  ? mark_held_locks+0xc1/0x140
[  127.231800]  ? current_kernel_time64+0x184/0x200
[  127.236205]  ? current_kernel_time64+0x1a4/0x200
[  127.240083]  ? generic_update_time+0x26a/0x430
[  127.243910]  ? put_itimerspec64+0x2f0/0x2f0
[  127.248039]  ? dentry_needs_remove_privs.part.24+0x60/0x60
[  127.253047]  ? lock_acquire+0x1b3/0x4a0
[  127.256859]  ? dentry_needs_remove_privs.part.24+0x60/0x60
[  127.260657]  ? file_update_time+0x383/0x620
[  127.264225]  ? current_time+0xc0/0xc0
[  127.267307]  ? __fdget_pos+0x18e/0x1c0
[  127.270370]  ? __mutex_lock+0x178/0x19e0
[  127.273739]  ? __fdget_pos+0x18e/0x1c0
[  127.288437]  ? generic_write_checks+0x356/0x580
[  127.291373]  ? __generic_file_write_iter+0x1c6/0x5b0
[  127.295584]  ? mutex_trylock+0x270/0x270
[  127.305472]  ? ext4_file_write_iter+0x65c/0x11e0
[  127.306479]  ? ext4_file_mmap+0x220/0x220
[  127.311974]  ? __fget+0x3f2/0x640
[  127.314991]  ? save_trace+0x300/0x300
[  127.318693]  ? expand_files.part.8+0x920/0x920
[  127.322014]  ? SyS_write+0x1d5/0x240
[  127.324816]  ? lock_acquire+0x4a0/0x4a0
[  127.327219]  ? save_trace+0x300/0x300
[  127.330088]  ? __lock_is_held+0xad/0x140
[  127.332263]  ? __vfs_write+0x587/0x820
[  127.346360]  ? kernel_read+0x110/0x110
[  127.351252]  ? rcu_read_lock_sched_held+0x102/0x120
[  127.358875]  ? rcu_sync_lockdep_assert+0x6f/0xb0
[  127.362736]  ? __sb_start_write+0x171/0x2f0
[  127.372330]  ? vfs_write+0x1f6/0x550
[  127.375797]  ? SyS_write+0xed/0x240
[  127.378685]  ? SyS_read+0x240/0x240
[  127.385794]  ? do_syscall_64+0xb0/0x850
[  127.386586]  ? SyS_read+0x240/0x240
[  127.387301]  ? do_syscall_64+0x25b/0x850
[  127.388811]  ? exit_to_usermode_loop+0x1c6/0x230
[  127.399549]  ? syscall_return_slowpath+0x4e0/0x4e0
[  127.403225]  ? syscall_return_slowpath+0x342/0x4e0
[  127.413345]  ? entry_SYSCALL_64_after_hwframe+0x52/0xb7
[  127.422051]  ? trace_hardirqs_off_thunk+0x1a/0x1c
[  127.451491]  ? entry_SYSCALL_64_after_hwframe+0x42/0xb7
[  127.463578] Dumping ftrace buffer:
[  127.468149]    (ftrace buffer empty)
[  127.478373] Kernel Offset: 0x31400000 from 0xffffffff81000000 (relocation range: 0xffffffff80000000-0xffffffffbfffffff)
[  127.486443] Rebooting in 86400 seconds..
```

## PoC

Skipping a reproducible code :).

**End**