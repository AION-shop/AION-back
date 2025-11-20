const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Mavjud route'lar
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/forgot/send", authController.sendCode);
router.post("/forgot/verify", authController.verifyCode);

// 🔹 Adminlarni olish (GET)
router.get("/users", authController.getAdmins); // ✅ bu funksiya bo‘lishi kerak

module.exports = router;
