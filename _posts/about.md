---
title: About ME
date: 2020-12-12
update: 2021-05-31
tags:
  - About
keywords:
---

## Profile

Alternative Military Service Status : **on duty** (`2020/11/27 ~ 2023/09/26`)

CV : [[PDF] (as of May. 2021)](http://kozistr.tech/cv.pdf)

## Links

|          |                                                                            |
| :------- | :------------------------------------------------------------------------- |
| Email    | **kozistr**@gmail.com                                                      |
| Github   | [https://github.com/kozistr](https://github.com/kozistr)                   |
| Kaggle   | [https://www.kaggle.com/kozistr](https://www.kaggle.com/kozistr)           |
| Linkedin | [https://www.linkedin.com/in/kozistr](https://www.linkedin.com/in/kozistr) |

## Interests

- Lots of challenges like **Kaggle**
- End to End Speaker Diarization (E2E SD)

Previously, I'm also interested in **offensive security**, kind of _Reverse Engineering_, _Linux Kernel Exploitation_.

---

## Challenges & Awards

### Machine Learning

- **Kaggle Challenges** :: Kaggle Challenges :: **Competition Expert**

  > - [Shopee - Price Match Guarantee](https://www.kaggle.com/c/shopee-product-matching) - **solo, top 7% (166 / 2426), Private 0.725** (2021.)
  > - [Cornell Birdcall Identification](https://www.kaggle.com/c/birdsong-recognition) - **team, top 2% (24 / 1395), Private 0.631** (2020.)
  > - [ALASKA2 Image Steganalysis](https://www.kaggle.com/c/alaska2-image-steganalysis) - **solo, top 9% (93 / 1095), Private 0.917** (2020.)
  > - [Tweet Sentiment Extraction](https://www.kaggle.com/c/tweet-sentiment-extraction) - **solo, top 4% (84 / 2227), Private 0.71796** (2020.)
  > - [Flower Classification with TPUs](https://www.kaggle.com/c/flower-classification-with-tpus) - **solo, top 4% (27 / 848), Private 0.98734** (2020.)
  > - [Kaggle Bengali.AI Handwritten Grapheme Classification](https://www.kaggle.com/c/bengaliai-cv19) - **solo, top 4% (67 / 2059), Private 0.9372** (2020.)
  > - [Kaggle Kannada MNIST Challenge](https://www.kaggle.com/c/Kannada-MNIST) - **solo, top 3% (28 / 1214), Private 0.99100** (2019.)

- **NAVER NLP Challenge** :: NAVER NLP Challenge 2018

  > - [Final](https://github.com/naver/nlp-challenge) - _Semantic Role Labeling (SRL)_ **6th place** :: [Presentation]()

- **A.I R&D Challenge** :: A.I R&D Challenge 2018

  > - [Final](http://airndchallenge.com/g5) - _Fake or Real Detection_ - as _Digital Forensic_ Team

- **NAVER A.I Hackathon** :: NAVER A.I Hackathon 2018

  > - [Final](https://github.com/naver/ai-hackathon-2018) - _Kin_ **4th place**, _Movie Review_ **13th place** :: [_summary_paper_](https://github.com/kozistr/naver-ai-hackathon-2018)

- **TF-KR Challenge** :: Facebook TF-KR MNIST Challenge
  > - [TF-KR MNIST Challenge](https://github.com/kozistr/MNIST-Competition) - **Top 9, 3rd price, ACC 0.9964**

### Hacking

- **Boot2Root CTF 2018** :: **2nd place** (Demon + alpha)

- **Harekaze CTF 2017** :: **3rd place** (SeoulWesterns)

- **WhiteHat League 1 (2017)** :: **2nd place** (Demon)
  > - Awarded by 한국정보기술연구원 Received an award of **$3,000**

---

## Work Experience

**Company**

_Machine Learning Researcher_, **Watcha**, **(2020.06.22 ~ Present)**

- Working as a full time.
- Developed training recipes to train sequential recommendation architecture.
  - Build *Future* module for better understand at the time of inference.
  - Apply augmentations to the various features, leads to performance gain & robustness.
  - **In A/B (online)** test (statistically significant `p-value < 0.05`)
      * Compared to the previous model, there’s been no (statistically significant) change.
      * However, it still seems to be better on the offline metrics & training stability. So, we chose to use it.
- Developed a model to predict expected users' view-time of the contents.
  - Predict how many people going to watch, how much time people going to watch the content before the content is supplied. 
  - Find out which features impact users' watch.
- Developed a pipeline to recognize main actors from the poster and still-cut images.
  - Utilize **SOTA** face detector & recognizer.
  - Optimized pre/post processing routines for low `latency`.
- Developed a novel sequential recommendation architecture to recommend what content to watch next.
  - **In A/B (online)** test (statistically significant `p-value < 0.05`)
      * **Paid Conversion** : improved **1.39%p**
      * **Viewing Days** : improved **0.25%p**
      * **Viewing Minutes (median)** : improved **4.10%**
      * **Click Ratio** : improved **4.30%p**
      * **Play Ratio** : improved **2.32%p**
- Developed Image Super Resolution model to upscale movie & tv poster, still-cut images.
  - Optimize the codes for fast `inference time` & `memory-efficiency` on _cpu_.
  - In internal evaluation (qualitative evaluation by the designers), it catches details better & handles higher resolution & takes a little time.

_Machine Learning Engineer_, **Rainist**, **(2019.11.11 ~ 2020.06.19)**

- Worked as a full time.
- Developed the card & bank account transaction category classification models, designed _light-weight purpose_ for the low latency. (now on service)
  - **In A/B (online)** test (statistically significant `p-value < 0.05`)
    - **\*Accuracy** : improved **about 25 ~ 30%p**
- Developed the RESTful API server to serve deep learning model (utilized k8s and open source project)
  - zero failure rate (**0** 40x, 50x errors)
- Developed the classification model for forecasting possibility of loan overdue.

% \*Accuracy : how many people don't update/change their transactions' category.

_Machine Learning Engineer_, **VoyagerX**, **(2019.01.07 ~ 2019.10.04)**

- Worked as an intern.
- Developed speaker verification, diarization models & logic for recognizing the arbitrary speakers recorded from the noisy (real-world) environment.
- Developed a hair image semantic segmentation / image in-paint / i2i domain transfer model for swapping hair domain naturally.

_Penetration Tester_, **ELCID**, **(2016.07 ~ 2016.08)**

- Worked as a part-time job.
- Penetrated some products related to network firewall and anti-virus product.

<br>

**Out Sourcing**

- Developed Korean University Course Information Web Parser (About 40 Universities). **2 times, (2017.7 ~ 2018.3)**
- Developed AWS CloudTrail logger analyzer / formatter. **(2019.09 ~ 2019.10)**

<br>

**Lab**

HPC Lab, KoreaTech, **Undergraduate Researcher**, **(2018.09 ~ 2018.12)**

- Wrote a paper about improved TextCNN model for predicting a movie rate.

---

## Publications

**Paper**

[1] **Kim** et al, [CNN Architecture Predicting Movie Rating](http://ktccs.kips.or.kr/digital-library/23245), 2020. 01.

- Wrote about the CNN Architecture, which utilizes a channel-attention method (SE Module) to TextCNN model, brings performance gain over the task while keeping its latency, generally.
- Handling un-normalized text w/ various convolution kernel size and dropout

**Conferences/Workshops**

[1] kozistr_team, <a href="https://github.com/naver/nlp-challenge/raw/master/slides/Naver.NLP.Workshop.SRL.kozistr_team.pdf">_NAVER NLP Challenge 2018 SRL Task_</a>

- SRL Task, challenging w/o any domain knowledge. Presented about trails & errors during the competition

**Journals**

[1] zer0day, [_Windows Anti-Debugging Techniques_](http://zer0day.tistory.com/335?category=505873) (CodeEngn 2016) Sep. 2016. [PDF](/refs/Anti%20Revering%20Techniques%20%5Bzer0day%5D.pdf)

- Wrote about lots of anti-reversing / debugging (A to Z) techniques avail on window executable binary

**Posts**

[1] kozistr (as a part of team, `Dragonsong`) [towarddatascience](https://towardsdatascience.com/detecting-sounds-with-deep-learning-ed9a41909da0)

- Wrote about audio classifier with deep learning based on the kaggle challenge where we participated

---

## Educations

**Senior** in Computer Engineering from [KUT](https://www.koreatech.ac.kr/eng.do)

---

## Personal Projects

### Computer Languages

> **Python**
> 
> C/C++
> 
> Assembly (x86, x86-64, arm, ...)
> 
> _experienced with lots of languages_

### Machine Learning

**Generative Models**

- **GANs-tensorflow** :: Lots of GAN codes :) :: [Generative Adversary Networks](https://github.com/kozistr/Awesome-GANs)
  > - **ACGAN-tensorflow** :: Auxiliary Classifier GAN in tensorflow :: [code](https://github.com/kozistr/Awesome-GANs/tree/master/ACGAN)
  > - **StarGAN-tensorflow** :: Unified GAN for multi-domain :: [code](https://github.com/kozistr/Awesome-GANs/tree/master/StarGAN)
  > - **LAPGAN-tensorflow** :: Laplacian Pyramid GAN in tensorflow :: [code](https://github.com/kozistr/Awesome-GANs/tree/master/LAPGAN)
  > - **BEGAN-tensorflow** :: Boundary Equilibrium in tensorflow :: [code](https://github.com/kozistr/Awesome-GANs/tree/master/BEGAN)
  > - **DCGAN-tensorflow** :: Deep Convolutional GAN in tensorflow :: [code](https://github.com/kozistr/Awesome-GANs/tree/master/DCGAN)
  > - **SRGAN-tensorflow** :: Super Resolution GAN in tensorflow :: [code](https://github.com/kozistr/Awesome-GANs/tree/master/SRGAN)
  > - **WGAN-GP-tensorflow** :: Wasserstein GAN w/ gradient penalty in tensorflow :: [code](https://github.com/kozistr/Awesome-GANs/tree/master/WGAN)
  > - ... lots of GANs (over 20) :)

**Super Resolution**

- **Single Image Super Resolution** :: Single Image Super Resolution (SISR)
  > - **rcan-tensorflow** :: RCAN implementation in tensorflow :: [code](https://github.com/kozistr/rcan-tensorflow)
  > - **ESRGAN-tensorflow** :: ESRGAN implementation in tensorflow :: [code](https://github.com/kozistr/ESRGAN-tensorflow)
  > - **NatSR-pytorch** :: NatSR implementation in pytorch :: [code](https://github.com/kozistr/NatSR-pytorch)

**I2I Translation**

- **Improved Content Disentanglement** :: tuned version of 'Content Disentanglement' in pytorch :: [code](https://github.com/kozistr/improved-ContentDisentanglement)

**Style Transfer**

- **Image-Style-Transfer** :: Image Neural Style Transfer
  > - **style-transfer-tensorflow** :: Image Style-Transfer in tensorflow :: [code](https://github.com/kozistr/style-transfer)

**Text Classification/Generation**

> - **movie-rate-prediction** :: Korean sentences classification in tensorflow :: [code](https://github.com/kozistr/naver-movie-rate-prediction)
> - **KoSpacing-tensorflow** :: Automatic Korean sentences spacing in tensorflow :: [~~code~~](https://github.com/kozistr/KoSpacing-tensorflow)
> - **text-tagging** :: Automatic Korean articles categories classification in tensorflow :: [code](https://github.com/sales-tagging/text-tagging-ml)

**Speech Synthesis**

- **Tacotron-tensorflow** :: Text To Sound (TTS)
  > - **tacotron-tensorflow** :: lots of TTS models in tensorflow :: [~~code~~](https://github.com/kozistr/tacotron-tensorflow)

**Speech Recognition** :: Speech Recognition

> - [private] :: noisy acoustic speech recognition system in tensorflow :: [~~code~~]()

**Optimizer**

- **AdaBound** :: Optimizer that trains as fast as Adam and as good as SGD

  > - **AdaBound-tensorflow** :: AdaBound Optimizer implementation in tensorflow :: [code](https://github.com/kozistr/AdaBound-tensorflow)

- **RAdam** :: On The Variance Of The Adaptive Learning Rate And Beyond in tensorflow
  > - **RAdam-tensorflow** :: RAdam Optimizer implementation in tensorflow :: [code](https://github.com/kozistr/RAdam-tensorflow)

**R.L**

- **Rosseta Stone** :: Hearthstone simulator using C++ with some reinforcement learning :: [code](https://github.com/utilForever/RosettaStone)

### Plug-Ins

IDA pro plug-in - Golang ELF binary (x86, x86-64), RTTI parser

- Recover stripped symbols & information and patch byte-codes for being able to hex-ray

### Open Source Contributions

- [syzkaller](https://github.com/google/syzkaller) :: New Generation of Linux Kernel Fuzzer :: Minor contribution [#575](https://github.com/google/syzkaller/pull/575)
- [simpletransformers](https://github.com/https://github.com/ThilinaRajapakse/simpletransformers) :: Transformers made simple w/ training, evaluating, and prediction possible w/ one line each. :: Minor contribution [#290](https://github.com/ThilinaRajapakse/simpletransformers/pull/290)

### Security, Hacking

**CTFs, Conferences**

- [POC](http://powerofcommunity.net/) 2016 Conference Staff
- [HackingCamp](http://hackingcamp.org/) 15 CTF Staff, Challenge Maker
- [CodeGate](https://www.codegate.org/) 2017 OpenCTF Staff, Challenge Maker
- [HackingCamp](http://hackingcamp.org/) 16 CTF Staff, Challenge Maker
- [POX](http://www.powerofxx.com/) 2017 CTF Staff, Challenge Maker
- [KID](http://www.powerofxx.com/) 2017 CTF Staff, Challenge Maker
- Belluminar 2017 CTF Staff
- [HackingCamp](http://hackingcamp.org/) 17 CTF Staff, Challenge Maker
- [HackingCamp](http://hackingcamp.org/) 18 CTF Staff, Challenge Maker

**Teams**

Hacking Team, [**Fl4y**](http://f1ay.com/). **Since 2017.07 ~**

Hacking Team, [**Demon**](https://demonteam.org/) by [_POC_](http://powerofcommunity.net/). **Since 2014.02 ~ 2018.08**

---

### Presentations

**2018**

[2] Artificial Intelligence ZeroToAll, Apr 2018.

[1] Machine Learning ZeroToAll, Mar 2018.

**2015**

[1] Polymorphic Virus VS AV Detection, Oct 2015.

**2014**

[1] Network Sniffing & Detection, Oct, 2014.
