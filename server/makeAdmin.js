// Script to make a user an admin
const mongoose = require('mongoose');
const User = require('./models/user.model');
require('dotenv').config();

const makeAdmin = async (email) => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const user = await User.findOne({ email });
    
    if (!user) {
      console.log(`❌ User with email "${email}" not found`);
      process.exit(1);
    }

    user.role = 'admin';
    await user.save();

    console.log(`✅ User "${user.name}" (${user.email}) is now an admin!`);
    console.log(`User ID: ${user._id}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

// Get email from command line argument
const email = process.argv[2];

if (!email) {
  console.log('Usage: node makeAdmin.js <email>');
  console.log('Example: node makeAdmin.js user@example.com');
  process.exit(1);
}

makeAdmin(email);
