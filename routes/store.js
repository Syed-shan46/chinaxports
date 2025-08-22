var express = require('express');
const { storePage } = require('../controllers/storeController');
var router = express.Router();

router.get('/', storePage);
;

module.exports = router;
