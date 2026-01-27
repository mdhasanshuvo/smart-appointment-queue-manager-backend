const activityLogService = require('../services/activityLogService');

const getActivityLogs = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const skip = parseInt(req.query.skip) || 0;
    
    const result = await activityLogService.getActivityLogs(limit, skip);
    
    res.status(200).json({
      success: true,
      total: result.total,
      count: result.count,
      data: result.logs,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getActivityLogs,
};
