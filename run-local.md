# Running the Application Locally

Your application setup is in progress. Follow these steps to start both services:

## Option 1: Quick Start (Two Terminals)

### Terminal 1 - Start Backend
```bash
cd /Users/williamacosta/Desktop/AI4ALL_17A/backend
source venv/bin/activate
python main.py
```

You should see output like:
```
Loading models...
✓ Loaded ham10000 model
✓ Loaded ddi model
Uvicorn running on http://0.0.0.0:8000
```

### Terminal 2 - Start Frontend
```bash
cd /Users/williamacosta/Desktop/AI4ALL_17A/frontend
npm start
```

You should see output like:
```
Compiled successfully!
On Your Network: http://192.168.x.x:3000
```

Your browser will automatically open to http://localhost:3000

## What to Expect

1. First backend startup will take 10-30 seconds (loading models)
2. Frontend will compile and open in your browser
3. Upload a skin lesion image
4. Select HAM10000 or DDI model
5. Get instant predictions!

## Access Points

- Frontend App: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## Troubleshooting

If npm install is still running:
- Wait for it to complete before starting frontend
- Progress will show in that terminal

If models won't load:
- Check that *.keras files exist in project root
- Ensure enough RAM (4GB+)

If you get port errors:
- Backend port 8000 in use? Edit backend/.env and change PORT
- Frontend port 3000 in use? npm start will prompt to use different port

## Status Update

Backend setup: ✓ COMPLETE
Frontend setup: IN PROGRESS (npm install running)

Once npm install finishes, you're ready to start!
