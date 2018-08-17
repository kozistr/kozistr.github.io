---
layout: post
title: LK v4.16.x - get_work_pool - general page fault
author: zer0day
categories: lk
---

get_work_pool - general page fault

posted & found by [zer0day](https://kozistr.github.io/)

## tl;dr

Found on LK v4.16.0-rc7. leaded to null-dereference. Not analyzed yet...

## Call Trace (Dump)

Here's a dmesg & Call Trace.

```c
[  981.132280] general protection fault: 0000 [#1] SMP KASAN PTI
[  981.132834] Dumping ftrace buffer:
[  981.133121]    (ftrace buffer empty)
[  981.133424] Modules linked in:
[  981.133795] CPU: 1 PID: 1024 Comm: kworker/u6:1 Not tainted 4.16.0-rc7+ #27
[  981.134510] Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS 1.10.2-1ubuntu1 04/01/2014
[  981.135333] Workqueue: netns cleanup_net
[  981.135829] RIP: 0010:get_work_pool+0x148/0x1e0
[  981.136353] RSP: 0018:ffff88002929ef18 EFLAGS: 00010002
[  981.136927] RAX: dffffc0000000000 RBX: 0000000fffffff00 RCX: ffffffffb8197397
[  981.137552] RDX: 00000001ffffffe0 RSI: ffffffffbb8f4ca0 RDI: 0000000000000046
[  981.138139] RBP: 1ffff10005253de7 R08: ffff88002929f070 R09: ffff880029338920
[  981.138854] R10: 0000000000000001 R11: 0000000000000000 R12: 1ffff10005253de3
[  981.139432] R13: 1ffff10005253e30 R14: dffffc0000000000 R15: fffffbfff77aec6b
[  981.140115] FS:  0000000000000000(0000) GS:ffff88007fc00000(0000) knlGS:0000000000000000
[  981.140811] CS:  0010 DS: 0000 ES: 0000 CR0: 0000000080050033
[  981.141372] CR2: 000000c4232e7000 CR3: 00000000274c4000 CR4: 00000000000006e0
[  981.141992] DR0: 0000000020000100 DR1: 0000000020000100 DR2: 0000000000000000
[  981.142674] DR3: 0000000000000000 DR6: 00000000fffe0ff0 DR7: 0000000000000600
[  981.143293] Call Trace:
[  981.143584]  ? trace_raw_output_workqueue_execute_start+0x100/0x100
[  981.144486]  ? deref_stack_reg+0x110/0x110
[  981.145095]  flush_work+0xcb/0x830
[  981.145585]  ? insert_work+0x3c0/0x3c0
[  981.146110]  ? print_usage_bug+0x140/0x140
[  981.146621]  ? ret_from_fork+0x3a/0x50
[  981.147064]  ? save_stack+0x89/0xb0
[  981.147458]  ? __kasan_slab_free+0x12c/0x170
[  981.148005]  ? kfree+0xf3/0x310
[  981.148454]  ? xfrm_net_exit+0x11/0x30
[  981.148955]  ? ops_exit_list.isra.6+0xa1/0x140
[  981.149514]  ? cleanup_net+0x622/0xbc0
[  981.150070]  ? process_one_work+0xafd/0x1970
[  981.150659]  ? worker_thread+0x21a/0x1830
[  981.151191]  ? kthread+0x32b/0x3f0
[  981.151616]  ? ret_from_fork+0x3a/0x50
[  981.152077]  ? __delete_object+0x133/0x1b0
[  981.152625]  ? lock_acquire+0x4a0/0x4a0
[  981.153221]  xfrm_policy_fini+0xae/0x4d0
[  981.153755]  ? xfrm_policy_flush+0x470/0x470
[  981.154335]  ? _raw_write_unlock_irqrestore+0x46/0x60
[  981.154988]  ? mark_held_locks+0xa8/0xf0
[  981.155435]  ? quarantine_put+0xc1/0x160
[  981.155934]  ? __kasan_slab_free+0x141/0x170
[  981.156546]  ? xfrm_net_exit+0x11/0x30
[  981.157027]  ? xfrm_policy_fini+0x4d0/0x4d0
[  981.157563]  xfrm_net_exit+0x19/0x30
[  981.158013]  ops_exit_list.isra.6+0xa1/0x140
[  981.158639]  cleanup_net+0x622/0xbc0
[  981.159131]  ? peernet2id_alloc+0x330/0x330
[  981.159639]  ? __lock_acquire+0x840/0x4670
[  981.160164]  ? save_trace+0x300/0x300
[  981.160660]  ? find_held_lock+0x32/0x1b0
[  981.161172]  ? save_trace+0x300/0x300
[  981.161646]  ? lock_acquire+0x1a5/0x4a0
[  981.162132]  ? process_one_work+0xa3f/0x1970
[  981.162644]  ? finish_task_switch+0x182/0x740
[  981.163184]  ? lock_downgrade+0x6e0/0x6e0
[  981.163783]  ? do_raw_spin_trylock+0x190/0x190
[  981.164377]  ? __lock_is_held+0xad/0x140
[  981.164866]  process_one_work+0xafd/0x1970
[  981.165377]  ? _raw_spin_unlock_irq+0x24/0x40
[  981.165955]  ? drain_workqueue+0x560/0x560
[  981.166670]  ? lock_repin_lock+0x410/0x410
[  981.167349]  ? __schedule+0x75c/0x1ea0
[  981.167810]  ? __sched_text_start+0x8/0x8
[  981.168348]  ? select_task_rq_fair+0x1177/0x35d0
[  981.169101]  ? save_trace+0x300/0x300
[  981.169600]  ? lock_acquire+0x4a0/0x4a0
[  981.170140]  ? __read_once_size_nocheck.constprop.8+0x10/0x10
[  981.170813]  ? lock_downgrade+0x6e0/0x6e0
[  981.171376]  ? find_held_lock+0x32/0x1b0
[  981.171851]  ? lock_acquire+0x1a5/0x4a0
[  981.172370]  ? worker_thread+0x467/0x1830
[  981.172853]  ? lock_downgrade+0x6e0/0x6e0
[  981.173387]  ? do_raw_spin_trylock+0x190/0x190
[  981.173925]  worker_thread+0x21a/0x1830
[  981.174691]  ? do_raw_spin_trylock+0x190/0x190
[  981.175253]  ? process_one_work+0x1970/0x1970
[  981.175789]  ? find_held_lock+0x32/0x1b0
[  981.176345]  ? _raw_spin_unlock_irq+0x24/0x40
[  981.176899]  ? _raw_spin_unlock_irq+0x24/0x40
[  981.177480]  ? finish_task_switch+0x1c2/0x740
[  981.178058]  ? finish_task_switch+0x182/0x740
[  981.178608]  ? set_load_weight+0x270/0x270
[  981.179158]  ? lock_repin_lock+0x410/0x410
[  981.179794]  ? __schedule+0x75c/0x1ea0
[  981.180430]  ? __sched_text_start+0x8/0x8
[  981.181023]  ? kmem_cache_alloc_trace+0x116/0x2b0
[  981.181688]  ? kthread+0x98/0x3f0
[  981.182180]  ? save_trace+0x300/0x300
[  981.182703]  ? create_object+0x799/0xb40
[  981.183289]  ? schedule+0xf0/0x3a0
[  981.183883]  ? lock_acquire+0x4a0/0x4a0
[  981.184539]  ? __schedule+0x1ea0/0x1ea0
[  981.185213]  ? wait_woken+0x260/0x260
[  981.185838]  ? do_raw_spin_trylock+0x190/0x190
[  981.186489]  ? __lockdep_init_map+0xdf/0x4d0
[  981.187031]  ? __init_waitqueue_head+0x89/0x140
[  981.187610]  ? _raw_spin_unlock_irqrestore+0x46/0x60
[  981.188213]  ? process_one_work+0x1970/0x1970
[  981.188729]  ? process_one_work+0x1970/0x1970
[  981.189283]  kthread+0x32b/0x3f0
[  981.189714]  ? kthread_create_worker_on_cpu+0xe0/0xe0
[  981.190430]  ret_from_fork+0x3a/0x50
[  981.190997] Code: 28 00 00 00 0f 85 8c 00 00 00 48 83 c4 60 5b 5d 41 5c c3 30 db e8 69 e6 27 00 48 89 da 48 b8 00 00 00 00 00 fc ff df 48 c1 ea 03 <80> 3c 02 00 75 6a 48 8b 1b eb a6 e8 48 e6 27 00 e8 a3 82 14 00 
[  981.193585] RIP: get_work_pool+0x148/0x1e0 RSP: ffff88002929ef18
[  981.194350] ---[ end trace f68a6ddbb826daeb ]---
[  981.194897] Kernel panic - not syncing: Fatal exception
[  981.195715] Dumping ftrace buffer:
[  981.196118]    (ftrace buffer empty)
[  981.196618] Kernel Offset: 0x37000000 from 0xffffffff81000000 (relocation range: 0xffffffff80000000-0xffffffffbfffffff)
[  981.197790] Rebooting in 86400 seconds..
```

## Code

```c
   0:   28 00                   sub    BYTE PTR [rax],al
   2:   00 00                   add    BYTE PTR [rax],al
   4:   0f 85 8c 00 00 00       jne    0x96
   a:   48 83 c4 60             add    rsp,0x60
   e:   5b                      pop    rbx
   f:   5d                      pop    rbp
  10:   41 5c                   pop    r12
  12:   c3                      ret    
  13:   30 db                   xor    bl,bl
  15:   e8 69 e6 27 00          call   0x27e683
  1a:   48 89 da                mov    rdx,rbx
  1d:   48 b8 00 00 00 00 00    movabs rax,0xdffffc0000000000
  24:   fc ff df 
  27:   48 c1 ea 03             shr    rdx,0x3
  2b:  *80 3c 02 00             cmp    BYTE PTR [rdx+rax*1],0x0
  2f:   75 6a                   jne    0x9b
  31:   48 8b 1b                mov    rbx,QWORD PTR [rbx]
  34:   eb a6                   jmp    0xffffffffffffffdc
  36:   e8 48 e6 27 00          call   0x27e683
  3b:   e8 a3 82 14 00          call   0x1482e3
```

**End**
