---
layout: post
title: LK v4.17.x - bad rss-counter state - bug
comments: true
---

bad rss-counter state - bug

posted & found by [zer0day](https://kozistr.github.io/)

## tl;dr

Found in LK v4.17.0+. Interesting one... :)

## Call Trace (Dump)

Got from syzkaller

```c
...
[ 1251.494022] BUG: Bad rss-counter state mm:00000000bb7fc423 idx:0 val:8192
[ 1251.494998] BUG: Bad rss-counter state mm:00000000bb7fc423 idx:1 val:2
[ 1251.495890] BUG: non-zero pgtables_bytes on freeing mm: 73728
...
```

## PoC

Skip!

**End**
