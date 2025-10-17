// server/index.js

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

// Initialize the app
const app = express();
const server = http.createServer(app);

// Configure allowed origins for CORS
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://broker-x-sand.vercel.app',
  process.env.CLIENT_URL
].filter(Boolean);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST']
  }
});

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
})); // Enable CORS for all routes
app.use(express.json()); // Allow the server to accept JSON data

// Make io accessible to routes
app.set('io', io);

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
  .then(async () => {
    console.log("✅ MongoDB database connection established successfully");
    
    // Ensure indexes are created
    try {
      const User = require('./models/user.model');
      await User.createIndexes();
    } catch (indexError) {
      console.error('Index creation error:', indexError.message);
    }
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
const notificationRouter = require('./routes/notification.routes');
const emailRouter = require('./routes/email.routes');

// Use routes
app.use('/api/users', userRouter);
app.use('/api/profile', profileRouter);
app.use('/api/transactions', transactionRouter);
app.use('/api/wallet', walletRouter);
app.use('/api/admin', adminRouter);
app.use('/api/notifications', notificationRouter);
app.use('/api/email', emailRouter);

// A simple test route to make sure everything is working
app.get('/', (req, res) => {
  res.send('Hello from the BrokerX Backend!');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  // Join admin room
  socket.on('join-admin', (userId) => {
    socket.join('admin-room');
  });

  socket.on('disconnect', () => {
    // Connection closed
  });
});

// Define the port and start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Socket.IO is running`);
  console.log(`Uploads directory: ${uploadsDir}`);
});