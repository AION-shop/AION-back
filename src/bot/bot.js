const TelegramBot = require("node-telegram-bot-api");
const dotenv = require("dotenv");
const User = require("./models/User");

dotenv.config();

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

bot.onText(/\/start/, async (msg) => {
  const chatId = String(msg.chat.id);
  const from = msg.from || {};
  const username = from.username ? `@${from.username}` : null;

  if (!username) {
    try {
      await bot.sendMessage(
        chatId,
        "Iltimos, Telegram profilida username (@) o‘rnating va qayta /start bering."
      );
    } catch (err) {
      console.error("Bot /start xato:", err.response?.body?.description || err.message);
    }
    return;
  }

  try {
    const existing = await User.findOne({ telegram: username.replace("@", "").trim() });

    if (!existing) {
      await bot.sendMessage(
        chatId,
        `Salom ${username}!\n\nSizning Telegram Chat ID: <code>${chatId}</code>\n\nIltimos, saytga o'tib register formasiga shu Chat ID ni kiriting.`,
        { parse_mode: "HTML" }
      );
      return;
    }

    if (existing.chatId !== chatId) {
      existing.chatId = chatId;
      await existing.save();
      await bot.sendMessage(chatId, "✅ Chat ID yangilandi. Endi biz sizga xabar yubora olamiz.");
    } else {
      await bot.sendMessage(chatId, "👋 Siz allaqachon roʻyxatga olingansiz va Chat ID saqlangan.");
    }
  } catch (err) {
    console.error("Bot /start xato:", err.response?.body?.description || err.message);
  }
});

module.exports = bot;
