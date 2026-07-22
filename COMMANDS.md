# Quick Command Reference

Copy and paste these commands to get your app running!

---

## ONE-COMMAND STARTUP (Recommended)

### macOS/Linux
```bash
bash start.sh
```

### Windows
```cmd
start.bat
```

---

## MANUAL SETUP

### Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate (choose one)
source venv/bin/activate           # macOS/Linux
venv\Scripts\activate              # Windows

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env               # macOS/Linux
copy .env.example .env             # Windows

# Start server
python main.py
```

### Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env               # macOS/Linux
copy .env.example .env             # Windows

# Start development server
npm start
```

---

## ACCESS YOUR APP

| Service | URL |
|---------|-----|
| **Frontend** | http://localhost:3000 |
| **Backend API** | http://localhost:8000 |
| **API Documentation (Swagger)** | http://localhost:8000/docs |
| **API Documentation (ReDoc)** | http://localhost:8000/redoc |

---

## VERIFY SETUP

### Check Backend Health
```bash
curl http://localhost:8000/health
```

### Get Available Models
```bash
curl http://localhost:8000/models
```

### Test Single Prediction
```bash
curl -X POST "http://localhost:8000/predict" \
  -F "file=@test_image.jpg" \
  -F "model=ham10000"
```

---

## COMMON CONFIGURATION

### Change Backend Port

Edit `backend/.env`:
```
PORT=8001
```

Restart backend for changes to take effect.

### Change API URL

Edit `frontend/.env`:
```
REACT_APP_API_URL=http://your-server:8000
```

Restart frontend for changes to take effect.

### Enable Debug Mode

Edit `backend/.env`:
```
DEBUG=True
```

Restart backend.

---

## TROUBLESHOOTING COMMANDS

### Install All Dependencies
```bash
# Backend
cd backend && pip install -r requirements.txt --upgrade

# Frontend
cd frontend && npm install
```

### Clear Cache & Reinstall

**Frontend:**
```bash
cd frontend
rm -rf node_modules package-lock.json    # macOS/Linux
rmdir /s node_modules && del package-lock.json  # Windows
npm install
npm start
```

**Backend:**
```bash
cd backend
rm -rf venv                    # macOS/Linux
rmdir /s venv                  # Windows
python -m venv venv
source venv/bin/activate       # macOS/Linux
venv\Scripts\activate          # Windows
pip install -r requirements.txt
python main.py
```

### Kill Process Using Port

**Port 8000 (Backend):**
```bash
# macOS/Linux
lsof -i :8000 | grep LISTEN | awk '{print $2}' | xargs kill

# Windows (PowerShell Admin)
Get-Process -Id (Get-NetTCPConnection -LocalPort 8000).OwningProcess | Stop-Process

# Windows (Command Prompt Admin)
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

**Port 3000 (Frontend):**
```bash
# macOS/Linux
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill

# Windows (PowerShell Admin)
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process
```

---

## USEFUL FILE LOCATIONS

### Backend Configuration
```
backend/.env          # Environment variables
backend/main.py       # FastAPI application
backend/requirements.txt  # Python dependencies
```

### Frontend Configuration
```
frontend/.env         # Environment variables
frontend/package.json # Node.js dependencies
frontend/src/App.jsx  # Main React component
```

### Models
```
ham10000_cnn_improved.keras  # HAM10000 model
ddi_cnn_improved.keras       # DDI model
ham_ann_baseline.keras       # Baseline model
```

---

## TESTING COMMANDS

### Test with cURL

**Health Check:**
```bash
curl http://localhost:8000/health
```

**Get Models:**
```bash
curl http://localhost:8000/models
```

**Single Prediction:**
```bash
curl -X POST "http://localhost:8000/predict" \
  -H "accept: application/json" \
  -F "file=@your_image.jpg" \
  -F "model=ham10000"
```

**Batch Prediction:**
```bash
curl -X POST "http://localhost:8000/predict-batch" \
  -H "accept: application/json" \
  -F "files=@image1.jpg" \
  -F "files=@image2.jpg" \
  -F "model=ham10000"
```

### Test with Python

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

# Batch prediction
files = [
    ('files', open('image1.jpg', 'rb')),
    ('files', open('image2.jpg', 'rb'))
]
response = requests.post(
    'http://localhost:8000/predict-batch',
    files=files,
    params={'model': 'ham10000'}
)
print(response.json())
```

---

## DEVELOPMENT WORKFLOW

### Start Both Services (New Terminals)

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate  # Windows: venv\Scripts\activate
python main.py
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

### Edit Code
- Edit frontend files → Auto-reload in browser
- Edit backend files → Manual restart required

### Commit Changes
```bash
git status
git add .
git commit -m "Your commit message"
git push origin main
```

---

## PYTHON PACKAGE MANAGEMENT

### Install Specific Package
```bash
cd backend
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install package_name
pip freeze > requirements.txt
```

### Check Installed Packages
```bash
cd backend
source venv/bin/activate  # Windows: venv\Scripts\activate
pip list
```

### Update All Packages
```bash
cd backend
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install --upgrade -r requirements.txt
```

---

## NODE.JS PACKAGE MANAGEMENT

### Install Specific Package
```bash
cd frontend
npm install package_name
```

### Check Installed Packages
```bash
cd frontend
npm list
```

### Update All Packages
```bash
cd frontend
npm update
```

### Build for Production
```bash
cd frontend
npm run build
```

---

##  DOCKER COMMANDS (Future)

```bash
# Build images
docker-compose build

# Start services
docker-compose up

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild and start
docker-compose up --build
```

---

## USEFUL SCRIPTS

### Create Script to Run Both Services

**run.sh (macOS/Linux):**
```bash
#!/bin/bash
(cd backend && source venv/bin/activate && python main.py) &
(cd frontend && npm start) &
wait
```

**Make it executable:**
```bash
chmod +x run.sh
./run.sh
```

---

## DEBUGGING

### View Backend Logs
```bash
# Terminal where backend is running - just watch output
python main.py
```

### View Frontend Logs
```bash
# Browser DevTools
F12 or Cmd+Option+I (Mac)
# Then check Console tab
```

### View Network Requests
```bash
# Browser DevTools
F12
# Then check Network tab
# Filter by XHR for API calls
```

### Check if Port is in Use
```bash
# macOS/Linux
lsof -i :8000
lsof -i :3000

# Windows (PowerShell)
Get-NetTCPConnection -LocalPort 8000
Get-NetTCPConnection -LocalPort 3000
```

---

## BACKUP & RESTORE

### Backup Project
```bash
# Create backup
tar -czf ai4all-backup-$(date +%Y%m%d).tar.gz AI4ALL_17A/

# On macOS
cd AI4ALL_17A && tar -czf ../backup-$(date +%Y%m%d).tar.gz .
```

### Clean & Rebuild
```bash
# Remove generated files
cd backend && rm -rf venv __pycache__ .env
cd ../frontend && rm -rf node_modules package-lock.json .env

# Rebuild
bash start.sh  # or start.bat
```

---

## USEFUL LINKS

| Resource | URL |
|----------|-----|
| FastAPI Docs | https://fastapi.tiangolo.com |
| React Documentation | https://react.dev |
| TensorFlow/Keras | https://keras.io |
| NumPy Documentation | https://numpy.org/doc |
| Axios Documentation | https://axios-http.com |
| MDN Web Docs | https://developer.mozilla.org |

---

## QUICK START CHECKLIST

Run these in order:

```bash
# 1. Choose method
bash start.sh                    # OR manual setup below

# 2. Manual: Backend
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py                  # Leave running

# 3. Manual: Frontend (new terminal)
cd frontend
npm install
npm start

# 4. Verify
# - Open http://localhost:3000 in browser
# - Upload a test image
# - See results!
```

---

##  Status Indicators

 **Backend Running**: Terminal shows "Uvicorn running on..."
 **Frontend Running**: Browser opens to http://localhost:3000
 **API Accessible**: http://localhost:8000/docs shows documentation
 **App Working**: Can upload image and get prediction

---

**Last Updated**: July 2024
**Version**: 1.0
