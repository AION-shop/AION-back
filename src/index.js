// index.js
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

// ROUTES
import bannerRoutes from "./routes/bannerRoutes.js";
import discountCard from "./routes/discountCard.js"; // Discount va normal products
import categoryRoutes from "./routes/category.routes.js";
import colProductRoutes from "./routes/colProduct.js";
import rowProductRoutes from "./routes/rowProductRoutes.js";
import userClientRoutes from "./routes/userclientRoutes.js";
import authRoutes from "./routes/authRoutes.js"; // Admin routes

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB ulanish
mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => console.log("✅ MongoDB ulandi"))
  .catch((err) => console.error("❌ MongoDB xato:", err));

// ROUTES
app.use("/api/banners", bannerRoutes);
app.use("/api/products", discountCard); // GET all, by ID, by category, create/update/delete
app.use("/api/categories", categoryRoutes);
app.use("/api/col-products", colProductRoutes);
app.use("/api/row-products", rowProductRoutes);
app.use("/api/userClient", userClientRoutes);
app.use("/api/auth", authRoutes);

// Health check
app.get("/", (req, res) => res.send("Server ishlayapti ✅"));

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: "Page not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Server error" });
});

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server ${PORT}-portda ishlayapti`));
