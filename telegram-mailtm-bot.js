const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const BOT_TOKEN = '7677458154:AAF2FZKXwUyGmAX_4CMdnqtWdbY6sDzA3-c';
const MAILTM_API = 'https://api.mail.tm';
const PASSWORD = 'TdjsCloudPhone0909';
const CLOUD_PHONE_API = 'https://meows.io.vn/api/buy-cloud-phone';

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// Store user sessions (email and token)
const userSessions = new Map();

// Random user agents
const userAgents = [
  'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36',
  'Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36',
  'Mozilla/5.0 (Linux; Android 12; Pixel 6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36',
  'Mozilla/5.0 (Linux; Android 13; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
  'Mozilla/5.0 (Linux; Android 14; SM-S926B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Mobile Safari/537.36'
];

function getRandomUserAgent() {
  return userAgents[Math.floor(Math.random() * userAgents.length)];
}

// Helper function to get available domains
async function getDomains() {
  try {
    const response = await axios.get(`${MAILTM_API}/domains`);
    return response.data['hydra:member'];
  } catch (error) {
    console.error('Error fetching domains:', error.message);
    return [];
  }
}

// Helper function to create account
async function createAccount(address) {
  try {
    const response = await axios.post(`${MAILTM_API}/accounts`, {
      address: address,
      password: PASSWORD
    });
    return response.data;
  } catch (error) {
    console.error('Error creating account:', error.response?.data || error.message);
    throw error;
  }
}

// Helper function to get auth token
async function getToken(address) {
  try {
    const response = await axios.post(`${MAILTM_API}/token`, {
      address: address,
      password: PASSWORD
    });
    return response.data.token;
  } catch (error) {
    console.error('Error getting token:', error.message);
    throw error;
  }
}

// Helper function to get messages with full content
async function getMessages(token) {
  try {
    const response = await axios.get(`${MAILTM_API}/messages`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data['hydra:member'];
  } catch (error) {
    console.error('Error fetching messages:', error.message);
    return [];
  }
}

// Helper function to get full message by ID
async function getMessage(token, messageId) {
  try {
    const response = await axios.get(`${MAILTM_API}/messages/${messageId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching message:', error.message);
    throw error;
  }
}

// Helper function to delete account
async function deleteAccount(token, accountId) {
  try {
    await axios.delete(`${MAILTM_API}/accounts/${accountId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return true;
  } catch (error) {
    console.error('Error deleting account:', error.message);
    return false;
  }
}

// Helper function to buy cloud phone
async function buyCloudPhone(email, password, service = 'Vsphone') {
  try {
    const response = await axios.post(
      CLOUD_PHONE_API,
      {
        service: service,
        accounts: [
          {
            account: email,
            password: password
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': getRandomUserAgent(),
          'Referer': 'https://meows.io.vn/buy-cloud-phone'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error buying cloud phone:', error.response?.data || error.message);
    throw error;
  }
}

// Helper function to format response message
function formatDeviceResponse(result, email, service) {
  let statusMessage = '✅ *Successfully Purchased Device!*';
  let emoji = '📱';
  
  // Handle both Vietnamese and English success messages
  if (result.message && (result.message.includes('ĐÃ MUA ĐƯỢC MÁY') || result.success)) {
    statusMessage = '✅ *Device Purchase Successful!*';
  }
  
  if (service === 'Vmos') {
    emoji = '🖥️';
  }
  
  return `
${emoji} *Tdjs-Auto Device Manager*

${statusMessage}

📧 *Email:* \`${email}\`
🔑 *Password:* \`${PASSWORD}\`
🎯 *Service:* ${service}
📊 *Queue Position:* ${result.queuePosition || 'N/A'}
${result.order_id ? `🆔 *Order ID:* ${result.order_id}` : ''}

Your device will be ready shortly! 🚀
  `;
}

// Start command
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const welcomeMessage = `
🚀 *Welcome to Tdjs-Auto Mail Bot!*

This bot provides temporary email addresses and cloud phone devices.

*Available Commands:*
/create - Create a new temporary email
/inbox - Check your inbox (shows full messages!)
/device - Get a cloud phone device (Vsphone or Vmos) 📱
/delete - Delete your current email
/help - Show this help message

Let's get started! Use /create to generate your temporary email.
  `;
  bot.sendMessage(chatId, welcomeMessage, { parse_mode: 'Markdown' });
});

// Help command
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  const helpMessage = `
📧 *Tdjs-Auto Mail Bot Help*

*Commands:*
/create - Generate a new temporary email address
/inbox - View all messages with full content
/device - Purchase a cloud phone device (Vsphone or Vmos)
/delete - Remove your current email account
/help - Show this help message

*How to use:*
1. Use /create to get a temporary email
2. Use that email for registrations or testing
3. Check /inbox to see received messages with full content
4. Use /device to automatically get a cloud phone (choose Vsphone or Vmos)

*Note:* Your email and messages are temporary and will be deleted when you use /delete or create a new email.
  `;
  bot.sendMessage(chatId, helpMessage, { parse_mode: 'Markdown' });
});

// Create email command
bot.onText(/\/create/, async (msg) => {
  const chatId = msg.chat.id;
  
  try {
    bot.sendMessage(chatId, '⏳ Creating your temporary email...');
    
    const domains = await getDomains();
    if (domains.length === 0) {
      bot.sendMessage(chatId, '❌ Failed to fetch available domains. Please try again later.');
      return;
    }
    
    const randomDomain = domains[Math.floor(Math.random() * domains.length)];
    const randomUsername = `user${Date.now()}${Math.floor(Math.random() * 1000)}`;
    const emailAddress = `${randomUsername}@${randomDomain.domain}`;
    
    const account = await createAccount(emailAddress);
    const token = await getToken(emailAddress);
    
    userSessions.set(chatId, {
      email: emailAddress,
      token: token,
      accountId: account.id
    });
    
    const keyboard = {
      inline_keyboard: [
        [
          { text: '📱 Get Vsphone Device', callback_data: 'get_device_vsphone' },
          { text: '🖥️ Get Vmos Device', callback_data: 'get_device_vmos' }
        ]
      ]
    };
    
    bot.sendMessage(chatId, `
✅ *Email Created Successfully!*

📧 *Your Email:* \`${emailAddress}\`
🔑 *Password:* \`${PASSWORD}\`

You can now use this email for registrations or testing.
Use /inbox to check for new messages.

Would you like to automatically get a cloud phone device?
    `, { parse_mode: 'Markdown', reply_markup: keyboard });
    
  } catch (error) {
    bot.sendMessage(chatId, '❌ Failed to create email. Please try again.');
  }
});

// Inbox command - shows full messages
bot.onText(/\/inbox/, async (msg) => {
  const chatId = msg.chat.id;
  
  const session = userSessions.get(chatId);
  if (!session) {
    bot.sendMessage(chatId, '❌ You don\'t have an active email. Use /create to generate one.');
    return;
  }
  
  try {
    bot.sendMessage(chatId, '⏳ Checking your inbox...');
    
    const messages = await getMessages(session.token);
    
    if (messages.length === 0) {
      bot.sendMessage(chatId, '📭 Your inbox is empty. No messages yet.');
      return;
    }
    
    bot.sendMessage(chatId, `📬 *Your Inbox* (${messages.length} message${messages.length > 1 ? 's' : ''})\n`, { parse_mode: 'Markdown' });
    
    // Fetch and display each message with full content
    for (let i = 0; i < messages.length; i++) {
      const msg = messages[i];
      try {
        const fullMessage = await getMessage(session.token, msg.id);
        const date = new Date(fullMessage.createdAt).toLocaleString();
        
        let messageText = `━━━━━━━━━━━━━━━━━━\n`;
        messageText += `📧 *Message ${i + 1}*\n\n`;
        messageText += `*From:* ${fullMessage.from.address}\n`;
        messageText += `*To:* ${fullMessage.to[0].address}\n`;
        messageText += `*Subject:* ${fullMessage.subject || '(No subject)'}\n`;
        messageText += `*Date:* ${date}\n\n`;
        messageText += `*Content:*\n${fullMessage.text || fullMessage.html || '(No content)'}`;
        messageText += `\n━━━━━━━━━━━━━━━━━━`;
        
        // Split message if too long
        if (messageText.length > 4096) {
          const chunks = messageText.match(/[\s\S]{1,4096}/g);
          for (const chunk of chunks) {
            await bot.sendMessage(chatId, chunk, { parse_mode: 'Markdown' });
          }
        } else {
          await bot.sendMessage(chatId, messageText, { parse_mode: 'Markdown' });
        }
        
        // Small delay to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error) {
        console.error(`Error fetching message ${msg.id}:`, error.message);
      }
    }
    
  } catch (error) {
    bot.sendMessage(chatId, '❌ Failed to fetch inbox. Please try again.');
  }
});

// Device command
bot.onText(/\/device/, async (msg) => {
  const chatId = msg.chat.id;
  
  const session = userSessions.get(chatId);
  if (!session) {
    bot.sendMessage(chatId, '❌ You need to create an email first. Use /create to generate one.');
    return;
  }
  
  // Show device selection
  const keyboard = {
    inline_keyboard: [
      [
        { text: '📱 Vsphone', callback_data: 'get_device_vsphone' },
        { text: '🖥️ Vmos', callback_data: 'get_device_vmos' }
      ]
    ]
  };
  
  bot.sendMessage(chatId, `
🎯 *Tdjs-Auto Device Manager*

Choose your cloud phone service:

📱 *Vsphone* - Virtual phone service
🖥️ *Vmos* - Virtual mobile OS

📧 *Email:* \`${session.email}\`
🔑 *Password:* \`${PASSWORD}\`
  `, { parse_mode: 'Markdown', reply_markup: keyboard });
});

// Handle callback queries (button presses)
bot.on('callback_query', async (callbackQuery) => {
  const chatId = callbackQuery.message.chat.id;
  const data = callbackQuery.data;
  
  if (data === 'get_device_vsphone' || data === 'get_device_vmos') {
    const session = userSessions.get(chatId);
    
    if (!session) {
      bot.answerCallbackQuery(callbackQuery.id, { text: '❌ Session expired. Please create a new email.' });
      return;
    }
    
    const service = data === 'get_device_vsphone' ? 'Vsphone' : 'Vmos';
    const emoji = service === 'Vsphone' ? '📱' : '🖥️';
    
    bot.answerCallbackQuery(callbackQuery.id, { text: `⏳ Getting your ${service} device...` });
    
    try {
      bot.sendMessage(chatId, `⏳ Requesting ${emoji} ${service} cloud phone device...`);
      
      const result = await buyCloudPhone(session.email, PASSWORD, service);
      
      // Format the response message with proper English translation
      const formattedMessage = formatDeviceResponse(result, session.email, service);
      bot.sendMessage(chatId, formattedMessage, { parse_mode: 'Markdown' });
      
      // Also show the raw response
      bot.sendMessage(chatId, `
📋 *Raw API Response:*
\`\`\`json
${JSON.stringify(result, null, 2)}
\`\`\`
      `, { parse_mode: 'Markdown' });
      
    } catch (error) {
      bot.sendMessage(chatId, `❌ Failed to get ${service} device.\n\nError: ${error.message}`);
    }
  }
});

// Delete email command
bot.onText(/\/delete/, async (msg) => {
  const chatId = msg.chat.id;
  
  const session = userSessions.get(chatId);
  if (!session) {
    bot.sendMessage(chatId, '❌ You don\'t have an active email to delete.');
    return;
  }
  
  try {
    bot.sendMessage(chatId, '⏳ Deleting your email account...');
    
    await deleteAccount(session.token, session.accountId);
    userSessions.delete(chatId);
    
    bot.sendMessage(chatId, '✅ Your email account has been deleted successfully!');
    
  } catch (error) {
    bot.sendMessage(chatId, '❌ Failed to delete account. Please try again.');
  }
});

console.log('🤖 Tdjs-Auto Bot is running...');
