const User = require("../models/User");
const ResetCode = require("../models/ResetCode");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
require("dotenv").config();

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ================= REGISTER =================
exports.register = async (req, res) => {
  try {
    let { email, nickname, password } = req.body;

    if (!email || !nickname || !password)
      return res.json({ success: false, message: "Barcha maydonlar to‘ldirilishi kerak!" });

    email = email.trim().toLowerCase();

    if (await User.findOne({ email }))
      return res.json({ success: false, message: "Bu email allaqachon mavjud!" });

    const user = new User({
      email,
      nickname,
      password,
      role: "admin",
    });

    await user.save();

    return res.json({ success: true, message: "Ro‘yxatdan o‘tish muvaffaqiyatli!", user });
  } catch (error) {
    console.error(error);
    return res.json({ success: false, message: "Server bilan bog‘lanishda xatolik!" });
  }
};

// ================= LOGIN =================
exports.login = async (req, res) => {
  try {
    let { email, password } = req.body;
    if (!email || !password)
      return res.json({ success: false, message: "Email va parol kiritilishi kerak!" });

    email = email.trim().toLowerCase();
    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.json({ success: false, message: "Foydalanuvchi topilmadi!" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.json({ success: false, message: "Parol noto‘g‘ri!" });

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });

    return res.json({
      success: true,
      message: "Kirish muvaffaqiyatli!",
      user: { email: user.email, nickname: user.nickname, role: user.role },
      token,
    });
  } catch (error) {
    console.error(error);
    return res.json({ success: false, message: "Server xatosi!" });
  }
};

// ================= GET ADMIN USERS =================
exports.getAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: "admin" });
    res.json({ success: true, users: admins });
  } catch (error) {
    console.error("❌ getAdmins error:", error);
    res.status(500).json({ success: false, message: "Server xatosi!" });
  }
};

// ================= SEND FORGOT PASSWORD CODE =================
exports.sendCode = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.json({ success: false, message: "Email kiritilmadi!" });

    const user = await User.findOne({ email });
    if (!user) return res.json({ success: false, message: "Foydalanuvchi topilmadi!" });

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const codeHash = crypto.createHash("sha256").update(code).digest("hex");

    await ResetCode.create({
      email,
      codeHash,
      plainCode: code,
      used: false,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Parol tiklash kodi",
      html: `<p>🔐 Sizning parol tiklash kodingiz: <b>${code}</b></p>
             <p>Bu kod 10 daqiqa ichida amal qiladi.</p>`,
    });

    return res.json({ success: true, message: "Kod email orqali yuborildi ✅" });
  } catch (error) {
    console.error(error);
    return res.json({ success: false, message: "Server xatosi!" });
  }
};

// ================= VERIFY CODE & RESET PASSWORD =================
exports.verifyCode = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    if (!email || !code || !newPassword)
      return res.json({ success: false, message: "Barcha maydonlar to‘ldirilishi kerak!" });

    const entry = await ResetCode.findOne({ email, used: false });
    if (!entry) return res.json({ success: false, message: "Avval kod yuboring!" });

    if (Date.now() > entry.expiresAt) return res.json({ success: false, message: "Kod muddati tugagan!" });

    const codeHash = crypto.createHash("sha256").update(code).digest("hex");
    if (codeHash !== entry.codeHash) return res.json({ success: false, message: "Kod noto‘g‘ri!" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findOneAndUpdate({ email }, { password: hashedPassword });

    entry.used = true;
    await entry.save();

    return res.json({ success: true, message: "Parol muvaffaqiyatli yangilandi!" });
  } catch (error) {
    console.error(error);
    return res.json({ success: false, message: "Server xatosi!" });
  }
};
