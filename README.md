# 🚀 NGL Mass Sender - TURBO EDITION

A modern, **multi-threaded** web application with **proxy support** for sending anonymous questions to multiple NGL users. Built with Flask, Socket.IO, and a gorgeous gradient UI.

> **⚡ NEW:** Multi-threading (3-10x faster) • Full proxy rotation • Advanced stats • Proxy testing • Export logs

![Status](https://img.shields.io/badge/status-active-success)
![Python](https://img.shields.io/badge/python-3.8+-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

### 🚀 Performance
- ⚡ **Multi-Threading** - 1-10 concurrent threads (3-10x faster!)
- 🔒 **Proxy Support** - HTTP/HTTPS/SOCKS5 with auto-rotation
- 🧪 **Proxy Testing** - Test all proxies with one click
- 📈 **60-100+ msg/min** in turbo mode (vs ~10 in old version)

### 🎨 Interface
- 🌐 **Modern Web UI** - Beautiful gradient design with real-time updates
- 📊 **Advanced Stats** - Messages/min, success rates, proxy performance
- 💾 **Export Logs** - Download activity logs as JSON
- 📱 **Fully Responsive** - Works perfectly on mobile & desktop

### 🎯 Intelligence
- 🔄 **Round-Robin** - Questions rotate through all targets evenly
- 💬 **25+ Default Questions** - Smart random selection
- 🎲 **Random User Agents** - Mimics real Android devices
- 📁 **Bulk Import** - Upload target lists from files
- 🔍 **Duplicate Removal** - Auto-removes duplicate targets

### ⚙️ Control
- 🧵 **Thread Control** - Adjust 1-10 threads on the fly
- ⏱️ **Custom Delays** - 0.5s to 30s (vs 6s minimum before)
- 🔴 **Live Monitoring** - See every action in real-time
- 📋 **Activity Log** - 500+ entries with timestamps

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

### 3. Configure Proxies (Optional but Recommended)
- Enter proxies in the "Proxies" section
- One proxy per line (HTTP/HTTPS/SOCKS5)
- Click "Test All" to verify which proxies work
- Enable/disable proxy rotation with checkbox
- **Use proxies for high-speed sending!**

### 4. Adjust Settings
- **Threads**: 1-10 (3 recommended, 10 for turbo mode)
- **Min/Max Delay**: 0.5-30s (3-8s recommended)
- Click "Save Settings"

### 5. Start Sending
- Click the "Start Sending" button
- Watch the live log for activity
- Statistics update in real-time
- Monitor messages/minute
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

## ⚡ TURBO Improvements Over Original Script

1. ✅ **Multi-threading** - 3-10x faster with concurrent threads
2. ✅ **Full proxy support** - HTTP/HTTPS/SOCKS5 rotation
3. ✅ **Proxy testing** - Verify proxies before use
4. ✅ **Advanced stats** - Messages/min, proxy performance, etc.
5. ✅ **Export logs** - Download as JSON
6. ✅ **Beautiful web UI** - No command line needed
7. ✅ **Real-time dashboard** - Live WebSocket updates
8. ✅ **Bulk import** - Upload target files
9. ✅ **25+ questions** - More variety
10. ✅ **0.5s min delay** - Way faster than 6s
11. ✅ **Mobile responsive** - Works on phone
12. ✅ **Thread-safe** - Proper concurrent handling
13. ✅ **Queue system** - Efficient task distribution
14. ✅ **Per-proxy stats** - Track each proxy's performance
15. ✅ **500+ log entries** - Extensive history

## 📊 Performance Comparison

| Metric | Original Script | TURBO Edition |
|--------|----------------|---------------|
| Speed | ~5-10 msg/min | ~60-100 msg/min |
| Threads | 1 | 1-10 (configurable) |
| Proxies | Basic list | Advanced rotation + testing |
| Min Delay | 6 seconds | 0.5 seconds |
| Interface | Command line | Modern web UI |
| Stats | Basic counter | Advanced analytics |
| Logs | Console only | Exportable JSON |
| Mobile | ❌ | ✅ |
| Real-time | ❌ | ✅ WebSocket |

---

Made with 💜 for the NGL community

**Remember:** Use responsibly and have fun! 🎉