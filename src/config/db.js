const { PrismaClient } = require('@prisma/client');
const logger = require('../utils/logger');

/**
 * Prisma Client Singleton
 * Prevents multiple instances during hot-reloading in development
 */
class DatabaseService {
  constructor() {
    if (!DatabaseService.instance) {
      this.prisma = new PrismaClient({
        log: [
          { level: 'query', emit: 'event' },
          { level: 'error', emit: 'stdout' },
          { level: 'warn', emit: 'stdout' },
        ],
      });

      // Log all queries in development
      if (process.env.NODE_ENV === 'development') {
        this.prisma.$on('query', (e) => {
          logger.debug(`Query: ${e.query}`);
          logger.debug(`Params: ${e.params}`);
          logger.debug(`Duration: ${e.duration}ms`);
        });
      }

      DatabaseService.instance = this;
    }

    return DatabaseService.instance;
  }

  /**
   * Get Prisma Client instance
   */
  getClient() {
    return this.prisma;
  }

  /**
   * Connect to database
   */
  async connect() {
    try {
      await this.prisma.$connect();
      logger.info('✅ Database connected successfully');
    } catch (error) {
      logger.error('❌ Database connection failed:', error);
      throw error;
    }
  }

  /**
   * Disconnect from database
   */
  async disconnect() {
    try {
      await this.prisma.$disconnect();
      logger.info('Database disconnected');
    } catch (error) {
      logger.error('Error disconnecting from database:', error);
      throw error;
    }
  }

  /**
   * Health check
   */
  async healthCheck() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      logger.error('Database health check failed:', error);
      return false;
    }
  }
}

// Create singleton instance
const dbService = new DatabaseService();
const prisma = dbService.getClient();

module.exports = { prisma, dbService };
