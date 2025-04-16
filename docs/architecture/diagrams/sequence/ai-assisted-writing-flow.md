# AI-Assisted Writing Flow Sequence Diagram

**Title**: AI-Assisted Writing Flow  
**Description**: Sequence diagram illustrating the interactions between components during an AI-assisted writing request  
**Last Updated**: 4/15/2025  

This diagram illustrates the sequence of interactions that occur when a user requests AI-assisted writing continuation from the Novylist system.

## Sequence Diagram

```mermaid
sequenceDiagram
    actor User as Novelist/Writer
    participant WA as Web Application
    participant API as API Server
    participant AS as Authentication Service
    participant RLCM as Rate Limiter & Cost Manager
    participant OAS as OpenAI Service
    participant CHS as Context Handling Service
    participant CS as Caching Service
    participant Redis as Redis
    participant OAI as OpenAI API
    participant DB as MongoDB Database
    
    User->>WA: Request writing continuation
    activate WA
    
    Note over WA: User writes content in Quill editor<br/>and requests AI continuation
    
    WA->>API: POST /api/v1/ai/writing/continuation
    activate API
    
    API->>AS: Validate JWT token
    activate AS
    AS-->>API: Token valid, user authenticated
    deactivate AS
    
    API->>RLCM: Check rate limits for user
    activate RLCM
    RLCM->>Redis: Get user's current usage
    activate Redis
    Redis-->>RLCM: Current usage data
    deactivate Redis
    
    alt Rate limit exceeded
        RLCM-->>API: Rate limit exceeded error
        API-->>WA: 429 Too Many Requests
        WA-->>User: Display rate limit error message
    else Rate limit available
        RLCM-->>API: Request allowed
        deactivate RLCM
        
        API->>OAS: Forward continuation request
        activate OAS
        
        OAS->>CHS: Process novel content context
        activate CHS
        
        CHS->>DB: Fetch related novel metadata (characters, plot)
        activate DB
        DB-->>CHS: Novel metadata
        deactivate DB
        
        Note over CHS: Apply text segmentation,<br/>generate summaries,<br/>select relevant context
        
        CHS-->>OAS: Processed context
        deactivate CHS
        
        OAS->>CS: Check cache for similar request
        activate CS
        CS->>Redis: Query cache
        activate Redis
        
        alt Cache hit
            Redis-->>CS: Cached response found
            CS-->>OAS: Return cached response
            
        else Cache miss
            Redis-->>CS: No cache hit
            deactivate Redis
            CS-->>OAS: Cache miss
            deactivate CS
            
            OAS->>RLCM: Estimate tokens and cost
            activate RLCM
            RLCM-->>OAS: Cost estimate and approval
            deactivate RLCM
            
            OAS->>OAI: Send request to OpenAI API
            activate OAI
            Note over OAI: Generate text completion<br/>with novel context
            OAI-->>OAS: API response with completion
            deactivate OAI
            
            OAS->>CS: Cache response
            activate CS
            CS->>Redis: Store in cache
            deactivate CS
            
            OAS->>RLCM: Update usage statistics
            activate RLCM
            RLCM->>Redis: Update usage counters
            deactivate RLCM
        end
        
        OAS-->>API: Return processed response
        deactivate OAS
        
        API-->>WA: JSON response with continuation
        deactivate API
        
        WA-->>User: Display continuation in editor
        Note over WA: User can accept, edit,<br/>or request new continuation
    end
    
    deactivate WA
```

## Flow Description

### 1. Request Initiation
The flow begins when a novelist or writer requests a writing continuation from the Novylist web application. This typically happens after the user has written some content and wants AI assistance to continue their narrative.

### 2. Authentication and Validation
- The Web Application sends a POST request to the API Server
- The API Server validates the user's JWT token using the Authentication Service
- If authentication fails, the flow stops with an appropriate error

### 3. Rate Limiting Check
- The API Server checks with the Rate Limiter & Cost Manager to determine if the user has available quota
- Rate Limiter checks Redis to get the user's current usage statistics
- If the user has exceeded their rate limit, an error is returned
- Otherwise, the request is allowed to proceed

### 4. Context Processing
- The OpenAI Service forwards the request to the Context Handling Service
- Context Handling Service fetches relevant metadata from the MongoDB Database (characters, plot elements)
- The service then processes the novel content using:
  - Text segmentation to break content into manageable chunks
  - Summarization for distant context
  - Selection of most relevant content based on token budget

### 5. Cache Check
- The OpenAI Service checks with the Caching Service to see if a similar request exists in the cache
- Caching Service queries Redis to look for a cache hit
- If a cached response is found, it's returned immediately (➡ Step 8)
- If no cache hit, the flow continues to the OpenAI API call

### 6. Token and Cost Management
- Before making an API call, the system estimates tokens and cost
- The Rate Limiter & Cost Manager approves the request if the user has sufficient budget

### 7. OpenAI API Interaction
- The OpenAI Service sends the processed context and prompt to the OpenAI API
- OpenAI API generates a completion based on the prompt
- The response is returned to the OpenAI Service

### 8. Response Processing
- If this was a new response (not from cache), it's stored in the cache
- Usage statistics are updated in Redis
- The response is processed and returned to the API Server
- The API Server formats and returns the JSON response to the Web Application
- The Web Application displays the continuation in the editor for the user

### 9. User Interaction with Result
- The user can accept the continuation as is
- Edit the continuation to match their preferences
- Request a new continuation with updated context

## Error Handling and Edge Cases

### Rate Limit Exceeded
If the user has exceeded their daily request limit:
1. The Rate Limiter returns a rate limit exceeded error
2. The API Server returns a 429 Too Many Requests response
3. The Web Application displays an appropriate error message to the user
4. The user may be shown their usage statistics and when the limit will reset

### Token Budget Exceeded
If the request would exceed the user's token budget:
1. The Rate Limiter & Cost Manager returns a budget exceeded error
2. The API Server returns a 403 Forbidden response
3. The Web Application displays an error message explaining the token budget limitations
4. The user may be offered options to upgrade their subscription tier

### OpenAI API Failure
If the OpenAI API call fails:
1. The OpenAI Service implements retry logic with exponential backoff
2. If retries fail, an appropriate error is returned
3. The Web Application displays an error message to the user
4. Failure details are logged for administrator review

## Performance Optimization

This flow includes several performance optimizations:
1. **Caching**: Similar requests are cached to avoid redundant API calls
2. **Context Selection**: Only the most relevant context is sent to save tokens and improve response quality
3. **Tiered Model Selection**: Different models are used based on the user's subscription tier
4. **Token Budget Allocation**: Token usage is carefully managed to maximize relevance within token limits

## Security Considerations

1. All API requests require valid JWT authentication
2. Rate limiting prevents abuse and denial of service
3. User novel content is kept secure and not stored by OpenAI beyond the request
4. API credentials are securely managed
5. Usage statistics are tracked to prevent unauthorized use

## Implementation Notes

- This flow balances performance, cost, and quality considerations
- The caching strategy significantly improves response times for similar requests
- Context handling is the most complex part of the flow, requiring careful token management
- The system is designed to handle very long novels through intelligent context selection
- Frontend has appropriate handling for loading states and errors during this process
