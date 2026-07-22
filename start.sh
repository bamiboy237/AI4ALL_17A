#!/bin/bash

echo "🏥 Skin Lesion Classifier - Startup Script"
echo "=========================================="

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 not found. Please install Python 3.8+"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 14+"
    exit 1
fi

# Backend setup
echo ""
echo "📦 Setting up backend..."
cd backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install/upgrade dependencies
pip install -r requirements.txt -q

# Create .env if it doesn't exist
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "Created .env file"
fi

echo "✓ Backend ready"
cd ..

# Frontend setup
echo ""
echo "📦 Setting up frontend..."
cd frontend

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "Installing Node packages..."
    npm install -q
fi

# Create .env if it doesn't exist
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "Created .env file"
fi

echo "✓ Frontend ready"
cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "📋 To start the application:"
echo "   1. Terminal 1 (Backend):  cd backend && source venv/bin/activate && python main.py"
echo "   2. Terminal 2 (Frontend): cd frontend && npm start"
echo ""
echo "🌐 Frontend will be available at: http://localhost:3000"
echo "⚡ Backend API at: http://localhost:8000"
echo "📖 API docs at: http://localhost:8000/docs"
