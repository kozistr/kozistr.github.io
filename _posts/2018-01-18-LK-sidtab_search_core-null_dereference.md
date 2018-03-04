---
layout: post
title: LK v4.15.x - sidtab_search_core - null dereference
comments: true
---

selinux/sidtab_search_core - null dereference by GPF

posted & found by [zer0day](https://kozistr.github.io/)


## tl;dr
Actually, i got this bug with 'syzkaller' about a month ago (on v4.15.0-rc4) and have forgotten it, but now on v4.15.0-rc8, same bug is triggered by my poc code, so i wrote about it :).

First of all, from the conclusion, it is **(practically?) not critical**. Because, nowadays, null dereference isn't worked anymore unless expanding minimum virtual memory limitation.

So, i just analyze this bug only to a certain extent, not trying to make full exploit code. (Strictly saying that of course any info leaks are needed to complete this exp.)

## Bug
The bug type is NULL dereference (at 0x0000000000000008). Caused by GPF (General Page Fault). For explain, when GPF occurs, the address the program attempted to access is stored in the CR2 register.

First, let's see the log.

```c
BUG: unable to handle kernel NULL pointer dereference at 0000000000000008
IP: sidtab_search_core+0x2d/0x100 security/selinux/ss/sidtab.c:88
PGD 800000007de20067 P4D 800000007de20067 PUD 71211067 PMD 0 
Oops: 0000 [#1] SMP PTI
Dumping ftrace buffer:
   (ftrace buffer empty)
Modules linked in:
CPU: 2 PID: 9230 Comm: syz-executor4 Not tainted 4.15.0-rc8-tsan #12
Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS Ubuntu-1.8.2-1ubuntu1 04/01/2014
RIP: 0010:sidtab_search_core+0x2d/0x100 security/selinux/ss/sidtab.c:88
RSP: 0018:ffffafff40abfd40 EFLAGS: 00010202
RAX: 0000000000000001 RBX: ffffffffbc8eef60 RCX: ffffffff8145f964
RDX: 0000000000000122 RSI: ffffafff410a1000 RDI: ffffffffbc8eef60
RBP: ffff9c3cfcc86a60 R08: 0000000000000001 R09: 0000000000000006
R10: ffffafff40abfcf0 R11: 6bcc1da06bf0e4e5 R12: 0000000000000001
R13: 0000000000000000 R14: 0000000000000000 R15: ffff9c3cfe044e40
FS:  00007ffb4e6d5700(0000) GS:ffff9c3cffc00000(0000) knlGS:0000000000000000
CS:  0010 DS: 0000 ES: 0000 CR0: 0000000080050033
CR2: 0000000000000008 CR3: 000000007131a000 CR4: 00000000000006e0
DR0: 0000000000000000 DR1: 0000000000000000 DR2: 0000000000000000
DR3: 0000000000000000 DR6: 00000000fffe0ff0 DR7: 0000000000000600
Call Trace:
 security_bounded_transition+0x2d/0x1b0 security/selinux/ss/services.c:873
 selinux_setprocattr+0x37e/0x480 security/selinux/hooks.c:6042
 security_setprocattr+0x4f/0x70 security/security.c:1264
 proc_pid_attr_write+0x107/0x140 fs/proc/base.c:2545
 __vfs_write+0x40/0x1c0 fs/read_write.c:480
 vfs_write+0xe1/0x210 fs/read_write.c:544
 SYSC_write fs/read_write.c:589 [inline]
 SyS_write+0x50/0xc0 fs/read_write.c:581
 entry_SYSCALL_64_fastpath+0x25/0x9c
RIP: 0033:0x452a39
RSP: 002b:00007ffb4e6d4c58 EFLAGS: 00000212
Code: 41 55 41 89 d6 41 54 55 41 89 f4 53 48 89 fb e8 1a 40 d0 ff 48 85 db 0f 84 8e 00 00 00 e8 0c 40 d0 ff 4c 8b 2b 44 89 e0 83 e0 7f <49> 8b 5c c5 00 48 85 db 74 28 e8 f4 3f d0 ff 8b 2b 41 39 ec 77 
RIP: sidtab_search_core+0x2d/0x100 security/selinux/ss/sidtab.c:88 RSP: ffffafff40abfd40
CR2: 0000000000000008
---[ end trace fcdce066308f120e ]---
Kernel panic - not syncing: Fatal exception
Dumping ftrace buffer:
   (ftrace buffer empty)
Kernel Offset: 0x38a00000 from 0xffffffff81000000 (relocation range: 0xffffffff80000000-0xffffffffbfffffff)
Rebooting in 86400 seconds..
```

And first thing to do is to look the **Call Trace** so that we can notice where the crash is happened.
In this case, RIP is at security/selinux/ss/sidtab.c:88 and last call trace is in security/selinux/ss/services.c:873.

```c
int security_bounded_transition(u32 old_sid, u32 new_sid)
{
	struct context *old_context, *new_context;
	struct type_datum *type;
	int index;
	int rc;

	read_lock(&policy_rwlock);

	rc = -EINVAL;
	old_context = sidtab_search(&sidtab, old_sid);  // called
	...

static struct context *sidtab_search_core(struct sidtab *s, u32 sid, int force)
{
	int hvalue;
	struct sidtab_node *cur;

	if (!s)
		return NULL;

	hvalue = SIDTAB_HASH(sid);
	cur = s->htable[hvalue];     // line 88 // here 
	while (cur && sid > cur->sid)
		cur = cur->next;

	if (force && cur && sid == cur->sid && cur->context.len)
		return &cur->context;

	if (!cur || sid != cur->sid || cur->context.len) {
		/* Remap invalid SIDs to the unlabeled SID. */
		sid = SECINITSID_UNLABELED;
		hvalue = SIDTAB_HASH(sid);
		cur = s->htable[hvalue];
		while (cur && sid > cur->sid)
			cur = cur->next;
		if (!cur || sid != cur->sid)
			return NULL;
	}

	return &cur->context;
}
```

we can't know all about why it is crashed and what/where the bad pointer is only with above info.
Abd because of KASAN, KASAN triggers before the PF, tries to access the **shadow memory** for the bad pointer.

Then, let's have a look at the code. Using pwntools, we can easily disassemble it.
```python
from pwn import *


bytecodes = "41 55 41 89 d6 41 54 55 41 89 f4 53 48 89 fb e8 1a 40 d0 ff 48 85 db 0f 84 8e 00 00 00 e8 0c 40 d0 ff 4c 8b 2b 44 89 e0 83 e0 7f 49 8b 5c c5 00 48 85 db 74 28 e8 f4 3f d0 ff 8b 2b 41 39 ec 77".replace(' ', '').decode('hex')

res = disasm(bytecodes, arch='amd64', os='linux')

print(res)
```

the result is...

```c
   0:   41 55                   push   r13 
   2:   41 89 d6                mov    r14d,edx
   5:   41 54                   push   r12
   7:   55                      push   rbp
   8:   41 89 f4                mov    r12d,esi
   b:   53                      push   rbx ; rbx is s (struct sidtab *)
   c:   48 89 fb                mov    rbx,rdi
   f:   e8 1a 40 d0 ff          call   0xffffffffffd0402e
  14:   48 85 db                test   rbx,rbx
  17:   0f 84 8e 00 00 00       je     0xab ; maybe the end of function
  1d:   e8 0c 40 d0 ff          call   0xffffffffffd0402e
  22:   4c 8b 2b                mov    r13,QWORD PTR [rbx] ; s = *s
  25:   44 89 e0                mov    eax,r12d ; r12d is sid, 1
  28:   83 e0 7f                and    eax,0x7f ; sid &= 0x7f       ; hvalue = SIDTAB_HASH(sid)
  2b:  *49 8b 5c c5 00          mov    rbx,QWORD PTR [r13+rax*8+0x0]; cur = s->htable[hvalue] 
  30:   48 85 db                test   rbx,rbx
  33:   74 28                   je     0x5d
  35:   e8 f4 3f d0 ff          call   0xffffffffffd0402e
  3a:   8b 2b                   mov    ebp,DWORD PTR [rbx]
  3c:   41 39 ec                cmp    r12d,ebp
  3f:   77                      .byte 0x77
```

As following, at line 2b, moving *(r13 + rax * 8 + 0x0) to rbx. r13 is 0, rax is 1, then r13 + rax * 8 + 0x0 = 8.
Which means NULL dereference (at 0x8) is confirmed.

Let's see structure...

```c
struct sidtab {
	struct sidtab_node * *     htable;               /*     0     8 */
	unsigned int               nel;                  /*     8     4 */
	unsigned int               next_sid;             /*    12     4 */
	unsigned char              shutdown;             /*    16     1 */

	/* XXX 7 bytes hole, try to pack */

	struct sidtab_node *       cache[3];             /*    24    24 */
	spinlock_t                 lock;                 /*    48    56 */
	/* --- cacheline 1 boundary (64 bytes) was 40 bytes ago --- */

	/* size: 104, cachelines: 2, members: 6 */
	/* sum members: 97, holes: 1, sum holes: 7 */
	/* last cacheline: 40 bytes */
};

struct sidtab_node {
	u32                        sid;                  /*     0     4 */

	/* XXX 4 bytes hole, try to pack */

	struct context             context;              /*     8    72 */
	/* --- cacheline 1 boundary (64 bytes) was 16 bytes ago --- */
	struct sidtab_node *       next;                 /*    80     8 */

	/* size: 88, cachelines: 2, members: 3 */
	/* sum members: 84, holes: 1, sum holes: 4 */
	/* last cacheline: 24 bytes */
};
```
```c
	cur = s->htable[hvalue];     // line 88 // here 
```

then, we found where the problem is. Then, how could it be fixed? &s->htable (NULL) checking?

==============

My analyze is end here! more requires a few effort :0....
Of course, i have PoC code reproducible, but i'll not upload it! :|

**END**