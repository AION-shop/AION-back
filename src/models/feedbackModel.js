const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    comment: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Feedback", feedbackSchema);
