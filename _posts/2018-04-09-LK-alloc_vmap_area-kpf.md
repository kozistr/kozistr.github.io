---
layout: post
title: LK v4.16.x - alloc_vmap_area - kernel paging request
author: zer0day
categories: lk
---

alloc_vmap_area - unable to handle kernel paging request

posted & found by [zer0day](https://kozistr.github.io/)

## tl;dr

Found on LK v4.16.0. Seems weird...

## Call Trace (Dump)

Here's a dmesg.

```c
[  420.823887] BUG: unable to handle kernel paging request at ffffffffffffffd0
[  420.824743] PGD 29e24067 P4D 29e24067 PUD 29e26067 PMD 0 
[  420.825278] Oops: 0000 [#1] SMP KASAN PTI
[  420.825627] Dumping ftrace buffer:
[  420.825932]    (ftrace buffer empty)
[  420.826243] Modules linked in:
[  420.826507] CPU: 1 PID: 2313 Comm: poc Tainted: G    B            4.16.0+ #28
[  420.827179] Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS 1.10.2-1ubuntu1 04/01/2014
[  420.827905] RIP: 0010:alloc_vmap_area+0x2eb/0x820
[  420.828341] RSP: 0018:ffff880024c37750 EFLAGS: 00010213
[  420.828812] RAX: 1ffffffffffffffa RBX: ffffffffffffffd0 RCX: ffffffffb96ce6f4
[  420.829424] RDX: 0000000000000000 RSI: 0000000000000004 RDI: ffff880079c323b8
[  420.830008] RBP: 0000000000002000 R08: fffffbfff792f555 R09: fffffbfff792f554
[  420.830667] R10: ffffffffbc97aaa3 R11: 1ffffffff792f554 R12: 0000000000000000
[  420.831289] R13: dffffc0000000000 R14: 0000000000000000 R15: 0000000000000000
[  420.831928] FS:  0000000000cb8940(0000) GS:ffff88007fc00000(0000) knlGS:0000000000000000
[  420.832693] CS:  0010 DS: 0000 ES: 0000 CR0: 0000000080050033
[  420.833228] CR2: ffffffffffffffd0 CR3: 0000000019976000 CR4: 00000000000006e0
[  420.833827] DR0: 0000000020000100 DR1: 0000000020000100 DR2: 0000000000000000
[  420.834455] DR3: 0000000000000000 DR6: 00000000fffe0ff0 DR7: 0000000000000600
[  420.835040] Call Trace:
[  420.835286]  ? purge_vmap_area_lazy+0x40/0x40
[  420.835654]  ? __get_vm_area_node+0xab/0x340
[  420.836048]  ? kmem_cache_alloc_node_trace+0x169/0x300
[  420.836514]  ? __get_vm_area_node+0xe5/0x340
[  420.836883]  ? __vmalloc_node_range+0xaf/0x6d0
[  420.837290]  ? alloc_counters.isra.10+0xad/0x6b0
[  420.837682]  ? __might_fault+0x104/0x1b0
[  420.838047]  ? alloc_counters.isra.10+0xad/0x6b0
[  420.838452]  ? vzalloc+0x63/0x80
[  420.838745]  ? alloc_counters.isra.10+0xad/0x6b0
[  420.839131]  ? alloc_counters.isra.10+0xad/0x6b0
[  420.839547]  ? __lockdep_init_map+0xdf/0x4d0
[  420.839896]  ? ipt_error+0x20/0x20
[  420.840203]  ? xt_find_table_lock+0x108/0x3e0
[  420.840582]  ? do_ipt_get_ctl+0x6c1/0x9e0
[  420.840911]  ? module_unload_free+0x510/0x510
[  420.841309]  ? get_info+0x610/0x610
[  420.841596]  ? lock_acquire+0x1a5/0x4a0
[  420.841928]  ? lock_acquire+0x4a0/0x4a0
[  420.842279]  ? lock_downgrade+0x6e0/0x6e0
[  420.842630]  ? __do_page_fault+0x302/0xb70
[  420.842988]  ? nf_getsockopt+0x62/0xc0
[  420.843332]  ? ip_getsockopt+0x14e/0x1f0
[  420.843680]  ? do_ip_getsockopt+0x1fd0/0x1fd0
[  420.844046]  ? sock_alloc_file+0x28e/0x4c0
[  420.844448]  ? tcp_getsockopt+0x7b/0xc0
[  420.844848]  ? __sys_getsockopt+0x153/0x310
[  420.845282]  ? up_read+0x17/0x110
[  420.845674]  ? kernel_setsockopt+0x1b0/0x1b0
[  420.846125]  ? __sys_socket+0x156/0x1f0
[  420.846458]  ? security_file_ioctl+0x76/0xb0
[  420.846818]  ? syscall_slow_exit_work+0x400/0x400
[  420.847222]  ? SyS_getsockopt+0x32/0x40
[  420.847544]  ? __sys_getsockopt+0x310/0x310
[  420.847893]  ? do_syscall_64+0x23e/0x7a0
[  420.848223]  ? trace_hardirqs_on_thunk+0x1a/0x1c
[  420.848610]  ? syscall_return_slowpath+0x470/0x470
[  420.849075]  ? __do_page_fault+0x39a/0xb70
[  420.849428]  ? syscall_return_slowpath+0x2df/0x470
[  420.849852]  ? prepare_exit_to_usermode+0x330/0x330
[  420.850274]  ? prepare_exit_to_usermode+0x22b/0x330
[  420.850699]  ? perf_trace_sys_enter+0xc30/0xc30
[  420.851101]  ? trace_hardirqs_off_thunk+0x1a/0x1c
[  420.851513]  ? entry_SYSCALL_64_after_hwframe+0x42/0xb7
[  420.852062] Code: 60 aa 97 bc 0f 84 55 02 00 00 49 8d 5c 24 d0 e8 dc 19 d4 ff 48 89 d8 48 c1 e8 03 42 80 3c 28 00 0f 85 75 04 00 00 48 3b 6c 24 10 <4d> 8b 64 24 d0 0f 87 29 02 00 00 4c 39 e5 0f 86 20 02 00 00 e8 
[  420.854196] RIP: alloc_vmap_area+0x2eb/0x820 RSP: ffff880024c37750
[  420.854875] CR2: ffffffffffffffd0
[  420.855247] ---[ end trace efc5824732863059 ]---
[  420.855755] Kernel panic - not syncing: Fatal exception
[  420.856303] Dumping ftrace buffer:
[  420.856645]    (ftrace buffer empty)
[  420.856980] Kernel Offset: 0x38000000 from 0xffffffff81000000 (relocation range: 0xffffffff80000000-0xffffffffbfffffff)
[  420.857911] Rebooting in 86400 seconds..
```

## Code

```c
   0:   60                      (bad)  
   1:   aa                      stos   BYTE PTR es:[rdi],al
   2:   97                      xchg   edi,eax
   3:   bc 0f 84 55 02          mov    esp,0x255840f
   8:   00 00                   add    BYTE PTR [rax],al
   a:   49 8d 5c 24 d0          lea    rbx,[r12-0x30]
   f:   e8 dc 19 d4 ff          call   0xffffffffffd419f0
  14:   48 89 d8                mov    rax,rbx
  17:   48 c1 e8 03             shr    rax,0x3
  1b:   42 80 3c 28 00          cmp    BYTE PTR [rax+r13*1],0x0
  20:   0f 85 75 04 00 00       jne    0x49b
  26:   48 3b 6c 24 10          cmp    rbp,QWORD PTR [rsp+0x10]
  2b:  *4d 8b 64 24 d0          mov    r12,QWORD PTR [r12-0x30]
  30:   0f 87 29 02 00 00       ja     0x25f
  36:   4c 39 e5                cmp    rbp,r12
  39:   0f 86 20 02 00 00       jbe    0x25f
  3f:   e8                      .byte 0xe8
```

## PoC

Skip~

**End**
