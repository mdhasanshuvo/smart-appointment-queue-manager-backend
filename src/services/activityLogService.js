const ActivityLog = require('../models/ActivityLog');

const getActivityLogs = async (limit = 10, skip = 0) => {
  const logs = await ActivityLog.find()
    .sort({ timestamp: -1 })
    .limit(limit)
    .skip(skip);
  
  const total = await ActivityLog.countDocuments();
  
  return {
    total,
    count: logs.length,
    logs: logs.map(log => ({
      ...log.toObject(),
      formattedTime: formatLogTime(log.timestamp),
    })),
  };
};

const formatLogTime = (timestamp) => {
  const now = new Date();
  const diff = now - timestamp;
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  
  return timestamp.toLocaleString();
};

const createActivityLog = async (action, entity, entityId, description) => {
  const log = await ActivityLog.create({
    action,
    entity,
    entityId,
    description,
  });
  
  return log;
};

module.exports = {
  getActivityLogs,
  createActivityLog,
  formatLogTime,
};
