---
title: (Kaggle) Screening Mammography Breast Cancer Detection - 16th (top 1%) place solution
date: 2023-02-28
update: 2023-02-28
tags:
  - Deep-Learning
  - Kaggle
keywords:
  - radiological-society-of-north-america
  - rsna
  - mammography
  - cv
  - cnn
---

* Original Post : <https://www.kaggle.com/competitions/rsna-breast-cancer-detection/discussion/391133>

## Data

### Preprocessing

My preprocessing code heavily depends on the public notebooks (eg. remove letters, crop breast via contour).

1. decode `.dicom` to `.jpeg` with `dicomsdl` & `nvjpeg2000`.
2. crop edge (margin pixel 10)
3. extract breast with `opencv2` (contour based)
4. resize to 1536x960. (I roughly guess that resizing into a 1.5 ~ 2.0 aspect ratio is fine.)

In my experiment, windowing doesn't affect the score positively, so I decide not to use it.

### Augmentation

Heavy augmentation works well. Light augmentation tends to overfit.

* v/hflip
* scale / rotate
* brightness / contrast
* cutout (coarse dropout with large patch size)
* mixup

## Architecture

I couldn't spend much time running various experiments due to a lack of time & computing resources. So, I only tested few backbones & training recipes. (about 70% of my submissions are runtime errors & mistakes lol)

Here's a full pipeline.

1. pre-train segmentation model with the `cbis-ddsm` & `vindr` datasets.
    * segment: provided RoI image.
    * label: `malignant` to cancer / `BIRADS 5` to cancer.
    % Of course, the label doesn't perfectly correlate with the competition standards. But, I roughly think that maybe it could help train the model in some ways.
2. train with competition data (initialize the weight with the pre-trained model)
   * segment: inferred with the pre-trained model.
   * auxiliary: given meta-features (total 11 features).
3. re-label the external data with the `step 2` model.
4. re-train with competition data (initialize with `step 3` model)
5. train a meta-classifier (oof + meta-features (e.g. laterality, age, ...))

For a baseline, I run step 1 ~ 2, 5 and achieve CV 0.4885 LB 0.59 (PB 0.46). Also, I test only with the `cbis-ddsm` dataset for pre-training, and there were about 0.02 drops on CV & LB, but the same score on PB (CV 0.4656 LB 0.57 PB 0.46).

A week before the deadline, I finished up to step ~ 5 and got CV 0.5012 LB 0.55 (PB 0.51). Sadly, I didn't choose it as a final submission : (

Last day of the competition, I ensembled `effnet_v2_s` backbone and got CV 0.5063 LB 0.56 (PB 0.49).

Lastly, I choose the best LB & CV for the final submission.

### Meta-Classifier

I built a meta-classifier with meta-features like age, laterality, and the (per-breast) statistics of the predictions. Usually, It gives ~ 0.02 improvements on the CV & LB (also PB).

I'm worried about overfitting into some meta-features (eg. machine id, (predicted) density, ...), so I decided to use only 3 auxiliary features (age, site_id, laterality) to train the model.

* feature: age, site_id, laterality, (mean, std, min, max) of the predictions.
* cv: stratified k fold (5 folds)
* model: CatBoost

## Works

* higher resolution (1536x768 ~ 1024) is good.
* external data
  * it gives about +0.02 boosts.
* architecture
  * encoder: backbone: `effnet-b3` works best
  * decoder: u-net++
* augmentation
* mixup (alpha 1.0)
* loss
  * 0.6 * cls_loss (cross_entropy) + 0.4 * seg_loss (dice) + 0.1 * aux_loss (cross-entropy)
* stratified group k fold (4 folds)
* meta-classifier
* TTA

thanks for reading! I hope this could help you :)
