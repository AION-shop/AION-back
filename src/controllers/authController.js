const Otp = require("../models/Otp");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: "Email kiriting!" });

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 daqiqa

    await Otp.deleteMany({ email });
    await Otp.create({ email, code, expiresAt });

    await transporter.sendMail({
      from: `"ShopMarket" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Kirish kodi",
      html: `<h1>${code}</h1><p>Kod 5 daqiqa amal qiladi.</p>`,
    });

    res.json({ success: true, message: "Emailga kod yuborildi!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server xatosi" });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code)
      return res.status(400).json({ success: false, message: "Email va OTP kerak!" });

    const otpRecord = await Otp.findOne({ email, code });
    if (!otpRecord) return res.status(400).json({ success: false, message: "Kod noto‘g‘ri!" });

    if (otpRecord.expiresAt < Date.now()) {
      await Otp.deleteMany({ email });
      return res.status(400).json({ success: false, message: "Kod eskirgan!" });
    }

    await Otp.deleteMany({ email });

    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ success: true, message: "Kirish muvaffaqiyatli!", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server xatosi" });
  }
};
