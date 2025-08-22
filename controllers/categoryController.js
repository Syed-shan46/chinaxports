const Category = require("../models/categoryModel");

// GET all categories
exports.getCategories = async function (req, res) {
    try {
        const categories = await Category.find().sort({ createdAt: -1 });
        res.status(200).json(categories);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch categories" });
    }
};

// Render the category upload page
exports.renderCategoryUpload = async function (req, res) {
    res.render('admin/upload-category', { title: 'Add New Category' });
}


// Add a new category
exports.uploadCategory = async function (req, res) {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ error: "Name is required" });

        const exists = await Category.findOne({ name });
        if (exists) {
            return res.render('admin/upload-category', { error: "Category already exists!" });
        }
        const category = new Category({ name });
        await category.save();
        res.render('admin/upload-category', { success: 'Category uploaded successfully!' });
    } catch (err) {
        res.json({ status: "error", message: "Server error. Please try again." });
    }
};

// Render the manage categories page
exports.manageCategories = async function (req, res) {
    const categories = await Category.find().sort({ name: 1 });
    res.render('admin/manage-categories', { categories }); // Ensure template name matches
}

// Delete a category
exports.deleteCategory = async function (req, res) {
    try {
        const { id } = req.params;
        const deleted = await Category.findByIdAndDelete(id);
        if (deleted) {
            res.json({ status: 'success', message: 'Category deleted.' });
        } else {
            res.json({ status: 'error', message: 'Category not found.' });
        }
    } catch (error) {
        res.json({ status: 'error', message: 'Server error: Could not delete.' });
    }
}


