// server/index.js

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Initialize the app
const app = express();
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Allow the server to accept JSON data

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve static files from uploads directory
app.use('/uploads', express.static(uploadsDir));

// Connect to MongoDB
const uri = process.env.MONGO_URI;

if (!uri) {
  console.error('❌ ERROR: MONGO_URI is not defined in .env file');
  process.exit(1);
}

// MongoDB connection options
const mongoOptions = {
  serverSelectionTimeoutMS: 5000,
};

mongoose.connect(uri, mongoOptions)
  .then(() => {
    console.log("✅ MongoDB database connection established successfully");
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    console.error('\n🔧 DNS Resolution Issue Detected!');
    console.error('\nQuick Fixes:');
    console.error('1. Change your .env to use standard connection string (mongodb:// instead of mongodb+srv://)');
    console.error('2. Flush DNS cache: Run "ipconfig /flushdns" in Command Prompt as Admin');
    console.error('3. Change DNS to Google DNS (8.8.8.8 and 8.8.4.4)');
    console.error('4. Try connecting from a different network (mobile hotspot)');
    console.error('5. Disable VPN if you are using one\n');
    process.exit(1);
  });

const connection = mongoose.connection;
connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

// Import routes
const userRouter = require('./routes/user.routes');
const profileRouter = require('./routes/profile.routes');
const transactionRouter = require('./routes/transaction.routes');
const walletRouter = require('./routes/wallet.routes');
const adminRouter = require('./routes/admin.routes');

// Use routes
app.use('/api/users', userRouter);
app.use('/api/profile', profileRouter);
app.use('/api/transactions', transactionRouter);
app.use('/api/wallet', walletRouter);
app.use('/api/admin', adminRouter);

// A simple test route to make sure everything is working
app.get('/', (req, res) => {
  res.send('Hello from the BrokerX Backend!');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Define the port and start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Uploads directory: ${uploadsDir}`);
});