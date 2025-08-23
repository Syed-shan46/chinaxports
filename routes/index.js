var express = require('express');
const { getAllProducts, getHandpickedProducts } = require('../controllers/productsController');
var router = express.Router();

/* GET home page. */
router.get('/', getAllProducts);

router.get('/handpicked-products', getHandpickedProducts);

router.get('/about-us', (req, res) => {
    res.render('user/about-us', { title: 'About Us' });
});

router.get('/wechat-qr', (req, res) => {
    res.render('user/wechat-qr', { title: 'WeChat QR Code' });
});

router.get('/contact-us', (req, res) => {
    res.render('user/contact-us');
});

module.exports = router;
