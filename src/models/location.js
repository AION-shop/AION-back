const mongoose = require("mongoose");

const LocationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  lat: { type: Number, required: true },
  lon: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Location", LocationSchema);
