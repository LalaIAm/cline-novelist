/**
 * Cost Management Service
 * 
 * This service tracks and manages costs related to AI API usage.
 * It provides functions for estimating costs before requests,
 * recording actual costs after requests, and reporting on usage.
 */

const redisClient = require('../config/redis');
const { v4: uuidv4 } = require('uuid');

// Cost per 1K tokens by model and operation (input vs. output)
const MODEL_COSTS = {
  'gpt-3.5-turbo': {
    input: 0.0015, // $0.0015 per 1K input tokens
    output: 0.002   // $0.002 per 1K output tokens
  },
  'gpt-4': {
    input: 0.03,   // $0.03 per 1K input tokens
    output: 0.06    // $0.06 per 1K output tokens
  },
  'gpt-4-turbo': {
    input: 0.01,   // $0.01 per 1K input tokens
    output: 0.03    // $0.03 per 1K output tokens
  },
  'text-embedding-ada-002': {
    input: 0.0001,  // $0.0001 per 1K tokens (no output)
    output: 0
  }
};

// Default model selection by subscription tier
const TIER_MODELS = {
  free: 'gpt-3.5-turbo',
  standard: 'gpt-3.5-turbo',
  premium: 'gpt-4-turbo'
};

// Daily budget limits by subscription tier ($)
const DAILY_BUDGET_LIMITS = {
  free: 0.25,       // $0.25 per day
  standard: 1.00,   // $1.00 per day
  premium: 5.00     // $5.00 per day
};

// Monthly budget limits by subscription tier ($)
const MONTHLY_BUDGET_LIMITS = {
  free: 5.00,       // $5.00 per month
  standard: 25.00,  // $25.00 per month
  premium: 100.00   // $100.00 per month
};

/**
 * Select the appropriate model based on user tier and feature type
 * 
 * @param {string} subscriptionTier - User's subscription tier
 * @param {string} featureType - Type of AI feature
 * @returns {string} - Selected model name
 */
function selectModelForTier(subscriptionTier = 'free', featureType = 'writingContinuation') {
  const tier = subscriptionTier.toLowerCase();
  
  // Premium users get the best models
  if (tier === 'premium') {
    // Use GPT-4 for specific features that benefit from its capabilities
    if (['characterDevelopment', 'plotAnalysis'].includes(featureType)) {
      return 'gpt-4';
    }
    // Use GPT-4 Turbo for other premium features
    return 'gpt-4-turbo';
  }
  
  // Standard users get GPT-3.5 Turbo for all features
  if (tier === 'standard') {
    return 'gpt-3.5-turbo';
  }
  
  // Free users get GPT-3.5 Turbo with limitations
  return 'gpt-3.5-turbo';
}

/**
 * Estimate cost for an AI operation
 * 
 * @param {string} modelName - OpenAI model name
 * @param {number} inputTokens - Estimated input tokens
 * @param {number} outputTokens - Estimated output tokens
 * @returns {Object} - Cost estimate
 */
function estimateCost(modelName, inputTokens = 0, outputTokens = 0) {
  // Get cost rates for the model, defaulting to GPT-3.5 if not found
  const modelRates = MODEL_COSTS[modelName] || MODEL_COSTS['gpt-3.5-turbo'];
  
  // Calculate costs
  const inputCost = (inputTokens / 1000) * modelRates.input;
  const outputCost = (outputTokens / 1000) * modelRates.output;
  const totalCost = inputCost + outputCost;
  
  return {
    modelName,
    inputTokens,
    outputTokens,
    totalTokens: inputTokens + outputTokens,
    inputCost,
    outputCost,
    totalCost,
    costPerThousandInput: modelRates.input,
    costPerThousandOutput: modelRates.output
  };
}

/**
 * Check if an operation would exceed budget limits
 * 
 * @param {string} userId - User ID
 * @param {string} subscriptionTier - User's subscription tier
 * @param {number} estimatedCost - Estimated cost of operation
 * @returns {Promise<Object>} - Budget status
 */
async function checkBudgetLimits(userId, subscriptionTier = 'free', estimatedCost) {
  try {
    const tier = subscriptionTier.toLowerCase();
    
    // Get daily and monthly budget keys
    const dailyBudgetKey = `cost:${tier}:${userId}:daily:${getDailyKey()}`;
    const monthlyBudgetKey = `cost:${tier}:${userId}:monthly:${getMonthlyKey()}`;
    
    // Get current usage
    const dailyUsage = parseFloat(await redisClient.get(dailyBudgetKey)) || 0;
    const monthlyUsage = parseFloat(await redisClient.get(monthlyBudgetKey)) || 0;
    
    // Get limits
    const dailyLimit = DAILY_BUDGET_LIMITS[tier] || DAILY_BUDGET_LIMITS.free;
    const monthlyLimit = MONTHLY_BUDGET_LIMITS[tier] || MONTHLY_BUDGET_LIMITS.free;
    
    // Check if operation would exceed limits
    const wouldExceedDailyLimit = (dailyUsage + estimatedCost) > dailyLimit;
    const wouldExceedMonthlyLimit = (monthlyUsage + estimatedCost) > monthlyLimit;
    
    // Premium users don't have hard limits, but we still track
    const hasExceededLimit = (tier !== 'premium') && (wouldExceedDailyLimit || wouldExceedMonthlyLimit);
    
    return {
      hasExceededLimit,
      wouldExceedDailyLimit,
      wouldExceedMonthlyLimit,
      dailyUsage,
      monthlyUsage,
      dailyLimit,
      monthlyLimit,
      dailyRemaining: Math.max(0, dailyLimit - dailyUsage),
      monthlyRemaining: Math.max(0, monthlyLimit - monthlyUsage),
      estimatedCost,
      tierName: tier
    };
  } catch (error) {
    console.error('Budget check error:', error);
    // In case of error, return a safe response
    return {
      hasExceededLimit: false, // Fail open
      wouldExceedDailyLimit: false,
      wouldExceedMonthlyLimit: false,
      dailyUsage: 0,
      monthlyUsage: 0,
      dailyLimit: DAILY_BUDGET_LIMITS[subscriptionTier] || DAILY_BUDGET_LIMITS.free,
      monthlyLimit: MONTHLY_BUDGET_LIMITS[subscriptionTier] || MONTHLY_BUDGET_LIMITS.free,
      dailyRemaining: DAILY_BUDGET_LIMITS[subscriptionTier] || DAILY_BUDGET_LIMITS.free,
      monthlyRemaining: MONTHLY_BUDGET_LIMITS[subscriptionTier] || MONTHLY_BUDGET_LIMITS.free,
      estimatedCost,
      tierName: subscriptionTier
    };
  }
}

/**
 * Record cost for an AI operation
 * 
 * @param {string} userId - User ID
 * @param {string} subscriptionTier - User's subscription tier
 * @param {string} featureType - Type of AI feature
 * @param {string} modelName - Model used
 * @param {number} inputTokens - Input tokens used
 * @param {number} outputTokens - Output tokens used
 * @returns {Promise<Object>} - Cost record
 */
async function recordCost(userId, subscriptionTier = 'free', featureType, modelName, inputTokens, outputTokens) {
  try {
    const tier = subscriptionTier.toLowerCase();
    
    // Calculate cost
    const costData = estimateCost(modelName, inputTokens, outputTokens);
    const { totalCost } = costData;
    
    // Get keys for storing costs
    const dailyKey = getDailyKey();
    const monthlyKey = getMonthlyKey();
    const requestId = uuidv4();
    
    // Get Redis keys
    const dailyBudgetKey = `cost:${tier}:${userId}:daily:${dailyKey}`;
    const monthlyBudgetKey = `cost:${tier}:${userId}:monthly:${monthlyKey}`;
    const featureDailyKey = `cost:${tier}:${userId}:feature:${featureType}:daily:${dailyKey}`;
    const featureMonthlyKey = `cost:${tier}:${userId}:feature:${featureType}:monthly:${monthlyKey}`;
    
    // Get current usage
    const currentDailyUsage = parseFloat(await redisClient.get(dailyBudgetKey)) || 0;
    const currentMonthlyUsage = parseFloat(await redisClient.get(monthlyBudgetKey)) || 0;
    const currentFeatureDailyUsage = parseFloat(await redisClient.get(featureDailyKey)) || 0;
    const currentFeatureMonthlyUsage = parseFloat(await redisClient.get(featureMonthlyKey)) || 0;
    
    // Update usage
    const newDailyUsage = currentDailyUsage + totalCost;
    const newMonthlyUsage = currentMonthlyUsage + totalCost;
    const newFeatureDailyUsage = currentFeatureDailyUsage + totalCost;
    const newFeatureMonthlyUsage = currentFeatureMonthlyUsage + totalCost;
    
    // Store new values
    const dailyTTL = 24 * 60 * 60; // 1 day
    const monthlyTTL = 31 * 24 * 60 * 60; // ~1 month
    
    await redisClient.set(dailyBudgetKey, newDailyUsage.toFixed(6), 'EX', dailyTTL);
    await redisClient.set(monthlyBudgetKey, newMonthlyUsage.toFixed(6), 'EX', monthlyTTL);
    await redisClient.set(featureDailyKey, newFeatureDailyUsage.toFixed(6), 'EX', dailyTTL);
    await redisClient.set(featureMonthlyKey, newFeatureMonthlyUsage.toFixed(6), 'EX', monthlyTTL);
    
    // Store detailed record for analytics
    const recordKey = `cost:record:${requestId}`;
    const record = {
      userId,
      tier,
      featureType,
      modelName,
      inputTokens,
      outputTokens,
      totalTokens: inputTokens + outputTokens,
      inputCost: costData.inputCost,
      outputCost: costData.outputCost,
      totalCost,
      timestamp: Date.now(),
      dailyKey,
      monthlyKey
    };
    
    // Store record with 90 day expiration
    await redisClient.set(recordKey, JSON.stringify(record), 'EX', 90 * 24 * 60 * 60);
    
    // Add record ID to user's history
    const userHistoryKey = `cost:history:${userId}`;
    await redisClient.lpush(userHistoryKey, requestId);
    await redisClient.ltrim(userHistoryKey, 0, 99); // Keep last 100 records
    await redisClient.expire(userHistoryKey, 90 * 24 * 60 * 60); // 90 day expiration
    
    // Calculate limits
    const dailyLimit = DAILY_BUDGET_LIMITS[tier] || DAILY_BUDGET_LIMITS.free;
    const monthlyLimit = MONTHLY_BUDGET_LIMITS[tier] || MONTHLY_BUDGET_LIMITS.free;
    
    return {
      requestId,
      ...costData,
      dailyUsage: newDailyUsage,
      monthlyUsage: newMonthlyUsage,
      featureDailyUsage: newFeatureDailyUsage,
      featureMonthlyUsage: newFeatureMonthlyUsage,
      dailyLimit,
      monthlyLimit,
      dailyRemaining: Math.max(0, dailyLimit - newDailyUsage),
      monthlyRemaining: Math.max(0, monthlyLimit - newMonthlyUsage),
      timestamp: record.timestamp,
      tierName: tier
    };
  } catch (error) {
    console.error('Cost recording error:', error);
    // Return estimated cost on error
    return estimateCost(modelName, inputTokens, outputTokens);
  }
}

/**
 * Get user's cost history
 * 
 * @param {string} userId - User ID
 * @param {number} limit - Maximum number of records to return
 * @returns {Promise<Array>} - Cost history
 */
async function getUserCostHistory(userId, limit = 20) {
  try {
    const userHistoryKey = `cost:history:${userId}`;
    
    // Get record IDs
    const recordIds = await redisClient.lrange(userHistoryKey, 0, limit - 1);
    
    // Get records
    const records = [];
    for (const recordId of recordIds) {
      const recordKey = `cost:record:${recordId}`;
      const recordJson = await redisClient.get(recordKey);
      
      if (recordJson) {
        records.push({
          recordId,
          ...JSON.parse(recordJson)
        });
      }
    }
    
    return records;
  } catch (error) {
    console.error('Cost history retrieval error:', error);
    return [];
  }
}

/**
 * Get user's current budget status
 * 
 * @param {string} userId - User ID
 * @param {string} subscriptionTier - User's subscription tier
 * @returns {Promise<Object>} - Budget status
 */
async function getUserBudgetStatus(userId, subscriptionTier = 'free') {
  try {
    const tier = subscriptionTier.toLowerCase();
    
    // Get budget keys
    const dailyBudgetKey = `cost:${tier}:${userId}:daily:${getDailyKey()}`;
    const monthlyBudgetKey = `cost:${tier}:${userId}:monthly:${getMonthlyKey()}`;
    
    // Get current usage
    const dailyUsage = parseFloat(await redisClient.get(dailyBudgetKey)) || 0;
    const monthlyUsage = parseFloat(await redisClient.get(monthlyBudgetKey)) || 0;
    
    // Get limits
    const dailyLimit = DAILY_BUDGET_LIMITS[tier] || DAILY_BUDGET_LIMITS.free;
    const monthlyLimit = MONTHLY_BUDGET_LIMITS[tier] || MONTHLY_BUDGET_LIMITS.free;
    
    // Get feature breakdowns
    const featureBreakdown = {};
    const featureTypes = ['writingContinuation', 'characterDevelopment', 'plotAnalysis', 'dialogueEnhancement'];
    
    for (const featureType of featureTypes) {
      const featureDailyKey = `cost:${tier}:${userId}:feature:${featureType}:daily:${getDailyKey()}`;
      const featureMonthlyKey = `cost:${tier}:${userId}:feature:${featureType}:monthly:${getMonthlyKey()}`;
      
      const featureDailyUsage = parseFloat(await redisClient.get(featureDailyKey)) || 0;
      const featureMonthlyUsage = parseFloat(await redisClient.get(featureMonthlyKey)) || 0;
      
      featureBreakdown[featureType] = {
        dailyUsage: featureDailyUsage,
        monthlyUsage: featureMonthlyUsage
      };
    }
    
    return {
      tierName: tier,
      dailyUsage,
      monthlyUsage,
      dailyLimit,
      monthlyLimit,
      dailyRemaining: Math.max(0, dailyLimit - dailyUsage),
      monthlyRemaining: Math.max(0, monthlyLimit - monthlyUsage),
      dailyPercentUsed: (dailyUsage / dailyLimit) * 100,
      monthlyPercentUsed: (monthlyUsage / monthlyLimit) * 100,
      features: featureBreakdown
    };
  } catch (error) {
    console.error('Budget status retrieval error:', error);
    return {
      tierName: subscriptionTier,
      dailyUsage: 0,
      monthlyUsage: 0,
      dailyLimit: DAILY_BUDGET_LIMITS[subscriptionTier] || DAILY_BUDGET_LIMITS.free,
      monthlyLimit: MONTHLY_BUDGET_LIMITS[subscriptionTier] || MONTHLY_BUDGET_LIMITS.free,
      dailyRemaining: DAILY_BUDGET_LIMITS[subscriptionTier] || DAILY_BUDGET_LIMITS.free,
      monthlyRemaining: MONTHLY_BUDGET_LIMITS[subscriptionTier] || MONTHLY_BUDGET_LIMITS.free,
      dailyPercentUsed: 0,
      monthlyPercentUsed: 0,
      features: {}
    };
  }
}

/**
 * Reset a user's daily cost tracking (for admin purposes)
 * 
 * @param {string} userId - User ID
 * @param {string} subscriptionTier - User's subscription tier
 * @returns {Promise<boolean>} - Success status
 */
async function resetUserDailyCosts(userId, subscriptionTier = 'free') {
  try {
    const tier = subscriptionTier.toLowerCase();
    const dailyKey = getDailyKey();
    
    // Delete daily budget key
    const dailyBudgetKey = `cost:${tier}:${userId}:daily:${dailyKey}`;
    await redisClient.del(dailyBudgetKey);
    
    // Delete feature daily keys
    const featureTypes = ['writingContinuation', 'characterDevelopment', 'plotAnalysis', 'dialogueEnhancement'];
    for (const featureType of featureTypes) {
      const featureDailyKey = `cost:${tier}:${userId}:feature:${featureType}:daily:${dailyKey}`;
      await redisClient.del(featureDailyKey);
    }
    
    return true;
  } catch (error) {
    console.error('Daily cost reset error:', error);
    return false;
  }
}

/**
 * Reset a user's monthly cost tracking (for admin purposes)
 * 
 * @param {string} userId - User ID
 * @param {string} subscriptionTier - User's subscription tier
 * @returns {Promise<boolean>} - Success status
 */
async function resetUserMonthlyCosts(userId, subscriptionTier = 'free') {
  try {
    const tier = subscriptionTier.toLowerCase();
    const monthlyKey = getMonthlyKey();
    
    // Delete monthly budget key
    const monthlyBudgetKey = `cost:${tier}:${userId}:monthly:${monthlyKey}`;
    await redisClient.del(monthlyBudgetKey);
    
    // Delete feature monthly keys
    const featureTypes = ['writingContinuation', 'characterDevelopment', 'plotAnalysis', 'dialogueEnhancement'];
    for (const featureType of featureTypes) {
      const featureMonthlyKey = `cost:${tier}:${userId}:feature:${featureType}:monthly:${monthlyKey}`;
      await redisClient.del(featureMonthlyKey);
    }
    
    return true;
  } catch (error) {
    console.error('Monthly cost reset error:', error);
    return false;
  }
}

// Helper function to get current day key (YYYY-MM-DD)
function getDailyKey() {
  const date = new Date();
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`;
}

// Helper function to get current month key (YYYY-MM)
function getMonthlyKey() {
  const date = new Date();
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`;
}

module.exports = {
  MODEL_COSTS,
  TIER_MODELS,
  DAILY_BUDGET_LIMITS,
  MONTHLY_BUDGET_LIMITS,
  selectModelForTier,
  estimateCost,
  checkBudgetLimits,
  recordCost,
  getUserCostHistory,
  getUserBudgetStatus,
  resetUserDailyCosts,
  resetUserMonthlyCosts
};
