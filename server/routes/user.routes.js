// backend/routes/user.routes.js

const router = require('express').Router();
const User = require('../models/user.model'); // Import the User model
const bcrypt = require('bcryptjs'); // Import bcrypt for password hashing
const jwt = require('jsonwebtoken'); // Import jsonwebtoken for token generation
const NotificationService = require('../services/notificationService');



// @route   POST /api/users/signup
// @desc    Register a new user
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, country, currency, phoneNumber } = req.body;

    // 1. Validation: Check if all fields are provided
    if (!name || !email || !password || !country) {
      return res.status(400).json({ message: 'Please enter all required fields' });
    }

    // 2. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // 3. Hash the password for security
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Generate wallet ID and trading account ID
    const walletId = `W${Date.now()}${Math.floor(Math.random() * 1000)}USD`;
    const tradingAccountId = `#${Math.floor(100000000 + Math.random() * 900000000)}`;

    // 5. Create a new user instance
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      country,
      currency: currency || 'USD',
      phoneNumber,
      walletId,
      tradingAccountId,
    });

    // 6. Save the user to the database
    const savedUser = await newUser.save();

    // 6.5. Notify admins of new user registration
    try {
      const notifications = await NotificationService.notifyUserRegistered(savedUser);
      console.log('✅ Admin notifications created:', notifications.length);
    } catch (notifError) {
      console.error('❌ Failed to create admin notifications:', notifError);
    }

    // 6.6. Emit real-time notification to admin via Socket.IO
    const io = req.app.get('io');
    if (io) {
      const eventData = {
        userId: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        country: savedUser.country,
        timestamp: new Date(),
        message: `New user ${savedUser.name} has signed up!`
      };
      io.to('admin-room').emit('new-user-signup', eventData);
      console.log('✅ Socket event emitted to admin-room:', eventData);
    } else {
      console.log('❌ Socket.IO not available');
    }

    // 7. Generate JWT token
    const token = jwt.sign(
      { id: savedUser._id, email: savedUser.email, role: savedUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // 8. Send a success response (don't send the password back!)
    res.status(201).json({
      token,
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role,
        country: savedUser.country,
        balance: savedUser.balance,
        walletId: savedUser.walletId,
        accountStatus: savedUser.accountStatus,
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/users/login
// @desc    Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Please enter all fields' });
    }

    // 2. Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // 3. Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // 4. Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // 5. Send response
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        country: user.country,
        balance: user.balance,
        profit: user.profit,
        totalDeposit: user.totalDeposit,
        totalWithdrawal: user.totalWithdrawal,
        walletId: user.walletId,
        accountStatus: user.accountStatus,
        isProfileComplete: user.isProfileComplete,
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;