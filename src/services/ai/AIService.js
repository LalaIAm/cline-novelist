import AIProviderService from './AIProviderService';
import ContextHandlingService from './ContextHandlingService';
import PromptTemplateService from './PromptTemplateService';

/**
 * AI Service
 * 
 * This service serves as the main entry point for AI functionality in the application.
 * It integrates the provider service, context handling, and prompt templates
 * to offer a complete AI assistance solution for novel writing.
 */
class AIService {
  /**
   * Create a new AI Service instance
   * 
   * @param {Object} config - Configuration for the service
   * @param {Object} config.providers - Provider configurations
   * @param {Object} config.contextHandling - Context handling configurations
   * @param {Object} config.templates - Additional prompt templates
   */
  constructor(config = {}) {
    this.config = {
      providers: {},
      contextHandling: {},
      templates: {},
      ...config
    };
    
    // Initialize sub-services
    this.providerService = new AIProviderService(this.config.providers);
    this.contextService = new ContextHandlingService(this.config.contextHandling);
    this.templateService = new PromptTemplateService({ templates: this.config.templates });
    
    // Track usage for monitoring
    this.usageStats = {
      totalRequests: 0,
      byFeature: {}
    };
  }

  /**
   * Initialize the AI service with API keys and configuration
   * 
   * @param {Object} config - Configuration with API keys
   */
  initialize(config = {}) {
    // Update provider configurations
    if (config.openaiApiKey) {
      this.providerService.addProvider('openai', {
        apiKey: config.openaiApiKey,
        organization: config.openaiOrganization,
        defaultModel: config.openaiDefaultModel || 'gpt-4-turbo'
      });
    }
    
    // Google Vertex will be added in future phases
    if (config.vertexApiKey) {
      console.log('Google Vertex AI support will be added in Phase 2, Weeks 9-12');
    }
    
    // Update feature defaults
    if (config.featureDefaults) {
      this.providerService.config.featureDefaults = {
        ...this.providerService.config.featureDefaults,
        ...config.featureDefaults
      };
    }
    
    // Update user preferences
    if (config.userPreferences) {
      this.providerService.updateUserPreferences(config.userPreferences);
    }
    
    console.log('AI Service initialized with provider configurations');
    
    return this;
  }

  /**
   * Generate a writing continuation
   * 
   * @param {Object} params - Parameters for continuation
   * @param {string} params.content - Current content to continue from
   * @param {Object} params.document - Document structure
   * @param {Object} params.position - Position in the document
   * @param {Object} params.metadata - Document metadata
   * @param {Object} params.options - Additional options
   * @returns {Promise<Object>} Generated continuation
   */
  async continueWriting(params) {
    const {
      content,
      document,
      position,
      metadata,
      options = {}
    } = params;
    
    try {
      // Get the optimal context for continuation
      const context = await this.contextService.getContext({
        currentContent: content,
        document,
        position,
        metadata,
        options: {
          maxTokens: options.maxContextTokens || 4000,
          purpose: 'continuation'
        },
        tokenCounter: (text) => this.providerService.countTokens({
          feature: 'writingContinuation',
          input: text
        })
      });
      
      // Get the appropriate template
      const templateName = options.streaming ? 'writing-continuation-chat' : 'writing-continuation-text';
      const promptTemplate = this.templateService.getTemplate(templateName);
      
      // Create a formatted prompt with the context
      const prompt = this.contextService.createPromptWithContext(
        context,
        promptTemplate,
        {
          instructions: options.instructions || '',
          tone: options.tone || '',
          ...options.promptParams
        }
      );
      
      // Generate completion
      let result;
      
      if (options.streaming) {
        // For streaming, use chat completion
        result = await this.providerService.streamChatCompletion({
          feature: 'writingContinuation',
          messages: prompt,
          temperature: options.temperature || 0.7,
          maxTokens: options.maxTokens || 1000,
          onToken: options.onToken,
          preferredProvider: options.provider
        });
      } else {
        // For non-streaming, use text completion if the template is text, otherwise chat
        if (promptTemplate.type === 'text') {
          result = await this.providerService.generateCompletion({
            feature: 'writingContinuation',
            prompt,
            temperature: options.temperature || 0.7,
            maxTokens: options.maxTokens || 1000,
            preferredProvider: options.provider
          });
        } else {
          result = await this.providerService.generateChatCompletion({
            feature: 'writingContinuation',
            messages: prompt,
            temperature: options.temperature || 0.7,
            maxTokens: options.maxTokens || 1000,
            preferredProvider: options.provider
          });
        }
      }
      
      // Track usage
      this._trackUsage('writingContinuation', result);
      
      // Return result with context info
      return {
        ...result,
        context: {
          tokensUsed: this.contextService.getLastContextTokenUsage()
        }
      };
    } catch (error) {
      console.error('Error generating writing continuation:', error);
      throw error;
    }
  }

  /**
   * Get character development suggestions
   * 
   * @param {Object} params - Parameters
   * @param {string} params.content - Current content
   * @param {Object} params.document - Document structure
   * @param {Object} params.position - Position in document
   * @param {Object} params.characterData - Character information
   * @param {Object} params.options - Additional options
   * @returns {Promise<Object>} Character suggestions
   */
  async getCharacterSuggestions(params) {
    const {
      content,
      document,
      position,
      characterData,
      options = {}
    } = params;
    
    try {
      // Get context focused on character info
      const context = await this.contextService.getContext({
        currentContent: content,
        document,
        position,
        metadata: {
          characters: characterData
        },
        options: {
          maxTokens: options.maxContextTokens || 4000,
          purpose: 'characterAnalysis'
        }
      });
      
      // Get the character development template
      const promptTemplate = this.templateService.getTemplate('character-development');
      
      // Create a formatted prompt with the context
      const prompt = this.contextService.createPromptWithContext(
        context,
        promptTemplate,
        {
          characterName: options.characterName || '',
          focus: options.focus || '',
          ...options.promptParams
        }
      );
      
      // Generate completion
      const result = await this.providerService.generateChatCompletion({
        feature: 'characterDevelopment',
        messages: prompt,
        temperature: options.temperature || 0.7,
        maxTokens: options.maxTokens || 1500,
        preferredProvider: options.provider
      });
      
      // Track usage
      this._trackUsage('characterDevelopment', result);
      
      // Return result with context info
      return {
        ...result,
        context: {
          tokensUsed: this.contextService.getLastContextTokenUsage()
        }
      };
    } catch (error) {
      console.error('Error generating character suggestions:', error);
      throw error;
    }
  }

  /**
   * Get plot development suggestions
   * 
   * @param {Object} params - Parameters
   * @param {string} params.content - Current content
   * @param {Object} params.document - Document structure
   * @param {Object} params.position - Position in document
   * @param {Object} params.plotData - Plot element information
   * @param {Object} params.options - Additional options
   * @returns {Promise<Object>} Plot suggestions
   */
  async getPlotSuggestions(params) {
    const {
      content,
      document,
      position,
      plotData,
      options = {}
    } = params;
    
    try {
      // Get context focused on plot info
      const context = await this.contextService.getContext({
        currentContent: content,
        document,
        position,
        metadata: {
          plot: plotData
        },
        options: {
          maxTokens: options.maxContextTokens || 4000,
          purpose: 'plotAnalysis'
        }
      });
      
      // Get the plot development template
      const promptTemplate = this.templateService.getTemplate('plot-development');
      
      // Create a formatted prompt with the context
      const prompt = this.contextService.createPromptWithContext(
        context,
        promptTemplate,
        {
          plotFocus: options.plotFocus || '',
          genre: options.genre || '',
          ...options.promptParams
        }
      );
      
      // Generate completion
      const result = await this.providerService.generateChatCompletion({
        feature: 'plotDevelopment',
        messages: prompt,
        temperature: options.temperature || 0.7,
        maxTokens: options.maxTokens || 1500,
        preferredProvider: options.provider
      });
      
      // Track usage
      this._trackUsage('plotDevelopment', result);
      
      // Return result with context info
      return {
        ...result,
        context: {
          tokensUsed: this.contextService.getLastContextTokenUsage()
        }
      };
    } catch (error) {
      console.error('Error generating plot suggestions:', error);
      throw error;
    }
  }

  /**
   * Get dialogue enhancement suggestions
   * 
   * @param {Object} params - Parameters
   * @param {string} params.content - Current content with dialogue
   * @param {Object} params.document - Document structure
   * @param {Object} params.position - Position in document
   * @param {Object} params.characterData - Character information
   * @param {Object} params.options - Additional options
   * @returns {Promise<Object>} Dialogue suggestions
   */
  async getDialogueSuggestions(params) {
    const {
      content,
      document,
      position,
      characterData,
      options = {}
    } = params;
    
    try {
      // Get context focused on dialogue
      const context = await this.contextService.getContext({
        currentContent: content,
        document,
        position,
        metadata: {
          characters: characterData
        },
        options: {
          maxTokens: options.maxContextTokens || 4000,
          purpose: 'dialogueAnalysis'
        }
      });
      
      // Get the dialogue enhancement template
      const promptTemplate = this.templateService.getTemplate('dialogue-enhancement');
      
      // Create a formatted prompt with the context
      const prompt = this.contextService.createPromptWithContext(
        context,
        promptTemplate,
        {
          dialogueType: options.dialogueType || '',
          characters: options.characterNames || '',
          ...options.promptParams
        }
      );
      
      // Generate completion
      const result = await this.providerService.generateChatCompletion({
        feature: 'dialogueEnhancement',
        messages: prompt,
        temperature: options.temperature || 0.7,
        maxTokens: options.maxTokens || 1200,
        preferredProvider: options.provider
      });
      
      // Track usage
      this._trackUsage('dialogueEnhancement', result);
      
      // Return result with context info
      return {
        ...result,
        context: {
          tokensUsed: this.contextService.getLastContextTokenUsage()
        }
      };
    } catch (error) {
      console.error('Error generating dialogue suggestions:', error);
      throw error;
    }
  }

  /**
   * Get scene description enhancement suggestions
   * 
   * @param {Object} params - Parameters
   * @param {string} params.content - Current scene content
   * @param {Object} params.document - Document structure
   * @param {Object} params.position - Position in document
   * @param {Object} params.metadata - Setting information
   * @param {Object} params.options - Additional options
   * @returns {Promise<Object>} Scene description suggestions
   */
  async getSceneDescriptionSuggestions(params) {
    const {
      content,
      document,
      position,
      metadata,
      options = {}
    } = params;
    
    try {
      // Get context focused on scene
      const context = await this.contextService.getContext({
        currentContent: content,
        document,
        position,
        metadata,
        options: {
          maxTokens: options.maxContextTokens || 4000,
          purpose: 'sceneAnalysis'
        }
      });
      
      // Get the scene description template
      const promptTemplate = this.templateService.getTemplate('scene-description');
      
      // Create a formatted prompt with the context
      const prompt = this.contextService.createPromptWithContext(
        context,
        promptTemplate,
        {
          location: options.location || '',
          mood: options.mood || '',
          timeOfDay: options.timeOfDay || '',
          ...options.promptParams
        }
      );
      
      // Generate completion
      const result = await this.providerService.generateChatCompletion({
        feature: 'sceneDescription',
        messages: prompt,
        temperature: options.temperature || 0.7,
        maxTokens: options.maxTokens || 1200,
        preferredProvider: options.provider
      });
      
      // Track usage
      this._trackUsage('sceneDescription', result);
      
      // Return result with context info
      return {
        ...result,
        context: {
          tokensUsed: this.contextService.getLastContextTokenUsage()
        }
      };
    } catch (error) {
      console.error('Error generating scene description suggestions:', error);
      throw error;
    }
  }

  /**
   * Get general editing suggestions for content
   * 
   * @param {Object} params - Parameters
   * @param {string} params.content - Content to edit
   * @param {Object} params.document - Document structure
   * @param {Object} params.position - Position in document
   * @param {Object} params.options - Additional options
   * @returns {Promise<Object>} Editing suggestions
   */
  async getEditingSuggestions(params) {
    const {
      content,
      document,
      position,
      options = {}
    } = params;
    
    try {
      // Get context focused on content to edit
      const context = await this.contextService.getContext({
        currentContent: content,
        document,
        position,
        options: {
          maxTokens: options.maxContextTokens || 4000,
          purpose: 'editing'
        }
      });
      
      // Get the editing suggestions template
      const promptTemplate = this.templateService.getTemplate('editing-suggestions');
      
      // Create a formatted prompt with the context
      const prompt = this.contextService.createPromptWithContext(
        context,
        promptTemplate,
        {
          focusAreas: options.focusAreas || '',
          editLevel: options.editLevel || 'moderate',
          ...options.promptParams
        }
      );
      
      // Generate completion
      const result = await this.providerService.generateChatCompletion({
        feature: 'editingSuggestions',
        messages: prompt,
        temperature: options.temperature || 0.5, // Lower temperature for more precise editing
        maxTokens: options.maxTokens || 1500,
        preferredProvider: options.provider
      });
      
      // Track usage
      this._trackUsage('editingSuggestions', result);
      
      // Return result with context info
      return {
        ...result,
        context: {
          tokensUsed: this.contextService.getLastContextTokenUsage()
        }
      };
    } catch (error) {
      console.error('Error generating editing suggestions:', error);
      throw error;
    }
  }

  /**
   * Execute a custom AI operation using a specific template
   * 
   * @param {Object} params - Parameters
   * @param {string} params.templateName - Name of template to use
   * @param {string} params.content - Current content
   * @param {Object} params.document - Document structure
   * @param {Object} params.position - Position in document
   * @param {Object} params.metadata - Additional metadata
   * @param {Object} params.promptParams - Parameters for prompt template
   * @param {Object} params.options - Additional options
   * @returns {Promise<Object>} Custom operation result
   */
  async executeCustomOperation(params) {
    const {
      templateName,
      content,
      document,
      position,
      metadata,
      promptParams = {},
      options = {}
    } = params;
    
    try {
      // Check if template exists
      if (!this.templateService.getTemplateNames().includes(templateName)) {
        throw new Error(`Template not found: ${templateName}`);
      }
      
      // Get context
      const context = await this.contextService.getContext({
        currentContent: content,
        document,
        position,
        metadata,
        options: {
          maxTokens: options.maxContextTokens || 4000,
          purpose: options.purpose || 'custom'
        }
      });
      
      // Get the template
      const promptTemplate = this.templateService.getTemplate(templateName);
      
      // Create a formatted prompt with the context
      const prompt = this.contextService.createPromptWithContext(
        context,
        promptTemplate,
        promptParams
      );
      
      // Generate completion based on template type
      let result;
      if (promptTemplate.type === 'text') {
        result = await this.providerService.generateCompletion({
          feature: options.feature || 'customOperation',
          prompt,
          temperature: options.temperature || 0.7,
          maxTokens: options.maxTokens || 1000,
          preferredProvider: options.provider
        });
      } else {
        result = await this.providerService.generateChatCompletion({
          feature: options.feature || 'customOperation',
          messages: prompt,
          temperature: options.temperature || 0.7,
          maxTokens: options.maxTokens || 1000,
          preferredProvider: options.provider
        });
      }
      
      // Track usage
      this._trackUsage(options.feature || 'customOperation', result);
      
      // Return result with context info
      return {
        ...result,
        context: {
          tokensUsed: this.contextService.getLastContextTokenUsage()
        }
      };
    } catch (error) {
      console.error(`Error executing custom operation (${templateName}):`, error);
      throw error;
    }
  }

  /**
   * Get usage statistics
   * 
   * @returns {Promise<Object>} Usage statistics
   */
  async getUsageStatistics() {
    try {
      const providerUsage = await this.providerService.getUsageStatistics();
      
      return {
        service: this.usageStats,
        providers: providerUsage
      };
    } catch (error) {
      console.error('Error getting usage statistics:', error);
      throw error;
    }
  }

  /**
   * Update user provider preferences
   * 
   * @param {Object} preferences - User provider preferences
   */
  updateUserPreferences(preferences) {
    this.providerService.updateUserPreferences(preferences);
  }

  /**
   * Get available AI models from all providers
   * 
   * @returns {Promise<Object>} Available models by provider
   */
  async getAvailableModels() {
    return this.providerService.getAvailableModels();
  }

  /**
   * Add a custom prompt template
   * 
   * @param {string} templateName - Template name
   * @param {Object} template - Template object
   */
  addPromptTemplate(templateName, template) {
    this.templateService.addTemplate(templateName, template);
  }

  /**
   * Clear context caches
   */
  clearContextCache() {
    this.contextService.clearCache();
  }

  /**
   * Track usage for a specific feature
   * @private
   */
  _trackUsage(featureName, result) {
    // Update service-wide stats
    this.usageStats.totalRequests++;
    
    // Initialize feature stats if needed
    if (!this.usageStats.byFeature[featureName]) {
      this.usageStats.byFeature[featureName] = {
        requests: 0,
        totalTokens: 0
      };
    }
    
    // Update feature stats
    const featureStats = this.usageStats.byFeature[featureName];
    featureStats.requests++;
    
    // Add tokens if available
    if (result.usage && result.usage.totalTokens) {
      featureStats.totalTokens += result.usage.totalTokens;
    }
  }
}

export default AIService;
