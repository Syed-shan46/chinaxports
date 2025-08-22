var express = require('express');
const { getProductDetail, getHandpickedProducts } = require('../controllers/productsController');
var router = express.Router();

// Product detail route
router.get("/product-details/:id", getProductDetail);



module.exports = router;