// controllers/rowProductController.js
const RowProduct = require("../models/rowProductModel");

// GET all row products
const getAllRowProducts = async (req, res) => {
  try {
    const products = await RowProduct.find().sort({ createdAt: -1 });
    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET row product by ID
const getRowProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await RowProduct.findById(id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET products by category
const getRowProductsByCategory = async (req, res) => {
  const { category } = req.params;
  try {
    const products = await RowProduct.find({ category });
    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// SEARCH products
const searchRowProducts = async (req, res) => {
  const { q } = req.query;
  try {
    const products = await RowProduct.find({ title: { $regex: q, $options: "i" } });
    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ADD new product
const addRowProduct = async (req, res) => {
  const { title, price, discountPercentage, category, description, thumbnail, images } = req.body;
  try {
    const newProduct = new RowProduct({ title, price, discountPercentage, category, description, thumbnail, images });
    await newProduct.save();
    res.json({ success: true, product: newProduct });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// UPDATE product
const updateRowProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedProduct = await RowProduct.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedProduct) return res.status(404).json({ success: false, message: "Product not found" });
    res.json({ success: true, product: updatedProduct });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE product
const deleteRowProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedProduct = await RowProduct.findByIdAndDelete(id);
    if (!deletedProduct) return res.status(404).json({ success: false, message: "Product not found" });
    res.json({ success: true, message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getAllRowProducts,
  getRowProductById,
  getRowProductsByCategory,
  searchRowProducts,
  addRowProduct,
  updateRowProduct,
  deleteRowProduct
};
