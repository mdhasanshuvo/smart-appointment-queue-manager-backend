const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ErrorHandler = require('../utils/errorHandler');

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

const signup = async (email, password) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ErrorHandler('Email already registered', 400);
  }

  const user = await User.create({
    email,
    password,
  });

  const token = generateToken(user._id);
  return {
    user: {
      id: user._id,
      email: user.email,
    },
    token,
  };
};

const login = async (email, password) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new ErrorHandler('Invalid credentials', 401);
  }

  const isPasswordValid = await user.matchPassword(password);
  if (!isPasswordValid) {
    throw new ErrorHandler('Invalid credentials', 401);
  }

  const token = generateToken(user._id);
  return {
    user: {
      id: user._id,
      email: user.email,
    },
    token,
  };
};

const demoLogin = async () => {
  const email = process.env.DEMO_EMAIL || 'demo@example.com';
  const password = process.env.DEMO_PASSWORD || 'demo123';

  let user = await User.findOne({ email });
  
  if (!user) {
    user = await User.create({
      email,
      password,
    });
  }

  const token = generateToken(user._id);
  return {
    user: {
      id: user._id,
      email: user.email,
    },
    token,
  };
};

module.exports = {
  signup,
  login,
  demoLogin,
};
