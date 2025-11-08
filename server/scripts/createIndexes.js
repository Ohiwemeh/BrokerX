// scripts/createIndexes.js
// Run this script to create/update database indexes for better performance

const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/user.model');
const Transaction = require('../models/transaction.model');

async function createIndexes() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    console.log('\n📊 Creating indexes for User model...');
    await User.createIndexes();
    console.log('✅ User indexes created successfully');

    console.log('\n📊 Creating indexes for Transaction model...');
    await Transaction.createIndexes();
    console.log('✅ Transaction indexes created successfully');

    // List all indexes
    console.log('\n📋 User Indexes:');
    const userIndexes = await User.collection.getIndexes();
    console.log(JSON.stringify(userIndexes, null, 2));

    console.log('\n📋 Transaction Indexes:');
    const transactionIndexes = await Transaction.collection.getIndexes();
    console.log(JSON.stringify(transactionIndexes, null, 2));

    console.log('\n✅ All indexes created successfully!');
    console.log('🚀 Your admin panel should now be much faster!');

  } catch (error) {
    console.error('❌ Error creating indexes:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run the script
createIndexes();
