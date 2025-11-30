const mongoose = require("mongoose");

const sellSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    region: { type: String, required: true },
    carModel: { type: String, required: true },
    aboutYou: { type: String, required: true },
    aboutCar: { type: String, required: true },
    phone: { type: String }, // optional
    email: { type: String }, // optional
    extraInfo: { type: String } // optional
  },
  { timestamps: true }
);

module.exports = mongoose.model("SellCar", sellSchema);
