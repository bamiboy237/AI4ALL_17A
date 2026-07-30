# DermAware

DermAware is a research prototype for skin-lesion image classification. It
compares a custom convolutional neural network (CNN) with an EfficientNet-B0
model on the HAM10000 dataset.

[Open the live demo](https://ai-4-all-17-a.vercel.app)

> [!CAUTION]
> DermAware is not a medical device. It is not clinically validated. Do not
> use its output for diagnosis or treatment. Contact a qualified healthcare
> professional if you have a concern about a skin lesion.

## Project goal

Dermatology datasets often underrepresent darker skin tones. This can cause a
model to work differently across population groups.

This project asks:

> Can a skin-lesion classifier maintain useful recall across skin tones, or
> does dataset imbalance limit its performance?

The research uses two datasets:

- **HAM10000** supplies 10,015 dermatoscopic images in seven lesion classes.
- **Diverse Dermatology Images (DDI)** supplies clinical images from diverse
  skin tones for fairness analysis.

The live application currently serves two HAM10000 models. DDI inference is
disabled until the team restores and verifies the model's 16-class label
mapping.

## Current capabilities

- Upload one JPEG, PNG, GIF, or WebP image up to 4.5 MB.
- Select the custom HAM10000 CNN or EfficientNet-B0.
- View the predicted lesion class and the model score.
- View the five highest class scores.
- Use the same React and FastAPI application locally or on Vercel.

## System design

| Layer | Technology | Responsibility |
| --- | --- | --- |
| Web client | React 18 | Image selection, model selection, and result display |
| API | FastAPI | Validation, preprocessing, inference, and response formatting |
| Models | TensorFlow/Keras | Seven-class HAM10000 classification |
| Hosting | Vercel | React build and Python API |

The API loads a model only when a request needs it. It keeps one model in
memory at a time to control memory use.

## Repository layout

```text
.
├── api/
│   └── index.py              # Vercel entry point
├── backend/
│   ├── main.py               # FastAPI application
│   ├── requirements.txt      # Python dependencies
│   └── tests/                # Backend tests
├── frontend/
│   ├── public/
│   ├── src/                  # React application
│   ├── package.json
│   └── package-lock.json
├── *.keras                   # Model files managed with Git LFS
├── requirements.txt          # Vercel Python dependencies
└── vercel.json               # Deployment configuration
```

## Run the project locally

### Requirements

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

Start the web client in a second terminal:

```bash
cd frontend
cp .env.example .env
npm ci
npm start
```

Open `http://localhost:3000`.

## API

All endpoints use the `/api` prefix.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/health` | Return service and model status |
| `GET` | `/api/models` | List the available models |
| `POST` | `/api/predict` | Classify one image |
| `POST` | `/api/predict-batch` | Classify multiple images |

Example:

```bash
curl -X POST http://localhost:8000/api/predict \
  -F "file=@lesion.jpg" \
  -F "model=ham10000"
```

Valid model values are `ham10000` and `ham10000_b0`.

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

## Research limits

- HAM10000 contains dermatoscopic images. A phone photo can produce unreliable
  results.
- A high model score does not mean that a prediction is medically correct.
- The deployed models do not use patient history or clinical context.
- The current application does not yet report validated performance by skin-tone
  group.

## Data and references

- [HAM10000 dataset](https://www.kaggle.com/datasets/kmader/skin-cancer-mnist-ham10000)
- [HAM10000 paper](https://doi.org/10.1038/sdata.2018.161)
- [Diverse Dermatology Images](https://stanfordaimi.azurewebsites.net/datasets/35866158-8196-48d8-87bf-50dca81df965)
- [DDI paper](https://doi.org/10.1126/sciadv.abq6147)

## Team

This project was developed by AI4ALL Ignite Group 17A:

Avani Joshi, Daisy Phung, Phuong Hoang, Tigist Wujira, William Acosta Lora,
Belyse Munezero, and Bogning Guy-Robert.
