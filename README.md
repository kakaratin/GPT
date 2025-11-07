# 🔥 VmosCloud Auto Signup - Tampermonkey Script

YO! This is a SICK Tampermonkey script that automates the signup process for cloud.vmoscloud.com! 💪

## 🚀 What This Does

- ✅ Automatically creates a temporary email using mail.tm API
- ✅ Auto-fills the email field in the login/signup box
- ✅ YOU solve the captcha manually (we play fair bro! 😎)
- ✅ Automatically monitors the temp email inbox
- ✅ Extracts and auto-fills the verification code
- ✅ Beautiful minimizable UI panel that guides you through the whole process!
- ✅ Works with the combined login/signup flow (just email → code → done!)

## 📦 Installation

### 1. Install Tampermonkey
First, you need Tampermonkey browser extension:
- **Chrome/Edge**: [Install from Chrome Web Store](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
- **Firefox**: [Install from Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)

### 2. Install The Script
1. Click on the Tampermonkey icon in your browser
2. Click "Create a new script"
3. Delete everything in the editor
4. Copy the ENTIRE contents of `vmoscloud-auto-signup.user.js`
5. Paste it into the Tampermonkey editor
6. Hit Ctrl+S (or Cmd+S on Mac) to save
7. BOOM! You're ready! 🎉

## 🎮 How To Use (SUPER SIMPLE!)

### Step 1: Visit the site 🌐
Go to https://cloud.vmoscloud.com/

### Step 2: You'll see a purple panel! 💜
A beautiful purple panel appears in the top-right corner!
- Click the **−** button to minimize it (or click the header!)
- Click the **+** button to expand it again!

### Step 3: Click "📧 Fill Email (Step 1)" 
The script will:
- Create a temp email automatically
- Fill it in the email/login box
- Show you the email it's using at the top!

### Step 4: Solve the Captcha 🤖
This is YOUR job bro! Just solve that captcha (the script waits for you!)

### Step 5: Submit the form ✅
Click that submit button after solving the captcha!

### Step 6: Click "🔍 Check & Fill Code (Step 2)" 📧
The script will:
- Check the mail.tm inbox
- Find the verification email
- Extract the code
- Auto-fill it for you!

**If the email hasn't arrived yet:** Just wait 5-10 seconds and click the button again! The site takes a moment to send it.

## 🎨 Features

### Beautiful Minimizable UI Panel
- 🟣 Purple gradient design (because it looks FIRE!)
- **📊 Progress bar** showing where you're at
- **−/+** Minimize/maximize button (keep it out of the way!)
- **📧 Email display** at the top (always see your temp email!)
- 📝 Status updates for every step
- 🎯 Clear buttons for each action

### Smart Form Filling
The script tries MULTIPLE selectors and methods to find:
- Email/login fields (tries 7+ different patterns!)
- Verification code fields (tries 9+ different patterns!)
- Triggers ALL possible events to make sure frameworks detect the input

So it works even if the site changes!

### Mail.tm Integration
- Creates accounts automatically (free temp emails!)
- Saves your temp email for the session
- Monitors inbox in real-time
- Extracts verification codes using 8+ smart patterns
- Shows you the email content if it can't find the code

## 🔧 Buttons Explained

- **📧 Fill Email (Step 1)**: Creates temp email & fills it in the form
- **🔍 Check & Fill Code (Step 2)**: Checks inbox and auto-fills verification code
- **✉️ New Email**: Creates a fresh temp email (if you need a different one)
- **🔄 Reset**: Clears all saved data and starts fresh
- **−/+**: Minimize/maximize the panel (stay out of your way!)

## 🛠️ Troubleshooting

### Can't fill the email field?
- The script shows you the email in the panel - copy it manually!
- Make sure you're on the right page (the login/signup box should be visible)
- Try clicking "Fill Email" again after the page loads completely

### Email not arriving?
- Wait 10-30 seconds (mail.tm can be a bit slow sometimes)
- Click "Check & Fill Code" button again after waiting
- The script will tell you when it finds the email!

### Can't find the verification code?
The script shows you the email content if it can't extract the code! You can:
- Copy the code manually from the status box
- The script tries 8+ different patterns to find codes
- Check your browser console (F12) for more details

### Panel blocking the view?
- Click the **−** button to minimize it!
- Click the header or **+** button to bring it back
- You can minimize it during captcha solving!

## 🎯 Pro Tips

1. **Minimize the panel** - Click the − button to get it out of your way!
2. **The email is saved** - Even if you refresh, your temp email is remembered
3. **Wait for the email** - VmosCloud takes 5-30 seconds to send the code
4. **Use "Reset"** - If something goes wrong, reset and start fresh!
5. **Check the console** - Press F12 to see detailed logs of what the script is doing

## ⚠️ Important Notes

- This script is for **EDUCATIONAL PURPOSES** - use responsibly!
- Always respect the website's Terms of Service
- The script requires mail.tm API to be working (if it's down, this won't work)
- Captcha must be solved manually (as it should be!)

## 🔥 Updates & Customization

Want to customize it? The code is clean and commented! You can:
- Adjust the UI position/styling
- Add more form field selectors
- Modify the verification code patterns
- Change the temp email generation logic

## 💪 Credits

Built with passion by your friendly neighborhood coder! 😎

If you have issues or improvements, let me know bro!

---

### 🎉 ENJOY YOUR AUTO SIGNUP TOOL!

GO GET 'EM TIGER! 🚀🔥💪
