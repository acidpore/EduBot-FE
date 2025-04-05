/**
 * EduBot API Server
 * 
 * Main entry point for the backend server of the EduBot educational chatbot application.
 * Handles MongoDB connection, Express setup, and routes registration.
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const generateRoutes = require('./routes/generateRoutes');

// Constants
const PORT = process.env.PORT || 5000;
const ALLOWED_ORIGINS = [
  'http://localhost:3000', 
  'http://127.0.0.1:3000', 
  'https://kwir03xxq01508-8000.proxy.runpod.net'
];

/**
 * Load environment variables from .env.local file
 * This allows for local development overrides
 */
const loadLocalEnvFile = () => {
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
};

/**
 * Configure Express application with middleware and routes
 * @returns {Object} Configured Express application
 */
const configureApp = () => {
  // Initialize express app
  const app = express();

  // Middleware
  app.use(express.json());
  app.use(cors({
    origin: ALLOWED_ORIGINS,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    exposedHeaders: ['Access-Control-Allow-Origin']
  }));

  // Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/generate', generateRoutes);

  // Basic route
  app.get('/', (req, res) => {
    res.send('EduBot API is running...');
  });

  return app;
};

/**
 * Connect to MongoDB Atlas
 * @returns {Promise} Connection promise
 */
const connectToMongoDB = async () => {
  // Ensure password is properly inserted into connection string
  const MONGO_URI = process.env.MONGO_URI.replace(
    '<db_password>', 
    process.env.DB_PASSWORD || 'your_actual_password_here'
  );

  console.log('Attempting to connect to MongoDB Atlas...');
  
  // Warn if DB password not properly set
  if (!process.env.DB_PASSWORD || process.env.DB_PASSWORD === 'masukkan_password_mongodb_anda_disini') {
    console.warn('WARNING: Proper DB_PASSWORD not found. Please set it in .env.local file');
  }

  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB Atlas successfully!');
    return true;
  } catch (dbError) {
    console.error('MongoDB connection error:', dbError);
    console.error('Please check:');
    console.error('1. Your DB_PASSWORD in .env.local is correct');
    console.error('2. Your MongoDB Atlas connection string is valid');
    console.error('3. Your network can reach MongoDB Atlas');
    console.warn('Continuing without MongoDB connection. Some features may not work.');
    return false;
  }
};

/**
 * Configure error handling for the process
 */
const setupErrorHandling = (server) => {
  // Handle promise rejections
  process.on('unhandledRejection', (err) => {
    console.error('UNHANDLED REJECTION! 💥 Shutting down...');
    console.error(err.name, err.message);
    server.close(() => {
      process.exit(1);
    });
  });

  // Handle uncaught exceptions
  process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.error(err.name, err.message);
    process.exit(1);
  });
};

/**
 * Start the server and initialize all components
 */
const startServer = async () => {
  try {
    // Load local environment variables
    loadLocalEnvFile();
    
    // Set up Express app
    const app = configureApp();
    
    // Try connecting to MongoDB (but continue even if it fails)
    await connectToMongoDB();
    
    // Start Express server
    const server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

    // Set up error handling
    setupErrorHandling(server);
    
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1); // Exit with failure
  }
};

// Start the server
startServer(); 