const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  thumbnail: { type: String },
  images: { type: [String], default: [] },
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
