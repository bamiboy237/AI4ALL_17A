# Skin Lesion Classifier - Setup Guide

A web application for classifying skin lesions as benign or malignant using AI. The app uses pre-trained Keras deep learning models trained on HAM10000 and DDI datasets.

## Project Overview

- **Frontend**: React with drag-and-drop image upload UI
- **Backend**: FastAPI with Keras model predictions
- **Models**: 
  - HAM10000 CNN (7 lesion classes)
  - DDI CNN (2 classes: melanoma/benign)
  - HAM ANN Baseline

## Quick Start

### Prerequisites

- Python 3.8+
- Node.js 14+ and npm
- 4GB+ RAM (for loading Keras models)

### Step 1: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create Python virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env

# Start FastAPI server
python main.py
```

The backend will start at `http://localhost:8000`

API endpoints:
- `GET /health` - Health check
- `GET /models` - Available models info
- `POST /predict` - Single image prediction
- `POST /predict-batch` - Batch predictions

### Step 2: Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start React development server
npm start
```

The frontend will open at `http://localhost:3000`

## Project Structure

```
AI4ALL_17A/
 backend/
    main.py                 # FastAPI application
    requirements.txt        # Python dependencies
    .env.example           # Environment template
    README.md              # Backend documentation
 frontend/
    src/
       App.jsx            # Main React component
       index.js           # Entry point
       components/        # React components
          ImageUpload.jsx
          ModelSelector.jsx
          PredictionResult.jsx
       styles/            # CSS files
    public/
       index.html         # HTML template
    package.json           # Node dependencies
    .env.example           # Environment template
 ham10000_cnn_improved.keras    # Pre-trained model
 ddi_cnn_improved.keras         # Pre-trained model
 ham_ann_baseline.keras         # Baseline model
 SETUP.md                       # This file
```

## Usage

1. **Upload an image**: Drag and drop or click to select a skin lesion image
2. **Select model**: Choose HAM10000 or DDI model
3. **Get prediction**: Submit and receive classification (Benign/Malignant)
4. **View results**: See confidence score and detailed predictions per lesion class

### Supported Image Formats
- JPEG/JPG
- PNG
- GIF
- WebP

### Image Requirements
- Minimum: 224x224 pixels
- Maximum file size: 5MB
- Clear, well-lit dermoscopy image preferred
- Centered lesion

## Model Information

### HAM10000 Model
- **Classes**: 7 lesion types
  - Melanoma (MALIGNANT) 
  - Melanocytic nevus (BENIGN)
  - Basal cell carcinoma (MALIGNANT) 
  - Actinic keratosis (MALIGNANT) 
  - Benign keratosis (BENIGN)
  - Dermatofibroma (BENIGN)
  - Vascular lesion (BENIGN)
- **Dataset**: 10,000 dermoscopy images
- **Architecture**: Convolutional Neural Network

### DDI Model
- **Classes**: 2 categories
  - Melanoma (MALIGNANT) 
  - Non-melanoma (BENIGN)
- **Dataset**: Dermoscopy Dataset
- **Architecture**: Convolutional Neural Network

## Configuration

### Backend (.env)
```
DEBUG=False
HOST=0.0.0.0
PORT=8000
CORS_ORIGINS=*
MAX_UPLOAD_SIZE=10485760
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:8000
REACT_APP_ENV=development
```

##  Testing

### Test with cURL (Backend)
```bash
# Single prediction
curl -X POST "http://localhost:8000/predict" \
  -H "accept: application/json" \
  -F "file=@test_image.jpg" \
  -F "model=ham10000"

# Health check
curl "http://localhost:8000/health"

# Available models
curl "http://localhost:8000/models"
```

### Test Frontend
- Open `http://localhost:3000`
- Upload a test image
- Select model and submit
- Verify results display

## Important Disclaimers

- **Not for medical diagnosis**: This tool is for educational and research purposes only
- **Consult professionals**: Always consult a qualified dermatologist for proper diagnosis
- **Educational use only**: Do not rely on this for clinical decision-making
- **No liability**: The creators assume no responsibility for misuse or incorrect predictions

## Troubleshooting

### Backend Issues

**Models not loading**
```
Error: ModuleNotFoundError: tensorflow
→ Solution: pip install -r requirements.txt --upgrade
```

**Port 8000 already in use**
```
→ Solution: Change PORT in .env or kill existing process
```

**CORS errors in browser**
```
→ Solution: Verify CORS_ORIGINS in backend .env includes frontend URL
```

### Frontend Issues

**Module not found errors**
```
→ Solution: npm install in frontend directory
```

**Cannot connect to backend**
```
→ Solution: Verify backend is running and REACT_APP_API_URL is correct
```

**Image upload fails**
```
→ Solution: Check image format and file size (< 5MB)
```

## Performance Notes

- Model loading: ~10-30 seconds on first request
- Inference time: 200-500ms per image (HAM10000), 400-800ms (DDI)
- Recommended: 4GB+ RAM for smooth operation

## Security Considerations

- Input validation on file uploads (MIME type + magic bytes)
- File size limits enforced (10MB max)
- CORS restrictions recommended for production
- No persistent storage of uploaded images by default
- Medical compliance warnings included

## References

- **HAM10000 Dataset**: https://arxiv.org/abs/1803.10417
- **FastAPI Docs**: https://fastapi.tiangolo.com
- **React Documentation**: https://react.dev
- **Keras/TensorFlow**: https://keras.io

## Development Notes

### Adding a New Model
1. Place `.keras` file in project root
2. Update `MODEL_PATHS` in `backend/main.py`
3. Add class mapping to `HAM10000_CLASSES` or `DDI_CLASSES`
4. Restart backend

### Customizing UI
- Edit component files in `frontend/src/components/`
- Modify colors in CSS files (gradient: `#667eea` to `#764ba2`)
- Update disclaimer text in `frontend/src/App.jsx`

##  Contributing

This is an educational project. For improvements:
1. Test changes locally
2. Ensure medical disclaimers remain prominent
3. Document any model changes
4. Verify CORS and security settings

##  License

Educational use only. See LICENSE file for details.

##  Support

For issues:
1. Check troubleshooting section
2. Review backend logs: `python main.py` output
3. Check frontend console: Browser DevTools (F12)
4. Verify model files exist and are readable

---

**Last Updated**: 2024
**Python Version**: 3.8+
**Node Version**: 14+
