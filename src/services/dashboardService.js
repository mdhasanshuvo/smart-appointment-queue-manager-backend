const Appointment = require('../models/Appointment');
const Staff = require('../models/Staff');
const WaitingQueue = require('../models/WaitingQueue');

const getDashboardStats = async (date = new Date()) => {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  
  // Total appointments today
  const totalAppointments = await Appointment.countDocuments({
    appointmentDate: { $gte: startOfDay, $lte: endOfDay },
  });
  
  // Completed appointments
  const completedAppointments = await Appointment.countDocuments({
    appointmentDate: { $gte: startOfDay, $lte: endOfDay },
    status: 'Completed',
  });
  
  // Pending appointments (Scheduled)
  const pendingAppointments = await Appointment.countDocuments({
    appointmentDate: { $gte: startOfDay, $lte: endOfDay },
    status: 'Scheduled',
  });
  
  // Cancelled appointments
  const cancelledAppointments = await Appointment.countDocuments({
    appointmentDate: { $gte: startOfDay, $lte: endOfDay },
    status: 'Cancelled',
  });
  
  // Waiting queue count
  const queueCount = await WaitingQueue.countDocuments({ status: 'Waiting' });
  
  // Staff load summary
  const availableStaff = await Staff.find({ availabilityStatus: 'Available' });
  
  const staffLoadSummary = await Promise.all(
    availableStaff.map(async (staff) => {
      const appointmentCount = await Appointment.countDocuments({
        assignedStaff: staff._id,
        appointmentDate: { $gte: startOfDay, $lte: endOfDay },
        status: { $in: ['Scheduled', 'Completed'] },
      });
      
      return {
        staffId: staff._id,
        staffName: staff.name,
        appointmentsToday: appointmentCount,
        dailyCapacity: staff.dailyCapacity,
        availableSlots: staff.dailyCapacity - appointmentCount,
        status: appointmentCount >= staff.dailyCapacity ? 'Booked' : 'OK',
      };
    })
  );
  
  return {
    date: date.toISOString().split('T')[0],
    totalAppointments,
    completedAppointments,
    pendingAppointments,
    cancelledAppointments,
    queueCount,
    staffLoadSummary,
  };
};

const getAppointmentsByDate = async (date) => {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  
  const appointments = await Appointment.find({
    appointmentDate: { $gte: startOfDay, $lte: endOfDay },
  })
    .populate('service')
    .populate('assignedStaff')
    .sort({ appointmentTime: 1 });
  
  return appointments;
};

const getAppointmentsByStaff = async (staffId, date) => {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  
  const appointments = await Appointment.find({
    assignedStaff: staffId,
    appointmentDate: { $gte: startOfDay, $lte: endOfDay },
  })
    .populate('service')
    .sort({ appointmentTime: 1 });
  
  return appointments;
};

module.exports = {
  getDashboardStats,
  getAppointmentsByDate,
  getAppointmentsByStaff,
};
