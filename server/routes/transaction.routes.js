// server/routes/transaction.routes.js

const router = require('express').Router();
const Transaction = require('../models/transaction.model');
const User = require('../models/user.model');
const { verifyToken } = require('../middleware/auth.middleware');

// @route   GET /api/transactions
// @desc    Get user transactions with filters
router.get('/', verifyToken, async (req, res) => {
  try {
    const { type, method, status, startDate, endDate, page = 1, limit = 10 } = req.query;

    // Build query
    const query = { userId: req.user._id };

    if (type && type !== 'All') query.type = type;
    if (method && method !== 'All') query.method = method;
    if (status && status !== 'All') query.status = status;
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const transactions = await Transaction.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Transaction.countDocuments(query);

    res.json({
      transactions,
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

// @route   GET /api/transactions/:id
// @desc    Get single transaction
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json(transaction);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/transactions/deposit
// @desc    Create deposit transaction
router.post('/deposit', verifyToken, async (req, res) => {
  try {
    const { amount, method, currency } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    if (!method) {
      return res.status(400).json({ message: 'Payment method is required' });
    }

    // Generate transaction ID
    const transactionId = `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`;

    // Create transaction
    const transaction = new Transaction({
      userId: req.user._id,
      transactionId,
      type: 'Deposit',
      method,
      amount,
      currency: currency || 'USD',
      status: 'Pending',
      description: `Deposit via ${method}`
    });

    await transaction.save();

    res.status(201).json({
      message: 'Deposit request created successfully',
      transaction
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/transactions/withdrawal
// @desc    Create withdrawal transaction
router.post('/withdrawal', verifyToken, async (req, res) => {
  try {
    const { amount, method, currency } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    const user = await User.findById(req.user._id);

    // Check if user has sufficient balance
    if (user.balance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // Generate transaction ID
    const transactionId = `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`;

    // Create transaction
    const transaction = new Transaction({
      userId: req.user._id,
      transactionId,
      type: 'Withdrawal',
      method: method || 'Bank Transfer',
      amount,
      currency: currency || 'USD',
      status: 'Pending',
      description: `Withdrawal request`
    });

    await transaction.save();

    res.status(201).json({
      message: 'Withdrawal request created successfully',
      transaction
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/transactions/dashboard/stats
// @desc    Get transaction stats for dashboard
router.get('/dashboard/stats', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    // Get recent transactions
    const recentTransactions = await Transaction.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(5);

    // Format transactions for dashboard
    const formattedTransactions = recentTransactions.map(tx => ({
      date: tx.createdAt.toISOString().split('T')[0],
      id: tx.transactionId,
      type: tx.type,
      name: tx.asset || tx.description || tx.type,
      value: `${tx.currency} ${tx.amount.toLocaleString()}`,
      status: tx.status
    }));

    res.json({
      balance: user.balance,
      profit: user.profit,
      totalDeposit: user.totalDeposit,
      totalWithdrawal: user.totalWithdrawal,
      transactions: formattedTransactions,
      accountStatus: user.accountStatus
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
