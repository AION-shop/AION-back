// src/models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  telegram: {
    type: String,
    required: true,
    unique: true, // Telegram username yagona bo‘lsin
  },

  chatId: {
    type: String,
    required: true,
    unique: true // Har bir chatId faqat bir marta ishlatilishi mumkin
  },
  
  password: {
    type: String,
    required: true
  },

}, { timestamps: true }); // yaratish va o‘zgartirish vaqtini saqlash uchun

module.exports = mongoose.model("User", userSchema);
