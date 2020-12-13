---
title: Linux Kernel - 2018-03-3 Founds
date: 2018-03-16
update: 2018-03-22
tags:
  - Security
  - Linux-Kernel
keywords:
  - 0-day
  - Bug
---

## perf_trace_buf_alloc - warn

Found in *LK v4.16.0-rc5*.

### Call Trace (Dump)

```c
[  100.240063] perf buffer not large enough
[  100.240092] WARNING: CPU: 0 PID: 23132 at kernel/trace/trace_event_perf.c:288 perf_trace_buf_alloc+0x12a/0x170
[  100.241844] Kernel panic - not syncing: panic_on_warn set ...
```

### Code

In ```/include/linux/trace_events.h```.

```c
#define PERF_MAX_TRACE_SIZE	2048
...

void *perf_trace_buf_alloc(int size, struct pt_regs **regs, int *rctxp)
{
	char *raw_data;
	int rctx;

	BUILD_BUG_ON(PERF_MAX_TRACE_SIZE % sizeof(unsigned long));

	if (WARN_ONCE(size > PERF_MAX_TRACE_SIZE,
		      "perf buffer not large enough"))
		return NULL;

	*rctxp = rctx = perf_swevent_get_recursion_context();
	if (rctx < 0)
		return NULL;

	if (regs)
		*regs = this_cpu_ptr(&__perf_regs[rctx]);
	raw_data = this_cpu_ptr(perf_trace_buf[rctx]);

	/* zero the dead bytes from align to not leak stack to user */
	memset(&raw_data[size - sizeof(u64)], 0, sizeof(u64));
	return raw_data;
}
```

Just size is over ```2048```, so *WARN_ONCE* is just called...

And all of the codes which reference ```perf_tracE_buf_alloc``` are maybe safe because of handling null value. 

**End**



## socket - memory leak

Got from syzkaller & Found in *LK v4.16.0-rc5* with enabling ```CONFIG_FAULT_INJECTION```.

### Call Trace (Dump)

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



## xfrm_state_find - stack out of bounds

Found in *LK v4.16.0-rc6*.

stack-out-of-bounds in xfrm_state_find, 4 bytes read.

### Call Trace (Dump)

```c
[  467.981313]  dump_stack+0x10a/0x1dd
[  467.981824]  ? _atomic_dec_and_lock+0x163/0x163
[  467.982417]  ? show_regs_print_info+0x12/0x12
[  467.983088]  ? xfrm_state_find+0x3c6/0x30f0
[  467.983660]  print_address_description+0x60/0x224
[  467.984438]  ? xfrm_state_find+0x3c6/0x30f0
[  467.985208]  kasan_report+0x196/0x2a0
[  467.985839]  ? xfrm_state_find+0x2ea6/0x30f0
[  467.986510]  ? xfrm_state_find+0x2ea6/0x30f0
[  467.987035]  ? save_trace+0x300/0x300
[  467.987683]  ? xfrm_state_afinfo_get_rcu+0x170/0x170
[  467.988511]  ? find_held_lock+0x32/0x1b0
[  467.989193]  ? print_usage_bug+0x140/0x140
[  467.989939]  ? lock_acquire+0x4a0/0x4a0
[  467.990594]  ? print_usage_bug+0x140/0x140
[  467.991269]  ? rcutorture_record_progress+0x10/0x10
[  467.992089]  ? __lock_is_held+0xad/0x140
[  467.992805]  ? dequeue_task_fair+0x3730/0x3730
[  467.993593]  ? __lock_acquire+0x911/0x4670
[  467.994320]  ? __lock_acquire+0x911/0x4670
[  467.994977]  ? reweight_entity+0xfe0/0xfe0
[  467.995468]  ? put_prev_task_fair+0x70/0x70
[  467.996041]  ? debug_check_no_locks_freed+0x210/0x210
[  467.996743]  ? debug_check_no_locks_freed+0x210/0x210
[  467.997342]  ? dequeue_task_fair+0x1586/0x3730
[  467.997961]  ? print_usage_bug+0x140/0x140
[  467.998657]  ? xfrm_tmpl_resolve+0x2be/0xb30
[  467.999321]  ? __xfrm_decode_session+0xf0/0xf0
[  468.000063]  ? rcu_read_lock_sched_held+0xe4/0x120
[  468.000597]  ? fib_table_lookup+0xa64/0x1960
[  468.001290]  ? xfrm_resolve_and_create_bundle+0x134/0x27e0
[  468.002054]  ? print_usage_bug+0x140/0x140
[  468.002742]  ? save_trace+0x300/0x300
[  468.003395]  ? save_trace+0x300/0x300
[  468.003849]  ? __lock_acquire+0x911/0x4670
[  468.004300]  ? xfrm_tmpl_resolve+0xb30/0xb30
[  468.004790]  ? print_usage_bug+0x140/0x140
[  468.005249]  ? find_held_lock+0x32/0x1b0
[  468.005615]  ? xfrm_sk_policy_lookup+0x306/0x450
[  468.006131]  ? lock_acquire+0x4a0/0x4a0
[  468.006474]  ? lock_downgrade+0x6e0/0x6e0
[  468.008510]  ? refcount_inc_not_zero+0xf5/0x180
[  468.008982]  ? rcutorture_record_progress+0x10/0x10
[  468.009514]  ? xfrm_selector_match+0x36/0xdc0
[  468.010028]  ? xfrm_sk_policy_lookup+0x32f/0x450
[  468.010523]  ? xfrm_selector_match+0xdc0/0xdc0
[  468.011027]  ? xfrm_lookup+0x336/0x21a0
[  468.011376]  ? xfrm_lookup+0x336/0x21a0
[  468.011745]  ? set_load_weight+0x270/0x270
[  468.012272]  ? xfrm_policy_lookup_bytype.constprop.49+0x1700/0x1700
[  468.013118]  ? find_held_lock+0x32/0x1b0
[  468.013609]  ? ip_route_output_key_hash+0x229/0x350
[  468.014352]  ? lock_acquire+0x4a0/0x4a0
[  468.014825]  ? lock_downgrade+0x6e0/0x6e0
[  468.015359]  ? find_held_lock+0x32/0x1b0
[  468.015827]  ? rcutorture_record_progress+0x10/0x10
[  468.016418]  ? raw_sendmsg+0x89a/0x3b80
[  468.016883]  ? ip_route_output_key_hash+0x252/0x350
[  468.017519]  ? ip_route_output_key_hash_rcu+0x2c70/0x2c70
[  468.018206]  ? debug_check_no_locks_freed+0x210/0x210
[  468.018816]  ? xfrm_lookup_route+0x34/0x1a0
[  468.019364]  ? ip_route_output_flow+0x86/0xa0
[  468.019834]  ? raw_sendmsg+0xef5/0x3b80
[  468.020248]  ? raw_getsockopt+0xd0/0xd0
[  468.020691]  ? refill_pi_state_cache.part.7+0x2f0/0x2f0
[  468.021153]  ? _raw_spin_unlock_irqrestore+0x46/0x60
[  468.021590]  ? get_futex_value_locked+0xc0/0xf0
[  468.022099]  ? futex_wait_setup+0x1f9/0x380
[  468.022659]  ? save_trace+0x300/0x300
[  468.023075]  ? find_held_lock+0x32/0x1b0
[  468.023511]  ? futex_wake+0x630/0x630
[  468.023920]  ? futex_wake+0x528/0x630
[  468.024341]  ? __might_fault+0x104/0x1b0
[  468.024784]  ? lock_downgrade+0x6e0/0x6e0
[  468.025245]  ? rw_copy_check_uvector+0x227/0x2f0
[  468.025668]  ? import_iovec+0x20b/0x3d0
[  468.026105]  ? sock_has_perm+0x26e/0x360
[  468.026527]  ? selinux_secmark_relabel_packet+0xc0/0xc0
[  468.027099]  ? _copy_from_user+0x94/0x100
[  468.027534]  ? inet_sendmsg+0x12d/0x590
[  468.027947]  ? inet_sk_rebuild_header+0x1b30/0x1b30
[  468.028463]  ? SYSC_sendto+0x560/0x560
[  468.028881]  ? inet_sk_rebuild_header+0x1b30/0x1b30
[  468.029438]  ? sock_sendmsg+0xc0/0x100
[  468.029840]  ? ___sys_sendmsg+0x2e9/0x820
[  468.030237]  ? copy_msghdr_from_user+0x4f0/0x4f0
[  468.030726]  ? finish_task_switch+0x182/0x740
[  468.031282]  ? set_load_weight+0x270/0x270
[  468.031800]  ? lock_repin_lock+0x410/0x410
[  468.032354]  ? __fget_light+0x28c/0x3a0
[  468.032825]  ? __schedule+0x75c/0x1ea0
[  468.033315]  ? __sched_text_start+0x8/0x8
[  468.033813]  ? __sys_sendmmsg+0x1ce/0x590
[  468.034328]  ? SyS_sendmsg+0x40/0x40
[  468.034771]  ? fget_raw+0x20/0x20
[  468.035246]  ? selinux_netlbl_socket_setsockopt+0xf1/0x430
[  468.035925]  ? schedule+0xf0/0x3a0
[  468.036495]  ? __schedule+0x1ea0/0x1ea0
[  468.036994]  ? SyS_futex+0x261/0x31e
[  468.037455]  ? SyS_futex+0x26a/0x31e
[  468.037919]  ? exit_to_usermode_loop+0x139/0x1e0
[  468.038498]  ? do_futex+0x1f50/0x1f50
[  468.038925]  ? exit_to_usermode_loop+0x181/0x1e0
[  468.039437]  ? syscall_slow_exit_work+0x400/0x400
[  468.039964]  ? security_file_ioctl+0x76/0xb0
[  468.040460]  ? SyS_sendmmsg+0x2f/0x50
[  468.040881]  ? __sys_sendmmsg+0x590/0x590
[  468.041348]  ? do_syscall_64+0x23e/0x7a0
[  468.041861]  ? put_task_stack+0x13e/0x2c0
[  468.042306]  ? syscall_return_slowpath+0x470/0x470
[  468.042861]  ? syscall_return_slowpath+0x2df/0x470
[  468.043387]  ? prepare_exit_to_usermode+0x330/0x330
[  468.044024]  ? entry_SYSCALL_64_after_hwframe+0x52/0xb7
[  468.044647]  ? trace_hardirqs_off_thunk+0x1a/0x1c
[  468.045103]  ? entry_SYSCALL_64_after_hwframe+0x42/0xb7
[  468.045697] 
[  468.045894] The buggy address belongs to the page:
[  468.046592] page:ffffea0000b419c0 count:0 mapcount:0 mapping:0000000000000000 index:0x0
[  468.047381] flags: 0x100000000000000()
[  468.047787] raw: 0100000000000000 0000000000000000 0000000000000000 00000000ffffffff
[  468.048497] raw: 0000000000000000 ffffea0000b419e0 0000000000000000 0000000000000000
[  468.049192] page dumped because: kasan: bad access detected
[  468.049716] 
[  468.049848] Memory state around the buggy address:
[  468.050235]  ffff88002d067500: f2 f2 f2 04 f2 f2 f2 f2 f2 f2 f2 00 f2 f2 f2 f2
[  468.050903]  ffff88002d067580: f2 f2 f2 00 00 00 00 f2 f2 f2 f2 00 00 00 00 00
[  468.051517] >ffff88002d067600: 00 f2 f2 f2 f2 f2 f2 00 00 00 00 00 00 00 f2 f2
[  468.052214]                                                              ^
[  468.052943]  ffff88002d067680: f2 f2 f2 f8 f2 f2 f2 f2 f2 f2 f2 f8 f2 f2 f2 f2
[  468.053591]  ffff88002d067700: f2 f2 f2 00 f2 f2 f2 f2 f2 f2 f2 00 00 00 f2 f2
[  468.054259] ==================================================================
[  468.054863] Disabling lock debugging due to kernel taint
[  468.055380] Kernel panic - not syncing: panic_on_warn set ...
```

**End**


## __might_fault - dead lock

Got from syzkaller & Found in *LK v4.16.0-rc6*.

### Call Trace (Dump)

```c
WARNING: possible circular locking dependency detected
4.16.0-rc6+ #21 Not tainted
------------------------------------------------------
syz-executor3/13637 is trying to acquire lock:
 (&mm->mmap_sem){++++}, at: [<0000000083693474>] __might_fault+0xd4/0x1b0 mm/memory.c:4570

but task is already holding lock:
 (&rp->fetch_lock){+.+.}, at: [<000000001f43922c>] mon_bin_read+0x5e/0x5f0 drivers/usb/mon/mon_bin.c:813

which lock already depends on the new lock.


the existing dependency chain (in reverse order) is:

-> #1 (&rp->fetch_lock){+.+.}:

-> #0 (&mm->mmap_sem){++++}:

other info that might help us debug this:

 Possible unsafe locking scenario:

       CPU0                    CPU1
       ----                    ----
  lock(&rp->fetch_lock);
                               lock(&mm->mmap_sem);
                               lock(&rp->fetch_lock);
  lock(&mm->mmap_sem);

 *** DEADLOCK ***
 
1 lock held by syz-executor3/13637:
 #0:  (&rp->fetch_lock){+.+.}, at: [<000000001f43922c>] mon_bin_read+0x5e/0x5f0 drivers/usb/mon/mon_bin.c:813

stack backtrace:
CPU: 1 PID: 13637 Comm: syz-executor3 Not tainted 4.16.0-rc6+ #21
Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS 1.10.2-1ubuntu1 04/01/2014
Call Trace:
 __dump_stack lib/dump_stack.c:17 [inline]
 dump_stack+0x10a/0x1dd lib/dump_stack.c:53
 print_circular_bug.isra.33+0x3fe/0x437 kernel/locking/lockdep.c:1223
 check_prev_add kernel/locking/lockdep.c:1863 [inline]
 check_prevs_add kernel/locking/lockdep.c:1976 [inline]
 validate_chain kernel/locking/lockdep.c:2417 [inline]
 __lock_acquire.cold.54+0x57b/0x8e4 kernel/locking/lockdep.c:3431
```

**End**



## kernfs_get - warn

Found in *LK v4.16.0-rc6*.

### Call Trace (Dump)

```c
[   58.664584] Call Trace:
[   58.664825]  dump_stack+0x10a/0x1dd
[   58.665129]  ? _atomic_dec_and_lock+0x163/0x163
[   58.665539]  ? kernfs_get+0x40/0x130
[   58.665857]  panic+0x1b3/0x3a4
[   58.666129]  ? add_taint.cold.3+0x16/0x16
[   58.666486]  ? __warn.cold.6+0x17c/0x1a4
[   58.666867]  ? kernfs_get+0x10c/0x130
[   58.667180]  __warn.cold.6+0x197/0x1a4
[   58.667524]  ? kernfs_get+0x10c/0x130
[   58.667838]  ? report_bug+0x1fb/0x270
[   58.668154]  ? fixup_bug.part.9+0x32/0x80
[   58.668506]  ? do_error_trap+0x28c/0x360
[   58.668840]  ? lock_acquire+0x4a0/0x4a0
[   58.669178]  ? do_general_protection+0x310/0x310
[   58.669601]  ? do_raw_spin_trylock+0x190/0x190
[   58.670012]  ? __lock_is_held+0xad/0x140
[   58.670450]  ? trace_hardirqs_off_thunk+0x1a/0x1c
[   58.670858]  ? invalid_op+0x1b/0x40
[   58.671198]  ? kernfs_get+0x10c/0x130
[   58.671519]  ? kernfs_get+0x10c/0x130
[   58.671833]  ? kernfs_evict_inode+0x60/0x60
[   58.672203]  ? kernfs_path_from_node+0x60/0x60
[   58.672584]  ? __kernfs_remove+0x277/0xa60
[   58.672948]  ? kernfs_dir_fop_release+0x40/0x40
[   58.673346]  ? save_trace+0x300/0x300
[   58.673653]  ? __kmem_cache_create+0x14b/0x480
[   58.674075]  ? save_trace+0x300/0x300
[   58.674402]  ? __lock_is_held+0xad/0x140
[   58.674731]  ? kernfs_name_hash+0xad/0xe0
[   58.675113]  ? kernfs_remove_by_name_ns+0x4f/0xb0
[   58.675503]  ? sysfs_slab_add+0x172/0x230
[   58.675867]  ? __kmem_cache_create+0x234/0x480
[   58.676291]  ? kmem_cache_alloc+0x262/0x2a0
[   58.676697]  ? kmem_cache_create_usercopy+0x266/0x390
[   58.677199]  ? kmem_cache_create+0xd/0x10
[   58.677547]  ? hashtab_cache_init+0x20/0x30
[   58.677992]  ? security_load_policy+0x1c6/0xec0
[   58.678385]  ? security_get_bools+0x620/0x620
[   58.678786]  ? __alloc_pages_nodemask+0x91e/0xbe0
[   58.679196]  ? save_trace+0x300/0x300
[   58.679517]  ? save_trace+0x300/0x300
[   58.679897]  ? __vmalloc_node_range+0x1af/0x6d0
[   58.680324]  ? save_trace+0x300/0x300
[   58.680700]  ? find_held_lock+0x32/0x1b0
[   58.681089]  ? __might_fault+0x104/0x1b0
[   58.681508]  ? lock_acquire+0x4a0/0x4a0
[   58.681837]  ? lock_downgrade+0x6e0/0x6e0
[   58.682264]  ? __might_fault+0x177/0x1b0
[   58.682620]  ? sel_write_load+0x244/0x1620
[   58.683039]  ? perf_trace_lock_acquire+0xeb/0x930
[   58.683472]  ? sel_read_bool+0x240/0x240
[   58.683818]  ? __lock_is_held+0xad/0x140
[   58.684224]  ? rcu_note_context_switch+0x710/0x710
[   58.684648]  ? lock_acquire+0x4a0/0x4a0
[   58.685009]  ? save_trace+0x300/0x300
[   58.685379]  ? _cond_resched+0x10/0x20
[   58.685730]  ? __inode_security_revalidate+0xd5/0x130
[   58.686159]  ? avc_policy_seqno+0x5/0x10
[   58.686522]  ? selinux_file_permission+0x79/0x440
[   58.686927]  ? security_file_permission+0x82/0x1d0
[   58.687375]  ? do_iter_write+0x3c3/0x530
[   58.687722]  ? rcu_sync_lockdep_assert+0x69/0xa0
[   58.688164]  ? __sb_start_write+0x1ff/0x290
[   58.688609]  ? vfs_writev+0x1d3/0x330
[   58.688968]  ? rcutorture_record_progress+0x10/0x10
[   58.689403]  ? vfs_iter_write+0xa0/0xa0
[   58.689731]  ? __fd_install+0x290/0x6e0
[   58.690062]  ? __fget_light+0x28c/0x3a0
[   58.690450]  ? fget_raw+0x20/0x20
[   58.690746]  ? rcu_pm_notify+0xc0/0xc0
[   58.691081]  ? SyS_futex+0x261/0x31e
[   58.691432]  ? SyS_futex+0x26a/0x31e
[   58.691787]  ? do_pwritev+0x190/0x220
[   58.692146]  ? do_writev+0x2a0/0x2a0
[   58.692501]  ? security_file_ioctl+0x76/0xb0
[   58.692906]  ? do_syscall_64+0xb0/0x7a0
[   58.693311]  ? SyS_preadv2+0x70/0x70
[   58.693646]  ? do_syscall_64+0x23e/0x7a0
[   58.694019]  ? _raw_spin_unlock_irq+0x24/0x40
[   58.694405]  ? finish_task_switch+0x1c2/0x740
[   58.694805]  ? syscall_return_slowpath+0x470/0x470
[   58.695229]  ? syscall_return_slowpath+0x2df/0x470
[   58.695687]  ? prepare_exit_to_usermode+0x330/0x330
[   58.696143]  ? entry_SYSCALL_64_after_hwframe+0x52/0xb7
[   58.696603]  ? trace_hardirqs_off_thunk+0x1a/0x1c
[   58.697010]  ? entry_SYSCALL_64_after_hwframe+0x42/0xb7
[   58.697669] Dumping ftrace buffer:
[   58.698098]    (ftrace buffer empty)
[   58.698417] Kernel Offset: 0x23000000 from 0xffffffff81000000 (relocation range: 0xffffffff80000000-0xffffffffbfffffff)
[   58.699323] Rebooting in 86400 seconds..
```

### Code

In  ```fs/kernfs/dir.c Line 494```.

```c
/**
 * kernfs_get - get a reference count on a kernfs_node
 * @kn: the target kernfs_node
 */
void kernfs_get(struct kernfs_node *kn)
{
	if (kn) {
		WARN_ON(!atomic_read(&kn->count));
		atomic_inc(&kn->count);
	}
}
```


## mon_bin_vma_fault - dead lock

Got from syzkaller & Found in *LK v4.16.0-rc6*.

### Call Trace (Dump)

```c
[  105.403185] WARNING: possible circular locking dependency detected
[  105.403862] 4.16.0-rc6+ #21 Not tainted
[  105.404291] ------------------------------------------------------
[  105.404959] syz-executor4/18491 is trying to acquire lock:
[  105.405516]  (&rp->fetch_lock){+.+.}, at: [<000000004f37fa18>] mon_bin_vma_fault+0xc9/0x3b0
[  105.406243] 
[  105.406243] but task is already holding lock:
[  105.406727]  (&mm->mmap_sem){++++}, at: [<00000000106c8ac7>] __mm_populate+0x29e/0x410
[  105.407392] 
[  105.407392] which lock already depends on the new lock.
[  105.407392] 
[  105.408085] 
[  105.408085] the existing dependency chain (in reverse order) is:
[  105.408707] 
[  105.408707] -> #1 (&mm->mmap_sem){++++}:
[  105.409322] 
[  105.409322] -> #0 (&rp->fetch_lock){+.+.}:
[  105.409916] 
[  105.409916] other info that might help us debug this:
[  105.409916] 
[  105.410766]  Possible unsafe locking scenario:
[  105.410766] 
[  105.411313]        CPU0                    CPU1
[  105.411807]        ----                    ----
[  105.412296]   lock(&mm->mmap_sem);
[  105.412672]                                lock(&rp->fetch_lock);
[  105.413300]                                lock(&mm->mmap_sem);
[  105.413944]   lock(&rp->fetch_lock);
[  105.414286] 
[  105.414286]  *** DEADLOCK ***
[  105.414286] 
[  105.414844] 1 lock held by syz-executor4/18491:
[  105.415306]  #0:  (&mm->mmap_sem){++++}, at: [<00000000106c8ac7>] __mm_populate+0x29e/0x410
[  105.416133] 
[  105.416133] stack backtrace:
[  105.416577] CPU: 0 PID: 18491 Comm: syz-executor4 Not tainted 4.16.0-rc6+ #21
[  105.417270] Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS 1.10.2-1ubuntu1 04/01/2014
[  105.418181] Call Trace:
[  105.418455]  dump_stack+0x10a/0x1dd
[  105.418872]  ? _atomic_dec_and_lock+0x163/0x163
[  105.419324]  ? __mm_populate+0x29e/0x410
[  105.419714]  ? __mm_populate+0x29e/0x410
[  105.420105]  print_circular_bug.isra.33+0x3fe/0x437
[  105.420588]  ? print_circular_bug_header+0x11b/0x11b
[  105.421073]  ? find_usage_backwards+0x30/0x30
[  105.421504]  __lock_acquire.cold.54+0x57b/0x8e4
[  105.421945]  ? lock_acquire+0x4a0/0x4a0
[  105.422341]  ? debug_check_no_locks_freed+0x210/0x210
[  105.422836]  ? set_next_entity+0x10c9/0x2d80
[  105.423255]  ? __lock_is_held+0xad/0x140
[  105.423647]  ? reweight_entity+0xfe0/0xfe0
[  105.424059]  ? print_usage_bug+0x140/0x140
[  105.424495]  ? put_prev_task_fair+0x70/0x70
[  105.424909]  ? __lock_acquire+0x911/0x4670
[  105.425323]  ? task_tick_fair+0x1ff0/0x1ff0
[  105.425731]  ? dequeue_task_fair+0x1586/0x3730
[  105.426169]  ? debug_check_no_locks_freed+0x210/0x210
[  105.426671]  ? perf_trace_lock_acquire+0xeb/0x930
[  105.427128]  ? __lock_acquire+0x911/0x4670
[  105.427540]  ? put_prev_task_fair+0x70/0x70
[  105.427950]  ? perf_trace_lock+0x950/0x950
[  105.428364]  ? debug_check_no_locks_freed+0x210/0x210
[  105.428856]  ? save_trace+0x300/0x300
[  105.429232]  ? print_usage_bug+0x140/0x140
[  105.429640]  ? print_usage_bug+0x140/0x140
[  105.430041]  ? print_usage_bug+0x140/0x140
[  105.430470]  ? lock_acquire+0x1a5/0x4a0
[  105.430868]  ? mon_bin_vma_fault+0xc9/0x3b0
[  105.431298]  ? lock_downgrade+0x6e0/0x6e0
[  105.431705]  ? mon_bin_vma_fault+0xc9/0x3b0
[  105.432099]  ? rcu_note_context_switch+0x710/0x710
[  105.432560]  ? print_usage_bug+0x140/0x140
[  105.432962]  ? mon_bin_vma_fault+0xc9/0x3b0
[  105.433374]  ? __mutex_lock+0x178/0x19d0
[  105.433757]  ? mon_bin_vma_fault+0xc9/0x3b0
[  105.434181]  ? check_chain_key+0x3c0/0x3c0
[  105.434588]  ? mon_bin_vma_fault+0xc9/0x3b0
[  105.434998]  ? __lock_acquire+0x911/0x4670
[  105.435420]  ? mark_held_locks+0xa8/0xf0
[  105.435807]  ? mutex_lock_io_nested+0x1830/0x1830
[  105.436311]  ? print_usage_bug+0x140/0x140
[  105.436733]  ? print_usage_bug+0x140/0x140
[  105.437152]  ? debug_check_no_locks_freed+0x210/0x210
[  105.437636]  ? __page_frag_cache_drain+0x1b0/0x1b0
[  105.438105]  ? print_usage_bug+0x140/0x140
[  105.438515]  ? deref_stack_reg+0xab/0x110
[  105.438909]  ? __read_once_size_nocheck.constprop.8+0x10/0x10
[  105.439478]  ? print_usage_bug+0x140/0x140
[  105.439879]  ? print_usage_bug+0x140/0x140
[  105.440283]  ? print_usage_bug+0x140/0x140
[  105.440695]  ? unwind_next_frame+0x11c2/0x1d10
[  105.441137]  ? __save_stack_trace+0x59/0xf0
[  105.441553]  ? print_usage_bug+0x140/0x140
[  105.441970]  ? __lock_acquire+0x911/0x4670
[  105.442349]  ? debug_check_no_locks_freed+0x210/0x210
[  105.442867]  ? debug_check_no_locks_freed+0x210/0x210
[  105.443368]  ? _cond_resched+0x10/0x20
[  105.443753]  ? mon_bin_vma_fault+0xc9/0x3b0
[  105.444176]  ? mon_bin_vma_fault+0xc9/0x3b0
[  105.444594]  ? mon_alloc_buff+0x200/0x200
[  105.444997]  ? print_usage_bug+0x140/0x140
[  105.445434]  ? __lock_acquire+0x911/0x4670
[  105.445869]  ? debug_check_no_locks_freed+0x210/0x210
[  105.446330]  ? __do_fault+0xe2/0x380
[  105.446696]  ? print_bad_pte+0x5d0/0x5d0
[  105.447078]  ? debug_check_no_locks_freed+0x210/0x210
[  105.447555]  ? debug_check_no_locks_freed+0x210/0x210
[  105.448060]  ? unlink_anon_vmas+0x3e2/0x920
[  105.448485]  ? unlink_anon_vmas+0x1ef/0x920
[  105.448910]  ? __handle_mm_fault+0x1206/0x31b0
[  105.449347]  ? vm_insert_mixed_mkwrite+0x30/0x30
[  105.449804]  ? __lock_acquire+0x911/0x4670
[  105.450208]  ? perf_trace_lock+0x950/0x950
[  105.450622]  ? debug_check_no_locks_freed+0x210/0x210
[  105.451104]  ? perf_trace_lock_acquire+0xeb/0x930
[  105.451534]  ? perf_trace_lock_acquire+0xeb/0x930
[  105.452029]  ? pud_huge+0x5c/0xc0
[  105.452346]  ? pmd_huge+0xe0/0xe0
[  105.452710]  ? perf_trace_lock_acquire+0xeb/0x930
[  105.453303]  ? follow_page_mask+0x129/0x14c0
[  105.453825]  ? save_trace+0x300/0x300
[  105.454194]  ? perf_trace_lock+0x950/0x950
[  105.454546]  ? save_trace+0x300/0x300
[  105.454886]  ? gup_pgd_range+0x22f0/0x22f0
[  105.455241]  ? save_trace+0x300/0x300
[  105.455556]  ? save_trace+0x300/0x300
[  105.455891]  ? save_stack+0x89/0xb0
[  105.456174]  ? __lock_is_held+0xad/0x140
[  105.456489]  ? handle_mm_fault+0x12e/0x390
[  105.456852]  ? __get_user_pages+0x619/0x13e0
[  105.457202]  ? follow_page_mask+0x14c0/0x14c0
[  105.457557]  ? vma_set_page_prot+0x155/0x220
[  105.457943]  ? vma_wants_writenotify+0x430/0x430
[  105.458291]  ? __mm_populate+0x29e/0x410
[  105.458587]  ? lock_downgrade+0x6e0/0x6e0
[  105.459002]  ? rcu_note_context_switch+0x710/0x710
[  105.459481]  ? populate_vma_page_range+0x201/0x2f0
[  105.459953]  ? get_user_pages_unlocked+0x4a0/0x4a0
[  105.460427]  ? vmacache_find+0x58/0x270
[  105.460810]  ? vmacache_update+0xc9/0x120
[  105.461206]  ? __mm_populate+0x222/0x410
[  105.461589]  ? populate_vma_page_range+0x2f0/0x2f0
[  105.462022]  ? security_mmap_file+0x13b/0x170
[  105.462393]  ? vm_mmap_pgoff+0x226/0x260
[  105.462784]  ? vma_is_stack_for_current+0xb0/0xb0
[  105.463147]  ? SyS_futex+0x261/0x31e
[  105.463425]  ? SyS_futex+0x26a/0x31e
[  105.463753]  ? SyS_mmap_pgoff+0x445/0x5c0
[  105.464159]  ? find_mergeable_anon_vma+0xc0/0xc0
[  105.464608]  ? security_file_ioctl+0x76/0xb0
[  105.465034]  ? do_syscall_64+0xb0/0x7a0
[  105.465410]  ? align_vdso_addr+0x50/0x50
[  105.465808]  ? do_syscall_64+0x23e/0x7a0
[  105.466196]  ? exit_to_usermode_loop+0x181/0x1e0
[  105.466645]  ? _raw_spin_unlock_irq+0x24/0x40
[  105.467082]  ? syscall_return_slowpath+0x470/0x470
[  105.467555]  ? syscall_return_slowpath+0x2df/0x470
[  105.468055]  ? entry_SYSCALL_64_after_hwframe+0x52/0xb7
[  105.468561]  ? trace_hardirqs_off_thunk+0x1a/0x1c
[  105.469029]  ? entry_SYSCALL_64_after_hwframe+0x42/0xb7
```

**End**


