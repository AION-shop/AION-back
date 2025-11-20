// routes/colProduct.js
import express from "express";
import {
  getAllColProducts,
  getColProductById,
  addColProduct,
  updateColProduct,
  deleteColProduct
} from "../controllers/colProductController.js";

const router = express.Router();

router.get("/", getAllColProducts);
router.get("/:id", getColProductById);
router.post("/", addColProduct);
router.put("/:id", updateColProduct);
router.delete("/:id", deleteColProduct);

export default router;
