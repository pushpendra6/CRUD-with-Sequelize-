const express = require('express');
const router = express.Router();
const { getComments, getCommentsFromDB } = require('../Controller/commentController');

router
    .route('/:page')
    .get(getComments);

router
    .route('/db/:page')
    .get(getCommentsFromDB);

module.exports = router;