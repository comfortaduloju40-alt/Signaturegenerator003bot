require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const { getSession, createSession, updateSession, clearSession } = require('./sessions');
const { generateSignature, STYLES, COLORS } = require('./signatureGenerator');

// Webhook mode — no polling
const bot = new TelegramBot(process.env.BOT_TOKEN, { webHook: true });

// Inline keyboard for style selection
function styleKeyboard() {
  return {
    inline_keyboard: [
      [
        { text: '🖋️ Classic', callback_data: 'style:classic' },
        { text: '💪 Bold',    callback_data: 'style:bold' }
      ],
      [
        { text: '✨ Minimal', callback_data: 'style:minimal' },
        { text: '💎 Elegant', callback_data: 'style:elegant' }
      ],
      [
        { text: '🚀 Modern', callback_data: 'style:modern' }
      ]
    ]
  };
}

// Inline keyboard for color selection
function colorKeyboard() {
  return {
    inline_keyboard: [
      [
        { text: '⬛ Black',      callback_data: 'color:black' },
        { text: '🔵 Navy Blue',  callback_data: 'color:navy' }
      ],
      [
        { text: '🟢 Dark Green', callback_data: 'color:green' },
        { text: '🔴 Burgundy',   callback_data: 'color:burgundy' }
      ],
      [
        { text: '🟣 Purple', callback_data: 'color:purple' }
      ]
    ]
  };
}

// ─── /start ────────────────────────────────────────────
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const name = msg.from.first_name || 'there';

  bot.sendMessage(
    chatId,
    `👋 Hello, ${name}!\n\n` +
    `I'm your *Signature Generator Bot*! ✍️\n\n` +
    `I create beautiful digital signatures in seconds!\n\n` +
    `*Styles available:*\n` +
    `🖋️ Classic — Italic serif with flourish\n` +
    `💪 Bold — Strong with double underline\n` +
    `✨ Minimal — Clean and simple\n` +
    `💎 Elegant — Decorative with ornaments\n` +
    `🚀 Modern — Slanted contemporary\n\n` +
    `*Colors available:*\n` +
    `⬛ Black  🔵 Navy  🟢 Green  🔴 Burgundy  🟣 Purple\n\n` +
    `*Commands:*\n` +
    `✍️ /create — Generate a signature\n` +
    `❓ /help — How to use this bot\n` +
    `❌ /cancel — Cancel current session\n\n` +
    `Type /create to get started!`,
    { parse_mode: 'Markdown' }
  );
});

// ─── /help ─────────────────────────────────────────────
bot.onText(/\/help/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    `❓ *How to Use Signature Generator Bot*\n\n` +
    `1. Type /create to begin\n` +
    `2. Type your name\n` +
    `3. Tap a style button\n` +
    `4. Tap a color button\n` +
    `5. Get your signature image!\n\n` +
    `*Styles explained:*\n` +
    `🖋️ Classic — Italic serif, curved underline\n` +
    `💪 Bold — Bold sans-serif, double underline\n` +
    `✨ Minimal — Light italic, thin underline\n` +
    `💎 Elegant — Italic with swirl ornaments\n` +
    `🚀 Modern — Slanted bold italic\n\n` +
    `💡 _Tip: Run /create again to try a different style or color!_`,
    { parse_mode: 'Markdown' }
  );
});

// ─── /create ───────────────────────────────────────────
bot.onText(/\/create/, (msg) => {
  const chatId = msg.chat.id;
  createSession(chatId);

  bot.sendMessage(
    chatId,
    `✍️ *Let\'s create your signature!*\n\n` +
    `Type /cancel at any time to stop.\n\n` +
    `👤 *What name should appear on the signature?*\n` +
    `_(Type your full name or nickname)_`,
    { parse_mode: 'Markdown' }
  );
});

// ─── /cancel ───────────────────────────────────────────
bot.onText(/\/cancel/, (msg) => {
  const chatId = msg.chat.id;
  clearSession(chatId);
  bot.sendMessage(chatId, '❌ Session cancelled.\n\nType /create to start again!');
});

// ─── Handle text messages ──────────────────────────────
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (!text || text.startsWith('/')) return;

  const session = getSession(chatId);

  if (!session) {
    bot.sendMessage(chatId, '👋 Type /create to generate your signature!');
    return;
  }

  // Name step — only text input needed
  if (session.step === 'name') {
    const name = text.trim();

    if (!name || name.length < 2) {
      bot.sendMessage(chatId, '⚠️ Please enter a valid name (at least 2 characters).');
      return;
    }

    if (name.length > 30) {
      bot.sendMessage(chatId, '⚠️ Name is too long. Please keep it under 30 characters.');
      return;
    }

    updateSession(chatId, 'style', { name });

    bot.sendMessage(
      chatId,
      `✅ Got it! *"${name}"*\n\n🎨 Now choose a *signature style*:`,
      {
        parse_mode: 'Markdown',
        reply_markup: styleKeyboard()
      }
    );
    return;
  }

  // Waiting for style button
  if (session.step === 'style') {
    bot.sendMessage(
      chatId,
      '👆 Please tap one of the style buttons above!',
      { reply_markup: styleKeyboard() }
    );
    return;
  }

  // Waiting for color button
  if (session.step === 'color') {
    bot.sendMessage(
      chatId,
      '👆 Please tap one of the color buttons above!',
      { reply_markup: colorKeyboard() }
    );
    return;
  }
});

// ─── Handle inline button taps ─────────────────────────
bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;

  await bot.answerCallbackQuery(query.id);

  const session = getSession(chatId);

  if (!session) {
    bot.sendMessage(chatId, '⚠️ Session expired. Type /create to start again!');
    return;
  }

  // ── Style selected ────────────────────────────────────
  if (data.startsWith('style:') && session.step === 'style') {
    const style = data.split(':')[1];
    if (!STYLES[style]) return;

    updateSession(chatId, 'color', { style });

    bot.sendMessage(
      chatId,
      `✅ Style: *${STYLES[style].label}*\n\n🖌️ Now choose a *color*:`,
      {
        parse_mode: 'Markdown',
        reply_markup: colorKeyboard()
      }
    );
    return;
  }

  // ── Color selected → generate signature ───────────────
  if (data.startsWith('color:') && session.step === 'color') {
    const colorKey = data.split(':')[1];
    if (!COLORS[colorKey]) return;

    updateSession(chatId, 'done', { color: colorKey });

    const finalData = getSession(chatId).data;

    await bot.sendMessage(chatId, '⏳ Generating your signature...');

    try {
      const imageBuffer = generateSignature(
        finalData.name,
        finalData.style,
        finalData.color
      );

      await bot.sendPhoto(chatId, imageBuffer, {
        caption:
          `✍️ *Your Signature is Ready!*\n\n` +
          `📛 Name  : ${finalData.name}\n` +
          `🎨 Style : ${STYLES[finalData.style].label}\n` +
          `🖌️ Color : ${COLORS[finalData.color].label}`,
        parse_mode: 'Markdown'
      });

      clearSession(chatId);

      await bot.sendMessage(
        chatId,
        '✅ Done! Save and use your signature anywhere!\n\nType /create to generate another one.'
      );

    } catch (err) {
      console.error('Signature generation error:', err.message);
      bot.sendMessage(
        chatId,
        '❌ Something went wrong. Please try /create again.'
      );
      clearSession(chatId);
    }
    return;
  }
});

module.exports = { bot };
