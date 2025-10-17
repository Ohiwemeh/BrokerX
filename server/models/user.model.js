// server/models/user.model.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true, // Every email must be unique
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'], // Role can only be 'user' or 'admin'
    default: 'user' // New users are 'user' by default
  },
  country:{
    type: String,
    required: true,
  },
  currency: {
    type: String,
    default: 'USD'
  },
  phoneNumber: {
    type: String,
    trim: true
  },
  balance: {
    type: Number,
    default: 0
  },
  profit: {
    type: Number,
    default: 0
  },
  totalDeposit: {
    type: Number,
    default: 0
  },
  totalWithdrawal: {
    type: Number,
    default: 0
  },
  isProfileComplete: {
    type: Boolean,
    default: false
  },
  accountStatus: {
    type: String,
    enum: ['Pending', 'Verified', 'Rejected'],
    default: 'Pending'
  },
  // Profile information
  firstName: {
    type: String,
    trim: true
  },
  lastName: {
    type: String,
    trim: true
  },
  dob: {
    type: Date
  },
  address: {
    type: String,
    trim: true
  },
  city: {
    type: String,
    trim: true
  },
  zipCode: {
    type: String,
    trim: true
  },
  profileImageUrl: {
    type: String
  },
  // ID verification
  idFrontUrl: { 
    type: String 
  },
  idBackUrl: { 
    type: String 
  },
  // Wallet
  walletId: {
    type: String,
    unique: true,
    sparse: true
  },
  // Trading account
  tradingAccountId: {
    type: String,
    unique: true,
    sparse: true
  },
  tradingAccountBalance: {
    type: Number,
    default: 0
  },
  freeMargin: {
    type: Number,
    default: 0
  },
  leverage: {
    type: String,
    default: '1:Unlimited'
  },
  isTradingAccountActivated: {
    type: Boolean,
    default: false
  },
  // Security
  twoFactorEnabled: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true // Automatically adds 'createdAt' and 'updatedAt' fields
});

// Note: Index on email is auto-created by unique: true in schema

const User = mongoose.model('User', userSchema);

module.exports = User;