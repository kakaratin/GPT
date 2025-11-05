# Tdjs-Auto Mail Bot

A Telegram bot for creating temporary email addresses and automatically purchasing cloud phone devices (Vsphone & Vmos).

## Features

- 📧 **Temporary Email**: Create disposable email addresses using Mail.tm
- 📱 **Cloud Phone Devices**: Automatically purchase Vsphone devices
- 🖥️ **Vmos Support**: Also supports Vmos virtual mobile OS devices
- 🔄 **Auto Purchase**: One-click device purchase with your temporary email
- 📬 **Inbox Management**: View full message contents
- 🎯 **Service Selection**: Choose between Vsphone and Vmos

## Installation

1. Clone this repository:
```bash
git clone https://github.com/kakaratin/Bit.git
cd Bit
```

2. Install dependencies:
```bash
npm install node-telegram-bot-api axios
```

3. Update the bot token in `telegram-mailtm-bot.js` if needed

4. Run the bot:
```bash
node telegram-mailtm-bot.js
```

## Usage

### Commands

- `/start` - Start the bot and see welcome message
- `/create` - Create a new temporary email
- `/inbox` - Check your inbox and view messages
- `/device` - Purchase a cloud phone device (choose Vsphone or Vmos)
- `/delete` - Delete your current email account
- `/help` - Show help message

### Workflow

1. Send `/create` to generate a temporary email
2. Use the email for registrations or testing
3. Choose to automatically get a Vsphone or Vmos device
4. Check `/inbox` to view received messages
5. Use `/delete` when you're done

## API Integration

The bot integrates with:
- **Mail.tm API**: For temporary email services
- **Meows Cloud Phone API**: For purchasing cloud phone devices

### Supported Services

- **Vsphone** 📱 - Virtual phone service
- **Vmos** 🖥️ - Virtual mobile OS

Both services use the same API endpoint:
```bash
curl 'https://meows.io.vn/api/buy-cloud-phone' \
  -H 'Content-Type: application/json' \
  -H 'User-Agent: Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36' \
  -H 'Referer: https://meows.io.vn/buy-cloud-phone' \
  --data-raw '{"service":"Vsphone","accounts":[{"account":"email@example.com","password":"password"}]}'
```

## Response Format

The bot now returns English responses:

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

## Branding

This bot is branded as **Tdjs-Auto** - Your automated cloud phone manager.

## License

MIT License
