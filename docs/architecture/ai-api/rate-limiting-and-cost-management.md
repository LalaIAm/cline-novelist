# Rate Limiting and Cost Management for AI Features

This document describes the rate limiting and cost management systems implemented for Novylist's AI-assisted features.

## Overview

The rate limiting and cost management systems have been implemented to achieve several key goals:

1. **Limit API Usage**: Prevent abuse and ensure fair usage of AI features.
2. **Manage Costs**: Control and track expenses associated with OpenAI API usage.
3. **Support Tiered Access**: Provide different levels of access based on user subscription tiers.
4. **Optimize Performance**: Implement caching and efficient token usage to enhance performance.

## Components

The implementation consists of three main services:

1. **Rate Limiter Service**: Controls the frequency of API requests per user.
2. **Cost Management Service**: Tracks and manages costs associated with API usage.
3. **OpenAI Service**: Provides a unified interface for interacting with OpenAI APIs while enforcing limits.

### Rate Limiter Service

The rate limiter uses Redis to track and enforce limits on the number of API requests each user can make within a specific time period (daily). Limits are based on subscription tiers:

| Subscription Tier | Daily Request Limit | Monthly Token Budget |
|-------------------|---------------------|----------------------|
| Free              | 20 requests         | 100,000 tokens       |
| Standard          | 100 requests        | 500,000 tokens       |
| Premium           | Unlimited           | 2,000,000 tokens     |

Additionally, feature-specific token budgets are enforced:

| Feature               | Percentage of Total Budget |
|-----------------------|----------------------------|
| Writing Continuation  | 70%                        |
| Character Development | 10%                        |
| Plot Analysis         | 10%                        |
| Dialogue Enhancement  | 10%                        |

```javascript
// Example: Checking if a user has exceeded their rate limit
const rateLimitStatus = await rateLimiterService.checkRateLimit(userId, subscriptionTier);
```

### Cost Management Service

The cost management service tracks expenses associated with OpenAI API usage. It:

1. Estimates cost before sending requests
2. Records actual costs after requests
3. Enforces budget limits
4. Provides cost reporting

| Subscription Tier | Daily Budget | Monthly Budget |
|-------------------|--------------|----------------|
| Free              | $0.25        | $5.00          |
| Standard          | $1.00        | $25.00         |
| Premium           | $5.00        | $100.00        |

```javascript
// Example: Estimating the cost of a request
const costEstimate = costManagementService.estimateCost(modelName, inputTokens, outputTokens);
```

### OpenAI Service

The OpenAI service integrates with the rate limiter and cost management services to provide a unified interface for interacting with OpenAI APIs. It:

1. Enforces rate limits
2. Manages token budgets
3. Handles costs
4. Provides a consistent API for different AI features

It also implements tiered model selection:

| Subscription Tier | Default Model     | Special Features        |
|-------------------|-------------------|-------------------------|
| Free              | GPT-3.5-Turbo     | N/A                     |
| Standard          | GPT-3.5-Turbo     | N/A                     |
| Premium           | GPT-4-Turbo       | GPT-4 for select tasks  |

```javascript
// Example: Getting AI-generated content with rate limiting and cost management
const completionResult = await openaiService.completeText(
  userId,
  subscriptionTier,
  featureType,
  prompt,
  options
);
```

## Redis Configuration

The system uses Redis for storing rate limiting data and token budgets. Configuration is handled through environment variables:

```
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0
```

## Database Schema

User subscription and usage data is stored in the User model:

```javascript
subscription: {
  tier: {
    type: String,
    enum: ['free', 'standard', 'premium'],
    default: 'free',
  },
  // Other subscription fields...
},
usage: {
  aiRequests: {
    daily: {
      count: Number,
      lastReset: Date,
    },
    monthly: {
      tokensUsed: Number,
      lastReset: Date,
    },
  },
  features: {
    writingContinuation: {
      count: Number,
      tokensUsed: Number,
    },
    // Other feature usage stats...
  },
}
```

## API Endpoints

### Rate Limit Headers

All AI-related API responses include rate limit headers:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1618324800
```

### Usage Statistics

Endpoint: `GET /api/v1/ai/usage`

Provides detailed information about a user's AI usage, including:
- Rate limit status
- Budget status
- Feature-specific usage
- Recent cost history

### Cost Estimation

Endpoint: `POST /api/v1/ai/estimate-cost`

Allows frontend to estimate the cost of an AI request before sending it:

```json
{
  "featureType": "writingContinuation",
  "promptLength": 500,
  "outputLength": 300
}
```

## Error Handling

When a user exceeds their rate limit or budget, the API returns an appropriate error:

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED", // or "BUDGET_EXCEEDED", "TOKEN_BUDGET_EXCEEDED"
    "message": "You have reached your daily request limit",
    "details": {
      // Rate limit or budget details
    }
  }
}
```

## Implementing New AI Features

When adding new AI features:

1. Add a new feature type to the `FEATURE_LIMITS` in `rateLimiterService.js`
2. Update the User model to track usage for the new feature
3. Create API endpoint in `ai.js` controller
4. Register the endpoint in `ai.js` routes

```javascript
// Example: Adding a new feature type
const FEATURE_LIMITS = {
  writingContinuation: 0.7,
  characterDevelopment: 0.1,
  plotAnalysis: 0.1,
  dialogueEnhancement: 0.1,
  newFeature: 0.05  // Adjust others to ensure sum = 1.0
};
```

## Monitoring and Management

For operational monitoring:

1. Track Redis cache hit rates
2. Monitor API costs daily/monthly
3. Watch for users approaching their limits

Admin functionality allows:
- Resetting rate limits
- Adjusting token budgets
- Viewing usage statistics across users

## Best Practices

1. **Token Estimation**: Improve token estimation accuracy for better budget prediction
2. **Caching**: Implement semantic similarity caching for frequent queries
3. **Prompt Optimization**: Reduce token usage through efficient prompt design
4. **Graceful Degradation**: Provide fallbacks when limits are reached
5. **User Communication**: Clearly communicate limits to users
