# 📱 Running NGL Mass Sender on Termux

Perfect for running on your Android phone 24/7!

## 🚀 Quick Setup

### Step 1: Install Termux
Download from **F-Droid** (NOT Google Play - it's outdated):
- https://f-droid.org/en/packages/com.termux/

### Step 2: Setup Termux Environment

Open Termux and run these commands one by one:

```bash
# Update packages
pkg update && pkg upgrade -y

# Install Python and Git
pkg install python git -y

# Install pip packages
pip install --upgrade pip
```

### Step 3: Clone/Download This Project

**Option A: If you have the files on your phone**
```bash
# Navigate to your downloads (adjust path if needed)
cd /storage/emulated/0/Download

# If you downloaded as zip, unzip it
unzip ngl-mass-sender.zip
cd ngl-mass-sender
```

**Option B: If you have it on GitHub**
```bash
git clone YOUR_REPO_URL
cd ngl-mass-sender
```

**Option C: Manual setup**
```bash
# Create directory
mkdir ~/ngl-sender
cd ~/ngl-sender

# Download files manually or copy them here
```

### Step 4: Install Dependencies

```bash
pip install -r requirements.txt
```

### Step 5: Run the App

```bash
python app.py
```

You'll see:
```
🚀 NGL Mass Sender Web App
📱 Open http://localhost:5000 in your browser
```

### Step 6: Access the Web Interface

**On the same phone:**
1. Open Chrome/Firefox
2. Go to: `http://localhost:5000`

**From another device on same WiFi:**
1. Find your phone's IP: Run `ifconfig` in Termux
2. Look for `wlan0` → `inet` address (e.g., 192.168.1.100)
3. On other device, go to: `http://YOUR_PHONE_IP:5000`

## 🔥 Keep It Running 24/7

### Method 1: Termux:Boot (Auto-start on phone boot)

Install Termux:Boot from F-Droid, then:

```bash
# Create autostart directory
mkdir -p ~/.termux/boot

# Create startup script
nano ~/.termux/boot/start-ngl.sh
```

Add this content:
```bash
#!/data/data/com.termux/files/usr/bin/bash
cd ~/ngl-sender
python app.py
```

Save and make executable:
```bash
chmod +x ~/.termux/boot/start-ngl.sh
```

Now it auto-starts when phone boots!

### Method 2: Termux:Wake Lock (Keep running)

In Termux, run:
```bash
termux-wake-lock
```

This prevents Android from killing Termux when screen is off.

To release:
```bash
termux-wake-unlock
```

### Method 3: Using Screen (Detachable session)

```bash
# Install screen
pkg install screen -y

# Start a detached session
screen -S ngl

# Run the app
python app.py

# Detach: Press Ctrl+A then D
# Your app keeps running!

# To reattach later:
screen -r ngl
```

### Method 4: Using tmux (Better alternative to screen)

```bash
# Install tmux
pkg install tmux -y

# Start tmux session
tmux new -s ngl

# Run the app
python app.py

# Detach: Press Ctrl+B then D

# Reattach later:
tmux attach -t ngl
```

## 📊 Pro Tips for Termux

### 1. **Prevent Battery Optimization**

Go to Android Settings:
- Apps → Termux → Battery → Unrestricted

This prevents Android from killing the app.

### 2. **Notification to Keep Alive**

Termux shows a persistent notification - **don't dismiss it**! It keeps the app alive.

### 3. **Use a Simple Startup Script**

Create `start.sh`:
```bash
#!/data/data/com.termux/files/usr/bin/bash
cd ~/ngl-sender
termux-wake-lock
python app.py
```

Then just run:
```bash
bash start.sh
```

### 4. **Check if Running**

```bash
# See if app is running
ps aux | grep python

# Check port 5000
netstat -tlnp | grep 5000
```

### 5. **Storage Access (if needed)**

To access phone files:
```bash
termux-setup-storage
```

Now you can access `/storage/emulated/0/` (your phone's internal storage).

## 🐛 Troubleshooting

### "Permission denied"
```bash
chmod +x start.sh
```

### "Module not found"
```bash
pip install -r requirements.txt --force-reinstall
```

### "Address already in use"
Kill existing process:
```bash
pkill -f "python app.py"
```

Or use different port in `app.py`:
```python
socketio.run(app, host='0.0.0.0', port=8080)
```

### App stops when screen off
```bash
termux-wake-lock
# Disable battery optimization in Android settings
```

### Can't access from browser
Check firewall or try:
```bash
python app.py
# Make sure it says "Running on http://0.0.0.0:5000"
```

## 🔋 Battery Considerations

Running 24/7 will drain battery. Solutions:
- Keep phone plugged in
- Use battery saver mode EXCEPT for Termux
- Lower screen brightness when not using
- Close other apps

## 📱 Recommended Setup

For best experience:
1. Install Termux from F-Droid
2. Install Termux:Boot and Termux:API (optional)
3. Disable battery optimization for Termux
4. Use `tmux` for detachable sessions
5. Use `termux-wake-lock`
6. Keep phone plugged in if running 24/7

## 🎯 Quick Start Commands

```bash
# Full setup in one go
pkg update -y && \
pkg install python git tmux -y && \
pip install flask flask-socketio requests && \
tmux new -s ngl

# Then in tmux:
python app.py

# Detach: Ctrl+B then D
```

## 🌐 Access From Anywhere (Optional)

Use **ngrok** to expose your local server to the internet:

```bash
# Install ngrok for Termux
pkg install wget -y
cd ~
wget https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-linux-arm64.tgz
tar xvzf ngrok-v3-stable-linux-arm64.tgz
chmod +x ngrok

# Run ngrok (in a separate tmux window)
./ngrok http 5000
```

You'll get a public URL like `https://abc123.ngrok.io` - access your app from anywhere!

---

**You're all set!** Your phone is now a powerful NGL automation server! 🚀📱
