# ?? TdjsBuytool - Cloud Phone Purchase Automation

A modern, beautiful web application to automate cloud phone purchases from meows.io.vn. Built with Next.js, TypeScript, and Tailwind CSS.

![TdjsBuytool Banner](https://img.shields.io/badge/TdjsBuytool-Cloud%20Phone%20Automation-blue?style=for-the-badge)

---

## ? Features

- ?? **Modern UI** - Beautiful, responsive design with gradient backgrounds
- ?? **Multi-Account Support** - Purchase cloud phones for multiple accounts at once
- ?? **Two Services** - Support for both Vsphone and Vmos services
- ? **Fast & Efficient** - Serverless API routes for optimal performance
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

### Option 1: Deploy to Vercel (Recommended)

The easiest way to get started is to deploy directly to Vercel:

1. **Fork or Clone this repository**
   ```bash
   git clone <your-repo-url>
   cd tdjs-buytool
   ```

2. **Push to your GitHub repository**
   ```bash
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

3. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will automatically detect Next.js and configure everything
   - Click "Deploy"
   - Your app will be live in minutes! ??

### Option 2: Run Locally

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
   - You should see the TdjsBuytool interface

4. **Build for Production** (Optional)
   ```bash
   npm run build
   npm start
   ```

---

## ?? How to Use

### Step 1: Access the Application
- If deployed on Vercel: Visit your Vercel deployment URL
- If running locally: Navigate to `http://localhost:3000`

### Step 2: Select Your Service
- Choose between **Vsphone** or **Vmos** by clicking the appropriate button

### Step 3: Enter Account Credentials
- Enter your account email/username
- Enter your account password
- Click "Add Another Account" if you want to purchase for multiple accounts

### Step 4: Purchase
- Click "Purchase Cloud Phone" button
- Wait for the process to complete
- You'll see a success or error message

### Example Usage

**For Vsphone:**
- Service: `Vsphone`
- Account: `your-email@example.com`
- Password: `your-password`

**For Vmos:**
- Service: `Vmos`
- Account: `your-email@example.com`
- Password: `your-password`

---

## ??? Technology Stack

- **Framework:** Next.js 14
- **Language:** TypeScript
- **Styling:** Tailwind CSS
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
?   ??? index.tsx                  # Main page
??? styles/
?   ??? globals.css                # Global styles
??? public/                        # Static assets
??? package.json                   # Dependencies
??? tsconfig.json                  # TypeScript config
??? tailwind.config.js             # Tailwind config
??? next.config.js                 # Next.js config
??? vercel.json                    # Vercel deployment config
??? README.md                      # This file
```

---

## ?? Security Notes

- Never commit your actual account credentials to the repository
- The application doesn't store any credentials - they're only used for the API call
- All requests are made server-side through the Next.js API route
- Credentials are transmitted securely via HTTPS when deployed

---

## ?? Deployment Guide (Detailed)

### Deploy to Vercel

1. **Create a Vercel Account**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub, GitLab, or Bitbucket

2. **Import Your Project**
   - Click "Add New..." ? "Project"
   - Select your repository
   - Vercel will automatically detect Next.js

3. **Configure (Optional)**
   - The default settings work perfectly
   - No environment variables needed
   - Just click "Deploy"

4. **Access Your App**
   - Once deployed, you'll get a URL like `https://your-app.vercel.app`
   - Share this URL with anyone who needs to use the tool

### Custom Domain (Optional)

1. In Vercel dashboard, go to your project
2. Click "Settings" ? "Domains"
3. Add your custom domain
4. Follow the DNS configuration instructions

---

## ?? Troubleshooting

### Build Fails on Vercel
- Make sure all dependencies are in `package.json`
- Check that TypeScript has no errors: `npm run build` locally

### API Returns Error
- Verify your account credentials are correct
- Make sure you created an account on the service (Vsphone/Vmos)
- Check that meows.io.vn is accessible

### Styling Issues
- Clear your browser cache
- Make sure Tailwind CSS is properly configured
- Run `npm install` to ensure all dependencies are installed

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

---

## ?? Credits

Built with ?? using Next.js, TypeScript, and Tailwind CSS.

**Enjoy automating your cloud phone purchases with TdjsBuytool!** ??