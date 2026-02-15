require('dotenv').config();
const app = require('./src/app');
const logger = require('./src/utils/logger');
const { dbService } = require('./src/config/db');
const cacheService = require('./src/services/cacheService');

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  logger.error(err.name, err.message);
  logger.error(err.stack);
  process.exit(1);
});

const PORT = process.env.PORT || 5000;

/**
 * Start Server
 */
const startServer = async () => {
  try {
    // Connect to database
    await dbService.connect();

    // Connect to Redis
    try {
      await cacheService.connect();
    } catch (error) {
      logger.warn('Redis connection failed. Continuing without cache...');
    }

    // Start Express server
    const server = app.listen(PORT, () => {
      logger.info(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🚀 Server is running on port ${PORT}                      ║
║   📝 Environment: ${process.env.NODE_ENV}                       ║
║   🌐 API Endpoint: http://localhost:${PORT}/api            ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
      `);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
      logger.error('UNHANDLED REJECTION! 💥 Shutting down...');
      logger.error(err.name, err.message);
      logger.error(err.stack);
      server.close(async () => {
        await dbService.disconnect();
        await cacheService.disconnect();
        process.exit(1);
      });
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      logger.info('👋 SIGTERM RECEIVED. Shutting down gracefully');
      server.close(async () => {
        logger.info('💥 Process terminated!');
        await dbService.disconnect();
        await cacheService.disconnect();
        process.exit(0);
      });
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();
