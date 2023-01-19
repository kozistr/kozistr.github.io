---
title: Default Prediction (Kaggle) - 135th place solution
date: 2022-08-17
update: 2023-01-19
tags:
  - Deep-Learning
keywords:
  - kaggle
  - america-express
  - default-prediction
  - gbm
  - transformer
  - cnn
  - nn
---

* Original Post : <https://www.kaggle.com/competitions/amex-default-prediction/discussion/347996>

## TL;DR

I couldn't spend lots of time on the competition (only made 30 submissions :(). In the meantime, the competition metric is kinda noisy and we also expected a shake-up/down (not a planet-scale, but for some cases). So, my strategy is focused on protecting a shake-down as possible i can (instead of bulding new features).

## Overview

My strategy is `building various datasets, folds, seeds, models`. I'll explain them one by one.

### Data (Pre-Processing)

My base dataset is based on the raddar's dataset (huge thanks to @raddar). Also, most of the pre-processing logic can be found in the `Code` section.

The differences are...

1. using more lagging features (to 3 months)
2. not just using a single dataset, but multiple datasets (I just added features incrementally) for the variousity.

   * A dataset
   * B dataset = A dataset + (features)
   * C dataset = B dataset + (another features)

I didn't check the exact effectiveness of using the datasets on multiple models, however, it seems that positive effects when ensembling in my experiments.

### Model

I built 6 models (3 gbtm, 3 nn) to secure the variousity and roboustness. Also, a few models (LightGBM, CatBoost) are trained on multiple seeds (1, 42, 1337) with the same training recipe. Lastly, some models are trained with 10, 20 folds.

* Xgboost
* CatBoost
* LightGBM (w/ dart, w/o dart)
* 5-layers NN
* stacked bi-GRU
* Transformer

Here's the best CV by the model (sorry for the LB, PB scores, I rarely submitted a single model)

| Model | CV | Note |
| :---: | :---: | :---: |
| bi-GRU | 0.787006 | |
| Transformer | 0.785647 | |
| NN | 0.789874 | |
| Xgboost | 0.795940 | only using the given(?) cat features as `cat_features` |
| CatBoost | 0.797058 | using all `np.int8` features as `cat_features` |
| LighGBM | 0.798410 | w/ dart |

The CV score of the single neural network model isn't good. Nevertheless, when ensembling, It works good with the tree-based models.

### Blend (Ensemble)

Inspired by the discussion [log-odds](https://www.kaggle.com/competitions/amex-default-prediction/discussion/329103), I found weighted ensemble with log-odds probability is better than a normal weighted ensemble (I tuned the weights with `Optuna` library based on the OOF). But, one difference is not `ln`, but `log10`. In my experiments, It's better to optimize the weights with `log10`. However, It brings little boost (4th digit difference).

I ensembled about 50 models, and there's no post-processing logic.

## Summary

The final score is
| Model | CV | Public LB | Private LB |
| :---: | :---: | :---: | :---: |
| Ensemble | `0.8009` | `0.7992` | `0.8075` |

Last day of the competition, I selected about 1600th Public LB solution (my best CV solution). Luckily, `Trust CV score` wins again :) (Actually, my best CV is also my best LB, and when the cv score increases, lb score increases, so there's little difference between best CV & LB for my cases)

After the competition, I checked the correlation among the scores (CV vs Private LB, CV vs Public LB). then, I found the CV score is more correlated with Private LB than Public LB in my case.

### Works

* blending various models (gbtm + nn), even if there're huge CV gaps 
  * e.g. nn 0.790, lgbm 0.798
* (maybe) various datasets, models, seeds bring a robust prediction I guess

### Didn't work

* pseudo labeling (w/ hard label)
  * maybe `soft-label` or `hard label` with a more strict threshold could be worked i guess.
* deeper NN models
  * 5-layers nn is enough
* num of folds doesn't matter (5 folds are enough)
  * there's no significant difference between 5 folds vs 20 folds
* rank weighted ensemble

I hope this you could help :) Thank you!
