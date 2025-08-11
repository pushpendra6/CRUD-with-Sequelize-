const express = require('express')
const { getUserWithDeleted,getUser,postUser, deleteUser, updateUser, getUserById, login, getAlluserWithPost } =  require('../Controller/userController')
const router = express.Router()

router
    .route('/getUser')
    .get(getUser);

router
    .route('/getUserAll')
    .get(getUserWithDeleted);

router
    .route('/getUserById/:id')
    .get(getUserById);

router
    .route('/postUser')
    .post(postUser)

//login route
router
    .route('/login')
    .post(login)

// get all the user wth post
router
    .route('/post').get(getAlluserWithPost)

router
    .route('/deleteUser/:id')
    .delete(deleteUser)

router
    .route('/updateUser')
    .patch(updateUser)

module.exports = router;