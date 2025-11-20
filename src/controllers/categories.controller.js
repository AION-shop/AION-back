const Category = require("../models/category.model");

// CREATE
exports.createCategory = async (req, res) => {
  try {
    const { name, model, icon, slug, url } = req.body;

    if (!name || !model || !icon || !slug)
      return res.status(400).json({ message: "All fields are required" });

    const exist = await Category.findOne({ slug });
    if (exist) return res.status(409).json({ message: "Slug already exists" });

    const category = await Category.create({ name, model, icon, slug, url });

    return res.status(201).json({
      message: "Category created successfully",
      category,
    });
  } catch (e) {
    console.error("CREATE CATEGORY ERROR:", e);
    return res.status(500).json({ error: "Server error | createCategory" });
  }
};

// GET ALL
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    return res.status(200).json(categories);
  } catch (e) {
    console.error("GET CATEGORIES ERROR:", e);
    return res.status(500).json({ error: "Server error | getCategories" });
  }
};

// UPDATE
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, model, icon, slug, url } = req.body;

    const updated = await Category.findByIdAndUpdate(
      id,
      { name, model, icon, slug, url },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Category not found" });

    return res.status(200).json({
      message: "Category updated successfully",
      updated,
    });
  } catch (e) {
    console.error("UPDATE CATEGORY ERROR:", e);
    return res.status(500).json({ error: "Server error | updateCategory" });
  }
};

// DELETE ONE
exports.deleteCategory = async (req, res) => {
  try {
    const removed = await Category.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ message: "Category not found" });

    return res.status(200).json({ message: "Category deleted", removed });
  } catch (e) {
    console.error("DELETE CATEGORY ERROR:", e);
    return res.status(500).json({ error: "Server error | deleteCategory" });
  }
};

// DELETE ALL
exports.deleteAllCategories = async (req, res) => {
  try {
    await Category.deleteMany({});
    return res.status(200).json({ message: "All categories deleted" });
  } catch (e) {
    console.error("DELETE ALL CATEGORIES ERROR:", e);
    return res.status(500).json({ error: "Server error | deleteAllCategories" });
  }
};
