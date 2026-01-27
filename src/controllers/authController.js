const authService = require('../services/authService');
const { body, validationResult } = require('express-validator');
const ErrorHandler = require('../utils/errorHandler');

const signup = async (req, res, next) => {
  try {
    // Validation
    await body('email').isEmail().run(req);
    await body('password').isLength({ min: 6 }).run(req);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ErrorHandler('Validation failed', 400));
    }

    const { email, password } = req.body;
    const result = await authService.signup(email, password);
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    // Validation
    await body('email').isEmail().run(req);
    await body('password').notEmpty().run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ErrorHandler('Validation failed', 400));
    }

    const { email, password } = req.body;
    const result = await authService.login(email, password);
    
    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const demoLogin = async (req, res, next) => {
  try {
    const result = await authService.demoLogin();
    
    res.status(200).json({
      success: true,
      message: 'Demo login successful',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup,
  login,
  demoLogin,
};
