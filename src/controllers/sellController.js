const SellCar = require("../models/sellModel");

// POST — yangi sotuvchi qo'shish
exports.createSellRequest = async (req, res) => {
  try {
    const newSell = new SellCar(req.body);
    await newSell.save();
    res.status(201).json({ success: true, data: newSell });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET — barcha sotuvchilarni olish (admin)
exports.getAllSellRequests = async (req, res) => {
  try {
    const sellers = await SellCar.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: sellers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
