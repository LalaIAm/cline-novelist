/**
 * OpenAI Service
 * 
 * This service handles interactions with the OpenAI API,
 * integrating with rate limiting and cost management.
 */

const { OpenAI } = require('openai');
const rateLimiterService = require('./rateLimiterService');
const costManagementService = require('./costManagementService');

// Create OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Encode text to tokens (approximation)
 * Note: This is a simple approximation, not the exact tokenization used by OpenAI
 * For production, use tiktoken or the OpenAI tokenizer API
 * 
 * @param {string} text - Text to encode
 * @returns {number} - Approximate token count
 */
function approximateTokenCount(text) {
  if (!text) return 0;
  
  // Approximate tokens (GPT models use ~4 chars per token on average)
  return Math.ceil(text.length / 4);
}

/**
 * Complete text using OpenAI API with rate limiting and cost management
 * 
 * @param {string} userId - User ID
 * @param {string} subscriptionTier - User subscription tier
 * @param {string} featureType - Type of AI feature
 * @param {string} prompt - Prompt text
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} - API response with usage information
 */
async function completeText(userId, subscriptionTier, featureType, prompt, options = {}) {
  try {
    // Verify user is not rate limited
    const rateLimitStatus = await rateLimiterService.checkRateLimit(userId, subscriptionTier);
    
    if (rateLimitStatus.isRateLimited) {
      return {
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'You have reached your daily request limit',
          details: rateLimitStatus
        }
      };
    }
    
    // Determine model to use based on tier and feature
    const modelName = options.model || costManagementService.selectModelForTier(subscriptionTier, featureType);
    
    // Estimate token usage
    const estimatedInputTokens = approximateTokenCount(prompt);
    const estimatedOutputTokens = options.maxTokens || 500;
    
    // Estimate cost
    const costEstimate = costManagementService.estimateCost(
      modelName, 
      estimatedInputTokens, 
      estimatedOutputTokens
    );
    
    // Check budget limits
    const budgetStatus = await costManagementService.checkBudgetLimits(
      userId, 
      subscriptionTier, 
      costEstimate.totalCost
    );
    
    if (budgetStatus.hasExceededLimit) {
      return {
        success: false,
        error: {
          code: 'BUDGET_EXCEEDED',
          message: 'You have exceeded your budget limit',
          details: budgetStatus
        }
      };
    }
    
    // Check token budget
    const tokenBudgetStatus = await rateLimiterService.checkTokenBudget(
      userId,
      subscriptionTier,
      featureType,
      estimatedInputTokens + estimatedOutputTokens
    );
    
    if (!tokenBudgetStatus.hasSufficientBudget) {
      return {
        success: false,
        error: {
          code: 'TOKEN_BUDGET_EXCEEDED',
          message: 'You have exceeded your token budget',
          details: tokenBudgetStatus
        }
      };
    }
    
    // Prepare request parameters
    const params = {
      model: modelName,
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: options.maxTokens || 500,
      temperature: options.temperature || 0.7,
      top_p: options.topP || 1,
      frequency_penalty: options.frequencyPenalty || 0,
      presence_penalty: options.presencePenalty || 0,
      user: userId // For OpenAI's abuse monitoring
    };
    
    // Send request to OpenAI
    const startTime = Date.now();
    const completion = await openai.chat.completions.create(params);
    const endTime = Date.now();
    
    // Extract response content and usage information
    const responseContent = completion.choices[0]?.message.content || '';
    const actualInputTokens = completion.usage?.prompt_tokens || estimatedInputTokens;
    const actualOutputTokens = completion.usage?.completion_tokens || approximateTokenCount(responseContent);
    
    // Record rate limit consumption
    await rateLimiterService.consumeRateLimit(userId, subscriptionTier);
    
    // Record token usage
    await rateLimiterService.recordTokenUsage(
      userId,
      subscriptionTier,
      featureType,
      actualInputTokens + actualOutputTokens
    );
    
    // Record cost
    const costRecord = await costManagementService.recordCost(
      userId,
      subscriptionTier,
      featureType,
      modelName,
      actualInputTokens,
      actualOutputTokens
    );
    
    // Return successful response
    return {
      success: true,
      data: {
        content: responseContent,
        model: modelName,
        usage: {
          promptTokens: actualInputTokens,
          completionTokens: actualOutputTokens,
          totalTokens: actualInputTokens + actualOutputTokens
        },
        processingTime: endTime - startTime,
        cost: {
          inputCost: costRecord.inputCost,
          outputCost: costRecord.outputCost,
          totalCost: costRecord.totalCost
        },
        rateLimitRemaining: rateLimitStatus.remaining - 1,
        rateLimitReset: rateLimitStatus.reset
      }
    };
  } catch (error) {
    console.error('OpenAI API error:', error);
    
    // Format error response
    return {
      success: false,
      error: {
        code: error.response?.status === 429 ? 'RATE_LIMIT_EXCEEDED' : 'AI_SERVICE_ERROR',
        message: error.message || 'Error calling OpenAI API',
        details: {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data
        }
      }
    };
  }
}

/**
 * Generate embeddings for text using OpenAI API
 * 
 * @param {string} userId - User ID
 * @param {string} subscriptionTier - User subscription tier
 * @param {string} text - Text to generate embeddings for
 * @returns {Promise<Object>} - Embeddings response
 */
async function generateEmbeddings(userId, subscriptionTier, text) {
  try {
    // Verify user is not rate limited
    const rateLimitStatus = await rateLimiterService.checkRateLimit(userId, subscriptionTier);
    
    if (rateLimitStatus.isRateLimited) {
      return {
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'You have reached your daily request limit',
          details: rateLimitStatus
        }
      };
    }
    
    // Estimate token usage
    const estimatedTokens = approximateTokenCount(text);
    
    // Estimate cost
    const costEstimate = costManagementService.estimateCost(
      'text-embedding-ada-002',
      estimatedTokens,
      0
    );
    
    // Check budget limits
    const budgetStatus = await costManagementService.checkBudgetLimits(
      userId,
      subscriptionTier,
      costEstimate.totalCost
    );
    
    if (budgetStatus.hasExceededLimit) {
      return {
        success: false,
        error: {
          code: 'BUDGET_EXCEEDED',
          message: 'You have exceeded your budget limit',
          details: budgetStatus
        }
      };
    }
    
    // Send request to OpenAI
    const startTime = Date.now();
    const response = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: text,
      user: userId // For OpenAI's abuse monitoring
    });
    const endTime = Date.now();
    
    // Extract embeddings and usage information
    const embedding = response.data[0]?.embedding;
    const actualTokens = response.usage?.total_tokens || estimatedTokens;
    
    // Record rate limit consumption
    await rateLimiterService.consumeRateLimit(userId, subscriptionTier);
    
    // Record token usage (using 'embeddings' as a feature type)
    await rateLimiterService.recordTokenUsage(
      userId,
      subscriptionTier,
      'embeddings',
      actualTokens
    );
    
    // Record cost
    const costRecord = await costManagementService.recordCost(
      userId,
      subscriptionTier,
      'embeddings',
      'text-embedding-ada-002',
      actualTokens,
      0
    );
    
    // Return successful response
    return {
      success: true,
      data: {
        embedding,
        usage: {
          totalTokens: actualTokens
        },
        processingTime: endTime - startTime,
        cost: {
          totalCost: costRecord.totalCost
        },
        rateLimitRemaining: rateLimitStatus.remaining - 1,
        rateLimitReset: rateLimitStatus.reset
      }
    };
  } catch (error) {
    console.error('OpenAI Embeddings API error:', error);
    
    // Format error response
    return {
      success: false,
      error: {
        code: error.response?.status === 429 ? 'RATE_LIMIT_EXCEEDED' : 'AI_SERVICE_ERROR',
        message: error.message || 'Error calling OpenAI Embeddings API',
        details: {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data
        }
      }
    };
  }
}

/**
 * Get user's usage statistics
 * 
 * @param {string} userId - User ID
 * @param {string} subscriptionTier - User subscription tier
 * @returns {Promise<Object>} - Usage statistics
 */
async function getUserUsageStats(userId, subscriptionTier) {
  try {
    // Get rate limit status
    const rateLimitStatus = await rateLimiterService.checkRateLimit(userId, subscriptionTier);
    
    // Get budget status
    const budgetStatus = await costManagementService.getUserBudgetStatus(userId, subscriptionTier);
    
    // Get cost history
    const costHistory = await costManagementService.getUserCostHistory(userId, 10);
    
    return {
      success: true,
      data: {
        rateLimit: {
          limit: rateLimitStatus.limit,
          remaining: rateLimitStatus.remaining,
          reset: rateLimitStatus.reset
        },
        budget: {
          daily: {
            usage: budgetStatus.dailyUsage,
            limit: budgetStatus.dailyLimit,
            remaining: budgetStatus.dailyRemaining,
            percentUsed: budgetStatus.dailyPercentUsed
          },
          monthly: {
            usage: budgetStatus.monthlyUsage,
            limit: budgetStatus.monthlyLimit,
            remaining: budgetStatus.monthlyRemaining,
            percentUsed: budgetStatus.monthlyPercentUsed
          }
        },
        features: budgetStatus.features,
        recentCosts: costHistory.map(record => ({
          id: record.recordId,
          feature: record.featureType,
          model: record.modelName,
          tokens: record.totalTokens,
          cost: record.totalCost,
          timestamp: record.timestamp
        }))
      }
    };
  } catch (error) {
    console.error('Usage statistics error:', error);
    
    return {
      success: false,
      error: {
        code: 'USAGE_STATS_ERROR',
        message: 'Error retrieving usage statistics',
        details: { message: error.message }
      }
    };
  }
}

module.exports = {
  completeText,
  generateEmbeddings,
  getUserUsageStats,
  approximateTokenCount
};
