const Category = require('../models/categoryModel'); // CommonJS style

exports.renderUploadProduct = async function (req, res) {
  try {
    const categories = await Category.find().sort({ name: 1 }); // alphabetically
    res.render('admin/upload-product', { categories }); // pass to template
  } catch (error) {
    res.status(500).send('Error loading categories');
  }
};

exports.passwordSubmit = (req, res) => {
  const { password } = req.body;
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

  if (password === ADMIN_PASSWORD) {
    req.session.adminAuthenticated = true;
    res.redirect('/admin/manage-products'); // Redirect to dashboard
  } else {
    res.render('admin/admin-password', { error: 'Incorrect password. Try again.' });
  }
};

