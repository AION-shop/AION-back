const express = require("express");
const router = express.Router();
const feedbackController = require("../controllers/feedbackController");

router.get("/", feedbackController.getFeedbacks);
router.post("/", feedbackController.createFeedback);
router.delete("/:id", feedbackController.deleteFeedback);
router.delete("/:id", feedbackController.deleteFeedback);


module.exports = router;
