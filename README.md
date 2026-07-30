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

## What we are investigating

Medical-image datasets do not represent every population equally. A model can
learn this imbalance and perform differently across groups.

Our research question is:

> How does dataset composition affect a CNN that categorizes skin-lesion images?

HAM10000 and DDI have different images and label spaces. We evaluate each model
within its own dataset. We do not compare their test accuracy directly.

## What the application does

The application lets you:

- Upload one JPEG, PNG, GIF, or WebP image up to 4.5 MB.
- Choose one of the three trained models.
- View the highest model score.
- View the five highest class scores.

The application loads a model only when it receives a prediction request. It
keeps one model in memory at a time.

## Models

| Model | Training data | Output |
| --- | --- | --- |
| HAM10000 CNN | HAM10000 dermatoscopic images | 7 lesion categories |
| EfficientNet-B0 | HAM10000 dermatoscopic images | 7 lesion categories |
| DDI CNN | DDI clinical images | 16 project-defined disease groups |

The custom CNNs use the mean and standard deviation recorded during training.
EfficientNet-B0 performs its own input rescaling.

The 16 DDI groups include an `Other or miscellaneous` output. This output
preserves the class order used when the saved model was trained.

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

## Current limits

- The models are not clinically validated.
- A model score is not a calibrated medical probability.
- The models do not use medical history or other clinical information.
- HAM10000 uses dermatoscopic images. A phone image can produce unreliable
  results.
- DDI uses clinical images. Its image format differs from HAM10000.
- The current DDI evaluation does not report results by skin-tone group.
- The DDI training split can contain augmented versions of the same source
  image in different partitions.

## Data

- [HAM10000 dataset](https://www.kaggle.com/datasets/kmader/skin-cancer-mnist-ham10000)
- [HAM10000 paper](https://doi.org/10.1038/sdata.2018.161)
- [Diverse Dermatology Images](https://stanfordaimi.azurewebsites.net/datasets/35866158-8196-48d8-87bf-50dca81df965)
- [DDI paper](https://doi.org/10.1126/sciadv.abq6147)

## Team

AI4ALL Ignite Group 17A:

Avani Joshi, Daisy Phung, Phuong Hoang, Tigist Wujira, William Acosta Lora,
Belyse Munezero, and Bogning Guy-Robert.
