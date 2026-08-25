const app = require('./src/app');
const connectDB = require('./src/config/db');

// Connect to MongoDB when the serverless function spins up
connectDB();

// Export the Express app for Vercel
module.exports = app;
