---
title: Linux Kernel - 2018-04-3 Founds
date: 2018-04-21
update: 2018-04-23
tags:
  - Security
  - Linux-Kernel
keywords:
  - 0-day
  - Bug
---

## __sctp_v6_cmp_addr - slab out of bounds Read

Found in *LK v4.17.0-rc1*. 

slab-out-of-bounds in __sctp_v6_cmp_addr, 8 bytes read.

### Demo Log

```c
zero@zer0day:/tmp$ gcc -o poc poc.c
zero@zer0day:/tmp$ ./poc
[   53.074578] ==================================================================
[   53.077133] BUG: KASAN: slab-out-of-bounds in __sctp_v6_cmp_addr+0x3e4/0x440
[   53.079233] Read of size 8 at addr ffff880066c03530 by task poc/2777
[   53.081111] 
[   53.081589] CPU: 1 PID: 2777 Comm: poc Not tainted 4.17.0-rc1+ #34
[   53.083186] Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS 1.10.2-1ubuntu1 04/01/2014
[   53.085896] Call Trace:
[   53.086652]  dump_stack+0x11b/0x1fd
[   53.087714]  ? dump_stack_print_info.cold.0+0x81/0x81
[   53.089250]  ? kmsg_dump_rewind_nolock+0xd9/0xd9
[   53.090597]  ? sctp_bind_addr_conflict+0xf5/0x450
[   53.091913]  print_address_description+0x60/0x255
[   53.093161]  kasan_report+0x196/0x2a0
[   53.094020]  ? __sctp_v6_cmp_addr+0x3e4/0x440
[   53.095031]  ? __sctp_v6_cmp_addr+0x3e4/0x440
[   53.096037]  ? sctp_inet6_cmp_addr+0x12c/0x170
[   53.097070]  ? sctp_bind_addr_conflict+0x25c/0x450
[   53.098160]  ? sctp_bind_addr_match+0x3b0/0x3b0
[   53.099339]  ? sctp_get_port_local+0x884/0x1320
[   53.100532]  ? sctp_set_owner_w+0x4f0/0x4f0
[   53.101680]  ? rcu_is_watching+0x81/0x130
[   53.102749]  ? inet_addr_type+0x250/0x360
[   53.103853]  ? sctp_bind_addr_match+0x280/0x3b0
[   53.105093]  ? sctp_bind_addrs_to_raw+0x310/0x310
[   53.106378]  ? sctp_v4_available+0xee/0x1c0
[   53.107552]  ? sctp_do_bind+0x259/0x680
[   53.108612]  ? sctp_bindx_add+0x93/0x1b0
[   53.109767]  ? sctp_setsockopt_bindx+0x16c/0x2e0
[   53.111023]  ? sctp_setsockopt+0x251b/0x61d0
[   53.112119]  ? __lock_acquire+0x9f2/0x4840
[   53.112977]  ? sctp_setsockopt_paddr_thresholds+0x4e0/0x4e0
[   53.114445]  ? unwind_next_frame+0x11c2/0x1d10
[   53.115618]  ? __save_stack_trace+0x59/0xf0
[   53.116740]  ? debug_check_no_locks_freed+0x210/0x210
[   53.118064]  ? do_syscall_64+0x148/0x5d0
[   53.119163]  ? unwind_next_frame+0x286/0x1d10
[   53.120400]  ? __x64_sys_socket+0x6f/0xb0
[   53.121504]  ? deref_stack_reg+0x110/0x110
[   53.122664]  ? find_held_lock+0x32/0x1b0
[   53.123787]  ? __save_stack_trace+0x7d/0xf0
[   53.124999]  ? do_syscall_64+0x148/0x5d0
[   53.126094]  ? save_stack+0x89/0xb0
[   53.127069]  ? kasan_kmalloc+0xbf/0xe0
[   53.128071]  ? kmem_cache_alloc+0xf0/0x2b0
[   53.129086]  ? selinux_file_alloc_security+0xa9/0x180
[   53.130808]  ? security_file_alloc+0x42/0x90
[   53.132377]  ? get_empty_filp+0x194/0x4e0
[   53.133657]  ? alloc_file+0x24/0x3a0
[   53.135352]  ? sock_alloc_file+0x1f5/0x4c0
[   53.136794]  ? __sys_socket+0x136/0x1f0
[   53.138026]  ? __x64_sys_socket+0x6f/0xb0
[   53.139260]  ? do_syscall_64+0x148/0x5d0
[   53.140431]  ? create_object+0x7b2/0xb40
[   53.141664]  ? start_scan_thread+0x70/0x70
[   53.142866]  ? selinux_file_alloc_security+0xa9/0x180
[   53.144341]  ? debug_mutex_init+0x17/0x60
[   53.145512]  ? save_trace+0x300/0x300
[   53.146648]  ? debug_mutex_init+0x28/0x60
[   53.147752]  ? __mutex_init+0x1e0/0x260
[   53.148740]  ? housekeeping_affine+0x20/0x20
[   53.149854]  ? find_held_lock+0x32/0x1b0
[   53.150944]  ? __fd_install+0x267/0x6e0
[   53.152013]  ? lock_acquire+0x4a0/0x4a0
[   53.153035]  ? lock_downgrade+0x6e0/0x6e0
[   53.154083]  ? rcu_is_watching+0x81/0x130
[   53.155140]  ? sock_has_perm+0x275/0x370
[   53.156171]  ? selinux_secmark_relabel_packet+0xc0/0xc0
[   53.157567]  ? fget_raw+0x20/0x20
[   53.158481]  ? selinux_netlbl_socket_setsockopt+0xf1/0x430
[   53.159909]  ? selinux_netlbl_sock_rcv_skb+0x600/0x600
[   53.161257]  ? selinux_socket_setsockopt+0x5d/0x70
[   53.162504]  ? __sys_setsockopt+0x160/0x340
[   53.163592]  ? kernel_accept+0x2f0/0x2f0
[   53.164657]  ? __sys_socket+0x156/0x1f0
[   53.165680]  ? lock_acquire+0x4a0/0x4a0
[   53.166683]  ? __x64_sys_setsockopt+0xba/0x150
[   53.167834]  ? do_syscall_64+0x148/0x5d0
[   53.168834]  ? syscall_return_slowpath+0x470/0x470
[   53.170045]  ? syscall_return_slowpath+0x2df/0x470
[   53.171320]  ? prepare_exit_to_usermode+0x330/0x330
[   53.172597]  ? entry_SYSCALL_64_after_hwframe+0x59/0xbe
[   53.174020]  ? trace_hardirqs_off_thunk+0x1a/0x1c
[   53.175280]  ? entry_SYSCALL_64_after_hwframe+0x49/0xbe
[   53.176729] 
[   53.177195] Allocated by task 2777:
[   53.178120]  kasan_kmalloc+0xbf/0xe0
[   53.179056]  __kmalloc_node+0x14a/0x4a0
[   53.180062]  kvmalloc_node+0xa2/0xe0
[   53.181051]  vmemdup_user+0x28/0x90
[   53.181992]  sctp_setsockopt_bindx+0x5b/0x2e0
[   53.183087]  sctp_setsockopt+0x251b/0x61d0
[   53.184136] 
[   53.184542] Freed by task 1186:
[   53.185433]  __kasan_slab_free+0x125/0x170
[   53.186504]  kfree+0x10c/0x360
[   53.187290] 
[   53.187714] The buggy address belongs to the object at ffff880066c03520
[   53.187714]  which belongs to the cache kmalloc-16 of size 16
[   53.190837] The buggy address is located 0 bytes to the right of
[   53.190837]  16-byte region [ffff880066c03520, ffff880066c03530)
[   53.193987] The buggy address belongs to the page:
[   53.195253] page:ffffea00019b0080 count:1 mapcount:0 mapping:0000000000000000 index:0x0 compound_mapcount: 0
[   53.197773] flags: 0x100000000008100(slab|head)
[   53.198972] raw: 0100000000008100 0000000000000000 0000000000000000 0000000100160016
[   53.200961] raw: ffffea000199d8a0 ffff880066c004a0 ffff880066c0fa00 0000000000000000
[   53.202891] page dumped because: kasan: bad access detected
[   53.204040] 
[   53.204407] Memory state around the buggy address:
[   53.205733]  ffff880066c03400: fc fc fc fc fc fc fc fc fc fc fc fc fc fc fc fc
[   53.208193]  ffff880066c03480: fc fc fc fc fc fc fc fc fc fc fc fc fc fc fc fc
[   53.210926] >ffff880066c03500: fc fc fc fc 00 00 fc fc fc fc fc fc fc fc fc fc
[   53.213639]                                      ^
[   53.215473]  ffff880066c03580: fc fc fc fc fc fc fc fc fc fc fc fc fc fc fc fc
[   53.218217]  ffff880066c03600: fc fc fc fc fc fc fc fc fc fc fc fc fc fc fc fc
[   53.220957] ==================================================================
[   53.223428] Disabling lock debugging due to kernel taint

Message from syslogd@zer0day at Apr 21 11:06:20 ...
 kernel:[   53.195253] page:ffffea00019b0080 count:1 mapcount:0 mapping:0000000000000000 index:0x0 compound_mapcount: 0

Message from syslogd@zer0day at Apr 21 11:06:20 ...
 kernel:[   53.197773] flags: 0x100000000008100(slab|head)

zero@zer0day:/tmp$ uname -a
Linux zer0day 4.17.0-rc1+ #34 SMP Sat Apr 21 17:01:13 KST 2018 x86_64 GNU/Linux
```

**End**



## shrink_dcache_parent - soft lockup

Got from syzkaller & Found in LK v4.17.0-rc1.

Similar symptom [prev ver patch](https://patchwork.kernel.org/patch/4245861/)

### Call Trace (Dump)

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

### Code

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

### Source

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




## unregister_netdevice - waiting for DEV to become free

Got from syzkaller & Found in LK v4.17.0-rc1.

### Call Trace (Dump)

```c
...
[  292.993864] unregister_netdevice: waiting for lo to become free. Usage count = 5
...
```

## ata_scsi_queuecmd - soft lockup

Got from syzkaller & Found in LK v4.17.0-rc1.

### Call Trace (Dump)

```c
...
watchdog: BUG: soft lockup - CPU#0 stuck for 22s! [kworker/0:1:23]
Modules linked in:
irq event stamp: 223171
hardirqs last  enabled at (223170): [<ffffffff9c92d7a6>] __raw_spin_unlock_irqrestore include/linux/spinlock_api_smp.h:160 [inline]
hardirqs last  enabled at (223170): [<ffffffff9c92d7a6>] _raw_spin_unlock_irqrestore+0x46/0x60 kernel/locking/spinlock.c:184
hardirqs last disabled at (223171): [<ffffffff9ca00964>] interrupt_entry+0xc4/0xe0 arch/x86/entry/entry_64.S:625
softirqs last  enabled at (223104): [<ffffffff9cc006f6>] __do_softirq+0x6f6/0xa8b kernel/softirq.c:311
softirqs last disabled at (223133): [<ffffffff99f539fb>] invoke_softirq kernel/softirq.c:365 [inline]
softirqs last disabled at (223133): [<ffffffff99f539fb>] irq_exit+0x19b/0x1c0 kernel/softirq.c:405
CPU: 0 PID: 23 Comm: kworker/0:1 Not tainted 4.17.0-rc1+ #34
Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS 1.10.2-1ubuntu1 04/01/2014
Workqueue: events e1000_watchdog
RIP: 0010:arch_local_irq_restore arch/x86/include/asm/paravirt.h:783 [inline]
RIP: 0010:__raw_spin_unlock_irqrestore include/linux/spinlock_api_smp.h:160 [inline]
RIP: 0010:_raw_spin_unlock_irqrestore+0x4b/0x60 kernel/locking/spinlock.c:184
RSP: 0018:ffff88006d006bd8 EFLAGS: 00000246 ORIG_RAX: ffffffffffffff13
RAX: 0000000000000007 RBX: 0000000000000246 RCX: 0000000000000000
RDX: 0000000000000000 RSI: 0000000000000000 RDI: 0000000000000246
RBP: ffff880064c1b2a8 R08: ffffed000c983656 R09: ffff88006c074db8
R10: 0000000000000000 R11: 0000000000000000 R12: ffffffff9b6faf30
R13: ffff880064e58000 R14: 000000000000000a R15: ffff880064e58010
FS:  0000000000000000(0000) GS:ffff88006d000000(0000) knlGS:0000000000000000
CS:  0010 DS: 0000 ES: 0000 CR0: 0000000080050033
CR2: 0000000000a0e0f8 CR3: 00000000676c0000 CR4: 00000000000006f0
DR0: 0000000000000000 DR1: 0000000000000000 DR2: 0000000000000000
DR3: 0000000000000000 DR6: 00000000fffe0ff0 DR7: 0000000000000400
Call Trace:
 <IRQ>
 spin_unlock_irqrestore include/linux/spinlock.h:365 [inline]
 ata_scsi_queuecmd+0x2d7/0x690 drivers/ata/libata-scsi.c:4389
 scsi_dispatch_cmd+0x390/0xb10 drivers/scsi/scsi_lib.c:1761
 scsi_request_fn+0xba0/0x1be0 drivers/scsi/scsi_lib.c:1899
 </IRQ>
watchdog: BUG: soft lockup - CPU#1 stuck for 23s! [logrotate:2850]
Modules linked in:
irq event stamp: 253398
hardirqs last  enabled at (253397): [<ffffffff9ca00a60>] restore_regs_and_return_to_kernel+0x0/0x30
hardirqs last disabled at (253398): [<ffffffff9ca00964>] interrupt_entry+0xc4/0xe0 arch/x86/entry/entry_64.S:625
softirqs last  enabled at (253396): [<ffffffff9cc006f6>] __do_softirq+0x6f6/0xa8b kernel/softirq.c:311
softirqs last disabled at (253389): [<ffffffff99f539fb>] invoke_softirq kernel/softirq.c:365 [inline]
softirqs last disabled at (253389): [<ffffffff99f539fb>] irq_exit+0x19b/0x1c0 kernel/softirq.c:405
CPU: 1 PID: 2850 Comm: logrotate Not tainted 4.17.0-rc1+ #34
Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS 1.10.2-1ubuntu1 04/01/2014
RIP: 0010:rep_nop arch/x86/include/asm/processor.h:667 [inline]
RIP: 0010:cpu_relax arch/x86/include/asm/processor.h:672 [inline]
RIP: 0010:csd_lock_wait kernel/smp.c:108 [inline]
RIP: 0010:smp_call_function_single+0x3b8/0x510 kernel/smp.c:302
RSP: 0018:ffff8800625cf4c0 EFLAGS: 00000293
 ORIG_RAX: ffffffffffffff13
RAX: ffff880066781740 RBX: ffff8800625cf538 RCX: ffffffff9a17e0e6
RDX: 0000000000000000 RSI: 0000000000000000 RDI: ffff8800625cf538
RBP: ffff8800625cf620 R08: ffffed000da05791 R09: ffff880066781f90
Code: 
R10: 0000000000000000 R11: 0000000000000000 R12: 0000000000000001
R13: dffffc0000000000 R14: 0000000000000000 R15: ffffed000c4b9eb4
51 
FS:  00007faffc8de7a0(0000) GS:ffff88006d100000(0000) knlGS:0000000000000000
76 fd 
CS:  0010 DS: 0000 ES: 0000 CR0: 0000000080050033
CR2: 00007faffc8e3000 CR3: 00000000676c0000 CR4: 00000000000006e0
f6 c7 
DR0: 0000000000000000 DR1: 0000000000000000 DR2: 0000000000000000
02 75 
DR3: 0000000000000000 DR6: 00000000fffe0ff0 DR7: 0000000000000400
Call Trace:
19 48 
89 
df 
57 
9d 0f 
1f 44 
 smp_call_function_many+0x6b0/0x820 kernel/smp.c:434
00 00 
e8 19 
5d 74 
fd 65 
ff 0d 
 native_flush_tlb_others+0xec/0x620 arch/x86/mm/tlb.c:595
72 06 
6f 63 
5b 5d 
c3 
e8 ea 
e8 
74 
 flush_tlb_others arch/x86/include/asm/paravirt.h:309 [inline]
 flush_tlb_mm_range+0x255/0x400 arch/x86/mm/tlb.c:644
fd 48 
89 df 
57 9d 
<0f> 1f 
44 
00 00 
 tlb_flush_mmu_tlbonly+0x277/0x430 mm/memory.c:246
eb 
e5 
 tlb_flush_mmu mm/memory.c:267 [inline]
 arch_tlb_finish_mmu+0x97/0x140 mm/memory.c:283
0f 
 tlb_finish_mmu+0x119/0x1c0 mm/memory.c:433
1f 
40 00 
66 
 unmap_region+0x382/0x4e0 mm/mmap.c:2532
2e 0f 
1f 84 
00 00 
00 
00 00 
 do_munmap+0x50a/0xd50 mm/mmap.c:2744
 vm_munmap+0x102/0x180 mm/mmap.c:2763
 __do_sys_munmap mm/mmap.c:2773 [inline]
 __se_sys_munmap mm/mmap.c:2770 [inline]
 __x64_sys_munmap+0x5b/0x70 mm/mmap.c:2770
 do_syscall_64+0x148/0x5d0 arch/x86/entry/common.c:287
Code: 00 00 fc ff df 44 89 bc 24 e0 00 00 00 48 c1 e8 03 4c 01 e8 41 83 e7 01 c6 00 f8 74 53 49 89 c7 48 83 c3 18 e8 7a a6 0a 00 f3 90 <48> 89 da 41 c6 07 04 48 c1 ea 03 42 0f b6 14 2a 84 d2 74 09 80 
```

I'll update a post later...

**End**


## d_walk - soft lockup

Got from syzkaller & Found in LK v4.17.0-rc1.

### Call Trace (Dump)

```c
watchdog: BUG: soft lockup - CPU#1 stuck for 22s! [syz-executor4:7810]
Modules linked in:
irq event stamp: 13333674
hardirqs last  enabled at (13333673): [<ffffffff83e06b6a>] seqcount_lockdep_reader_access include/linux/seqlock.h:83 [inline]
hardirqs last  enabled at (13333673): [<ffffffff83e06b6a>] read_seqcount_begin include/linux/seqlock.h:164 [inline]
hardirqs last  enabled at (13333673): [<ffffffff83e06b6a>] read_seqbegin include/linux/seqlock.h:433 [inline]
hardirqs last  enabled at (13333673): [<ffffffff83e06b6a>] read_seqbegin_or_lock include/linux/seqlock.h:529 [inline]
hardirqs last  enabled at (13333673): [<ffffffff83e06b6a>] d_walk+0x18a/0xa60 fs/dcache.c:1248
hardirqs last disabled at (13333674): [<ffffffff86200964>] interrupt_entry+0xc4/0xe0 arch/x86/entry/entry_64.S:625
softirqs last  enabled at (2250648): [<ffffffff864006f6>] __do_softirq+0x6f6/0xa8b kernel/softirq.c:311
softirqs last disabled at (2250639): [<ffffffff837539fb>] invoke_softirq kernel/softirq.c:365 [inline]
softirqs last disabled at (2250639): [<ffffffff837539fb>] irq_exit+0x19b/0x1c0 kernel/softirq.c:405
CPU: 1 PID: 7810 Comm: syz-executor4 Not tainted 4.17.0-rc1+ #34
Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS 1.10.2-1ubuntu1 04/01/2014
RIP: 0010:arch_local_irq_restore arch/x86/include/asm/paravirt.h:783 [inline]
RIP: 0010:lock_acquire+0x1f3/0x4a0 kernel/locking/lockdep.c:3923
RSP: 0018:ffff88003fd7f940 EFLAGS: 00000246 ORIG_RAX: ffffffffffffff13
RAX: 0000000000000007 RBX: 1ffff10007faff2c RCX: 0000000000000000
RDX: 0000000000000000 RSI: 0000000000000000 RDI: 0000000000000246
RBP: ffff88003957ae40 R08: 0000000000000003 R09: ffffffff881d38e0
R10: ffff88003957b710 R11: 0000000000000001 R12: 0000000000000000
R13: 0000000000000000 R14: 0000000000000001 R15: 0000000000000000
FS:  0000000001688940(0000) GS:ffff88006d100000(0000) knlGS:0000000000000000
CS:  0010 DS: 0000 ES: 0000 CR0: 0000000080050033
CR2: 00007ffc28f88e84 CR3: 000000003fd72000 CR4: 00000000000006e0
DR0: 0000000020000100 DR1: 0000000020000100 DR2: 0000000000000000
DR3: 0000000000000000 DR6: 00000000fffe0ff0 DR7: 0000000000000600
Call Trace:
 _raw_spin_lock_nested+0x25/0x30 kernel/locking/spinlock.c:354
 d_walk+0x359/0xa60 fs/dcache.c:1274
 shrink_dcache_parent+0x164/0x210 fs/dcache.c:1486
 vfs_rmdir+0x1cf/0x420 fs/namei.c:3850
 do_rmdir+0x3fa/0x5a0 fs/namei.c:3911
 do_syscall_64+0x148/0x5d0 arch/x86/entry/common.c:287
Code: ea 03 0f b6 14 02 48 89 f8 83 e0 07 83 c0 03 38 d0 7c 08 84 d2 0f 85 3f 02 00 00 c7 85 2c 08 00 00 00 00 00 00 48 8b 3c 24 57 9d <0f> 1f 44 00 00 48 b8 00 00 00 00 00 fc ff df 48 01 c3 48 c7 03 
watchdog: BUG: soft lockup - CPU#0 stuck for 22s! [syz-executor1:2869]
Modules linked in:
irq event stamp: 15849430
hardirqs last  enabled at (15849429): [<ffffffff83e06b6a>] seqcount_lockdep_reader_access include/linux/seqlock.h:83 [inline]
hardirqs last  enabled at (15849429): [<ffffffff83e06b6a>] read_seqcount_begin include/linux/seqlock.h:164 [inline]
hardirqs last  enabled at (15849429): [<ffffffff83e06b6a>] read_seqbegin include/linux/seqlock.h:433 [inline]
hardirqs last  enabled at (15849429): [<ffffffff83e06b6a>] read_seqbegin_or_lock include/linux/seqlock.h:529 [inline]
hardirqs last  enabled at (15849429): [<ffffffff83e06b6a>] d_walk+0x18a/0xa60 fs/dcache.c:1248
hardirqs last disabled at (15849430): [<ffffffff86200964>] interrupt_entry+0xc4/0xe0 arch/x86/entry/entry_64.S:625
softirqs last  enabled at (2389822): [<ffffffff864006f6>] __do_softirq+0x6f6/0xa8b kernel/softirq.c:311
softirqs last disabled at (2389715): [<ffffffff837539fb>] invoke_softirq kernel/softirq.c:365 [inline]
softirqs last disabled at (2389715): [<ffffffff837539fb>] irq_exit+0x19b/0x1c0 kernel/softirq.c:405
CPU: 0 PID: 2869 Comm: syz-executor1 Tainted: G             L    4.17.0-rc1+ #34
Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS 1.10.2-1ubuntu1 04/01/2014
RIP: 0010:__sanitizer_cov_trace_pc+0x0/0x50 kernel/kcov.c:146
RSP: 0018:ffff8800444d7a48 EFLAGS: 00000297 ORIG_RAX: ffffffffffffff13
RAX: 0000000000000000 RBX: ffff8800628d1c78 RCX: 0000000000000000
RDX: 0000000000000000 RSI: ffff8800628d1b88 RDI: ffff8800444d7c28
RBP: ffff8800444d7bc8 R08: ffffed000c51a382 R09: ffffed000c51a381
R10: ffff8800628d1c0b R11: 1ffff1000c51a381 R12: ffff8800628d1c08
R13: ffffed000889af6c R14: ffff8800628d0d78 R15: dffffc0000000000
FS:  000000000173a940(0000) GS:ffff88006d000000(0000) knlGS:0000000000000000
CS:  0010 DS: 0000 ES: 0000 CR0: 0000000080050033
CR2: 0000000001743c18 CR3: 0000000045180000 CR4: 00000000000006f0
DR0: 0000000020000100 DR1: 0000000020000100 DR2: 0000000000000000
DR3: 0000000000000000 DR6: 00000000fffe0ff0 DR7: 0000000000000600
Call Trace:
 d_walk+0x38c/0xa60 fs/dcache.c:1291
 shrink_dcache_parent+0x164/0x210 fs/dcache.c:1486
 vfs_rmdir+0x1cf/0x420 fs/namei.c:3850
 do_rmdir+0x3fa/0x5a0 fs/namei.c:3911
 do_syscall_64+0x148/0x5d0 arch/x86/entry/common.c:287
Code: 83 c1 01 4a 89 7c 10 e0 4a 89 74 10 e8 4a 89 54 10 f0 4a 89 4c d8 20 4c 89 08 f3 c3 0f 1f 44 00 00 66 2e 0f 1f 84 00 00 00 00 00 <65> 48 8b 04 25 80 de 01 00 65 8b 15 a0 56 5f 7c 81 e2 00 01 1f 
```

I'll update post later...

**End**__



## e1000_update_stats - soft lockup

Got from syzkaller & Found in LK v4.17.0-rc1.

### Call Trace (Dump)

```c
watchdog: BUG: soft lockup - CPU#0 stuck for 22s! [kworker/0:1:24]
Modules linked in:
irq event stamp: 22544
hardirqs last  enabled at (22543): [<ffffffff90a00a60>] restore_regs_and_return_to_kernel+0x0/0x30
hardirqs last disabled at (22544): [<ffffffff90a00964>] interrupt_entry+0xc4/0xe0 arch/x86/entry/entry_64.S:625
softirqs last  enabled at (22532): [<ffffffff8fe4cc31>] neigh_periodic_work+0x6b1/0xa90 net/core/neighbour.c:862
softirqs last disabled at (22528): [<ffffffff8fe4c65b>] neigh_periodic_work+0xdb/0xa90 net/core/neighbour.c:794
CPU: 0 PID: 24 Comm: kworker/0:1 Not tainted 4.17.0-rc1+ #34
Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS 1.10.2-1ubuntu1 04/01/2014
Workqueue: events e1000_watchdog
RIP: 0010:arch_local_irq_restore arch/x86/include/asm/paravirt.h:783 [inline]
RIP: 0010:__raw_spin_unlock_irqrestore include/linux/spinlock_api_smp.h:160 [inline]
RIP: 0010:_raw_spin_unlock_irqrestore+0x4b/0x60 kernel/locking/spinlock.c:184
RSP: 0018:ffff88006c13f4c0 EFLAGS: 00000293 ORIG_RAX: ffffffffffffff13
RAX: 0000000000000007 RBX: 0000000000000293 RCX: 0000000000000000
RDX: 0000000000000000 RSI: 0000000000000000 RDI: 0000000000000293
RBP: ffff880066e82de0 R08: ffffed000cdd05bd R09: ffff88006c0736b8
R10: 0000000000000000 R11: 0000000000000000 R12: 0000000000000000
R13: ffff880066e82bc0 R14: ffff880066e82fb8 R15: ffff880066e82180
FS:  0000000000000000(0000) GS:ffff88006d000000(0000) knlGS:0000000000000000
CS:  0010 DS: 0000 ES: 0000 CR0: 0000000080050033
CR2: 00007f4393533000 CR3: 0000000061aec000 CR4: 00000000000006f0
DR0: 0000000000000000 DR1: 0000000000000000 DR2: 0000000000000000
DR3: 0000000000000000 DR6: 00000000fffe0ff0 DR7: 0000000000000400
Call Trace:
 spin_unlock_irqrestore include/linux/spinlock.h:365 [inline]
 e1000_update_stats+0x13ed/0x1d60 drivers/net/ethernet/intel/e1000/e1000_main.c:3768
 e1000_watchdog+0x335/0x11a0 drivers/net/ethernet/intel/e1000/e1000_main.c:2521
Code: 51 76 fd f6 c7 02 75 19 48 89 df 57 9d 0f 1f 44 00 00 e8 19 5d 74 fd 65 ff 0d 72 06 6f 6f 5b 5d c3 e8 ea e8 74 fd 48 89 df 57 9d <0f> 1f 44 00 00 eb e5 0f 1f 40 00 66 2e 0f 1f 84 00 00 00 00 00 
watchdog: BUG: soft lockup - CPU#0 stuck for 21s! [kworker/0:1:24]
Modules linked in:
irq event stamp: 22987
hardirqs last  enabled at (22986): [<ffffffff90a00a60>] restore_regs_and_return_to_kernel+0x0/0x30
hardirqs last disabled at (22987): [<ffffffff90a00964>] interrupt_entry+0xc4/0xe0 arch/x86/entry/entry_64.S:625
softirqs last  enabled at (22958): [<ffffffff90c006f6>] __do_softirq+0x6f6/0xa8b kernel/softirq.c:311
softirqs last disabled at (22979): [<ffffffff8df539fb>] invoke_softirq kernel/softirq.c:365 [inline]
softirqs last disabled at (22979): [<ffffffff8df539fb>] irq_exit+0x19b/0x1c0 kernel/softirq.c:405
CPU: 0 PID: 24 Comm: kworker/0:1 Tainted: G             L    4.17.0-rc1+ #34
Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS 1.10.2-1ubuntu1 04/01/2014
Workqueue: events e1000_watchdog
RIP: 0010:arch_local_irq_enable arch/x86/include/asm/paravirt.h:793 [inline]
RIP: 0010:__do_softirq+0x26c/0xa8b kernel/softirq.c:269
RSP: 0018:ffff88006d007cb0 EFLAGS: 00000246 ORIG_RAX: ffffffffffffff13
RAX: 0000000000000007 RBX: ffff88006c072e40 RCX: 0000000000000000
RDX: 0000000000000000 RSI: 0000000000000000 RDI: ffff88006c07366c
RBP: 1ffff1000da00fe1 R08: 0000000000000000 R09: ffff88006c0736b8
R10: 0000000000000000 R11: 0000000000000000 R12: 0000000000000000
R13: 0000000000000282 R14: 0000000000000000 R15: dffffc0000000000
FS:  0000000000000000(0000) GS:ffff88006d000000(0000) knlGS:0000000000000000
CS:  0010 DS: 0000 ES: 0000 CR0: 0000000080050033
CR2: 000000c42ac0b140 CR3: 000000001ec22000 CR4: 00000000000006f0
DR0: 0000000000000000 DR1: 0000000000000000 DR2: 0000000000000000
DR3: 0000000000000000 DR6: 00000000fffe0ff0 DR7: 0000000000000400
Call Trace:
 <IRQ>
 invoke_softirq kernel/softirq.c:365 [inline]
 irq_exit+0x19b/0x1c0 kernel/softirq.c:405
 exiting_irq arch/x86/include/asm/apic.h:525 [inline]
 smp_apic_timer_interrupt+0x162/0x6d0 arch/x86/kernel/apic/apic.c:1052
 apic_timer_interrupt+0xf/0x20 arch/x86/entry/entry_64.S:863
 </IRQ>
RIP: 0010:arch_local_irq_restore arch/x86/include/asm/paravirt.h:783 [inline]
RIP: 0010:__raw_spin_unlock_irqrestore include/linux/spinlock_api_smp.h:160 [inline]
RIP: 0010:_raw_spin_unlock_irqrestore+0x4b/0x60 kernel/locking/spinlock.c:184
RSP: 0018:ffff88006c13f4c0 EFLAGS: 00000293 ORIG_RAX: ffffffffffffff13
RAX: 0000000000000007 RBX: 0000000000000293 RCX: 0000000000000000
RDX: 0000000000000000 RSI: 0000000000000000 RDI: 0000000000000293
RBP: ffff880066e82de0 R08: ffffed000cdd05bd R09: ffff88006c0736b8
R10: 0000000000000000 R11: 0000000000000000 R12: 0000000000000000
R13: ffff880066e82bc0 R14: ffff880066e82fb8 R15: ffff880066e82180
 spin_unlock_irqrestore include/linux/spinlock.h:365 [inline]
 e1000_update_stats+0x13ed/0x1d60 drivers/net/ethernet/intel/e1000/e1000_main.c:3768
 e1000_watchdog+0x335/0x11a0 drivers/net/ethernet/intel/e1000/e1000_main.c:2521
Code: 34 0a 00 00 00 48 c1 e8 03 4c 01 f8 48 89 44 24 20 48 c7 c0 80 a2 02 00 65 c7 00 00 00 00 00 e8 2b be 47 fd fb 66 0f 1f 44 00 00 <b8> ff ff ff ff 48 c7 44 24 08 00 91 80 91 41 0f bc c5 83 c0 01 
...
**********************************************************
**   NOTICE NOTICE NOTICE NOTICE NOTICE NOTICE NOTICE   **
**                                                      **
** trace_printk() being used. Allocating extra memory.  **
**                                                      **
** This means that this is a DEBUG kernel and it is     **
** unsafe for production use.                           **
**                                                      **
** If you see this message and you are not debugging    **
** the kernel, report this immediately to your vendor!  **
**                                                      **
**   NOTICE NOTICE NOTICE NOTICE NOTICE NOTICE NOTICE   **
**********************************************************
...
```

I'll update a post later...

**End**



## hpet_open - soft lockup

Got from syzkaller & Found in LK v4.17.0-rc1.

### Call Trace (Dump)

```c
hrtimer: interrupt took 3048710 ns
watchdog: BUG: soft lockup - CPU#1 stuck for 28s! [syz-fuzzer:2773]
Modules linked in:
irq event stamp: 161094
hardirqs last  enabled at (161093): [<ffffffffb6f2d744>] __raw_spin_unlock_irq include/linux/spinlock_api_smp.h:168 [inline]
hardirqs last  enabled at (161093): [<ffffffffb6f2d744>] _raw_spin_unlock_irq+0x24/0x40 kernel/locking/spinlock.c:192
hardirqs last disabled at (161094): [<ffffffffb7000964>] interrupt_entry+0xc4/0xe0 arch/x86/entry/entry_64.S:625
softirqs last  enabled at (160916): [<ffffffffb72006f6>] __do_softirq+0x6f6/0xa8b kernel/softirq.c:311
softirqs last disabled at (160899): [<ffffffffb45539fb>] invoke_softirq kernel/softirq.c:365 [inline]
softirqs last disabled at (160899): [<ffffffffb45539fb>] irq_exit+0x19b/0x1c0 kernel/softirq.c:405
CPU: 1 PID: 2773 Comm: syz-fuzzer Not tainted 4.17.0-rc1+ #34
Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS 1.10.2-1ubuntu1 04/01/2014
RIP: 0010:arch_local_irq_enable arch/x86/include/asm/paravirt.h:793 [inline]
RIP: 0010:__raw_spin_unlock_irq include/linux/spinlock_api_smp.h:168 [inline]
RIP: 0010:_raw_spin_unlock_irq+0x2b/0x40 kernel/locking/spinlock.c:192
RSP: 0018:ffff880064fff728 EFLAGS: 00000246 ORIG_RAX: ffffffffffffff13
RAX: 0000000000000007 RBX: ffffffffb8103620 RCX: 0000000000000000
RDX: 0000000000000000 RSI: 0000000000000000 RDI: ffff8800699bcd6c
RBP: 0000000000000032 R08: fffffbfff70206c5 R09: ffff8800699bcd90
R10: 0000000000000000 R11: 0000000000000000 R12: ffff880064fff778
R13: 0000000000000032 R14: 0000000000000000 R15: 0000000000000002
FS:  000000c4202eb868(0000) GS:ffff88006d100000(0000) knlGS:0000000000000000
CS:  0010 DS: 0000 ES: 0000 CR0: 0000000080050033
CR2: 000000c42bb4e0d0 CR3: 000000006bf92000 CR4: 00000000000006e0
DR0: 0000000000000000 DR1: 0000000000000000 DR2: 0000000000000000
DR3: 0000000000000000 DR6: 00000000fffe0ff0 DR7: 0000000000000400
Call Trace:
 spin_unlock_irq include/linux/spinlock.h:360 [inline]
 hpet_timer_set_irq drivers/char/hpet.c:221 [inline]
 hpet_open+0x33d/0x710 drivers/char/hpet.c:293
 misc_open+0x35f/0x4d0 drivers/char/misc.c:154
 chrdev_open+0x21f/0x6b0 fs/char_dev.c:417
 do_dentry_open+0x65c/0xe70 fs/open.c:784
 vfs_open+0x11c/0x200 fs/open.c:906
 do_last fs/namei.c:3365 [inline]
 path_openat+0xb1f/0x3320 fs/namei.c:3500
 do_filp_open+0x255/0x380 fs/namei.c:3535
 do_sys_open+0x4b0/0x640 fs/open.c:1093
 do_syscall_64+0x148/0x5d0 arch/x86/entry/common.c:287
Code: 53 48 8b 54 24 08 48 89 fb 48 8d 7f 18 be 01 00 00 00 e8 09 53 75 fd 48 89 df e8 c1 51 76 fd e8 4c e9 74 fd fb 66 0f 1f 44 00 00 <65> ff 0d be 06 0f 49 5b c3 66 90 66 2e 0f 1f 84 00 00 00 00 00 
INFO: rcu_sched self-detected stall on CPU
	1-...!: (1 GPs behind) idle=2e6/1/4611686018427387906 softirq=27263/27266 fqs=0 
	 (t=343249 jiffies g=6526 c=6525 q=52)
rcu_sched kthread starved for 343249 jiffies! g6526 c6525 f0x0 RCU_GP_WAIT_FQS(3) ->state=0x402 ->cpu=0
RCU grace-period kthread stack dump:
rcu_sched       I20568     9      2 0x80000000
Call Trace:
INFO: rcu_sched detected stalls on CPUs/tasks:
 schedule+0xf0/0x3a0 kernel/sched/core.c:3549
 schedule_timeout+0x113/0x210 kernel/time/timer.c:1801
 rcu_gp_kthread+0xf20/0x3a00 kernel/rcu/tree.c:2231
 kthread+0x32b/0x3f0 kernel/kthread.c:238
 ret_from_fork+0x3a/0x50 arch/x86/entry/entry_64.S:412
NMI backtrace for cpu 1
CPU: 1 PID: 2773 Comm: syz-fuzzer Tainted: G             L    4.17.0-rc1+ #34
Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS 1.10.2-1ubuntu1 04/01/2014
Call Trace:
 <IRQ>
 __dump_stack lib/dump_stack.c:77 [inline]
 dump_stack+0x11b/0x1fd lib/dump_stack.c:113
 nmi_cpu_backtrace.cold.2+0x19/0x5d lib/nmi_backtrace.c:103
 </IRQ>
	0-...!: (1 GPs behind) idle=1a6/1/4611686018427387906 softirq=37557/37559 fqs=53 
	(detected by 0, t=232 jiffies, g=6527, c=6526, q=315)
NMI backtrace for cpu 0
CPU: 0 PID: 2765 Comm: syz-fuzzer Tainted: G             L    4.17.0-rc1+ #34
Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS 1.10.2-1ubuntu1 04/01/2014
Call Trace:
 <IRQ>
 __dump_stack lib/dump_stack.c:77 [inline]
 dump_stack+0x11b/0x1fd lib/dump_stack.c:113
 nmi_cpu_backtrace.cold.2+0x19/0x5d lib/nmi_backtrace.c:103
 </IRQ>
```

I'll update a post later...

**End**



## smp_call_function_many - soft lockup

Got from syzkaller & Found in LK v4.17.0-rc1.

### Call Trace (Dump)

```c
watchdog: BUG: soft lockup - CPU#1 stuck for 21s! [syz-fuzzer:2758]
Modules linked in:
irq event stamp: 937580
hardirqs last  enabled at (937579): [<ffffffff87000a60>] restore_regs_and_return_to_kernel+0x0/0x30
hardirqs last disabled at (937580): [<ffffffff87000964>] interrupt_entry+0xc4/0xe0 arch/x86/entry/entry_64.S:625
softirqs last  enabled at (891764): [<ffffffff872006f6>] __do_softirq+0x6f6/0xa8b kernel/softirq.c:311
softirqs last disabled at (891755): [<ffffffff845539fb>] invoke_softirq kernel/softirq.c:365 [inline]
softirqs last disabled at (891755): [<ffffffff845539fb>] irq_exit+0x19b/0x1c0 kernel/softirq.c:405
CPU: 1 PID: 2758 Comm: syz-fuzzer Not tainted 4.17.0-rc1+ #34
Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS 1.10.2-1ubuntu1 04/01/2014
RIP: 0010:rep_nop arch/x86/include/asm/processor.h:667 [inline]
RIP: 0010:cpu_relax arch/x86/include/asm/processor.h:672 [inline]
RIP: 0010:csd_lock_wait kernel/smp.c:108 [inline]
RIP: 0010:smp_call_function_single+0x3b8/0x510 kernel/smp.c:302
RSP: 0000:ffff88006652e9c0 EFLAGS: 00000293 ORIG_RAX: ffffffffffffff13
RAX: ffff88006bffc540 RBX: ffff88006652ea38 RCX: ffffffff8477e0e6
RDX: 0000000000000000 RSI: 0000000000000000 RDI: ffff88006652ea38
RBP: ffff88006652eb20 R08: ffffed000da05791 R09: ffff88006bffcdb8
R10: 0000000000000000 R11: 0000000000000000 R12: 0000000000000001
R13: dffffc0000000000 R14: 0000000000000000 R15: ffffed000cca5d54
FS:  000000c42023dc68(0000) GS:ffff88006d100000(0000) knlGS:0000000000000000
CS:  0010 DS: 0000 ES: 0000 CR0: 0000000080050033
CR2: 00007f6ca68cd650 CR3: 0000000060ed6000 CR4: 00000000000006e0
DR0: 0000000000000000 DR1: 0000000000000000 DR2: 0000000000000000
DR3: 0000000000000000 DR6: 00000000fffe0ff0 DR7: 0000000000000400
Call Trace:
 smp_call_function_many+0x6b0/0x820 kernel/smp.c:434
 native_flush_tlb_others+0xec/0x620 arch/x86/mm/tlb.c:595
 flush_tlb_others arch/x86/include/asm/paravirt.h:309 [inline]
 flush_tlb_mm_range+0x255/0x400 arch/x86/mm/tlb.c:644
 flush_tlb_page arch/x86/include/asm/tlbflush.h:526 [inline]
 ptep_clear_flush+0x1a8/0x1f0 mm/pgtable-generic.c:87
 wp_page_copy+0x97e/0x1c40 mm/memory.c:2527
 do_wp_page+0x46c/0x2240 mm/memory.c:2776
 handle_pte_fault mm/memory.c:3979 [inline]
 __handle_mm_fault+0x1b21/0x32f0 mm/memory.c:4087
 handle_mm_fault+0x12e/0x390 mm/memory.c:4124
 __do_page_fault+0x517/0xb70 arch/x86/mm/fault.c:1399
 do_page_fault+0xc1/0x610 arch/x86/mm/fault.c:1474
 async_page_fault+0x1e/0x30 arch/x86/entry/entry_64.S:1163
RIP: 0033:0x41cfa7
RSP: 002b:000000c4201d3cb0 EFLAGS: 00010246
RAX: 000000c420016000 RBX: 0000000000000000 RCX: 0000000000000000
RDX: 00007f6ca68dd4c0 RSI: 0000000000000000 RDI: 00007f6ca68cd650
RBP: 000000c4201d3cd0 R08: 0000000000000000 R09: 0000000000000000
R10: 0000000000000001 R11: 0000000000000286 R12: 00000000000000ff
R13: 0000000000000020 R14: 00007f6ca68d9000 R15: 0000000000000010
Code: 00 00 fc ff df 44 89 bc 24 e0 00 00 00 48 c1 e8 03 4c 01 e8 41 83 e7 01 c6 00 f8 74 53 49 89 c7 48 83 c3 18 e8 7a a6 0a 00 f3 90 <48> 89 da 41 c6 07 04 48 c1 ea 03 42 0f b6 14 2a 84 d2 74 09 80 
watchdog: BUG: soft lockup - CPU#0 stuck for 37s! [kworker/0:1:24]
Modules linked in:
irq event stamp: 18446
hardirqs last  enabled at (18445): [<ffffffff86f2d7a6>] __raw_spin_unlock_irqrestore include/linux/spinlock_api_smp.h:160 [inline]
hardirqs last  enabled at (18445): [<ffffffff86f2d7a6>] _raw_spin_unlock_irqrestore+0x46/0x60 kernel/locking/spinlock.c:184
hardirqs last disabled at (18446): [<ffffffff87000964>] interrupt_entry+0xc4/0xe0 arch/x86/entry/entry_64.S:625
softirqs last  enabled at (18432): [<ffffffff8644cc31>] neigh_periodic_work+0x6b1/0xa90 net/core/neighbour.c:862
softirqs last disabled at (18428): [<ffffffff8644c65b>] neigh_periodic_work+0xdb/0xa90 net/core/neighbour.c:794
CPU: 0 PID: 24 Comm: kworker/0:1 Tainted: G             L    4.17.0-rc1+ #34
Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS 1.10.2-1ubuntu1 04/01/2014
Workqueue: events e1000_watchdog
RIP: 0010:arch_local_irq_restore arch/x86/include/asm/paravirt.h:783 [inline]
RIP: 0010:__raw_spin_unlock_irqrestore include/linux/spinlock_api_smp.h:160 [inline]
RIP: 0010:_raw_spin_unlock_irqrestore+0x4b/0x60 kernel/locking/spinlock.c:184
RSP: 0018:ffff88006c14f4c0 EFLAGS: 00000293 ORIG_RAX: ffffffffffffff13
RAX: 0000000000000007 RBX: 0000000000000293 RCX: 0000000000000000
RDX: 0000000000000000 RSI: 0000000000000000 RDI: 0000000000000293
RBP: ffff880066e8ade0 R08: ffffed000cdd15bd R09: ffff88006c0736b8
R10: 0000000000000000 R11: 0000000000000000 R12: 0000000000000000
R13: ffff880066e8abc0 R14: ffff880066e8afb8 R15: ffff880066e8a180
FS:  0000000000000000(0000) GS:ffff88006d000000(0000) knlGS:0000000000000000
CS:  0010 DS: 0000 ES: 0000 CR0: 0000000080050033
CR2: 000000c42d98e000 CR3: 00000000614ac000 CR4: 00000000000006f0
DR0: 0000000000000000 DR1: 0000000000000000 DR2: 0000000000000000
DR3: 0000000000000000 DR6: 00000000fffe0ff0 DR7: 0000000000000400
Call Trace:
 spin_unlock_irqrestore include/linux/spinlock.h:365 [inline]
 e1000_update_stats+0x13ed/0x1d60 drivers/net/ethernet/intel/e1000/e1000_main.c:3768
 e1000_watchdog+0x335/0x11a0 drivers/net/ethernet/intel/e1000/e1000_main.c:2521
Code: 51 76 fd f6 c7 02 75 19 48 89 df 57 9d 0f 1f 44 00 00 e8 19 5d 74 fd 65 ff 0d 72 06 0f 79 5b 5d c3 e8 ea e8 74 fd 48 89 df 57 9d <0f> 1f 44 00 00 eb e5 0f 1f 40 00 66 2e 0f 1f 84 00 00 00 00 00 
```

I'll update a post later...

**End**

