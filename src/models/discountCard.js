// models/Product.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    category: { type: String },
    price: { type: Number, required: true },
    discountPercentage: { type: Number, default: 0 },
    thumbnail: { type: String },
    images: [{ type: String }],
    brand: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
