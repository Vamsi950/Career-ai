const express = require('express');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const { errorHandler } = require('./middleware/error');
const connectDB = require('./config/db');

// Load env vars
require('dotenv').config();

// Connect to database
connectDB();

// Route files
const auth = require('./routes/auth');
const resumes = require('./routes/resumes');

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Mount routers
app.use('/api/v1/auth', auth);
app.use('/api/v1/resumes', resumes);

// Error handler middleware (must be after routes)
app.use(errorHandler);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`Error: ${err.message}`);
  // Close server & exit process
  // server.close(() => process.exit(1));
});

module.exports = app;
