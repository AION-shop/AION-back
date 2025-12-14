const mongoose = require("mongoose");

const userClientSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true, required: true },
    firstName: { type: String },
    lastName: { type: String },
    role: { type: String, enum: ["client"], default: "client" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserClient", userClientSchema);
