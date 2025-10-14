// server/routes/email.routes.js

const router = require('express').Router();
const User = require('../models/user.model');
const EmailService = require('../services/emailService');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');

// Apply authentication and admin check to all routes
router.use(verifyToken);
router.use(isAdmin);

// @route   POST /api/email/send
// @desc    Send custom email to user (admin only)
router.post('/send', async (req, res) => {
  try {
    const { userId, subject, message } = req.body;

    // Validation
    if (!userId || !subject || !message) {
      return res.status(400).json({ message: 'Please provide userId, subject, and message' });
    }

    // Get user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Send email
    await EmailService.sendCustomEmail(user, subject, message);

    res.json({
      message: 'Email sent successfully',
      sentTo: user.email
    });

  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({ 
      message: 'Failed to send email', 
      error: error.message 
    });
  }
});

// @route   POST /api/email/send-verification
// @desc    Send verification email to user (admin only)
router.post('/send-verification', async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await EmailService.sendVerificationEmail(user);

    res.json({
      message: 'Verification email sent successfully',
      sentTo: user.email
    });

  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({ 
      message: 'Failed to send email', 
      error: error.message 
    });
  }
});

// @route   POST /api/email/send-rejection
// @desc    Send rejection email to user (admin only)
router.post('/send-rejection', async (req, res) => {
  try {
    const { userId, reason } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await EmailService.sendRejectionEmail(user, reason);

    res.json({
      message: 'Rejection email sent successfully',
      sentTo: user.email
    });

  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({ 
      message: 'Failed to send email', 
      error: error.message 
    });
  }
});

// @route   POST /api/email/test
// @desc    Test email configuration (admin only)
router.post('/test', async (req, res) => {
  try {
    const adminEmail = req.user.email;

    await EmailService.sendEmail(
      adminEmail,
      'Test Email - BrokerX',
      '<h1>Email Configuration Test</h1><p>If you received this email, your email configuration is working correctly!</p>',
      'Email Configuration Test - If you received this email, your email configuration is working correctly!'
    );

    res.json({
      message: 'Test email sent successfully',
      sentTo: adminEmail
    });

  } catch (error) {
    console.error('Email test error:', error);
    res.status(500).json({ 
      message: 'Email test failed', 
      error: error.message 
    });
  }
});

module.exports = router;
