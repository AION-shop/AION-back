// src/models/Model.js
const mongoose = require("mongoose");

const ModelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  img: {
    type: String, // rasm URL
    required: true,
  },
  description: {
    type: String, // ixtiyoriy qo‘shimcha ma’lumot
  },
}, { timestamps: true });

module.exports = mongoose.model("CarModel", ModelSchema);
