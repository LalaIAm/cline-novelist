/**
 * Redis Configuration
 * 
 * This module handles the Redis client setup for rate limiting and caching
 */

const Redis = require('ioredis');
const dotenv = require('dotenv');

dotenv.config();

// Redis client configuration
const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || '',
  db: process.env.REDIS_DB || 0,
  keyPrefix: 'novylist:'
};

// Create Redis client with retry strategy
const redisClient = new Redis({
  ...redisConfig,
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: 3
});

// Handle Redis connection events
redisClient.on('connect', () => {
  console.log('Redis client connected');
});

redisClient.on('error', (err) => {
  console.error('Redis client error:', err);
});

module.exports = redisClient;
