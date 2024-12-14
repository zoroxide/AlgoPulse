const mongoose = require('mongoose');

const connectDB = async () => {
  console.log("Connecting to MongoDB with URI:", process.env.MONGO_URL);
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
