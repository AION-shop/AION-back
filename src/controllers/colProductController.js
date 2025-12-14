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

// ADD single product
const addColProduct = async (req, res) => {
  const newProduct = new ColProduct(req.body);
  try {
    await newProduct.save();
    res.json({ success: true, product: newProduct });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// BULK insert products
const bulkAddColProducts = async (req, res) => {
  const products = req.body;
  if (!Array.isArray(products)) return res.status(400).json({ success: false, message: "Array required" });
  try {
    const insertedProducts = await ColProduct.insertMany(products);
    res.json({ success: true, products: insertedProducts });
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

// INCREMENT views
const addColProductView = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedProduct = await ColProduct.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!updatedProduct) return res.status(404).json({ success: false, message: "Product not found" });
    res.json({ success: true, views: updatedProduct.views });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ADD rating
const addColProductRating = async (req, res) => {
  const { id } = req.params;
  const { rating } = req.body; // number 1-5

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ success: false, message: "Rating must be 1-5" });
  }

  try {
    const product = await ColProduct.findById(id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    const totalRating = product.rating * product.reviewsCount + rating;
    const newReviewsCount = product.reviewsCount + 1;
    const newRating = totalRating / newReviewsCount;

    product.rating = newRating;
    product.reviewsCount = newReviewsCount;

    await product.save();
    res.json({ success: true, rating: product.rating, reviewsCount: product.reviewsCount });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getAllColProducts,
  getColProductById,
  addColProduct,
  bulkAddColProducts,
  updateColProduct,
  deleteColProduct,
  addColProductView,
  addColProductRating
};
