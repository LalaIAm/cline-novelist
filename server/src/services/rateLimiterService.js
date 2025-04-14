/**
 * Rate Limiter Service
 * 
 * This service implements rate limiting for AI-assisted features based on user subscription tiers.
 * It uses Redis for distributed rate limiting and provides methods to track and enforce usage limits.
 */

const { RateLimiterRedis } = require('rate-limiter-flexible');
const redisClient = require('../config/redis');

// Rate limit configuration per subscription tier (requests per day)
const RATE_LIMITS = {
  free: 20,
  standard: 100,
  premium: Infinity // Unlimited
};

// Token budget configuration per subscription tier (monthly)
const TOKEN_BUDGETS = {
  free: 100000, // 100K tokens per month
  standard: 500000, // 500K tokens per month
  premium: 2000000 // 2M tokens per month
};

// Define feature-specific limits as a percentage of total budget
const FEATURE_LIMITS = {
  writingContinuation: 0.7, // 70% of total budget
  characterDevelopment: 0.1, // 10% of total budget
  plotAnalysis: 0.1, // 10% of total budget
  dialogueEnhancement: 0.1 // 10% of total budget
};

// Create rate limiters for each subscription tier
const rateLimiters = {
  free: new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: 'ratelimit:free:',
    points: RATE_LIMITS.free,
    duration: 24 * 60 * 60, // 24 hours
    blockDuration: 0, // Do not block, just track
  }),
  standard: new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: 'ratelimit:standard:',
    points: RATE_LIMITS.standard,
    duration: 24 * 60 * 60, // 24 hours
    blockDuration: 0, // Do not block, just track
  }),
  premium: new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: 'ratelimit:premium:',
    points: 10000, // High number for tracking purposes
    duration: 24 * 60 * 60, // 24 hours
    blockDuration: 0, // Do not block, just track
  })
};

/**
 * Check if a user has reached their rate limit for AI requests
 * 
 * @param {string} userId - User ID
 * @param {string} subscriptionTier - User's subscription tier
 * @returns {Promise<Object>} - Rate limit status
 */
async function checkRateLimit(userId, subscriptionTier = 'free') {
  try {
    const tier = subscriptionTier.toLowerCase();
    
    // Use the appropriate rate limiter based on subscription tier
    const limiter = rateLimiters[tier] || rateLimiters.free;
    
    // Get current consumption
    const rateLimitResult = await limiter.get(userId);
    
    // Calculate remaining points
    const pointsConsumed = rateLimitResult?.consumedPoints || 0;
    const pointsLimit = RATE_LIMITS[tier] || RATE_LIMITS.free;
    const pointsRemaining = Math.max(0, pointsLimit - pointsConsumed);
    
    // Calculate reset time
    const msBeforeReset = rateLimitResult?.msBeforeNext || 0;
    const resetTime = Date.now() + msBeforeReset;
    
    // Check if rate limit has been reached
    const isRateLimited = pointsRemaining <= 0 && tier !== 'premium';
    
    return {
      isRateLimited,
      limit: pointsLimit,
      remaining: pointsRemaining,
      reset: Math.floor(resetTime / 1000), // Unix timestamp in seconds
      tierName: tier
    };
  } catch (error) {
    console.error('Rate limit check error:', error);
    // Fail open to prevent blocking users if rate limiting fails
    return {
      isRateLimited: false,
      limit: RATE_LIMITS[subscriptionTier] || RATE_LIMITS.free,
      remaining: RATE_LIMITS[subscriptionTier] || RATE_LIMITS.free,
      reset: Math.floor((Date.now() + 24 * 60 * 60 * 1000) / 1000),
      tierName: subscriptionTier
    };
  }
}

/**
 * Consume a rate limit point for a user
 * 
 * @param {string} userId - User ID
 * @param {string} subscriptionTier - User's subscription tier
 * @returns {Promise<Object>} - Updated rate limit status
 */
async function consumeRateLimit(userId, subscriptionTier = 'free') {
  try {
    const tier = subscriptionTier.toLowerCase();
    
    // Use the appropriate rate limiter based on subscription tier
    const limiter = rateLimiters[tier] || rateLimiters.free;
    
    // Consume a point
    await limiter.consume(userId);
    
    // Return updated rate limit status
    return await checkRateLimit(userId, tier);
  } catch (error) {
    if (error.remainingPoints !== undefined) {
      // This is a rate limit exceeded error
      return {
        isRateLimited: true,
        limit: RATE_LIMITS[tier] || RATE_LIMITS.free,
        remaining: 0,
        reset: Math.floor((Date.now() + error.msBeforeNext) / 1000),
        tierName: tier
      };
    }
    
    console.error('Rate limit consumption error:', error);
    // In case of error, return a safe response
    return {
      isRateLimited: false,
      limit: RATE_LIMITS[subscriptionTier] || RATE_LIMITS.free,
      remaining: RATE_LIMITS[subscriptionTier] || RATE_LIMITS.free,
      reset: Math.floor((Date.now() + 24 * 60 * 60 * 1000) / 1000),
      tierName: subscriptionTier
    };
  }
}

/**
 * Check if a user has sufficient token budget for an operation
 * 
 * @param {string} userId - User ID
 * @param {string} subscriptionTier - User's subscription tier
 * @param {string} featureType - Type of AI feature
 * @param {number} estimatedTokens - Estimated tokens for the operation
 * @returns {Promise<Object>} - Token budget status
 */
async function checkTokenBudget(userId, subscriptionTier = 'free', featureType, estimatedTokens) {
  try {
    const tier = subscriptionTier.toLowerCase();
    const featureKey = `tokenbudget:${tier}:${userId}:${featureType}`;
    const totalBudgetKey = `tokenbudget:${tier}:${userId}:total`;
    
    // Get current token usage for this feature and total
    const featureUsage = await redisClient.get(featureKey) || 0;
    const totalUsage = await redisClient.get(totalBudgetKey) || 0;
    
    // Calculate remaining budget
    const totalBudget = TOKEN_BUDGETS[tier] || TOKEN_BUDGETS.free;
    const featureBudget = totalBudget * (FEATURE_LIMITS[featureType] || 0.25);
    
    const featureRemaining = Math.max(0, featureBudget - featureUsage);
    const totalRemaining = Math.max(0, totalBudget - totalUsage);
    
    // Check if there's enough budget
    const hasSufficientBudget = (
      (tier === 'premium') || // Premium users always have budget
      (estimatedTokens <= featureRemaining && estimatedTokens <= totalRemaining)
    );
    
    return {
      hasSufficientBudget,
      totalBudget,
      totalRemaining,
      featureBudget,
      featureRemaining,
      estimatedTokens,
      featureType,
      tierName: tier
    };
  } catch (error) {
    console.error('Token budget check error:', error);
    // Fail open to prevent blocking users if budget checking fails
    return {
      hasSufficientBudget: true,
      totalBudget: TOKEN_BUDGETS[subscriptionTier] || TOKEN_BUDGETS.free,
      totalRemaining: TOKEN_BUDGETS[subscriptionTier] || TOKEN_BUDGETS.free,
      featureBudget: 0,
      featureRemaining: 0,
      estimatedTokens,
      featureType,
      tierName: subscriptionTier
    };
  }
}

/**
 * Record token usage for a user
 * 
 * @param {string} userId - User ID
 * @param {string} subscriptionTier - User's subscription tier
 * @param {string} featureType - Type of AI feature
 * @param {number} tokensUsed - Number of tokens used
 * @returns {Promise<Object>} - Updated token budget status
 */
async function recordTokenUsage(userId, subscriptionTier = 'free', featureType, tokensUsed) {
  try {
    const tier = subscriptionTier.toLowerCase();
    const featureKey = `tokenbudget:${tier}:${userId}:${featureType}`;
    const totalBudgetKey = `tokenbudget:${tier}:${userId}:total`;
    
    // Get current values
    const currentFeatureUsage = parseInt(await redisClient.get(featureKey)) || 0;
    const currentTotalUsage = parseInt(await redisClient.get(totalBudgetKey)) || 0;
    
    // Update usage
    const newFeatureUsage = currentFeatureUsage + tokensUsed;
    const newTotalUsage = currentTotalUsage + tokensUsed;
    
    // Store new values with one month expiry (reset monthly)
    const monthlyTTL = 30 * 24 * 60 * 60; // 30 days
    await redisClient.set(featureKey, newFeatureUsage, 'EX', monthlyTTL);
    await redisClient.set(totalBudgetKey, newTotalUsage, 'EX', monthlyTTL);
    
    // Calculate remaining budget
    const totalBudget = TOKEN_BUDGETS[tier] || TOKEN_BUDGETS.free;
    const featureBudget = totalBudget * (FEATURE_LIMITS[featureType] || 0.25);
    
    const featureRemaining = Math.max(0, featureBudget - newFeatureUsage);
    const totalRemaining = Math.max(0, totalBudget - newTotalUsage);
    
    return {
      totalBudget,
      totalRemaining,
      totalUsed: newTotalUsage,
      featureBudget,
      featureRemaining,
      featureUsed: newFeatureUsage,
      tierName: tier
    };
  } catch (error) {
    console.error('Token usage recording error:', error);
    // Return a safe response on error
    return {
      totalBudget: TOKEN_BUDGETS[subscriptionTier] || TOKEN_BUDGETS.free,
      totalRemaining: 0,
      totalUsed: 0,
      featureBudget: 0,
      featureRemaining: 0,
      featureUsed: 0,
      tierName: subscriptionTier
    };
  }
}

/**
 * Reset a user's rate limit (for admin purposes)
 * 
 * @param {string} userId - User ID
 * @param {string} subscriptionTier - User's subscription tier
 * @returns {Promise<boolean>} - Success status
 */
async function resetUserRateLimit(userId, subscriptionTier = 'free') {
  try {
    const tier = subscriptionTier.toLowerCase();
    
    // Use the appropriate rate limiter based on subscription tier
    const limiter = rateLimiters[tier] || rateLimiters.free;
    
    // Delete the user's rate limit record
    await limiter.delete(userId);
    
    return true;
  } catch (error) {
    console.error('Rate limit reset error:', error);
    return false;
  }
}

/**
 * Reset a user's token budget (for admin purposes)
 * 
 * @param {string} userId - User ID
 * @param {string} subscriptionTier - User's subscription tier
 * @returns {Promise<boolean>} - Success status
 */
async function resetUserTokenBudget(userId, subscriptionTier = 'free') {
  try {
    const tier = subscriptionTier.toLowerCase();
    
    // Delete all token budget keys for this user
    const featureTypes = Object.keys(FEATURE_LIMITS);
    for (const featureType of featureTypes) {
      const featureKey = `tokenbudget:${tier}:${userId}:${featureType}`;
      await redisClient.del(featureKey);
    }
    
    // Delete total budget key
    const totalBudgetKey = `tokenbudget:${tier}:${userId}:total`;
    await redisClient.del(totalBudgetKey);
    
    return true;
  } catch (error) {
    console.error('Token budget reset error:', error);
    return false;
  }
}

module.exports = {
  RATE_LIMITS,
  TOKEN_BUDGETS,
  FEATURE_LIMITS,
  checkRateLimit,
  consumeRateLimit,
  checkTokenBudget,
  recordTokenUsage,
  resetUserRateLimit,
  resetUserTokenBudget
};
