const express = require("express");
const productController = require("../controllers/product.controller.js");

const router = express.Router();

router.post("/add", productController.addProduct);
router.get("/", productController.getAllProducts);
router.get("/search", productController.searchProducts);
router.get("/category/:category", productController.getProductsByCategory);
router.get("/:id", productController.getProductById);
router.put("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);
router.get("/stats", productController.getProductStats);
router.delete("/delete-all", productController.deleteAllProducts);

module.exports = router;
