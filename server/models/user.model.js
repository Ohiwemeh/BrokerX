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
  balance: {
    type: Number,
    default: 0
  },
  isProfileComplete: {
    type: Boolean,
    default: false
  },
  // You can add fields for ID images here later
  // idFrontUrl: { type: String },
  // idBackUrl: { type: String },
}, {
  timestamps: true // Automatically adds 'createdAt' and 'updatedAt' fields
});

const User = mongoose.model('User', userSchema);

module.exports = User;