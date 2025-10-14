const express = require("express");
const { register, login, sendCode, verifyCode, getAllUsers } = require("../controllers/authController");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/send-code", sendCode);
router.post("/verify-code", verifyCode);

// 🔹 Yangi qo‘shildi
router.get("/users", getAllUsers);

module.exports = router;
