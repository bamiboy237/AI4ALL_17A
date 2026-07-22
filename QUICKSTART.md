# Quick Start Guide - Skin Lesion Classifier

Get your AI-powered skin lesion classifier running in **5 minutes**.

## Quick Start (One Command)

### macOS/Linux
```bash
bash start.sh
```

### Windows
```cmd
start.bat
```

This will:
1.  Setup Python virtual environment
2.  Install all dependencies
3.  Create configuration files
4.  Show you what to do next

## Manual Setup (Preferred for Development)

### Terminal 1: Start Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate    # Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

You should see:
```
 Loaded ham10000 model
 Loaded ddi model
INFO: Uvicorn running on http://0.0.0.0:8000
```

### Terminal 2: Start Frontend
```bash
cd frontend
npm install
npm start
```

You should see:
```
Compiled successfully!
Webpack compiled with 2 warnings

On Your Network: http://192.168.x.x:3000
```

Your browser will open to `http://localhost:3000`

## Verify Everything Works

### Backend Health Check
```bash
curl http://localhost:8000/health
```

Should return:
```json
{"status": "healthy", "models_loaded": ["ham10000", "ddi"]}
```

### API Documentation
Visit `http://localhost:8000/docs` for interactive Swagger documentation

### Test Upload
1. Go to `http://localhost:3000`
2. Select a skin lesion image (JPG, PNG, etc.)
3. Choose HAM10000 or DDI model
4. Click upload
5. See results!

## First Test Image

Don't have a test image? Try downloading a sample:
```bash
# Download a test image
curl -O https://www.example.com/test-lesion.jpg

# Then upload in the web app
```

Or use any dermoscopy image from:
- Google Images: "dermoscopy lesion"
- HAM10000 dataset samples
- Medical stock photos

## Configuration

### Change Backend Port
Edit `backend/.env`:
```
PORT=8001  # Change from 8000 to 8001
```

### Change API URL (if backend on different host)
Edit `frontend/.env`:
```
REACT_APP_API_URL=http://your-backend-server:8000
```

## Access Points

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| API Docs (Swagger) | http://localhost:8000/docs |
| API Docs (ReDoc) | http://localhost:8000/redoc |

## What You Can Do

 Upload skin lesion images
 Get predictions (Benign/Malignant)
 View confidence scores
 See detailed predictions for each class
 Compare HAM10000 vs DDI models
 Analyze multiple images

## Important Notes

 **NOT for medical diagnosis** - This is an educational tool only
- Always consult a dermatologist for real diagnosis
- Predictions can be wrong
- For research/educational purposes only

## Troubleshooting

### "Python not found"
```bash
# Install Python 3.8+
# https://www.python.org/downloads/
```

### "Node not found"
```bash
# Install Node.js 14+
# https://nodejs.org/
```

### "Models not loading"
```bash
# Check model files exist:
ls -lh *.keras

# Should show:
# ham10000_cnn_improved.keras
# ddi_cnn_improved.keras
```

### "Port 8000 already in use"
```bash
# Kill existing process (macOS/Linux)
lsof -i :8000 | grep LISTEN | awk '{print $2}' | xargs kill

# Or change PORT in backend/.env
```

### "CORS error in browser console"
```bash
# Backend needs to allow frontend
# Edit backend/.env:
CORS_ORIGINS=http://localhost:3000
```

### "Slow first prediction"
This is normal! First request loads the model (10-30 seconds).
Subsequent requests are much faster (200-800ms).

## More Information

- [SETUP.md](SETUP.md) - Detailed setup & troubleshooting
- [backend/README.md](backend/README.md) - API documentation
- [frontend/README.md](frontend/README.md) - Frontend documentation
- [README.md](README.md) - Full project overview

## Next Steps

1.  Get app running (you're here!)
2.  Read full SETUP.md
3.  Explore the code
4.  Test with different images
5.  Deploy to production (see SETUP.md)

## Pro Tips

- **Batch uploads**: Use `/predict-batch` API endpoint for multiple images
- **Model comparison**: Upload same image to both models
- **API testing**: Use `curl` or Postman with http://localhost:8000/docs
- **Performance**: Preload model by making one prediction
- **Debugging**: Check browser console (F12) and backend terminal

## Success Checklist

- [ ] Backend running (see model loading messages)
- [ ] Frontend running (browser opened)
- [ ] Can upload image
- [ ] Get prediction back
- [ ] See confidence score
- [ ] Both models available in selector

## Need Help?

1. Check terminal output for error messages
2. Read troubleshooting section above
3. Check browser console (F12) for errors
4. Review SETUP.md for detailed guides
5. Check [backend/README.md](backend/README.md) for API issues

---

**Happy analyzing!** 

Created for: AI4ALL @ Macalester College
