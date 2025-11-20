const express = require("express");
const categoryController = require("../controllers/categories.controller.js");

const router = express.Router();

router.post("/add", categoryController.createCategory);      
router.get("/", categoryController.getCategories);           
router.put("/:id", categoryController.updateCategory);       
router.delete("/:id", categoryController.deleteCategory);    
router.delete("/delete-all", categoryController.deleteAllCategories);

module.exports = router;
