#!/bin/bash

echo "Starting Backend Server..."
echo "=========================="
echo

cd /Users/williamacosta/Desktop/AI4ALL_17A/backend
source venv/bin/activate

echo "Loading Keras models (this may take 10-30 seconds on first run)..."
echo

python main.py
