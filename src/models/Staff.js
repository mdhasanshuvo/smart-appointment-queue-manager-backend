const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide staff name'],
    trim: true,
  },
  serviceType: {
    type: String,
    enum: {
      values: ['Doctor', 'Consultant', 'Support Agent'],
      message: 'Service type must be Doctor, Consultant, or Support Agent',
    },
    required: [true, 'Please provide service type'],
  },
  dailyCapacity: {
    type: Number,
    default: 5,
    min: [1, 'Daily capacity must be at least 1'],
  },
  availabilityStatus: {
    type: String,
    enum: {
      values: ['Available', 'On Leave'],
      message: 'Availability status must be Available or On Leave',
    },
    default: 'Available',
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

// Index for frequent queries
staffSchema.index({ serviceType: 1, availabilityStatus: 1 });

module.exports = mongoose.model('Staff', staffSchema);
