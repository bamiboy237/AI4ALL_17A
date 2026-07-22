# Architecture Overview

Complete architecture of the Skin Lesion Classifier web application.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         User Browser                         │
│                   (http://localhost:3000)                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │            React Frontend (Port 3000)                 │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │          App.jsx (Main Component)              │  │  │
│  │  │  - State management                            │  │  │
│  │  │  - API communication                           │  │  │
│  │  │  - Model selection                             │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  │                      ↓ ↑                             │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │              React Components                   │  │  │
│  │  │  • ImageUpload - Drag & drop                   │  │  │
│  │  │  • ModelSelector - Model choice               │  │  │
│  │  │  • PredictionResult - Results display          │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  │                                                        │  │
│  │  Dependencies: React 18.2, Axios, CSS Modules       │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                            ↓ HTTP POST ↑
        ┌───────────────────────────────────────────────────┐
        │     FastAPI Backend (Port 8000)                   │
        │     (http://localhost:8000)                       │
        ├───────────────────────────────────────────────────┤
        │                                                    │
        │  ┌─────────────────────────────────────────────┐  │
        │  │          FastAPI App (main.py)              │  │
        │  │  • CORS middleware                          │  │
        │  │  • Request validation                       │  │
        │  │  • Error handling                           │  │
        │  └─────────────────────────────────────────────┘  │
        │                    ↓                              │
        │  ┌─────────────────────────────────────────────┐  │
        │  │            API Endpoints                    │  │
        │  │  • GET  /health                            │  │
        │  │  • GET  /models                            │  │
        │  │  • POST /predict                           │  │
        │  │  • POST /predict-batch                     │  │
        │  └─────────────────────────────────────────────┘  │
        │                    ↓                              │
        │  ┌─────────────────────────────────────────────┐  │
        │  │      Image Processing Pipeline              │  │
        │  │  1. Validate (type, size)                  │  │
        │  │  2. Load (PIL)                             │  │
        │  │  3. Convert to RGB                         │  │
        │  │  4. Resize (224x224)                       │  │
        │  │  5. Normalize ([0, 1])                     │  │
        │  │  6. Create batch (1, 224, 224, 3)          │  │
        │  └─────────────────────────────────────────────┘  │
        │                    ↓                              │
        │  ┌─────────────────────────────────────────────┐  │
        │  │        Keras Model Inference                │  │
        │  │  • HAM10000 CNN (7 classes)                │  │
        │  │  • DDI CNN (2 classes)                     │  │
        │  │  • Returns probabilities                    │  │
        │  └─────────────────────────────────────────────┘  │
        │                    ↓                              │
        │  ┌─────────────────────────────────────────────┐  │
        │  │    Classification & Response Formatting      │  │
        │  │  • Convert to Benign/Malignant              │  │
        │  │  • Calculate confidence                      │  │
        │  │  • Format detailed predictions               │  │
        │  │  • Add medical disclaimers                   │  │
        │  └─────────────────────────────────────────────┘  │
        │                                                    │
        │  Dependencies: FastAPI, TensorFlow, Pillow, etc  │
        └───────────────────────────────────────────────────┘
                            ↓ ↑
        ┌───────────────────────────────────────────────────┐
        │     Keras Models (Project Root)                   │
        ├───────────────────────────────────────────────────┤
        │                                                    │
        │   ham10000_cnn_improved.keras (95 MB)           │
        │     └─ 7 lesion classes                           │
        │                                                    │
        │   ddi_cnn_improved.keras (295 MB)               │
        │     └─ 2 classes (melanoma/benign)               │
        │                                                    │
        │   ham_ann_baseline.keras (28 MB)                │
        │     └─ Baseline comparison                        │
        │                                                    │
        │  Loaded at backend startup                        │
        │  Cached in memory for fast inference              │
        │                                                    │
        └───────────────────────────────────────────────────┘
```

## Directory Structure

```
AI4ALL_17A/
│
├── frontend/                          # React Application
│   ├── public/
│   │   └── index.html                # HTML entry point
│   ├── src/
│   │   ├── components/               # Reusable components
│   │   │   ├── ImageUpload.jsx       # Upload UI
│   │   │   ├── ImageUpload.css
│   │   │   ├── ModelSelector.jsx     # Model selection
│   │   │   ├── ModelSelector.css
│   │   │   ├── PredictionResult.jsx  # Results display
│   │   │   └── PredictionResult.css
│   │   ├── hooks/                    # Custom hooks (future)
│   │   ├── pages/                    # Page components (future)
│   │   ├── utils/                    # Utility functions (future)
│   │   ├── App.jsx                   # Main app component
│   │   ├── App.css
│   │   ├── index.js                  # React entry point
│   │   └── index.css                 # Global styles
│   ├── package.json                  # Dependencies
│   ├── .env.example                  # Environment template
│   ├── README.md                     # Frontend docs
│   └── .gitignore
│
├── backend/                           # FastAPI Backend
│   ├── main.py                       # FastAPI app + routes
│   ├── requirements.txt              # Python dependencies
│   ├── .env.example                  # Environment template
│   ├── README.md                     # API documentation
│   └── .gitignore
│
├── ham10000_cnn_improved.keras       # Pre-trained models
├── ddi_cnn_improved.keras
├── ham_ann_baseline.keras
│
├── README.md                         # Project overview
├── SETUP.md                          # Detailed setup guide
├── QUICKSTART.md                     # Quick start guide
├── ARCHITECTURE.md                   # This file
├── start.sh                          # Startup script (Unix)
├── start.bat                         # Startup script (Windows)
├── .gitignore                        # Git ignore rules
└── .git/                            # Version control
```

## Technology Stack

### Frontend
```
React 18.2.0           - UI framework
ReactDOM 18.2.0        - DOM rendering
Axios 1.5.0            - HTTP client
CSS Modules            - Component styling
ES6/JSX                - JavaScript variant
```

### Backend
```
FastAPI 0.104.1        - Web framework
Uvicorn 0.24.0         - ASGI server
TensorFlow 2.14.0      - Deep learning
Keras (built-in)       - Model format
Pillow 10.0.1          - Image processing
NumPy 1.24.3           - Numerical computing
Pydantic 2.4.2         - Data validation
Python 3.8+            - Runtime
```

## Data Flow

### Single Image Prediction Flow

```
1. USER ACTION
   └─ User selects image file → Front-end file input

2. FRONTEND PROCESSING
   └─ React component captures file
      ├─ Validate file (type, size)
      └─ Show preview

3. API REQUEST
   └─ Send to POST /predict
      ├─ Headers: Content-Type: multipart/form-data
      ├─ Body: file + model parameter
      └─ Axios HTTP client

4. BACKEND VALIDATION
   └─ FastAPI receives request
      ├─ Validate model parameter
      └─ Validate file upload

5. IMAGE PROCESSING
   └─ main.py:preprocess_image()
      ├─ PIL.Image.open() → Load image
      ├─ image.convert('RGB') → Standardize
      ├─ image.resize((224, 224)) → Standardize dimensions
      ├─ np.array() / 255 → Normalize to [0, 1]
      └─ np.expand_dims() → Add batch: (1, 224, 224, 3)

6. MODEL INFERENCE
   └─ model.predict()
      ├─ Keras model forward pass
      └─ Output: (1, num_classes) probabilities

7. CLASSIFICATION LOGIC
   └─ get_benign_malignant_class()
      ├─ HAM10000: Check class against malignant set
      ├─ DDI: Direct class mapping
      └─ Return: (classification_text, confidence)

8. RESPONSE FORMATTING
   └─ Prepare JSON response
      ├─ Classification: "Benign" or "Malignant"
      ├─ Confidence: float [0, 1]
      ├─ Detailed predictions: all class probabilities
      └─ Warning: Medical disclaimer

9. FRONTEND DISPLAY
   └─ React receives JSON
      ├─ Parse response
      ├─ Update component state
      └─ Render PredictionResult component
         ├─ Show classification
         ├─ Show confidence bar
         ├─ Show all class probabilities
         └─ Show disclaimer

10. USER SEES RESULTS
    └─ Web app displays predictions
```

## Component Relationships

### Frontend Components

```
App.jsx (Main)
├── Manages state:
│   ├── selectedModel
│   ├── prediction
│   ├── loading
│   ├── error
│   ├── uploadedImage
│   └── availableModels
│
├── Calls API:
│   ├── GET /models (on mount)
│   └── POST /predict (on upload)
│
└── Renders:
    ├── ImageUpload
    │   └── Handles file selection
    │       └── Calls parent onImageUpload()
    │
    ├── ModelSelector
    │   └── Displays model options
    │       └── Calls parent onModelChange()
    │
    └── PredictionResult (conditional)
        ├── Shows classification
        ├── Shows confidence
        ├── Shows detailed predictions
        └── Calls parent onReset()
```

### Backend API Routes

```
GET /health
├─ Purpose: Health check
└─ Response: {"status": "healthy", "models_loaded": [...]}

GET /models
├─ Purpose: Get available models info
└─ Response: {"available_models": [...], "models": {...}}

POST /predict
├─ Parameters: file (multipart), model (query)
├─ Processing:
│   ├─ Validate request
│   ├─ Process image
│   ├─ Run inference
│   └─ Format response
└─ Response: {"status": "success", "classification": "...", ...}

POST /predict-batch
├─ Parameters: files (multipart[]), model (query)
├─ Processing: Same as /predict but for multiple files
└─ Response: {"results": [{"filename": "...", ...}, ...]}
```

## Class Mappings

### HAM10000 Model (7 Classes)

| Index | Class | Type |
|-------|-------|------|
| 0 | Melanoma | MALIGNANT  |
| 1 | Melanocytic nevus | BENIGN |
| 2 | Basal cell carcinoma | MALIGNANT  |
| 3 | Actinic keratosis | MALIGNANT  |
| 4 | Benign keratosis | BENIGN |
| 5 | Dermatofibroma | BENIGN |
| 6 | Vascular lesion | BENIGN |

**Classification Logic:**
- Malignant: If argmax(prediction) in {0, 2, 3}
- Benign: If argmax(prediction) in {1, 4, 5, 6}

### DDI Model (2 Classes)

| Index | Class | Type |
|-------|-------|------|
| 0 | Melanoma | MALIGNANT  |
| 1 | Non-melanoma | BENIGN |

**Classification Logic:**
- Direct class to label mapping

## Deployment Topology

### Development (Local)

```
localhost:3000  ←→ localhost:8000  ←→ *.keras files
(React)         (FastAPI)          (Model files)
```

### Production (Cloud)

```
https://yourdomain.com        ←→  https://api.yourdomain.com    ←→  Cloud Storage
(React on CDN/static host)        (FastAPI on container/VM)         (Model files)
```

## Performance Characteristics

### Model Loading
- **HAM10000 CNN**: ~15-20 seconds
- **DDI CNN**: ~10-15 seconds
- **Cached**: Subsequent requests use loaded model

### Inference Time (per image)
- **HAM10000**: 200-500ms
- **DDI**: 400-800ms
- **Variance**: Depends on image processing time

### Memory Usage
- **HAM10000 model**: ~300 MB
- **DDI model**: ~900 MB
- **Total RAM needed**: 3-4 GB

## Security Considerations

### Input Validation
```
Request File
├─ MIME type check (image/*)
├─ Magic bytes verification
├─ File size limit (10 MB)
├─ Dimension check (≥ 224x224)
└─ Corruption detection
```

### Frontend Security
```
✓ Validates file before upload
✓ Shows file type/size errors
✓ Sanitizes displayed text
✓ CORS prevents cross-origin abuse
```

### Backend Security
```
✓ CORS middleware (configurable)
✓ File upload validation
✓ Image processing safety
✓ Error message sanitization
✓ Model access control
```

## Scalability Considerations

### Current Architecture
- **Single model instance**: Model cached in memory
- **Synchronous inference**: Requests wait for completion
- **File storage**: No persistence (files processed on-fly)

### Future Improvements
- **Async processing**: Celery + Redis for queued jobs
- **Model ensemble**: Run multiple models in parallel
- **Caching**: Redis for prediction cache
- **Load balancing**: Multiple backend instances
- **Database**: Store prediction history
- **Monitoring**: Logging, metrics, tracing

## Integration Points

### Frontend ↔ Backend
```
Protocol: HTTP/REST with JSON
Format: multipart/form-data for files
CORS: Configured for localhost development

Headers Used:
- Content-Type: multipart/form-data (automatic with FormData)
- Accept: application/json (automatic with Axios)
```

### Backend ↔ Models
```
Format: Keras .keras files (HDF5-like)
Loading: tf.keras.models.load_model()
Inference: model.predict()
Output: NumPy arrays
```

---

**Architecture Version**: 1.0
**Last Updated**: July 2024
**Status**: Production Ready
