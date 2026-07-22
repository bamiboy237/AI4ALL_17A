#!/bin/bash

echo "Starting Frontend Server..."
echo "==========================="
echo

cd /Users/williamacosta/Desktop/AI4ALL_17A/frontend

echo "Checking for npm dependencies..."
if [ ! -d "node_modules" ]; then
    echo "Installing npm packages (this may take a minute)..."
    npm install -q
fi

echo
echo "Starting React development server..."
echo "Frontend will open automatically at http://localhost:3000"
echo

npm start
