// server/index.js

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');//import mongoose
require('dotenv').config();//import and configure dotenv

// Initialize the app
const app = express();
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Allow the server to accept JSON data

const uri = process.env.MONGO_URI;
mongoose.connect(uri);
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
});

// A simple test route to make sure everything is working
app.get('/', (req, res) => {
  res.send('Hello from the BrokerX Backend!');
});

// Define the port and start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



//building the shit with my head in my worst place right now, hopefully i don't fuck it up!!!