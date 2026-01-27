/**
 * Request logging middleware
 * Logs incoming requests with method, path, and response time
 */
const requestLogger = (req, res, next) => {
  const startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const status = res.statusCode;
    const statusColor = status >= 400 ? '🔴' : status >= 300 ? '🟡' : '🟢';

    console.log(
      `${statusColor} ${req.method.padEnd(6)} ${req.originalUrl.padEnd(40)} ${status} ${duration}ms`
    );
  });

  next();
};

module.exports = requestLogger;
