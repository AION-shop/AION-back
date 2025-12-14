// controllers/authController.js
const { lastCodes } = require("../store/codeStore"); // singleton store

// Verify code
exports.verifyCode = (req, res) => {
  try {
    const { email, code } = req.body; // ✅ email ishlatilmoqda
    if (!email || !code)
      return res
        .status(400)
        .json({ success: false, message: "Email va kod kerak!" });

    const rec = lastCodes.get(email); // ✅ username o‘rniga email
    if (!rec)
      return res
        .status(400)
        .json({ success: false, message: "Bu email uchun kod yuborilmagan" });

    if (Date.now() > rec.expiresAt) {
      lastCodes.delete(email);
      return res.status(400).json({ success: false, message: "Kod muddati o‘tgan" });
    }

    if (rec.code !== String(code)) {
      return res.status(400).json({ success: false, message: "Kod noto‘g‘ri" });
    }

    // muvaffaqiyat: bitta martalik qilish uchun o'chiramiz
    lastCodes.delete(email);

    // one-time token yoki auth token
    const oneTimeToken = Math.random().toString(36).slice(2, 12);

    return res.json({ success: true, token: oneTimeToken, user: { email } });
  } catch (err) {
    console.error("verify-code xato:", err);
    return res.status(500).json({ success: false, message: "Server xatosi" });
  }
};
