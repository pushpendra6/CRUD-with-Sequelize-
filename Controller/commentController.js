const Comments = require('../Models/commentModel');
const fs = require('fs');
const path = require('path');
require('dotenv').config();


//fetching comment from static file comments.json
const getComments = async (req, res) => {
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
    const page = parseInt(req.params.page) || 1;
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
            attributes: ['id', 'name', 'email', 'body'],
            limit: limit,
            offset: offset,
            raw: true 
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

module.exports = {
    getComments,
    getCommentsFromDB
};