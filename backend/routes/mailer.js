const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

// Create Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});

// Middleware to validate email request body
const validateEmailRequest = (req, res, next) => {
    const { name, email, message } = req.body;

    // Check if all required fields are present and not empty
    if (!name || !email || !message) {
        return res.status(400).json({ 
            error: 'Missing required fields', 
            details: 'Name, email, and message are required' 
        });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ 
            error: 'Invalid email format' 
        });
    }

    next();
};

router.post('/', validateEmailRequest, (req, res) => {
    const { name, email, message } = req.body;

    const mailOptions = {
        from: process.env.EMAIL, // Use your verified email
        to: 'karankamath2003@gmail.com',
        replyTo: email, // Set reply-to to the sender's email
        subject: `Message from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Email sending error:', error);
            return res.status(500).json({ 
                error: 'Error sending email', 
                details: error.message 
            });
        }
        
        res.status(200).json({ 
            message: 'Email sent successfully',
            info: info.response 
        });
    });
});

module.exports = router;