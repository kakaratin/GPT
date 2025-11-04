#!/data/data/com.termux/files/usr/bin/bash

echo "📱 NGL Mass Sender - Termux Edition"
echo "=================================="
echo ""

# Acquire wake lock to prevent sleep
echo "🔒 Acquiring wake lock..."
termux-wake-lock 2>/dev/null || echo "⚠️  Termux:API not installed (optional)"

# Navigate to script directory
cd "$(dirname "$0")"

# Check Python
if ! command -v python &> /dev/null; then
    echo "❌ Python not installed!"
    echo "Run: pkg install python -y"
    exit 1
fi

# Check dependencies
echo "📦 Checking dependencies..."
if ! python -c "import flask" &> /dev/null; then
    echo "📥 Installing dependencies..."
    pip install -r requirements.txt
fi

echo ""
echo "🚀 Starting NGL Mass Sender..."
echo ""
echo "📱 Access URLs:"
echo "   Local:    http://localhost:5000"
echo "   Network:  http://$(ifconfig wlan0 2>/dev/null | grep 'inet ' | awk '{print $2}' | cut -d: -f2):5000"
echo ""
echo "💡 Tips:"
echo "   - Keep Termux notification visible"
echo "   - Disable battery optimization for Termux"
echo "   - Press Ctrl+C to stop"
echo ""
echo "▶️  Starting server..."
echo ""

# Run the app
python app.py
