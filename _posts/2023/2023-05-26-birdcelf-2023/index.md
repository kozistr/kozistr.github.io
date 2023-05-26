---
title: (Kaggle) BirdCLEF 2023 - 24th (top 2%) place solution
date: 2023-05-26
update: 2023-05-26
tags:
  - Deep-Learning
  - Kaggle
keywords:
  - audio
  - birdclef
  - cv
  - cnn
---

* Original Post : <https://www.kaggle.com/competitions/birdclef-2023/discussion/412996>

## Architecture

Here's the pipeline.

1. pre-train on 2020, 2021, 2022, xeno-canto datasets.
2. fine-tune on 2023 dataset (based on the pre-trained weight).
    * minor classes (<= 5 samples) are included in all folds

I applied the same training recipes (e.g. augmentation, loss functions, ...) each step.

### CV

(although based on my few experiments) my cv score and LB/PB are kinda correlated.

| Exp | CV | LB | PB | Note |
| :---: | :---:| :---: | :---: | :---: |
| `effnetb0` | 0.7720 | 0.82438 | 0.73641 | multiple losses, 5 folds |
| `effnetb0` | 0.7693 | 0.82402 | 0.73604 | clipwise loss, 5 folds |
| `eca_nfnet_l0` | 0.7753 | 0.80731 | 0.71845 | clipwise loss, single fold |

### Model

I used SED architecture with the `efficientnet_b0` backbone. Also, I tested `eca_nfnet_l0` backbone, and it has a better cv score, but I can't use it due to the latency.

### Training recipe

* [**Important**] pre-training
* [**Important**] augmentations
    * waveform-level
        * [Important] or mixup on a raw waveform
        * gaussian & uniform noise
        * pitch shift
        * [Important] background noise
    * spectrogram-level
        * spec augment
* log-mel spectrogram
    * n_fft & window size 1024, hop size 320, min/max freq 20/14000, num_mels 256, top_db 80. (actually, I wanted n_fft with 2048, but I set it to 1024 by my mistake)
* trained on 5 secs clips
* stratified k fold (5 folds, on primary_label)
* label smoothing 0.1
* multiple losses (from [birdcelf 2021 top 5](https://www.kaggle.com/competitions/birdclef-2021/discussion/243351))
  * bce loss on clip-wise output w/ weight 1.0
  * bce loss on max of segment-wise outputs w/ weight 0.5
* fp32
* AdamW + cosine annealing (w/o warmup)
  * 50 epochs (usually converged between 40 ~ 50)

## Inference

I can ensemble up to 4 models with Pytorch (it took nearly 2 hrs). To mix more models, I utilized ONNX and did graph optimization, and it makes one more model to be ensembled! Finally, I can ensemble 5 models (single model 5 folds). Also, to utilize the full CPU, I do some multi-processing stuff.

## Not worked (perhaps I might be wrong)

* secondary label (both hard label, soft label (e.g. 0.3, 0.5))
* focal loss
* longer clips (e.g. 15s)
* post-processings (proposed in the BirdCLEF 2021, and 2022 competitions)
  * aggregate the probs of the previous and next segments.
  * if there's a bird above the threshold, multiply constants on all segments of the bird.)

I hope this could help!

Thanks : )
