const express = require("express");
const router = express.Router();
const bannerController = require("../controllers/bannerController");

// Endpoints
router.post("/add", bannerController.addBanner);
router.get("/", bannerController.getBanners);
router.delete("/:id", bannerController.deleteBanner); // single delete
router.delete("/delete-all", bannerController.deleteAllBanners);

module.exports = router;
