const mongoose = require("mongoose");

const resetCodeSchema = new mongoose.Schema({
  username: { type: String, required: true },   // @username
  chatId: { type: String, required: true },     // foydalanuvchining chatId
  codeHash: { type: String, required: true },   // code hash (yoki plainCode agar xohlasang)
  plainCode: { type: String },                  // agar adminga ko'rsatmoqchi bo'lsang (optional)
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
  used: { type: Boolean, default: false },
});

module.exports = mongoose.model("ResetCode", resetCodeSchema);
