# 🔥 VmosCloud Auto Signup - Tampermonkey Script

YO! This is a SICK Tampermonkey script that automates the signup process for cloud.vmoscloud.com! 💪

## 🚀 What This Does

- ✅ Automatically creates a temporary email using mail.tm API
- ✅ Auto-fills the signup form with email, password, and username
- ✅ YOU solve the captcha manually (because we're not breaking ToS, bro!)
- ✅ Automatically monitors the temp email inbox
- ✅ Extracts and auto-fills the verification code
- ✅ Beautiful UI panel that guides you through the whole process!

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

## 🎮 How To Use

### Step 1: Visit the site
Go to https://cloud.vmoscloud.com/ (or wherever the signup page is)

### Step 2: You'll see a purple panel
A beautiful purple panel will appear in the top-right corner! 💜

### Step 3: Click "Start Auto Signup" 🚀
The script will:
- Create a temp email automatically
- Fill in all the form fields
- Show you the email it's using

### Step 4: Solve the Captcha 🤖
This is YOUR job bro! The script can't do this part (and shouldn't - gotta play fair!)

### Step 5: Submit the form
Click that submit button after solving the captcha!

### Step 6: Click "Check & Fill Code" 📧
The script will:
- Check the mail.tm inbox
- Find the verification email
- Extract the code
- Auto-fill it for you!

If the email hasn't arrived yet, just wait a few seconds and click the button again!

## 🎨 Features

### Beautiful UI Panel
- 🟣 Purple gradient design (because it looks FIRE!)
- 📊 Progress bar showing where you're at
- 📝 Status updates for every step
- 🎯 Clear buttons for each action

### Smart Form Filling
The script tries MULTIPLE selectors to find:
- Email fields
- Password fields
- Username fields
- Verification code fields

So it should work even if the site structure is a bit different!

### Mail.tm Integration
- Creates accounts automatically
- Saves your temp email for the session
- Monitors inbox in real-time
- Extracts verification codes using smart patterns

## 🔧 Buttons Explained

- **🚀 Start Auto Signup**: Kicks off the whole process
- **📧 Check & Fill Code**: Checks inbox and auto-fills verification code
- **✉️ Generate New Email**: Creates a fresh temp email (if you need a new one)
- **🔄 Reset Everything**: Clears all saved data and starts fresh
- **✖ Close**: Hides the panel (it'll come back on page refresh)

## 🛠️ Troubleshooting

### "Element not found" error?
The signup form might be structured differently. You can:
1. Check the browser console for details
2. Manually fill the fields
3. The script will still handle the verification code part!

### Email not receiving?
- Wait 10-30 seconds (mail.tm can be a bit slow)
- Click "Check & Fill Code" again
- Check if the email was filled correctly in the form

### Can't find the verification code?
The script shows you the email content! You can:
- Copy the code manually from the status box
- The script tries multiple patterns to find codes

## 🎯 Pro Tips

1. **Keep the panel open** - It shows you important info like your temp email!
2. **Don't rush** - Wait for each step to complete before moving on
3. **The email is saved** - Even if you refresh, your temp email is remembered
4. **Use "Reset Everything"** - If something goes wrong, this clears everything for a fresh start

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
