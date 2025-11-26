const express = require("express");
const {
  createDiscountCard,
  getActiveProduct,
  deleteDiscountCard
} = require("../controllers/discountController");

const router = express.Router();

// Admin
router.post("/", createDiscountCard);
router.delete("/:id", deleteDiscountCard);

// Frontend
router.get("/active/products", getActiveProduct);

module.exports = router;
