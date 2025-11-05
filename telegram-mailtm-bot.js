const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

// ============================================
// CONFIGURATION
// ============================================
const CONFIG = {
  BOT_TOKEN: '7677458154:AAF2FZKXwUyGmAX_4CMdnqtWdbY6sDzA3-c',
  MAILTM_API: 'https://api.mail.tm',
  PASSWORD: 'TdjsCloudPhone0909',
  CLOUD_PHONE_API: 'https://meows.io.vn/api/buy-cloud-phone',
  SESSIONS_FILE: path.join(__dirname, 'sessions.json'),
  MESSAGE_MAX_LENGTH: 4096,
  MESSAGE_DELAY: 500
};

const bot = new TelegramBot(CONFIG.BOT_TOKEN, { polling: true });
const userSessions = new Map();

// ============================================
// USER AGENT POOL
// ============================================
const USER_AGENTS = [
  'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36',
  'Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36',
  'Mozilla/5.0 (Linux; Android 12; Pixel 6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36',
  'Mozilla/5.0 (Linux; Android 13; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
  'Mozilla/5.0 (Linux; Android 14; SM-S926B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Mobile Safari/537.36'
];

function getRandomUserAgent() {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}

// ============================================
// SESSION MANAGEMENT (JSON FILE STORAGE)
// ============================================
async function loadSessions() {
  try {
    const data = await fs.readFile(CONFIG.SESSIONS_FILE, 'utf8');
    const sessions = JSON.parse(data);
    Object.entries(sessions).forEach(([chatId, session]) => {
      userSessions.set(parseInt(chatId), session);
    });
    console.log(`✅ Loaded ${userSessions.size} sessions from file`);
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log('📝 No existing sessions file found, starting fresh');
    } else {
      console.error('⚠️  Error loading sessions:', error.message);
    }
  }
}

async function saveSessions() {
  try {
    const sessionsObj = {};
    userSessions.forEach((session, chatId) => {
      sessionsObj[chatId] = session;
    });
    await fs.writeFile(CONFIG.SESSIONS_FILE, JSON.stringify(sessionsObj, null, 2), 'utf8');
  } catch (error) {
    console.error('⚠️  Error saving sessions:', error.message);
  }
}

// ============================================
// MAIL.TM API FUNCTIONS
// ============================================
async function getDomains() {
  try {
    const response = await axios.get(`${CONFIG.MAILTM_API}/domains`);
    return response.data['hydra:member'];
  } catch (error) {
    console.error('❌ Error fetching domains:', error.message);
    return [];
  }
}

async function createAccount(address) {
  try {
    const response = await axios.post(`${CONFIG.MAILTM_API}/accounts`, {
      address,
      password: CONFIG.PASSWORD
    });
    return response.data;
  } catch (error) {
    console.error('❌ Error creating account:', error.response?.data || error.message);
    throw error;
  }
}

async function getToken(address) {
  try {
    const response = await axios.post(`${CONFIG.MAILTM_API}/token`, {
      address,
      password: CONFIG.PASSWORD
    });
    return response.data.token;
  } catch (error) {
    console.error('❌ Error getting token:', error.message);
    throw error;
  }
}

async function getMessages(token) {
  try {
    const response = await axios.get(`${CONFIG.MAILTM_API}/messages`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data['hydra:member'];
  } catch (error) {
    console.error('❌ Error fetching messages:', error.message);
    return [];
  }
}

async function getMessage(token, messageId) {
  try {
    const response = await axios.get(`${CONFIG.MAILTM_API}/messages/${messageId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching message:', error.message);
    throw error;
  }
}

async function deleteAccount(token, accountId) {
  try {
    await axios.delete(`${CONFIG.MAILTM_API}/accounts/${accountId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return true;
  } catch (error) {
    console.error('❌ Error deleting account:', error.message);
    return false;
  }
}

// ============================================
// CLOUD PHONE API FUNCTIONS
// ============================================
async function buyCloudPhone(email, password, service = 'Vsphone') {
  try {
    const response = await axios.post(
      CONFIG.CLOUD_PHONE_API,
      {
        service,
        accounts: [{ account: email, password }]
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
    console.error('❌ Error buying cloud phone:', error.response?.data || error.message);
    throw error;
  }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
function formatDeviceResponse(result, email, service) {
  const emoji = service === 'Vmos' ? '🖥️' : '📱';
  const statusMessage = (result.message && (result.message.includes('ĐÃ MUA ĐƯỢC MÁY') || result.success))
    ? '✅ *Device Purchase Successful!*'
    : '✅ *Successfully Purchased Device!*';
  
  return `
${emoji} *Tdjs-Auto Device Manager*

${statusMessage}

📧 *Email:* \`${email}\`
🔑 *Password:* \`${CONFIG.PASSWORD}\`
🎯 *Service:* ${service}
📊 *Queue Position:* ${result.queuePosition || 'N/A'}
${result.order_id ? `🆔 *Order ID:* ${result.order_id}` : ''}

Your device will be ready shortly! 🚀
  `;
}

async function sendLongMessage(chatId, text, options = {}) {
  if (text.length > CONFIG.MESSAGE_MAX_LENGTH) {
    const chunks = text.match(new RegExp(`[\\s\\S]{1,${CONFIG.MESSAGE_MAX_LENGTH}}`, 'g'));
    for (const chunk of chunks) {
      await bot.sendMessage(chatId, chunk, options);
      await new Promise(resolve => setTimeout(resolve, CONFIG.MESSAGE_DELAY));
    }
  } else {
    await bot.sendMessage(chatId, text, options);
  }
}

function getDeviceKeyboard() {
  return {
    inline_keyboard: [
      [
        { text: '📱 Get Vsphone Device', callback_data: 'get_device_vsphone' },
        { text: '🖥️ Get Vmos Device', callback_data: 'get_device_vmos' }
      ]
    ]
  };
}

// ============================================
// BOT COMMAND HANDLERS
// ============================================
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
      token,
      accountId: account.id,
      createdAt: new Date().toISOString()
    });
    
    await saveSessions();
    
    bot.sendMessage(chatId, `
✅ *Email Created Successfully!*

📧 *Your Email:* \`${emailAddress}\`
🔑 *Password:* \`${CONFIG.PASSWORD}\`

You can now use this email for registrations or testing.
Use /inbox to check for new messages.

Would you like to automatically get a cloud phone device?
    `, { parse_mode: 'Markdown', reply_markup: getDeviceKeyboard() });
    
  } catch (error) {
    bot.sendMessage(chatId, '❌ Failed to create email. Please try again.');
  }
});

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
    
    for (let i = 0; i < messages.length; i++) {
      try {
        const fullMessage = await getMessage(session.token, messages[i].id);
        const date = new Date(fullMessage.createdAt).toLocaleString();
        
        const messageText = `━━━━━━━━━━━━━━━━━━\n` +
          `📧 *Message ${i + 1}*\n\n` +
          `*From:* ${fullMessage.from.address}\n` +
          `*To:* ${fullMessage.to[0].address}\n` +
          `*Subject:* ${fullMessage.subject || '(No subject)'}\n` +
          `*Date:* ${date}\n\n` +
          `*Content:*\n${fullMessage.text || fullMessage.html || '(No content)'}` +
          `\n━━━━━━━━━━━━━━━━━━`;
        
        await sendLongMessage(chatId, messageText, { parse_mode: 'Markdown' });
        await new Promise(resolve => setTimeout(resolve, CONFIG.MESSAGE_DELAY));
        
      } catch (error) {
        console.error(`❌ Error fetching message ${messages[i].id}:`, error.message);
      }
    }
    
  } catch (error) {
    bot.sendMessage(chatId, '❌ Failed to fetch inbox. Please try again.');
  }
});

bot.onText(/\/device/, async (msg) => {
  const chatId = msg.chat.id;
  const session = userSessions.get(chatId);
  
  if (!session) {
    bot.sendMessage(chatId, '❌ You need to create an email first. Use /create to generate one.');
    return;
  }
  
  bot.sendMessage(chatId, `
🎯 *Tdjs-Auto Device Manager*

Choose your cloud phone service:

📱 *Vsphone* - Virtual phone service
🖥️ *Vmos* - Virtual mobile OS

📧 *Email:* \`${session.email}\`
🔑 *Password:* \`${CONFIG.PASSWORD}\`
  `, { parse_mode: 'Markdown', reply_markup: getDeviceKeyboard() });
});

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
    await saveSessions();
    
    bot.sendMessage(chatId, '✅ Your email account has been deleted successfully!');
    
  } catch (error) {
    bot.sendMessage(chatId, '❌ Failed to delete account. Please try again.');
  }
});

// ============================================
// CALLBACK QUERY HANDLER
// ============================================
bot.on('callback_query', async (callbackQuery) => {
  const chatId = callbackQuery.message.chat.id;
  const { data } = callbackQuery;
  
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
      
      const result = await buyCloudPhone(session.email, CONFIG.PASSWORD, service);
      
      const formattedMessage = formatDeviceResponse(result, session.email, service);
      await bot.sendMessage(chatId, formattedMessage, { parse_mode: 'Markdown' });
      
      await bot.sendMessage(chatId, `
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

// ============================================
// STARTUP
// ============================================
(async () => {
  console.log('🚀 Starting Tdjs-Auto Bot...');
  await loadSessions();
  console.log('✅ Bot is ready and running!');
})();
