#!/bin/bash

echo "Setting up AI Resume Analyzer..."
echo ""

# Check MongoDB
echo "Checking if MongoDB is running..."
if ! pgrep -x "mongod" > /dev/null; then
    echo "MongoDB not running. Start it with:"
    echo "  brew services start mongodb-community"
    echo ""
fi

# Frontend
echo "Installing frontend packages..."
cd frontend
if [ ! -d "node_modules" ]; then
    npm install
else
    echo "Frontend already installed, skipping..."
fi

# Backend
echo ""
echo "Installing backend packages..."
cd ../backend
if [ ! -d "node_modules" ]; then
    npm install
else
    echo "Backend already installed, skipping..."
fi

# Check .env
if [ ! -f ".env" ]; then
    echo ""
    echo "Warning: .env file not found in backend/"
    echo "Copy .env.example to .env and add your credentials"
fi

# ML Service
echo ""
echo "Setting up Python ML service..."
cd ../ml-service

if [ ! -d ".venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv .venv
fi

echo "Installing Python packages..."
source .venv/bin/activate
pip install -r requirements.txt

echo ""
echo "Setup done!"
echo ""
echo "Next steps:"
echo "1. Add your MongoDB URI to backend/.env"
echo "2. Run: ./start.sh"
echo ""
