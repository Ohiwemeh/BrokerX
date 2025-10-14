// server/routes/admin.routes.js

const router = require('express').Router();
const User = require('../models/user.model');
const Transaction = require('../models/transaction.model');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');
const NotificationService = require('../services/notificationService');

// Apply authentication and admin check to all routes
router.use(verifyToken);
router.use(isAdmin);

// @route   GET /api/admin/users
// @desc    Get all users (admin only)
router.get('/users', async (req, res) => {
  try {
    const { search, status, page = 1, limit = 20 } = req.query;

    // Build query
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    if (status && status !== 'All') {
      query.accountStatus = status;
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.json({
      users,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/users/:id
// @desc    Get single user details (admin only)
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user transactions
    const transactions = await Transaction.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      user,
      transactions
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/admin/users/:id/verify
// @desc    Verify user account (admin only)
router.put('/users/:id/verify', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.accountStatus = 'Verified';
    user.isTradingAccountActivated = true;
    await user.save();

    // Send notification to user
    await NotificationService.notifyUserVerified(user);

    res.json({
      message: 'User verified successfully',
      user: await User.findById(user._id).select('-password')
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/admin/users/:id/reject
// @desc    Reject user account (admin only)
router.put('/users/:id/reject', async (req, res) => {
  try {
    const { reason } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.accountStatus = 'Rejected';
    await user.save();

    // Send notification to user with reason
    await NotificationService.notifyUserRejected(user, reason || 'Please contact support for more information.');

    res.json({
      message: 'User rejected',
      user: await User.findById(user._id).select('-password')
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/admin/users/:id/add-funds
// @desc    Add funds to user account (admin only)
router.post('/users/:id/add-funds', async (req, res) => {
  try {
    const { amount, description } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user is verified
    if (user.accountStatus !== 'Verified') {
      return res.status(400).json({ message: 'User must be verified before adding funds' });
    }

    // Update user balance
    user.balance += parseFloat(amount);
    user.totalDeposit += parseFloat(amount);
    await user.save();

    // Create transaction record
    const transactionId = `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`;
    
    const transaction = new Transaction({
      userId: user._id,
      transactionId,
      type: 'Deposit',
      method: 'Internal',
      amount: parseFloat(amount),
      status: 'Completed',
      description: description || 'Admin deposit',
      adminNotes: `Added by admin ${req.user.name}`
    });

    await transaction.save();

    res.json({
      message: 'Funds added successfully',
      user: await User.findById(user._id).select('-password'),
      transaction
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/admin/users/:id/send-email
// @desc    Send email to user (admin only)
router.post('/users/:id/send-email', async (req, res) => {
  try {
    const { subject, message } = req.body;

    if (!subject || !message) {
      return res.status(400).json({ message: 'Subject and message are required' });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // TODO: Implement actual email sending logic here
    // For now, just log it
    console.log(`Email to ${user.email}:`, { subject, message });

    res.json({
      message: 'Email sent successfully',
      recipient: user.email
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete user (admin only)
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete user's transactions
    await Transaction.deleteMany({ userId: user._id });

    // Delete user
    await User.findByIdAndDelete(req.params.id);

    res.json({ message: 'User deleted successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/admin/transactions/:id/update-status
// @desc    Update transaction status (admin only)
router.put('/transactions/:id/update-status', async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !['Pending', 'Completed', 'Failed', 'Processing'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    const oldStatus = transaction.status;
    transaction.status = status;

    // If completing a deposit, update user balance
    if (status === 'Completed' && oldStatus !== 'Completed' && transaction.type === 'Deposit') {
      const user = await User.findById(transaction.userId);
      user.balance += transaction.amount;
      user.totalDeposit += transaction.amount;
      await user.save();
    }

    // If completing a withdrawal, update user balance
    if (status === 'Completed' && oldStatus !== 'Completed' && transaction.type === 'Withdrawal') {
      const user = await User.findById(transaction.userId);
      user.balance -= transaction.amount;
      user.totalWithdrawal += transaction.amount;
      await user.save();
    }

    await transaction.save();

    res.json({
      message: 'Transaction status updated successfully',
      transaction
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/stats
// @desc    Get admin dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const verifiedUsers = await User.countDocuments({ accountStatus: 'Verified' });
    const pendingUsers = await User.countDocuments({ accountStatus: 'Pending' });
    
    const totalTransactions = await Transaction.countDocuments();
    const pendingTransactions = await Transaction.countDocuments({ status: 'Pending' });

    // Calculate total deposits and withdrawals
    const deposits = await Transaction.aggregate([
      { $match: { type: 'Deposit', status: 'Completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const withdrawals = await Transaction.aggregate([
      { $match: { type: 'Withdrawal', status: 'Completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    res.json({
      users: {
        total: totalUsers,
        verified: verifiedUsers,
        pending: pendingUsers
      },
      transactions: {
        total: totalTransactions,
        pending: pendingTransactions
      },
      financials: {
        totalDeposits: deposits[0]?.total || 0,
        totalWithdrawals: withdrawals[0]?.total || 0
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
