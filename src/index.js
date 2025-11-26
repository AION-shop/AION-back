const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

// ROUTES
const bannerRoutes = require("./routes/bannerRoutes");
const categoryRoutes = require("./routes/category.routes");
const colProductRoutes = require("./routes/colProduct");
const rowProductRoutes = require("./routes/rowProductRoutes");
const userClientRoutes = require("./routes/userclientRoutes");
const authRoutes = require("./routes/authRoutes"); // Admin / OTP routes
const discountCardRoutes = require("./routes/discountCard");
const Products = require("./routes/product.routes");
const emailRoutes = require("./routes/emailRoutes"); // Nodemailer route

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB ulanish
mongoose
.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 })
.then(() => console.log("✅ MongoDB ulandi"))
.catch((err) => console.error("❌ MongoDB xato:", err));

// Routes
app.use("/api/banners", bannerRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/col-products", colProductRoutes);
app.use("/api/row-products", rowProductRoutes);
app.use("/api/userClient", userClientRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/discount-cards", discountCardRoutes);
app.use("/api/products", Products);
app.use("/api/send-email", emailRoutes);

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
