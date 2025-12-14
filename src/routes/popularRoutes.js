const express = require("express");
const {
  getPopularCars,
  getAllCars,
  getCarById,
  addCar,
  updateCar,
  deleteCar,
  addCarView,
  rateCar,
} = require("../controllers/popularController");

const router = express.Router();

// GET /api/popular/popular
router.get("/popular", getPopularCars);

// GET /api/popular
router.get("/", getAllCars);

// GET /api/popular/:id
router.get("/:id", getCarById);

// POST /api/popular
router.post("/", addCar);

// PUT /api/popular/:id
router.put("/:id", updateCar);

// DELETE /api/popular/:id
router.delete("/:id", deleteCar);

// PUT /api/popular/:id/view - view ni oshirish
router.put("/:id/view", addCarView);

// PUT /api/popular/:id/rate - rating berish
router.put("/:id/rate", rateCar);

module.exports = router;
