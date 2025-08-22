const express = require("express");
const { getCategories, addCategory } = require("../controllers/categoryController");

const router = express.Router();

// List all categories
router.get("/", getCategories);
// Add category
router.post("/add", addCategory);

module.exports = router;
