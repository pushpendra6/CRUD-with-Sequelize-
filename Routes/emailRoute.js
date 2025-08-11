const express = require('express');
const router = express.Router();
const { sendEmail, imageUpload} = require('../Controller/emailController');


router.post('/', sendEmail);
router.post('/image', imageUpload);

module.exports = router;