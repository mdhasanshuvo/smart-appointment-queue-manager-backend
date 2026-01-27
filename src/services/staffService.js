const Staff = require('../models/Staff');
const Appointment = require('../models/Appointment');
const ErrorHandler = require('../utils/errorHandler');

const getAllStaff = async (filters = {}) => {
  const query = {};
  
  if (filters.serviceType) {
    query.serviceType = filters.serviceType;
  }
  
  if (filters.availabilityStatus) {
    query.availabilityStatus = filters.availabilityStatus;
  }
  
  const staff = await Staff.find(query).sort({ createdAt: -1 });
  return staff;
};

const getStaffById = async (id) => {
  const staff = await Staff.findById(id);
  if (!staff) {
    throw new ErrorHandler('Staff member not found', 404);
  }
  return staff;
};

const createStaff = async (data) => {
  const { name, serviceType, dailyCapacity, availabilityStatus } = data;
  
  if (!name || !serviceType) {
    throw new ErrorHandler('Name and service type are required', 400);
  }
  
  const staff = await Staff.create({
    name,
    serviceType,
    dailyCapacity: dailyCapacity || 5,
    availabilityStatus: availabilityStatus || 'Available',
  });
  
  return staff;
};

const updateStaff = async (id, data) => {
  const staff = await Staff.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  
  if (!staff) {
    throw new ErrorHandler('Staff member not found', 404);
  }
  
  return staff;
};

const deleteStaff = async (id) => {
  const staff = await Staff.findById(id);
  if (!staff) {
    throw new ErrorHandler('Staff member not found', 404);
  }
  
  await Staff.findByIdAndDelete(id);
  return { message: 'Staff member deleted successfully' };
};

const getStaffLoad = async (staffId, date) => {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  
  const appointmentCount = await Appointment.countDocuments({
    assignedStaff: staffId,
    appointmentDate: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
    status: { $in: ['Scheduled', 'Completed'] },
  });
  
  const staff = await Staff.findById(staffId);
  if (!staff) {
    throw new ErrorHandler('Staff member not found', 404);
  }
  
  return {
    staffId,
    staffName: staff.name,
    appointmentsToday: appointmentCount,
    dailyCapacity: staff.dailyCapacity,
    availableSlots: staff.dailyCapacity - appointmentCount,
    isBooked: appointmentCount >= staff.dailyCapacity,
  };
};

const getAllStaffLoad = async (date) => {
  const staff = await Staff.find({ availabilityStatus: 'Available' });
  
  const loads = await Promise.all(
    staff.map(s => getStaffLoad(s._id, date))
  );
  
  return loads.sort((a, b) => b.appointmentsToday - a.appointmentsToday);
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
