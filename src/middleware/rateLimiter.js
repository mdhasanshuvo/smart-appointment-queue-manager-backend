/**
 * Rate limiting middleware
 * Prevents abuse by limiting requests per IP address
 */
const rateLimiter = {
  requests: new Map(),
  maxRequests: 100,
  windowMs: 15 * 60 * 1000, // 15 minutes

  middleware() {
    return (req, res, next) => {
      const ip = req.ip || req.connection.remoteAddress;
      const now = Date.now();

      if (!this.requests.has(ip)) {
        this.requests.set(ip, []);
      }

      const requests = this.requests.get(ip);
      const recentRequests = requests.filter((time) => now - time < this.windowMs);

      if (recentRequests.length >= this.maxRequests) {
        return res.status(429).json({
          success: false,
          message: 'Too many requests. Please try again later.',
        });
      }

      recentRequests.push(now);
      this.requests.set(ip, recentRequests);

      // Clean up old entries occasionally
      if (this.requests.size > 1000) {
        const ips = Array.from(this.requests.keys());
        ips.slice(0, 100).forEach((key) => this.requests.delete(key));
      }

      next();
    };
  },
};

module.exports = rateLimiter.middleware();
