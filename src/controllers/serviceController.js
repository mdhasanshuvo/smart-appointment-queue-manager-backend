const serviceService = require('../services/serviceService');
const ErrorHandler = require('../utils/errorHandler');

const getAllServices = async (req, res, next) => {
  try {
    const services = await serviceService.getAllServices();
    
    res.status(200).json({
      success: true,
      count: services.length,
      data: services,
    });
  } catch (error) {
    next(error);
  }
};

const getServiceById = async (req, res, next) => {
  try {
    const service = await serviceService.getServiceById(req.params.id);
    
    res.status(200).json({
      success: true,
      data: service,
    });
  } catch (error) {
    next(error);
  }
};

const createService = async (req, res, next) => {
  try {
    const service = await serviceService.createService(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      data: service,
    });
  } catch (error) {
    next(error);
  }
};

const updateService = async (req, res, next) => {
  try {
    const service = await serviceService.updateService(req.params.id, req.body);
    
    res.status(200).json({
      success: true,
      message: 'Service updated successfully',
      data: service,
    });
  } catch (error) {
    next(error);
  }
};

const deleteService = async (req, res, next) => {
  try {
    const result = await serviceService.deleteService(req.params.id);
    
    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
};
