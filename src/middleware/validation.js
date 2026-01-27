const { body, query, param, validationResult } = require('express-validator');

const validateEmail = body('email').isEmail().withMessage('Invalid email format');
const validatePassword = body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters');

const validateStaff = [
  body('name').trim().notEmpty().withMessage('Staff name is required'),
  body('serviceType').isIn(['Doctor', 'Consultant', 'Support Agent']).withMessage('Invalid service type'),
  body('dailyCapacity').optional().isInt({ min: 1 }).withMessage('Daily capacity must be at least 1'),
];

const validateService = [
  body('serviceName').trim().notEmpty().withMessage('Service name is required'),
  body('duration').isIn([15, 30, 60]).withMessage('Duration must be 15, 30, or 60 minutes'),
  body('requiredStaffType').isIn(['Doctor', 'Consultant', 'Support Agent']).withMessage('Invalid required staff type'),
];

const validateAppointment = [
  body('customerName').trim().notEmpty().withMessage('Customer name is required'),
  body('service').isMongoId().withMessage('Invalid service ID'),
  body('assignedStaff').optional().isMongoId().withMessage('Invalid staff ID'),
  body('appointmentDate').isISO8601().withMessage('Invalid appointment date format'),
  body('appointmentTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Time must be in HH:MM format'),
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({ field: err.param, message: err.msg })),
    });
  }
  next();
};

module.exports = {
  validateEmail,
  validatePassword,
  validateStaff,
  validateService,
  validateAppointment,
  handleValidationErrors,
};
