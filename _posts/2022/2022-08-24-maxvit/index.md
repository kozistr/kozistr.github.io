---
title: MaxViT - Multi-Axis Vision Transformer
date: 2022-08-24
update: 2022-08-24
tags:
  - Deep-Learning
keywords:
  - imagenet
  - vit
  - multi-axis
---

## TL;DR

* paper : [arXiv](https://arxiv.org/pdf/2204.01697.pdf)
* code : [github](https://github.com/google-research/maxvit)

## Related Work

* [GC ViT](https://arxiv.org/pdf/2206.09959.pdf)

## Introduction

최근 vision transformer연구 경향을 보면 global context를 잘 고려하는 ViT연구들이 많이 보이는데, 이번 연구에서는 efficient 하고 scalable 한 multi-axis attention이란 걸 개발해 arbitrary image size에 대해서도 linear complexity만에 연산이 가능하고 global context도 잘 잡는 무언가를 만들었다고 합니다.

## Architecture

![img](./architecture.png)

architecture design은 다른 연구들과 큰 차이가 없는 hierarchical 한 구조인데, 차이점은 block module를 보면 크게 3 가지 components로 이뤄졌습니다. `MBConv` -> `Block Attention` -> `Grid Attention`.

### Attention

self-attention 연산은 location-unaware (e.g. non-translation equivariant, inductive bias)한 특징이 있는데, 이런 걸 해결하기 위해 이전 연구들은 vanilla self-attention 대신 related self-attention를 사용해 이런 문제를 어느 정도 완화하고 있습니다. 이번 연구에서도 pre-normalized related self-attention module을 사용했다고 합니다.

### Multi-axis Attention

![img](./multi_axis_self_attention.png)

## Performance

### ImageNet-1K benchmark

![img](./imagenet1k_benchmark.png)

## Conclusion

결론 : 굳굳
