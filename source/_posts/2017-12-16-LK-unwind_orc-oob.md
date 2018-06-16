---
layout: post
title: LK v4.15.x - unwind_orc - stack out-of-bounds
comments: true
---

unwind_orc - read 8 bytes stack oob in unwind_next_frame

posted & found by [zer0day](https://kozistr.github.io/)

## tl;dr
I just found the bug(?) stack oob (8 bytes read) in unwind_orc. So i just tested it on the latest LK (v4.15.0-rc4 currently),
and it worked. But i found the commit about this bug(?).
He(Commiter) said...
> "The ORC unwinder got confused by some kprobes changes, which isn't
surprising since the runtime code no longer matches vmlinux and the
stack was modified for kretprobes. <br />
Until we have a way for generated code to register changes with the
unwinder, these types of warnings are inevitable.  So just disable KASAN
checks for stack accesses in the ORC unwinder."

Also you can see it [here](https://github.com/torvalds/linux/commit/881125bfe65bb772f34f4fcb04a35dfe117e186a)
It was found & patched at LK v4.14.0-rc8 on 2017/11/8.

In short, it is intended! not a BUG. In addition, if it is a bug, it just a kinda memory disclosure useless :|.

## Before & After
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

## Call Trace (Dump)
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

## POC

Skip!

**End**