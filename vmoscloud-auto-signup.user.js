// ==UserScript==
// @name         VmosCloud Auto Signup 🔥
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Auto signup for vmoscloud.com with mail.tm - YOU handle captcha, WE handle the rest! 💪
// @author       Your Friendly Coding Bro
// @match        https://cloud.vmoscloud.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @connect      api.mail.tm
// ==/UserScript==

(function() {
    'use strict';

    // 🎨 STYLES FOR OUR SICK UI
    const styles = `
        .auto-signup-panel {
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            z-index: 999999;
            font-family: 'Arial', sans-serif;
            min-width: 300px;
            max-width: 400px;
            transition: all 0.3s;
        }
        .auto-signup-panel.minimized {
            padding: 10px 15px;
            min-width: 200px;
        }
        .auto-signup-panel.minimized .panel-body {
            display: none;
        }
        .panel-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
            cursor: pointer;
            user-select: none;
        }
        .auto-signup-panel.minimized .panel-header {
            margin-bottom: 0;
        }
        .panel-header h3 {
            margin: 0;
            font-size: 18px;
            display: flex;
            align-items: center;
            gap: 8px;
            flex: 1;
        }
        .minimize-btn {
            background: rgba(255,255,255,0.2) !important;
            color: white !important;
            padding: 5px 12px !important;
            font-size: 16px !important;
            border-radius: 5px !important;
            margin: 0 !important;
            width: auto !important;
            margin-left: 10px !important;
        }
        .minimize-btn:hover {
            background: rgba(255,255,255,0.3) !important;
        }
        .auto-signup-panel button {
            width: 100%;
            padding: 12px;
            margin: 5px 0;
            border: none;
            border-radius: 8px;
            font-size: 14px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s;
            background: white;
            color: #667eea;
        }
        .auto-signup-panel button:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }
        .auto-signup-panel button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none;
        }
        .status-box {
            background: rgba(255,255,255,0.2);
            padding: 10px;
            border-radius: 8px;
            margin: 10px 0;
            font-size: 13px;
            line-height: 1.6;
            word-break: break-all;
        }
        .status-box strong {
            display: block;
            margin-bottom: 5px;
        }
        .progress-bar {
            width: 100%;
            height: 6px;
            background: rgba(255,255,255,0.3);
            border-radius: 3px;
            overflow: hidden;
            margin: 10px 0;
        }
        .progress-fill {
            height: 100%;
            background: #4ade80;
            width: 0%;
            transition: width 0.3s;
        }
        .email-display {
            background: rgba(0,0,0,0.2);
            padding: 8px;
            border-radius: 5px;
            font-size: 12px;
            margin: 10px 0;
            word-break: break-all;
        }
    `;

    // Add styles to page
    const styleSheet = document.createElement("style");
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    // 🔥 MAIL.TM API CLASS
    class MailTM {
        constructor() {
            this.baseURL = 'https://api.mail.tm';
            this.token = GM_getValue('mailTmToken', null);
            this.email = GM_getValue('mailTmEmail', null);
            this.accountId = GM_getValue('mailTmAccountId', null);
        }

        async request(endpoint, method = 'GET', data = null, useAuth = false) {
            return new Promise((resolve, reject) => {
                const headers = {
                    'Content-Type': 'application/json',
                };
                if (useAuth && this.token) {
                    headers['Authorization'] = `Bearer ${this.token}`;
                }

                GM_xmlhttpRequest({
                    method: method,
                    url: this.baseURL + endpoint,
                    headers: headers,
                    data: data ? JSON.stringify(data) : null,
                    onload: (response) => {
                        try {
                            const result = JSON.parse(response.responseText);
                            resolve(result);
                        } catch (e) {
                            resolve(response.responseText);
                        }
                    },
                    onerror: (error) => reject(error)
                });
            });
        }

        async getDomains() {
            const response = await this.request('/domains');
            return response['hydra:member'];
        }

        async createAccount() {
            const domains = await this.getDomains();
            if (domains.length === 0) throw new Error('No domains available');

            const domain = domains[0].domain;
            const username = 'user' + Math.random().toString(36).substring(2, 10);
            const password = Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);

            const email = `${username}@${domain}`;

            const accountData = await this.request('/accounts', 'POST', {
                address: email,
                password: password
            });

            this.email = email;
            this.accountId = accountData.id;

            // Now get token
            const tokenData = await this.request('/token', 'POST', {
                address: email,
                password: password
            });

            this.token = tokenData.token;

            // Save to storage
            GM_setValue('mailTmToken', this.token);
            GM_setValue('mailTmEmail', this.email);
            GM_setValue('mailTmAccountId', this.accountId);

            return { email, token: this.token };
        }

        async getMessages() {
            if (!this.token) throw new Error('Not authenticated');
            const response = await this.request('/messages', 'GET', null, true);
            return response['hydra:member'] || [];
        }

        async getMessage(messageId) {
            if (!this.token) throw new Error('Not authenticated');
            return await this.request(`/messages/${messageId}`, 'GET', null, true);
        }

        clearStorage() {
            GM_deleteValue('mailTmToken');
            GM_deleteValue('mailTmEmail');
            GM_deleteValue('mailTmAccountId');
            this.token = null;
            this.email = null;
            this.accountId = null;
        }
    }

    // 🚀 MAIN AUTO SIGNUP CLASS
    class AutoSignup {
        constructor() {
            this.mailTM = new MailTM();
            this.ui = null;
            this.statusBox = null;
            this.progressBar = null;
            this.checkInterval = null;
        }

        createUI() {
            const panel = document.createElement('div');
            panel.className = 'auto-signup-panel';
            panel.innerHTML = `
                <div class="panel-header">
                    <h3>🔥 VmosCloud Helper</h3>
                    <button class="minimize-btn" id="minimizeBtn">−</button>
                </div>
                <div class="panel-body">
                    <div class="progress-bar">
                        <div class="progress-fill" id="progressFill"></div>
                    </div>
                    <div class="email-display" id="emailDisplay" style="display:none;">
                        📧 <span id="currentEmail"></span>
                    </div>
                    <div class="status-box" id="statusBox">
                        <strong>Ready to GO! 💪</strong>
                        Let's get you signed up bro!
                    </div>
                    <button id="fillEmailBtn">📧 Fill Email (Step 1)</button>
                    <button id="checkCodeBtn" style="display:none;">🔍 Check & Fill Code (Step 2)</button>
                    <button id="newEmailBtn">✉️ New Email</button>
                    <button id="resetBtn">🔄 Reset</button>
                </div>
            `;

            document.body.appendChild(panel);
            this.ui = panel;
            this.statusBox = panel.querySelector('#statusBox');
            this.progressBar = panel.querySelector('#progressFill');
            this.emailDisplay = panel.querySelector('#emailDisplay');
            this.currentEmailSpan = panel.querySelector('#currentEmail');

            // Minimize/Maximize
            const minimizeBtn = panel.querySelector('#minimizeBtn');
            minimizeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                panel.classList.toggle('minimized');
                minimizeBtn.textContent = panel.classList.contains('minimized') ? '+' : '−';
            });

            // Click header to toggle
            panel.querySelector('.panel-header').addEventListener('click', () => {
                panel.classList.toggle('minimized');
                minimizeBtn.textContent = panel.classList.contains('minimized') ? '+' : '−';
            });

            // Event listeners
            panel.querySelector('#fillEmailBtn').addEventListener('click', () => this.fillEmail());
            panel.querySelector('#checkCodeBtn').addEventListener('click', () => this.checkAndFillCode());
            panel.querySelector('#newEmailBtn').addEventListener('click', () => this.generateNewEmail());
            panel.querySelector('#resetBtn').addEventListener('click', () => this.reset());
        }

        updateStatus(message, progress = null) {
            if (this.statusBox) {
                this.statusBox.innerHTML = message;
            }
            if (progress !== null && this.progressBar) {
                this.progressBar.style.width = progress + '%';
            }
            console.log('Status:', message);
        }

        async generateNewEmail() {
            try {
                this.updateStatus('⏳ Generating new email...', 20);
                const { email } = await this.mailTM.createAccount();
                this.emailDisplay.style.display = 'block';
                this.currentEmailSpan.textContent = email;
                this.updateStatus(`<strong>✅ Email Ready!</strong><br><br>Click "Fill Email" to auto-fill it in the form! 🚀`, 100);
            } catch (error) {
                this.updateStatus(`<strong>❌ OH SHIT!</strong><br>${error.message}<br><br>Try again bro!`, 0);
            }
        }

        async fillEmail() {
            try {
                // Make sure we have an email
                if (!this.mailTM.email || !this.mailTM.token) {
                    this.updateStatus('📧 Creating temp email first...', 10);
                    await this.mailTM.createAccount();
                    this.emailDisplay.style.display = 'block';
                    this.currentEmailSpan.textContent = this.mailTM.email;
                }

                this.updateStatus(`<strong>Looking for email field...</strong>`, 30);

                // Try to find and fill email field with multiple methods
                const emailSelectors = [
                    'input[type="email"]',
                    'input[type="text"]',
                    'input[name*="email" i]',
                    'input[placeholder*="email" i]',
                    'input[placeholder*="mail" i]',
                    'input[id*="email" i]',
                    'input[class*="email" i]'
                ];

                let filled = false;
                for (let selector of emailSelectors) {
                    const fields = document.querySelectorAll(selector);
                    for (let field of fields) {
                        // Make sure field is visible
                        if (field.offsetParent !== null && !field.disabled) {
                            field.value = this.mailTM.email;
                            
                            // Trigger all possible events
                            field.dispatchEvent(new Event('input', { bubbles: true }));
                            field.dispatchEvent(new Event('change', { bubbles: true }));
                            field.dispatchEvent(new Event('blur', { bubbles: true }));
                            field.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true }));
                            field.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));
                            
                            // Also try to focus it
                            field.focus();
                            
                            console.log('✅ Email filled in:', selector, field);
                            filled = true;
                            break;
                        }
                    }
                    if (filled) break;
                }

                if (filled) {
                    this.updateStatus(`<strong>✅ EMAIL FILLED! 🔥</strong><br><br>📧 ${this.mailTM.email}<br><br><strong>NOW:</strong><br>1. Solve the captcha 🤖<br>2. Click Submit<br>3. Click "Check & Fill Code" below!`, 50);
                    // Show the check code button
                    document.querySelector('#checkCodeBtn').style.display = 'block';
                } else {
                    this.updateStatus(`<strong>⚠️ Couldn't find email field!</strong><br><br>Manually paste this:<br><br>${this.mailTM.email}<br><br>Then solve captcha & click "Check & Fill Code"`, 40);
                    document.querySelector('#checkCodeBtn').style.display = 'block';
                }

            } catch (error) {
                this.updateStatus(`<strong>❌ ERROR!</strong><br>${error.message}`, 0);
            }
        }

        async checkAndFillCode() {
            try {
                this.updateStatus('📬 Checking inbox...', 60);

                const messages = await this.mailTM.getMessages();

                if (messages.length === 0) {
                    this.updateStatus(`<strong>📭 No emails yet!</strong><br><br>⏳ Waiting for verification code...<br><br>Click again in 5-10 seconds!`, 70);
                    return;
                }

                // Get the latest message
                const latestMessage = messages[0];
                this.updateStatus(`<strong>📧 Email found!</strong><br><br>Getting verification code...`, 75);
                
                const fullMessage = await this.mailTM.getMessage(latestMessage.id);
                console.log('📧 Full message object:', fullMessage);

                // Extract ALL text from the email - KEEP IT SIMPLE
                let emailText = '';
                
                // Get intro text
                if (fullMessage.intro) {
                    emailText += String(fullMessage.intro) + ' ';
                }
                
                // Get text content
                if (fullMessage.text) {
                    emailText += String(fullMessage.text) + ' ';
                }
                
                // Get HTML and strip tags
                if (fullMessage.html) {
                    let htmlStr = String(fullMessage.html);
                    if (typeof htmlStr === 'string') {
                        emailText += htmlStr.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ') + ' ';
                    }
                }
                
                // Get subject
                if (fullMessage.subject) {
                    emailText += String(fullMessage.subject) + ' ';
                }

                console.log('📝 Email text extracted:', emailText);

                // SIMPLE APPROACH - Just find ALL numbers that look like codes
                // Look for 4-8 digit numbers or 6 alphanumeric codes
                const allNumbers = emailText.match(/\b\d{4,8}\b/g);
                console.log('🔢 All numbers found:', allNumbers);

                let code = null;
                
                // Try specific patterns first
                const patterns = [
                    /verification code[:\s]+(\d{4,8})/i,
                    /code[:\s]+(\d{4,8})/i,
                    /your code[:\s]+(\d{4,8})/i,
                    /verify[:\s]+(\d{4,8})/i,
                    /\b(\d{6})\b/,  // Most common - 6 digits
                ];

                for (let pattern of patterns) {
                    const match = emailText.match(pattern);
                    if (match && match[1]) {
                        code = match[1];
                        console.log('✅ Code found with pattern:', pattern, '→', code);
                        break;
                    }
                }

                // Fallback: Just use the first 6-digit or 4-8 digit number found
                if (!code && allNumbers && allNumbers.length > 0) {
                    // Prefer 6-digit codes
                    code = allNumbers.find(n => n.length === 6) || allNumbers[0];
                    console.log('✅ Using first number found:', code);
                }

                if (!code) {
                    // Show the email content so user can find it manually
                    this.updateStatus(`<strong>⚠️ Couldn't find code!</strong><br><br><strong>Email text:</strong><br>${emailText.substring(0, 300)}...<br><br>Copy the code manually bro!`, 85);
                    return;
                }

                // Found the code! Now try to fill it
                this.updateStatus(`<strong>✅ Code Found: ${code}</strong><br><br>Filling boxes...`, 85);

                console.log('🔍 Looking for OTP input boxes...');

                // METHOD 1: Look for OTP boxes with maxlength="1" (most common!)
                let otpBoxes = Array.from(document.querySelectorAll('input[maxlength="1"]'));
                console.log('Found maxlength=1 inputs:', otpBoxes.length, otpBoxes);

                // METHOD 2: If no maxlength=1, look for visible small inputs
                if (otpBoxes.length === 0) {
                    const allInputs = Array.from(document.querySelectorAll('input'));
                    otpBoxes = allInputs.filter(input => {
                        const isVisible = input.offsetParent !== null && !input.disabled && input.type !== 'hidden';
                        const notEmail = input.type !== 'email' && 
                                       !input.name?.toLowerCase().includes('email') && 
                                       !input.placeholder?.toLowerCase().includes('email');
                        const isEmpty = !input.value || input.value.length <= 1;
                        return isVisible && notEmail && isEmpty;
                    });
                    console.log('Found visible empty inputs:', otpBoxes.length, otpBoxes);
                }

                // Check if we have OTP boxes (usually 4-6-8 boxes)
                let filled = false;
                if (otpBoxes.length >= 4 && otpBoxes.length <= 8 && code.length >= otpBoxes.length) {
                    console.log('🎯 DETECTED OTP BOXES! Filling each one...');
                    const codeDigits = code.split('');
                    
                    for (let i = 0; i < Math.min(otpBoxes.length, codeDigits.length); i++) {
                        const box = otpBoxes[i];
                        const digit = codeDigits[i];
                        
                        // Clear it first
                        box.value = '';
                        
                        // Focus it
                        box.focus();
                        
                        // Set the value
                        box.value = digit;
                        
                        // Create a REAL keyboard event (like typing)
                        const keydownEvent = new KeyboardEvent('keydown', {
                            key: digit,
                            code: 'Digit' + digit,
                            keyCode: 48 + parseInt(digit),
                            bubbles: true,
                            cancelable: true
                        });
                        box.dispatchEvent(keydownEvent);
                        
                        // Input event
                        const inputEvent = new InputEvent('input', {
                            data: digit,
                            inputType: 'insertText',
                            bubbles: true,
                            cancelable: true
                        });
                        box.dispatchEvent(inputEvent);
                        
                        // Change event
                        box.dispatchEvent(new Event('change', { bubbles: true }));
                        
                        // Keyup event
                        const keyupEvent = new KeyboardEvent('keyup', {
                            key: digit,
                            code: 'Digit' + digit,
                            keyCode: 48 + parseInt(digit),
                            bubbles: true,
                            cancelable: true
                        });
                        box.dispatchEvent(keyupEvent);
                        
                        console.log(`✅ Box ${i + 1}: Filled with "${digit}" | Value now: "${box.value}"`);
                        
                        // Small delay between boxes (helps with some frameworks)
                        await new Promise(resolve => setTimeout(resolve, 50));
                    }
                    
                    // Focus the last box
                    if (otpBoxes[otpBoxes.length - 1]) {
                        otpBoxes[otpBoxes.length - 1].blur();
                    }
                    
                    filled = true;
                    console.log('🎉 ALL BOXES FILLED!');
                } else {
                    // Try single field method
                    const codeSelectors = [
                        'input[type="text"]:not([name*="email" i]):not([name*="mail" i])',
                        'input[name*="code" i]',
                        'input[placeholder*="code" i]',
                        'input[placeholder*="verification" i]',
                        'input[placeholder*="verify" i]',
                        'input[id*="code" i]',
                        'input[id*="verify" i]',
                        'input[class*="code" i]',
                        'input[type="tel"]',
                        'input[type="number"]'
                    ];

                    for (let selector of codeSelectors) {
                        const fields = document.querySelectorAll(selector);
                        for (let field of fields) {
                            if (field.offsetParent !== null && !field.disabled && field.value.length < 3) {
                                field.value = code;
                                
                                // Trigger ALL the events!
                                field.dispatchEvent(new Event('input', { bubbles: true }));
                                field.dispatchEvent(new Event('change', { bubbles: true }));
                                field.dispatchEvent(new Event('blur', { bubbles: true }));
                                field.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true }));
                                field.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));
                                field.focus();
                                
                                console.log('✅ Code filled in single field:', selector, field);
                                filled = true;
                                break;
                            }
                        }
                        if (filled) break;
                    }
                }

                if (filled) {
                    this.updateStatus(`<strong>🎉 CODE FILLED! 🔥</strong><br><br>✅ Code: <strong>${code}</strong><br><br>Check if all boxes are filled!<br>If not, paste this code manually! 💪`, 100);
                } else {
                    this.updateStatus(`<strong>✅ Code Found!</strong><br><br><strong style="font-size:20px;">${code}</strong><br><br>⚠️ Couldn't find OTP boxes<br>(Found ${otpBoxes.length} inputs)<br><br>COPY this code and paste manually! 👆`, 90);
                }

            } catch (error) {
                this.updateStatus(`<strong>❌ ERROR!</strong><br>${error.message}<br><br>MY BAD! Try clicking again?`, 0);
            }
        }

        async waitForElement(selector, timeout = 5000) {
            const startTime = Date.now();
            while (Date.now() - startTime < timeout) {
                const element = document.querySelector(selector);
                if (element) return element;
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            throw new Error(`Element not found: ${selector}`);
        }

        reset() {
            this.mailTM.clearStorage();
            if (this.checkInterval) {
                clearInterval(this.checkInterval);
            }
            this.emailDisplay.style.display = 'none';
            this.currentEmailSpan.textContent = '';
            this.updateStatus('<strong>🔄 Reset Complete!</strong><br><br>All cleared! Ready to GO AGAIN! 💪', 0);
            document.querySelector('#checkCodeBtn').style.display = 'none';
        }

        init() {
            console.log('🔥 VmosCloud Auto Signup - ACTIVATED!');
            // Wait for page to load
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.createUI());
            } else {
                this.createUI();
            }
        }
    }

    // 🚀 START IT UP!
    const autoSignup = new AutoSignup();
    autoSignup.init();

})();
