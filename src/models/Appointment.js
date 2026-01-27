const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: [true, 'Please provide customer name'],
    trim: true,
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: [true, 'Please provide service'],
  },
  assignedStaff: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff',
    default: null,
  },
  appointmentDate: {
    type: Date,
    required: [true, 'Please provide appointment date'],
  },
  appointmentTime: {
    type: String,
    required: [true, 'Please provide appointment time'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please provide valid time in HH:MM format'],
  },
  status: {
    type: String,
    enum: {
      values: ['Scheduled', 'Completed', 'Cancelled', 'No-Show'],
      message: 'Status must be Scheduled, Completed, Cancelled, or No-Show',
    },
    default: 'Scheduled',
  },
  notes: {
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

// Index for frequent queries
appointmentSchema.index({ appointmentDate: 1, status: 1 });
appointmentSchema.index({ assignedStaff: 1, appointmentDate: 1 });

module.exports = mongoose.model('Appointment', appointmentSchema);
