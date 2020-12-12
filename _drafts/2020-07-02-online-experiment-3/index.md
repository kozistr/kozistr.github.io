---
title: 🏃‍♂️ [책 요약] Trustworthy Online Controlled Experiments - ch3 Twyman's Law and Experimentation Trustworthiness
date: 2020-07-01
tags:
  - online-controlled-experiment
keywords:
  - experiment platform
  - A/B testing
  - Trustworthy online controlled experiments
---

> **Trustworthy Online Controlled Experiments: A Practical Guide to A/B Testing**라는 책을 읽고 요약하고 있다. 이 포스트에서는 **3장: Twyman's Law and Experimentation Trustworthiness**에 대해 다루고 있다.  

> 글에서 얘기하는 **실험**은 **online controlled experiment**를 의미한다. online controlled experiment은 때로 A/B 테스트라고도 불린다.

📕2장에서는 실험을 어떻게 구성하고, 어떤 점들을 고려해야 하는지 예제를 통해서 살펴봤다. 이번 포스트에서는 실험의 trustworthiness 즉, 신뢰를 쌓기 위해서 어떤 방법들을 해야하는지 살펴보려고 한다. 

이 챕터는 통계학적인 지식을 많이 요구하다 보니 확실하게 이해하지 못한 부분들이 많다. 그래서 챕터에서 이해한 부분들을 중점으로 정리를 했다.



## 잘못 해석된 통계적인 결과 

실험의 결과를 통계적으로 분석을 할 때 흔히 하는 실수들은 다음과 같다:

### 1. 통계적 검정력(Statistical Power)의 부족 

귀무가설에 의해 우리는 일반적으로 control과 treatment간 차이가 없다고 가정한다, 그리고 이 가설을 반증하는 확실한 증거가 있으면 이 가설을 기각한다. 여기서 가장 흔히 하는 실수는, 측정된 지표가 통계적으로 유의미하지 않다고 해서 treatment 효과가 없다고 결론 짓는 것이다. 모수가 충분하지 않을 때 통계적으로 유의미한 수치를 찾지 못하는 경우가 있다. 하지만, 이건 실험의 효과가 미미했다기 보다는, 모수가 적기 때문에 실험의 효과를 크게 보지 못했다고 볼 수 있다.

### 2. Misinterpreting p-values

`P-value`는 종종 잘못 해석 된다고 한다. 가장 흔한 해석 오류는 `p-value`가 control의 평균 수치와 treament의 평균 수치가 얼마나 다른지에 대한 확률을 나타낸다고 믿는 것이다. 

> 📎[A/B 테스트에서 p-value에 휘둘리지 않기](https://boxnwhis.kr/2016/04/15/dont_be_overwhelmed_by_pvalue.html)

### 3. Peeking at p-values

**skip** (제대로 이해 못함)

### 4. Multiple Hypothesis Test

여러개의 실험이 있고 그 중에서 가장 낮은 `p-value`를 선택할때 bias가 생길 수 있다.



## Threats to Internal Validity

내적 타당도(internal validity)란 실험 결과의 정확성을 의미한다. 이 타당성을 저해하는 요인들은 다음과 같다:

### 1. Violations of SUTVA

실험을 분석할 때 SUTVA(Stable Unit Treatment Value Assumption)를 적용하는 것이 흔한 일이다. SUTVA는 한 실험의 단위가 다른 단위에 영향을 주지 않는 가정을 의미한다.

Uber, Lyft, Airbnb와 같이 소비자와 판매자가 같은 플랫폼을 사용하는 시장에서는 이 SUTVA의 원칙이 저해될 수 있다. 예를 들어, treatment 그룹의 소비하는 유저들한테 낮은 가격으로 상품을 제공하는 것이 판매자인 유저들한테도 영향이 간다.

### 2. Survivorship Bias

남아있는 유저들의 행동을 분석하는 것도 bias가 생길 수 있다. 예를 들어, 2차 세계대전 때 비행기에 보호구를 추가할 떄 가장 총알 자국이 많은 곳에 보호구를 추가하려고 했었다. 하지만, Abraham Wald라는 인물이 총알 자국이 가장 많이 남은 부분에 오히려 절대로 보호구를 추가하면 안되는 부분이라고 얘기를 했다. 이유로는, 총알 자국이 없는 부분이 없는 곳에 총알을 맞은 비행기들은 돌아오지 못했기에 그 부분이 가장 취약한 부분이라는 것이었다.

### 3. Intention-to-Treat

skip

### 4. SRM

control/treament 비율 다른 문제

- browser redirects

예를 들어, 웹사이트 redirection 실험해서 퍼포먼스 이슈로 인해 imbalance생길 수 있다. 봇의 문제도 있다.

- lossy instrumentation
- residual or carryover effects

새로운 코드는 버그 생길 가능성이 더 높다.

- bad hash function for randomization

cryptographc hash function이 좋다. MD5와 같은, 하지만 느리다...

- Triggering impacted by Treatment

treatment로 인해 실험의 유저들이 바뀌는 것. 이메일로 비활성화 유저들에게 메일보내서 그 유저들이 가입하면, 그 유저들은 실험에서 제외 됨

- Time-of-day effects

email open rate에 따라 SRM생길 수 있다. 어떤 그룹은 이메일을 낮시간, 어떤 그룹은 일 이후에 받아서 다른 결과 나왔을 ㅅ ㅜ있다.

- Data pipeline impacted by Treatment

열심히 쓰는 유저들이 봇으로 분류됨. Bing의 50%는 봇이다. 중국이나 러시아는 90% 이상.



## Thrats to External Validity

다른 인종/민족/시간때문에 생기는 문제를 의미한다. 일반화가 때로 안된다. 

보통 문제는 간단하다, 실험을 다시 하는 것. 미국에서는 잘되도 다른 나라에서는 그 실험이 안될 수도 있기 때문.

### 1. Primary effects

변화가 생기면 유저들은 적응하는데 시간이 필요하다. 옛 방식에 익숙하기 때문에

### 2. Novertly effects

새로운 feature가 있으면 보통 attract된다. 기능이 좋아서가 아니라 신기해서. 

### 3. Detecting Primacy and Novelty Effects

너무 실험 기간 길면 결과 달라 질 수 있음



## Segment Differences

좋은 segment른?

- 마켓이나 국가
- 디바이스나 플랫폼
- 주중, 주말
- 유저 타입
- 유저 계정 특징

### 1. Segmented View of a Metric



### 2. Segmented VIew of the Treatment Effect (Heterogeneous Treatment Effect)



### 3. Analysis by Segments Impacted by Treatment Can Mislead



## Simpson's Paradox

## Encourage Healthy Skepticism





✍️ 다음 포스트는 **Experimentation Platform and Culture**라는 내용을 요약하려고 한다.

