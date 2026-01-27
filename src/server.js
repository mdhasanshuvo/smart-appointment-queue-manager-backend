require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const errorMiddleware = require('./middleware/errorMiddleware');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const requestLogger = require('./middleware/requestLogger');
const rateLimiter = require('./middleware/rateLimiter');

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);
app.use(rateLimiter);

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  swaggerOptions: {
    persistAuthorization: true,
  },
}));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Smart Appointment Queue Manager API is running',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1/staff', require('./routes/staffRoutes'));
app.use('/api/v1/services', require('./routes/serviceRoutes'));
app.use('/api/v1/appointments', require('./routes/appointmentRoutes'));
app.use('/api/v1/queue', require('./routes/queueRoutes'));
app.use('/api/v1/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/v1/activity-logs', require('./routes/activityLogRoutes'));

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handling middleware (must be last)
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;

// Only start a listener when running outside Vercel; Vercel invokes the handler directly.
if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
  });
}

module.exports = app;
