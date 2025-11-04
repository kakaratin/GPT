# 🚀 Quick Start Guide - NGL Mass Sender TURBO

## 📱 Termux Setup (Recommended)

### 1. Install Termux
Download from **F-Droid** (not Google Play):
https://f-droid.org/packages/com.termux/

### 2. Setup Commands
```bash
# Update packages
pkg update -y && pkg upgrade -y

# Install Python
pkg install python git -y

# Navigate to your folder or create one
cd /sdcard/Download  # or wherever you put the files
cd ngl-mass-sender

# Install dependencies
pip install flask flask-socketio requests

# Run the app
python app.py
```

### 3. Access the Interface
- On phone: Open Chrome/Firefox → `http://localhost:5000`
- From PC on same WiFi: `http://YOUR_PHONE_IP:5000`

### 4. Keep It Running 24/7
```bash
# Install tmux
pkg install tmux -y

# Start a session
tmux new -s ngl

# Run the app
python app.py

# Detach: Press Ctrl+B then D
# Your app keeps running!

# Also acquire wake lock:
termux-wake-lock
```

---

## 💻 Desktop/Laptop Setup

### Linux/Mac
```bash
# Install dependencies
pip3 install flask flask-socketio requests

# Run the app
python3 app.py

# Open browser
http://localhost:5000
```

### Windows
```bash
# Install dependencies
pip install flask flask-socketio requests

# Run the app
python app.py

# Open browser
http://localhost:5000
```

---

## 🎯 First Time Configuration

### Step 1: Add Targets
1. Go to "Target Users" section
2. Paste NGL usernames (one per line):
```
username1
username2
ngl.link/username3
@username4
```
3. Click "Update Targets"
4. See targets appear as tags below

### Step 2: Add Proxies (Optional)
1. Go to "Proxies" section
2. Paste proxies (one per line):
```
http://123.45.67.89:8080
https://98.76.54.32:3128
socks5://11.22.33.44:1080
```
3. Click "Test All" to check which work
4. Click "Update Proxies"

**Where to get proxies:**
- https://free-proxy-list.net/
- https://www.sslproxies.org/
- Or buy premium proxies for reliability

### Step 3: Configure Settings
1. Go to "Advanced Settings"
2. Set threads (3 recommended, 10 for max speed)
3. Set delays (3-8s recommended)
4. Click "Save Settings"

### Step 4: Questions (Optional)
Leave empty to use 25 built-in questions, or add your own:
```
Hey
What's up?
Thoughts on pizza?
```

### Step 5: START!
1. Click the big "Start Sending" button
2. Watch the magic happen in Activity Log
3. Monitor stats in real-time
4. Click "Stop" when done

---

## 🔥 Quick Presets

### 🐌 Safe & Slow (Recommended for Beginners)
```
Threads: 2
Min Delay: 5s
Max Delay: 10s
Proxies: Optional
Speed: ~15 msg/min
```

### ⚡ Fast & Efficient
```
Threads: 5
Min Delay: 2s
Max Delay: 5s
Proxies: 5+ proxies
Speed: ~40 msg/min
```

### 🚀 TURBO MODE (Use Proxies!)
```
Threads: 10
Min Delay: 0.5s
Max Delay: 2s
Proxies: 10+ working proxies
Speed: 80-100+ msg/min
```

---

## 💡 Pro Tips

### For Best Results:
1. ✅ Test your proxies first
2. ✅ Start with 2-3 threads, increase gradually
3. ✅ Have 50+ targets for good rotation
4. ✅ Monitor success rate (aim for >80%)
5. ✅ Export logs to track performance

### For Maximum Speed:
1. Use 10 threads
2. Use 10+ working proxies
3. Set delay to 0.5-1s
4. Have 100+ targets
5. Watch that messages/min counter fly! 🚀

### For Stealth:
1. Use 1-2 threads only
2. Set delay to 10-20s
3. Use residential/mobile proxies
4. Spread over several hours
5. Don't hit same users too often

### If Getting Errors:
1. Reduce thread count
2. Increase delays
3. Test proxies and remove dead ones
4. Check your targets are valid
5. Try without proxies first

---

## 🎮 Using the Interface

### Dashboard:
- **Sent**: Successfully sent messages
- **Failed**: Failed attempts
- **Targets**: Total target count
- **msg/min**: Current sending speed

### Buttons:
- **Start/Stop**: Control the sender
- **Reset Stats**: Clear all counters
- **Export Logs**: Download activity as JSON
- **Update Targets/Proxies**: Save your lists
- **Test All**: Test all proxies
- **Import File**: Upload target list

### Activity Log:
- ✅ Green = Success
- ❌ Red = Failed
- 🔵 Blue = Info
- Real-time updates
- Last 100 entries shown

---

## 📊 Understanding Stats

### Messages Per Minute:
```
0-10   = Slow (safe)
10-30  = Normal (recommended)
30-60  = Fast (need proxies)
60+    = TURBO (need many proxies!)
```

### Success Rate:
```
>90%  = Excellent
80-90% = Good
60-80% = Okay (maybe slow down)
<60%  = Too fast! Reduce threads/add proxies
```

### Proxy Performance:
- Shows success/fail count per proxy
- Remove proxies with <50% success rate
- Test proxies regularly

---

## 🐛 Troubleshooting

### "No targets configured"
→ Add at least one username in Target Users section

### "Already running"
→ Stop the sender first, then start again

### High failure rate
→ Reduce threads, increase delays, test proxies

### App won't start
→ Check dependencies: `pip install flask flask-socketio requests`

### Can't access from browser
→ Make sure it says "Running on http://0.0.0.0:5000"
→ Try http://localhost:5000 or http://127.0.0.1:5000

### Termux keeps stopping
→ Run `termux-wake-lock`
→ Disable battery optimization for Termux in Android settings

---

## 🎉 You're Ready!

1. ✅ App is running
2. ✅ Targets added
3. ✅ Settings configured
4. ✅ Click START and watch it work!

**Enjoy the TURBO power! 🚀🔥**

---

## 📚 More Help

- Read `IMPROVEMENTS.md` for feature details
- Read `TERMUX_SETUP.md` for Termux-specific help
- Read `README.md` for full documentation

**Have fun and use responsibly! 💜**
