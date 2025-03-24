require('dotenv').config();
const fs = require('fs');
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');

// Load .env.local file if exists
try {
  const envLocalPath = path.join(__dirname, '.env.local');
  if (fs.existsSync(envLocalPath)) {
    const envLocalContent = fs.readFileSync(envLocalPath, 'utf8');
    const envConfig = require('dotenv').parse(Buffer.from(envLocalContent));
    
    // Set env variables from .env.local
    for (const k in envConfig) {
      process.env[k] = envConfig[k];
    }
    console.log('.env.local loaded successfully');
  }
} catch (error) {
  console.error('Error loading .env.local:', error.message);
}

// Initialize express app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('EduBot API is running...');
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;

// Pastikan password MongoDB Anda disisipkan dengan benar
const MONGO_URI = process.env.MONGO_URI.replace('<db_password>', process.env.DB_PASSWORD || 'your_actual_password_here');

console.log('Attempting to connect to MongoDB Atlas...');
if (!process.env.DB_PASSWORD || process.env.DB_PASSWORD === 'masukkan_password_mongodb_anda_disini') {
  console.warn('WARNING: Proper DB_PASSWORD not found. Please set it in .env.local file');
}

const start = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB Atlas successfully!');
    
    // Start server after successful connection
    const server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

    // Handle promise rejections
    process.on('unhandledRejection', (err) => {
      console.error('UNHANDLED REJECTION! 💥 Shutting down...');
      console.error(err.name, err.message);
      server.close(() => {
        process.exit(1);
      });
    });
    
  } catch (error) {
    console.error('MongoDB connection error:', error);
    console.error('Please check:');
    console.error('1. Your DB_PASSWORD in .env.local is correct');
    console.error('2. Your MongoDB Atlas connection string is valid');
    console.error('3. Your network can reach MongoDB Atlas');
    process.exit(1); // Exit with failure
  }
};

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

start(); 