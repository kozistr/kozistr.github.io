---
title: Linux Kernel - 2018-03-2 Founds
date: 2018-03-11
update: 2018-03-13
tags:
  - Security
  - Linux-Kernel
keywords:
  - 0-day
  - Bug
---

## sctp_id2assoc - use after free Read

Found in LK v4.16.0-rc4. Maybe it could be useful :)

### Call Trace (Dump)

```c
[   50.782403] Call Trace:
[   50.782662]  dump_stack+0x10a/0x1dd
[   50.783020]  ? _atomic_dec_and_lock+0x163/0x163
[   50.783469]  ? show_regs_print_info+0x12/0x12
[   50.783925]  print_address_description+0x60/0x224
[   50.784395]  kasan_report+0x196/0x2a0
[   50.784758]  ? sctp_id2assoc+0x350/0x370
[   50.785139]  ? sctp_id2assoc+0x350/0x370
[   50.785497]  ? sctp_wfree+0x660/0x660
[   50.785818]  ? __might_fault+0x177/0x1b0
[   50.786163]  ? sctp_getsockopt+0x402e/0x721a
[   50.786555]  ? _raw_spin_unlock_irq+0x24/0x40
[   50.786931]  ? finish_task_switch+0x1c2/0x740
[   50.787304]  ? finish_task_switch+0x182/0x740
[   50.787683]  ? sctp_getsockopt_peeloff_common+0x350/0x350
[   50.788143]  ? lock_repin_lock+0x410/0x410
[   50.788503]  ? __schedule+0x752/0x1ce0
[   50.788835]  ? select_task_rq_fair+0x1196/0x35d0
[   50.789231]  ? print_usage_bug+0x140/0x140
[   50.789616]  ? save_trace+0x300/0x300
[   50.789946]  ? active_load_balance_cpu_stop+0xfb0/0xfb0
[   50.790429]  ? put_prev_task_fair+0x70/0x70
[   50.790812]  ? find_held_lock+0x32/0x1b0
[   50.791165]  ? schedule+0xf0/0x3a0
[   50.791484]  ? __schedule+0x1ce0/0x1ce0
[   50.791842]  ? __lock_acquire+0x911/0x4670
[   50.792223]  ? rcu_note_context_switch+0x710/0x710
[   50.792656]  ? futex_wait_setup+0x128/0x380
[   50.793053]  ? debug_check_no_locks_freed+0x210/0x210
[   50.793526]  ? get_futex_value_locked+0xc0/0xf0
[   50.793947]  ? futex_wait_setup+0x1f9/0x380
[   50.794343]  ? find_held_lock+0x32/0x1b0
[   50.794686]  ? futex_wake+0x630/0x630
[   50.795016]  ? futex_wake+0x528/0x630
[   50.795343]  ? drop_futex_key_refs.isra.13+0x51/0xa0
[   50.795778]  ? futex_wait+0x637/0x930
[   50.796132]  ? futex_wait_setup+0x380/0x380
[   50.796521]  ? mark_wake_futex+0xba/0x1d0
[   50.796877]  ? wake_up_q+0x97/0xe0
[   50.797177]  ? drop_futex_key_refs.isra.13+0x51/0xa0
[   50.797621]  ? futex_wake+0x2ac/0x630
[   50.797952]  ? save_trace+0x300/0x300
[   50.798270]  ? lock_acquire+0x4a0/0x4a0
[   50.798624]  ? finish_task_switch+0x182/0x740
[   50.799014]  ? do_futex+0x7da/0x1f50
[   50.799341]  ? find_held_lock+0x32/0x1b0
[   50.799683]  ? lock_acquire+0x4a0/0x4a0
[   50.800017]  ? lock_downgrade+0x6e0/0x6e0
[   50.800365]  ? set_load_weight+0x270/0x270
[   50.800730]  ? rcutorture_record_progress+0x10/0x10
[   50.801179]  ? __fget+0x386/0x5b0
[   50.801496]  ? iterate_fd+0x3d0/0x3d0
[   50.801837]  ? find_held_lock+0x32/0x1b0
[   50.802181]  ? release_sock+0x1d0/0x280
[   50.802537]  ? lock_acquire+0x4a0/0x4a0
[   50.802897]  ? __fget_light+0x28c/0x3a0
[   50.803230]  ? rcutorture_record_progress+0x10/0x10
[   50.803648]  ? sock_has_perm+0x26e/0x360
[   50.804023]  ? selinux_secmark_relabel_packet+0xc0/0xc0
[   50.804535]  ? schedule+0xf0/0x3a0
[   50.804953]  ? __release_sock+0x350/0x350
[   50.805394]  ? mark_held_locks+0xa8/0xf0
[   50.805837]  ? SyS_getsockopt+0x153/0x310
[   50.806279]  ? SyS_getsockopt+0x153/0x310
[   50.806732]  ? SyS_setsockopt+0x340/0x340
[   50.807173]  ? exit_to_usermode_loop+0x181/0x1e0
[   50.807670]  ? syscall_slow_exit_work+0x400/0x400
[   50.808058]  ? do_syscall_64+0xb0/0x7a0
[   50.808359]  ? SyS_setsockopt+0x340/0x340
[   50.808692]  ? do_syscall_64+0x23e/0x7a0
[   50.809007]  ? _raw_spin_unlock_irq+0x24/0x40
[   50.809350]  ? finish_task_switch+0x1c2/0x740
[   50.809726]  ? syscall_return_slowpath+0x470/0x470
[   50.810106]  ? syscall_return_slowpath+0x2df/0x470
[   50.810480]  ? prepare_exit_to_usermode+0x330/0x330
[   50.810876]  ? entry_SYSCALL_64_after_hwframe+0x52/0xb7
[   50.811284]  ? trace_hardirqs_off_thunk+0x1a/0x1c
[   50.811666]  ? entry_SYSCALL_64_after_hwframe+0x42/0xb7
[   50.812079] 
[   50.812206] Allocated by task 11561:
[   50.812505]  kasan_kmalloc+0xbf/0xe0
[   50.812798]  kmem_cache_alloc_trace+0x142/0x2f0
[   50.813150]  sctp_association_new+0x10e/0x2060
[   50.813525]  __sctp_connect+0x5a3/0xc20
[   50.813827]  __sctp_setsockopt_connectx+0x61/0xc0
[   50.814355]  sctp_getsockopt+0x163d/0x721a
[   50.814760] 
[   50.814920] Freed by task 11551:
[   50.815252]  __kasan_slab_free+0x12c/0x170
[   50.815655]  kfree+0xf3/0x2e0
[   50.815953]  sctp_association_put+0x20b/0x300
[   50.816385]  sctp_association_free+0x631/0x880
[   50.816831]  sctp_do_sm+0x2b04/0x65d0
[   50.817198] 
[   50.817359] The buggy address belongs to the object at ffff88007d62b300
[   50.817359]  which belongs to the cache kmalloc-4096 of size 4096
[   50.818653] The buggy address is located 32 bytes inside of
[   50.818653]  4096-byte region [ffff88007d62b300, ffff88007d62c300)
[   50.819783] The buggy address belongs to the page:
[   50.820258] page:ffffea0001f58a00 count:1 mapcount:0 mapping:0000000000000000 index:0x0 compound_mapcount: 0
[   50.821216] flags: 0x500000000008100(slab|head)
[   50.821660] raw: 0500000000008100 0000000000000000 0000000000000000 0000000180070007
[   50.822410] raw: 0000000000000000 0000000100000001 ffff88002dc02c00 0000000000000000
[   50.823160] page dumped because: kasan: bad access detected
[   50.823701] 
[   50.823860] Memory state around the buggy address:
[   50.824350]  ffff88007d62b200: fc fc fc fc fc fc fc fc fc fc fc fc fc fc fc fc
[   50.825062]  ffff88007d62b280: fc fc fc fc fc fc fc fc fc fc fc fc fc fc fc fc
[   50.825733] >ffff88007d62b300: fb fb fb fb fb fb fb fb fb fb fb fb fb fb fb fb
[   50.826388]                                ^
[   50.826776]  ffff88007d62b380: fb fb fb fb fb fb fb fb fb fb fb fb fb fb fb fb
[   50.827424]  ffff88007d62b400: fb fb fb fb fb fb fb fb fb fb fb fb fb fb fb fb
[   50.828079] ==================================================================
[   50.828719] Disabling lock debugging due to kernel taint
[   50.829292] Kernel panic - not syncing: panic_on_warn set ...
[   50.829292] 
[   50.830148] CPU: 1 PID: 11561 Comm: rs:main Q:Reg Tainted: G    B            4.16.0-rc4+ #9
```

**End**

## init_tty - kernel panic

Got from syzkaller & Found in *LK v4.16.0-rc5* with enabling ```CONFIG_FAULT_INJECTION```.

### Call Trace (Dump)

```c
[ 2785.690162] Kernel panic - not syncing: n_tty: init_tty
[ 2785.690762] CPU: 0 PID: 29293 Comm: syz-executor4 Not tainted 4.16.0-rc5+ #12
[ 2785.691616] Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS 1.10.2-1ubuntu1 04/01/2014
[ 2785.692623] Call Trace:
[ 2785.692919]  dump_stack+0xb9/0x11b
[ 2785.693317]  panic+0x10a/0x2d6
[ 2785.693684]  tty_ldisc_init.cold.6+0x11/0x1a
[ 2785.694182]  ? alloc_tty_struct+0x61/0x2c0
[ 2785.694702]  ? tty_init_dev+0x4c/0x210
[ 2785.695153]  ? ptmx_open+0xd2/0x1c0
[ 2785.695566]  ? pty_resize+0xf0/0xf0
[ 2785.695981]  ? chrdev_open+0xe2/0x270
[ 2785.696414]  ? cdev_put.part.0+0x20/0x20
[ 2785.696870]  ? do_dentry_open+0x27a/0x420
[ 2785.697357]  ? vfs_open+0x70/0xb0
[ 2785.697747]  ? path_openat+0x2a0/0x1060
[ 2785.698198]  ? do_filp_open+0xac/0x130
[ 2785.698659]  ? __alloc_fd+0x200/0x230
[ 2785.699089]  ? _raw_spin_unlock+0x1f/0x30
[ 2785.699562]  ? do_sys_open+0x2b1/0x350
[ 2785.700002]  ? do_syscall_64+0x73/0x1f0
[ 2785.700451]  ? entry_SYSCALL_64_after_hwframe+0x42/0xb7
[ 2785.701306] Dumping ftrace buffer:
[ 2785.701807]    (ftrace buffer empty)
[ 2785.702234] Kernel Offset: 0x30e00000 from 0xffffffff81000000 (relocation range: 0xffffffff80000000-0xffffffffbfffffff)
[ 2785.703442] Rebooting in 86400 seconds..
```

### PoC

Reproducible code generated by syz-repro.

```c
#define _GNU_SOURCE 
#include <endian.h>
#include <sys/syscall.h>
#include <unistd.h>
#include <errno.h>
#include <fcntl.h>
#include <stdarg.h>
#include <stdbool.h>
#include <stdio.h>
#include <sys/stat.h>

__attribute__((noreturn)) static void doexit(int status)
{
	volatile unsigned i;
	syscall(__NR_exit_group, status);
	for (i = 0;; i++) {
	}
}
#include <stdint.h>
#include <string.h>

const int kFailStatus = 67;
const int kRetryStatus = 69;

static void exitf(const char* msg, ...)
{
	int e = errno;
	va_list args;
	va_start(args, msg);
	vfprintf(stderr, msg, args);
	va_end(args);
	fprintf(stderr, " (errno %d)\n", e);
	doexit(kRetryStatus);
}

static bool write_file(const char* file, const char* what, ...)
{
	char buf[1024];
	va_list args;
	va_start(args, what);
	vsnprintf(buf, sizeof(buf), what, args);
	va_end(args);
	buf[sizeof(buf) - 1] = 0;
	int len = strlen(buf);

	int fd = open(file, O_WRONLY | O_CLOEXEC);
	if (fd == -1)
		return false;
	if (write(fd, buf, len) != len) {
		close(fd);
		return false;
	}
	close(fd);
	return true;
}

static int inject_fault(int nth)
{
	int fd;
	char buf[16];

	fd = open("/proc/thread-self/fail-nth", O_RDWR);
	if (fd == -1)
		exitf("failed to open /proc/thread-self/fail-nth");
	sprintf(buf, "%d", nth + 1);
	if (write(fd, buf, strlen(buf)) != (ssize_t)strlen(buf))
		exitf("failed to write /proc/thread-self/fail-nth");
	return fd;
}

void loop()
{
    *(uint64_t*)0x20000200 = 0;
	syscall(__NR_set_mempolicy, 1, 0x20000200, 4);
    memcpy((void*)0x20000040, "/dev/ptmx", 10);
	write_file("/sys/kernel/debug/failslab/ignore-gfp-wait", "N");
	write_file("/sys/kernel/debug/fail_futex/ignore-private", "N");
	inject_fault(5);
	syscall(__NR_openat, 0xffffffffffffff9c, 0x20000040, 0, 0);
}

int main()
{
	syscall(__NR_mmap, 0x20000000, 0x1000000, 3, 0x32, -1, 0);
	loop();
	return 0;
}
```

**End**


## tracepoint_probe_register_prio - warn

Got from syzkaller & Found in *LK v4.16.0-rc5* with enabling ```CONFIG_FAULT_INJECTION```.

### Call Trace (Dump)

```c
WARNING: CPU: 1 PID: 19167 at kernel/tracepoint.c:210 tracepoint_add_func kernel/tracepoint.c:210 [inline]
WARNING: CPU: 1 PID: 19167 at kernel/tracepoint.c:210 tracepoint_probe_register_prio+0x11b/0x3a0 kernel/tracepoint.c:282
Kernel panic - not syncing: panic_on_warn set ...

CPU: 1 PID: 19167 Comm: syz-executor6 Not tainted 4.16.0-rc5+ #12
Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS 1.10.2-1ubuntu1 04/01/2014
Call Trace:
 __dump_stack lib/dump_stack.c:17 [inline]
 dump_stack+0xb9/0x11b lib/dump_stack.c:53
 panic+0x10a/0x2d6 kernel/panic.c:183
 __warn.cold.6+0x108/0x10f kernel/panic.c:547
Dumping ftrace buffer:
   (ftrace buffer empty)
Kernel Offset: 0xf200000 from 0xffffffff81000000 (relocation range: 0xffffffff80000000-0xffffffffbfffffff)
Rebooting in 86400 seconds..
```

### Code

In *kernel/tracepoint.c* at ```282 line```,

```c
int tracepoint_probe_register_prio(struct tracepoint *tp, void *probe,
				   void *data, int prio)
{
	struct tracepoint_func tp_func;
	int ret;

	mutex_lock(&tracepoints_mutex);
	tp_func.func = probe;
	tp_func.data = data;
	tp_func.prio = prio;
	ret = tracepoint_add_func(tp, &tp_func, prio); // line 282
	mutex_unlock(&tracepoints_mutex);
	return ret;
}
```

```c
static int tracepoint_add_func(struct tracepoint *tp,
			       struct tracepoint_func *func, int prio)
{
	struct tracepoint_func *old, *tp_funcs;
	int ret;

	if (tp->regfunc && !static_key_enabled(&tp->key)) {
		ret = tp->regfunc();
		if (ret < 0)
			return ret;
	}

	tp_funcs = rcu_dereference_protected(tp->funcs,
			lockdep_is_held(&tracepoints_mutex));
	old = func_add(&tp_funcs, func, prio);
	if (IS_ERR(old)) {
		WARN_ON_ONCE(1);
		return PTR_ERR(old);
	}

	/*
	 * rcu_assign_pointer has as smp_store_release() which makes sure
	 * that the new probe callbacks array is consistent before setting
	 * a pointer to it.  This array is referenced by __DO_TRACE from
	 * include/linux/tracepoint.h using rcu_dereference_sched().
	 */
	rcu_assign_pointer(tp->funcs, tp_funcs);
	if (!static_key_enabled(&tp->key))
		static_key_slow_inc(&tp->key);
	release_probes(old);
	return 0;
}
```

From the *tracepoint_add_func*, there's a line that like this...

```c
    ...
	tp_funcs = rcu_dereference_protected(tp->funcs,
			lockdep_is_held(&tracepoints_mutex));
	old = func_add(&tp_funcs, func, prio);
	if (IS_ERR(old)) {
		WARN_ON_ONCE(1); // <- here
		return PTR_ERR(old);
	}
	...
```

So the warning just happened... nothing more than else :)

### PoC

```c
#define _GNU_SOURCE 
#include <endian.h>
#include <sys/syscall.h>
#include <unistd.h>
#include <errno.h>
#include <fcntl.h>
#include <stdarg.h>
#include <stdbool.h>
#include <stdio.h>
#include <sys/stat.h>

__attribute__((noreturn)) static void doexit(int status)
{
	volatile unsigned i;
	syscall(__NR_exit_group, status);
	for (i = 0;; i++);
}

#include <stdint.h>
#include <string.h>

const int kFailStatus = 67;
const int kRetryStatus = 69;

static void exitf(const char* msg, ...)
{
	int e = errno;
	va_list args;
	va_start(args, msg);
	vfprintf(stderr, msg, args);
	va_end(args);
	fprintf(stderr, " (errno %d)\n", e);
	doexit(kRetryStatus);
}

#define BITMASK_LEN(type,bf_len) (type)((1ull << (bf_len)) - 1)

#define BITMASK_LEN_OFF(type,bf_off,bf_len) (type)(BITMASK_LEN(type, (bf_len)) << (bf_off))

#define STORE_BY_BITMASK(type,addr,val,bf_off,bf_len) if ((bf_off) == 0 && (bf_len) == 0) { *(type*)(addr) = (type)(val); } else { type new_val = *(type*)(addr); new_val &= ~BITMASK_LEN_OFF(type, (bf_off), (bf_len)); new_val |= ((type)(val)&BITMASK_LEN(type, (bf_len))) << (bf_off); *(type*)(addr) = new_val; }

static bool write_file(const char* file, const char* what, ...)
{
	char buf[1024];
	va_list args;
	va_start(args, what);
	vsnprintf(buf, sizeof(buf), what, args);
	va_end(args);
	buf[sizeof(buf) - 1] = 0;
	int len = strlen(buf);

	int fd = open(file, O_WRONLY | O_CLOEXEC);
	if (fd == -1)
		return false;
	if (write(fd, buf, len) != len) {
		close(fd);
		return false;
	}
	close(fd);
	return true;
}

static int inject_fault(int nth)
{
	int fd;
	char buf[16];

	fd = open("/proc/thread-self/fail-nth", O_RDWR);
	if (fd == -1)
		exitf("failed to open /proc/thread-self/fail-nth");
	sprintf(buf, "%d", nth + 1);
	if (write(fd, buf, strlen(buf)) != (ssize_t)strlen(buf))
		exitf("failed to write /proc/thread-self/fail-nth");
	return fd;
}

void loop()
{
    *(uint64_t*)0x200000c0 = 0;
	syscall(__NR_set_mempolicy, 1, 0x200000c0, 0x1f);

    *(uint32_t*)0x20000180 = 2;
    *(uint32_t*)0x20000184 = 0x78;
    *(uint8_t*)0x20000188 = 0x2d;
    *(uint8_t*)0x20000189 = 0;
    *(uint8_t*)0x2000018a = 0;
    *(uint8_t*)0x2000018b = 0;
    *(uint32_t*)0x2000018c = 0;
    *(uint64_t*)0x20000190 = 0;
    *(uint64_t*)0x20000198 = 0x3e4;
    *(uint64_t*)0x200001a0 = 0;
    
    STORE_BY_BITMASK(uint64_t, 0x200001a8, 0, 0, 1);
    STORE_BY_BITMASK(uint64_t, 0x200001a8, 0, 1, 1);
    STORE_BY_BITMASK(uint64_t, 0x200001a8, 0, 2, 1);
    STORE_BY_BITMASK(uint64_t, 0x200001a8, 0, 3, 1);
    STORE_BY_BITMASK(uint64_t, 0x200001a8, 0, 4, 1);
    STORE_BY_BITMASK(uint64_t, 0x200001a8, 9, 5, 1);
    STORE_BY_BITMASK(uint64_t, 0x200001a8, 0, 6, 1);
    STORE_BY_BITMASK(uint64_t, 0x200001a8, 0, 7, 1);
    STORE_BY_BITMASK(uint64_t, 0x200001a8, 0, 8, 1);
    STORE_BY_BITMASK(uint64_t, 0x200001a8, 0, 9, 1);
    STORE_BY_BITMASK(uint64_t, 0x200001a8, 0, 10, 1);
    STORE_BY_BITMASK(uint64_t, 0x200001a8, 0, 11, 1);
    STORE_BY_BITMASK(uint64_t, 0x200001a8, 0, 12, 1);
    STORE_BY_BITMASK(uint64_t, 0x200001a8, 0, 13, 1);
    STORE_BY_BITMASK(uint64_t, 0x200001a8, 0, 14, 1);
    STORE_BY_BITMASK(uint64_t, 0x200001a8, 0, 15, 2);
    STORE_BY_BITMASK(uint64_t, 0x200001a8, 0, 17, 1);
    STORE_BY_BITMASK(uint64_t, 0x200001a8, 0, 18, 1);
    STORE_BY_BITMASK(uint64_t, 0x200001a8, 0, 19, 1);
    STORE_BY_BITMASK(uint64_t, 0x200001a8, 0, 20, 1);
    STORE_BY_BITMASK(uint64_t, 0x200001a8, 0, 21, 1);
    STORE_BY_BITMASK(uint64_t, 0x200001a8, 0, 22, 1);
    STORE_BY_BITMASK(uint64_t, 0x200001a8, 0, 23, 1);
    STORE_BY_BITMASK(uint64_t, 0x200001a8, 0, 24, 1);
    STORE_BY_BITMASK(uint64_t, 0x200001a8, 0, 25, 1);
    STORE_BY_BITMASK(uint64_t, 0x200001a8, 0, 26, 1);
    STORE_BY_BITMASK(uint64_t, 0x200001a8, 0, 27, 1);
    STORE_BY_BITMASK(uint64_t, 0x200001a8, 0, 28, 1);
    STORE_BY_BITMASK(uint64_t, 0x200001a8, 0, 29, 35);

    *(uint32_t*)0x200001b0 = 0;
    *(uint32_t*)0x200001b4 = 0;
    *(uint64_t*)0x200001b8 = 0x20000100;
    *(uint64_t*)0x200001c0 = 0;
    *(uint64_t*)0x200001c8 = 0;
    *(uint64_t*)0x200001d0 = 0;
    *(uint64_t*)0x200001d8 = 0;
    *(uint32_t*)0x200001e0 = 0;
    *(uint64_t*)0x200001e8 = 0;
    *(uint32_t*)0x200001f0 = 0;
    *(uint16_t*)0x200001f4 = 0;
    *(uint16_t*)0x200001f6 = 0;
    
    write_file("/sys/kernel/debug/failslab/ignore-gfp-wait", "N");
	write_file("/sys/kernel/debug/fail_futex/ignore-private", "N");
	inject_fault(1);
	syscall(__NR_perf_event_open, 0x20000180, 0, 0, -1, 0);
}

int main()
{
	syscall(__NR_mmap, 0x20000000, 0x1000000, 3, 0x32, -1, 0);
	loop();
	return 0;
}

```

**End**




## tty_set_ldisc - warn

Got from syzkaller & Found in *LK v4.16.0-rc5* with enabling ```CONFIG_FAULT_INJECTION```.

### Call Trace (Dump)

```c
WARNING: CPU: 0 PID: 2567 at drivers/tty/tty_ldisc.c:531 tty_ldisc_restore drivers/tty/tty_ldisc.c:531 [inline]
WARNING: CPU: 0 PID: 2567 at drivers/tty/tty_ldisc.c:531 tty_set_ldisc+0x1d6/0x2c0 drivers/tty/tty_ldisc.c:599
Kernel panic - not syncing: panic_on_warn set ...

CPU: 0 PID: 2567 Comm: syz-executor0 Not tainted 4.16.0-rc5+ #12
Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS 1.10.2-1ubuntu1 04/01/2014
Call Trace:
 __dump_stack lib/dump_stack.c:17 [inline]
 dump_stack+0xb9/0x11b lib/dump_stack.c:53
 panic+0x10a/0x2d6 kernel/panic.c:183
 __warn.cold.6+0x108/0x10f kernel/panic.c:547
Dumping ftrace buffer:
   (ftrace buffer empty)
Kernel Offset: 0x26e00000 from 0xffffffff81000000 (relocation range: 0xffffffff80000000-0xffffffffbfffffff)
Rebooting in 86400 seconds..
```

### PoC

There's no reproducible code from syz-repro, but repro-log.

```c
# {Threaded:true Collide:false Repeat:false Procs:1 Sandbox:setuid Fault:true FaultCall:5 FaultNth:1 EnableTun:true UseTmpDir:true HandleSegv:true WaitRepeat:false Debug:false Repro:false}
r0 = openat$ptmx(0xffffffffffffff9c, &(0x7f0000000180)='/dev/ptmx\x00', 0x0, 0x0)
ioctl$TCXONC(r0, 0x40045431, 0x6f7000)
poll(&(0x7f0000000080)=[{r0}], 0x1, 0x80000000)
ioctl$TIOCPKT(r0, 0x5420, &(0x7f0000000040)=0x7)
r1 = syz_open_pts(r0, 0x0)
ioctl$TIOCSETD(r1, 0x5423, &(0x7f0000000000)=0x2)
```

**End**
