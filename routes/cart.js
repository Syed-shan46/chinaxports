var express = require('express');
const { getCart, addToCart, increaseQty, decreaseQty, removeItem } = require('../controllers/cartController');
var router = express.Router();

router.get('/',getCart);

router.post('/add', addToCart);

router.post("/increase/:id", increaseQty);

router.post("/decrease/:id", decreaseQty);

router.post("/remove/:id", removeItem);

module.exports = router;