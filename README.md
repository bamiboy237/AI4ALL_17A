# DermAware

We built DermAware to investigate how dataset composition affects computer-vision models for skin-lesion categorization.

To do this, we trained three models with two datasets:

- A custom CNN trained with HAM10000.
- An EfficientNet-B0 model trained with HAM10000.
- A custom CNN trained with Diverse Dermatology Images (DDI).

[Open DermAware](https://ai-4-all-17-a.vercel.app)

> [!CAUTION]
> DermAware is a research project, not a medical device. It does not provide a
> diagnosis or treatment advice. Contact a qualified healthcare professional
> if you have a concern about a skin lesion.

## Project Summary
Categorizing and analyzing skin lesion types by using machine learning and computer vision, in order to accelerating the diagnosis of skin cancer condition. Applying CNN, ANN, and EfficientNet algorithms, the project will evaluate the Diverse Dermatology Images (DDI) and HAM10000 datasets to classify dermatological conditions across individuals with diverse skin tones.
By analyzing model accuracy across diverse patient groups and exploring methods to reduce bias, our project aims to contribute to the development of a fair and more reliable model for the healthcare industry.


## Training Data
- HAM10000 (10,015 dermatoscopic images across 7 lesion categories, collected at the Medical University of Vienna). HAM10000 will serve as the primary training set given its size and quality
- Diverse Dermatology Images (DDI) dataset (656 clinical photographs from 578 patients, curated by Stanford AIMI specifically to improve the representation of darker skin types. DDI will be expanded through data augmentation to address its small size and class imbalance, allowing us to evaluate model performance across both light and dark skin tones.
  
## Models

| Model | Training Data | Architecture | Input Shape | Output Classes |
| --- | --- | --- | --- | --- |
| **HAM10000 CNN** | HAM10000 (10,015 images) | Custom CNN | 224×224 RGB | 7 lesion types |
| **EfficientNet-B0** | HAM10000 (10,015 images) | Transfer learning (ImageNet pretrained) | 224×224 RGB | 7 lesion types |
| **DDI CNN** | Diverse Dermatology Images (656 images + augmentation) | Custom CNN | 224×224 RGB | 16 disease groups |

### Model Details

#### HAM10000 CNN
- **Why this model**: Custom CNN trained from scratch on dermatoscopic images, serving as a baseline to understand what features the network learns directly from the task-specific data without ImageNet transfer.
- **Data split**: Stratified by diagnosis, grouped by lesion_id to prevent data leakage (images of the same lesion cannot appear in train/val/test)
- **Augmentation**: Random horizontal flip, rotation (±20°), brightness/contrast adjustments
- **Preprocessing**: Resize to 224×224, normalize using mean/std computed on training set

#### EfficientNet-B0
- **Why this model**: Transfer learning leverages features learned from ImageNet (1.2M images, diverse natural objects). Efficient architecture (smaller parameter count) with strong empirical performance on medical imaging tasks.
- **Training strategy**: Two-stage fine-tuning
  - Stage 1: Freeze base layers, train classification head only (15 epochs)
  - Stage 2: Unfreeze top 30 base layers, fine-tune entire network (15 epochs)
- **Data split**: Same as HAM10000 CNN (stratified, lesion-grouped)
- **Preprocessing**: Resize to 224×224. Note: EfficientNet performs its own input rescaling internally.

#### DDI CNN
- **Why this model**: Trained on Diverse Dermatology Images (curated for diverse skin tone representation). Addresses representation gap in HAM10000 (which is skewed toward light skin tones). Uses a larger output space (16 disease groups) reflecting real-world diagnostic complexity.
- **Data challenge**: DDI is smaller (656 images) compared to HAM10000 (10,015). Addressed through data augmentation.
- **Target classes**: 16 project-defined groups including "Other or miscellaneous" to preserve unclassified cases
- **Preprocessing**: Same as HAM10000 CNN (224×224, normalize by training set mean/std)

## Evaluation & Results

See the **[Evaluation page](https://ai-4-all-17-a.vercel.app/evaluation)** in the application for interactive performance visualizations, metrics tables, and fairness analysis by skin tone.

### Key Visuals

| Figure | Description |
| --- | --- |
| **HAM10000 Distribution** | Class balance across 7 lesion categories. Melanocytic nevus (NV) is ~50%; melanoma (MEL) is ~10%. |
| **Confusion Matrices** | Raw and normalized confusion matrices for each model, showing which classes are confused with each other. |
| **Per-Class Metrics** | Precision, recall, and F1-score for each lesion category. Highlights classes where models struggle. |
| **Model Comparison** | Side-by-side accuracy, F1-score, and balanced accuracy for HAM10000 CNN, EfficientNet-B0, and DDI CNN. |

### Test Set Performance

**EfficientNet-B0 (HAM10000 test set):**
- Test Accuracy: [TODO: fill from training]
- Macro F1-Score: [TODO: fill from training]
- Balanced Accuracy: [TODO: fill from training]
- Macro ROC-AUC: [TODO: fill from training]

**HAM10000 CNN (HAM10000 test set):**
- Test Accuracy: [TODO: fill from training]
- Macro F1-Score: [TODO: fill from training]
- Balanced Accuracy: [TODO: fill from training]
- Macro ROC-AUC: [TODO: fill from training]

**DDI CNN (DDI test set):**
- Test Accuracy: [TODO: fill from training]
- Macro F1-Score: [TODO: fill from training]
- Balanced Accuracy: [TODO: fill from training]

### Fairness & Skin Tone Analysis

The current evaluation **does not yet report results stratified by skin-tone group** (e.g., Fitzpatrick categories).
This is the highest-priority next step. If Fitzpatrick labels are available in the DDI metadata:

**Planned metrics:**
- Accuracy of HAM10000 CNN on light (FST I–III) vs. dark (FST IV–VI) skin tones
- Accuracy of DDI CNN on light vs. dark skin tones
- Accuracy gap and disparity measures
- Per-class fairness analysis (e.g., does melanoma detection disparities vary by skin tone?)

To generate these results, see `scripts/generate_evaluation_metrics.py`.

## What the application does
The application lets you:

- Upload one JPEG, PNG, GIF, or WebP image up to 4.5 MB.
- Choose one of the three trained models.
- View the highest model score.
- View the five highest class scores.

## How a request moves through the system
1. The React client checks the selected file.
2. The client sends the image and model name to the FastAPI endpoint.
3. The API validates and resizes the image.
4. The API applies the preprocessing for the selected model.
5. TensorFlow returns one score for each class.
6. The client shows the five highest scores.

| Layer | Technology |
| --- | --- |
| Web client | React 18 |
| API | FastAPI |
| Models | TensorFlow and Keras |
| Hosting | Vercel |

## Repository

```text
.
├── api/
│   └── index.py
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   └── tests/
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── package-lock.json
├── ddi_cnn_improved.keras
├── ham10000_cnn_improved.keras
├── ham10000_efficientnet_b0.keras
├── requirements.txt
└── vercel.json
```

The `.keras` files use Git LFS.

## Run it locally

You need:

- Python 3.12
- Node.js 18 or later
- Git LFS

Clone the repository and download the model files:

```bash
git clone https://github.com/bamiboy237/AI4ALL_17A.git
cd AI4ALL_17A
git lfs install
git lfs pull
```

Start the API:

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r backend/requirements.txt
python backend/main.py
```

Start the React client in another terminal:

```bash
cd frontend
cp .env.example .env
npm ci
npm start
```

Open `http://localhost:3000`.

## API

All API routes use the `/api` prefix.

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/api/health` | Check the service and loaded model |
| `GET` | `/api/models` | List available models |
| `POST` | `/api/predict` | Process one image |
| `POST` | `/api/predict-batch` | Process multiple images |

Example:

```bash
curl -X POST http://localhost:8000/api/predict \
  -F "file=@lesion.jpg" \
  -F "model=ddi"
```

Valid model values are:

- `ham10000`
- `ham10000_b0`
- `ddi`

## Tests

Run the backend tests:

```bash
python -m pytest backend/tests
```

Run the frontend tests:

```bash
cd frontend
CI=true npm test -- --runInBand
```

Build the frontend:

```bash
cd frontend
npm run build
```

## Generate Evaluation Metrics

To evaluate models on test data and produce confusion matrices, per-class metrics, and fairness analysis:

```bash
python scripts/generate_evaluation_metrics.py
```

This script generates:
- CSV files with overall metrics (accuracy, F1, balanced accuracy, ROC-AUC)
- CSV files with per-class metrics (precision, recall, F1-score per lesion category)
- Confusion matrix PNG charts (raw counts and normalized)
- Per-class performance bar charts (PNG)
- Fairness metrics by skin tone group (if Fitzpatrick labels available in DDI metadata)

**Output directory**: `evaluation_results/`

**Note**: The script currently has template structure. To run it fully:
1. Provide HAM10000 test data loading (images, labels, metadata)
2. Provide DDI test data loading (images, labels, Fitzpatrick groups if available)
3. Uncomment the evaluation function calls in the script
4. Run the script to populate metrics

See `scripts/generate_evaluation_metrics.py` for detailed implementation and comments.

## Current Limits & Next Steps
- The models are not clinically validated.
- A model score is not a calibrated medical probability.
- The models do not use medical history or other clinical information.
- HAM10000 uses dermatoscopic images. A phone image can produce unreliable
  results.
- DDI uses clinical images. Its image format differs from HAM10000.
- The current DDI evaluation does not report results by skin-tone group.
- The DDI training split can contain augmented versions of the same source
  image in different partitions.

## Citations and Data Sources
- [HAM10000 dataset](https://www.kaggle.com/datasets/kmader/skin-cancer-mnist-ham10000)
- [HAM10000 paper](https://doi.org/10.1038/sdata.2018.161)
- [Diverse Dermatology Images](https://stanfordaimi.azurewebsites.net/datasets/35866158-8196-48d8-87bf-50dca81df965)
- [DDI paper](https://doi.org/10.1126/sciadv.abq6147)
1. Abadi, M., Barham, P., Chen, J., Chen, Z., Davis, A., Dean, J., … Wicke, M. (2016). TensorFlow: A system for large-scale machine learning. OSDI ’16.
https://www.usenix.org/system/files/conference/osdi16/osdi16-abadi.pdf


2. AI Dermatologist. (2025). AI Dermatologist: Skin scanner. Ai-Derm.com.
https://ai-derm.com

3. Alipour, N., Burke, T., & Courtney, J. (2024). Skin type diversity in skin lesion datasets: A review. Current Dermatology Reports, 13(3), 198–210.
https://doi.org/10.1007/s13671-024-00440-0


4. Cleveland Clinic. (2022, October 17). Skin lesions: What they are, types, causes & treatment. Cleveland Clinic.
https://my.clevelandclinic.org/health/diseases/24296-skin-lesions
Tschandl, P., Rosendahl, C., & Kittler, H. (2018). The HAM10000 data
set, a large collection of multi-source dermatoscopic images of common pigmented skin lesions. Scientific Data, 5, 180161.
 https://doi.org/10.1038/sdata.2018.161

4. Daneshjou, R., Vodrahalli, K., Novoa, R. A., Jenkins, M., Liang, W., Rotemberg, V., … Chiou, A. S. (2022). Disparities in dermatology AI performance on a diverse, curated clinical image set. Science Advances, 8(32), eabq6147.
 https://doi.org/10.1126/sciadv.abq6147

6. Esteva, A., Kuprel, B., Novoa, R. A., Ko, J., Swetter, S. M., Blau, H. M., & Thrun, S. (2017). Dermatologist-level classification of skin cancer with deep neural networks. Nature, 542(7639), 115–118.
 https://doi.org/10.1038/nature21056

7. Tan, M., & Le, Q. V. (2019). EfficientNet: Rethinking model scaling for convolutional neural networks. Proceedings of the 36th International Conference on Machine Learning (ICML 2019), 6105–6114.
 https://proceedings.mlr.press/v97/tan19a.html



## Team

AI4ALL Ignite Group 17A:

Avani Joshi, Daisy Phung, Phuong Hoang, Tigist Wujira, William Acosta Lora,
Belyse Munezero, and Bogning Guy-Robert.
