const express = require("express");
const router = express.Router();

// GET /api/products
router.get("/", (req, res) => {
  res.json({ success: true, message: "Product routes ishlayapti!" });
});

// POST /api/products/add
router.post("/add", (req, res) => {
  const product = req.body;
  console.log("Yangi product:", product);
  res.status(201).json({ success: true, message: "Product qo‘shildi!", product });
});

module.exports = router;
