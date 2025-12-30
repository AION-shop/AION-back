const UserClient = require("../models/userclient");
const Otp = require("../models/Otp");
const jwt = require("jsonwebtoken");
// Resend o'rniga Nodemailer import qilamiz
const nodemailer = require("nodemailer");

// Gmail transporter sozlamalari
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Railway'dagi EMAIL_USER o'zgaruvchisi
    pass: process.env.EMAIL_PASS, // Railway'dagi EMAIL_PASS o'zgaruvchisi
  },
});

// SEND CODE funktsiyasi
exports.sendCode = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email)
      return res.json({ success: false, message: "Email kiritilishi kerak!" });

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await Otp.deleteMany({ email });
    await Otp.create({ email, code, expiresAt });

    // Nodemailer orqali email yuborish
    await transporter.sendMail({
      from: `"ShopMarket" <${process.env.EMAIL_USER}>`,
      to: email, // Endi xohlagan emailga boradi
      subject: "ShopMarket Login Code",
      html: `
        <h2>Sizning kodingiz: ${code}</h2>
        <p>Bu kod 5 daqiqa ichida amal qiladi</p>
      `,
    });

    res.json({ success: true, message: "Kod emailga yuborildi!" });
  } catch (err) {
    console.error("EMAIL ERROR:", err);
    res.json({ success: false, message: "Email yuborilmadi" });
  }
};

// VERIFY CODE funktsiyasi o'zgarishsiz qoldi
exports.verifyCode = async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code)
      return res.json({ success: false, message: "Email va kod kerak!" });

    const otpRecord = await Otp.findOne({ email, code });
    if (!otpRecord)
      return res.json({ success: false, message: "Kod noto‘g‘ri yoki topilmadi!" });

    if (otpRecord.expiresAt < new Date()) {
      await Otp.deleteOne({ _id: otpRecord._id });
      return res.json({ success: false, message: "Kod muddati tugagan!" });
    }

    let user = await UserClient.findOne({ email });
    if (!user) user = await UserClient.create({ email });

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    await Otp.deleteOne({ _id: otpRecord._id });

    res.json({ success: true, message: "Kirish muvaffaqiyatli!", token, user });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Server xatosi!" });
  }
};
