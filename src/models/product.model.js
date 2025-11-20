const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: String,
  price: Number,
  description: String,
  thumbnail: String,
  images: [String],
  batteryOptions: [String],
  maxRange: Number,
  acceleration: Number,
  power: Number,
  reviewsCount: Number,
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
