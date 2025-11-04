#!/usr/bin/env python3
"""
NGL Mass Sender - Turbo Edition
Multi-threaded web interface with proxy support
"""
from flask import Flask, render_template, request, jsonify, Response
from flask_socketio import SocketIO, emit
import time
import random
import requests
import uuid
import threading
import json
from itertools import cycle
from concurrent.futures import ThreadPoolExecutor, as_completed
from queue import Queue
from datetime import datetime
import threading

app = Flask(__name__)
app.config['SECRET_KEY'] = 'ngl-mass-sender-secret-turbo'
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='threading')

# Global state
sender_state = {
    'running': False,
    'targets': [],
    'questions': [],
    'proxies': [],
    'stats': {
        'sent': 0,
        'failed': 0,
        'current_targets': [],
        'proxy_success': {},
        'proxy_failures': {},
        'start_time': None,
        'messages_per_min': 0
    },
    'settings': {
        'min_delay': 3,
        'max_delay': 8,
        'threads': 3,
        'use_proxies': True,
        'rotate_proxies': True
    },
    'logs': []
}

# Thread-safe lock
state_lock = threading.Lock()
log_lock = threading.Lock()

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
    "Coffee or tea?", "Cats or dogs?", "Favorite emoji?",
    "Dream vacation destination?", "What song is stuck in your head?",
    "Rate me 1-10", "Confession time?", "Biggest regret?",
    "If you won the lottery tomorrow?", "Weirdest dream you've had?"
]

def add_log(message, level='info', user=None, question=None):
    """Add log entry with timestamp"""
    with log_lock:
        log_entry = {
            'timestamp': datetime.now().isoformat(),
            'message': message,
            'level': level,
            'user': user,
            'question': question
        }
        sender_state['logs'].insert(0, log_entry)
        # Keep only last 500 logs
        if len(sender_state['logs']) > 500:
            sender_state['logs'] = sender_state['logs'][:500]
    return log_entry

def rnd_android_ua():
    """Generate random Android user agent"""
    templates = [
        "Mozilla/5.0 (Linux; Android {v}; SM-G973F) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/{c}.0.0.0 Mobile Safari/537.36",
        "Mozilla/5.0 (Linux; Android {v}; Pixel 6) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/{c}.0.0.0 Mobile Safari/537.36",
        "Mozilla/5.0 (Linux; Android {v}; SM-A505F) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/{c}.0.0.0 Mobile Safari/537.36",
        "Mozilla/5.0 (Linux; Android {v}; OnePlus 9) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/{c}.0.0.0 Mobile Safari/537.36"
    ]
    return random.choice(templates).format(
        v=random.choice(["11", "12", "13", "14"]),
        c=random.randint(118, 130)
    )

def test_proxy(proxy_url):
    """Test if a proxy is working"""
    try:
        proxies = {"http": proxy_url, "https": proxy_url}
        r = requests.get("https://ngl.link", proxies=proxies, timeout=5)
        return r.status_code == 200
    except:
        return False

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
            timeout=15
        )
        
        # Track proxy success
        if proxy:
            with state_lock:
                if proxy not in sender_state['stats']['proxy_success']:
                    sender_state['stats']['proxy_success'][proxy] = 0
                    sender_state['stats']['proxy_failures'][proxy] = 0
                
                if r.status_code == 200:
                    sender_state['stats']['proxy_success'][proxy] += 1
                else:
                    sender_state['stats']['proxy_failures'][proxy] += 1
        
        return r.status_code == 200, r.status_code, r.text[:100], proxy
    except requests.exceptions.RequestException as e:
        if proxy:
            with state_lock:
                if proxy not in sender_state['stats']['proxy_failures']:
                    sender_state['stats']['proxy_failures'][proxy] = 0
                sender_state['stats']['proxy_failures'][proxy] += 1
        return False, 0, str(e)[:100], proxy

def worker_thread(task_queue, proxy_pool):
    """Worker thread that processes send tasks"""
    while sender_state['running']:
        try:
            if task_queue.empty():
                time.sleep(0.1)
                continue
                
            user, question = task_queue.get(timeout=1)
            
            # Get proxy if enabled
            proxy = None
            if sender_state['settings']['use_proxies'] and sender_state['proxies']:
                proxy = next(proxy_pool)
            
            # Add to current targets
            with state_lock:
                if user not in sender_state['stats']['current_targets']:
                    sender_state['stats']['current_targets'].append(user)
                    if len(sender_state['stats']['current_targets']) > 10:
                        sender_state['stats']['current_targets'].pop(0)
            
            # Emit status
            socketio.emit('status', {
                'message': f'Sending to @{user}...',
                'user': user,
                'question': question,
                'proxy': proxy if proxy else 'Direct'
            })
            
            # Send the question
            success, status_code, response, used_proxy = send_question(user, question, proxy)
            
            if success:
                with state_lock:
                    sender_state['stats']['sent'] += 1
                
                log = add_log(f"✅ Sent to @{user}", 'success', user, question)
                
                socketio.emit('success', {
                    'user': user,
                    'question': question,
                    'proxy': used_proxy,
                    'stats': sender_state['stats'].copy(),
                    'log': log
                })
                
                # Random delay
                delay = random.uniform(
                    sender_state['settings']['min_delay'],
                    sender_state['settings']['max_delay']
                )
                time.sleep(delay)
            else:
                with state_lock:
                    sender_state['stats']['failed'] += 1
                
                log = add_log(f"❌ Failed @{user}: {response}", 'error', user, question)
                
                socketio.emit('error', {
                    'user': user,
                    'question': question,
                    'status_code': status_code,
                    'response': response,
                    'proxy': used_proxy,
                    'stats': sender_state['stats'].copy(),
                    'log': log
                })
                
                time.sleep(2)  # Brief delay on error
            
            task_queue.task_done()
            
        except Exception as e:
            print(f"Worker error: {e}")
            continue

def sender_orchestrator():
    """Main orchestrator for multi-threaded sending"""
    target_cycle = cycle(sender_state['targets'])
    question_cycle = cycle(sender_state['questions'])
    proxy_pool = cycle(sender_state['proxies']) if sender_state['proxies'] else cycle([None])
    
    task_queue = Queue()
    
    # Start worker threads
    num_threads = sender_state['settings']['threads']
    workers = []
    for _ in range(num_threads):
        worker = threading.Thread(target=worker_thread, args=(task_queue, proxy_pool), daemon=True)
        worker.start()
        workers.append(worker)
    
    add_log(f"🚀 Started with {num_threads} threads", 'info')
    
    # Track stats
    sender_state['stats']['start_time'] = time.time()
    
    while sender_state['running']:
        if not sender_state['targets'] or not sender_state['questions']:
            time.sleep(1)
            continue
        
        # Add tasks to queue (fill up to thread count * 2)
        while task_queue.qsize() < num_threads * 2:
            user = next(target_cycle)
            question = next(question_cycle)
            task_queue.put((user, question))
        
        # Calculate messages per minute
        if sender_state['stats']['start_time']:
            elapsed = time.time() - sender_state['stats']['start_time']
            if elapsed > 0:
                mpm = (sender_state['stats']['sent'] / elapsed) * 60
                sender_state['stats']['messages_per_min'] = round(mpm, 2)
        
        time.sleep(0.5)

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
        'proxies': sender_state['proxies'],
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
    sender_state['stats'] = {
        'sent': 0,
        'failed': 0,
        'current_targets': [],
        'proxy_success': {},
        'proxy_failures': {},
        'start_time': time.time(),
        'messages_per_min': 0
    }
    sender_state['logs'] = []
    
    thread = threading.Thread(target=sender_orchestrator, daemon=True)
    thread.start()
    
    add_log('🚀 Sender started!', 'success')
    
    return jsonify({'success': True, 'message': 'Sender started'})

@app.route('/api/stop', methods=['POST'])
def stop_sender():
    """Stop the sender"""
    sender_state['running'] = False
    sender_state['stats']['current_targets'] = []
    add_log('⏸️ Sender stopped', 'info')
    return jsonify({'success': True, 'message': 'Sender stopped'})

@app.route('/api/targets', methods=['POST'])
def set_targets():
    """Set target users"""
    data = request.get_json()
    targets = data.get('targets', [])
    
    # Normalize usernames
    cleaned = []
    for t in targets:
        if not t.strip():
            continue
        t = t.split("ngl.link/")[-1].strip("/ @#")
        if t and t not in cleaned:  # Remove duplicates
            cleaned.append(t)
    
    sender_state['targets'] = cleaned
    add_log(f'Updated targets: {len(cleaned)} users', 'info')
    return jsonify({'success': True, 'targets': cleaned})

@app.route('/api/questions', methods=['POST'])
def set_questions():
    """Set questions to send"""
    data = request.get_json()
    questions = data.get('questions', [])
    
    cleaned = [q.strip() for q in questions if q.strip()]
    sender_state['questions'] = cleaned if cleaned else DEFAULT_QUESTIONS.copy()
    
    add_log(f'Updated questions: {len(sender_state["questions"])} questions', 'info')
    return jsonify({'success': True, 'questions': sender_state['questions']})

@app.route('/api/proxies', methods=['POST'])
def set_proxies():
    """Set proxy list"""
    data = request.get_json()
    proxies = data.get('proxies', [])
    
    cleaned = [p.strip() for p in proxies if p.strip()]
    sender_state['proxies'] = cleaned
    
    add_log(f'Updated proxies: {len(cleaned)} proxies', 'info')
    return jsonify({'success': True, 'proxies': cleaned})

@app.route('/api/proxies/test', methods=['POST'])
def test_proxies():
    """Test all proxies"""
    data = request.get_json()
    proxies = data.get('proxies', [])
    
    results = {}
    for proxy in proxies:
        if proxy.strip():
            results[proxy] = test_proxy(proxy.strip())
    
    working = sum(1 for v in results.values() if v)
    add_log(f'Proxy test: {working}/{len(results)} working', 'info')
    
    return jsonify({'success': True, 'results': results})

@app.route('/api/settings', methods=['POST'])
def update_settings():
    """Update sender settings"""
    data = request.get_json()
    
    if 'min_delay' in data:
        sender_state['settings']['min_delay'] = max(0.5, float(data['min_delay']))
    
    if 'max_delay' in data:
        sender_state['settings']['max_delay'] = max(
            sender_state['settings']['min_delay'], 
            float(data['max_delay'])
        )
    
    if 'threads' in data:
        sender_state['settings']['threads'] = max(1, min(10, int(data['threads'])))
    
    if 'use_proxies' in data:
        sender_state['settings']['use_proxies'] = bool(data['use_proxies'])
    
    if 'rotate_proxies' in data:
        sender_state['settings']['rotate_proxies'] = bool(data['rotate_proxies'])
    
    add_log(f'Settings updated', 'info')
    return jsonify({'success': True, 'settings': sender_state['settings']})

@app.route('/api/reset', methods=['POST'])
def reset_stats():
    """Reset statistics"""
    sender_state['stats'] = {
        'sent': 0,
        'failed': 0,
        'current_targets': [],
        'proxy_success': {},
        'proxy_failures': {},
        'start_time': None,
        'messages_per_min': 0
    }
    add_log('Statistics reset', 'info')
    return jsonify({'success': True})

@app.route('/api/logs/export', methods=['GET'])
def export_logs():
    """Export logs as JSON"""
    logs_json = json.dumps(sender_state['logs'], indent=2)
    return Response(
        logs_json,
        mimetype='application/json',
        headers={'Content-Disposition': f'attachment;filename=ngl_logs_{int(time.time())}.json'}
    )

@socketio.on('connect')
def handle_connect():
    """Handle client connection"""
    emit('connected', {
        'message': 'Connected to NGL Mass Sender Turbo',
        'status': sender_state
    })

if __name__ == '__main__':
    # Initialize with default questions
    sender_state['questions'] = DEFAULT_QUESTIONS.copy()
    
    print("=" * 60)
    print("🚀 NGL Mass Sender - TURBO EDITION")
    print("=" * 60)
    print("✨ Features: Multi-threading • Proxy Support • Advanced Stats")
    print("📱 Open: http://localhost:5000")
    print("🔥 Open: http://0.0.0.0:5000 (network access)")
    print("=" * 60)
    
    socketio.run(app, debug=False, host='0.0.0.0', port=5000, allow_unsafe_werkzeug=True)
