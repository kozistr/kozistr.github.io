---
layout: post
title: LKE - tutorial - Stack based Overflow
---

Linux Kernel Exploitation Tutorial - 2


## tl;dr

In this article, we gonna exploit a LK module which has a stack overflow vulnerability with bypassing SMEP.

Test Environment is...

```c
zero@ubuntu:~$ uname -a
Linux ubuntu 4.16.0-041600rc1-generic #201802120030 SMP Mon Feb 12 00:31:33 UTC 2018 x86_64 x86_64 x86_64 GNU/Linux
zero@ubuntu:~$ lsb_release -a
No LSB modules are available.
Distributor ID:	Ubuntu
Description:	Ubuntu Bionic Beaver (development branch)
Release:	18.04
Codename:	bionic
zero@ubuntu:~$ gcc -v
...
gcc version 7.3.0 (Ubuntu 7.3.0-3ubuntu1)
```

## Background

Before we start, there're some concepts for bypassing those protections.

* SMEP : Supervisor Mode Execution Protection.

Which means, userland code cannot be executed by the kernel. And its state is saved in Bit 20 of CR4 register.

![CR4_Register](/images/cr4_register.png "CR4_Register")

To check whether it is activated or not, just read */proc/cpuinfo*, then find **smep**.

```c
zero@ubuntu:~$ cat /proc/cpuinfo | grep flags
flags		: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush mmx fxsr sse sse2 ss ht syscall nx pdpe1gb rdtscp lm constant_tsc arch_perfmon nopl xtopology tsc_reliable nonstop_tsc cpuid pni pclmulqdq ssse3 fma cx16 pcid sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand hypervisor lahf_lm abm 3dnowprefetch cpuid_fault invpcid_single pti fsgsbase tsc_adjust bmi1 hle avx2 smep bmi2 invpcid rtm mpx rdseed adx smap clflushopt xsaveopt xsavec xsaves arat
...
```

You can see SMEP/SMAP is enabled.

* KASLR : Kernel Address Space Layout Randomization

In every boot, kernel base address is changed randomly. So, we need to leak its address with several ways.

In this example, i just add a function which gets kernel base address for helping exploit easier.

* Stack Overflow

## Case

This time, i'll give an example code which has a stack based overflow vulnerability.

Testing Environment is like below.

```c
zero@zer0day:~$ uname -a
Linux zer0day 4.16.0-rc1+ #17 SMP Fri Feb 16 10:40:09 KST 2018 x86_64 GNU/Linux
zero@zer0day:~$ gcc -v
...
gcc version 4.7.2 (Debian 4.7.2-5)
```

## Code

Here's a Makefile & vulnerable code.

```c
obj-m += bug2.o

all:
	make -C /lib/modules/$(shell uname -r)/build M=$(PWD) modules

clean:
	make -C /lib/modules/$(shell uname -r)/build M=$(PWD) clean
```

```c

```

## Attack

~~maybe if i just use VirtualBox or Hyper-V, writing this tut will be more easier than now because they're not supporting SMEP as i know. haha :).~~

Anyway, let's do this~

Let me explain how to bypass SMEP in order. more details about SMEP are explained later.

1. backup userland context
2. overwrite CR4 with value 0x606e0. (remove Bit 20 of CR4 register)
3. swapgs
4. iretq; return to safe structure

## Epilogue


**End**