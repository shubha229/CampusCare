const { registerUser, loginUser, getCurrentUser } = require('../services/authService');
const { sendSuccess, sendError } = require('../utils/response');

const register = async (req, res, next) => {
  try {
    const result = await registerUser(req.body);
    return sendSuccess(res, result, 201);
  } catch (error) {
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await loginUser(req.body);
    return sendSuccess(res, result, 200);
  } catch (error) {
    return next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await getCurrentUser(req.user.id);
    return sendSuccess(res, { user }, 200);
  } catch (error) {
    return next(error);
  }
};

const logout = async (req, res) => {
  return sendSuccess(res, { message: 'Logged out successfully.' }, 200);
};

module.exports = {
  register,
  login,
  getMe,
  logout,
};
