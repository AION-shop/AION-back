const express = require("express");
const router = express.Router();
const locationController = require("../controllers/locationController");

// CRUD и weather
router.post("/", locationController.createLocation);
router.get("/", locationController.getLocations);
router.get("/:id/weather", locationController.getWeather);
router.put("/:id", locationController.updateLocation);
router.delete("/:id", locationController.deleteLocation);

module.exports = router;
