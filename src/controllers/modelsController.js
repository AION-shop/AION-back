// src/controllers/modelsController.js
const CarModel = require("../models/models");

// Create yangi model
exports.createModel = async (req, res) => {
  try {
    const { name, price, img, description } = req.body;
    if (!name || !price || !img) {
      return res.status(400).json({ success: false, message: "Name, price va img kerak" });
    }

    const model = await CarModel.create({ name, price, img, description });
    res.status(201).json({ success: true, data: model });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server xatosi!" });
  }
};

// Get barcha modellari
exports.getModels = async (req, res) => {
  try {
    const models = await CarModel.find().sort({ createdAt: -1 });
    res.json({ success: true, data: models });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server xatosi!" });
  }
};

// Get bitta model by id
exports.getModelById = async (req, res) => {
  try {
    const model = await CarModel.findById(req.params.id);
    if (!model) return res.status(404).json({ success: false, message: "Model topilmadi" });
    res.json({ success: true, data: model });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server xatosi!" });
  }
};

// Update model
exports.updateModel = async (req, res) => {
  try {
    const { name, price, img, description } = req.body;
    const model = await CarModel.findByIdAndUpdate(
      req.params.id,
      { name, price, img, description },
      { new: true }
    );
    if (!model) return res.status(404).json({ success: false, message: "Model topilmadi" });
    res.json({ success: true, data: model });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server xatosi!" });
  }
};

// Delete model
exports.deleteModel = async (req, res) => {
  try {
    const model = await CarModel.findByIdAndDelete(req.params.id);
    if (!model) return res.status(404).json({ success: false, message: "Model topilmadi" });
    res.json({ success: true, message: "Model o‘chirildi" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server xatosi!" });
  }
};
