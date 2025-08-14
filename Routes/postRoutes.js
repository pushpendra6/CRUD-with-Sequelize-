const express = require('express');
const router = express.Router();
const { getAllPosts, createPost,userPosts,deletePost, updatePost } = require('../Controller/postController');
const authMiddleware = require('../Middleware/auth');

//get all posts
router.get('/allpost',getAllPosts);

//get specific user posts
router.get('/userpost/:page', authMiddleware, userPosts);

//delete specific user posts
router.delete('/delete/:id', authMiddleware, deletePost);

// Create a new post
router.post('/addpost', authMiddleware, createPost);

//update specific user posts
router.patch('/updatepost', authMiddleware, updatePost)


    
module.exports = router;