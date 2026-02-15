const logger = require('../utils/logger');
const AppError = require('../utils/AppError');
const ApiResponse = require('../utils/ApiResponse');

/**
 * Handle Prisma Validation Errors
 */
const handlePrismaValidationError = (error) => {
  const message = error.message.replace(/\n/g, ' ');
  return new AppError(message, 400);
};

/**
 * Handle Prisma Known Request Errors (P2002, P2025, etc.)
 */
const handlePrismaKnownError = (error) => {
  if (error.code === 'P2002') {
    // Unique constraint violation
    const field = error.meta?.target?.[0] || 'field';
    return new AppError(`${field} already exists`, 409);
  }

  if (error.code === 'P2025') {
    // Record not found
    return new AppError('Resource not found', 404);
  }

  // Generic Prisma error
  return new AppError('Database operation failed', 400);
};

/**
 * Handle JWT Errors
 */
const handleJWTError = () => new AppError('Invalid token. Please login again', 401);

const handleJWTExpiredError = () => new AppError('Your token has expired. Please login again', 401);

/**
 * Send Error Response in Development
 */
const sendErrorDev = (err, res) => {
  logger.error('ERROR 💥', err);

  ApiResponse.error(res, err.statusCode || 500, err.message, {
    status: err.status,
    error: err,
    stack: err.stack,
  });
};

/**
 * Send Error Response in Production
 */
const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    ApiResponse.error(res, err.statusCode, err.message);
  } else {
    // Programming or unknown error: don't leak error details
    logger.error('ERROR 💥', err);
    ApiResponse.error(res, 500, 'Something went wrong!');
  }
};

/**
 * Global Error Handler Middleware
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, _next) => {
  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode || 500;

  // Prisma validation error
  if (err.name === 'PrismaClientValidationError') {
    error = handlePrismaValidationError(err);
  }

  // Prisma known request error
  if (err.name === 'PrismaClientKnownRequestError') {
    error = handlePrismaKnownError(err);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = handleJWTError();
  }

  if (err.name === 'TokenExpiredError') {
    error = handleJWTExpiredError();
  }

  // Send appropriate error response
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(error, res);
  } else {
    sendErrorProd(error, res);
  }
};

module.exports = errorHandler;
