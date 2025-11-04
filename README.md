# 🎯 NGL Mass Sender - Web Edition

A modern, beautiful web application for sending anonymous questions to multiple NGL users in rotation. Built with Flask, Socket.IO, and a sleek gradient UI.

![Status](https://img.shields.io/badge/status-active-success)
![Python](https://img.shields.io/badge/python-3.8+-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

- 🌐 **Modern Web Interface** - Beautiful gradient UI with real-time updates
- 🔄 **Round-Robin Distribution** - Questions rotate through all targets evenly
- 📊 **Live Statistics** - Track sent/failed messages in real-time
- 💬 **Custom Questions** - Add your own questions or use built-in defaults
- ⚙️ **Configurable Delays** - Adjust timing to avoid rate limits
- 🔒 **Proxy Support** - Optional HTTP/HTTPS/SOCKS5 proxies
- 📁 **Bulk Import** - Upload target lists from files
- 📱 **Responsive Design** - Works on desktop and mobile
- 🔴 **Live Activity Log** - See every action as it happens
- 🎲 **Random User Agents** - Mimics real mobile devices
- ❓ **Built-in Help** - Tab with full explanations and best settings

## 🚀 Quick Start

### Installation

1. **Clone or download this repository**

2. **Install dependencies:**
```bash
pip install -r requirements.txt
```

3. **Run the application:**
```bash
python app.py
```

4. **Open your browser:**
```
http://localhost:5000
```

## 📖 How to Use

### 1. Add Target Users
- Enter NGL usernames in the "Target Users" section
- One username per line
- Can use full links like `ngl.link/username` or just `username`
- Click "Update Targets" to save

### 2. Customize Questions (Optional)
- Enter your custom questions in the "Questions" section
- One question per line
- Leave empty to use 20+ built-in questions
- Click "Update Questions" to save

### 3. Adjust Settings (Optional)
- Set minimum and maximum delay between sends
- Default: 6-15 seconds (recommended to avoid rate limits)
- Add proxies if desired (one per line)
- Click "Save Settings" to apply

### 4. Check the Help Tab
- Click "❓ How It Works" tab
- Learn about round-robin distribution
- See recommended settings
- Get pro tips for best results

### 5. Start Sending
- Click the "Start Sending" button
- Watch the live log for activity
- Statistics update in real-time
- Click "Stop Sending" to pause

## 🎨 Features Explained

### Round-Robin Distribution
Unlike spam tools that hit the same user repeatedly, this app cycles through ALL your targets. Each question goes to a different user, making the distribution fair and natural.

### Smart Rate Limiting
- Random delays between requests (6-15s default)
- Exponential backoff on errors
- Random Android user agents
- Device ID rotation

### Real-Time Updates
- WebSocket connection for instant feedback
- See exactly what's being sent and to whom
- Live success/failure notifications
- Running statistics

### Beautiful UI
- Gradient purple theme
- Smooth animations
- Responsive design
- Clean, modern interface
- Mobile-friendly

## 🔧 Advanced Usage

### Running on a Server

To run on a production server (accessible from other devices):

```bash
python app.py
```

Then access from any device on your network:
```
http://your-server-ip:5000
```

### Using with Proxies

Edit `app.py` and add proxies to the settings:

```python
sender_state['settings']['proxies'] = [
    "http://proxy1:port",
    "socks5://proxy2:port"
]
```

### Custom Port

Change the port in `app.py`:

```python
socketio.run(app, debug=True, host='0.0.0.0', port=8080)
```

## 📊 Default Questions

The app comes with 20 fun default questions:
- "Hey", "Sup", "U up?"
- "Thoughts on pineapple pizza?"
- "What's your fav song rn?"
- "Would you rather fight 1 horse-sized duck or 100 duck-sized horses?"
- And 15 more creative questions!

## ⚠️ Important Notes

### Rate Limiting
NGL has rate limiting. The default 6-15 second delay is recommended. Going faster may result in temporary blocks.

### Ethical Use
This tool is for educational purposes. Use responsibly:
- Don't harass or spam users
- Don't send inappropriate content
- Respect NGL's terms of service
- Use for fun, not harm

### Reliability
- Success rate depends on NGL's API availability
- Network errors are automatically retried with backoff
- Failed messages are logged for review

## 🛠️ Technical Details

### Stack
- **Backend:** Flask + Flask-SocketIO
- **Frontend:** Vanilla JavaScript + Socket.IO client
- **Real-time:** WebSocket communication
- **HTTP Client:** requests library

### Architecture
- Single-threaded background worker
- Event-driven updates via WebSockets
- Stateful server (targets, questions, stats)
- RESTful API endpoints + WebSocket events

### API Endpoints
- `GET /api/status` - Get current state
- `POST /api/start` - Start sending
- `POST /api/stop` - Stop sending
- `POST /api/targets` - Update targets
- `POST /api/questions` - Update questions
- `POST /api/settings` - Update settings
- `POST /api/reset` - Reset statistics

## 🐛 Troubleshooting

### "Already running" error
Stop the sender first before starting again.

### "No targets configured" error
Add at least one username in the Target Users section.

### High failure rate
- Increase delays in settings
- Check your internet connection
- NGL might be rate limiting - wait a few minutes

### WebSocket not connecting
- Check firewall settings
- Ensure port 5000 is accessible
- Try a different browser

## 📝 License

MIT License - feel free to modify and use as you wish!

## 🤝 Contributing

Improvements welcome! Some ideas:
- Proxy rotation UI
- Import/export target lists
- Scheduling (send at specific times)
- Multiple question sets
- Message templates with variables
- Statistics export

## ⚡ Improvements Over Original Script

1. ✅ Beautiful web interface (no command line needed)
2. ✅ Real-time visual feedback via WebSocket
3. ✅ Easy target/question management
4. ✅ Live statistics dashboard
5. ✅ Mobile-friendly responsive design
6. ✅ Activity logging with timestamps
7. ✅ More default questions (20 vs 10)
8. ✅ Better error handling
9. ✅ Modern UI/UX with animations
10. ✅ Bulk file import for targets
11. ✅ Built-in help tab with guides
12. ✅ Proxy support (optional)
13. ✅ Round-robin distribution
14. ✅ Configurable delays

---

Made with 💜 for the NGL community

**Remember:** Use responsibly and have fun! 🎉