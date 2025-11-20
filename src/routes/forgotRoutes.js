const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");
const User = require("../models/User");
const ResetCode = require("../models/ResetCode");
const crypto = require("crypto");
require("dotenv").config();

const BOT_TOKEN = process.env.BOT_TOKEN;

router.post("/", async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) return res.status(400).json({ message: "Username kiritilmadi" });

    const cleanUsername = username.replace("@", "").trim();
    const user = await User.findOne({ telegram: cleanUsername });
    if (!user) return res.status(404).json({ message: "Bunday foydalanuvchi topilmadi" });

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const codeHash = crypto.createHash("sha256").update(code).digest("hex");

    await ResetCode.create({
      username: cleanUsername,
      chatId: user.chatId,
      codeHash,
      plainCode: code,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    const telegramUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    const message = `
🧾 <b>Parol tiklash kodi</b>
👤 Username: ${user.telegram}
🔑 Kod: <code>${code}</code>
📅 Sana: ${new Date().toLocaleString("uz-UZ")}
`;

    await fetch(telegramUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: user.chatId, text: message, parse_mode: "HTML" }),
    });

    res.json({ success: true, message: "Kod Telegram orqali yuborildi ✅" });
  } catch (err) {
    console.error("❌ Forgot password xatosi:", err);
    res.status(500).json({ message: "Serverda xatolik yuz berdi" });
  }
});

module.exports = router;
