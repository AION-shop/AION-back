const express = require("express");
const router = express.Router();
const { createSellRequest, getAllSellRequests } = require("../controllers/sellController");

// POST — sotuvchi formasi yuborish
router.post("/", createSellRequest);

// GET — barcha yuborilganlar (admin panel uchun)
router.get("/", getAllSellRequests);

module.exports = router;
