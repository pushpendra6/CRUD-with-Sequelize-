const express = require('express');
const router = express.Router();
const { createCart,getCarts, createCartRaw } = require('../Controller/cartController');

router
    .route('/')
    .get(getCarts);

router
    .route('/')
    .post(createCart);

router
    .route('/raw')
    .post(createCartRaw);
module.exports = router;