---
layout: post
title: LK v4.16.x - default_idle - soft lockup
author: zer0day
categories: lk
---

default_idle - soft lockup

posted & found by [zer0day](https://kozistr.github.io/)

## tl;dr

Got from syzkaller & Found in LK v4.16.0-rc3.

It just halted during booting.

## Call Trace (Dump)

Here's a dump.

```c
watchdog: BUG: soft lockup - CPU#0 stuck for 153s! [swapper/0:0]
Modules linked in:
irq event stamp: 5914346
hardirqs last  enabled at (5914343): [<0000000098680cd3>] default_idle+0x18/0x2c0 arch/x86/kernel/process.c:354
hardirqs last disabled at (5914344): [<00000000d4f96a97>] interrupt_entry+0xc0/0xe0 arch/x86/entry/entry_64.S:619
softirqs last  enabled at (5914346): [<000000000af1e516>] irq_enter+0xb6/0xd0 kernel/softirq.c:347
softirqs last disabled at (5914345): [<00000000b393087c>] irq_enter+0x9b/0xd0 kernel/softirq.c:351
CPU: 0 PID: 0 Comm: swapper/0 Not tainted 4.16.0-rc3+ #4
Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS 1.10.2-1ubuntu1 04/01/2014
RIP: 0010:native_safe_halt+0x2/0x10 arch/x86/include/asm/irqflags.h:54
RSP: 0018:ffffffffa3607d88 EFLAGS: 00000246 ORIG_RAX: ffffffffffffff12
RAX: 0000000000000007 RBX: dffffc0000000000 RCX: 0000000000000000
RDX: 0000000000000000 RSI: 0000000000000001 RDI: ffffffffa362bdec
RBP: 0000000000000000 R08: ffffffffa362b580 R09: 0000000000000000
R10: 0000000000000000 R11: 0000000000000000 R12: ffffffffa3cb8ba0
R13: 0000000000000000 R14: 0000000000000000 R15: ffffffffa3cb8c40
FS:  0000000000000000(0000) GS:ffff88002e000000(0000) knlGS:0000000000000000
CS:  0010 DS: 0000 ES: 0000 CR0: 0000000080050033
CR2: 0000000000619570 CR3: 000000002a01e000 CR4: 00000000000006f0
DR0: 0000000020000100 DR1: 0000000020000100 DR2: 0000000020000100
DR3: 0000000020000100 DR6: 00000000fffe0ff0 DR7: 0000000000000600
Call Trace:
 arch_safe_halt arch/x86/include/asm/paravirt.h:94 [inline]
 default_idle+0x1d/0x2c0 arch/x86/kernel/process.c:354
 cpuidle_idle_call kernel/sched/idle.c:156 [inline]
 do_idle+0x233/0x2c0 kernel/sched/idle.c:246
 cpu_startup_entry+0xc6/0xd0 kernel/sched/idle.c:351
 start_kernel+0x840/0x880 init/main.c:717
 secondary_startup_64+0xa5/0xb0 arch/x86/kernel/head_64.S:239
Code: 04 24 e8 12 ee ed fd 48 8b 04 24 e9 d6 fe ff ff 48 89 df e8 01 ee ed fd eb 8a 90 90 90 90 90 90 90 90 90 90 90 90 90 90 90 fb f4 <c3> 0f 1f 00 66 2e 0f 1f 84 00 00 00 00 00 f4 c3 90 90 90 90 90 
```

## Source Code

Here's ```default_idle()``` ```/arch/x86/kernel/process.c``` in *v4.16.0-rc3*.

```c
void __cpuidle default_idle(void)
{
	trace_cpu_idle_rcuidle(1, smp_processor_id());
	safe_halt();
	trace_cpu_idle_rcuidle(PWR_EVENT_EXIT, smp_processor_id());
}
```

And this is disassemble of compiled ```vmlinux``` with my ```.config```.

```c
gdb-peda$ pdisas default_idle
Dump of assembler code for function default_idle:
   0xffffffff821acb10 <+0>:	    push   r12
   0xffffffff821acb12 <+2>:	    push   rbp
   0xffffffff821acb13 <+3>:	    push   rbx
   0xffffffff821acb14 <+4>:	    mov    ebp,DWORD PTR gs:[rip+0x7de62615]        # 0xf130 <cpu_number>
   0xffffffff821acb1b <+11>:	nop    DWORD PTR [rax+rax*1+0x0]
   0xffffffff821acb20 <+16>:	call   0xffffffff810f2370 <trace_hardirqs_on>
   0xffffffff821acb25 <+21>:	call   QWORD PTR ds:0xffffffff82c406c0
   0xffffffff821acb2c <+28>:	mov    ebp,DWORD PTR gs:[rip+0x7de625fd]        # 0xf130 <cpu_number>
   0xffffffff821acb33 <+35>:	nop    DWORD PTR [rax+rax*1+0x0]
   0xffffffff821acb38 <+40>:	pop    rbx
   0xffffffff821acb39 <+41>:	pop    rbp
   0xffffffff821acb3a <+42>:	pop    r12
   0xffffffff821acb3c <+44>:	ret    
   0xffffffff821acb3d <+45>:	mov    eax,DWORD PTR gs:[rip+0x7de625ec]        # 0xf130 <cpu_number>
   0xffffffff821acb44 <+52>:	mov    eax,eax
   0xffffffff821acb46 <+54>:	bt     QWORD PTR [rip+0xbf8b52],rax        # 0xffffffff82da56a0 <__cpu_online_mask>
   0xffffffff821acb4e <+62>:	jae    0xffffffff821acb38 <default_idle+40>
   0xffffffff821acb50 <+64>:	call   0xffffffff8112fef0 <rcu_irq_enter_irqson>
   0xffffffff821acb55 <+69>:	inc    DWORD PTR gs:[rip+0x7de682b4]        # 0x14e10 <__preempt_count>
   0xffffffff821acb5c <+76>:	mov    rbx,QWORD PTR [rip+0xbad0a5]        # 0xffffffff82d59c08 <__tracepoint_cpu_idle+40>
   0xffffffff821acb63 <+83>:	call   0xffffffff81124110 <debug_lockdep_rcu_enabled>
   0xffffffff821acb68 <+88>:	test   eax,eax
   0xffffffff821acb6a <+90>:	je     0xffffffff821acb79 <default_idle+105>
   0xffffffff821acb6c <+92>:	cmp    BYTE PTR [rip+0xba8f9b],0x0        # 0xffffffff82d55b0e <__warned.41319>
   0xffffffff821acb73 <+99>:	je     0xffffffff821acc22 <default_idle+274>
   0xffffffff821acb79 <+105>:	test   rbx,rbx
   0xffffffff821acb7c <+108>:	je     0xffffffff821acba1 <default_idle+145>
   0xffffffff821acb7e <+110>:	mov    rax,QWORD PTR [rbx]
   0xffffffff821acb81 <+113>:	mov    r12d,0xffffffff
   0xffffffff821acb87 <+119>:	mov    rdi,QWORD PTR [rbx+0x8]
   0xffffffff821acb8b <+123>:	add    rbx,0x18
   0xffffffff821acb8f <+127>:	mov    edx,ebp
   0xffffffff821acb91 <+129>:	mov    esi,r12d
   0xffffffff821acb94 <+132>:	call   0xffffffff82403000 <__x86_indirect_thunk_rax>
   0xffffffff821acb99 <+137>:	mov    rax,QWORD PTR [rbx]
   0xffffffff821acb9c <+140>:	test   rax,rax
   0xffffffff821acb9f <+143>:	jne    0xffffffff821acb87 <default_idle+119>
   0xffffffff821acba1 <+145>:	dec    DWORD PTR gs:[rip+0x7de68268]        # 0x14e10 <__preempt_count>
   0xffffffff821acba8 <+152>:	pop    rbx
   0xffffffff821acba9 <+153>:	pop    rbp
   0xffffffff821acbaa <+154>:	pop    r12
   0xffffffff821acbac <+156>:	jmp    0xffffffff8112fa80 <rcu_irq_exit_irqson>
   0xffffffff821acbb1 <+161>:	mov    eax,DWORD PTR gs:[rip+0x7de62578]        # 0xf130 <cpu_number>
   0xffffffff821acbb8 <+168>:	mov    eax,eax
   0xffffffff821acbba <+170>:	bt     QWORD PTR [rip+0xbf8ade],rax        # 0xffffffff82da56a0 <__cpu_online_mask>
   0xffffffff821acbc2 <+178>:	jae    0xffffffff821acb20 <default_idle+16>
   0xffffffff821acbc8 <+184>:	call   0xffffffff8112fef0 <rcu_irq_enter_irqson>
   0xffffffff821acbcd <+189>:	inc    DWORD PTR gs:[rip+0x7de6823c]        # 0x14e10 <__preempt_count>
   0xffffffff821acbd4 <+196>:	mov    rbx,QWORD PTR [rip+0xbad02d]        # 0xffffffff82d59c08 <__tracepoint_cpu_idle+40>
   0xffffffff821acbdb <+203>:	call   0xffffffff81124110 <debug_lockdep_rcu_enabled>
   0xffffffff821acbe0 <+208>:	test   eax,eax
   0xffffffff821acbe2 <+210>:	je     0xffffffff821acbed <default_idle+221>
   0xffffffff821acbe4 <+212>:	cmp    BYTE PTR [rip+0xba8f23],0x0        # 0xffffffff82d55b0e <__warned.41319>
   0xffffffff821acbeb <+219>:	je     0xffffffff821acc53 <default_idle+323>
   0xffffffff821acbed <+221>:	test   rbx,rbx
   0xffffffff821acbf0 <+224>:	je     0xffffffff821acc11 <default_idle+257>
   0xffffffff821acbf2 <+226>:	mov    rax,QWORD PTR [rbx]
   0xffffffff821acbf5 <+229>:	mov    rdi,QWORD PTR [rbx+0x8]
   0xffffffff821acbf9 <+233>:	add    rbx,0x18
   0xffffffff821acbfd <+237>:	mov    edx,ebp
   0xffffffff821acbff <+239>:	mov    esi,0x1
   0xffffffff821acc04 <+244>:	call   0xffffffff82403000 <__x86_indirect_thunk_rax>
   0xffffffff821acc09 <+249>:	mov    rax,QWORD PTR [rbx]
   0xffffffff821acc0c <+252>:	test   rax,rax
   0xffffffff821acc0f <+255>:	jne    0xffffffff821acbf5 <default_idle+229>
   0xffffffff821acc11 <+257>:	dec    DWORD PTR gs:[rip+0x7de681f8]        # 0x14e10 <__preempt_count>
   0xffffffff821acc18 <+264>:	call   0xffffffff8112fa80 <rcu_irq_exit_irqson>
   0xffffffff821acc1d <+269>:	jmp    0xffffffff821acb20 <default_idle+16>
   0xffffffff821acc22 <+274>:	call   0xffffffff811241a0 <rcu_read_lock_sched_held>
   0xffffffff821acc27 <+279>:	test   eax,eax
   0xffffffff821acc29 <+281>:	jne    0xffffffff821acb79 <default_idle+105>
   0xffffffff821acc2f <+287>:	mov    rdx,0xffffffff82920580
   0xffffffff821acc36 <+294>:	mov    esi,0x28
   0xffffffff821acc3b <+299>:	mov    rdi,0xffffffff82925778
   0xffffffff821acc42 <+306>:	mov    BYTE PTR [rip+0xba8ec5],0x1        # 0xffffffff82d55b0e <__warned.41319>
   0xffffffff821acc49 <+313>:	call   0xffffffff810f59ee <lockdep_rcu_suspicious>
   0xffffffff821acc4e <+318>:	jmp    0xffffffff821acb79 <default_idle+105>
   0xffffffff821acc53 <+323>:	call   0xffffffff811241a0 <rcu_read_lock_sched_held>
   0xffffffff821acc58 <+328>:	test   eax,eax
   0xffffffff821acc5a <+330>:	jne    0xffffffff821acbed <default_idle+221>
   0xffffffff821acc5c <+332>:	mov    rdx,0xffffffff82920580
   0xffffffff821acc63 <+339>:	mov    esi,0x28
   0xffffffff821acc68 <+344>:	mov    rdi,0xffffffff82925778
   0xffffffff821acc6f <+351>:	mov    BYTE PTR [rip+0xba8e98],0x1        # 0xffffffff82d55b0e <__warned.41319>
   0xffffffff821acc76 <+358>:	call   0xffffffff810f59ee <lockdep_rcu_suspicious>
   0xffffffff821acc7b <+363>:	jmp    0xffffffff821acbed <default_idle+221>
End of assembler dump.
```

Code :

```c
   0:   04 24                   add    al,0x24
   2:   e8 12 ee ed fd          call   0xfffffffffdedee19
   7:   48 8b 04 24             mov    rax,QWORD PTR [rsp]
   b:   e9 d6 fe ff ff          jmp    0xfffffffffffffee6
  10:   48 89 df                mov    rdi,rbx
  13:   e8 01 ee ed fd          call   0xfffffffffdedee19
  18:   eb 8a                   jmp    0xffffffffffffffa4
  1a:   90                      nop
  1b:   90                      nop
  1c:   90                      nop
  1d:   90                      nop
  1e:   90                      nop
  1f:   90                      nop
  20:   90                      nop
  21:   90                      nop
  22:   90                      nop
  23:   90                      nop
  24:   90                      nop
  25:   90                      nop
  26:   90                      nop
  27:   90                      nop
  28:   90                      nop
  29:   fb                      sti    
  2a:   f4                      hlt    
  2b:  *c3                      ret    
  2c:   0f 1f 00                nop    DWORD PTR [rax]
  2f:   66 2e 0f 1f 84 00 00    nop    WORD PTR cs:[rax+rax*1+0x0]
  36:   00 00 00 
  39:   f4                      hlt    
  3a:   c3                      ret    
  3b:   90                      nop
  3c:   90                      nop
  3d:   90                      nop
  3e:   90                      nop
  3f:   90                      nop
```

Maybe, in ```safe_halt()```, stuck for seconds because of ...

**End**
