---
layout: post
title: Self-training with Noisy Student improves ImageNet classification
author: kozistr
categories: deep-learning
tags: DeepLearning, EfficientNet, Noisy-Student, Classification
use_math: true
---

posted by [kozistr](http://kozistr.tech)

## tl;dr

이번 포스팅에서 리뷰할 논문은 EfficientNet 기반으로 새로운 techniques 를 적용해서 ImageNet dataset 에서 SOTA 를 찍은 논문입니다.
나온지는 꽤 됐지만, 최근 TPU 에서 돌아가는 요 코드를 짜다가 생각나서 리뷰하게 됐어요.

아래는 이번 approach 가 달성한 성능인데, 이전 SOTA 에 비해서 Accuracy 가 약 2% 정도 올라갔네요.

해당 이미지에는 *L2* performance 가 안올라와 있는데, *Noisy Student + Random Augment* 로 훈련한 *L2* 모델 top-1 accuracy 가 *88.4%* 입니다.
올해에는 90% 가 넘는 architecture 가 나오지 않을까 생각이 드네요.

![img](/assets/NoisyStudent/performance.png)

paper : [arXiv](https://arxiv.org/pdf/1911.04252.pdf)

code : [code](https://github.com/tensorflow/tpu/tree/master/models/official/efficientnet)

## Related Work

EfficientNet : [arXiv](https://arxiv.org/pdf/1905.11946.pdf)

## Introduction

이전 Image Classification 연구 동향들에서도 간단하게 설명은 다음에 다른 포스트로 다뤄볼께요. 양이 좀 많이 질 듯 해서 (~~귀찮네요~~)

## Architecture

### Self-Training w/ Noisy Student

학습은 다음과 같은 process 로 이뤄지는데,

![img](/assets/NoisyStudent/teacher-student.png)

1. Labelled dataset 인 ImageNet 으로 **Teacher Model** 을 학습
2. un-labelled dataset 인 JFT-300M 를 **Teacher Model** 로 pseudo labelling 하기
3. `2` 에서 생성된 data + ImageNet 으로 **Student Model** 학습 w/ noise
4.  다시 `2` 으로 가서 반복 (iterative training)

위 과정이 knowledge (self) distillation 과 비슷한 과정인데, 주로 요 목적은 compression 으로 사용되는데, 여기는 
해당 목적 (not compression) 으로 사용하지 않는다는게 차이점 입니다.

#### Noisy

Student Model 을 학습할 때 논문에서 `Noisy` 하게 훈련한다고 했는데, 이 때 `Noisy` 에 해당하는 부분은 크게 3 부분 입니다.

1. Data Augmentation w/ RandAugment
2. Dropout
3. Stochastic Depth
4. other techniques (data filtering, balancing)
  * OOD (Out-Of-Distribution)
  * unlabelled data 에 대해선 class 별 samples 수가 biased 돼있으니, 적은 sample 들 duplicate 하기
  * pseudo label 시, soft or hard pseudo 한다고 했었는데, soft, hard 둘다 좋은 결과를 보였지만, soft 가 더 좋았다

요런 기법들은 이전에 소개된 기법들이니 설명은 pass

## Experiment Result


## Conclusion

결론 : 굳
