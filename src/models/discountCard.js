const mongoose = require("mongoose");

const discountCardSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    product1: {
      name: { type: String, required: true },
      price: { type: Number, required: true },           // chegirma narxi
      originalPrice: { type: Number, required: true },   // asl narx
      image: { type: String, default: "" },
      showProduct1Until: { type: Date, required: true },
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DiscountCard", discountCardSchema);
