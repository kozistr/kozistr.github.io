---
title: NaturalSpeech - End-to-End Text to Speech Synthesis with Human-Level Quality

date: 2022-08-15
update: 2022-08-15
tags:
  - Deep-Learning
keywords:
  - speech-synthesis
  - human-level
  - TTS
---

## TL;DR

오랜만에 speech-synthesis 쪽 논문을 보다가 (LJSpeech dataset 에서) MOS, CMOS metrics 에서 human-level 에 도달한 research 가 있는데, 거기에 최근 유행이었던 diffusion approach 가 아닌 점에서도 꽤 흥미로웠습니다.

* paper : [arXiv](https://arxiv.org/pdf/2205.04421v2.pdf)
* code : [github](https://github.com/microsoft/NeuralSpeech)

코드는 아직인가 보다

## Related Work

* [VQ-VAE paper](https://arxiv.org/pdf/1711.00937v2.pdf)

## Architecture

![img](./architecture.png)

이번 연구는 총 4가지 부분에서 contributes 했다.

1. pre-train large-scale langugae model on phoneme sequence
2. differentiable durator
3. bi-directional prior/posterior module
4. memory-based VAE (memory bank)

### Phoneme Encoder

phoneme encoder 는 말대로 phoneme sequence $y$ 를 frame-level representations 으로 encode 해 주는 module 인데, 이전 연구들은 일반 dataset 으로 학습하거나 phoneme 에 대해서만 학습한 LM 을 사용해서 phoneme domain 에 어울리지 않거나 capacity issue 로 positive boost 를 주지 못했다고 합니다.

![img](./phoneme_pretraining.png)

그래서 이번 연구에선 phoneme 에 대해서만 학습하는게 아닌, mixed-phoneme (phoneme + sub-phoneme) pre-training 을 했다고 합니다.

또한, MLM 학습 할 때 phoneme tokens 과 sub-phoneme tokens 둘 다에 대해서 MLM 학습했습니다.

### Differentiable Durator

![img](./differentiable_durator.png)

### Bi-Directional Prior/Posterior Module

### memory-based VAE

## Performance

### MOS/CMOS on LJSpeech

### Latency

## Conclusion

결론 : 굳굳
