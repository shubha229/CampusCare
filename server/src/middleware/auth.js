const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { jwtSecret } = require('../config/env');
const { sendError } = require('../utils/response');

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 'AUTH_REQUIRED', 'Authentication token is required.', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, jwtSecret);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return sendError(res, 'AUTH_REQUIRED', 'User no longer exists.', 401);
    }

    req.user = {
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
    };

    return next();
  } catch (error) {
    return sendError(res, 'INVALID_TOKEN', 'Invalid or expired token.', 401);
  }
};

module.exports = protect;
