const mongoose = require("mongoose");

const colProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    discountPercentage: { type: Number, default: 0 },
    category: { type: String, default: "Electric Car" },
    description: { type: String, required: true },
    thumbnail: { type: String, required: true }, // required qilindi
    images: { type: [String], required: true },   // required qilindi
    batteryOptions: { type: [String], required: true }, // required
    maxRange: { type: Number, required: true },     // km
    acceleration: { type: Number, required: true }, // 0-100 km/h soniya
    power: { type: Number, required: true },        // kW
    topSpeed: { type: Number, required: true },     // km/h
    drivetrain: { type: String, required: true },   // "AWD", "RWD", "FWD"
    chargingTime: { type: String, required: true }, // "0-80% in 30 min"
    features: { type: [String], default: [] },      // optional
    rating: { type: Number, default: 0 },
    reviewsCount: { type: Number, default: 0 },
    views: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model("ColProduct", colProductSchema);
