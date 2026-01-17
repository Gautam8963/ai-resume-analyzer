#!/bin/bash

echo "🚀 Starting AI Resume Analyzer + Mock Interview Platform"
echo "=========================================================="
echo ""

# Check if .env exists
if [ ! -f "backend/.env" ]; then
    echo "❌ Error: backend/.env not found!"
    echo "Please create it from .env.example and add your OAuth credentials"
    exit 1
fi

# Start services in separate terminal windows (macOS)
echo "Starting services..."

# Frontend
osascript -e 'tell app "Terminal" to do script "cd '"$PWD"'/frontend && npm run dev"'

# Backend  
osascript -e 'tell app "Terminal" to do script "cd '"$PWD"'/backend && npm run dev"'

# ML Service
osascript -e 'tell app "Terminal" to do script "cd '"$PWD"'/ml-service && source venv/bin/activate && python app.py"'

echo ""
echo "✅ All services starting in separate terminal windows!"
echo ""
echo "🌐 Access the application:"
echo "   Frontend:  http://localhost:5173"
echo "   Backend:   http://localhost:5000"
echo "   ML Service: http://localhost:8000"
echo ""
echo "Press Ctrl+C in each terminal to stop the services"
