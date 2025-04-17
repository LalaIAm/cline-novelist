/**
 * AI Service Interface
 * 
 * This interface defines the contract that all AI provider adapters must implement.
 * It ensures that regardless of which AI provider is used, the application interacts
 * with them in a consistent way.
 */

class AIServiceInterface {
  /**
   * Generate a completion based on the provided prompt
   * 
   * @param {Object} params - Parameters for the completion
   * @param {string} params.prompt - The prompt to generate a completion for
   * @param {number} params.maxTokens - Maximum number of tokens to generate
   * @param {number} params.temperature - Temperature for generation (0-1)
   * @param {number} params.topP - Top-p sampling value (0-1)
   * @param {Array<string>} params.stopSequences - Sequences that will stop generation
   * @param {Object} params.options - Provider-specific options
   * @returns {Promise<Object>} Generated completion and metadata
   */
  async generateCompletion(params) {
    throw new Error('Method generateCompletion must be implemented by the provider adapter');
  }

  /**
   * Generate a chat completion based on a series of messages
   * 
   * @param {Object} params - Parameters for the chat completion
   * @param {Array<Object>} params.messages - Array of message objects with role and content
   * @param {number} params.maxTokens - Maximum number of tokens to generate
   * @param {number} params.temperature - Temperature for generation (0-1)
   * @param {number} params.topP - Top-p sampling value (0-1)
   * @param {Array<string>} params.stopSequences - Sequences that will stop generation
   * @param {Object} params.options - Provider-specific options
   * @returns {Promise<Object>} Generated completion and metadata
   */
  async generateChatCompletion(params) {
    throw new Error('Method generateChatCompletion must be implemented by the provider adapter');
  }

  /**
   * Generate embeddings for a text or array of texts
   * 
   * @param {Object} params - Parameters for the embedding
   * @param {string|Array<string>} params.input - The text(s) to generate embeddings for
   * @param {string} params.model - The embedding model to use
   * @param {Object} params.options - Provider-specific options
   * @returns {Promise<Object>} Generated embeddings and metadata
   */
  async generateEmbeddings(params) {
    throw new Error('Method generateEmbeddings must be implemented by the provider adapter');
  }

  /**
   * Generate a stream of completions
   * 
   * @param {Object} params - Parameters for the streaming completion
   * @param {string} params.prompt - The prompt to generate a completion for
   * @param {number} params.maxTokens - Maximum number of tokens to generate
   * @param {number} params.temperature - Temperature for generation (0-1)
   * @param {number} params.topP - Top-p sampling value (0-1)
   * @param {Array<string>} params.stopSequences - Sequences that will stop generation
   * @param {function} params.onToken - Callback function called for each token
   * @param {Object} params.options - Provider-specific options
   * @returns {Promise<Object>} Final completion and metadata
   */
  async streamCompletion(params) {
    throw new Error('Method streamCompletion must be implemented by the provider adapter');
  }

  /**
   * Generate a stream of chat completions
   * 
   * @param {Object} params - Parameters for the streaming chat completion
   * @param {Array<Object>} params.messages - Array of message objects with role and content
   * @param {number} params.maxTokens - Maximum number of tokens to generate
   * @param {number} params.temperature - Temperature for generation (0-1)
   * @param {number} params.topP - Top-p sampling value (0-1)
   * @param {Array<string>} params.stopSequences - Sequences that will stop generation
   * @param {function} params.onToken - Callback function called for each token
   * @param {Object} params.options - Provider-specific options
   * @returns {Promise<Object>} Final completion and metadata
   */
  async streamChatCompletion(params) {
    throw new Error('Method streamChatCompletion must be implemented by the provider adapter');
  }

  /**
   * Count the tokens in a string or message array
   * 
   * @param {Object} params - Parameters for token counting
   * @param {string|Array<Object>} params.input - The text or messages to count tokens for
   * @param {string} params.model - The model to count tokens for
   * @returns {Promise<number>} Token count
   */
  async countTokens(params) {
    throw new Error('Method countTokens must be implemented by the provider adapter');
  }

  /**
   * Get information about available models
   * 
   * @returns {Promise<Array<Object>>} Array of model information objects
   */
  async getModels() {
    throw new Error('Method getModels must be implemented by the provider adapter');
  }

  /**
   * Get usage information for the current account
   * 
   * @returns {Promise<Object>} Usage information
   */
  async getUsage() {
    throw new Error('Method getUsage must be implemented by the provider adapter');
  }
}

export default AIServiceInterface;
