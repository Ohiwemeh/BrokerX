// server/routes/profile.routes.js

const router = require('express').Router();
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const { verifyToken } = require('../middleware/auth.middleware');
const multer = require('multer');

// Configure multer to store files in memory (not disk)
const storage = multer.memoryStorage();

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|pdf/;
    const mimetype = filetypes.test(file.mimetype);
    
    if (mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only images and PDFs are allowed'));
    }
  }
});

// @route   GET /api/profile
// @desc    Get user profile
router.get('/', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/profile
// @desc    Update user profile
router.put('/', verifyToken, async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      dob,
      address,
      city,
      zipCode,
      phoneNumber
    } = req.body;

    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields
    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (dob !== undefined) user.dob = dob;
    if (address !== undefined) user.address = address;
    if (city !== undefined) user.city = city;
    if (zipCode !== undefined) user.zipCode = zipCode;
    if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;

    // Check if profile is complete
    if (firstName && lastName && dob && address && city && zipCode) {
      user.isProfileComplete = true;
    }

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: await User.findById(user._id).select('-password')
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/profile/upload-profile-image
// @desc    Upload profile image (stores as base64 in MongoDB)
router.post('/upload-profile-image', verifyToken, upload.single('profileImage'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Convert image buffer to base64
    const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    
    user.profileImageUrl = base64Image;
    await user.save();

    res.json({
      message: 'Profile image uploaded successfully',
      imageUrl: user.profileImageUrl
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/profile/upload-id
// @desc    Upload ID documents (stores as base64 in MongoDB)
router.post('/upload-id', verifyToken, upload.fields([
  { name: 'idFront', maxCount: 1 },
  { name: 'idBack', maxCount: 1 }
]), async (req, res) => {
  try {
    if (!req.files || (!req.files.idFront && !req.files.idBack)) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (req.files.idFront) {
      const idFrontBuffer = req.files.idFront[0].buffer;
      const idFrontMimetype = req.files.idFront[0].mimetype;
      user.idFrontUrl = `data:${idFrontMimetype};base64,${idFrontBuffer.toString('base64')}`;
    }
    
    if (req.files.idBack) {
      const idBackBuffer = req.files.idBack[0].buffer;
      const idBackMimetype = req.files.idBack[0].mimetype;
      user.idBackUrl = `data:${idBackMimetype};base64,${idBackBuffer.toString('base64')}`;
    }

    await user.save();

    res.json({
      message: 'ID documents uploaded successfully',
      idFrontUrl: user.idFrontUrl,
      idBackUrl: user.idBackUrl
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/profile/change-password
// @desc    Change user password
router.put('/change-password', verifyToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Please provide all fields' });
    }

    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    res.json({ message: 'Password changed successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/profile/toggle-2fa
// @desc    Toggle two-factor authentication
router.put('/toggle-2fa', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.twoFactorEnabled = !user.twoFactorEnabled;
    await user.save();

    res.json({
      message: `Two-factor authentication ${user.twoFactorEnabled ? 'enabled' : 'disabled'}`,
      twoFactorEnabled: user.twoFactorEnabled
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
