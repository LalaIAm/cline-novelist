import OpenAIAdapter from './OpenAIAdapter';

/**
 * AI Provider Service
 * 
 * This service acts as a factory and manager for AI provider adapters.
 * It provides a single interface for the application to interact with various
 * AI providers while handling provider selection, fallbacks, and configuration.
 */
class AIProviderService {
  /**
   * Create a new AI Provider Service
   * 
   * @param {Object} config - Configuration for the service
   * @param {Object} config.providers - Provider configurations
   * @param {Object} config.providers.openai - OpenAI configuration
   * @param {Object} config.providers.vertex - Google Vertex AI configuration (added later)
   * @param {Object} config.featureDefaults - Default providers for each feature
   * @param {Object} config.userPreferences - User preferences for providers
   * @param {function} config.onError - Error handling callback
   * @param {function} config.onUsage - Usage tracking callback
   */
  constructor(config = {}) {
    this.config = {
      providers: {},
      featureDefaults: {},
      userPreferences: {},
      ...config
    };
    
    // Initialize provider instances map
    this.providerInstances = {};
    
    // Initialize provider adapters if credentials are provided
    this._initializeProviders();
    
    // Track service-wide usage stats
    this.usage = {
      totalTokens: 0,
      totalRequests: 0,
      byProvider: {}
    };
  }

  /**
   * Get the appropriate provider for a specific feature
   * 
   * @param {string} feature - The feature name (e.g., 'writingContinuation', 'characterDevelopment')
   * @param {string} preferredProvider - Optional preferred provider to override defaults
   * @returns {Object} The selected provider adapter
   */
  getProviderForFeature(feature, preferredProvider = null) {
    // First check if user has explicitly requested a provider
    if (preferredProvider && this.providerInstances[preferredProvider]) {
      return this.providerInstances[preferredProvider];
    }
    
    // Next check if user has set a preference for this feature
    const userPreference = this.config.userPreferences[feature];
    if (userPreference && this.providerInstances[userPreference]) {
      return this.providerInstances[userPreference];
    }
    
    // Next check if there's a system default for this feature
    const featureDefault = this.config.featureDefaults[feature];
    if (featureDefault && this.providerInstances[featureDefault]) {
      return this.providerInstances[featureDefault];
    }
    
    // Fall back to any available provider, with priority order
    const priorityOrder = ['openai', 'vertex'];
    for (const provider of priorityOrder) {
      if (this.providerInstances[provider]) {
        return this.providerInstances[provider];
      }
    }
    
    // If no provider is available, throw an error
    throw new Error(`No AI provider available for feature: ${feature}`);
  }

  /**
   * Generate a completion using the appropriate provider for the feature
   * 
   * @param {Object} params - Parameters for the completion
   * @param {string} params.feature - Feature name for provider selection
   * @param {string} params.prompt - Prompt text
   * @param {Object} params.options - Additional options
   * @param {string} params.preferredProvider - Optional preferred provider
   * @returns {Promise<Object>} Generated completion
   */
  async generateCompletion(params) {
    const { feature, preferredProvider, ...completionParams } = params;
    
    try {
      // Get appropriate provider for this feature
      const provider = this.getProviderForFeature(feature, preferredProvider);
      
      // Call the provider's method
      const result = await provider.generateCompletion(completionParams);
      
      // Track usage
      this._trackUsage(result, provider);
      
      return result;
    } catch (error) {
      return this._handleProviderError(error, 'generateCompletion', params);
    }
  }

  /**
   * Generate a chat completion using the appropriate provider for the feature
   * 
   * @param {Object} params - Parameters for the chat completion
   * @param {string} params.feature - Feature name for provider selection
   * @param {Array<Object>} params.messages - Array of message objects
   * @param {Object} params.options - Additional options
   * @param {string} params.preferredProvider - Optional preferred provider
   * @returns {Promise<Object>} Generated chat completion
   */
  async generateChatCompletion(params) {
    const { feature, preferredProvider, ...completionParams } = params;
    
    try {
      // Get appropriate provider for this feature
      const provider = this.getProviderForFeature(feature, preferredProvider);
      
      // Call the provider's method
      const result = await provider.generateChatCompletion(completionParams);
      
      // Track usage
      this._trackUsage(result, provider);
      
      return result;
    } catch (error) {
      return this._handleProviderError(error, 'generateChatCompletion', params);
    }
  }

  /**
   * Generate embeddings using the appropriate provider for the feature
   * 
   * @param {Object} params - Parameters for the embedding generation
   * @param {string} params.feature - Feature name for provider selection
   * @param {string|Array<string>} params.input - Input text(s)
   * @param {Object} params.options - Additional options
   * @param {string} params.preferredProvider - Optional preferred provider
   * @returns {Promise<Object>} Generated embeddings
   */
  async generateEmbeddings(params) {
    const { feature, preferredProvider, ...embeddingParams } = params;
    
    try {
      // Get appropriate provider for this feature
      const provider = this.getProviderForFeature(feature, preferredProvider);
      
      // Call the provider's method
      const result = await provider.generateEmbeddings(embeddingParams);
      
      // Track usage
      this._trackUsage(result, provider);
      
      return result;
    } catch (error) {
      return this._handleProviderError(error, 'generateEmbeddings', params);
    }
  }

  /**
   * Stream completions using the appropriate provider for the feature
   * 
   * @param {Object} params - Parameters for the streaming completion
   * @param {string} params.feature - Feature name for provider selection
   * @param {string} params.prompt - Prompt text
   * @param {function} params.onToken - Callback for each token
   * @param {Object} params.options - Additional options
   * @param {string} params.preferredProvider - Optional preferred provider
   * @returns {Promise<Object>} Final completion result
   */
  async streamCompletion(params) {
    const { feature, preferredProvider, ...streamParams } = params;
    
    try {
      // Get appropriate provider for this feature
      const provider = this.getProviderForFeature(feature, preferredProvider);
      
      // Call the provider's method
      const result = await provider.streamCompletion(streamParams);
      
      // Track usage
      this._trackUsage(result, provider);
      
      return result;
    } catch (error) {
      return this._handleProviderError(error, 'streamCompletion', params);
    }
  }

  /**
   * Stream chat completions using the appropriate provider for the feature
   * 
   * @param {Object} params - Parameters for the streaming chat completion
   * @param {string} params.feature - Feature name for provider selection
   * @param {Array<Object>} params.messages - Array of message objects
   * @param {function} params.onToken - Callback for each token
   * @param {Object} params.options - Additional options
   * @param {string} params.preferredProvider - Optional preferred provider
   * @returns {Promise<Object>} Final completion result
   */
  async streamChatCompletion(params) {
    const { feature, preferredProvider, ...streamParams } = params;
    
    try {
      // Get appropriate provider for this feature
      const provider = this.getProviderForFeature(feature, preferredProvider);
      
      // Call the provider's method
      const result = await provider.streamChatCompletion(streamParams);
      
      // Track usage
      this._trackUsage(result, provider);
      
      return result;
    } catch (error) {
      return this._handleProviderError(error, 'streamChatCompletion', params);
    }
  }

  /**
   * Count tokens using the appropriate provider
   * 
   * @param {Object} params - Parameters for token counting
   * @param {string} params.feature - Feature name for provider selection
   * @param {string|Array<Object>} params.input - Input text or messages
   * @param {string} params.preferredProvider - Optional preferred provider
   * @returns {Promise<number>} Token count
   */
  async countTokens(params) {
    const { feature, preferredProvider, ...countParams } = params;
    
    try {
      // Get appropriate provider for this feature
      const provider = this.getProviderForFeature(feature, preferredProvider);
      
      // Call the provider's method
      return await provider.countTokens(countParams);
    } catch (error) {
      // For token counting, just fall back to a rough estimate
      if (typeof params.input === 'string') {
        return Math.ceil(params.input.length / 4);
      } else if (Array.isArray(params.input)) {
        return params.input.reduce((acc, msg) => {
          return acc + Math.ceil((msg.content || '').length / 4);
        }, 0);
      }
      return 0;
    }
  }

  /**
   * Get available models from all providers
   * 
   * @returns {Promise<Object>} Map of provider name to array of models
   */
  async getAvailableModels() {
    const results = {};
    const promises = [];
    
    // Collect promises for each provider
    for (const [providerName, instance] of Object.entries(this.providerInstances)) {
      promises.push(
        instance.getModels()
          .then(models => {
            results[providerName] = models;
          })
          .catch(error => {
            console.error(`Error getting models for ${providerName}:`, error);
            results[providerName] = [];
          })
      );
    }
    
    // Wait for all promises to resolve
    await Promise.all(promises);
    
    return results;
  }

  /**
   * Get usage statistics across all providers
   * 
   * @returns {Promise<Object>} Aggregated usage statistics
   */
  async getUsageStatistics() {
    // Collect usage from each provider
    for (const [providerName, instance] of Object.entries(this.providerInstances)) {
      try {
        const providerUsage = await instance.getUsage();
        
        // Update provider-specific stats
        this.usage.byProvider[providerName] = providerUsage;
      } catch (error) {
        console.error(`Error getting usage for ${providerName}:`, error);
      }
    }
    
    return this.usage;
  }

  /**
   * Update user preferences for providers
   * 
   * @param {Object} preferences - New user preferences
   */
  updateUserPreferences(preferences) {
    this.config.userPreferences = {
      ...this.config.userPreferences,
      ...preferences
    };
  }

  /**
   * Add a new provider or update configuration for an existing provider
   * 
   * @param {string} providerName - Provider name
   * @param {Object} config - Provider configuration
   */
  addProvider(providerName, config) {
    this.config.providers[providerName] = config;
    this._initializeProvider(providerName, config);
  }

  /**
   * Initialize available providers based on configuration
   * @private
   */
  _initializeProviders() {
    const { providers } = this.config;
    
    // Initialize each configured provider
    Object.entries(providers).forEach(([providerName, providerConfig]) => {
      this._initializeProvider(providerName, providerConfig);
    });
  }

  /**
   * Initialize a specific provider
   * @private
   */
  _initializeProvider(providerName, providerConfig) {
    // Skip if no config is provided
    if (!providerConfig) return;
    
    try {
      switch (providerName) {
        case 'openai':
          if (providerConfig.apiKey) {
            this.providerInstances.openai = new OpenAIAdapter({
              ...providerConfig,
              onTokenUsage: (usage) => this._onProviderUsage('openai', usage)
            });
          }
          break;
          
        case 'vertex':
          // Google Vertex AI adapter will be implemented later
          console.log('Google Vertex AI support will be added in Phase 2, Weeks 9-12');
          break;
          
        default:
          console.warn(`Unknown provider: ${providerName}`);
      }
    } catch (error) {
      console.error(`Error initializing provider ${providerName}:`, error);
    }
  }

  /**
   * Handle provider usage statistics
   * @private
   */
  _onProviderUsage(providerName, usage) {
    // Initialize provider stats if needed
    if (!this.usage.byProvider[providerName]) {
      this.usage.byProvider[providerName] = {
        promptTokens: 0,
        completionTokens: 0,
        totalTokens: 0,
        totalRequests: 0
      };
    }
    
    // Update provider-specific stats
    const providerStats = this.usage.byProvider[providerName];
    providerStats.promptTokens = (providerStats.promptTokens || 0) + (usage.promptTokens || 0);
    providerStats.completionTokens = (providerStats.completionTokens || 0) + (usage.completionTokens || 0);
    providerStats.totalTokens = (providerStats.totalTokens || 0) + (usage.totalTokens || 0);
    providerStats.totalRequests = (providerStats.totalRequests || 0) + 1;
    
    // Update service-wide stats
    this.usage.totalTokens += usage.totalTokens || 0;
    this.usage.totalRequests += 1;
    
    // Call user-provided usage callback if available
    if (this.config.onUsage && typeof this.config.onUsage === 'function') {
      this.config.onUsage({
        provider: providerName,
        ...usage
      });
    }
  }

  /**
   * Track usage from API responses
   * @private
   */
  _trackUsage(result, provider) {
    const providerName = provider.constructor.name.replace('Adapter', '').toLowerCase();
    
    // Extract usage information from result
    const usage = result.usage || {};
    
    // Update usage stats
    this._onProviderUsage(providerName, usage);
  }

  /**
   * Handle provider errors with fallback
   * @private
   */
  _handleProviderError(error, method, params) {
    console.error(`Error in ${method}:`, error);
    
    // Call user-provided error handler if available
    if (this.config.onError && typeof this.config.onError === 'function') {
      this.config.onError(error, method, params);
    }
    
    // If a specific provider was requested, try falling back to default
    if (params.preferredProvider) {
      console.log(`Falling back to default provider for ${params.feature}`);
      
      // Remove the preferred provider and try again
      const retryParams = { ...params };
      delete retryParams.preferredProvider;
      
      return this[method](retryParams);
    }
    
    // Re-throw the error if no fallback is possible
    throw error;
  }
}

export default AIProviderService;
