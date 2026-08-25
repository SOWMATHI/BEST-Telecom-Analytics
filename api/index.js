require('dotenv').config();
const app = require('../backend/src/app');
const connectDB = require('../backend/src/config/db');

// Connect to MongoDB
connectDB();

// Export the Express API
module.exports = app;
