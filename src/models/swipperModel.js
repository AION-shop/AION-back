// models/category.model.js
const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },      // Kategoriya nomi
    slug: { type: String, required: true, unique: true }, // URL uchun slug
    url: { type: String, required: true },       // Category-ni ochish uchun link
    icon: { type: String },                       // (ixtiyoriy) category ikonkasi yoki rangi uchun
  },
  { timestamps: true } // createdAt va updatedAt avtomatik
);

module.exports = mongoose.model("Category", categorySchema);
