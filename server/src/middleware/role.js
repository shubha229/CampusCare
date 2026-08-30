const { sendError } = require('../utils/response');

const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return sendError(res, 'FORBIDDEN', 'Admin access required.', 403);
  }

  return next();
};

module.exports = { requireAdmin };
