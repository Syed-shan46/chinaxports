const Product = require('../models/productModel');
const Category = require('../models/categoryModel');

exports.storePage = async (req, res) => {
    try {
        const categoryId = req.query.category || ''; // Selected category id or empty for all
        const page = parseInt(req.query.page) || 1;
        const limit = 4; // Product per page
        const skip = (page - 1) * limit;

        // Fetch all categories for sidebar
        const categories = await Category.find().sort({ name: 1 });

        // Build product query
        let productQuery = {};
        if (categoryId) {
            productQuery.category = categoryId;
        }

        // Count total products matching query (for pagination)
        const totalCount = await Product.countDocuments(productQuery);

        // Get products for page with category filter
        const products = await Product.find(productQuery)
            .populate('category', 'name')
            .skip(skip)
            .limit(limit)
            .sort({ productName: 1 });

        const totalPages = Math.ceil(totalCount / limit);

        res.render('user/store', {
            categories,
            products,
            selectedCategory: categoryId,
            currentPage: page,
            totalPages,
            title: 'Store'
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};



