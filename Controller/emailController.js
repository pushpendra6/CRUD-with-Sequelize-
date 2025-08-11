const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');
require('dotenv').config();
const multer = require('multer');

const sendEmail = async (req, res) => {
    try {
        const toEmail  = req.body;

        // Render EJS template to HTML string
        const templatePath = path.join(__dirname, '../views/email.ejs');
        const html = await ejs.renderFile(templatePath, { name: 'User' }); // pass variables here

        // Create transporter using Gmail SMTP with your Gmail email & password
        const transporter = nodemailer.createTransport({
            service: 'gmail',
                auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,  
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: toEmail,
            subject: 'Test Email with EJS Template',
            html: html,
        };

        // Send mail
        await transporter.sendMail(mailOptions);
    
        res.status(200).json({ message: 'Email sent successfully' });
    } catch (err) {
        console.error('Error sending email:', err);
        res.status(500).json({ message: 'Failed to send email', error: err.message });
  }
}


//upload Photo 
const imageUpload = (req, res) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/'); 
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  });

  const upload = multer({ storage: storage });

  const uploadSingle = upload.single('myFile');
    //const upload = upload.array('myFile',5);
    //const uplaod = upload.fields([
    //    { name: 'avatar', maxCount: 1 },
    //    { name: 'gallery', maxCount: 8 }
      //      ]);

  uploadSingle(req, res, function (err) {
    if (err) {
      return res.status(400).send(`Upload error: ${err.message}`);
    }

    if (!req.file) {
      return res.status(400).send('Please upload a file!');
    }

    res.send(`File uploaded successfully! Filename: ${req.file.filename}`);
  });
};

module.exports = { sendEmail, imageUpload}