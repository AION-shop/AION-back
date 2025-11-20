const express = require("express");
const {
  getAllRowProducts,
  getRowProductById,
  getRowProductsByCategory,
  searchRowProducts,
  addRowProduct,
  updateRowProduct,
  deleteRowProduct,
} = require("../controllers/rowProductController.js");

const router = express.Router();

// CRUD routes
router.get("/", getAllRowProducts);
router.get("/search", searchRowProducts);
router.get("/category/:category", getRowProductsByCategory);
router.get("/:id", getRowProductById);
router.post("/", addRowProduct);
router.put("/:id", updateRowProduct);
router.delete("/:id", deleteRowProduct);

module.exports = router;
