// server/routes/wallet.routes.js

const router = require('express').Router();
const User = require('../models/user.model');
const Transaction = require('../models/transaction.model');
const { verifyToken } = require('../middleware/auth.middleware');

// @route   GET /api/wallet
// @desc    Get wallet information
router.get('/', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      walletId: user.walletId,
      balance: user.balance,
      currency: user.currency,
      tradingAccount: {
        accountId: user.tradingAccountId,
        balance: user.tradingAccountBalance,
        freeMargin: user.freeMargin,
        leverage: user.leverage,
        isActivated: user.isTradingAccountActivated
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/wallet/transfer
// @desc    Transfer funds between wallet and trading account
router.post('/transfer', verifyToken, async (req, res) => {
  try {
    const { amount, from, to } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    if (!from || !to || !['wallet', 'trading'].includes(from) || !['wallet', 'trading'].includes(to)) {
      return res.status(400).json({ message: 'Invalid transfer parameters' });
    }

    if (from === to) {
      return res.status(400).json({ message: 'Cannot transfer to the same account' });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check balance
    if (from === 'wallet' && user.balance < amount) {
      return res.status(400).json({ message: 'Insufficient wallet balance' });
    }

    if (from === 'trading' && user.tradingAccountBalance < amount) {
      return res.status(400).json({ message: 'Insufficient trading account balance' });
    }

    // Perform transfer
    if (from === 'wallet') {
      user.balance -= amount;
      user.tradingAccountBalance += amount;
    } else {
      user.tradingAccountBalance -= amount;
      user.balance += amount;
    }

    await user.save();

    // Create transaction record
    const transactionId = `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`;
    
    const transaction = new Transaction({
      userId: user._id,
      transactionId,
      type: 'Transfer',
      method: 'Internal',
      amount,
      status: 'Completed',
      description: `Transfer from ${from} to ${to}`
    });

    await transaction.save();

    res.json({
      message: 'Transfer completed successfully',
      wallet: {
        balance: user.balance,
        tradingAccountBalance: user.tradingAccountBalance
      },
      transaction
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
