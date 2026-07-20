# Skin Lesion Classifier: Fairness Audit

This project investigates whether deep-learning models can classify skin lesions with equitable accuracy and recall across diverse skin tones.

## Research Question

Can pretrained computer-vision models classify skin lesions fairly across light and dark skin tones, or does underrepresentation in dermatology datasets limit their performance?

## Approach

- Train and fine-tune CNN models using HAM10000.
- Benchmark EfficientNetB0 and EfficientNetB3 on HAM10000 and ISIC 2019.
- Evaluate accuracy, precision, recall, macro F1, and balanced accuracy.
- Use Diverse Dermatology Images (DDI) to investigate performance across skin tones.
- Explore data augmentation and class-balancing methods to reduce disparities.


## Datasets

- [HAM10000](https://www.kaggle.com/datasets/kmader/skin-cancer-mnist-ham10000)
- [Diverse Dermatology Images](https://stanfordaimi.azurewebsites.net/datasets/35866158-8196-48d8-87bf-50dca81df965)
- [ISIC 2019](https://www.kaggle.com/datasets/andrewmvd/isic-2019) — architecture benchmarking

## Team

Avani Joshi, Daisy Phung, Phuong Hoang, Tigist Wujira, William Acosta Lora, Belyse Munezero, Bogning Guy-robert

> This educational research project is not a medical diagnostic tool.
