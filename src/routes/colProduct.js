// routes/colProduct.js
const express = require("express");
const {
  getAllColProducts,
  getColProductById,
  addColProduct,
  updateColProduct,
  deleteColProduct
} = require("../controllers/colProductController"); // .js yozmaslik tavsiya qilinadi

const router = express.Router();

router.get("/", getAllColProducts);
router.get("/:id", getColProductById);
router.post("/", addColProduct);
router.put("/:id", updateColProduct);
router.delete("/:id", deleteColProduct);

module.exports = router;
