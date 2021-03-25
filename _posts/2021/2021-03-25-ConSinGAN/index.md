---
title: ConSinGAN - Improved Techniques for Training Single-Image GANs
date: 2021-03-25
update: 2021-03-25
tags:
  - Deep-Learning
keywords:
  - GAN
  - one-shot
  - Concurrent
  - Generative-Models
---

## TL;DR

이전에 리뷰했던 SinGAN 후속 논문이 나왔는데, 우연히 github 메인 페이지 오른쪽에 보면 Explore repositories이 있는데, 여기에 추천 repo로 떠서 우연히 보게됐습니다.

저자분께서 짧은 요약을 블로그에 정리해서, 논문대신 아래 글을 읽어도 충분할 듯 하고, SinGAN 이랑 비교/대조하는 부분이 있어서 SinGAN 논문도 읽어보시는 걸 추천드려요.

official summary : [blog](https://www.tobiashinz.com/2020/03/24/improved-techniques-for-training-single-image-gans.html)

paper : [WACV21](https://openaccess.thecvf.com/content/WACV2021/papers/Hinz_Improved_Techniques_for_Training_Single-Image_GANs_WACV_2021_paper.pdf)

code : [github](https://github.com/tohinz/ConSinGAN)

## Related Work

요 논문과 관련높은 references

1. SinGAN : [paper](https://arxiv.org/pdf/1905.01164.pdf), [my review](https://kozistr.tech/SinGAN/)
2. ProGAN : [paper](https://arxiv.org/pdf/1710.10196.pdf)

## Novelty

논문을 읽기 전, 전반적인 느낌은 논문 제목부터 Con**SinGAN**인 것 처럼, SinGAN에 여러 techniques를 추가해 성능을 improved 한 느낌입니다.
또, Con (Concurrent)라 명칭한걸 보니, 각 generators 를 concurrent 하게 학습한다는 느낌을 받았는데, 자세한 건 논문을 읽어봐야 겠어요.

이 논문에서, 크게 **3 가지의 main contributions** 이 있습니다.

1. architecture & optimization
2. 이미지 rescaling (for multi-stage training)
3. fine-tune

### Architecture & Optimization

model architecture 같은 경우 **SinGAN**과 비교/대조를 하는데, **SinGAN**도 multi-stage generators 를 가지고 있는데, 
가장 낮은 resolution 에 해당하는 generator 만 unconditional generator 라고 말하고 있습니다.

즉, **SinGAN** 은 최초에만 noise (~= z latent vector)로 부터 이미지를 생성하고, 이후 stages 는 random 한 요소가 들어가지 않는다는 말입니다.


![architecture](architecture.png)

### Rescaling Image

### Fine-Tune

## Conclusion

개인적으로 새로운 idea를 제안하는 논문도 좋아하지만, 이런 training recipe 튜닝하는 걸 좋아해서 개인적으로 가볍고 재밌게 읽었습니다.


결론 : 굳굳
