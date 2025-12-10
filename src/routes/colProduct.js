const express = require("express");
const {
  getAllColProducts,
  getColProductById,
  addColProduct,
  bulkAddColProducts,
  updateColProduct,
  deleteColProduct,
  addColProductView
} = require("../controllers/colProductController");

const router = express.Router();

router.get("/", getAllColProducts);
router.get("/:id", getColProductById);
router.post("/", addColProduct);
router.post("/bulk", bulkAddColProducts); // <-- bulk insert endpoint
router.put("/:id", updateColProduct);
router.delete("/:id", deleteColProduct);
router.put("/:id/view", addColProductView);

module.exports = router;
