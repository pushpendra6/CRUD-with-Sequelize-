const Comments = require('../Models/commentModel');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const Post = require('../Models/postModel');
const { Op } = require('sequelize');



//fetching comment from static file comments.json
const getCommentsFromFile = async (req, res) => {
    const page = parseInt(req.params.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    if (page < 1) {
        return res.status(400).json({ error: 'Page number must be 1 or greater.' });
    }

    if (limit < 0) {
        limit = -(limit);
    }

    const commentsPath = path.join(__dirname, '../comments.json');
    console.log(commentsPath);
    const comments = JSON.parse(fs.readFileSync(commentsPath, 'utf8'));

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    // Slice the data for the current page
    const paginatedData = comments.slice(startIndex, endIndex);

    if (paginatedData.length === 0) {
        return res.status(404).json({ error: 'No comments found for this page.' });
    }        
    // Send paginated result 
    res.json({
        page: page,
        limit: limit,
        totalComments: comments.length,
        totalPages: Math.ceil(comments.length / limit),
        data: paginatedData
    });
}


//get comments from database
const getCommentsFromDB = async (req, res) => {
    console.log("in db")
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    if (page < 1) {
        return res.status(400).json({ error: 'Page number must be 1 or greater.' });
    }
    if (limit < 0) {
        limit = -(limit);
    }

    try {
        const page = parseInt(req.params.page) || 1;
        if (page < 1) {
            return res.status(400).json({ error: "Page number must be 1 or greater." });
        }

        const offset = (page - 1) * limit;

        const { count, rows } = await Comments.findAndCountAll({
            limit: limit,
            offset: offset,
        });

        if (rows.length === 0) {
            return res.status(404).json({ error: "No comments found for this page." });
        }

        res.json({
            page,
            limit: limit,
            totalComments: count,
            totalPages: Math.ceil(count / limit),
            data: rows
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }

}

//get comment of logged in user
const getComments = async (req, res) => {
    try {
        const userId = req.user.id;

        const page = parseInt(req.params.page) || 1; 
        const limit = 5; 
        const offset = (page - 1) * limit;
    
        // Find the user's post
        const post = await Post.findAll({ where: { userId } });
        if (!post) {
            return res.status(404).json({ error: 'No post found for this user.' });
        }

        const postIds = post.map(p => p.id);

        // Fetch comments for all these post IDs
        const { count, rows } = await Comments.findAndCountAll({
            where: { postId: { [Op.in]: postIds } },
            limit,
            offset
        });

        // console.log("Commenst Data:-",rows);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'No comments found for this page.' });
        }

        res.status(200).json({
            postId: post.id,
            currentPage: page,
            totalPages: Math.ceil(count / limit),
            totalComments: count,
            comments: rows
        });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching comments', details: error.message });
    }
};

//Add a comment to logged-in user's post
const postComment = async (req, res) => {
    try {
        const userId = req.user.id;
        const { firstName, email } = req.user; 
        const { body }  = req.body;

        // Find the user's post
        const post = await Post.findOne({ where: { userId } });
        if (!post) {
            return res.status(404).json({ error: 'No post found for this user.' });
        }

        console.log("Add comment for user :- ", firstName, email);
        // Create comment
        const newComment = await Comments.create({
            firstName,
            email,
            body,
            postId: post.id,
            userId: userId
        });

        res.status(201).json({ message: 'Comment added successfully', comment: newComment });
    } catch (error) {
        res.status(500).json({ error: 'Error adding comment', details: error.message });
    }
};


//delete comment of logged-in user
const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const comment = await Comments.findOne({
            where: { id: commentId }
        });

        if (!comment) {
            return res.status(404).json({ error: 'Comment not found for this post.' });
        }

        await comment.destroy();
        res.status(200).json({ message: 'Comment deleted successfully.' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting comment', details: error.message });
    }
};


module.exports = {
    getCommentsFromFile,
    getCommentsFromDB,
    getComments,
    postComment,
    deleteComment,
};