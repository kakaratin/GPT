# Tdjs-Auto Bot Usage Guide

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run the Bot**
   ```bash
   npm start
   ```

3. **Open Telegram** and search for your bot

## Features Overview

### 🚀 Automated Device Purchase

The bot automatically purchases cloud phone devices using your temporary email:

**Supported Services:**
- 📱 **Vsphone** - Virtual phone service
- 🖥️ **Vmos** - Virtual mobile OS

Both services use the same API but provide different device types.

### 📧 Temporary Email Creation

- Creates disposable email addresses from Mail.tm
- Random usernames and domains
- Built-in password: `TdjsCloudPhone0909`

### 🎯 Device Purchase Flow

1. Create a temporary email with `/create`
2. Click the button to choose **Vsphone** or **Vmos**
3. Bot automatically purchases the device
4. Receive formatted response with:
   - Email and password
   - Service name
   - Queue position
   - Order ID (if available)

### 📬 Inbox Management

- View all received messages
- Full message content including HTML
- Auto-formatted for easy reading
- Message splitting for long emails

## API Details

### Cloud Phone Purchase API

**Endpoint:** `https://meows.io.vn/api/buy-cloud-phone`

**Request Format:**
```json
{
  "service": "Vsphone",  // or "Vmos"
  "accounts": [
    {
      "account": "email@example.com",
      "password": "your_password"
    }
  ]
}
```

**Response Format:**
```json
{
  "success": true,
  "message": "SUCCESSFULLY PURCHASED DEVICE!!!",
  "amount_id": null,
  "order_id": null,
  "service": "Vsphone",
  "queuePosition": 1
}
```

### Headers Required

- `Content-Type: application/json`
- `User-Agent: Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36...`
- `Referer: https://meows.io.vn/buy-cloud-phone`

## Command Reference

| Command | Description |
|---------|-------------|
| `/start` | Welcome message and overview |
| `/create` | Generate temporary email + device options |
| `/inbox` | View all messages in your inbox |
| `/device` | Choose between Vsphone/Vmos devices |
| `/delete` | Delete your current email account |
| `/help` | Show help information |

## Example Workflow

```
User: /create
Bot: ✅ Email Created Successfully!
     📧 Your Email: user1730809234567@example.com
     🔑 Password: TdjsCloudPhone0909
     
     [📱 Get Vsphone Device] [🖥️ Get Vmos Device]

User: [Clicks "📱 Get Vsphone Device"]
Bot: ⏳ Requesting 📱 Vsphone cloud phone device...
     
     📱 Tdjs-Auto Device Manager
     ✅ Device Purchase Successful!
     
     📧 Email: user1730809234567@example.com
     🔑 Password: TdjsCloudPhone0909
     🎯 Service: Vsphone
     📊 Queue Position: 1
     
     Your device will be ready shortly! 🚀
```

## Troubleshooting

### Bot Not Responding
- Check if bot token is valid
- Ensure dependencies are installed
- Check internet connection

### Email Creation Failed
- Mail.tm API might be down
- Try again in a few moments

### Device Purchase Failed
- Email might already be used
- API endpoint might be rate-limited
- Try creating a new email and purchase again

## Security Notes

⚠️ **Important:**
- Never share your bot token publicly
- Temporary emails are public and not secure
- Use only for testing and non-sensitive purposes
- Delete accounts when done to maintain privacy

## Support

For issues or questions, please visit the GitHub repository.

---

**Powered by Tdjs-Auto** 🚀
