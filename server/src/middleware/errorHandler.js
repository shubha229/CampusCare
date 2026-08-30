const { sendError } = require('../utils/response');

const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err.name === 'ValidationError') {
    return sendError(res, 'VALIDATION_ERROR', err.message, 400);
  }

  if (err.name === 'CastError') {
    return sendError(res, 'INVALID_ID', 'The provided ID is invalid.', 400);
  }

  return sendError(res, 'INTERNAL_SERVER_ERROR', 'Something went wrong.', 500);
};

module.exports = errorHandler;
