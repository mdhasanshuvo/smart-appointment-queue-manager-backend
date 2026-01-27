const Service = require('../models/Service');
const ErrorHandler = require('../utils/errorHandler');

const getAllServices = async () => {
  const services = await Service.find().sort({ createdAt: -1 });
  return services;
};

const getServiceById = async (id) => {
  const service = await Service.findById(id);
  if (!service) {
    throw new ErrorHandler('Service not found', 404);
  }
  return service;
};

const createService = async (data) => {
  const { serviceName, duration, requiredStaffType, description } = data;
  
  if (!serviceName || !duration || !requiredStaffType) {
    throw new ErrorHandler('Service name, duration, and required staff type are required', 400);
  }
  
  // Check if service already exists
  const existingService = await Service.findOne({ serviceName });
  if (existingService) {
    throw new ErrorHandler('Service with this name already exists', 400);
  }
  
  const service = await Service.create({
    serviceName,
    duration,
    requiredStaffType,
    description: description || '',
  });
  
  return service;
};

const updateService = async (id, data) => {
  const service = await Service.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  
  if (!service) {
    throw new ErrorHandler('Service not found', 404);
  }
  
  return service;
};

const deleteService = async (id) => {
  const service = await Service.findById(id);
  if (!service) {
    throw new ErrorHandler('Service not found', 404);
  }
  
  await Service.findByIdAndDelete(id);
  return { message: 'Service deleted successfully' };
};

module.exports = {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
};
