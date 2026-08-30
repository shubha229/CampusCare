require('dotenv').config();

const env = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/campuscare',
  jwtSecret: process.env.JWT_SECRET || 'dev_jwt_secret',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  uploadMaxSize: Number(process.env.UPLOAD_MAX_SIZE || 5242880),
};

module.exports = env;
