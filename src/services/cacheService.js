const { createClient } = require('redis');
const logger = require('../utils/logger');

/**
 * Redis Cache Service
 * Provides caching functionality with automatic connection management
 */
class CacheService {
  constructor() {
    this.client = null;
    this.isConnected = false;
  }

  /**
   * Connect to Redis
   */
  async connect() {
    if (this.isConnected) {
      return this.client;
    }

    try {
      this.client = createClient({
        socket: {
          host: process.env.REDIS_HOST || 'localhost',
          port: parseInt(process.env.REDIS_PORT, 10) || 6379,
        },
        password: process.env.REDIS_PASSWORD || undefined,
        database: parseInt(process.env.REDIS_DB, 10) || 0,
      });

      // Error handler
      this.client.on('error', (err) => {
        logger.error('Redis Client Error:', err);
        this.isConnected = false;
      });

      // Connect event
      this.client.on('connect', () => {
        logger.info('✅ Redis connected successfully');
        this.isConnected = true;
      });

      await this.client.connect();
      return this.client;
    } catch (error) {
      logger.error('❌ Redis connection failed:', error);
      this.isConnected = false;
      throw error;
    }
  }

  /**
   * Disconnect from Redis
   */
  async disconnect() {
    if (this.client && this.isConnected) {
      await this.client.quit();
      this.isConnected = false;
      logger.info('Redis disconnected');
    }
  }

  /**
   * Set a key-value pair with optional expiration
   * @param {String} key - Cache key
   * @param {Any} value - Value to cache (will be JSON stringified)
   * @param {Number} expirationInSeconds - Expiration time in seconds (optional)
   */
  async set(key, value, expirationInSeconds = null) {
    try {
      const stringValue = JSON.stringify(value);
      if (expirationInSeconds) {
        await this.client.setEx(key, expirationInSeconds, stringValue);
      } else {
        await this.client.set(key, stringValue);
      }
      logger.debug(`Cache set: ${key}`);
      return true;
    } catch (error) {
      logger.error(`Error setting cache for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Get a value by key
   * @param {String} key - Cache key
   * @returns {Any} Parsed value or null
   */
  async get(key) {
    try {
      const value = await this.client.get(key);
      if (value) {
        logger.debug(`Cache hit: ${key}`);
        return JSON.parse(value);
      }
      logger.debug(`Cache miss: ${key}`);
      return null;
    } catch (error) {
      logger.error(`Error getting cache for key ${key}:`, error);
      return null;
    }
  }

  /**
   * Delete a key
   * @param {String} key - Cache key
   */
  async delete(key) {
    try {
      await this.client.del(key);
      logger.debug(`Cache deleted: ${key}`);
      return true;
    } catch (error) {
      logger.error(`Error deleting cache for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Delete multiple keys matching a pattern
   * @param {String} pattern - Key pattern (e.g., 'user:*')
   */
  async deletePattern(pattern) {
    try {
      const keys = await this.client.keys(pattern);
      if (keys.length > 0) {
        await this.client.del(keys);
        logger.debug(`Cache deleted for pattern ${pattern}: ${keys.length} keys`);
      }
      return true;
    } catch (error) {
      logger.error(`Error deleting cache for pattern ${pattern}:`, error);
      return false;
    }
  }

  /**
   * Check if a key exists
   * @param {String} key - Cache key
   */
  async exists(key) {
    try {
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      logger.error(`Error checking cache existence for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Set expiration on a key
   * @param {String} key - Cache key
   * @param {Number} seconds - Expiration in seconds
   */
  async expire(key, seconds) {
    try {
      await this.client.expire(key, seconds);
      return true;
    } catch (error) {
      logger.error(`Error setting expiration for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Flush all cache
   */
  async flushAll() {
    try {
      await this.client.flushAll();
      logger.warn('All cache flushed');
      return true;
    } catch (error) {
      logger.error('Error flushing cache:', error);
      return false;
    }
  }
}

module.exports = new CacheService();
