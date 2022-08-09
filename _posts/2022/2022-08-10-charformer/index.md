---
title: Charformer - Fast Character Transformers via Gradient-based Subword Tokenization
date: 2022-08-10
update: 2022-08-10
tags:
  - Deep-Learning
keywords:
  - T5
  - gradient-based-tokenizers
  - gbst
---

## TL;DR

* paper : [arXiv](https://arxiv.org/pdf/2106.12672.pdf)
* code : [github](https://github.com/google-research/google-research/tree/master/charformer)

## Related Work

* [mT5 paper](https://arxiv.org/abs/2010.11934)
* [ByT5 paper](https://arxiv.org/abs/2105.13626)

## Introduction

이번엔 gradient-based subword tokenization module (GBST) 를 만들었다. SentencePiece, WordPiece 나 raw text 를 받는 `token-free` 모델이 아닌 training 을 통해 subword representations 을 학습하는 무언가다. 연구에서도 강조하는 부분이 기존 `token-based` 보다 성능은 유지하며 속도 개선을 했다는 포인트다.

## Architecture

![img](./diff_architecture.png)

기존 pretrained token-based model 인 경우엔 왼쪽처럼 token 이 모델에 들어가고 Transformer model 만 학습하는데, `CharFormer` 는 tokenizer 부분까지 학습 대상입니다.

### Gradient-based Subword Tokenization (GBST)

input to GBST 는 $X \in \mathbb{R}^{L \times d}$, $L$ = sequence length (input characters, utf bytes), $d$ = character embedding dimension

학습을 통해서 최적의 subword segmentation 을 찾는다고 한다.

a subword (block) 은 다음과 같이 정의할 수 있다.

$X_{i:i + b}$ of length $b$ for $1 \leq i \leq L- b$

#### Constructing Candidate Latent Subword Blocks

$s$ = stride, $b$ = subword blocks of size for $1 \leq b \leq M$, $M$ = maximum block size, $F : \mathbb{R}^{b \times d} \in \mathbb{R}^{d}$ = (non-parameterized) strided pooling function

sequence of character embedding $X_{i:i + b} \in \mathbb{R}^{b \times d}$, single subword block representation $X_{b,i} \in \mathbb{R} ^ {d}$

subword blocks 는 다음과 같이 표현이 가능합니다.

$X_{b} = [F(X_{i:i+b});F(X_{(i+s):(i+s)+b});...]$

실제로는 stride $s$ 와 block size $b$ 를 같게 세팅해서, 다시 쓰면 $X_{b} \in \mathbb{R}^{\frac{L}{b} \times d}$ 요렇게 쓸 수 있습니다.


여기서 고민 포인트가 2가지 있을 수 있는데,

* strided implementation
* intra-blocks positions (ordering of characters)

strided implementation 이 어려웠던 이유가 모든 subwords 조합을 찾기가 현실적으로 어려웠기 때문에, $X$ 에 conv1d 연산을 해서 smoothing 느낌을 줬다고 합니다.

subword 내 character 간 positions 정보도 중요한데, 이런 정보를 살리기 위해서 각 subword 별 positional encoding 을 하려고 했지만, 이미 GBST layer 에 넣기 전 conv1d 를 하고 있고 mean-pooling function $F$ 를 사용하고 있어서 충분하다 판단했다고 합니다.

#### Block Scoring Network



### Transformer Stack

## Performance

### Model benchmark

![img](./performances.png)

여러 모델 간 성능 비교를 했을때 기존 T5 와 comparable 한 성능을 보여주고 있다.

### Speed benchmark

![img](./speed_benchmark.png)

기존 character-level 보다도 학습 속도가 빠르다는 것도 보여주고 있다.

## Conclusion

결론 : 굳굳
