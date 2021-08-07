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

## Introduction

대부분의 이미지 synthesis하거나 editing 하는 모델들을 보면 엄청나게 커서 computation cost가 꽤 드는 편인데 (e.g. StyleGAN2, ...), 고성능 GPU에서 inference 해도 몇 초가 걸리기도 하다는 점을 issue 합니다. 실제로 유저들이 실시간이나 edge-device에서 사용하려면 빠르고 computation cost가 낮아야 하는데, 이런 점들을 이번 논문에서 거의 비슷한 퀄의 이미지를 x6 ~ 12 빠르게 생성이 가능한 무언가를 제안합니다.

## Architecture

![architecture](architecture.png)

## Conclusion

결론 : 굳굳
