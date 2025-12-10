const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    model: { type: String, required: true }, // misol: Aion Y 2024
    icon: { type: String, required: true }, // rasm URL
    slug: { type: String, required: true }, 
    url: { type: String, default: "#" } // frontendga link
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
