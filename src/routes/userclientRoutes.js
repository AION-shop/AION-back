const express = require("express");
const {
  registerClient,
  loginClient,
  getAllClients,
  getClientById,
  updateClient,
  deleteClient,
} = require("../controllers/user.controller"); // CommonJS require

const router = express.Router();

// Auth
router.post("/register", registerClient);
router.post("/login", loginClient);

// CRUD
router.get("/", getAllClients);
router.get("/:id", getClientById);
router.put("/:id", updateClient);
router.delete("/:id", deleteClient);

module.exports = router;
