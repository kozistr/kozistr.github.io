---
layout: post
title: LK v4.17.x - ext4_data_block_valid - uaf
comments: true
---

ext4_data_block_valid - use after free *Read*

posted & found by [zer0day](https://kozistr.github.io/)

## tl;dr

Found in LK v4.17.0+. Interesting one... :)

## Call Trace (Dump)

Here's dmesg.

```c
[  198.171416] EXT4-fs (sda): re-mounted. Opts: noblock_validity,,errors=continue
[  198.171520] ==================================================================
[  198.173422] BUG: KASAN: use-after-free in ext4_data_block_valid+0x2c1/0x320
[  198.174371] Read of size 8 at addr ffff880065ee36a8 by task syz-executor6/12409
[  198.175341] 
[  198.175547] CPU: 0 PID: 12409 Comm: syz-executor6 Not tainted 4.17.0+ #9
[  198.176441] Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS 1.10.2-1ubuntu1 04/01/2014
[  198.177609] Call Trace:
[  198.177931]  ? dump_stack+0x138/0x229
[  198.178478]  ? dump_stack_print_info.cold.1+0x45/0x45
[  198.179109]  ? kmsg_dump_rewind_nolock+0xd9/0xd9
[  198.179785]  ? ext4_data_block_valid+0x2c1/0x320
[  198.180363]  ? print_address_description+0x60/0x25c
[  198.181055]  ? ext4_data_block_valid+0x2c1/0x320
[  198.181820]  ? kasan_report.cold.7+0xac/0x2f4
[  198.182421]  ? ext4_data_block_valid+0x2c1/0x320
[  198.183134]  ? __check_block_validity.constprop.82+0xbc/0x200
[  198.183918]  ? ext4_map_blocks+0xf5a/0x19d0
[  198.184531]  ? ext4_issue_zeroout+0x150/0x150
[  198.185152]  ? ext4_getblk+0x4b9/0x5d0
[  198.185640]  ? __lock_is_held+0xad/0x140
[  198.186140]  ? ext4_iomap_begin+0x1210/0x1210
[  198.186735]  ? mark_held_locks+0xc1/0x140
[  198.187257]  ? ext4_bread_batch+0x79/0x3f0
[  198.187795]  ? ext4_find_entry+0x612/0x1140
[  198.188335]  ? ext4_dx_find_entry+0x400/0x400
[  198.188905]  ? d_alloc+0x267/0x330
[  198.189346]  ? do_raw_spin_unlock+0xac/0x310
[  198.189899]  ? do_raw_spin_trylock+0x1b0/0x1b0
[  198.190496]  ? mark_held_locks+0xc1/0x140
[  198.191004]  ? d_lookup+0x17f/0x1e0
[  198.191475]  ? ext4_lookup+0x15a/0x6a0
[  198.191953]  ? ext4_cross_rename+0x1d20/0x1d20
[  198.192530]  ? __lookup_hash+0x12a/0x190
[  198.193029]  ? filename_create+0x1ba/0x560
[  198.193580]  ? kern_path_mountpoint+0x40/0x40
[  198.194189]  ? rcu_read_lock_sched_held+0x102/0x120
[  198.194848]  ? getname_flags+0x268/0x5a0
[  198.195366]  ? do_symlinkat+0xe7/0x260
[  198.195866]  ? __x64_sys_unlinkat+0x120/0x120
[  198.196435]  ? do_syscall_64+0x8d/0x670
[  198.196930]  ? do_syscall_64+0x165/0x670
[  198.197443]  ? syscall_return_slowpath+0x4e0/0x4e0
[  198.198049]  ? syscall_return_slowpath+0x342/0x4e0
[  198.198686]  ? prepare_exit_to_usermode+0x380/0x380
[  198.199312]  ? entry_SYSCALL_64_after_hwframe+0x59/0xbe
[  198.199986]  ? trace_hardirqs_off_thunk+0x1a/0x1c
[  198.200650]  ? entry_SYSCALL_64_after_hwframe+0x49/0xbe
[  198.201317] 
[  198.201538] Allocated by task 1:
[  198.201948] (stack is not available)
[  198.202435] 
[  198.202649] Freed by task 12388:
[  198.203062] (stack is not available)
[  198.203532] 
[  198.203742] The buggy address belongs to the object at ffff880065ee3690
[  198.203742]  which belongs to the cache ext4_system_zone of size 40
[  198.205321] The buggy address is located 24 bytes inside of
[  198.205321]  40-byte region [ffff880065ee3690, ffff880065ee36b8)
[  198.206771] The buggy address belongs to the page:
[  198.207384] page:ffffea000197b8c0 count:1 mapcount:0 mapping:ffff8800692fbc80 index:0x0
[  198.208380] flags: 0x100000000000100(slab)
[  198.208914] raw: 0100000000000100 dead000000000100 dead000000000200 ffff8800692fbc80
[  198.209879] raw: 0000000000000000 0000000080490049 00000001ffffffff 0000000000000000
[  198.210872] page dumped because: kasan: bad access detected
[  198.211581] 
[  198.211788] Memory state around the buggy address:
[  198.212388]  ffff880065ee3580: fb fb fb fb fc fc fb fb fb fb fb fc fc fb fb fb
[  198.213285]  ffff880065ee3600: fb fb fc fc fb fb fb fb fb fc fc fb fb fb fb fb
[  198.214183] >ffff880065ee3680: fc fc fb fb fb fb fb fc fc fc fc fc fc fc fc fc
[  198.215139]                                   ^
[  198.215145]  ffff880065ee3700: fc fc fc fc fc fc fc fc fc fc fc fc fc fc fc fc
[  198.215150]  ffff880065ee3780: fc fc fc fc fc fc fc fc fc fc fc fc fc fc fc fc
[  198.215152] ==================================================================
```

## PoC

Skip!

**End**
