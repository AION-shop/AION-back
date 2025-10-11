const TelegramBot = require("node-telegram-bot-api");
const dotenv = require("dotenv");
const User = require("./models/User");
dotenv.config();

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

bot.onText(/\/start/, async (msg) => {
  try {
    const chatId = String(msg.chat.id);
    const from = msg.from || {};
    const username = from.username ? `@${from.username}` : null;

    if (!username) {
      await bot.sendMessage(
        chatId,
        "Iltimos, Telegram profilida username (@) o‘rnating va qayta /start bering."
      );
      return;
    }

    // Foydalanuvchi allaqachon DBda mavjudmi?
    const existing = await User.findOne({ telegram: username });

    if (!existing) {
      // Agar foydalanuvchi ro'yxatdan o'tmagan bo'lsa, faqat Chat ID yuboramiz
      await bot.sendMessage(
        chatId,
        `Salom ${username}!\n\nSizning Telegram Chat ID: <code>${chatId}</code>\n\nIltimos, saytga o'tib register formasiga shu Chat ID ni kiriting.`,
        { parse_mode: "HTML" }
      );
      return;
    }

    // Agar foydalanuvchi bor va chatId o'zgargan bo'lsa — yangilaymiz
    if (existing.chatId !== chatId) {
      existing.chatId = chatId;
      await existing.save();
      await bot.sendMessage(
        chatId,
        "✅ Chat ID yangilandi. Endi biz sizga xabar yubora olamiz."
      );
    } else {
      await bot.sendMessage(
        chatId,
        "👋 Siz allaqachon roʻyxatga olingansiz va Chat ID saqlangan."
      );
    }
  } catch (err) {
    console.error("Bot /start xato:", err);
  }
});

module.exports = bot;
