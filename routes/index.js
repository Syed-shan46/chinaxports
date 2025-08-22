var express = require('express');
const { getAllProducts, getHandpickedProducts } = require('../controllers/productsController');
var router = express.Router();

/* GET home page. */
router.get('/', getAllProducts);

router.get('/handpicked-products', getHandpickedProducts);

router.get('/about-us', (req, res) => {
    res.render('user/about-us', { title: 'About Us' });
});

module.exports = router;
