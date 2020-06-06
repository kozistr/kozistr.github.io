---
layout: post
title: UIS-RNN-SML SUPERVISED ONLINE DIARIZATION WITH SAMPLE MEAN LOSS FOR MULTI-DOMAIN DATA
author: kozistr
categories: deep-learning
tags: DeepLearning, Speaker, Diarization, SML, UIS-RNN
use_math: true
---

posted by [kozistr](http://kozistr.tech)

## tl;dr

평소에 speaker diarization task 에 정말 관심이 많았고, 이전에 이쪽 분야 (speech domain 쪽 전반적으로) 업무를 하다가, 최근에는 못 보다가
다시 이쪽 분야 trend 는 어떤지 궁금해서 예전에 UIS-RNN 기반으로 speaker diarization pipeline 구현하던 게 생각나서 찾아보다 발견해서 읽게 됐습니당.

paper : [arXiv](https://arxiv.org/pdf/1911.01266.pdf)

code : [github](https://github.com/DonkeyShot21/uis-rnn-sml)

## Related Work

DL approach Speaker Diarization 논문들

* UIS-RNN : [paper](https://arxiv.org/pdf/1810.04719.pdf)
* BLSTM-EEND : [paper](https://arxiv.org/pdf/1909.05952.pdf)
* SA-EEND : [apper](https://arxiv.org/pdf/1909.06247.pdf)
* RPNSD : [paper](https://arxiv.org/pdf/2002.06220.pdf)
* DNCSD : [paper](https://arxiv.org/pdf/1910.09703.pdf)

## Introduce

18년도에 구글에서 `UIS-RNN` 이란 `d-vector` based feature extractor speaker diarization 이 나왔는데, 
Sample Mean Loss (SML) 을 사용해 speaker 의 turn behavior 를 더 잘 잡는다고 합니다.

결론적으로 이번에 제안한 method 가 online method 에서 `UIS-RNN` 보다 성능이 올라갔고, offline method 에서 AHC (Agglomerative Hierachical Clustering) w/ PLDA scoring 과 비슷한 성능을 낸다고 캅니다.

## Proposed Approach

embeddings $X = (x_1, ..., x_T)$, speaker labels $Y = (y_1, ... y_T)$ (T는 no of frames) 이라고 할 때,
diarization task 를 확률 모델 적으로 아래 식으로 joint probability 를 maximize 할 수 있죠

> $ \hat{Y}  = arg max_{Y} P(X, Y)$ 

이 문제를 online generative problem 으로 바꿔본다면, 식이 아래와 같이 써 볼 수 있겠죠?

> $p(x_t, y_t, z_t\|x_{[t-1]}, y_{[t-1]} z_{[t-1]}) = p(x_t\|x_{[t-1]}, y_t) * p(y_t\|y_{[t-1]}, z_t)) * p(z_t\|z_{[t-1]})), (time t)$

$x_t, y_t, z_t$ 에 대한 조건부 확률을 순서대로 보면 

* $x_t$ : sequence generation
* $y_t$ : assignment (speaker)
* $z_t$ : speaker change

`UIS-RNN` 에서...

* **speaker change** 는 coin flipping process 로 $p_0$ 란 transition parameter 1개로 처리 되었고
* **speaker assignment** 는 distance dependent Chinese Restaurant Process (ddCRP) 로 bayesian non-parametric process 로 풀었고 (time domain 에서 얼마나 화자가 교차로 배치되었는지?)
* **sequence generation** 은 GRU (Gated Recurrent Unit) 을 사용해서 처리

### UIS-RNN

기존의 `UIS-RNN`은 

## Experiment Result



## Conclusion

`UIS-RNN` 같은 경우엔 `d-vector` 을 feature extractor 로 사용하는데 v1 ~ v3 까지 dataset 과 training recipe 차이에 따라 엄청난 성능 비약이 있어서,
요걸 실제로 재현하거나 훈련할 수가 없었습니다. 

이전에 직접 훈련한 feature extractor 기반으로 했는데 좋은 성능을 기대하진 못했습니다 ㅠㅠ

물론 아직도 더 많은 종류의 dataset, 더 좋은 training recipe 에 따라 (feature extractor 의 성능) 
speaker diarization 성능이 어쩌면 (당연하게?) 결정된다고 생각하는데, 더 많은 dataset 과 pre-trained 모델이 공개되면 좋겠다란 바람이 있네요!

그래도 해당 논문은 `x-vector` 기반으로 재현을 하였고, `SML loss` 사용이 전 make sense 하고 좋은 method 라 생각해서 재밌게 읽었습니다!

특히 cluster 별 mean variance 가 거의 일정하게 낮음을 유지하는 부분이 인상적 이였습니다.

결론 : 굳굳
