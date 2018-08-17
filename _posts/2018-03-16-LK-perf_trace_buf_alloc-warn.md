---
layout: post
title: LK v4.16.x - perf_trace_buf_alloc - warn
author: zer0day
categories: lk
---

perf_trace_buf_alloc - warn

posted & found by [zer0day](https://kozistr.github.io/)

## tl;dr

Found in *LK v4.16.0-rc5*.

## Call Trace (Dump)

```c
[  100.240063] perf buffer not large enough
[  100.240092] WARNING: CPU: 0 PID: 23132 at kernel/trace/trace_event_perf.c:288 perf_trace_buf_alloc+0x12a/0x170
[  100.241844] Kernel panic - not syncing: panic_on_warn set ...
```

## Code

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
