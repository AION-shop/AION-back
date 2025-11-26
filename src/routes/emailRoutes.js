const express = require("express");
const { sendEmail } = require("../sendEmail"); // sendEmail.js ni ham CommonJS ga o‘zgartirish kerak

const router = express.Router();

router.post("/", async (req, res) => {
  const { to, subject, text, html } = req.body;

  if (!to || !subject) {
    return res.status(400).json({ success: false, message: "Email va subject kerak" });
  }

  try {
    await sendEmail({ to, subject, text, html });
    res.json({ success: true, message: "Email yuborildi ✅" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Email yuborishda xato" });
  }
});

module.exports = router;
