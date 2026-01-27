const WaitingQueue = require('../models/WaitingQueue');
const Appointment = require('../models/Appointment');
const ActivityLog = require('../models/ActivityLog');
const ErrorHandler = require('../utils/errorHandler');

const getWaitingQueue = async () => {
  const queue = await WaitingQueue.find({ status: 'Waiting' })
    .populate({
      path: 'appointment',
      populate: [
        { path: 'service' },
        { path: 'assignedStaff' },
      ],
    })
    .sort({ position: 1 });
  
  return queue;
};

const assignFromQueue = async (staffId) => {
  // Get first appointment in queue
  const queueItem = await WaitingQueue.findOne({ status: 'Waiting' })
    .populate({
      path: 'appointment',
      populate: 'service',
    })
    .sort({ position: 1 });
  
  if (!queueItem) {
    throw new ErrorHandler('No appointments in queue', 404);
  }
  
  const appointment = queueItem.appointment;
  
  // Update appointment with assigned staff
  appointment.assignedStaff = staffId;
  await appointment.save();
  
  // Update queue status
  queueItem.status = 'Assigned';
  queueItem.assignedAt = new Date();
  await queueItem.save();
  
  // Update positions for remaining queue
  await WaitingQueue.updateMany(
    { status: 'Waiting', position: { $gt: queueItem.position } },
    { $inc: { position: -1 } }
  );
  
  // Log activity
  await ActivityLog.create({
    action: 'Queue Assigned',
    entity: 'Appointment',
    entityId: appointment._id,
    description: `Appointment for "${appointment.customerName}" auto-assigned from waiting queue`,
  });
  
  return await Appointment.findById(appointment._id)
    .populate('service')
    .populate('assignedStaff');
};

const removeFromQueue = async (appointmentId) => {
  const queueItem = await WaitingQueue.findOne({ appointment: appointmentId });
  
  if (queueItem) {
    const position = queueItem.position;
    
    // Delete from queue
    await WaitingQueue.deleteOne({ _id: queueItem._id });
    
    // Update positions for remaining items
    await WaitingQueue.updateMany(
      { status: 'Waiting', position: { $gt: position } },
      { $inc: { position: -1 } }
    );
  }
  
  return { message: 'Removed from queue' };
};

const getQueueCount = async () => {
  return await WaitingQueue.countDocuments({ status: 'Waiting' });
};

const getQueuePosition = async (appointmentId) => {
  const queueItem = await WaitingQueue.findOne({ appointment: appointmentId });
  
  if (!queueItem) {
    return null;
  }
  
  return {
    appointmentId,
    position: queueItem.position,
    status: queueItem.status,
    ordinal: getOrdinalSuffix(queueItem.position),
  };
};

const getOrdinalSuffix = (num) => {
  const j = num % 10;
  const k = num % 100;
  
  if (j === 1 && k !== 11) return `${num}st`;
  if (j === 2 && k !== 12) return `${num}nd`;
  if (j === 3 && k !== 13) return `${num}rd`;
  return `${num}th`;
};

module.exports = {
  getWaitingQueue,
  assignFromQueue,
  removeFromQueue,
  getQueueCount,
  getQueuePosition,
};
