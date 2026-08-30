const mongoose = require('mongoose');
const { mongoUri } = require('./env');

const connectDB = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection failed. Set a valid MONGODB_URI in server/.env or start MongoDB locally.');
    console.error(error.message);
    process.exit(1);
  }
};

module.exports = { connectDB };
