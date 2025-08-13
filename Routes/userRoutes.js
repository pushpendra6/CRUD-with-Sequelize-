const express = require('express')
const { getUserWithDeleted,getUser,addUser, deleteUser, updateUser, getUserById, login, getAlluserWithPost } =  require('../Controller/userController')
const router = express.Router();
const authenticateToken = require('../Middleware/auth');

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
    .route('/add')
    .post(addUser)

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

router.patch('/updateUser',authenticateToken,updateUser)   

module.exports = router;