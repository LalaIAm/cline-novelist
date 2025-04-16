# Error Handling and Resilience Strategy

## Overview

This document defines Novylist's comprehensive approach to error handling, fault tolerance, and resilience across the application stack. Effective error handling is critical for maintaining a robust user experience, especially in an AI-enhanced writing platform where complex integrations and long-running operations are common.

## Error Categorization

Novylist categorizes errors into the following groups to ensure appropriate handling and reporting:

### 1. Client-Side Errors

**Input Validation Errors**
- Description: Errors resulting from invalid user input
- HTTP Status Code: 400 Bad Request
- Handling: Detailed validation errors are returned to guide user correction

**Authentication Errors**
- Description: Errors related to user authentication
- HTTP Status Codes: 401 Unauthorized, 403 Forbidden
- Handling: Redirect to login or permission denied screens with appropriate messaging

**Resource Not Found Errors**
- Description: Requested resource does not exist
- HTTP Status Code: 404 Not Found
- Handling: User-friendly error page with navigation options

**Client-Side Timeouts**
- Description: Client operations that exceed expected time limits
- Handling: Automatic retry with exponential backoff, user notification

### 2. Server-Side Errors

**Internal Server Errors**
- Description: Unhandled exceptions or server logic failures
- HTTP Status Code: 500 Internal Server Error
- Handling: Graceful degradation, detailed logging, administrator alerts

**Service Unavailable Errors**
- Description: System overload or temporary maintenance
- HTTP Status Code: 503 Service Unavailable
- Handling: Retry-After headers, maintenance page, status updates

**Database Errors**
- Description: Connection issues, query failures, constraint violations
- Handling: Automatic retry for transient errors, fallback to cached data when appropriate

### 3. External Service Errors

**API Dependency Failures**
- Description: External API errors, particularly OpenAI API issues
- Handling: Graceful degradation, fallback to alternative services, caching strategies

**Network Connectivity Issues**
- Description: Connection timeouts, DNS failures, etc.
- Handling: Retry with exponential backoff, offline mode support where applicable

### 4. Business Logic Errors

**Rate Limiting Exceeded**
- Description: User has exceeded allowed operations (especially AI features)
- HTTP Status Code: 429 Too Many Requests
- Handling: Clear messaging about limits, upgrade suggestions, reset timing

**Subscription Limitations**
- Description: Attempting to access features not in current subscription tier
- HTTP Status Code: 402 Payment Required or 403 Forbidden
- Handling: Subscription tier explanations, upgrade options

**Resource Conflicts**
- Description: Concurrent edit conflicts, version control issues
- HTTP Status Code: 409 Conflict
- Handling: Merge options, version history management, conflict resolution UI

## Standard Error Response Format

All API endpoints implement a consistent error response format:

```json
{
  "success": false,
  "message": "Human-readable error message",
  "errorCode": "ERROR_CODE_IDENTIFIER",
  "errors": {
    "field1": "Specific validation error for field1",
    "field2": "Specific validation error for field2"
  },
  "timestamp": "2025-04-15T17:30:45.123Z",
  "requestId": "req_1234567890",
  "retryAfter": 30,
  "help": "https://docs.novylist.com/errors/ERROR_CODE_IDENTIFIER"
}
```

### Error Response Fields

- `success`: Always `false` for error responses
- `message`: Human-readable error message suitable for displaying to users
- `errorCode`: Unique identifier for the specific error type (for documentation referencing)
- `errors`: Object containing field-specific validation errors (for form validation)
- `timestamp`: ISO 8601 timestamp of when the error occurred
- `requestId`: Unique identifier for the request (for support and debugging)
- `retryAfter`: Seconds until the request can be retried (for rate limiting)
- `help`: URL to documentation about this error and resolution steps

## Client-Side Error Handling

### Form Validation

1. **Progressive Validation**
   - Validate on blur for immediate feedback
   - Full validation on submit
   - Clear visual indicators of validation status

2. **Validation Rules**
   - Consistent validation rules shared between client and server
   - Localized error messages
   - Context-aware validation (e.g., different rules based on content type)

3. **Error Display**
   - Field-level error messages displayed adjacent to inputs
   - Form-level error summary for accessibility
   - Color coding and icons for visual indicators

### Network Error Handling

1. **Request/Response Interceptors**
   - Global Axios/Fetch interceptors to handle common errors
   - Authentication token refresh on 401 responses
   - Automatic retry for idempotent requests

2. **Offline Detection**
   - Online/offline status monitoring
   - Offline mode that queues writes for later sync
   - Optimistic UI updates with conflict resolution

3. **Loading States**
   - Skeleton loaders for content in loading state
   - Progress indicators for long-running operations
   - Cancelable requests where appropriate

## Server-Side Error Handling

### Express Middleware

1. **Input Validation Middleware**
   - Validates request parameters, query strings, and body
   - Returns standardized validation error responses
   - Sanitizes inputs to prevent injection attacks

2. **Error Handling Middleware**
   - Central error handler for consistency
   - Error type mapping to appropriate HTTP status codes
   - Shields stack traces from production responses

3. **Rate Limiting Middleware**
   - Tiered rate limits based on user subscription
   - Clear response headers for limit tracking
   - Graceful handling of rate limit exhaustion

### Database Error Handling

1. **Connection Management**
   - Connection pooling with health checks
   - Automatic reconnection strategies
   - Read replicas for failover

2. **Query Error Handling**
   - Specific error types for common database issues
   - Transaction management for atomic operations
   - Deadlock detection and retry

3. **Data Validation**
   - Schema validation before database operations
   - Consistent constraint naming for error mapping
   - Business logic validation layer above database constraints

## External Service Resilience

### OpenAI API Integration

1. **Rate Limit Management**
   - Token bucket implementation for per-user rate limiting
   - Proactive rate limit tracking to prevent API rejections
   - Queue system for high-demand periods

2. **Fault Tolerance**
   - Circuit breaker pattern for API outages
   - Fallback to simpler models when advanced models fail
   - Cached responses for common queries

3. **Response Validation**
   - Schema validation for API responses
   - Content moderation checks
   - Response size and token count verification

### General API Resilience

1. **Circuit Breaker Implementation**
   - Automatic service isolation during failures
   - Half-open state for recovery testing
   - Configurable thresholds based on service criticality

2. **Retry Strategy**
   - Exponential backoff with jitter
   - Idempotency keys for safe retries
   - Maximum retry limits to prevent cascading failures

3. **Fallback Mechanisms**
   - Default values or cached data when services are unavailable
   - Graceful degradation of features
   - Clear user messaging about limited functionality

## Monitoring and Alerting

### Error Logging

1. **Structured Logging**
   - JSON-formatted logs with consistent fields
   - Error correlation with request IDs
   - Context-rich error details including user and session info

2. **Log Levels**
   - ERROR: Runtime errors that require intervention
   - WARN: Potential issues that don't cause failures
   - INFO: System events and state changes
   - DEBUG: Detailed debugging information (non-production)

3. **Centralized Log Management**
   - Aggregated logs across services
   - Log retention policies
   - Search and analysis capabilities

### Error Metrics

1. **Error Rate Monitoring**
   - Error rates by endpoint and error type
   - Baseline deviation alerts
   - User impact metrics

2. **SLA Monitoring**
   - Response time thresholds
   - Error budget tracking
   - Availability metrics

3. **User Experience Metrics**
   - Rage clicks detection
   - Form abandonment tracking
   - Error-related support ticket correlation

### Alerting System

1. **Alert Priorities**
   - P0: Critical service outage requiring immediate response
   - P1: Major functionality affected requiring same-day response
   - P2: Minor issues to be addressed in normal work hours
   - P3: Non-urgent improvements to be planned

2. **Alert Channels**
   - On-call rotation for critical alerts
   - Team notifications for major issues
   - Ticketing system for minor issues
   - Status page updates for user-impacting problems

3. **Alert Filtering**
   - Noise reduction through error aggregation
   - Alert suppression during known maintenance
   - Correlation of related alerts

## Error Recovery

### Automated Recovery

1. **Self-Healing Mechanisms**
   - Automated service restarts on detection of unhealthy state
   - Data integrity checks with automatic correction
   - Cache invalidation on detection of stale data

2. **Data Recovery**
   - Regular automated backups
   - Point-in-time recovery capabilities
   - Transaction logs for fine-grained recovery

3. **State Reconciliation**
   - Background jobs to fix inconsistent states
   - Periodic data validation checks
   - Conflict resolution workflows

### Manual Recovery

1. **Administrative Tools**
   - Admin dashboard for system status
   - Manual intervention capabilities
   - Audit logs of recovery actions

2. **Rollback Procedures**
   - Documented rollback processes for deployments
   - Database restoration procedures
   - Version control for content

3. **Incident Response**
   - Defined incident commander role
   - Communication templates
   - Post-mortem process

## Implementation Examples

### Express Error Handler

```javascript
// Central error handling middleware
function errorHandler(err, req, res, next) {
  // Default error status and message
  let status = 500;
  let message = 'Internal Server Error';
  let errorCode = 'INTERNAL_ERROR';
  let errors = {};
  let retryAfter = null;

  // Map error types to appropriate responses
  if (err instanceof ValidationError) {
    status = 400;
    message = 'Validation Error';
    errorCode = 'VALIDATION_ERROR';
    errors = err.errors;
  } else if (err instanceof AuthenticationError) {
    status = 401;
    message = 'Authentication Required';
    errorCode = 'AUTH_REQUIRED';
  } else if (err instanceof ForbiddenError) {
    status = 403;
    message = 'Permission Denied';
    errorCode = 'PERMISSION_DENIED';
  } else if (err instanceof NotFoundError) {
    status = 404;
    message = 'Resource Not Found';
    errorCode = 'NOT_FOUND';
  } else if (err instanceof RateLimitError) {
    status = 429;
    message = 'Rate Limit Exceeded';
    errorCode = 'RATE_LIMIT_EXCEEDED';
    retryAfter = err.retryAfter;
  }

  // Log detailed error for internal monitoring
  logger.error({
    errorCode,
    message: err.message,
    stack: err.stack,
    requestId: req.id,
    userId: req.user?.id,
    path: req.path,
    method: req.method
  });

  // Send standardized response to client
  const errorResponse = {
    success: false,
    message,
    errorCode,
    timestamp: new Date().toISOString(),
    requestId: req.id,
    help: `https://docs.novylist.com/errors/${errorCode}`
  };

  // Add optional fields if present
  if (Object.keys(errors).length > 0) {
    errorResponse.errors = errors;
  }
  
  if (retryAfter) {
    errorResponse.retryAfter = retryAfter;
    res.set('Retry-After', retryAfter.toString());
  }

  // Send error response
  res.status(status).json(errorResponse);
}

module.exports = errorHandler;
```

### React Error Handling

```jsx
// API request with error handling
import { useState, useEffect } from 'react';
import { useToast } from '../components/ui/toast';
import apiClient from '../utils/apiClient';

function useApiRequest(endpoint, options = {}) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const { signal } = controller;

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await apiClient.request({
          url: endpoint,
          signal,
          ...options
        });
        
        if (isMounted) {
          setData(response.data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          // Handle different error types
          if (err.response) {
            // Server responded with error
            setError(err.response.data);
            
            // Show appropriate user-facing error
            if (err.response.status === 401) {
              toast.error('Your session has expired. Please log in again.');
            } else if (err.response.status === 403) {
              toast.error('You don\'t have permission to perform this action.');
            } else if (err.response.status === 429) {
              const retryAfter = err.response.headers['retry-after'] || 60;
              toast.error(`Rate limit exceeded. Please try again in ${retryAfter} seconds.`);
            } else {
              toast.error(err.response.data.message || 'An error occurred');
            }
          } else if (err.request) {
            // Request made but no response received
            setError({ message: 'Network error, please check your connection' });
            toast.error('Network error, please check your connection');
          } else {
            // Something else happened
            setError({ message: err.message });
            toast.error('An unexpected error occurred');
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [endpoint]);

  return { data, error, loading };
}

export default useApiRequest;
```

### Circuit Breaker Implementation

```javascript
class CircuitBreaker {
  constructor(serviceFunction, options = {}) {
    this.serviceFunction = serviceFunction;
    this.state = 'CLOSED'; // CLOSED, OPEN, HALF-OPEN
    this.failureThreshold = options.failureThreshold || 5;
    this.resetTimeout = options.resetTimeout || 30000; // 30 seconds
    this.failureCount = 0;
    this.lastFailureTime = null;
    this.fallbackFunction = options.fallback || null;
    this.onStateChange = options.onStateChange || (() => {});
    this.name = options.name || 'Service';
  }

  async execute(...args) {
    if (this.state === 'OPEN') {
      if (Date.now() > this.lastFailureTime + this.resetTimeout) {
        this.state = 'HALF-OPEN';
        this.onStateChange(this.state, this.name);
        logger.info(`Circuit changed to HALF-OPEN for ${this.name}`);
      } else {
        logger.warn(`Circuit OPEN for ${this.name}, using fallback`);
        return this.executeFallback(...args);
      }
    }

    try {
      const result = await this.serviceFunction(...args);
      this.recordSuccess();
      return result;
    } catch (error) {
      return this.handleError(error, ...args);
    }
  }

  recordSuccess() {
    if (this.state === 'HALF-OPEN') {
      this.failureCount = 0;
      this.state = 'CLOSED';
      this.onStateChange(this.state, this.name);
      logger.info(`Circuit reset to CLOSED for ${this.name}`);
    }
  }

  async handleError(error, ...args) {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    
    logger.error(`Service ${this.name} error: ${error.message}, failure count: ${this.failureCount}`);

    if (this.state === 'CLOSED' && this.failureCount >= this.failureThreshold) {
      this.state = 'OPEN';
      this.onStateChange(this.state, this.name);
      logger.warn(`Circuit opened for ${this.name} due to ${this.failureCount} failures`);
    }

    if (this.state === 'HALF-OPEN') {
      this.state = 'OPEN';
      this.onStateChange(this.state, this.name);
      logger.warn(`Circuit re-opened for ${this.name} after test failure`);
    }

    return this.executeFallback(...args);
  }

  async executeFallback(...args) {
    if (this.fallbackFunction) {
      return this.fallbackFunction(...args);
    } else {
      throw new Error(`Service ${this.name} is currently unavailable`);
    }
  }
}

module.exports = CircuitBreaker;
```

### Rate Limiter for OpenAI API

```javascript
const Redis = require('ioredis');
const redis = new Redis(process.env.REDIS_URL);

class RateLimiter {
  constructor() {
    this.limitsConfig = {
      free: {
        requestsPerDay: 20,
        tokensPerMonth: 100000
      },
      standard: {
        requestsPerDay: 100,
        tokensPerMonth: 500000
      },
      premium: {
        requestsPerDay: 500,
        tokensPerMonth: 2000000
      }
    };
  }

  async checkRateLimit(userId, subscription = 'free') {
    const today = new Date().toISOString().split('T')[0];
    const month = today.substring(0, 7);
    
    const dailyKey = `rate:${userId}:requests:${today}`;
    const monthlyKey = `rate:${userId}:tokens:${month}`;
    
    const limits = this.limitsConfig[subscription] || this.limitsConfig.free;
    
    // Get current usage
    const [dailyUsage, monthlyTokens] = await Promise.all([
      redis.get(dailyKey) || 0,
      redis.get(monthlyKey) || 0
    ]);
    
    // Check if limits exceeded
    const requestsExceeded = parseInt(dailyUsage) >= limits.requestsPerDay;
    const tokensExceeded = parseInt(monthlyTokens) >= limits.tokensPerMonth;
    
    if (requestsExceeded || tokensExceeded) {
      const resetTime = requestsExceeded ? 
        this.getNextDayTimestamp() : 
        this.getNextMonthTimestamp();
        
      const reason = requestsExceeded ? 
        `daily limit of ${limits.requestsPerDay} requests` : 
        `monthly limit of ${limits.tokensPerMonth} tokens`;
        
      logger.warn(`Rate limit exceeded for user ${userId}: ${reason}`);
        
      const error = new RateLimitError(
        `You've exceeded your ${reason}`,
        Math.ceil((resetTime - Date.now()) / 1000)
      );
      
      error.limit = requestsExceeded ? limits.requestsPerDay : limits.tokensPerMonth;
      error.current = requestsExceeded ? parseInt(dailyUsage) : parseInt(monthlyTokens);
      error.resetTimestamp = resetTime;
      
      throw error;
    }
    
    // Update usage
    await redis.incr(dailyKey);
    if (parseInt(dailyUsage) === 0) {
      await redis.expire(dailyKey, 86400); // 24 hours
    }
    
    return {
      remainingRequests: limits.requestsPerDay - parseInt(dailyUsage) - 1,
      remainingTokens: limits.tokensPerMonth - parseInt(monthlyTokens),
      subscription
    };
  }
  
  async recordTokenUsage(userId, tokens, subscription = 'free') {
    const month = new Date().toISOString().split('T')[0].substring(0, 7);
    const key = `rate:${userId}:tokens:${month}`;
    
    await redis.incrby(key, tokens);
    await redis.expire(key, 2678400); // 31 days
    
    const currentUsage = await redis.get(key);
    const limits = this.limitsConfig[subscription] || this.limitsConfig.free;
    
    return {
      tokensUsed: parseInt(currentUsage),
      tokensRemaining: Math.max(0, limits.tokensPerMonth - parseInt(currentUsage)),
      tokensLimit: limits.tokensPerMonth
    };
  }

  getNextDayTimestamp() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow.getTime();
  }
  
  getNextMonthTimestamp() {
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    nextMonth.setDate(1);
    nextMonth.setHours(0, 0, 0, 0);
    return nextMonth.getTime();
  }
}

module.exports = new RateLimiter();
```

## Testing Error Scenarios

### Unit Testing

- Test error handling functions with various error types
- Verify correct error response formats
- Test boundary conditions for validation

### Integration Testing

- Simulate database connection failures
- Test API endpoint error responses
- Verify correct HTTP status codes and headers

### End-to-End Testing

- Test user-facing error messages and UI
- Verify retry mechanisms and fallbacks
- Simulate network interruptions during operations

### Chaos Testing

- Randomly kill services to test resilience
- Simulate latency spikes in API responses
- Test system under load with degraded resources

## Conclusion

This error handling and resilience strategy ensures that Novylist can provide a robust and reliable experience for users, even in the face of unexpected errors or external service failures. By implementing consistent error handling patterns, proactive monitoring, and graceful degradation, the platform can maintain user trust and data integrity while minimizing disruptions.

The strategy will be continuously refined based on real-world error patterns and user feedback, with regular reviews to identify areas for improvement.
