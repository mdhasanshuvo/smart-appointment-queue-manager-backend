const queueService = require('../services/queueService');
const ErrorHandler = require('../utils/errorHandler');

const getWaitingQueue = async (req, res, next) => {
  try {
    const queue = await queueService.getWaitingQueue();
    
    res.status(200).json({
      success: true,
      count: queue.length,
      data: queue,
    });
  } catch (error) {
    next(error);
  }
};

const assignFromQueue = async (req, res, next) => {
  try {
    const { staffId } = req.body;
    
    if (!staffId) {
      return next(new ErrorHandler('Staff ID is required', 400));
    }
    
    const appointment = await queueService.assignFromQueue(staffId);
    
    res.status(200).json({
      success: true,
      message: 'Appointment assigned from queue successfully',
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
};

const getQueueCount = async (req, res, next) => {
  try {
    const count = await queueService.getQueueCount();
    
    res.status(200).json({
      success: true,
      data: { count },
    });
  } catch (error) {
    next(error);
  }
};

const getQueuePosition = async (req, res, next) => {
  try {
    const { appointmentId } = req.query;
    
    if (!appointmentId) {
      return next(new ErrorHandler('Appointment ID is required', 400));
    }
    
    const position = await queueService.getQueuePosition(appointmentId);
    
    if (!position) {
      return res.status(200).json({
        success: true,
        data: { inQueue: false },
      });
    }
    
    res.status(200).json({
      success: true,
      data: { inQueue: true, ...position },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWaitingQueue,
  assignFromQueue,
  getQueueCount,
  getQueuePosition,
};
