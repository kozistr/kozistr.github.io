---
title: Anycost GANs for Interactive Image Synthesis and Editing
date: 2021-08-07
update: 2021-08-07
tags:
  - Deep-Learning
keywords:
  - AnycostGAN
  - GAN
---

## TL;DR

Github에 들어가면 우측 상단에 `Explore repositories`에서 종종 재밌는 repositories를 추천해줘서 자주 구경 중인데, `AnycostGAN`도 이렇게 보다 논문까지 읽어보다 재밌어 보여서 짧게 정리해 보려고 합니다.

* paper : [arXiv](https://arxiv.org/abs/2103.03243)
* github : [repo](https://github.com/mit-han-lab/anycost-gan)

## Related Work

* StackGAN : [paper](https://arxiv.org/abs/1612.03242)
* ProGAN : [paper](https://arxiv.org/abs/1710.10196)
* StyleGANv2 : [paper](https://arxiv.org/pdf/1912.04958.pdf)
* MSGGAN : [paper](https://arxiv.org/pdf/1903.06048.pdf)

## Introduction

대부분의 이미지 synthesis하거나 editing 하는 모델들을 보면 엄청나게 커서 computation cost가 꽤 드는 편인데 (e.g. StyleGAN2, ...), 고성능 GPU에서 inference 해도 몇 초가 걸리기도 하다는 점을 issue 합니다. 유저들이 실시간이나 edge-device에서 사용하려면 빠르고 computation cost가 낮아야 하는데, 이런 점들을 이번 논문에서 이미지 퀄을 비슷하게 유지하면서 x6 ~ 12 빠르게 생성이 가능한 무언가를 제안합니다.

논문의 목표는 `run at diverse computational costs`라고 하며, 넓은 범위의 computational costs에 따른 계산(~= 이미지 생성)이 가능하다는 점 입니다. editing 같이 빠르게 수정해야할 니즈가 있는 건 low-cost(sub) generator를 사용해 preview를 보여주고, 최종 결과물을 render할 때엔 high-cost(full) generator를 사용할 수 있다고 합니다.

아래와 같이 크게 `3개의 특징`으로 정리해 볼 수 있습니다.

1. `stage-wise training` to stablize the process
  * a generator가 여러 configurations에 대해 minmax optimization하는 건 pretty challenging한 일
2. two types of `channel configurations`
  * uniform channel reduction ratio
  * flexible ratios
3. `consistency-aware` encoder & `iterative optimization` for image projection
  * optimize reconstruction loss for the both generators

## Architecture

![architecture](architecture.png)

위에는 AnycostGAN의 전반적인 flow.

### Learning Anycost Generators

아래는 다른 구현체들과 AyncostGAN architecture를 diff한 이미지

![architecture_diff](architecture_diff.png)

이미 이전에 StackGAN, StyleGANv2처럼 diverse resolutions 이미지를 생성하는 연구가 있었지만, low-resolution과 output (high-resolution) 이미지가 자연스럽지 못하다는 문제를 듭니다.

그래서 `multi-scale objectives`를 추가해서, gradually 여러 해상도의 좋은 퀄 이미지를 얻을 수 있다고 합니다.

multiple-resolutions으로 학습할 때, MSG-GAN에서 채택한 방식처럼 학습을 하면 (주로 large-scale datasets에서) fidelity degradation이 발생할 수 있다고 합니다 (single-resolution으로 하는 방법 보단).

그래서 `sampling-based` objective를 제안했는데, 한 step에 하나의 resolution에 대한 imsage를 sample해서 사용한다고 합니다. 또한, `low-resolution` image를 생성할 땐 $G$ network의 중간 layer를 output으로 사용했다고 합니다.

아래는 multi-scale objectives를 추가했을 때 해상도 별 이미지 퀄리티를 확인할 수 있는데, 확실히 각 resolution-level(?)별로 퀄리티가 훨씬 좋아지는 점이 있습니다. 또한, consistency term도 추가해 low/high resolution간 perceptual 도 훨씬 좋아진 걸 확인할 수 있네용

![multi-scale_consistency](multi-scale_consistency.png)

### two types of channel configurations

### consistency-aware encoder & iterative optimization


## Conclusion

결론 : 굳굳굳
