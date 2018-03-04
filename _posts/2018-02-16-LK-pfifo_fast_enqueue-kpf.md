---
layout: post
title: LK v4.16.x - pfifo_fast_enqueue - kernel paging request
comments: true
---

pfifo_fast_enqueue - unable to handle kernel paging request

posted & found by [zer0day](https://kozistr.github.io/)

## tl;dr

I just got this bug from syzkaller today on LK v4.16.0-rc1.

## Call Trace (Dump)

Here's a Dump.

```c
IP: qdisc_qstats_cpu_qlen_inc include/net/sch_generic.h:717 [inline]
IP: pfifo_fast_enqueue+0xce/0x130 net/sched/sch_generic.c:638
PGD 5f758067 P4D 5f758067 PUD 5f759067 PMD 7fa34067 PTE 800000003a9f7060
Oops: 0000 [#1] SMP DEBUG_PAGEALLOC PTI
Dumping ftrace buffer:
   (ftrace buffer empty)
Modules linked in:
CPU: 0 PID: 2766 Comm: syz-fuzzer Not tainted 4.16.0-rc1+ #17
Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS Ubuntu-1.8.2-1ubuntu1 04/01/2014
RIP: 0010:qdisc_qstats_cpu_qlen_inc include/net/sch_generic.h:717 [inline]
RIP: 0010:pfifo_fast_enqueue+0xce/0x130 net/sched/sch_generic.c:638
RSP: 0018:ffffb1ffc13df8e8 EFLAGS: 00010207
RAX: 0000472b4040eaa4 RBX: 0000000000000000 RCX: ffffffff8af3a141
RDX: 0000000000000000 RSI: 0000000000000005 RDI: ffff8ad479d17b08
RBP: ffff8ad479d178c0 R08: 0000000000000000 R09: 0000000000000000
R10: ffffb1ffc13df868 R11: 5aaeccbc2ff5acd1 R12: ffff8ad479d17800
R13: ffff8ad43a9f7f00 R14: ffff8ad479d17b08 R15: ffffb1ffc13df958
FS:  00007ff075d99700(0000) GS:ffff8ad43fc00000(0000) knlGS:0000000000000000
CS:  0010 DS: 0000 ES: 0000 CR0: 0000000080050033
CR2: ffff8ad43a9f7f28 CR3: 000000007a882000 CR4: 00000000000006f0
DR0: 0000000000000000 DR1: 0000000000000000 DR2: 0000000000000000
DR3: 0000000000000000 DR6: 00000000fffe0ff0 DR7: 0000000000000400
Call Trace:
 __dev_xmit_skb net/core/dev.c:3209 [inline]
 __dev_queue_xmit+0x331/0xd80 net/core/dev.c:3510
 neigh_hh_output include/net/neighbour.h:472 [inline]
 neigh_output include/net/neighbour.h:480 [inline]
 ip_finish_output2+0x5d8/0x7d0 net/ipv4/ip_output.c:229
 ip_finish_output+0x246/0x3d0 net/ipv4/ip_output.c:317
 NF_HOOK_COND include/linux/netfilter.h:277 [inline]
 ip_output+0x8a/0x2e0 net/ipv4/ip_output.c:405
 dst_output include/net/dst.h:443 [inline]
 ip_local_out+0x4e/0xa0 net/ipv4/ip_output.c:124
 ip_queue_xmit+0x289/0x760 net/ipv4/ip_output.c:504
 tcp_transmit_skb+0x645/0xd60 net/ipv4/tcp_output.c:1176
 tcp_send_ack.part.42+0xd4/0x160 net/ipv4/tcp_output.c:3619
 tcp_send_ack+0x1e/0x30 net/ipv4/tcp_output.c:3589
 tcp_cleanup_rbuf+0x88/0x180 net/ipv4/tcp.c:1605
 tcp_recvmsg+0x45c/0xf00 net/ipv4/tcp.c:2022
 inet_recvmsg+0x78/0x270 net/ipv4/af_inet.c:796
 sock_recvmsg_nosec net/socket.c:803 [inline]
 sock_recvmsg+0x47/0x60 net/socket.c:810
 sock_read_iter+0xb2/0x120 net/socket.c:887
 call_read_iter include/linux/fs.h:1775 [inline]
 new_sync_read fs/read_write.c:401 [inline]
 __vfs_read+0x169/0x1d0 fs/read_write.c:413
 vfs_read+0xc0/0x1a0 fs/read_write.c:447
 SYSC_read fs/read_write.c:573 [inline]
 SyS_read+0x60/0xe0 fs/read_write.c:566
 do_syscall_64+0x74/0x210 arch/x86/entry/common.c:287
 entry_SYSCALL_64_after_hwframe+0x26/0x9b
RIP: 0033:0x488864
RSP: 002b:000000c4204a99a8 EFLAGS: 00000246 ORIG_RAX: 0000000000000000
RAX: ffffffffffffffda RBX: 0000000000000000 RCX: 0000000000488864
RDX: 0000000000001000 RSI: 000000c4203c1000 RDI: 0000000000000003
RBP: 000000c4204a99f8 R08: 0000000000000000 R09: 0000000000000000
R10: 0000000000000000 R11: 0000000000000246 R12: 000000c425859aa0
R13: 0000000000000001 R14: 000000c42449b260 R15: 0000000000000000
Code: 00 00 39 83 40 02 00 00 7d 67 e8 7e 48 63 ff 4c 89 f7 e8 46 2f 37 00 31 db e8 6f 48 63 ff 49 8b 44 24 58 65 ff 00 49 8b 44 24 58 <41> 8b 55 28 65 01 50 04 e8 55 48 63 ff 89 d8 5b 5d 41 5c 41 5d 
RIP: qdisc_qstats_cpu_qlen_inc include/net/sch_generic.h:717 [inline] RSP: ffffb1ffc13df8e8
RIP: pfifo_fast_enqueue+0xce/0x130 net/sched/sch_generic.c:638 RSP: ffffb1ffc13df8e8
CR2: ffff8ad43a9f7f28
---[ end trace a3bf459ad1c9376d ]---
```

RIP is pointing at pfifo_fast_enqueue.

## Bug

```c
static int pfifo_fast_enqueue(struct sk_buff *skb, struct Qdisc *qdisc,
			      struct sk_buff **to_free)
{
	int band = prio2band[skb->priority & TC_PRIO_MAX];
	struct pfifo_fast_priv *priv = qdisc_priv(qdisc);
	struct skb_array *q = band2list(priv, band);
	int err;

	err = skb_array_produce(q, skb);

	if (unlikely(err))
		return qdisc_drop_cpu(skb, qdisc, to_free);

	qdisc_qstats_cpu_qlen_inc(qdisc);
	qdisc_qstats_cpu_backlog_inc(qdisc, skb);
	return NET_XMIT_SUCCESS;
}

static inline void qdisc_qstats_cpu_qlen_inc(struct Qdisc *sch)
{
	this_cpu_inc(sch->cpu_qstats->qlen); // equals to this_cpu_add(sch->cpu_qstats->qlen, 1);
}

static inline void qdisc_qstats_cpu_backlog_inc(struct Qdisc *sch,
						const struct sk_buff *skb)
{
	this_cpu_add(sch->cpu_qstats->backlog, qdisc_pkt_len(skb));
}

```

```c
   0:   00 00                   add    BYTE PTR [rax],al
   2:   39 83 40 02 00 00       cmp    DWORD PTR [rbx+0x240],eax ; unlikely(err)
   8:   7d 67                   jge    0x71 ; maybe errout
   a:   e8 7e 48 63 ff          call   0xffffffffff63488d ; this_cpu_add
   f:   4c 89 f7                mov    rdi,r14
  12:   e8 46 2f 37 00          call   0x372f5d
  17:   31 db                   xor    ebx,ebx ; ebx = 0
  19:   e8 6f 48 63 ff          call   0xffffffffff63488d ; this_cpu_add
  1e:   49 8b 44 24 58          mov    rax,QWORD PTR [r12+0x58]
  23:   65 ff 00                inc    DWORD PTR gs:[rax] ; sch->cpu_qstats->qlen, increased by 1
  26:   49 8b 44 24 58          mov    rax,QWORD PTR [r12+0x58] ; qdisc
  2b:  *41 8b 55 28             mov    edx,DWORD PTR [r13+0x28] ; skb
  2f:   65 01 50 04             add    DWORD PTR gs:[rax+0x4],edx
  33:   e8 55 48 63 ff          call   0xffffffffff63488d ; this_cpu_add
  38:   89 d8                   mov    eax,ebx ; eax = ebx (eax = 0)
  3a:   5b                      pop    rbx
  3b:   5d                      pop    rbp
  3c:   41 5c                   pop    r12
  3e:   41 5d                   pop    r13
```

Generously, 'Unable to handle kernel paging request' bug happened when bad type-casting or invalid pointer exist.

At 0x2b, there is a crash point. Meaning that accessing [r13+0x28] is violated.  Let's have a look.

With above Crash Dump, we can notice **r13** is 0x1. At result, in that case, accessing at 0x29 where a invalid page is currently, getting value from there and moving into edx (skb).

So the bug is happened by above reason.

Then, why 'r13' is corrupted? Well... digging up more with reproducible PoC and then maybe there's a clear result :).

## Solution

Maybe, more strict pointer validation is needed at qdisc & skb.

Here's my suggested patch PoC code. (not verified).

```c
static int pfifo_fast_enqueue(struct sk_buff *skb, struct Qdisc *qdisc,
			      struct sk_buff **to_free)
{
	int band = prio2band[skb->priority & TC_PRIO_MAX];
	struct pfifo_fast_priv *priv = qdisc_priv(qdisc);
	struct skb_array *q = band2list(priv, band);
	int err;

	err = skb_array_produce(q, skb);

	if (unlikely(err))
		return qdisc_drop_cpu(skb, qdisc, to_free);
		
	if (!qdisc) // qdisc validation
	    return sth;
	
	qdisc_qstats_cpu_qlen_inc(qdisc);
	qdisc_qstats_cpu_backlog_inc(qdisc, skb);
	return NET_XMIT_SUCCESS;
}
```

**End**