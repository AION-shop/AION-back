// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const { verifyCode } = require("../controllers/authController");

// POST /api/auth/client/verify-code
router.post("/verify-code", verifyCode);

module.exports = router;
