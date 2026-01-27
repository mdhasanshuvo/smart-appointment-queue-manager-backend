const Appointment = require('../models/Appointment');
const WaitingQueue = require('../models/WaitingQueue');
const ActivityLog = require('../models/ActivityLog');
const Staff = require('../models/Staff');
const Service = require('../models/Service');
const ErrorHandler = require('../utils/errorHandler');

const checkConflict = async (staffId, appointmentDate, appointmentTime, excludeAppointmentId = null) => {
  const [hours, minutes] = appointmentTime.split(':').map(Number);
  const appointmentDateTime = new Date(appointmentDate);
  appointmentDateTime.setHours(hours, minutes, 0, 0);
  
  // Get service duration for the appointment to calculate end time
  let query = {
    assignedStaff: staffId,
    status: { $in: ['Scheduled', 'Completed'] },
  };
  
  if (excludeAppointmentId) {
    query._id = { $ne: excludeAppointmentId };
  }
  
  const appointments = await Appointment.find(query)
    .populate('service')
    .exec();
  
  for (const apt of appointments) {
    const existingDateTime = new Date(apt.appointmentDate);
    const [existingHours, existingMinutes] = apt.appointmentTime.split(':').map(Number);
    existingDateTime.setHours(existingHours, existingMinutes, 0, 0);
    
    const existingEndTime = new Date(existingDateTime);
    existingEndTime.setMinutes(existingEndTime.getMinutes() + (apt.service.duration || 30));
    
    // Check if times overlap
    if (appointmentDateTime < existingEndTime && appointmentDateTime >= existingDateTime) {
      return {
        hasConflict: true,
        conflictingAppointmentId: apt._id,
        conflictingCustomer: apt.customerName,
        conflictingTime: apt.appointmentTime,
      };
    }
  }
  
  return { hasConflict: false };
};

const getAllAppointments = async (filters = {}) => {
  const query = {};
  
  if (filters.status) {
    query.status = filters.status;
  }
  
  if (filters.appointmentDate) {
    const date = new Date(filters.appointmentDate);
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    query.appointmentDate = {
      $gte: startOfDay,
      $lte: endOfDay,
    };
  }
  
  if (filters.assignedStaff) {
    query.assignedStaff = filters.assignedStaff;
  }
  
  const appointments = await Appointment.find(query)
    .populate('service')
    .populate('assignedStaff')
    .sort({ appointmentDate: 1, appointmentTime: 1 });
  
  return appointments;
};

const getAppointmentById = async (id) => {
  const appointment = await Appointment.findById(id)
    .populate('service')
    .populate('assignedStaff');
  
  if (!appointment) {
    throw new ErrorHandler('Appointment not found', 404);
  }
  
  return appointment;
};

const createAppointment = async (data) => {
  const { customerName, service, assignedStaff, appointmentDate, appointmentTime, notes } = data;
  
  // Validate required fields
  if (!customerName || !service || !appointmentDate || !appointmentTime) {
    throw new ErrorHandler('Missing required fields', 400);
  }
  
  // Validate service exists
  const serviceDoc = await Service.findById(service);
  if (!serviceDoc) {
    throw new ErrorHandler('Service not found', 404);
  }
  
  let appointment;
  let inQueue = false;
  
  if (assignedStaff) {
    // Validate staff exists
    const staff = await Staff.findById(assignedStaff);
    if (!staff) {
      throw new ErrorHandler('Staff not found', 404);
    }
    
    // Check for conflicts
    const conflict = await checkConflict(assignedStaff, appointmentDate, appointmentTime);
    if (conflict.hasConflict) {
      throw new ErrorHandler(
        `This staff member already has an appointment at ${conflict.conflictingTime}`,
        409
      );
    }
    
    // Check capacity
    const load = await getStaffLoad(assignedStaff, new Date(appointmentDate));
    if (load.availableSlots <= 0) {
      throw new ErrorHandler(
        `${staff.name} has reached daily capacity. Appointment will be added to queue.`,
        400
      );
    }
    
    appointment = await Appointment.create({
      customerName,
      service,
      assignedStaff,
      appointmentDate,
      appointmentTime,
      notes: notes || '',
      status: 'Scheduled',
    });
  } else {
    // No staff assigned - check if eligible staff available
    const eligibleStaff = await Staff.findOne({
      serviceType: serviceDoc.requiredStaffType,
      availabilityStatus: 'Available',
    });
    
    if (eligibleStaff) {
      const conflict = await checkConflict(eligibleStaff._id, appointmentDate, appointmentTime);
      const load = await getStaffLoad(eligibleStaff._id, new Date(appointmentDate));
      
      if (!conflict.hasConflict && load.availableSlots > 0) {
        // Assign to this staff
        appointment = await Appointment.create({
          customerName,
          service,
          assignedStaff: eligibleStaff._id,
          appointmentDate,
          appointmentTime,
          notes: notes || '',
          status: 'Scheduled',
        });
      } else {
        // Add to queue
        appointment = await Appointment.create({
          customerName,
          service,
          assignedStaff: null,
          appointmentDate,
          appointmentTime,
          notes: notes || '',
          status: 'Scheduled',
        });
        inQueue = true;
      }
    } else {
      // No eligible staff available - add to queue
      appointment = await Appointment.create({
        customerName,
        service,
        assignedStaff: null,
        appointmentDate,
        appointmentTime,
        notes: notes || '',
        status: 'Scheduled',
      });
      inQueue = true;
    }
  }
  
  // Add to queue if needed
  if (inQueue) {
    const queuePosition = await WaitingQueue.countDocuments({ status: 'Waiting' }) + 1;
    await WaitingQueue.create({
      appointment: appointment._id,
      position: queuePosition,
      status: 'Waiting',
    });
    
    // Log activity
    await ActivityLog.create({
      action: 'Queue Added',
      entity: 'Appointment',
      entityId: appointment._id,
      description: `Appointment for "${customerName}" added to waiting queue at position ${queuePosition}`,
    });
  } else if (assignedStaff) {
    // Log activity
    await ActivityLog.create({
      action: 'Created',
      entity: 'Appointment',
      entityId: appointment._id,
      description: `Appointment created for "${customerName}"`,
    });
  } else if (appointment.assignedStaff) {
    await ActivityLog.create({
      action: 'Assigned',
      entity: 'Appointment',
      entityId: appointment._id,
      description: `Appointment for "${customerName}" auto-assigned`,
    });
  }
  
  const fullAppointment = await getAppointmentById(appointment._id);
  return { appointment: fullAppointment, addedToQueue: inQueue };
};

const updateAppointment = async (id, data) => {
  const appointment = await Appointment.findById(id);
  if (!appointment) {
    throw new ErrorHandler('Appointment not found', 404);
  }
  
  // If updating assigned staff, check for conflicts
  if (data.assignedStaff && data.assignedStaff !== appointment.assignedStaff.toString()) {
    const conflict = await checkConflict(
      data.assignedStaff,
      data.appointmentDate || appointment.appointmentDate,
      data.appointmentTime || appointment.appointmentTime,
      id
    );
    
    if (conflict.hasConflict) {
      throw new ErrorHandler(
        `This staff member already has an appointment at ${conflict.conflictingTime}`,
        409
      );
    }
  }
  
  const updated = await Appointment.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  })
    .populate('service')
    .populate('assignedStaff');
  
  await ActivityLog.create({
    action: 'Updated',
    entity: 'Appointment',
    entityId: id,
    description: `Appointment for "${updated.customerName}" updated`,
  });
  
  return updated;
};

const deleteAppointment = async (id) => {
  const appointment = await Appointment.findById(id);
  if (!appointment) {
    throw new ErrorHandler('Appointment not found', 404);
  }
  
  // Remove from queue if present
  await WaitingQueue.deleteOne({ appointment: id });
  
  await Appointment.findByIdAndDelete(id);
  
  await ActivityLog.create({
    action: 'Deleted',
    entity: 'Appointment',
    entityId: id,
    description: `Appointment cancelled`,
  });
  
  return { message: 'Appointment cancelled successfully' };
};

const cancelAppointment = async (id) => {
  const appointment = await Appointment.findById(id);
  if (!appointment) {
    throw new ErrorHandler('Appointment not found', 404);
  }
  
  appointment.status = 'Cancelled';
  await appointment.save();
  
  // Remove from queue
  await WaitingQueue.deleteOne({ appointment: id });
  
  await ActivityLog.create({
    action: 'Status Changed',
    entity: 'Appointment',
    entityId: id,
    description: `Appointment for "${appointment.customerName}" cancelled`,
  });
  
  return await getAppointmentById(id);
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
    throw new ErrorHandler('Staff not found', 404);
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

module.exports = {
  getAllAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  cancelAppointment,
  checkConflict,
};
