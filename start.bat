@echo off
echo 🏥 Skin Lesion Classifier - Startup Script
echo ==========================================

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python not found. Please install Python 3.8+
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js not found. Please install Node.js 14+
    pause
    exit /b 1
)

REM Backend setup
echo.
echo 📦 Setting up backend...
cd backend

REM Create virtual environment if it doesn't exist
if not exist "venv" (
    echo Creating Python virtual environment...
    python -m venv venv
)

REM Activate virtual environment
call venv\Scripts\activate.bat

REM Install/upgrade dependencies
pip install -r requirements.txt -q

REM Create .env if it doesn't exist
if not exist ".env" (
    copy .env.example .env
    echo Created .env file
)

echo ✓ Backend ready
cd ..

REM Frontend setup
echo.
echo 📦 Setting up frontend...
cd frontend

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo Installing Node packages...
    call npm install -q
)

REM Create .env if it doesn't exist
if not exist ".env" (
    copy .env.example .env
    echo Created .env file
)

echo ✓ Frontend ready
cd ..

echo.
echo ✅ Setup complete!
echo.
echo 📋 To start the application:
echo    1. Command Prompt 1: cd backend && venv\Scripts\activate && python main.py
echo    2. Command Prompt 2: cd frontend && npm start
echo.
echo 🌐 Frontend will be available at: http://localhost:3000
echo ⚡ Backend API at: http://localhost:8000
echo 📖 API docs at: http://localhost:8000/docs
echo.
pause
