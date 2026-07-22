# Skin Lesion Classifier - Backend API

FastAPI server for skin lesion classification using pre-trained Keras models.

## Quick Start

```bash
# Setup
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Run
python main.py
```

Server runs at `http://localhost:8000`

## API Endpoints

### 1. Health Check
```
GET /health
```
Verify server is running and models are loaded.

**Response:**
```json
{
  "status": "healthy",
  "models_loaded": ["ham10000", "ddi"]
}
```

### 2. Get Available Models
```
GET /models
```
Get information about available models and their classes.

**Response:**
```json
{
  "available_models": ["ham10000", "ddi"],
  "models": {
    "ham10000": {
      "name": "HAM10000 CNN",
      "dataset": "HAM10000 (10,000 skin images)",
      "classes": 7
    },
    "ddi": {
      "name": "DDI CNN",
      "dataset": "Dermoscopy Dataset",
      "classes": 2
    }
  }
}
```

### 3. Single Image Prediction
```
POST /predict
```
Classify a single skin lesion image.

**Parameters:**
- `file` (multipart): Image file (JPEG, PNG, GIF, WebP)
- `model` (query): Model to use - "ham10000" or "ddi" (default: "ham10000")

**cURL Example:**
```bash
curl -X POST "http://localhost:8000/predict" \
  -F "file=@lesion.jpg" \
  -F "model=ham10000"
```

**Response:**
```json
{
  "status": "success",
  "model": "ham10000",
  "classification": "Benign",
  "confidence": 0.92,
  "detailed_predictions": {
    "Melanoma": 0.01,
    "Melanocytic nevus": 0.85,
    "Basal cell carcinoma": 0.02,
    "Actinic keratosis": 0.05,
    "Benign keratosis": 0.04,
    "Dermatofibroma": 0.02,
    "Vascular lesion": 0.01
  },
  "warning": "This prediction should not be used for medical diagnosis. Consult a dermatologist for professional evaluation."
}
```

### 4. Batch Image Prediction
```
POST /predict-batch
```
Classify multiple images at once.

**Parameters:**
- `files` (multipart): Multiple image files
- `model` (query): Model to use

**cURL Example:**
```bash
curl -X POST "http://localhost:8000/predict-batch" \
  -F "files=@image1.jpg" \
  -F "files=@image2.jpg" \
  -F "model=ham10000"
```

**Response:**
```json
{
  "status": "success",
  "model": "ham10000",
  "total_images": 2,
  "results": [
    {
      "filename": "image1.jpg",
      "classification": "Benign",
      "confidence": 0.92,
      "detailed_predictions": { ... }
    },
    {
      "filename": "image2.jpg",
      "classification": "Malignant (Requires Medical Attention)",
      "confidence": 0.88,
      "detailed_predictions": { ... }
    }
  ],
  "warning": "..."
}
```

## Model Information

### HAM10000 Model
- **Input**: 224x224 RGB image, normalized [0, 1]
- **Output**: 7 class probabilities
- **Classes**:
  - 0: Melanoma (MALIGNANT) 
  - 1: Melanocytic nevus (BENIGN)
  - 2: Basal cell carcinoma (MALIGNANT) 
  - 3: Actinic keratosis (MALIGNANT) 
  - 4: Benign keratosis (BENIGN)
  - 5: Dermatofibroma (BENIGN)
  - 6: Vascular lesion (BENIGN)

**Benign/Malignant Logic:**
- Malignant: Classes 0, 2, 3 (Melanoma, BCC, Actinic keratosis)
- Benign: Classes 1, 4, 5, 6 (everything else)

### DDI Model
- **Input**: 224x224 RGB image, normalized [0, 1]
- **Output**: 2 class probabilities
- **Classes**:
  - 0: Melanoma (MALIGNANT) 
  - 1: Non-melanoma (BENIGN)

## Configuration

### Environment Variables (.env)
```
DEBUG=False              # Enable debug mode
HOST=0.0.0.0           # Server host
PORT=8000              # Server port
CORS_ORIGINS=*         # CORS allowed origins
MAX_UPLOAD_SIZE=10485760  # Max file size in bytes (10MB)
```

## Image Processing Pipeline

1. **Validation**: Check file type and size
2. **Load**: Open with PIL
3. **Convert**: Ensure RGB color space
4. **Resize**: 224x224 using LANCZOS interpolation
5. **Normalize**: Scale to [0, 1]
6. **Batch**: Add batch dimension → (1, 224, 224, 3)
7. **Predict**: Run through model
8. **Classify**: Convert predictions to benign/malignant

## Error Handling

### Common Errors

**400 Bad Request**
- Invalid file format
- File too large
- Corrupted image
- Model not found

Example:
```json
{
  "detail": "Model 'invalid_model' not loaded. Available: ['ham10000', 'ddi']"
}
```

**503 Service Unavailable**
- Model loading failed
- Out of memory

## Performance

- Model loading: ~10-30s on first request
- Inference time:
  - HAM10000: 200-500ms
  - DDI: 400-800ms
- Memory usage: ~2-3GB per model

## Security Considerations

 **Implemented:**
- File type validation (MIME + magic bytes)
- File size limits
- CORS configuration
- Input sanitization

 **For Production:**
- Restrict CORS_ORIGINS to specific domains
- Add rate limiting middleware
- Implement authentication if needed
- Enable HTTPS/TLS
- Add request logging
- Set resource limits

## Development

### Running in Debug Mode
```bash
DEBUG=True python main.py
```

### Testing with Python
```python
import requests

# Single prediction
with open('test.jpg', 'rb') as f:
    response = requests.post(
        'http://localhost:8000/predict',
        files={'file': f},
        params={'model': 'ham10000'}
    )
    print(response.json())
```

### Interactive API Docs
Available at: `http://localhost:8000/docs` (Swagger UI)
Alternative: `http://localhost:8000/redoc` (ReDoc)

## Troubleshooting

**Models not loading:**
```
Solution: Check model files exist in project root
- ham10000_cnn_improved.keras
- ddi_cnn_improved.keras
```

**Out of memory:**
```
Solution: Close other applications or use smaller models
```

**CORS errors:**
```
Solution: Update CORS_ORIGINS in .env to include frontend URL
CORS_ORIGINS=http://localhost:3000,https://yourdomain.com
```

**Port already in use:**
```
Solution: Change PORT in .env or kill existing process
# Linux/Mac: lsof -i :8000 | grep LISTEN | awk '{print $2}' | xargs kill
# Windows: netstat -ano | findstr :8000
```

## References

- FastAPI: https://fastapi.tiangolo.com
- TensorFlow/Keras: https://keras.io
- HAM10000 Dataset: https://arxiv.org/abs/1803.10417

## License

Educational use only.

## Support

Check logs for detailed error messages:
```
2024-01-01 12:00:00 INFO: ✓ Loaded ham10000 model
2024-01-01 12:00:02 INFO: ✓ Loaded ddi model
2024-01-01 12:00:05 INFO: Uvicorn running on http://0.0.0.0:8000
```
