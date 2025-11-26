const ColProduct = require("../models/colProductModel");

// GET all products
const getAllColProducts = async (req, res) => {
  try {
    const products = await ColProduct.find().sort({ createdAt: -1 });
    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET product by ID
const getColProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await ColProduct.findById(id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET products by category
const getColProductsByCategory = async (req, res) => {
  const { category } = req.params;
  try {
    const products = await ColProduct.find({ category });
    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// SEARCH products
const searchColProducts = async (req, res) => {
  const { q } = req.query;
  try {
    const products = await ColProduct.find({ title: { $regex: q, $options: "i" } });
    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ADD new product
const addColProduct = async (req, res) => {
  const { title, price, discountPercentage, category, thumbnail, images } = req.body;
  try {
    const newProduct = new ColProduct({ title, price, discountPercentage, category, thumbnail, images });
    await newProduct.save();
    res.json({ success: true, product: newProduct });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// UPDATE product
const updateColProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedProduct = await ColProduct.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedProduct) return res.status(404).json({ success: false, message: "Product not found" });
    res.json({ success: true, product: updatedProduct });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE product
const deleteColProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedProduct = await ColProduct.findByIdAndDelete(id);
    if (!deletedProduct) return res.status(404).json({ success: false, message: "Product not found" });
    res.json({ success: true, message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getAllColProducts,
  getColProductById,
  getColProductsByCategory,
  searchColProducts,
  addColProduct,
  updateColProduct,
  deleteColProduct,
};
