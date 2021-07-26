---
title: VertiFocalNet - An IoU-aware Dense Object Detector
date: 2021-07-26
update: 2021-07-26
tags:
  - Deep-Learning
keywords:
  - object-detection
  - iou-aware
  - anchor-free
---

## TL;DR

최근에 Object Detection (이하 OD) task 관련 kaggle challenge를 하다, 비슷한 대회 solutions들을 보다가 상위 랭크 solution에 `VertiFocalNet` (이하 `VFNet`)을 사용한 걸 발견해서, 요 논문을 더 자세하게 공부해 보고 싶어서 정리해 봅니다.

OD 쪽을 오랜만에 공부해 보니 그동안 공부 안 했던 스택이 쌓였는지, 볼 것도 많지만 대회에도 써 보면서 재밌게 공부했습니다.

* `VertiFocalNet` papepr : [arXiv](https://arxiv.org/pdf/2008.13367.pdf)
* `VertiFocalNet` official repo : [github](https://github.com/hyz-xmaster/VarifocalNet)

## Related Work

논문에서 제시하는 novelty들에 직/간접적으로 영향을 준 논문들.

* FCOS : [arXiv](https://arxiv.org/abs/1904.01355)
* ATSS : [arXiv](https://arxiv.org/abs/1912.02424)
* FocalLoss : [arXiv](https://arxiv.org/abs/1708.02002)

## Introduction

OD task에서 높은 성능을 얻으려면 candidate detection를 rank 하는 게 중요한 것 중 하나인데, 이전 연구들은 classification or localization score 등을 candidates를 rank 하는데 사용해 **reliable 하지 못하다**는 점을 짚으며, 요걸 joint learn 할 수 있는 reliable 한 method, IACS (IoU-Aware Classification Score)를 제안합니다.

이 논문에서 제시하는 novelty는 크게 3가지입니다.

1. IACS (IoU-Aware Classification Score)
2. VertiFocal Loss
3. Star-Shaped Box Feature Representation

## Architecture

### IACS (IoU-Aware Classification Score)

### VertiFocal Loss

`IACS`를 탐지하기 위해 `VertiFocal` loss를 설계했는데, base는 `Focal` loss 입니다.

> $VFL(p, y) = -q(qlog(p) + (1 - q)log(1 - p)), q > 0$
> $VFL(p, y) = -\alpha p^{\gamma}(1 - p)$

### Star-Shaped Box Feature Representation

## Train Recipe

## Performance

## Conclusion

결론 : 굳굳
