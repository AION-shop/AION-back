const express = require("express");
const {
  getAllColProducts,
  getColProductById,
  addColProduct,
  bulkAddColProducts,
  updateColProduct,
  deleteColProduct,
  addColProductView,
  addColProductRating
} = require("../controllers/colProductController");

const router = express.Router();

router.get("/", getAllColProducts);
router.get("/:id", getColProductById);
router.post("/", addColProduct);
router.post("/bulk", bulkAddColProducts);
router.put("/:id", updateColProduct);
router.delete("/:id", deleteColProduct);

// Custom endpoints
router.put("/:id/view", addColProductView);
router.put("/:id/rating", addColProductRating);

module.exports = router;
