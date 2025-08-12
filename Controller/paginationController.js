const Comments = require('../Models/paginationModel');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const LIMIT =15;

//fetching comment from static file comments.json
const getComments = async (req, res) => {
    const page = parseInt(req.params.page) || 1;
    if (page < 1) {
        return res.status(400).json({ error: 'Page number must be 1 or greater.' });
    }

    const commentsPath = path.join(__dirname, '../comments.json');
    console.log(commentsPath);
    const comments = JSON.parse(fs.readFileSync(commentsPath, 'utf8'));

    const startIndex = (page - 1) * LIMIT;
    const endIndex = page * LIMIT;

    // Slice the data for the current page
    const paginatedData = comments.slice(startIndex, endIndex);

    if (paginatedData.length === 0) {
        return res.status(404).json({ error: 'No comments found for this page.' });
    }
    // Send paginated result 
    res.json({
        page: page,
        limit: LIMIT,
        totalComments: comments.length,
        totalPages: Math.ceil(comments.length / LIMIT),
        data: paginatedData
    });
}


//get comments from database
const getCommentsFromDB = async (req, res) => {
    const page = parseInt(req.params.page) || 1;
    if (page < 1) {
        return res.status(400).json({ error: 'Page number must be 1 or greater.' });
    }

    try {
        const page = parseInt(req.params.page) || 1;
        if (page < 1) {
            return res.status(400).json({ error: "Page number must be 1 or greater." });
        }

        const offset = (page - 1) * LIMIT;

        const { count, rows } = await Comments.findAndCountAll({
            attributes: ['id', 'name', 'email', 'body'],
            limit: LIMIT,
            offset: offset,
            raw: true 
        });

        if (rows.length === 0) {
            return res.status(404).json({ error: "No comments found for this page." });
        }

        res.json({
            page,
            limit: LIMIT,
            totalComments: count,
            totalPages: Math.ceil(count / LIMIT),
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