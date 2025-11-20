// routes/productRoutes.js
const express = require("express");
const router = express.Router();
const productController = require("../controllers/discountController");

// Public routes
router.get("/", productController.getProducts);
router.get("/:id", productController.getProductById);
router.get("/category/:category", productController.getProductsByCategory);

// Admin routes (CRUD) - bu yerda auth middleware qo‘shishingiz mumkin
router.post("/", productController.createProduct);
router.put("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);

module.exports = router;
