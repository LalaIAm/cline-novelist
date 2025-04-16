# Caching Mechanisms for AI-Assisted Writing

## Metadata
- **Experiment ID**: EXP-003
- **Date**: 4/13/2025
- **Researcher**: Novylist Team
- **Category**: Performance Optimization
- **Status**: Planned

## Objective
To evaluate and implement effective caching strategies for AI-assisted writing features, optimizing for performance, cost efficiency, and user experience while maintaining response quality.

## Background
AI-assisted writing features in Novylist will make frequent API calls to language models, which can lead to:
1. Increased latency for users
2. Higher operational costs from repeated API calls
3. Potential rate limiting issues during peak usage

Effective caching can mitigate these issues by storing results of previous API calls and serving them when appropriate instead of making new calls. However, caching strategies must be carefully designed to balance performance gains with maintaining relevant, contextual assistance.

## Hypothesis
A multi-level caching strategy combining exact match, semantic similarity, and parameter-aware caching will significantly reduce API call frequency and latency while maintaining response quality for common writing assistance tasks.

## Methodology

### Caching Strategies to Evaluate

1. **Exact Match Caching**
   - Cache responses using exact prompt strings as keys
   - Pros: Simple implementation, guaranteed identical results
   - Cons: Low hit rate due to unique prompts

2. **Context-Aware Caching**
   - Cache responses with awareness of novel context
   - Use metadata (characters, plot elements, etc.) as part of cache key
   - Pros: Higher hit rate for similar contexts
   - Cons: More complex implementation

3. **Semantic Similarity Caching**
   - Use embeddings to find similar previous prompts
   - Return cached results for prompts above similarity threshold
   - Pros: Higher hit rate for semantically similar requests
   - Cons: Complex implementation, possibility of incorrect matches

4. **Parameter-Aware Caching**
   - Cache with awareness of model parameters (temperature, etc.)
   - Only return cached results for similar parameter configurations
   - Pros: Ensures consistency in response style
   - Cons: Reduces cache hit rate

5. **Hybrid Approach**
   - Combine multiple strategies with tiered fallbacks
   - Exact match → Semantic similarity → API call
   - Pros: Balance between hit rate and accuracy
   - Cons: Implementation complexity

### Cache Management Strategies

1. **Time-Based Expiration**
   - Expire cache entries after set time period
   - Different expiration times for different assistance types

2. **LRU (Least Recently Used) Eviction**
   - Maintain maximum cache size
   - Evict least recently accessed entries when full

3. **Context-Aware Invalidation**
   - Invalidate cached entries when novel context changes
   - E.g., when characters or plot elements are modified

4. **User-Specific Caching**
   - Maintain separate caches for different users
   - Personalized to individual writing styles and projects

### Metrics to Measure

1. **Cache Hit Rate**
   - Percentage of requests served from cache vs. API calls
   - Target: >40% for common writing assistance tasks

2. **Latency Reduction**
   - Comparison of response times: cached vs. API calls
   - Target: 95%+ reduction for cache hits

3. **Cost Savings**
   - Estimated API cost reduction from caching
   - Target: >30% reduction in overall API costs

4. **Response Quality Impact**
   - User satisfaction with cached vs. fresh responses
   - Target: No statistically significant difference

5. **Memory Usage**
   - Size of cache and impact on server resources
   - Target: Manageable within application constraints

### Implementation Components

1. **Cache Store**
   - Redis for distributed caching
   - In-memory cache for single-instance deployments
   - Persistent storage for expensive computations

2. **Cache Key Generation**
   - Deterministic key generation from prompt and parameters
   - Context-aware hashing strategies

3. **Similarity Computation**
   - Embedding generation for prompts
   - Vector similarity calculation
   - Threshold determination for "similar enough"

4. **Cache Warmup Strategies**
   - Pre-populate cache with common writing assistance tasks
   - Generate cache entries during low-traffic periods

5. **Analytics and Monitoring**
   - Track hit/miss rates
   - Monitor latency improvements
   - Calculate cost savings

### Procedure
1. Implement each caching strategy in an isolated environment
2. Create benchmark test suite with representative writing assistance tasks
3. Run tests with varying cache sizes and configurations
4. Measure all metrics for each strategy
5. Simulate user load patterns
6. Analyze results for optimal configuration

## Implementation Plan

### Phase 1: Basic Caching (Exact Match)
- Implement simple key-value store with Redis
- Add exact match caching for writing continuation feature
- Establish baseline metrics
- Test with synthetic workload

### Phase 2: Advanced Caching Strategies
- Implement semantic similarity with embeddings
- Add context-aware caching logic
- Develop parameter-aware cache keys
- Test different cache eviction policies

### Phase 3: Optimization and Tuning
- Fine-tune similarity thresholds
- Optimize cache key generation
- Determine ideal cache sizes and TTLs
- Implement adaptive caching based on hit rates

### Phase 4: Integration and Production Testing
- Integrate optimal caching strategy into main application
- Test with real user workloads
- Measure performance in production environment
- Implement monitoring and alerting

## Expected Results

We anticipate:
1. Exact match caching will have low hit rates (<10%) but perfect accuracy
2. Semantic similarity will significantly improve hit rates (30-50%) with minimal quality impact
3. Context-aware caching will be essential for novel-specific assistance
4. Hybrid approaches will provide the best balance of performance and quality
5. Overall API cost reduction of 30-40% with proper cache configuration

## Challenges and Considerations

1. **Response Consistency**
   - Cached responses must remain relevant as novel context evolves
   - Need to determine when context changes warrant cache invalidation

2. **Cache Poisoning**
   - Poor quality responses could be cached and reused
   - Need mechanisms to prevent or purge low-quality cache entries

3. **Cold Start Problem**
   - New users or novels will have empty caches initially
   - Need strategies for cache warming and fallbacks

4. **Storage Requirements**
   - Large novels with many assistance requests could create large caches
   - Need efficient storage and pruning strategies

5. **Privacy Considerations**
   - Cached content may contain sensitive or private novel content
   - Need secure storage and appropriate access controls

## Code Examples

### Basic Exact Match Caching

```javascript
// Example caching middleware for writing continuation requests
async function cachingMiddleware(req, res, next) {
  const cacheKey = generateCacheKey(req.body.prompt, req.body.parameters);
  
  try {
    // Check if response exists in cache
    const cachedResponse = await redisClient.get(cacheKey);
    
    if (cachedResponse) {
      console.log(`Cache hit for key: ${cacheKey}`);
      return res.json(JSON.parse(cachedResponse));
    }
    
    // Cache miss - store original handler response
    const originalSend = res.send;
    res.send = function(body) {
      const response = JSON.parse(body);
      // Store in cache with TTL
      redisClient.set(cacheKey, body, 'EX', 60 * 60 * 24); // 24-hour TTL
      originalSend.call(this, body);
    };
    
    next();
  } catch (error) {
    console.error("Caching error:", error);
    next();
  }
}

function generateCacheKey(prompt, parameters) {
  // Create deterministic hash from prompt and relevant parameters
  return createHash('sha256')
    .update(JSON.stringify({
      prompt,
      temperature: parameters.temperature,
      maxTokens: parameters.maxTokens
    }))
    .digest('hex');
}
```

### Semantic Similarity Caching

```javascript
async function semanticCachingMiddleware(req, res, next) {
  const { prompt, parameters } = req.body;
  
  try {
    // Get embedding for current prompt
    const currentEmbedding = await getEmbedding(prompt);
    
    // Find similar prompts in cache
    const similarPrompts = await findSimilarPrompts(currentEmbedding, 0.92); // Threshold
    
    if (similarPrompts.length > 0) {
      // Return most similar cache entry
      const bestMatch = similarPrompts[0];
      console.log(`Semantic cache hit (similarity: ${bestMatch.similarity})`);
      return res.json(bestMatch.response);
    }
    
    // Cache miss logic...
    next();
  } catch (error) {
    console.error("Semantic caching error:", error);
    next();
  }
}

async function getEmbedding(text) {
  const response = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: text,
  });
  return response.data[0].embedding;
}

async function findSimilarPrompts(embedding, threshold) {
  // In production, this would use vector database like Pinecone
  // For simplicity, this example uses in-memory comparison
  const similarPrompts = [];
  
  for (const cacheEntry of embeddingCache) {
    const similarity = cosineSimilarity(embedding, cacheEntry.embedding);
    if (similarity > threshold) {
      similarPrompts.push({
        ...cacheEntry,
        similarity
      });
    }
  }
  
  return similarPrompts.sort((a, b) => b.similarity - a.similarity);
}
```

## Next Steps

1. Implement basic exact match caching for the writing continuation prototype
2. Create benchmark suite for different writing assistance tasks
3. Research vector database options for semantic similarity caching
4. Develop cache analytics dashboard for monitoring performance
5. Design cache warming strategy for common request patterns

## Appendices

### Cache Key Design Considerations

Different assistance types require different cache key components:

1. **Writing Continuation**
   - Recent text (last N tokens)
   - Key metadata: POV, genre, tone
   - Current characters in scene

2. **Character Development**
   - Character name and key attributes
   - Request type (personality, background, etc.)

3. **Plot Suggestions**
   - Plot outline
   - Current plot point
   - Request type (conflict, resolution, etc.)

### References

- Redis Documentation: https://redis.io/documentation
- Vector Similarity Search: https://www.pinecone.io/learn/
- Caching Best Practices: https://aws.amazon.com/caching/best-practices/
- Embedding Models: https://platform.openai.com/docs/guides/embeddings
