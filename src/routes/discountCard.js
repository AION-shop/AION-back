import express from "express";
import { createDiscountCard, getActiveProduct, deleteDiscountCard } from "../controllers/discountController.js";

const router = express.Router();

// Admin
router.post("/", createDiscountCard);
router.delete("/:id", deleteDiscountCard);

// Frontend
router.get("/active/products", getActiveProduct);

export default router;
