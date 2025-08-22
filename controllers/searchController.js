const Product = require('../models/productModel');
const Category = require('../models/categoryModel');

exports.searchAll = async function(req, res) {
  const query = req.query.q ? req.query.q.trim() : '';
  if (!query) return res.json({ products: [], categories: [] });

  try {
    const products = await Product.find({
      productName: { $regex: query, $options: 'i' }
    }).limit(5).select('productName imageUrl _id');

    const categories = await Category.find({
      name: { $regex: query, $options: 'i' }
    }).limit(3).select('name _id');

    res.json({ products, categories });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
