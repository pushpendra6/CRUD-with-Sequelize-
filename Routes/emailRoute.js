const express = require('express');
const router = express.Router();
const { sendEmail, imageUpload} = require('../Controller/emailController');
const authenticateToken = require('../Middleware/auth');


router.post('/',authenticateToken, sendEmail);
router.post('/image', imageUpload);

module.exports = router;