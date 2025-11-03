# ?? TdjsBuytool - Cloud Phone Purchase Automation

A modern, powerful web application to automate cloud phone purchases. Built with Next.js, TypeScript, and Tailwind CSS featuring an ultra-modern dark UI.

![TdjsBuytool Banner](https://img.shields.io/badge/TdjsBuytool-Cloud%20Phone%20Automation-blue?style=for-the-badge)

---

## ? Features

- ?? **Ultra-Modern Dark UI** - Stunning dark theme with neon gradients and glass morphism effects
- ? **Quick Import** - Paste accounts in `email|password` format for instant parsing
- ?? **Multi-Account Support** - Purchase cloud phones for multiple accounts at once
- ?? **Two Services** - Support for both Vsphone and Vmos services
- ?? **How It Works Tab** - Educational section explaining the automation process
- ?? **Social Integration** - Direct Facebook link for community support
- ?? **Bulk Processing** - Handle multiple accounts simultaneously with ease
- ?? **Vercel Ready** - One-click deployment to Vercel

---

## ?? Prerequisites

Before using TdjsBuytool, you **MUST** create accounts on the service you want to use:

### For Vsphone:
1. Visit the Vsphone service website
2. Create a new account with your email/username and password
3. Keep your credentials ready

### For Vmos:
1. Visit the Vmos service website
2. Create a new account with your email/username and password
3. Keep your credentials ready

**?? Important:** This tool automates the purchase process for existing accounts. You cannot purchase cloud phones without first creating an account on the respective service.

---

## ?? Quick Start

### Deploy to Vercel (Recommended)

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Deploy to Vercel:**
   ```bash
   vercel --prod
   ```

3. **Your app is live!** Share the URL with your users.

### Run Locally

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```

3. **Open in Browser**
   - Navigate to `http://localhost:3000`

---

## ?? How to Use

### Method 1: Quick Import (Recommended) ??

This is the easiest and fastest way to add multiple accounts!

1. **Copy your accounts** in this format (one per line):
   ```
   email1@example.com|password123
   email2@example.com|password456
   email3@example.com|password789
   ```

2. **Paste into the "Quick Import" box** on the left side

3. **Click "Parse Accounts"** - All accounts will be automatically split and loaded into the form!

4. **Select your service** (Vsphone or Vmos)

5. **Click "Purchase Cloud Phone"** and wait for confirmation

### Method 2: Manual Entry

1. **Select Your Service**
   - Choose between **Vsphone** or **Vmos**

2. **Enter Account Credentials**
   - Enter email/username and password manually
   - Click "Add Another Account" for multiple accounts

3. **Purchase**
   - Click "Purchase Cloud Phone" button
   - Wait for success confirmation

### Example Usage

**Quick Import Format:**
```
byvikete@forexzig.com|0909pp09
another@example.com|password123
user3@example.com|mypass789
```

**Manual Entry:**
- Service: `Vsphone` or `Vmos`
- Account: `your-email@example.com`
- Password: `your-password`

---

## ?? New Features Explained

### Quick Import Feature
The quick import feature allows you to paste multiple accounts at once using the format `email|password`. Simply:
1. Copy your account list
2. Paste into the Quick Import textarea
3. Click "Parse Accounts"
4. All accounts are instantly loaded!

### How It Works Tab
Learn about the automation technology behind TdjsBuytool:
- Advanced authentication system
- Intelligent request processing
- Seamless service integration
- Real-time status updates

This educational section helps users understand the power of the automation without technical jargon.

---

## ??? Technology Stack

- **Framework:** Next.js 14
- **Language:** TypeScript
- **Styling:** Tailwind CSS (Dark Theme with Neon Accents)
- **API:** Next.js API Routes
- **Deployment:** Vercel

---

## ?? Project Structure

```
tdjs-buytool/
??? pages/
?   ??? api/
?   ?   ??? buy-cloud-phone.ts    # API endpoint for purchases
?   ??? _app.tsx                   # App wrapper
?   ??? index.tsx                  # Main page with tabs
??? styles/
?   ??? globals.css                # Global styles with dark theme
??? public/                        # Static assets
??? package.json                   # Dependencies
??? tsconfig.json                  # TypeScript config
??? tailwind.config.js             # Tailwind config
??? next.config.js                 # Next.js config
??? vercel.json                    # Vercel deployment config
??? README.md                      # This file
```

---

## ?? Design Features

- **Dark Theme** - Easy on the eyes with a professional look
- **Neon Gradients** - Cyan, blue, purple, and pink accents
- **Glass Morphism** - Modern frosted glass effects
- **Smooth Animations** - Hover effects and transitions
- **Responsive Design** - Works perfectly on all devices
- **Tab Navigation** - Easy switching between Purchase and How It Works

---

## ?? Security Notes

- Never commit your actual account credentials to the repository
- The application doesn't store any credentials - they're only used for the API call
- All requests are made server-side through the Next.js API route
- Credentials are transmitted securely via HTTPS when deployed
- The quick import feature processes data client-side only

---

## ?? Current Deployment

**Live URL:** https://workspace-q9i8cye0a-josh2238s-projects.vercel.app

**Vercel Dashboard:** https://vercel.com/josh2238s-projects/workspace

---

## ?? Troubleshooting

### Quick Import Not Working
- Make sure you're using the format: `email|password`
- One account per line
- No extra spaces or special characters

### Build Fails on Vercel
- Make sure all dependencies are in `package.json`
- Check that TypeScript has no errors: `npm run build` locally

### API Returns Error
- Verify your account credentials are correct
- Make sure you created an account on the service (Vsphone/Vmos)
- Check internet connectivity

### Styling Issues
- Clear your browser cache
- Try a different browser
- Make sure JavaScript is enabled

---

## ?? API Reference

### POST `/api/buy-cloud-phone`

**Request Body:**
```json
{
  "service": "Vsphone" | "Vmos",
  "accounts": [
    {
      "account": "email@example.com",
      "password": "password123"
    }
  ]
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Cloud phone purchased successfully!",
  "data": { ... }
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Error description"
}
```

---

## ?? Social Media

Connect with us on Facebook: [TdjsBuytool Community](https://www.facebook.com/share/16TXgXRaBb/)

Get support, share tips, and stay updated with the latest features!

---

## ?? Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## ?? License

This project is open source and available under the MIT License.

---

## ?? Support

If you encounter any issues or have questions:
1. Check the Troubleshooting section above
2. Make sure you've created accounts on Vsphone/Vmos before using the tool
3. Verify your credentials are correct
4. Visit our Facebook page for community support

---

## ?? Credits

Built with ?? using Next.js, TypeScript, and Tailwind CSS.

**Enjoy automating your cloud phone purchases with TdjsBuytool!** ??

---

## ?? Quick Links

- **Live Site:** https://workspace-q9i8cye0a-josh2238s-projects.vercel.app
- **Facebook:** https://www.facebook.com/share/16TXgXRaBb/
- **Vercel Dashboard:** https://vercel.com/josh2238s-projects/workspace
