const express = require("express");
const { sendOtp, verifyOtp, register, login, sendCode, verifyCode, getAdmins } = require("../controllers/authController");

const router = express.Router();



// OTP login
router.post("/login-otp", sendOtp);
router.post("/verify-otp", verifyOtp);



// Get admin users


module.exports = router;
