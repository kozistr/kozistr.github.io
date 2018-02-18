---
layout: post
title: LKE - tutorial - Stack based Overflow
---

Linux Kernel Exploitation Tutorial - 2


## tl;dr

In this article, we gonna exploit a LK module which has a stack overflow vulnerability with bypassing SMEP.

## Background

Before we start, there're some concepts for bypassing those protections.

1. SMEP : Supervisor Mode Execution Protection.

Which means, userland code cannot be executed by the kernel. To check whether it is activated or not, just read */proc/cpuinfo*, then find **smep**.

```c
flags		: fpu de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pse36 clflush mmx fxsr sse sse2 syscall nx lm rep_good nopl cpuid pni vmx cx16 x2apic hypervisor lahf_lm pti tpr_shadow vnmi flexpriority ept vpid
```

2. KASLR : Kernel Address Space Layout Randomization

In every boot, kernel base address is changed randomly. So, we need to leak its address with several ways.
In this example, i just add a function which gets kernel base address for helping exploit easier.

3. Stack Overflow




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