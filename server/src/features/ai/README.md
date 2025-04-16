# AI Rate Limiting and Cost Management

This directory contains the implementation of rate limiting and cost management for AI-assisted features in Novylist.

## Overview

The system provides:
- Tiered rate limiting based on user subscription
- Token budget management for API usage
- Cost tracking and reporting
- Model selection based on subscription tier
- Detailed usage statistics

## Components

- **Redis Configuration** - Sets up Redis for rate limiting storage
- **Rate Limiter Service** - Enforces request rate limits and token budgets
- **Cost Management Service** - Tracks and controls AI API costs
- **OpenAI Service** - Integrates with OpenAI API with rate limiting and cost controls
- **AI Controller** - Handles AI feature API endpoints
- **AI Routes** - Defines API routes for AI features

## Configuration

Configuration is managed through environment variables (see `.env.example`):

```
# Redis Configuration (for rate limiting)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# OpenAI API Configuration
OPENAI_API_KEY=your_openai_api_key
```

## Rate Limits

| Subscription Tier | Daily Request Limit | Monthly Token Budget |
|-------------------|---------------------|----------------------|
| Free              | 20 requests         | 100,000 tokens       |
| Standard          | 100 requests        | 500,000 tokens       |
| Premium           | Unlimited           | 2,000,000 tokens     |

## API Endpoints

- **Writing Continuation**: `POST /api/v1/ai/writing/continuation`
- **Character Suggestions**: `POST /api/v1/ai/character/suggestions`
- **Plot Analysis**: `POST /api/v1/ai/plot/analysis`
- **Dialogue Enhancement**: `POST /api/v1/ai/dialogue/enhance`
- **AI Settings**: `GET/PUT /api/v1/ai/settings`
- **Usage Statistics**: `GET /api/v1/ai/usage`
- **Cost Estimation**: `POST /api/v1/ai/estimate-cost`

## Running Locally

### Prerequisites

1. Node.js and npm installed
2. Redis server running
3. MongoDB instance available
4. OpenAI API key

### Setup

1. Install dependencies:
   ```bash
   ./install-dependencies.sh
   ```

2. Configure environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. Start the server:
   ```bash
   npm run dev
   ```

## Testing Rate Limiting

You can test rate limiting by making multiple requests to any AI endpoint.
After reaching the limit for your tier, you'll receive a rate limit error.

Example response when limit is exceeded:
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "You have reached your daily request limit",
    "details": {
      "limit": 20,
      "remaining": 0,
      "reset": 1681574400,
      "tierName": "free"
    }
  }
}
```

## Monitoring Usage

Use the usage statistics endpoint to monitor API usage:
```
GET /api/v1/ai/usage
```

This returns information about:
- Rate limit status
- Budget usage
- Feature-specific statistics
- Recent request history

## Documentation

For more detailed information, see the architecture documentation:
```
docs/architecture/ai-api/rate-limiting-and-cost-management.md
