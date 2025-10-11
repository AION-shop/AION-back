const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");
const User = require("../models/User");
require("dotenv").config();

const BOT_TOKEN = process.env.BOT_TOKEN;

router.post("/", async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) return res.status(400).json({ message: "Username kiritilmadi" });

    const user = await User.findOne({ telegram: username });
    if (!user) return res.status(404).json({ message: "Bunday foydalanuvchi topilmadi" });

    const telegramUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    const message = `
🧾 <b>Parol tiklash</b>
👤 Username: ${user.telegram}
🔑 Sizning parolingiz: <code>${user.password}</code>
📅 Sana: ${new Date().toLocaleString("uz-UZ")}
    `;

    await fetch(telegramUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: user.chatId, text: message, parse_mode: "HTML" }),
    });

    res.json({ success: true, message: "Parol Telegram orqali yuborildi ✅" });
  } catch (err) {
    console.error("❌ Forgot password xatosi:", err);
    res.status(500).json({ message: "Serverda xatolik yuz berdi" });
  }
});

module.exports = router;
