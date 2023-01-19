---
title: (Kaggle) COVID-19 Detection - 47th (top 4%) place solution
date: 2021-08-09
update: 2023-01-19
tags:
  - Deep-Learning
  - Kaggle
keywords:
  - siim-fisabio-rsna
  - covid19-detection
  - classification
  - object-detection
  - cnn
---

* Original Post : <https://www.kaggle.com/competitions/siim-covid19-detection/discussion/263830>

## TL;DR

I only got Kaggle GPU/TPU, couldn't experiment with many models with various training recipes. So, I try to implement the training codes which work on TPU as possible as I can! Usually, I trained the object-detection model on GPU, image classifier for study-level on TPU.

Anyway, I hope this solution helps you in some ways :)

## Study-Level

I used `effnet-b7` and `effnet-b6` models w/o the auxiliary branches (for segmentation head). The models were trained on grouped 5 folds and on different resolutions, 640, 800 respectively.

And simply averaging for ensembling the models. LB score for mAP is 0.453. 

Additionally, I utilized `multi-paths dropout` (total 5 paths) to regularize the model & found proper augmentations on my training recipes. Compared to the public notebooks, which introduce `effnet-b7` as a baseline, I guess those helps to boost CV/LB score.

Lastly, I didn't apply TTA for the study-level because of the limitation of inference time.

## None Classifier

I just used study-level models' negative confidence scores, and it boosts LB +0.003. Also, I tried to ensemble study-level models and opacity 2class classifier, but it dropped CV/LB scores.

## Image-Level

Overall, I experimented with 3 types of models, `Yolov5`, `CascadeRCNN`, `VFNet`. In my recipes, `VFNet` achieves `bbox mAP` 0.55~, but the LB/PB score is lower than I guess.

And `CascadeRCNN` didn't go well with Yolov5 models. `Yolov5` and `Yolov5 + CascadeRCNN` have comparable CV/LB scores, but only the `Yolov5` series have better LB/PB scores than the combined. (maybe the correlation of both models is high, I didn't check yet).

Finally, I ensembles 3 series of Yolov5, `yolov5x6`, `yolov5l6`, `yolov5m6` respectively, and applied WBF with the same weights.

## Works for me

* label smoothing (0.05 is best on my experiments)
* 640 ~ 800 resolutions for study-level (It's better than 512 on my experiments)
* 512 resolution for image-level
* WBF (iou_threshold : 0.6, skip_box_threshold : 0.01)
* TTA for image-level
* inference higher resolution.
  * train 512 and inference 640 resolution for image-level (LB +0.003)
* light augmentations
  * HorizontalFlip
  * CutOut (huge patch, small number of patches)
  * Brightness
  * Scale/Shift/Rotate

## Not-works for me

* train on high-resolution for study-level & image-level
  * got higher CV score, but comparable LB, PB scores for image-level
* effnetv2 series
* the auxiliary losses
* external data (w/ pseudo labeling)
* heavy augmentations for study-level models
* post-processing
  * calibrating the confidence score to filter `none` class
  * modified WBF which introduced in [here](https://www.kaggle.com/shonenkov/wbf-over-tta-single-model-efficientdet)

## Reflections

* One thing I regretted is the diversity of the models. Both study/image-level models of mine have a high prediction correlation because they are the same series (e.g. effnet, yolov5).
* trust CV

## Source Code

You can check out my inference pipeline. [inference code](https://www.kaggle.com/kozistr/infer-efnb6-7-yolov5m-l-x6?scriptVersionId=69448986)

Thank you very much!
