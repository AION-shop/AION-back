// src/routes/modelsRoutes.js
const express = require("express");
const router = express.Router();
const {
  createModel,
  getModels,
  getModelById,
  updateModel,
  deleteModel,
} = require("../controllers/modelsController");

// Agar xohlasang auth middleware qo‘shsa bo‘ladi
// const auth = require("../middlewares/authMiddleware");

// CRUD endpoints
router.post("/", createModel);           // Yangi model qo‘shish
router.get("/", getModels);             // Barcha modellari olish
router.get("/:id", getModelById);       // Bitta model
router.put("/:id", updateModel);        // Update model
router.delete("/:id", deleteModel);     // Delete model

module.exports = router;
