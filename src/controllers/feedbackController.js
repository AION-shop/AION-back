const Feedback = require("../models/feedbackModel");

// Yangi feedback yaratish
exports.createFeedback = async (req, res) => {
  try {
    const { name, comment, rating } = req.body;
    if (!name || !comment || !rating) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newFeedback = await Feedback.create({ name, comment, rating });
    res.status(201).json(newFeedback);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Barcha feedbacklarni olish
exports.getFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Feedbackni o'chirish
exports.deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const feedback = await Feedback.findByIdAndDelete(id);
    if (!feedback) return res.status(404).json({ message: "Feedback not found" });
    res.status(200).json({ message: "Feedback deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
