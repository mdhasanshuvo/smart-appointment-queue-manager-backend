const staffService = require('../services/staffService');
const ErrorHandler = require('../utils/errorHandler');
const { validationResult } = require('express-validator');

const getAllStaff = async (req, res, next) => {
  try {
    const filters = {};
    if (req.query.serviceType) filters.serviceType = req.query.serviceType;
    if (req.query.availabilityStatus) filters.availabilityStatus = req.query.availabilityStatus;
    
    const staff = await staffService.getAllStaff(filters);
    
    res.status(200).json({
      success: true,
      count: staff.length,
      data: staff,
    });
  } catch (error) {
    next(error);
  }
};

const getStaffById = async (req, res, next) => {
  try {
    const staff = await staffService.getStaffById(req.params.id);
    
    res.status(200).json({
      success: true,
      data: staff,
    });
  } catch (error) {
    next(error);
  }
};

const createStaff = async (req, res, next) => {
  try {
    const staff = await staffService.createStaff(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Staff member created successfully',
      data: staff,
    });
  } catch (error) {
    next(error);
  }
};

const updateStaff = async (req, res, next) => {
  try {
    const staff = await staffService.updateStaff(req.params.id, req.body);
    
    res.status(200).json({
      success: true,
      message: 'Staff member updated successfully',
      data: staff,
    });
  } catch (error) {
    next(error);
  }
};

const deleteStaff = async (req, res, next) => {
  try {
    const result = await staffService.deleteStaff(req.params.id);
    
    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};

const getStaffLoad = async (req, res, next) => {
  try {
    const { staffId, date } = req.query;
    
    if (!staffId || !date) {
      return next(new ErrorHandler('staffId and date are required', 400));
    }
    
    const load = await staffService.getStaffLoad(staffId, new Date(date));
    
    res.status(200).json({
      success: true,
      data: load,
    });
  } catch (error) {
    next(error);
  }
};

const getAllStaffLoad = async (req, res, next) => {
  try {
    const { date } = req.query;
    
    if (!date) {
      return next(new ErrorHandler('date is required', 400));
    }
    
    const loads = await staffService.getAllStaffLoad(new Date(date));
    
    res.status(200).json({
      success: true,
      count: loads.length,
      data: loads,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllStaff,
  getStaffById,
  createStaff,
  updateStaff,
  deleteStaff,
  getStaffLoad,
  getAllStaffLoad,
};
