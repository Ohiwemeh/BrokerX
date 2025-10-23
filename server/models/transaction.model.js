// server/models/transaction.model.js

const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  transactionId: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    enum: ['Deposit', 'Withdrawal', 'Trade', 'Transfer'],
    required: true
  },
  method: {
    type: String,
    enum: ['Credit/Debit Card', 'Bank Transfer', 'USDT', 'Internal', 'bank', 'crypto', 'card', 'paypal'],
    default: 'Internal'
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'USD'
  },
  status: {
    type: String,
    enum: ['Pending', 'Completed', 'Failed', 'Processing'],
    default: 'Pending'
  },
  description: {
    type: String,
    trim: true
  },
  // For trades
  asset: {
    type: String,
    trim: true
  },
  // Admin notes
  adminNotes: {
    type: String,
    trim: true
  },
  // Withdrawal details
  withdrawalDetails: {
    accountNumber: String,
    accountName: String,
    bankName: String,
    routingNumber: String,
    walletAddress: String,
    email: String
  },
  // Verification code for withdrawals
  verificationCode: {
    type: String,
    trim: true
  },
  // Code verified status
  codeVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
