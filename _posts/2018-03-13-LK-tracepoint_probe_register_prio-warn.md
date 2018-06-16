---
layout: post
title: LK v4.16.x - tracepoint_probe_register_prio - warn
comments: true
---

tracepoint_probe_register_prio - warn

posted & found by [zer0day](https://kozistr.github.io/)

## tl;dr

Got from syzkaller & Found in *LK v4.16.0-rc5* with enabling ```CONFIG_FAULT_INJECTION```.

Just anther maybe meaningless posting :)

## Call Trace (Dump)

Here's a dmesg.

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

## Code

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

## PoC

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