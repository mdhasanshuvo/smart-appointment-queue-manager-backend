const mongoose = require('mongoose');

const waitingQueueSchema = new mongoose.Schema({
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    required: [true, 'Appointment is required'],
    unique: true,
  },
  position: {
    type: Number,
    required: [true, 'Queue position is required'],
  },
  status: {
    type: String,
    enum: {
      values: ['Waiting', 'Assigned', 'Cancelled'],
      message: 'Status must be Waiting, Assigned, or Cancelled',
    },
    default: 'Waiting',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  assignedAt: {
    type: Date,
    default: null,
  },
});

// Index for queue ordering
waitingQueueSchema.index({ status: 1, position: 1 });
waitingQueueSchema.index({ appointment: 1 });

module.exports = mongoose.model('WaitingQueue', waitingQueueSchema);
