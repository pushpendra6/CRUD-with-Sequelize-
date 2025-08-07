const express = require('express');
const router = express.Router();
const { createCart,getCarts } = require('../Controller/cartController');

router
    .route('/')
    .get(getCarts);

router
    .route('/')
    .post(createCart);

module.exports = router;