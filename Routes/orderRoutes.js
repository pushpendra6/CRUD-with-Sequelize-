const express = require('express');
const router = express.Router();
const { getOrders,createOrder} = require('../Controller/orderController');

// Create a new order for a customer
router.post('/',createOrder);

// Get all orders 
router.get('/', getOrders);

module.exports = router;
