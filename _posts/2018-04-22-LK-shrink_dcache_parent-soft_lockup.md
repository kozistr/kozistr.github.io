---
layout: post
title: LK v4.17.x - shrink_dcache_parent - soft lockup
author: zer0day
categories: lk
---

shrink_dcache_parent - soft lockup

posted & found by [zer0day](https://kozistr.github.io/)

## tl;dr

Got from syzkaller & Found in LK v4.17.0-rc1.

Similar symptom [prev ver patch](https://patchwork.kernel.org/patch/4245861/)

## Call Trace (Dump)

Here's a dmesg.

```c
[  124.038017] watchdog: BUG: soft lockup - CPU#0 stuck for 22s! [syz-executor2:2903]
[  124.039236] Modules linked in:
[  124.039711] irq event stamp: 14111350
[  124.040168] hardirqs last  enabled at (14111349): [<ffffffffa3406b6a>] d_walk+0x18a/0xa60
[  124.041330] hardirqs last disabled at (14111350): [<ffffffffa5800964>] interrupt_entry+0xc4/0xe0
[  124.042453] softirqs last  enabled at (433182): [<ffffffffa5a006f6>] __do_softirq+0x6f6/0xa8b
[  124.043551] softirqs last disabled at (433143): [<ffffffffa2d539fb>] irq_exit+0x19b/0x1c0
[  124.044616] CPU: 0 PID: 2903 Comm: syz-executor2 Not tainted 4.17.0-rc1+ #34
[  124.045502] Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS 1.10.2-1ubuntu1 04/01/2014
[  124.046627] RIP: 0010:d_walk+0x12c/0xa60
[  124.047135] RSP: 0018:ffff8800438dfa50 EFLAGS: 00000293 ORIG_RAX: ffffffffffffff13
[  124.048114] RAX: 0000000000000293 RBX: dffffc0000000000 RCX: ffffffffa3406b0a
[  124.049073] RDX: 0000000000000000 RSI: ffff8800438dfc10 RDI: ffff8800438dfae0
[  124.050000] RBP: ffff8800438dfbc8 R08: ffffed000c020c12 R09: ffffed000c020c11
[  124.050796] R10: ffff88006010608b R11: 1ffff1000c020c11 R12: ffffed000871bf85
[  124.051594] R13: ffff8800438dfc50 R14: ffffffffa33fdae0 R15: dffffc0000000000
[  124.052399] FS:  0000000002648940(0000) GS:ffff88006d000000(0000) knlGS:0000000000000000
[  124.053300] CS:  0010 DS: 0000 ES: 0000 CR0: 0000000080050033
[  124.053946] CR2: 0000000002651c18 CR3: 00000000438ce000 CR4: 00000000000006f0
[  124.054744] DR0: 0000000020000100 DR1: 0000000020000100 DR2: 0000000000000000
[  124.055542] DR3: 0000000000000000 DR6: 00000000fffe0ff0 DR7: 0000000000000600
[  124.056342] Call Trace:
[  124.056649]  ? __d_free_external+0x60/0x60
[  124.057131]  ? dget_parent+0x5b0/0x5b0
[  124.057565]  ? shrink_dentry_list+0x416/0x6a0
[  124.058078]  ? is_subdir+0x320/0x320
[  124.058496]  ? shrink_dcache_parent+0xc1/0x210
[  124.059008]  shrink_dcache_parent+0x164/0x210
[  124.059512]  ? path_has_submounts+0x1a0/0x1a0
[  124.060018]  ? down_write+0x91/0x130
[  124.060439]  ? vfs_rmdir+0xd0/0x420
[  124.060862]  vfs_rmdir+0x1cf/0x420
[  124.061266]  do_rmdir+0x3fa/0x5a0
[  124.061663]  ? __ia32_sys_mkdir+0x80/0x80
[  124.062125]  ? exit_to_usermode_loop+0x139/0x1e0
[  124.062657]  ? exit_to_usermode_loop+0x181/0x1e0
[  124.063189]  ? __ia32_compat_sys_getdents+0x4a0/0x4a0
[  124.063764]  ? syscall_slow_exit_work+0x400/0x400
[  124.064303]  ? do_syscall_64+0x8f/0x5d0
[  124.064755]  do_syscall_64+0x148/0x5d0
[  124.065185]  ? syscall_slow_exit_work+0x400/0x400
[  124.065719]  ? syscall_return_slowpath+0x470/0x470
[  124.066307]  ? syscall_return_slowpath+0x2df/0x470
[  124.066925]  ? entry_SYSCALL_64_after_hwframe+0x59/0xbe
[  124.067518]  ? trace_hardirqs_off_thunk+0x1a/0x1c
[  124.068012] watchdog: BUG: soft lockup - CPU#1 stuck for 22s! [syz-executor3:7303]
[  124.068067]  ? entry_SYSCALL_64_after_hwframe+0x49/0xbe
[  124.068785] Modules linked in:
[  124.069398] Code: 
[  124.069690] irq event stamp: 14006166
[  124.069698] hardirqs last  enabled at (14006165): [<ffffffffa3406b6a>] d_walk+0x18a/0xa60
[  124.069936] f8 
[  124.070308] hardirqs last disabled at (14006166): [<ffffffffa5800964>] interrupt_entry+0xc4/0xe0
[  124.070315] softirqs last  enabled at (784694): [<ffffffffa5a006f6>] __do_softirq+0x6f6/0xa8b
[  124.071217] 48 
[  124.071404] softirqs last disabled at (784609): [<ffffffffa2d539fb>] irq_exit+0x19b/0x1c0
[  124.071410] CPU: 1 PID: 7303 Comm: syz-executor3 Not tainted 4.17.0-rc1+ #34
[  124.072394] 89 
[  124.073219] Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS 1.10.2-1ubuntu1 04/01/2014
[  124.073226] RIP: 0010:lock_acquire+0x1f3/0x4a0
[  124.073422] 85 
[  124.074135] RSP: 0018:ffff88006a03f950 EFLAGS: 00000246 ORIG_RAX: ffffffffffffff13
[  124.074856] e8 
[  124.075020] RAX: 0000000000000007 RBX: 1ffff1000d407f2e RCX: 0000000000000000
[  124.075024] RDX: 0000000000000000 RSI: 0000000000000000 RDI: 0000000000000246
[  124.075928] fe 
[  124.076329] RBP: ffff88006c24c540 R08: 0000000000000000 R09: 0000000000000004
[  124.076333] R10: ffff88006c24ce10 R11: 0000000000000001 R12: 0000000000000000
[  124.076525] ff 
[  124.077184] R13: 0000000000000002 R14: 0000000000000000 R15: 0000000000000000
[  124.077189] FS:  00000000019eb940(0000) GS:ffff88006d100000(0000) knlGS:0000000000000000
[  124.077382] ff 
[  124.077998] CS:  0010 DS: 0000 ES: 0000 CR0: 0000000080050033
[  124.078003] CR2: 00007ffd885fff88 CR3: 00000000645ec000 CR4: 00000000000006e0
[  124.078729] e8 
[  124.078895] DR0: 0000000000000000 DR1: 0000000000000000 DR2: 0000000000000000
[  124.079620] 72 
[  124.080248] DR3: 0000000000000000 DR6: 00000000fffe0ff0 DR7: 0000000000000400
[  124.080251] Call Trace:
[  124.080444] 1c 
[  124.081078]  ? lock_downgrade+0x6e0/0x6e0
[  124.081891] c2 
[  124.082063]  ? do_raw_spin_trylock+0x1b0/0x1b0
[  124.082076]  ? mark_held_locks+0xa8/0xf0
[  124.082656] ff 
[  124.083283]  d_walk+0x41b/0xa60
[  124.083468] 48 
[  124.084091]  ? d_walk+0x3ea/0xa60
[  124.084408] 8b 
[  124.085135]  ? __d_free_external+0x60/0x60
[  124.085426] 85 
[  124.085611]  ? dget_parent+0x5b0/0x5b0
[  124.086058] e8 
[  124.086247]  ? shrink_dentry_list+0x416/0x6a0
[  124.086746] fe 
[  124.087139]  ? is_subdir+0x320/0x320
[  124.087348] ff 
[  124.087665]  ? shrink_dcache_parent+0xc1/0x210
[  124.087869] ff 
[  124.088211]  shrink_dcache_parent+0x164/0x210
[  124.088413] c6 
[  124.088866]  ? path_has_submounts+0x1a0/0x1a0
[  124.089083] 00 
[  124.089489]  ? down_write+0x91/0x130
[  124.089724] 04 
[  124.090189]  ? vfs_rmdir+0xd0/0x420
[  124.090205]  vfs_rmdir+0x1cf/0x420
[  124.090411] f6 
[  124.090808]  do_rmdir+0x3fa/0x5a0
[  124.091085] 85 
[  124.091639]  ? __ia32_sys_mkdir+0x80/0x80
[  124.091841] 18 
[  124.092282]  ? exit_to_usermode_loop+0x139/0x1e0
[  124.092486] ff 
[  124.092913]  ? exit_to_usermode_loop+0x181/0x1e0
[  124.093126] ff 
[  124.093476]  ? __ia32_compat_sys_getdents+0x4a0/0x4a0
[  124.093482]  ? syscall_slow_exit_work+0x400/0x400
[  124.093695] ff 
[  124.094044]  ? do_syscall_64+0x8f/0x5d0
[  124.094416] 01 
[  124.094608]  do_syscall_64+0x148/0x5d0
[  124.094983] 0f 
[  124.095169]  ? syscall_slow_exit_work+0x400/0x400
[  124.095622] 85 
[  124.095805]  ? syscall_return_slowpath+0x470/0x470
[  124.096336] ea 
[  124.096561]  ? syscall_return_slowpath+0x2df/0x470
[  124.097132] 00 
[  124.097355]  ? entry_SYSCALL_64_after_hwframe+0x59/0xbe
[  124.097950] 00 
[  124.098512]  ? trace_hardirqs_off_thunk+0x1a/0x1c
[  124.098732] 00 
[  124.099195]  ? entry_SYSCALL_64_after_hwframe+0x49/0xbe
[  124.099412] e8 
[  124.099860] Code: 
[  124.100068] 56 
[  124.100632] ea 
[  124.100861] 1c 
[  124.101334] 03 
[  124.101556] c2 
[  124.102018] 0f b6 
[  124.102247] ff 
[  124.102755] 14 02 
[  124.102985] 9c 
[  124.103446] 48 89 
[  124.103675] 58 
[  124.104190] f8 83 
[  124.104421] <0f> 
[  124.104626] e0 07 
[  124.104855] 1f 
[  124.105034] 83 
[  124.105257] 44 
[  124.105442] c0 
[  124.105669] 00 
[  124.105874] 03 38 
[  124.106105] 00 
[  124.106309] d0 7c 
[  124.106536] 48 
[  124.106739] 08 84 
[  124.106968] 89 
[  124.107173] d2 0f 
[  124.107425] c3 
[  124.107631] 85 3f 
[  124.107874] fa 
[  124.108057] 02 00 
[  124.108297] 66 
[  124.108477] 00 c7 
[  124.108706] 0f 
[  124.108910] 85 2c 
[  124.109140] 1f 
[  124.109344] 08 00 
[  124.109569] 44 
[  124.109773] 00 00 
[  124.110004] 00 
[  124.110210] 00 00 
[  124.110438] 00 
[  124.110641] 00 48 
[  124.110875] e8 
[  124.111089] 8b 
[  124.111309] 90 
[  124.111556] 3c 
[  124.111783] c9 
[  124.112030] 24 
[  124.112250] a6 ff 
[  124.112481] 57 
[  124.112677] ff 
[  124.112899] 9d <0f> 
[  124.115848] 1f 44 00 00 48 b8 00 00 00 00 00 fc ff df 48 01 c3 48 c7 03 
```

## Code

```c
   0:   1c c2                   sbb    al,0xc2
   2:   ff 48 8b                dec    DWORD PTR [rax-0x75]
   5:   85 e8                   test   eax,ebp
   7:   fe                      (bad)  
   8:   ff                      (bad)  
   9:   ff c6                   inc    esi
   b:   00 04 f6                add    BYTE PTR [rsi+rsi*8],al
   e:   85 18                   test   DWORD PTR [rax],ebx
  10:   ff                      (bad)  
  11:   ff                      (bad)  
  12:   ff 01                   inc    DWORD PTR [rcx]
  14:  *0f 85 ea 00 00 00       jne    0x104
  1a:   e8 56 ea 1c 03          call   0x31cea75
  1f:   c2 0f b6                ret    0xb60f
  22:   ff 14 02                call   QWORD PTR [rdx+rax*1]
  25:   9c                      pushf  
  26:   48 89 58 f8             mov    QWORD PTR [rax-0x8],rbx
  2a:   83 0f e0                or     DWORD PTR [rdi],0xffffffe0
  2d:   07                      (bad)  
  2e:   1f                      (bad)  
  2f:   83 44 c0 00 03          add    DWORD PTR [rax+rax*8+0x0],0x3
  34:   38 00                   cmp    BYTE PTR [rax],al
  36:   d0 7c 48 08             sar    BYTE PTR [rax+rcx*2+0x8],1
  3a:   84 89 d2 0f c3 85       test   BYTE PTR [rcx-0x7a3cf02e],cl
  40:   3f                      (bad)  
  41:   fa                      cli    
  42:   02 00                   add    al,BYTE PTR [rax]
  44:   66 00 c7                data16 add bh,al
  47:   0f 85 2c 1f 08 00       jne    0x81f79
  4d:   44 00 00                add    BYTE PTR [rax],r8b
  50:   00 00                   add    BYTE PTR [rax],al
  52:   00 00                   add    BYTE PTR [rax],al
  54:   00 48 e8                add    BYTE PTR [rax-0x18],cl
  57:   8b 90 3c c9 24 a6       mov    edx,DWORD PTR [rax-0x59db36c4]
  5d:   ff 57 ff                call   QWORD PTR [rdi-0x1]
  60:   9d                      popf   
  61:  *0f 1f 44 00 00          nop    DWORD PTR [rax+rax*1+0x0]
  66:   48 b8 00 00 00 00 00    movabs rax,0xdffffc0000000000
  6d:   fc ff df 
  70:   48 01 c3                add    rbx,rax
  73:   48                      rex.W
  74:   c7                      .byte 0xc7
  75:   03                      .byte 0x3
```

looks not good... :(

## LK Source

```c
...
static void shrink_dentry_list(struct list_head *list)
{
	struct dentry *dentry, *parent;

	while (!list_empty(list)) {
		struct inode *inode;
		dentry = list_entry(list->prev, struct dentry, d_lru);
		spin_lock(&dentry->d_lock);
		parent = lock_parent(dentry);

		/*
		 * The dispose list is isolated and dentries are not accounted
		 * to the LRU here, so we can simply remove it from the list
		 * here regardless of whether it is referenced or not.
		 */
		d_shrink_del(dentry);

		/*
		 * We found an inuse dentry which was not removed from
		 * the LRU because of laziness during lookup. Do not free it.
		 */
		if (dentry->d_lockref.count > 0) {
			spin_unlock(&dentry->d_lock);
			if (parent)
				spin_unlock(&parent->d_lock);
			continue;
		}


		if (unlikely(dentry->d_flags & DCACHE_DENTRY_KILLED)) {
			bool can_free = dentry->d_flags & DCACHE_MAY_FREE;
			spin_unlock(&dentry->d_lock);
			if (parent)
				spin_unlock(&parent->d_lock);
			if (can_free)
				dentry_free(dentry);
			continue;
		}

		inode = dentry->d_inode;
		if (inode && unlikely(!spin_trylock(&inode->i_lock))) {
			d_shrink_add(dentry, list);
			spin_unlock(&dentry->d_lock);
			if (parent)
				spin_unlock(&parent->d_lock);
			continue;
		}

		__dentry_kill(dentry);

		/*
		 * We need to prune ancestors too. This is necessary to prevent
		 * quadratic behavior of shrink_dcache_parent(), but is also
		 * expected to be beneficial in reducing dentry cache
		 * fragmentation.
		 */
		dentry = parent;
		while (dentry && !lockref_put_or_lock(&dentry->d_lockref)) {
			parent = lock_parent(dentry);
			if (dentry->d_lockref.count != 1) {
				dentry->d_lockref.count--;
				spin_unlock(&dentry->d_lock);
				if (parent)
					spin_unlock(&parent->d_lock);
				break;
			}
			inode = dentry->d_inode;	/* can't be NULL */
			if (unlikely(!spin_trylock(&inode->i_lock))) {
				spin_unlock(&dentry->d_lock);
				if (parent)
					spin_unlock(&parent->d_lock);
				cpu_relax();
				continue;
			}
			__dentry_kill(dentry);
			dentry = parent;
		}
	}
}
...
/**
 * shrink_dcache_parent - prune dcache
 * @parent: parent of entries to prune
 *
 * Prune the dcache to remove unused children of the parent dentry.
 */
void shrink_dcache_parent(struct dentry *parent)
{
	for (;;) {
		struct select_data data;

		INIT_LIST_HEAD(&data.dispose);
		data.start = parent;
		data.found = 0;

		d_walk(parent, &data, select_collect, NULL);
		if (!data.found)
			break;

		shrink_dentry_list(&data.dispose);
		cond_resched();
	}
}
EXPORT_SYMBOL(shrink_dcache_parent);
...
struct dentry *dget_parent(struct dentry *dentry)
{
	int gotref;
	struct dentry *ret;

	/*
	 * Do optimistic parent lookup without any
	 * locking.
	 */
	rcu_read_lock();
	ret = READ_ONCE(dentry->d_parent);
	gotref = lockref_get_not_zero(&ret->d_lockref);
	rcu_read_unlock();
	if (likely(gotref)) {
		if (likely(ret == READ_ONCE(dentry->d_parent)))
			return ret;
		dput(ret);
	}

repeat:
	/*
	 * Don't need rcu_dereference because we re-check it was correct under
	 * the lock.
	 */
	rcu_read_lock();
	ret = dentry->d_parent;
	spin_lock(&ret->d_lock);
	if (unlikely(ret != dentry->d_parent)) {
		spin_unlock(&ret->d_lock);
		rcu_read_unlock();
		goto repeat;
	}
	rcu_read_unlock();
	BUG_ON(!ret->d_lockref.count);
	ret->d_lockref.count++;
	spin_unlock(&ret->d_lock);
	return ret;
}
EXPORT_SYMBOL(dget_parent);
...
```

I'll comment later about the codes...


**End**
