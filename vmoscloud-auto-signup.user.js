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
        }
        .auto-signup-panel h3 {
            margin: 0 0 15px 0;
            font-size: 18px;
            display: flex;
            align-items: center;
            gap: 8px;
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
        .close-btn {
            background: #ef4444 !important;
            color: white !important;
            padding: 8px !important;
            font-size: 12px !important;
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
                <h3>🔥 Auto Signup Helper</h3>
                <div class="progress-bar">
                    <div class="progress-fill" id="progressFill"></div>
                </div>
                <div class="status-box" id="statusBox">
                    <strong>Ready to GO! 💪</strong>
                    Click "Start Auto Signup" to begin!
                </div>
                <button id="startBtn">🚀 Start Auto Signup</button>
                <button id="fillCodeBtn" style="display:none;">📧 Check & Fill Code</button>
                <button id="newEmailBtn">✉️ Generate New Email</button>
                <button id="resetBtn">🔄 Reset Everything</button>
                <button class="close-btn" id="closeBtn">✖ Close</button>
            `;

            document.body.appendChild(panel);
            this.ui = panel;
            this.statusBox = panel.querySelector('#statusBox');
            this.progressBar = panel.querySelector('#progressFill');

            // Event listeners
            panel.querySelector('#startBtn').addEventListener('click', () => this.startAutoSignup());
            panel.querySelector('#fillCodeBtn').addEventListener('click', () => this.checkAndFillCode());
            panel.querySelector('#newEmailBtn').addEventListener('click', () => this.generateNewEmail());
            panel.querySelector('#resetBtn').addEventListener('click', () => this.reset());
            panel.querySelector('#closeBtn').addEventListener('click', () => {
                panel.style.display = 'none';
            });
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
                this.updateStatus('⏳ Generating new email...', 10);
                const { email } = await this.mailTM.createAccount();
                this.updateStatus(`<strong>✅ Email Created!</strong><br>${email}<br><br>This email is now saved and ready to use!`, 100);
            } catch (error) {
                this.updateStatus(`<strong>❌ ERROR!</strong><br>${error.message}`, 0);
            }
        }

        async startAutoSignup() {
            try {
                this.updateStatus('🚀 STARTING AUTO SIGNUP...', 5);

                // Step 1: Make sure we have an email
                if (!this.mailTM.email || !this.mailTM.token) {
                    this.updateStatus('📧 Creating temp email account...', 10);
                    await this.mailTM.createAccount();
                }

                this.updateStatus(`<strong>📧 Using Email:</strong><br>${this.mailTM.email}`, 30);

                // Step 2: Fill the form
                await this.waitForElement('input[type="email"], input[name="email"]', 5000);
                this.fillSignupForm();
                this.updateStatus(`<strong>✅ Form Filled!</strong><br><br>📧 Email: ${this.mailTM.email}<br><br>🤖 NOW SOLVE THE CAPTCHA BRO!<br>Then click submit and hit "Check & Fill Code" button!`, 60);

                // Show the fill code button
                document.querySelector('#fillCodeBtn').style.display = 'block';

            } catch (error) {
                this.updateStatus(`<strong>❌ OH SHIT! ERROR!</strong><br>${error.message}`, 0);
            }
        }

        fillSignupForm() {
            // Try to find and fill email field
            const emailSelectors = [
                'input[type="email"]',
                'input[name="email"]',
                'input[placeholder*="email" i]',
                'input[placeholder*="mail" i]',
                'input[id*="email" i]'
            ];

            for (let selector of emailSelectors) {
                const emailField = document.querySelector(selector);
                if (emailField) {
                    emailField.value = this.mailTM.email;
                    emailField.dispatchEvent(new Event('input', { bubbles: true }));
                    emailField.dispatchEvent(new Event('change', { bubbles: true }));
                    console.log('✅ Email filled:', selector);
                    break;
                }
            }

            // Try to fill password fields with a strong random password
            const password = 'Pass' + Math.random().toString(36).substring(2) + '123!@#';
            const passwordFields = document.querySelectorAll('input[type="password"]');
            passwordFields.forEach(field => {
                field.value = password;
                field.dispatchEvent(new Event('input', { bubbles: true }));
                field.dispatchEvent(new Event('change', { bubbles: true }));
            });

            if (passwordFields.length > 0) {
                console.log('✅ Password filled');
            }

            // Try to fill username if exists
            const usernameSelectors = [
                'input[name="username"]',
                'input[placeholder*="username" i]',
                'input[id*="username" i]'
            ];

            for (let selector of usernameSelectors) {
                const usernameField = document.querySelector(selector);
                if (usernameField) {
                    usernameField.value = 'user' + Math.random().toString(36).substring(2, 10);
                    usernameField.dispatchEvent(new Event('input', { bubbles: true }));
                    usernameField.dispatchEvent(new Event('change', { bubbles: true }));
                    console.log('✅ Username filled:', selector);
                    break;
                }
            }
        }

        async checkAndFillCode() {
            try {
                this.updateStatus('📬 Checking inbox for verification code...', 70);

                const messages = await this.mailTM.getMessages();

                if (messages.length === 0) {
                    this.updateStatus(`<strong>📭 No emails yet!</strong><br><br>Waiting for verification email...<br>Click this button again in a few seconds!`, 70);
                    return;
                }

                // Get the latest message
                const latestMessage = messages[0];
                const fullMessage = await this.mailTM.getMessage(latestMessage.id);

                this.updateStatus(`<strong>📧 Email Received!</strong><br><br>Subject: ${fullMessage.subject}<br><br>Looking for verification code...`, 80);

                // Extract verification code (common patterns)
                const text = fullMessage.text || fullMessage.html || '';
                const codePatterns = [
                    /code[:\s]+([A-Z0-9]{4,8})/i,
                    /verification[:\s]+([A-Z0-9]{4,8})/i,
                    /\b([A-Z0-9]{6})\b/,
                    /\b([0-9]{4,8})\b/,
                    /code[^a-z0-9]+([a-z0-9]{4,8})/i
                ];

                let code = null;
                for (let pattern of codePatterns) {
                    const match = text.match(pattern);
                    if (match) {
                        code = match[1];
                        break;
                    }
                }

                if (code) {
                    // Try to fill verification code field
                    const codeSelectors = [
                        'input[name*="code" i]',
                        'input[placeholder*="code" i]',
                        'input[placeholder*="verification" i]',
                        'input[id*="code" i]',
                        'input[type="text"]'
                    ];

                    let filled = false;
                    for (let selector of codeSelectors) {
                        const codeField = document.querySelector(selector);
                        if (codeField && codeField.offsetParent !== null) {
                            codeField.value = code;
                            codeField.dispatchEvent(new Event('input', { bubbles: true }));
                            codeField.dispatchEvent(new Event('change', { bubbles: true }));
                            filled = true;
                            console.log('✅ Code filled:', selector);
                            break;
                        }
                    }

                    if (filled) {
                        this.updateStatus(`<strong>🎉 CODE FILLED!</strong><br><br>Verification Code: ${code}<br><br>BOOM! You're all set bro! 💪🔥`, 100);
                    } else {
                        this.updateStatus(`<strong>✅ Code Found!</strong><br><br>${code}<br><br>Couldn't auto-fill (maybe wrong page?), but copy that code above! 👆`, 90);
                    }
                } else {
                    this.updateStatus(`<strong>📧 Email Content:</strong><br><br>${text.substring(0, 300)}...<br><br>Couldn't extract code automatically. Check the email above!`, 85);
                }

            } catch (error) {
                this.updateStatus(`<strong>❌ ERROR!</strong><br>${error.message}`, 0);
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
            this.updateStatus('<strong>🔄 Reset Complete!</strong><br>All data cleared. Ready for a fresh start! 💪', 0);
            document.querySelector('#fillCodeBtn').style.display = 'none';
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
