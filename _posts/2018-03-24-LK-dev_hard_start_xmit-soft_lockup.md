---
layout: post
title: LK v4.16.x - dev_hard_start_xmit - soft lockup
comments: true
---

dev_hard_start_xmit - soft lockup

posted & found by [zer0day](https://kozistr.github.io/)

## tl;dr

Found in LK v4.16.0-rc7. ```CPU#0``` stuck for 30s.

## Call Trace (Dump)

Here's a dump.

```c
[  268.822032] Modules linked in:
[  268.822287] irq event stamp: 10299
[  268.822555] hardirqs last  enabled at (10298): [<0000000006ab7d5b>] restore_regs_and_return_to_kernel+0x0/0x30
[  268.823301] hardirqs last disabled at (10299): [<000000005cde897b>] interrupt_entry+0xc0/0xe0
[  268.823941] softirqs last  enabled at (10260): [<00000000f0685d4e>] __do_softirq+0x6f6/0xa8b
[  268.824575] softirqs last disabled at (10263): [<00000000de954a09>] irq_exit+0x19b/0x1c0

[  268.832693] Call Trace:
[  268.832888]  <IRQ>
[  268.833069]  ? e1000_clean+0x1be0/0x1be0
[  268.833373]  ? packet_rcv_spkt+0x121/0x570
[  268.833689]  ? packet_mmap+0x5b0/0x5b0
[  268.833981]  ? rcutorture_record_progress+0x10/0x10
[  268.834364]  ? save_trace+0x300/0x300
[  268.834648]  ? dev_queue_xmit_nit+0x898/0xbe0
[  268.834988]  ? napi_busy_loop+0xb20/0xb20
[  268.835300]  ? __lock_is_held+0xad/0x140
[  268.835630]  dev_hard_start_xmit+0x224/0xa30
[  268.835974]  ? validate_xmit_skb_list+0x110/0x110
[  268.836335]  ? netif_skb_features+0x578/0x8a0
[  268.836674]  ? __skb_gso_segment+0x780/0x780
[  268.837006]  ? lock_acquire+0x1a5/0x4a0
[  268.837303]  ? sch_direct_xmit+0x27c/0x990
[  268.837620]  ? validate_xmit_skb.isra.113+0x3ce/0xae0
[  268.838014]  ? lock_downgrade+0x6e0/0x6e0
[  268.838332]  ? netif_skb_features+0x8a0/0x8a0
[  268.838668]  ? __local_bh_enable_ip+0xea/0x1b0
[  268.839016]  sch_direct_xmit+0x303/0x990
[  268.839323]  ? dev_watchdog+0x960/0x960
[  268.839623]  ? __lock_is_held+0xad/0x140
[  268.839931]  ? __qdisc_run+0x70a/0x16b0
[  268.840232]  ? sch_direct_xmit+0x990/0x990
[  268.840547]  ? lock_acquire+0x1a5/0x4a0
[  268.840847]  ? _raw_spin_unlock+0x1f/0x30
[  268.841155]  ? pfifo_fast_enqueue+0x372/0x590
[  268.841490]  ? mini_qdisc_pair_init+0x150/0x150
[  268.841867]  ? rcu_pm_notify+0xc0/0xc0
[  268.842171]  ? __dev_queue_xmit+0x196c/0x2660
[  268.842512]  ? netdev_pick_tx+0x260/0x260
[  268.842824]  ? ___slab_alloc+0x567/0x600
[  268.843128]  ? __alloc_skb+0x119/0x6c0
[  268.843420]  ? __lock_is_held+0xad/0x140
[  268.843729]  ? rcu_read_lock_sched_held+0xe4/0x120
[  268.844094]  ? __kmalloc_node_track_caller+0x318/0x3b0
[  268.844483]  ? __alloc_skb+0x119/0x6c0
[  268.844775]  ? memset+0x1f/0x40
[  268.845021]  ? __alloc_skb+0x50e/0x6c0
[  268.845311]  ? netdev_alloc_frag+0x80/0x80
[  268.845626]  ? print_usage_bug+0x140/0x140
[  268.845941]  ? save_trace+0x300/0x300
[  268.846274]  ? save_trace+0x300/0x300
[  268.846568]  ? memcpy+0x34/0x50
[  268.846816]  ? memset+0x1f/0x40
[  268.847064]  ? arp_create+0x623/0x860
[  268.847348]  ? ether_setup+0x2d0/0x2d0
[  268.847642]  ? arp_send_dst.part.17+0x1ad/0x220
[  268.847990]  ? arp_xmit+0x130/0x130
[  268.848264]  ? mark_held_locks+0xa8/0xf0
[  268.848569]  ? arp_solicit+0xbd9/0x1260
[  268.848871]  ? arp_rcv+0x620/0x620
[  268.849135]  ? neigh_probe+0x65/0xf0
[  268.849419]  ? memzero_explicit+0xa/0x10
[  268.849723]  ? lock_downgrade+0x6e0/0x6e0
[  268.850041]  ? crng_backtrack_protect+0x80/0x80
[  268.850397]  ? do_raw_write_trylock+0x190/0x190
[  268.850743]  ? refcount_inc_not_zero+0xf5/0x180
[  268.851090]  ? refcount_add+0x50/0x50
[  268.851377]  ? arp_rcv+0x620/0x620
[  268.851655]  ? neigh_probe+0xbb/0xf0
[  268.851933]  ? neigh_timer_handler+0x6ae/0xc70
[  268.852276]  ? __neigh_for_each_release+0x450/0x450
[  268.852650]  ? __lock_is_held+0xad/0x140
[  268.852958]  ? call_timer_fn+0x23a/0x7f0
[  268.853261]  ? __neigh_for_each_release+0x450/0x450
[  268.853633]  ? process_timeout+0x40/0x40
[  268.853935]  ? find_held_lock+0x32/0x1b0
[  268.854249]  ? __run_timers+0x688/0xa30
[  268.854547]  ? lock_acquire+0x4a0/0x4a0
[  268.854842]  ? find_held_lock+0x32/0x1b0
[  268.855145]  ? lock_downgrade+0x6e0/0x6e0
[  268.855455]  ? do_raw_spin_trylock+0x190/0x190
[  268.855802]  ? _raw_spin_unlock_irq+0x24/0x40
[  268.856134]  ? __neigh_for_each_release+0x450/0x450
[  268.856507]  ? __neigh_for_each_release+0x450/0x450
[  268.856878]  ? __run_timers+0x693/0xa30
[  268.857179]  ? msleep_interruptible+0x140/0x140
[  268.857529]  ? timerqueue_add+0x1c8/0x270
[  268.857839]  ? save_trace+0x300/0x300
[  268.858129]  ? enqueue_hrtimer+0x168/0x480
[  268.858443]  ? retrigger_next_event+0x1d0/0x1d0
[  268.858796]  ? find_held_lock+0x32/0x1b0
[  268.859113]  ? clockevents_program_event+0x124/0x2d0
[  268.859491]  ? lock_acquire+0x1a5/0x4a0
[  268.859794]  ? hrtimer_init+0x3b0/0x3b0
[  268.860103]  ? rcu_pm_notify+0xc0/0xc0
[  268.860399]  ? run_timer_softirq+0x48/0x70
[  268.860716]  ? __do_softirq+0x2a3/0xa8b
[  268.861018]  ? __irqentry_text_end+0x1f9917/0x1f9917
[  268.861398]  ? do_raw_spin_trylock+0x190/0x190
[  268.861758]  ? lapic_next_event+0x50/0x80
[  268.862067]  ? clockevents_program_event+0xff/0x2d0
[  268.862466]  ? tick_program_event+0x7e/0x100
[  268.862915]  ? hrtimer_interrupt+0x535/0x6e0
[  268.863347]  ? irq_exit+0x19b/0x1c0
[  268.863679]  ? smp_apic_timer_interrupt+0x162/0x6d0
[  268.864189]  ? smp_call_function_single_interrupt+0x650/0x650
[  268.864781]  ? smp_thermal_interrupt+0x710/0x710
[  268.865270]  ? ioapic_ir_ack_level+0xc0/0xc0
[  268.865714]  ? _raw_spin_unlock+0x1f/0x30
[  268.866080]  ? handle_fasteoi_irq+0x1d8/0x500
[  268.866515]  ? task_prio+0x50/0x50
[  268.866882]  ? trace_hardirqs_off_thunk+0x1a/0x1c
[  268.867331]  ? apic_timer_interrupt+0xf/0x20
[  268.867745]  </IRQ>
```

## Code

> Code : <br> 
> c8 00 00 00 48 c1 ea 03 48 01 c3 48 b8 00 00 00 00 00 fc ff df 0f b6 04 02 84 c0 74 08 3c 03 0f 8e 5f 2b 00 00 41 8b 47 18 89 03 <31> db e9 a7 0c 00 00 e8 6d 7e aa fe 83 fb 03 0f 86 f0 1c 00 00

```c
   0:   c8 00 00 00             enter  0x0,0x0
   4:   48 c1 ea 03             shr    rdx,0x3
   8:   48 01 c3                add    rbx,rax
   b:   48 b8 00 00 00 00 00    movabs rax,0xdffffc0000000000
  12:   fc ff df 
  15:   0f b6 04 02             movzx  eax,BYTE PTR [rdx+rax*1]
  19:   84 c0                   test   al,al
  1b:   74 08                   je     0x25
  1d:   3c 03                   cmp    al,0x3
  1f:   0f 8e 5f 2b 00 00       jle    0x2b84
  25:   41 8b 47 18             mov    eax,DWORD PTR [r15+0x18]
  29:   89 03                   mov    DWORD PTR [rbx],eax
  2b:  *31 db                   xor    ebx,ebx
  2d:   e9 a7 0c 00 00          jmp    0xcd9
  32:   e8 6d 7e aa fe          call   0xfffffffffeaa7ea4
  37:   83 fb 03                cmp    ebx,0x3
  3a:   0f 86 f0 1c 00 00       jbe    0x1d30
```

**End**