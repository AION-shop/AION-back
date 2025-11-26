import express from "express";
import Otp from "../models/Otp.js";
import { sendEmail } from "../src/sendEmail.js"; // sendEmail faylingiz
import jwt from "jsonwebtoken";

const router = express.Router();

// --------------------
// 1) OTP yuborish
// --------------------
router.post("/login-otp", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: "Email kiriting!" });

    // 6 xonali OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 daqiqa

    // Eski OTPlarni o‘chirish
    await Otp.deleteMany({ email });

    // Yangi OTP saqlash
    await Otp.create({ email, code, expiresAt });

    // Emailga yuborish
    await sendEmail({
      to: email,
      subject: "Kirish kodi",
      html: `<h1>${code}</h1><p>Kod 5 daqiqa amal qiladi.</p>`
    });

    res.json({ success: true, message: "Emailga kod yuborildi!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "OTP yuborishda xatolik yuz berdi" });
  }
});

// --------------------
// 2) OTP tekshirish
// --------------------
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) return res.status(400).json({ success: false, message: "Email va OTP kerak" });

    const otpRecord = await Otp.findOne({ email, code });
    if (!otpRecord) return res.status(400).json({ success: false, message: "OTP noto‘g‘ri" });

    if (otpRecord.expiresAt < Date.now()) {
      await Otp.deleteMany({ email });
      return res.status(400).json({ success: false, message: "OTP muddati tugagan" });
    }

    // OTP bir martalik, shuning uchun o‘chirish
    await Otp.deleteMany({ email });

    // JWT token yaratish (keyinchalik auth uchun ishlatiladi)
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ success: true, message: "OTP tasdiqlandi!", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "OTP tekshirishda xatolik yuz berdi" });
  }
});

export default router;
