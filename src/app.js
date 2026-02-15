const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const xss = require('xss-clean');
const hpp = require('hpp');
const logger = require('./utils/logger');
const errorHandler = require('./middlewares/errorHandler');
const AppError = require('./utils/AppError');
const ApiResponse = require('./utils/ApiResponse');
const { apiLimiter } = require('./middlewares/rateLimiter');

// Initialize Express app
const app = express();

// ==================== SECURITY MIDDLEWARES ====================

// Set security HTTP headers
app.use(helmet());

// Enable CORS
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  })
);

// Prevent XSS attacks
app.use(xss());

// Prevent HTTP Parameter Pollution
app.use(hpp());

// ==================== REQUEST PARSING ====================

// Body parser (limit to 10mb)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ==================== LOGGING ====================

// HTTP request logging (Morgan + Winston)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); // Console logging in dev
} else {
  app.use(morgan('combined', { stream: logger.stream })); // File logging in production
}

// ==================== RATE LIMITING ====================

// Apply rate limiting to all routes
app.use('/api', apiLimiter);

// ==================== ROUTES ====================

// Health check endpoint
app.get('/api/status', (req, res) => {
  ApiResponse.success(res, 200, 'Server is running', {
    status: 'healthy',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/v1/auth', require('./routes/authRoutes'));

// ==================== ERROR HANDLING ====================

// Handle undefined routes
app.all('*', (req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server`, 404));
});

// Global error handler
app.use(errorHandler);

module.exports = app;
