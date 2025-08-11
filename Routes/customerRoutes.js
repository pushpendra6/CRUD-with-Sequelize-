const express = require('express');
const router = express.Router();
const { getCustomerWithDeleted,getCustmerOnly,createCustomer, createCustomerRaw, 
        getCustomersLeft,getCustomersWithInnerJoin, deleteCustomer,
        createCustomerWithCartAndOrders,
        getCustomerWithCartAndOrders } = require('../Controller/customerController');


router
    .route('/left')
    .get(getCustomersLeft);

router
    .route('/innerjoin')
    .get(getCustomersWithInnerJoin);

router
    .route('/')
    .post(createCustomer);

router
    .route('/raw')
    .post(createCustomerRaw);

router 
    .route('/:id')
    .delete(deleteCustomer);


//Paranoid Rutes
router
    .route('/')
    .get(getCustmerOnly);

router
    .route('/getAll')
    .get(getCustomerWithDeleted);


//association routes
router
    .route('/association-get/:id')
    .get(getCustomerWithCartAndOrders);

router
    .route('/association-post')
    .post(createCustomerWithCartAndOrders);

module.exports = router;