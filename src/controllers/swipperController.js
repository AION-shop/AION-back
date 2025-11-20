// controllers/categoryController.js
const Category = require("../models/category.model");

// Barcha kategoriyalarni olish
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Yagona kategoriya qo'shish
exports.addCategory = async (req, res) => {
  try {
    const { name, slug, url, icon } = req.body;
    if (!name || !slug || !url) {
      return res.status(400).json({ success: false, message: "Name, slug va url kerak!" });
    }
    const category = new Category({ name, slug, url, icon });
    await category.save();
    res.status(201).json({ success: true, category });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
