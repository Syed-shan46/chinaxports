const express = require("express");
const { renderUploadProduct, passwordSubmit } = require("../controllers/adminController");
const upload = require("../middlewares/upload");
const { renderCategoryUpload, uploadCategory, manageCategories, deleteCategory } = require("../controllers/categoryController");
const { uploadProduct, manageProducts, deleteProduct, renderEditProduct, postEditProduct } = require("../controllers/productsController");
const ADMIN_PASSWORD = 'YourSecretPassword'; // Use env variable in real app

const router = express.Router();

// Show password form
router.get('/admin-password', (req, res) => {
    res.render('admin/admin-password', { error: null });
});

// Handle password submission
router.post('/admin-password-submit', passwordSubmit);

// upload product page
router.get("/upload-product", renderUploadProduct);

// Upload product
router.post('/upload-product', upload.array('imageUrl', 6), uploadProduct);

// Manage Products
router.get('/manage-products/', manageProducts);

// Delete Products
router.delete('/delete-product/:id', deleteProduct);

// Show edit Product page
router.get('/edit-product/:id', renderEditProduct);

// Handle edit submit
router.post('/edit-product/:id', postEditProduct);


// Category management route
// Render category upload page
router.get('/upload-category', renderCategoryUpload);

// Add a new category
router.post("/upload-category", uploadCategory);

router.get('/categories', manageCategories);

router.delete('/delete-category/:id', deleteCategory);

module.exports = router;
