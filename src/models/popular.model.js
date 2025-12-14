const mongoose = require("mongoose");

const PopularSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  thumbnail: { type: String, required: true },
  images: { type: [String], required: true },
  batteryOptions: { type: [String], required: true },
  maxRange: { type: Number, required: true },       // km
  acceleration: { type: Number, required: true },   // 0-100 km/h soniya
  power: { type: Number, required: true },          // kW
  topSpeed: { type: Number, required: true },       // km/h
  drivetrain: { type: String, required: true },     // AWD, RWD, FWD
  chargingTime: { type: String, required: true },   // "0-80% in 30 min"
  features: { type: [String], default: [] },        // optional
  rating: { type: Number, default: 0 },            // o‘rtacha reyting
  reviewsCount: { type: Number, default: 0 },      // necha kishi reyting berdi
  views: { type: Number, default: 0 },             // necha kishi ko‘rdi
}, { timestamps: true });

module.exports = mongoose.model("Popular", PopularSchema);
