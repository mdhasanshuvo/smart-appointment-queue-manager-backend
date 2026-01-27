const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  action: {
    type: String,
    required: [true, 'Please provide action'],
    enum: {
      values: ['Created', 'Updated', 'Deleted', 'Queue Added', 'Queue Assigned', 'Status Changed', 'Assigned'],
      message: 'Invalid action type',
    },
  },
  entity: {
    type: String,
    enum: {
      values: ['Appointment', 'Staff', 'Service', 'Queue'],
      message: 'Invalid entity type',
    },
    required: [true, 'Please provide entity type'],
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Please provide entity ID'],
  },
  description: {
    type: String,
    required: [true, 'Please provide description'],
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Index for quick retrieval of recent logs
activityLogSchema.index({ timestamp: -1 });

module.exports = mongoose.model('ActivityLog', activityLogSchema);
