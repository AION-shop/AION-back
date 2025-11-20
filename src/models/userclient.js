const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userClientSchema = new mongoose.Schema({
  telegram: { type: String, required: true, unique: true },
  chatId: { type: String, default: null },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ["client"], default: "client" },
}, { timestamps: true });

// Parolni hash qilish
userClientSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model("UserClient", userClientSchema);
