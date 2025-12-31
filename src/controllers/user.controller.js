const UserClient = require("../models/userclient");
const Otp = require("../models/Otp");
const jwt = require("jsonwebtoken");
const transporter = require("../utils/mailer");

// ====================== SEND CODE ======================
exports.sendCode = async (req, res) => {
  try {
    let { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email kiritilishi kerak!",
      });
    }

    email = email.toLowerCase().trim();

    // 6 xonali kod
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min

    // eski kodlarni o‘chiramiz
    await Otp.deleteMany({ email });

    // yangi kod
    await Otp.create({
      email,
      code,
      expiresAt,
    });

    // EMAIL YUBORISH
    await transporter.sendMail({
      from: `"ShopMarket" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "ShopMarket Login Code",
      html: `
        <div style="font-family: Arial; max-width:600px">
          <h2>ShopMarket tasdiqlash kodingiz</h2>
          <p>Kirish uchun ushbu kodni kiriting:</p>
          <h1 style="letter-spacing:5px">${code}</h1>
          <p style="color:#888">Kod 5 daqiqa amal qiladi</p>
        </div>
      `,
    });

    res.json({
      success: true,
      message: "Kod emailga yuborildi!",
    });
  } catch (err) {
    console.error("SEND CODE ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Email yuborishda xatolik!",
    });
  }
};

// ====================== VERIFY CODE ======================
exports.verifyCode = async (req, res) => {
  try {
    let { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({
        success: false,
        message: "Email va kod kerak!",
      });
    }

    email = email.toLowerCase().trim();
    code = String(code).trim(); // 🔥 MUHIM

    const otpRecord = await Otp.findOne({ email, code });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "Kod noto‘g‘ri!",
      });
    }

    if (otpRecord.expiresAt < new Date()) {
      await Otp.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({
        success: false,
        message: "Kod muddati tugagan!",
      });
    }

    let user = await UserClient.findOne({ email });
    if (!user) {
      user = await UserClient.create({ email });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    await Otp.deleteOne({ _id: otpRecord._id });

    res.json({
      success: true,
      message: "Kirish muvaffaqiyatli!",
      token,
      user,
    });
  } catch (err) {
    console.error("VERIFY CODE ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server xatosi!",
    });
  }
};

