const Product = require("../models/Product");

// 🔹 Barcha productlarni olish
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({ success: true, products });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server xatosi!" });
  }
};

// 🔹 Yangi product qo'shish
exports.addProduct = async (req, res) => {
  try {
    const { title, price, description, thumbnail, images, category } = req.body;
    if (!title || !price) {
      return res.status(400).json({ success: false, message: "Title va price kerak!" });
    }

    const product = new Product({ title, price, description, thumbnail, images, category });
    await product.save();
    res.json({ success: true, message: "Product muvaffaqiyatli qo'shildi!", product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server xatosi!" });
  }
};
