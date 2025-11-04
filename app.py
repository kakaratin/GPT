#!/usr/bin/env python3
"""
NGL Mass Sender - Web Version
A modern web interface for sending anonymous questions to NGL users
"""
from flask import Flask, render_template, request, jsonify
from flask_socketio import SocketIO, emit
import time
import random
import requests
import uuid
import threading
from itertools import cycle

app = Flask(__name__)
app.config['SECRET_KEY'] = 'ngl-mass-sender-secret'
socketio = SocketIO(app, cors_allowed_origins="*")

# Global state
sender_state = {
    'running': False,
    'targets': [],
    'questions': [],
    'stats': {
        'sent': 0,
        'failed': 0,
        'current_target': None
    },
    'settings': {
        'min_delay': 6,
        'max_delay': 15,
        'proxies': []
    }
}

DEFAULT_QUESTIONS = [
    "Hey", "Sup", "U up?", "Send me your best meme",
    "Thoughts on pineapple pizza?", "What's your fav song rn?",
    "Would you rather fight 1 horse-sized duck or 100 duck-sized horses?",
    "🔥 or 🗑️ ?", "First crush?", "Biggest fear?",
    "What's something you've never told anyone?",
    "If you could have dinner with anyone, who?",
    "What's your guilty pleasure?",
    "Best memory from this year?",
    "What's your superpower?",
    "Coffee or tea?",
    "Cats or dogs?",
    "Favorite emoji?",
    "Dream vacation destination?",
    "What song is stuck in your head?"
]

def rnd_android_ua():
    """Generate random Android user agent"""
    templates = [
        "Mozilla/5.0 (Linux; Android {v}; SM-G973F) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/{c}.0.0.0 Mobile Safari/537.36",
        "Mozilla/5.0 (Linux; Android {v}; Pixel 6) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/{c}.0.0.0 Mobile Safari/537.36",
        "Mozilla/5.0 (Linux; Android {v}; SM-A505F) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/{c}.0.0.0 Mobile Safari/537.36"
    ]
    return random.choice(templates).format(
        v=random.choice(["10", "11", "12", "13", "14"]),
        c=random.randint(115, 130)
    )

def send_question(username, question, proxy=None):
    """Send a question to NGL user"""
    url = "https://ngl.link/api/submit"
    data = {
        "username": username,
        "question": question,
        "deviceId": str(uuid.uuid4()),
        "gameSlug": "",
        "referrer": ""
    }
    headers = {
        "User-Agent": rnd_android_ua(),
        "Accept": "*/*",
        "Accept-Language": "en-US,en;q=0.9",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "X-Requested-With": "XMLHttpRequest",
        "Origin": "https://ngl.link",
        "Referer": f"https://ngl.link/{username}"
    }
    
    try:
        r = requests.post(
            url, 
            data=data, 
            headers=headers,
            proxies={"http": proxy, "https": proxy} if proxy else None,
            timeout=10
        )
        return r.status_code == 200, r.status_code, r.text[:100]
    except requests.exceptions.RequestException as e:
        return False, 0, str(e)

def sender_worker():
    """Background worker that sends questions"""
    target_cycle = cycle(sender_state['targets'])
    question_cycle = cycle(sender_state['questions'])
    proxy_pool = cycle(sender_state['settings']['proxies']) if sender_state['settings']['proxies'] else cycle([None])
    backoff = 1
    
    while sender_state['running']:
        if not sender_state['targets'] or not sender_state['questions']:
            time.sleep(1)
            continue
            
        user = next(target_cycle)
        question = next(question_cycle)
        proxy = next(proxy_pool)
        
        sender_state['stats']['current_target'] = user
        
        socketio.emit('status', {
            'message': f'Sending to @{user}...',
            'user': user,
            'question': question
        })
        
        success, status_code, response = send_question(user, question, proxy)
        
        if success:
            sender_state['stats']['sent'] += 1
            backoff = 1
            
            socketio.emit('success', {
                'user': user,
                'question': question,
                'stats': sender_state['stats'].copy()
            })
            
            delay = random.uniform(
                sender_state['settings']['min_delay'],
                sender_state['settings']['max_delay']
            )
            time.sleep(delay)
        else:
            sender_state['stats']['failed'] += 1
            
            socketio.emit('error', {
                'user': user,
                'question': question,
                'status_code': status_code,
                'response': response,
                'stats': sender_state['stats'].copy()
            })
            
            backoff = min(backoff * 2, 60)
            time.sleep(backoff)

@app.route('/')
def index():
    """Render the main page"""
    return render_template('index.html')

@app.route('/api/status', methods=['GET'])
def get_status():
    """Get current sender status"""
    return jsonify({
        'running': sender_state['running'],
        'targets': sender_state['targets'],
        'questions': sender_state['questions'],
        'stats': sender_state['stats'],
        'settings': sender_state['settings']
    })

@app.route('/api/start', methods=['POST'])
def start_sender():
    """Start the sender"""
    if sender_state['running']:
        return jsonify({'error': 'Already running'}), 400
    
    if not sender_state['targets']:
        return jsonify({'error': 'No targets configured'}), 400
    
    if not sender_state['questions']:
        return jsonify({'error': 'No questions configured'}), 400
    
    sender_state['running'] = True
    sender_state['stats'] = {'sent': 0, 'failed': 0, 'current_target': None}
    
    thread = threading.Thread(target=sender_worker, daemon=True)
    thread.start()
    
    return jsonify({'success': True, 'message': 'Sender started'})

@app.route('/api/stop', methods=['POST'])
def stop_sender():
    """Stop the sender"""
    sender_state['running'] = False
    sender_state['stats']['current_target'] = None
    return jsonify({'success': True, 'message': 'Sender stopped'})

@app.route('/api/targets', methods=['POST'])
def set_targets():
    """Set target users"""
    data = request.get_json()
    targets = data.get('targets', [])
    
    # Normalize usernames (remove ngl.link/ prefix if present)
    cleaned = []
    for t in targets:
        if not t.strip():
            continue
        t = t.split("ngl.link/")[-1].strip("/ @")
        if t:
            cleaned.append(t)
    
    sender_state['targets'] = cleaned
    return jsonify({'success': True, 'targets': cleaned})

@app.route('/api/questions', methods=['POST'])
def set_questions():
    """Set questions to send"""
    data = request.get_json()
    questions = data.get('questions', [])
    
    cleaned = [q.strip() for q in questions if q.strip()]
    sender_state['questions'] = cleaned if cleaned else DEFAULT_QUESTIONS.copy()
    
    return jsonify({'success': True, 'questions': sender_state['questions']})

@app.route('/api/settings', methods=['POST'])
def update_settings():
    """Update sender settings"""
    data = request.get_json()
    
    if 'min_delay' in data:
        sender_state['settings']['min_delay'] = max(1, float(data['min_delay']))
    
    if 'max_delay' in data:
        sender_state['settings']['max_delay'] = max(
            sender_state['settings']['min_delay'], 
            float(data['max_delay'])
        )
    
    if 'proxies' in data:
        proxies = [p.strip() for p in data['proxies'] if p.strip()]
        sender_state['settings']['proxies'] = proxies
    
    return jsonify({'success': True, 'settings': sender_state['settings']})

@app.route('/api/reset', methods=['POST'])
def reset_stats():
    """Reset statistics"""
    sender_state['stats'] = {'sent': 0, 'failed': 0, 'current_target': None}
    return jsonify({'success': True})

@socketio.on('connect')
def handle_connect():
    """Handle client connection"""
    emit('connected', {
        'message': 'Connected to NGL Mass Sender',
        'status': sender_state
    })

if __name__ == '__main__':
    # Initialize with default questions
    sender_state['questions'] = DEFAULT_QUESTIONS.copy()
    
    print("🚀 NGL Mass Sender Web App")
    print("📱 Open http://localhost:5000 in your browser")
    socketio.run(app, debug=True, host='0.0.0.0', port=5000)
