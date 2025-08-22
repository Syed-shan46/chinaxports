const Category = require('../models/categoryModel');
const Product = require('../models/productModel');

module.exports = async function categoryMiddleware(req, res, next) {
    try {
        // Get all categories
        const categories = await Category.find().lean();

        // For each category, count products
        const categoriesWithCount = await Promise.all(
            categories.map(async (cat) => {
                const count = await Product.countDocuments({ category: cat._id });
                return { ...cat, productCount: count };
            })
        );

        res.locals.categories = categoriesWithCount;
        next();
    } catch (err) {
        next(err);
    }
};
