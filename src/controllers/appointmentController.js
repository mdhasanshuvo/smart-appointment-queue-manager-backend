const appointmentService = require('../services/appointmentService');
const ErrorHandler = require('../utils/errorHandler');

const getAllAppointments = async (req, res, next) => {
  try {
    const filters = {};
    if (req.query.status) filters.status = req.query.status;
    if (req.query.appointmentDate) filters.appointmentDate = req.query.appointmentDate;
    if (req.query.assignedStaff) filters.assignedStaff = req.query.assignedStaff;
    
    const appointments = await appointmentService.getAllAppointments(filters);
    
    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (error) {
    next(error);
  }
};

const getAppointmentById = async (req, res, next) => {
  try {
    const appointment = await appointmentService.getAppointmentById(req.params.id);
    
    res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
};

const createAppointment = async (req, res, next) => {
  try {
    const result = await appointmentService.createAppointment(req.body);
    
    res.status(201).json({
      success: true,
      message: result.addedToQueue 
        ? 'No eligible staff available. Appointment added to waiting queue.'
        : 'Appointment created successfully',
      data: result.appointment,
      addedToQueue: result.addedToQueue,
    });
  } catch (error) {
    next(error);
  }
};

const updateAppointment = async (req, res, next) => {
  try {
    const appointment = await appointmentService.updateAppointment(req.params.id, req.body);
    
    res.status(200).json({
      success: true,
      message: 'Appointment updated successfully',
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
};

const deleteAppointment = async (req, res, next) => {
  try {
    const result = await appointmentService.deleteAppointment(req.params.id);
    
    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};

const cancelAppointment = async (req, res, next) => {
  try {
    const appointment = await appointmentService.cancelAppointment(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'Appointment cancelled successfully',
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
};

const completeAppointment = async (req, res, next) => {
  try {
    const Appointment = require('../models/Appointment');
    const ActivityLog = require('../models/ActivityLog');
    
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return next(new ErrorHandler('Appointment not found', 404));
    }
    
    appointment.status = 'Completed';
    await appointment.save();
    
    await ActivityLog.create({
      action: 'Status Changed',
      entity: 'Appointment',
      entityId: appointment._id,
      description: `Appointment for "${appointment.customerName}" marked as completed`,
    });
    
    const updated = await Appointment.findById(req.params.id)
      .populate('service')
      .populate('assignedStaff');
    
    res.status(200).json({
      success: true,
      message: 'Appointment marked as completed',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

const markNoShow = async (req, res, next) => {
  try {
    const Appointment = require('../models/Appointment');
    const ActivityLog = require('../models/ActivityLog');
    
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return next(new ErrorHandler('Appointment not found', 404));
    }
    
    appointment.status = 'No-Show';
    await appointment.save();
    
    await ActivityLog.create({
      action: 'Status Changed',
      entity: 'Appointment',
      entityId: appointment._id,
      description: `Appointment for "${appointment.customerName}" marked as no-show`,
    });
    
    const updated = await Appointment.findById(req.params.id)
      .populate('service')
      .populate('assignedStaff');
    
    res.status(200).json({
      success: true,
      message: 'Appointment marked as no-show',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  cancelAppointment,
  completeAppointment,
  markNoShow,
};
