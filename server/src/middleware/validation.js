const { validationResult, body } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: errors.array()[0].msg,
      },
    });
  }

  return next();
};

const validateRegister = [
  body('name').trim().notEmpty().withMessage('Name is required.'),
  body('email').isEmail().withMessage('A valid email is required.'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.'),
  handleValidationErrors,
];

const validateLogin = [
  body('email').isEmail().withMessage('A valid email is required.'),
  body('password').notEmpty().withMessage('Password is required.'),
  handleValidationErrors,
];

const validateComplaint = [
  body('title').trim().notEmpty().withMessage('Complaint title is required.'),
  body('description').trim().notEmpty().withMessage('Complaint description is required.'),
  body('category').trim().notEmpty().withMessage('Complaint category is required.'),
  body('location').trim().notEmpty().withMessage('Complaint location is required.'),
  handleValidationErrors,
];

module.exports = {
  validateRegister,
  validateLogin,
  validateComplaint,
};
