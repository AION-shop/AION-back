const TelegramBot = require("node-telegram-bot-api");
const dotenv = require("dotenv");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

dotenv.config();

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: false });

// Kodlar saqlash xotirasi (5 daqiqa amal qiladi)
let codes = {}; // { telegram: { code: '123456', expires: timestamp } }

exports.register = async (req, res) => {
  try {
    const { telegram, password, chatId } = req.body;
    if (!telegram || !password || !chatId)
      return res.json({ success: false, message: "Barcha maydonlar to‘ldirilishi kerak!" });

    const existing = await User.findOne({ telegram });
    if (existing)
      return res.json({ success: false, message: "Bu username allaqachon mavjud!" });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ telegram, password: hashed, chatId });
    await user.save();

    // Telegramga xabar yuborish
    await bot.sendMessage(
      chatId,
      `✅ Ro‘yxatdan o‘tish muvaffaqiyatli!\n👤 Username: ${telegram}`,
      { parse_mode: "HTML" }
    );

    res.json({ success: true, message: "Ro‘yxatdan o‘tish muvaffaqiyatli!" });
  } catch (error) {
    console.error("❌ register error:", error);
    res.json({ success: false, message: "Server xatosi!" });
  }
};

// 🔹 Login
exports.login = async (req, res) => {
  try {
    const { telegram, password } = req.body;
    if (!telegram || !password)
      return res.json({ success: false, message: "Telegram va parol kiritilishi kerak!" });

    const user = await User.findOne({ telegram });
    if (!user) return res.json({ success: false, message: "Foydalanuvchi topilmadi!" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.json({ success: false, message: "Parol noto‘g‘ri!" });

    if (!process.env.JWT_SECRET)
      return res.json({ success: false, message: "Server sozlamasi noto‘g‘ri (JWT_SECRET yo‘q)!" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({ success: true, message: "Kirish muvaffaqiyatli!", token, user: { telegram: user.telegram } });
  } catch (error) {
    console.error("❌ login error:", error);
    res.json({ success: false, message: "Server xatosi!" });
  }
};

// 🔹 Send Code (Forgot Password)
exports.sendCode = async (req, res) => {
  try {
    const { telegram } = req.body;
    if (!telegram) return res.json({ success: false, message: "Telegram username kiritilmadi!" });

    const user = await User.findOne({ telegram });
    if (!user) return res.json({ success: false, message: "Bunday foydalanuvchi topilmadi!" });

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = Date.now() + 5 * 60 * 1000; // 5 daqiqa amal qiladi
    codes[telegram] = { code, expires, chatId: user.chatId };

    await bot.sendMessage(user.chatId, `🔐 Sizning tasdiqlash kodingiz: ${code}\nKod 5 daqiqa ichida amal qiladi.`);

    res.json({ success: true, message: "Kod Telegram orqali yuborildi!" });
  } catch (err) {
    console.error("❌ Telegram xatolik:", err.message);
    res.json({ success: false, message: "Telegram orqali yuborishda xatolik!" });
  }
};

// 🔹 Verify Code (Forgot Password)
exports.verifyCode = async (req, res) => {
  try {
    const { telegram, code, newPassword } = req.body;
    if (!telegram || !code || !newPassword)
      return res.json({ success: false, message: "Barcha maydonlar to‘ldirilishi kerak!" });

    const entry = codes[telegram];
    if (!entry) return res.json({ success: false, message: "Avval kod yuboring!" });

    if (Date.now() > entry.expires) {
      delete codes[telegram];
      return res.json({ success: false, message: "Kodning amal qilish muddati tugagan!" });
    }

    if (entry.code !== code) return res.json({ success: false, message: "Kod noto‘g‘ri!" });

    // Kod to‘g‘ri, faqat bir martalik ishlaydi
    delete codes[telegram];

    const hashed = await bcrypt.hash(newPassword, 10);
    await User.findOneAndUpdate({ telegram }, { password: hashed });

    await bot.sendMessage(entry.chatId, `✅ Parol muvaffaqiyatli yangilandi!`);

    res.json({ success: true, message: "Parol muvaffaqiyatli yangilandi!" });
  } catch (error) {
    console.error("❌ verifyCode error:", error);
    res.json({ success: false, message: "Server xatosi!" });
  }
};


// 🔹 Get All Users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 }); // parolni ko‘rsatmaymiz
    res.json({ success: true, users });
  } catch (error) {
    console.error("❌ getAllUsers error:", error);
    res.json({ success: false, message: "Foydalanuvchilarni olishda xatolik!" });
  }
};

