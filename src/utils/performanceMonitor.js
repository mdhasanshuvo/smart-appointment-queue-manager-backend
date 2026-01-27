/**
 * Performance monitoring utilities
 */

class PerformanceMonitor {
  constructor() {
    this.metrics = {
      apiCalls: [],
      dbQueries: [],
      errors: [],
    };
    this.maxRecords = 1000;
  }

  /**
   * Track API endpoint performance
   */
  trackApiCall(endpoint, method, duration, status) {
    this.metrics.apiCalls.push({
      endpoint,
      method,
      duration,
      status,
      timestamp: new Date(),
    });

    this.cleanup('apiCalls');
  }

  /**
   * Track database query performance
   */
  trackDbQuery(collection, operation, duration) {
    this.metrics.dbQueries.push({
      collection,
      operation,
      duration,
      timestamp: new Date(),
    });

    this.cleanup('dbQueries');
  }

  /**
   * Get performance statistics
   */
  getStats() {
    const now = Date.now();
    const oneHourAgo = now - 3600000;

    const recentApiCalls = this.metrics.apiCalls.filter(
      (call) => new Date(call.timestamp).getTime() > oneHourAgo
    );

    const recentDbQueries = this.metrics.dbQueries.filter(
      (query) => new Date(query.timestamp).getTime() > oneHourAgo
    );

    return {
      apiCalls: {
        total: recentApiCalls.length,
        averageDuration: this.calculateAverage(recentApiCalls.map((c) => c.duration)),
        slowest: this.findSlowest(recentApiCalls),
        statusCodes: this.groupByStatus(recentApiCalls),
      },
      dbQueries: {
        total: recentDbQueries.length,
        averageDuration: this.calculateAverage(recentDbQueries.map((q) => q.duration)),
        slowest: this.findSlowest(recentDbQueries),
        byCollection: this.groupByCollection(recentDbQueries),
      },
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Calculate average duration
   */
  calculateAverage(durations) {
    if (durations.length === 0) return 0;
    return Math.round(durations.reduce((a, b) => a + b, 0) / durations.length);
  }

  /**
   * Find slowest operations
   */
  findSlowest(operations) {
    return operations
      .sort((a, b) => b.duration - a.duration)
      .slice(0, 5)
      .map((op) => ({
        ...op,
        timestamp: undefined,
      }));
  }

  /**
   * Group API calls by status code
   */
  groupByStatus(apiCalls) {
    return apiCalls.reduce((acc, call) => {
      acc[call.status] = (acc[call.status] || 0) + 1;
      return acc;
    }, {});
  }

  /**
   * Group queries by collection
   */
  groupByCollection(queries) {
    return queries.reduce((acc, query) => {
      if (!acc[query.collection]) {
        acc[query.collection] = { count: 0, totalDuration: 0 };
      }
      acc[query.collection].count++;
      acc[query.collection].totalDuration += query.duration;
      return acc;
    }, {});
  }

  /**
   * Cleanup old records
   */
  cleanup(metricType) {
    if (this.metrics[metricType].length > this.maxRecords) {
      this.metrics[metricType] = this.metrics[metricType].slice(-this.maxRecords);
    }
  }

  /**
   * Clear all metrics
   */
  reset() {
    this.metrics = {
      apiCalls: [],
      dbQueries: [],
      errors: [],
    };
  }
}

module.exports = new PerformanceMonitor();
