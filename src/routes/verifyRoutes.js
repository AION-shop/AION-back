// const express = require("express");
// const router = express.Router();
// // import lastCodes map from forgotRoutes, yoki use singleton store file
// const { lastCodes } = require("../store/codeStore"); // pastda ko'rsataman

// router.post("/verify-code", (req, res) => {
//   try {
//     const { username, code } = req.body;
//     if (!username || !code) return res.status(400).json({ success: false, message: "Parametrlar yetarli emas" });

//     const rec = lastCodes.get(username);
//     if (!rec) return res.status(400).json({ success: false, message: "Bu username uchun kod yuborilmagan" });

//     if (Date.now() > rec.expiresAt) {
//       lastCodes.delete(username);
//       return res.status(400).json({ success: false, message: "Kod muddati o‘tgan" });
//     }

//     if (rec.code !== String(code)) {
//       return res.status(400).json({ success: false, message: "Kod noto‘g‘ri" });
//     }

//     // muvaffaqiyat: bitta martalik qilish uchun o'chiramiz
//     lastCodes.delete(username);
//     // qaytaramiz oneTimeToken yoki auth token
//     const oneTimeToken = Math.random().toString(36).slice(2, 12);
//     return res.json({ success: true, oneTimeToken });
//   } catch (err) {
//     console.error("verify-code xato:", err);
//     return res.status(500).json({ success: false, message: "Server xatosi" });
//   }
// });

// module.exports = router;
