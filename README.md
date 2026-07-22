---
title: Skin Lesion Classification API
emoji: 🩺
colorFrom: blue
colorTo: purple
sdk: docker
app_port: 7860
pinned: false
---

# Skin Lesion Classifier: Fairness Audit & Web Application

This project investigates whether deep-learning models can classify skin lesions with equitable accuracy across diverse skin tones, and provides a production-ready web application for interactive classification.

## Overview

This repository contains:
1. **Research Component**: Fairness audit across skin tones using HAM10000 and DDI datasets
2. **Web Application**: Interactive React + FastAPI app for skin lesion classification
3. **Pre-trained Models**: Keras CNN models optimized for HAM10000 and DDI datasets

## Research Question

Can pretrained computer-vision models classify skin lesions fairly across light and dark skin tones, or does underrepresentation in dermatology datasets limit their performance?

## Research Approach

- Train and fine-tune CNN models using HAM10000
- Benchmark EfficientNetB0 and EfficientNetB3 on HAM10000 and ISIC 2019
- Evaluate accuracy, precision, recall, macro F1, and balanced accuracy
- Use Diverse Dermatology Images (DDI) to investigate performance across skin tones
- Explore data augmentation and class-balancing methods to reduce disparities

## Quick Start: Web Application

### Prerequisites
- Python 3.8+
- Node.js 14+
- 4GB+ RAM

### One-Command Setup (macOS/Linux)
```bash
bash start.sh
```

### Manual Setup

**Terminal 1 - Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python main.py
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
npm start
```

Open browser to `http://localhost:3000`

### Windows Setup
```bash
start.bat
```

For detailed setup instructions, see [SETUP.md](SETUP.md)

## Project Structure

```
AI4ALL_17A/
├── backend/                        # FastAPI server
│   ├── main.py                    # API endpoints
│   ├── requirements.txt           # Python dependencies
│   └── README.md                  # Backend documentation
├── frontend/                       # React application
│   ├── src/
│   │   ├── App.jsx               # Main component
│   │   └── components/           # UI components
│   ├── package.json              # Node dependencies
│   └── README.md                 # Frontend documentation
├── ham10000_cnn_improved.keras    # Pre-trained HAM10000 model
├── ddi_cnn_improved.keras         # Pre-trained DDI model
├── ham_ann_baseline.keras         # Baseline model
├── SETUP.md                       # Setup guide
└── README.md                      # This file
```

## Pre-trained Models

### HAM10000 CNN
- **Classes**: 7 lesion types
  - Melanoma (MALIGNANT) 
  - Melanocytic nevus (BENIGN)
  - Basal cell carcinoma (MALIGNANT) 
  - Actinic keratosis (MALIGNANT) 
  - Benign keratosis (BENIGN)
  - Dermatofibroma (BENIGN)
  - Vascular lesion (BENIGN)
- **Dataset**: 10,000 dermoscopy images
- **Input**: 224x224 RGB image

### DDI CNN
- **Classes**: 2 categories
  - Melanoma (MALIGNANT) 
  - Non-melanoma (BENIGN)
- **Dataset**: Diverse Dermatology Images
- **Input**: 224x224 RGB image

## Features

Drag-and-drop image upload
Real-time image validation
Multiple model selection
Confidence score display
Detailed class probabilities
Professional medical UI
Mobile-responsive design
Comprehensive medical disclaimers

## API Endpoints

### Backend (FastAPI)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/health` | Health check |
| GET | `/models` | Available models info |
| POST | `/predict` | Single image prediction |
| POST | `/predict-batch` | Batch predictions |

See [backend/README.md](backend/README.md) for detailed API documentation.

## Performance

- **Model loading**: ~10-30s (first request)
- **Inference time**:
  - HAM10000: 200-500ms
  - DDI: 400-800ms
- **Memory usage**: ~2-3GB per model

## Datasets

- [HAM10000](https://www.kaggle.com/datasets/kmader/skin-cancer-mnist-ham10000)
- [Diverse Dermatology Images](https://stanfordaimi.azurewebsites.net/datasets/35866158-8196-48d8-87bf-50dca81df965)
- [ISIC 2019](https://www.kaggle.com/datasets/andrewmvd/isic-2019)

## Important Disclaimers

**This is NOT a medical diagnostic tool**
- For educational and research purposes only
- DO NOT use for clinical decision-making
- Always consult a qualified dermatologist
- Predictions may be incorrect or misleading

## Team

Avani Joshi, Daisy Phung, Phuong Hoang, Tigist Wujira, William Acosta Lora, Belyse Munezero, Bogning Guy-robert

## Documentation

- [SETUP.md](SETUP.md) - Detailed setup and troubleshooting
- [backend/README.md](backend/README.md) - Backend API documentation
- [frontend/README.md](frontend/README.md) - Frontend component documentation

## Security

Input validation (file type, size, format)
CORS protection
Image preprocessing pipeline
Error handling and logging
For production: Update CORS origins and enable HTTPS

## Troubleshooting

### Backend Issues
```bash
# Models not loading?
pip install -r requirements.txt --upgrade

# Port 8000 in use?
# Change PORT in backend/.env
```

### Frontend Issues
```bash
# Dependencies missing?
npm install

# Can't reach backend?
# Check REACT_APP_API_URL in frontend/.env
```

See [SETUP.md](SETUP.md) for more troubleshooting tips.

## Development

### Backend Development
```bash
cd backend
source venv/bin/activate
DEBUG=True python main.py
```
API docs available at `http://localhost:8000/docs`

### Frontend Development
```bash
cd frontend
npm start
# Hot reload enabled
```

## Deployment

### Docker Support (Coming Soon)
```bash
docker-compose up
```

### Production Checklist
- [ ] Update backend CORS_ORIGINS to specific domains
- [ ] Enable HTTPS/TLS
- [ ] Set DEBUG=False in backend
- [ ] Configure rate limiting
- [ ] Setup monitoring and logging
- [ ] Review security settings

## License

Educational use only. See LICENSE file for details.

## References

- FastAPI: https://fastapi.tiangolo.com
- React: https://react.dev
- Keras/TensorFlow: https://keras.io
- WCAG Accessibility: https://www.w3.org/WAI/WCAG21/quickref/

---

**Created for**: AI4ALL 
**Last Updated**: July 2024
**Status**: Production Ready
