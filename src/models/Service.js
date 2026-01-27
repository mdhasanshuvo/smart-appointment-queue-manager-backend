const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  serviceName: {
    type: String,
    required: [true, 'Please provide service name'],
    unique: true,
    trim: true,
  },
  duration: {
    type: Number,
    enum: {
      values: [15, 30, 60],
      message: 'Duration must be 15, 30, or 60 minutes',
    },
    required: [true, 'Please provide duration'],
  },
  requiredStaffType: {
    type: String,
    enum: {
      values: ['Doctor', 'Consultant', 'Support Agent'],
      message: 'Required staff type must be Doctor, Consultant, or Support Agent',
    },
    required: [true, 'Please provide required staff type'],
  },
  description: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Service', serviceSchema);
