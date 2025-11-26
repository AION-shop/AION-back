import express from "express";
import Otp from "../models/Otp.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// --------------------
// OTP tekshirish
// --------------------
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code)
      return res.status(400).json({ success: false, message: "Email va OTP kerak!" });

    const otpRecord = await Otp.findOne({ email, code });

    if (!otpRecord)
      return res.status(400).json({ success: false, message: "Kod noto‘g‘ri!" });

    if (otpRecord.expiresAt < Date.now()) {
      // Muddat tugagan OTP ni o‘chirish
      await Otp.deleteMany({ email });
      return res.status(400).json({ success: false, message: "Kod eskirgan!" });
    }

    // Kod to‘g‘ri → JWT token yaratamiz
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "7d" });

    // Kodni bir martalik bo‘lgani uchun o‘chiramiz
    await Otp.deleteMany({ email });

    res.json({
      success: true,
      message: "Kirish muvaffaqiyatli!",
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server xatolik yuz berdi!" });
  }
});

export default router;
