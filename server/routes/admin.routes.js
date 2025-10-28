// server/routes/admin.routes.js

const router = require('express').Router();
const User = require('../models/user.model');
const Transaction = require('../models/transaction.model');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');
const NotificationService = require('../services/notificationService');
const EmailService = require('../services/emailService');

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

    // Use lean() for better performance (returns plain JS objects)
    const users = await User.find(query)
      .select('name email accountStatus balance createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

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

    // Send verification email
    try {
      await EmailService.sendVerificationEmail(user);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
    }

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

    const rejectionReason = reason || 'Please contact support for more information.';

    // Send notification to user with reason
    await NotificationService.notifyUserRejected(user, rejectionReason);

    // Send rejection email
    try {
      await EmailService.sendRejectionEmail(user, rejectionReason);
    } catch (emailError) {
      console.error('Failed to send rejection email:', emailError);
    }

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

// @route   GET /api/admin/transactions
// @desc    Get all transactions (admin only)
router.get('/transactions', async (req, res) => {
  try {
    const { status, type, page = 1, limit = 20 } = req.query;

    const query = {};
    if (status && status !== 'all') {
      query.status = status;
    }
    if (type && type !== 'all') {
      query.type = type;
    }

    const transactions = await Transaction.find(query)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Transaction.countDocuments(query);

    res.json({
      transactions,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit))
    });

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
    console.log('📝 Updating transaction:', req.params.id, 'to status:', status);

    if (!status || !['Pending', 'Completed', 'Failed', 'Processing'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const transaction = await Transaction.findById(req.params.id).populate('userId');

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    console.log('📦 Transaction found:', transaction.transactionId, 'Type:', transaction.type);

    const oldStatus = transaction.status;
    transaction.status = status;
    const user = transaction.userId;

    if (!user) {
      console.error('❌ User not found for transaction');
      return res.status(404).json({ message: 'User not found for this transaction' });
    }

    console.log('👤 User found:', user.name, user.email);

    // If completing a deposit, update user balance and profit
    if (status === 'Completed' && oldStatus !== 'Completed' && transaction.type === 'Deposit') {
      const amount = transaction.amount;
      user.balance += amount;
      user.totalDeposit += amount;
      // Calculate profit - Add 10% of deposit amount to profit
      user.profit += amount * 0.10;
      await user.save();

      // Notify user of deposit approval
      await NotificationService.notifyDepositApproved(user, transaction.amount, transaction.transactionId);

      // Send email notification
      try {
        await EmailService.sendDepositApprovedEmail(user, transaction.amount);
      } catch (emailError) {
        console.error('Failed to send deposit approval email:', emailError);
      }

      // Emit real-time notification to user
      const io = req.app.get('io');
      if (io) {
        io.to(`user-${user._id}`).emit('deposit-approved', {
          transactionId: transaction.transactionId,
          amount: transaction.amount,
          message: `Your deposit of $${transaction.amount.toLocaleString()} has been approved!`
        });
      }
    }

    // If completing a withdrawal, update user balance and profit
    if (status === 'Completed' && oldStatus !== 'Completed' && transaction.type === 'Withdrawal') {
      const amount = transaction.amount;
      user.balance -= amount;
      user.totalWithdrawal += amount;
      // Calculate profit reduction - Reduce profit proportionally
      const profitReductionRatio = amount / user.balance;
      user.profit = Math.max(0, user.profit - (user.profit * profitReductionRatio));
      await user.save();

      // Notify user of withdrawal approval
      await NotificationService.notifyWithdrawalApproved(user, transaction.amount, transaction.transactionId);

      // Emit real-time notification to user
      const io = req.app.get('io');
      if (io) {
        io.to(`user-${user._id}`).emit('withdrawal-approved', {
          transactionId: transaction.transactionId,
          amount: transaction.amount,
          message: `Your withdrawal of $${transaction.amount.toLocaleString()} has been approved!`
        });
      }
    }

    // If rejecting a transaction
    if (status === 'Failed' && oldStatus !== 'Failed') {
      // Notify user of rejection
      await NotificationService.notifyTransactionRejected(user, transaction.type, transaction.amount, transaction.transactionId);

      // Emit real-time notification to user
      const io = req.app.get('io');
      if (io) {
        io.to(`user-${user._id}`).emit('transaction-rejected', {
          transactionId: transaction.transactionId,
          type: transaction.type,
          amount: transaction.amount,
          message: `Your ${transaction.type.toLowerCase()} request of $${transaction.amount.toLocaleString()} has been rejected.`
        });
      }
    }

    await transaction.save();

    res.json({
      message: 'Transaction status updated successfully',
      transaction
    });

  } catch (error) {
    console.error('❌ Transaction update error:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// @route   POST /api/admin/users/:id/generate-withdrawal-code
// @desc    Generate withdrawal verification code for user
router.post('/users/:id/generate-withdrawal-code', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate random 8-character alphanumeric code
    const code = Math.random().toString(36).substring(2, 10).toUpperCase();
    
    // Set code expiry to 24 hours from now
    const expiry = new Date();
    expiry.setHours(expiry.getHours() + 24);

    user.withdrawalCode = code;
    user.withdrawalCodeExpiry = expiry;
    await user.save();

    res.json({
      message: 'Withdrawal code generated successfully',
      code,
      expiresAt: expiry,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
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
