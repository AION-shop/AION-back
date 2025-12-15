const UserClient = require("../models/userclient");
const Otp = require("../models/Otp");
const jwt = require("jsonwebtoken");
const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

// SEND CODE
exports.sendCode = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email)
      return res.json({ success: false, message: "Email kiritilishi kerak!" });

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await Otp.deleteMany({ email });
    await Otp.create({ email, code, expiresAt });

    // Resend orqali email yuborish
    await resend.emails.send({
      from: "ShopMarket <onboarding@resend.dev>",
      to: email,
      subject: "ShopMarket Login Code",
      html: `
        <h2>Sizning kodingiz: ${code}</h2>
        <p>Bu kod 5 daqiqa ichida amal qiladi</p>
      `,
    });

    res.json({ success: true, message: "Kod emailga yuborildi!" });
  } catch (err) {
    console.error("RESEND ERROR:", err);
    res.json({ success: false, message: "Email yuborilmadi" });
  }
};

// VERIFY CODE
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
