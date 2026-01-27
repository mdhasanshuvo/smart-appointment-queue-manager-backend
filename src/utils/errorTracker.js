/**
 * Error tracking and logging utility
 * Tracks and logs errors for monitoring and debugging
 */
class ErrorTracker {
  constructor() {
    this.errors = [];
    this.maxErrors = 1000;
  }

  track(error, context = {}) {
    const errorRecord = {
      timestamp: new Date().toISOString(),
      message: error.message,
      code: error.code,
      status: error.status,
      stack: error.stack,
      context,
    };

    this.errors.push(errorRecord);

    // Keep only recent errors
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(-this.maxErrors);
    }

    // Log to console in development
    if (process.env.NODE_ENV !== 'production') {
      console.error(`[ERROR TRACKED] ${error.message}`, context);
    }

    return errorRecord;
  }

  getErrors(limit = 50) {
    return this.errors.slice(-limit);
  }

  getErrorStats() {
    const stats = {
      total: this.errors.length,
      byStatus: {},
      recent24h: 0,
    };

    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;

    this.errors.forEach((error) => {
      if (!stats.byStatus[error.status]) {
        stats.byStatus[error.status] = 0;
      }
      stats.byStatus[error.status]++;

      if (new Date(error.timestamp).getTime() > oneDayAgo) {
        stats.recent24h++;
      }
    });

    return stats;
  }

  clear() {
    this.errors = [];
  }
}

module.exports = new ErrorTracker();
