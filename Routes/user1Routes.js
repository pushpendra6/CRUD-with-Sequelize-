const express = require('express')
const router = express.Router()
const { deleteUser1, getUser1, getUserWithDeleted1, postUser1 }  = require('../Controller/user1Controller')


router
    .route('/getUser')
    .get(getUser1);


router
    .route('/getUserAll')
    .get(getUserWithDeleted1);

router
    .route('/:id')
    .delete(deleteUser1);


router
    .route('/postUser')
    .post(postUser1)


module.exports = router;