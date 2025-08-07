const express = require('express');
const router = express.Router();
const { getAllPosts, createPost } = require('../Controller/postController');

router
    .route('/allpost')
    .get(getAllPosts);

router
    .route('/addpost')
    .post(createPost)

    
module.exports = router;