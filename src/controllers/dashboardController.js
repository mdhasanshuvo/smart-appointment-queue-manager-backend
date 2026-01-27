const dashboardService = require('../services/dashboardService');
const ErrorHandler = require('../utils/errorHandler');

const getDashboardStats = async (req, res, next) => {
  try {
    const { date } = req.query;
    
    const stats = await dashboardService.getDashboardStats(
      date ? new Date(date) : new Date()
    );
    
    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

const getAppointmentsByDate = async (req, res, next) => {
  try {
    const { date } = req.query;
    
    if (!date) {
      return next(new ErrorHandler('Date is required', 400));
    }
    
    const appointments = await dashboardService.getAppointmentsByDate(new Date(date));
    
    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (error) {
    next(error);
  }
};

const getAppointmentsByStaff = async (req, res, next) => {
  try {
    const { staffId, date } = req.query;
    
    if (!staffId || !date) {
      return next(new ErrorHandler('staffId and date are required', 400));
    }
    
    const appointments = await dashboardService.getAppointmentsByStaff(staffId, new Date(date));
    
    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getAppointmentsByDate,
  getAppointmentsByStaff,
};
