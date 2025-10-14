// src/index.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const dbConnection = require("./config/db");

// 🔹 Routerlar
const authRoutes = require("./routes/authRoutes");
const forgotRoutes = require("./routes/forgotRoutes");
const productRoutes = require("./routes/product.routes");

// 🔹 .env yuklash
dotenv.config();

const app = express();

// 🔹 Middleware
app.use(
  cors({
    origin: "*", // Frontend domenini qo‘yish mumkin
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());

// 🔹 MongoDB ulanishi
(async () => {
  try {
    await dbConnection();
    console.log("✅ MongoDB muvaffaqiyatli ulandi");
  } catch (err) {
    console.error("❌ MongoDB ulanish xatosi:", err.message);
    process.exit(1);
  }
})();

// 🔹 Routes
app.use("/api/auth", authRoutes);
app.use("/api/forgot", forgotRoutes);
app.use("/api/products", productRoutes);

// 🔹 Test route (server ishlashini tekshirish)
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "✅ Server ishlayapti va MongoDB ulangan!",
    time: new Date().toLocaleString("uz-UZ"),
  });
});

// 🔹 404 Not Found
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "❌ Bunday sahifa topilmadi!",
  });
});

// 🔹 Global error handler
app.use((err, req, res, next) => {
  console.error("❌ Server xatosi:", err);
  res.status(500).json({
    success: false,
    message: "Serverda ichki xatolik yuz berdi!",
  });
});

// 🔹 Serverni ishga tushirish
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server ${PORT}-portda ishlayapti...`);
});
