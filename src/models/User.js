const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    telegram: {
      type: String,
      required: true,
      unique: true,
    },
    chatId: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "client"],
      default: "client",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
