const express = require('express');
const router = express.Router();
const { createCustomer, getCustomers } = require('../Controller/customerController');

router
    .route('/')
    .get(getCustomers);

router
    .route('/')
    .post(createCustomer);

module.exports = router;