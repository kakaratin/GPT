#!/bin/bash

echo "================================================"
echo "🚀 NGL Mass Sender - TURBO EDITION"
echo "================================================"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8 or higher."
    exit 1
fi

# Check if dependencies are installed
echo "📦 Checking dependencies..."
if ! python3 -c "import flask" &> /dev/null; then
    echo "📥 Installing dependencies..."
    pip3 install -r requirements.txt
    echo ""
fi

echo "✅ All dependencies ready!"
echo ""
echo "================================================"
echo "🚀 Starting TURBO Edition..."
echo "================================================"
echo ""
echo "✨ Features:"
echo "   ⚡ Multi-threading (1-10 threads)"
echo "   🔒 Proxy support with rotation"
echo "   📊 Advanced stats & analytics"
echo "   💾 Export logs as JSON"
echo ""
echo "📱 Access URLs:"
echo "   Local:   http://localhost:5000"
echo "   Network: http://0.0.0.0:5000"
echo ""
echo "💡 Tips:"
echo "   - Configure proxies for high-speed sending"
echo "   - Start with 3 threads, increase gradually"
echo "   - Test proxies before use"
echo "   - Monitor success rate"
echo ""
echo "Press Ctrl+C to stop the server"
echo "================================================"
echo ""

python3 app.py
