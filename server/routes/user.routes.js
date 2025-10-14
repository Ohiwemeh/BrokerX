// backend/routes/user.routes.js

const router = require('express').Router();
const User = require('../models/user.model'); // Import the User model
const bcrypt = require('bcryptjs'); // Import bcrypt for password hashing
const jwt = require('jsonwebtoken'); // Import jsonwebtoken for token generation



// @route   POST /api/users/signup
// @desc    Register a new user
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, country, currency } = req.body;

    // 1. Validation: Check if all fields are provided
    if (!name || !email || !password || !country || !currency) {
      return res.status(400).json({ message: 'Please enter all fields' });
    }

    // 2. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // 3. Hash the password for security
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Create a new user instance
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      country,
      currency,
    });

    // 5. Save the user to the database
    const savedUser = await newUser.save();

    // 6. Send a success response (don't send the password back!)
    res.status(201).json({
      id: savedUser.id,
      name: savedUser.name,
      email: savedUser.email,
      role: savedUser.role,
      country: savedUser.country,
        balance: savedUser.balance,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;