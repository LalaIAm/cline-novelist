/**
 * Context Handling Service
 * 
 * This service handles extracting, processing, and managing context for AI operations
 * when working with novel-length content. It provides efficient context windowing,
 * summarization, and selection strategies to optimize token usage while maintaining
 * coherence and quality in AI outputs.
 */
class ContextHandlingService {
  /**
   * Create a new context handling service
   * 
   * @param {Object} config - Configuration options
   * @param {Object} config.tokenBudget - Token allocation for different context components
   * @param {number} config.tokenBudget.current - Tokens for the current content
   * @param {number} config.tokenBudget.nearby - Tokens for nearby content
   * @param {number} config.tokenBudget.summaries - Tokens for summarized content
   * @param {number} config.tokenBudget.metadata - Tokens for metadata (characters, settings, etc.)
   * @param {number} config.tokenBudget.similar - Tokens for similar content from elsewhere
   * @param {Object} config.strategies - Context handling strategies
   * @param {function} config.tokenCounter - Function to count tokens
   * @param {Object} config.cache - Caching options
   */
  constructor(config = {}) {
    this.config = {
      tokenBudget: {
        current: 1000,   // Tokens for the immediate content being worked on
        nearby: 1000,    // Tokens for content before and after current
        summaries: 500,  // Tokens for summarized content
        metadata: 300,   // Tokens for character/plot metadata
        similar: 500     // Tokens for semantically similar content
      },
      strategies: {
        windowingStrategy: 'balanced',  // balanced, current-heavy, history-heavy
        summaryStrategy: 'multi-level', // none, simple, multi-level
        metadataStrategy: 'relevant',   // none, minimal, relevant, comprehensive
        cacheStrategy: 'hybrid'         // none, memory, persistent, hybrid
      },
      ...config
    };
    
    // Keep track of the total tokens used in the latest context
    this.lastContextTokens = {
      current: 0,
      nearby: 0,
      summaries: 0,
      metadata: 0,
      similar: 0,
      total: 0
    };
    
    // Cache for context-related data
    this.cache = {
      summaries: new Map(),
      embeddings: new Map(),
      contextResults: new Map()
    };
  }

  /**
   * Get optimal context for an AI operation
   * 
   * @param {Object} params - Context parameters
   * @param {string} params.currentContent - The immediate content being worked on
   * @param {Object} params.document - The document structure
   * @param {Object} params.position - Position in the document
   * @param {string} params.position.chapterId - Current chapter ID
   * @param {string} params.position.sceneId - Current scene ID
   * @param {string} params.position.beatId - Current beat ID
   * @param {Object} params.metadata - Novel metadata (characters, settings, etc.)
   * @param {Object} params.options - Additional options
   * @param {number} params.options.maxTokens - Maximum tokens for context
   * @param {string} params.options.purpose - Purpose of the context (continuation, analysis, etc.)
   * @param {function} params.tokenCounter - Function to count tokens
   * @returns {Object} Optimized context object
   */
  async getContext(params) {
    const {
      currentContent,
      document,
      position,
      metadata,
      options = {},
      tokenCounter
    } = params;
    
    // Check cache for similar context request
    const cacheKey = this._generateCacheKey(params);
    if (this.cache.contextResults.has(cacheKey)) {
      console.log('Context cache hit');
      return this.cache.contextResults.get(cacheKey);
    }
    
    console.log('Context cache miss, generating new context');
    
    // Merge options with defaults
    const contextOptions = {
      maxTokens: options.maxTokens || 4000,
      purpose: options.purpose || 'continuation',
      ...options
    };
    
    // Adjust token budget based on max tokens
    const tokenBudget = this._adjustTokenBudget(contextOptions.maxTokens);
    
    // Use the provided token counter or a simple approximation
    const countTokens = tokenCounter || this._estimateTokenCount;
    
    // 1. Get the immediate content window
    const currentWindow = await this._getCurrentWindow({
      currentContent,
      document,
      position,
      tokenBudget: tokenBudget.current,
      countTokens
    });
    
    // 2. Get nearby content (preceding and following the current content)
    const nearbyContent = await this._getNearbyContent({
      document,
      position,
      tokenBudget: tokenBudget.nearby,
      countTokens
    });
    
    // 3. Get document summaries
    const summaries = await this._getSummaries({
      document,
      position,
      tokenBudget: tokenBudget.summaries,
      countTokens
    });
    
    // 4. Get relevant metadata
    const relevantMetadata = await this._getRelevantMetadata({
      metadata,
      currentContent,
      position,
      document,
      tokenBudget: tokenBudget.metadata,
      countTokens
    });
    
    // 5. Get semantically similar content from elsewhere in the document
    const similarContent = await this._getSimilarContent({
      currentContent,
      document,
      tokenBudget: tokenBudget.similar,
      countTokens
    });
    
    // Assemble the final context object
    const context = {
      current: currentWindow,
      nearby: nearbyContent,
      summaries,
      metadata: relevantMetadata,
      similar: similarContent
    };
    
    // Calculate token usage
    this.lastContextTokens = {
      current: countTokens(currentWindow),
      nearby: countTokens(nearbyContent),
      summaries: countTokens(summaries),
      metadata: countTokens(relevantMetadata),
      similar: countTokens(similarContent),
      total: countTokens(JSON.stringify(context))
    };
    
    // Cache the result
    this.cache.contextResults.set(cacheKey, context);
    
    return context;
  }

  /**
   * Create a formatted prompt with the optimized context
   * 
   * @param {Object} context - Context object from getContext()
   * @param {Object} promptTemplate - Prompt template object
   * @param {Object} additionalParams - Additional parameters for the prompt
   * @returns {Object} Formatted prompt for AI service
   */
  createPromptWithContext(context, promptTemplate, additionalParams = {}) {
    // Ensure we have both context and template
    if (!context || !promptTemplate) {
      throw new Error('Context and prompt template are required');
    }
    
    // Use the appropriate template format based on promptTemplate.type
    switch (promptTemplate.type) {
      case 'text':
        return this._createTextPrompt(context, promptTemplate, additionalParams);
      
      case 'chat':
        return this._createChatPrompt(context, promptTemplate, additionalParams);
      
      default:
        throw new Error(`Unknown prompt template type: ${promptTemplate.type}`);
    }
  }

  /**
   * Format the context as a single string for insertion into prompts
   * 
   * @param {Object} context - Context object from getContext()
   * @param {Object} options - Formatting options
   * @returns {string} Formatted context as a string
   */
  formatContextAsString(context, options = {}) {
    const parts = [];
    
    // Add summaries
    if (context.summaries && context.summaries.trim()) {
      parts.push(
        '# STORY CONTEXT\n' +
        context.summaries
      );
    }
    
    // Add metadata
    if (context.metadata && context.metadata.trim()) {
      parts.push(
        '# RELEVANT INFORMATION\n' +
        context.metadata
      );
    }
    
    // Add similar content if available
    if (context.similar && context.similar.trim()) {
      parts.push(
        '# RELATED PASSAGES\n' +
        context.similar
      );
    }
    
    // Add nearby content
    if (context.nearby && context.nearby.trim()) {
      parts.push(
        '# SURROUNDING CONTENT\n' +
        context.nearby
      );
    }
    
    // Add the current content last as it's most important
    if (context.current && context.current.trim()) {
      parts.push(
        '# CURRENT CONTENT\n' +
        context.current
      );
    }
    
    return parts.join('\n\n');
  }

  /**
   * Clear all caches
   */
  clearCache() {
    this.cache.summaries.clear();
    this.cache.embeddings.clear();
    this.cache.contextResults.clear();
    console.log('Context caches cleared');
  }

  /**
   * Get token usage statistics for the last context
   * 
   * @returns {Object} Token usage breakdown
   */
  getLastContextTokenUsage() {
    return { ...this.lastContextTokens };
  }

  /**
   * Adjust the token budget based on the maximum tokens available
   * @private
   */
  _adjustTokenBudget(maxTokens) {
    const { tokenBudget } = this.config;
    
    // Calculate current total budget
    const totalBudget = Object.values(tokenBudget).reduce((sum, val) => sum + val, 0);
    
    // If the max tokens is less than our budget, scale proportionally
    if (maxTokens < totalBudget) {
      const scale = maxTokens / totalBudget;
      
      // Create a new budget with scaled values
      const adjustedBudget = {};
      for (const [key, value] of Object.entries(tokenBudget)) {
        adjustedBudget[key] = Math.floor(value * scale);
      }
      
      return adjustedBudget;
    }
    
    // Otherwise, return the original budget
    return { ...tokenBudget };
  }

  /**
   * Extract the current content window
   * @private
   */
  async _getCurrentWindow(params) {
    const { currentContent, countTokens, tokenBudget } = params;
    
    // For now, just return the current content truncated to fit within token budget
    // In a full implementation, this would handle proper content truncation 
    // based on natural breaks in the text
    
    if (!currentContent) return '';
    
    // Roughly estimate where to truncate based on token budget
    // A more sophisticated implementation would use natural sentence or paragraph breaks
    const estimatedTokens = countTokens(currentContent);
    
    if (estimatedTokens <= tokenBudget) {
      return currentContent;
    } else {
      // Very simple truncation - in practice, use smarter paragraph/sentence truncation
      const ratio = tokenBudget / estimatedTokens;
      const charLimit = Math.floor(currentContent.length * ratio);
      return currentContent.substring(0, charLimit) + '...';
    }
  }

  /**
   * Get the nearby content (content before and after the current position)
   * @private
   */
  async _getNearbyContent(params) {
    const { document, position, tokenBudget, countTokens } = params;
    
    // In a full implementation, we would:
    // 1. Locate the current position in the document
    // 2. Extract content before and after the current position
    // 3. Balance the context window based on strategy (e.g., more history vs more future)
    // 4. Ensure the content fits within the token budget
    
    // For this initial implementation, we'll return a placeholder
    return `[This would contain content surrounding the current section, including previous paragraphs and following content, balanced based on the selected windowing strategy. In a complete implementation, this would be extracted from the document structure based on the current position.]`;
  }

  /**
   * Get summaries of the document for broader context
   * @private
   */
  async _getSummaries(params) {
    const { document, position, tokenBudget, countTokens } = params;
    
    // In a full implementation, we would:
    // 1. Check cache for existing summaries
    // 2. Generate hierarchical summaries (chapter-level, scene-level, document-level)
    // 3. Select appropriate summaries based on current position
    // 4. Ensure summaries fit within token budget
    
    // For this initial implementation, we'll return a placeholder
    return `[This would contain multi-level summaries of the document, including chapter summaries, a scene summary for the current scene's context, and potentially a high-level document summary. These summaries would help the AI understand the broader narrative context.]`;
  }

  /**
   * Get relevant metadata for the current context
   * @private
   */
  async _getRelevantMetadata(params) {
    const { metadata, currentContent, position, tokenBudget, countTokens } = params;
    
    // In a full implementation, we would:
    // 1. Identify entities (characters, locations, etc.) in the current content
    // 2. Retrieve relevant metadata for those entities
    // 3. Prioritize metadata based on relevance and token budget
    
    // For this initial implementation, we'll return a placeholder
    return `[This would contain relevant metadata about characters, settings, plot elements, etc. that are mentioned in the current context. The metadata would be filtered to include only what's relevant to the current content and prioritized to fit within token limits.]`;
  }

  /**
   * Get semantically similar content from elsewhere in the document
   * @private
   */
  async _getSimilarContent(params) {
    const { currentContent, document, tokenBudget, countTokens } = params;
    
    // In a full implementation, we would:
    // 1. Generate embeddings for the current content if not cached
    // 2. Compare against embeddings of other content blocks
    // 3. Retrieve the most similar content from elsewhere in the document
    // 4. Ensure it fits within token budget
    
    // For this initial implementation, we'll return a placeholder
    return `[This would contain content from elsewhere in the document that is semantically similar to the current content. This helps provide relevant context that might not be in the immediate vicinity of the current position. In a complete implementation, this would use embeddings to find similar content.]`;
  }

  /**
   * Create a text prompt using the context
   * @private
   */
  _createTextPrompt(context, promptTemplate, additionalParams) {
    // Format the context as a string
    const contextString = this.formatContextAsString(context);
    
    // Replace placeholders in the template
    let prompt = promptTemplate.template;
    
    // Replace the {{context}} placeholder
    prompt = prompt.replace(/{{context}}/g, contextString);
    
    // Replace other placeholders from additionalParams
    for (const [key, value] of Object.entries(additionalParams)) {
      prompt = prompt.replace(new RegExp(`{{${key}}}`, 'g'), value);
    }
    
    return prompt;
  }

  /**
   * Create a chat prompt using the context
   * @private
   */
  _createChatPrompt(context, promptTemplate, additionalParams) {
    // Format the context as a string
    const contextString = this.formatContextAsString(context);
    
    // Clone the template messages to avoid modifying the original
    const messages = JSON.parse(JSON.stringify(promptTemplate.messages));
    
    // Replace placeholders in each message
    messages.forEach(message => {
      // Replace the {{context}} placeholder
      message.content = message.content.replace(/{{context}}/g, contextString);
      
      // Replace other placeholders from additionalParams
      for (const [key, value] of Object.entries(additionalParams)) {
        message.content = message.content.replace(new RegExp(`{{${key}}}`, 'g'), value);
      }
    });
    
    return messages;
  }

  /**
   * Generate a cache key for context requests
   * @private
   */
  _generateCacheKey(params) {
    // Create a simplified representation of the request for caching
    const { currentContent, position } = params;
    
    const key = {
      content: currentContent ? currentContent.substring(0, 100) : '',
      position: position ? `${position.chapterId}-${position.sceneId}-${position.beatId}` : '',
      timestamp: Date.now() - (Date.now() % 60000) // Round to the nearest minute
    };
    
    return JSON.stringify(key);
  }

  /**
   * Simple token count estimation
   * @private
   */
  _estimateTokenCount(text) {
    if (!text) return 0;
    
    // Very rough approximation: 1 token ≈ 4 characters
    return Math.ceil(text.length / 4);
  }
}

export default ContextHandlingService;
