const express = require('express');
const router = express.Router();
const { getComments, postComment, deleteComment , getCommentsFromDB ,getCommentsFromFile } = require('../Controller/commentController');
const authenticateToken = require('../Middleware/auth');

router.get('/:page', authenticateToken , getComments);
router.post('/add', authenticateToken, postComment);
router.delete('/delete/:commentId', authenticateToken, deleteComment);


router.get('/db', getCommentsFromDB);
router.get('/file/:page', getCommentsFromFile);

module.exports = router;