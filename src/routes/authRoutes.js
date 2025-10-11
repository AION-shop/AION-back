const express = require("express");
const { register, login, sendCode, verifyCode } = require("../controllers/authController");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/send-code", sendCode);
router.post("/verify-code", verifyCode);

module.exports = router;
