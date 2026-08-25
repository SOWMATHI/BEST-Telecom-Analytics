const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.warn("⚠️ MONGODB_URI not configured in .env");
      return;
    }

    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log("✅ MongoDB Atlas Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Warning:", error.message);
    console.log("💡 Tip: If using MongoDB Atlas, whitelist your IP (or 0.0.0.0/0) in Atlas > Network Access");
  }
};

module.exports = connectDB;