import AIServiceInterface from './AIServiceInterface';

/**
 * OpenAI API adapter implementing the AI Service Interface
 */
class OpenAIAdapter extends AIServiceInterface {
  /**
   * Create a new OpenAI adapter
   * 
   * @param {Object} config - Configuration for the OpenAI API
   * @param {string} config.apiKey - OpenAI API key
   * @param {string} config.organization - Optional OpenAI organization ID
   * @param {string} config.defaultModel - Default model to use
   * @param {Object} config.defaultParams - Default parameters for requests
   * @param {function} config.onTokenUsage - Callback for token usage tracking
   */
  constructor(config) {
    super();
    this.config = {
      defaultModel: 'gpt-4-turbo',
      defaultParams: {
        temperature: 0.7,
        topP: 1,
        maxTokens: 500,
      },
      ...config
    };
    
    this.apiKey = this.config.apiKey;
    
    // Track usage for cost management
    this.usage = {
      promptTokens: 0,
      completionTokens: 0,
      totalTokens: 0,
      totalRequests: 0,
      lastRequest: null
    };
  }

  /**
   * Generate a completion using OpenAI's API
   * 
   * @param {Object} params - Parameters for the completion
   * @returns {Promise<Object>} Generated completion and metadata
   */
  async generateCompletion(params) {
    const { prompt, maxTokens, temperature, topP, stopSequences, options = {} } = params;
    
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
        ...(this.config.organization ? { 'OpenAI-Organization': this.config.organization } : {})
      },
      body: JSON.stringify({
        model: options.model || this.config.defaultModel,
        prompt,
        max_tokens: maxTokens || this.config.defaultParams.maxTokens,
        temperature: temperature !== undefined ? temperature : this.config.defaultParams.temperature,
        top_p: topP !== undefined ? topP : this.config.defaultParams.topP,
        ...(stopSequences && stopSequences.length ? { stop: stopSequences } : {}),
        ...options
      })
    };
    
    try {
      const response = await fetch('https://api.openai.com/v1/completions', requestOptions);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(`OpenAI API Error: ${error.error?.message || response.statusText}`);
      }
      
      const data = await response.json();
      
      // Track usage
      this._updateUsage({
        promptTokens: data.usage?.prompt_tokens || 0,
        completionTokens: data.usage?.completion_tokens || 0,
        totalTokens: data.usage?.total_tokens || 0
      });
      
      // Normalize the response format
      return {
        text: data.choices[0]?.text || '',
        finishReason: data.choices[0]?.finish_reason,
        usage: {
          promptTokens: data.usage?.prompt_tokens || 0,
          completionTokens: data.usage?.completion_tokens || 0,
          totalTokens: data.usage?.total_tokens || 0
        },
        model: data.model,
        provider: 'openai',
        rawResponse: data
      };
    } catch (error) {
      console.error('OpenAI completion error:', error);
      throw error;
    }
  }

  /**
   * Generate a chat completion using OpenAI's API
   * 
   * @param {Object} params - Parameters for the chat completion
   * @returns {Promise<Object>} Generated chat completion and metadata
   */
  async generateChatCompletion(params) {
    const { messages, maxTokens, temperature, topP, stopSequences, options = {} } = params;
    
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
        ...(this.config.organization ? { 'OpenAI-Organization': this.config.organization } : {})
      },
      body: JSON.stringify({
        model: options.model || this.config.defaultModel,
        messages,
        max_tokens: maxTokens || this.config.defaultParams.maxTokens,
        temperature: temperature !== undefined ? temperature : this.config.defaultParams.temperature,
        top_p: topP !== undefined ? topP : this.config.defaultParams.topP,
        ...(stopSequences && stopSequences.length ? { stop: stopSequences } : {}),
        ...options
      })
    };
    
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', requestOptions);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(`OpenAI API Error: ${error.error?.message || response.statusText}`);
      }
      
      const data = await response.json();
      
      // Track usage
      this._updateUsage({
        promptTokens: data.usage?.prompt_tokens || 0,
        completionTokens: data.usage?.completion_tokens || 0,
        totalTokens: data.usage?.total_tokens || 0
      });
      
      // Normalize the response format
      return {
        message: data.choices[0]?.message || {},
        text: data.choices[0]?.message?.content || '',
        finishReason: data.choices[0]?.finish_reason,
        usage: {
          promptTokens: data.usage?.prompt_tokens || 0,
          completionTokens: data.usage?.completion_tokens || 0,
          totalTokens: data.usage?.total_tokens || 0
        },
        model: data.model,
        provider: 'openai',
        rawResponse: data
      };
    } catch (error) {
      console.error('OpenAI chat completion error:', error);
      throw error;
    }
  }

  /**
   * Generate embeddings using OpenAI's API
   * 
   * @param {Object} params - Parameters for the embedding
   * @returns {Promise<Object>} Generated embeddings and metadata
   */
  async generateEmbeddings(params) {
    const { input, model = 'text-embedding-ada-002', options = {} } = params;
    
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
        ...(this.config.organization ? { 'OpenAI-Organization': this.config.organization } : {})
      },
      body: JSON.stringify({
        model,
        input: Array.isArray(input) ? input : [input],
        ...options
      })
    };
    
    try {
      const response = await fetch('https://api.openai.com/v1/embeddings', requestOptions);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(`OpenAI API Error: ${error.error?.message || response.statusText}`);
      }
      
      const data = await response.json();
      
      // Track usage
      this._updateUsage({
        promptTokens: data.usage?.prompt_tokens || 0,
        completionTokens: 0,
        totalTokens: data.usage?.total_tokens || 0
      });
      
      // Normalize the response format
      return {
        embeddings: data.data.map(item => item.embedding),
        usage: {
          promptTokens: data.usage?.prompt_tokens || 0,
          totalTokens: data.usage?.total_tokens || 0
        },
        model: data.model,
        provider: 'openai',
        rawResponse: data
      };
    } catch (error) {
      console.error('OpenAI embeddings error:', error);
      throw error;
    }
  }

  /**
   * Generate a stream of completions using OpenAI's API
   * 
   * @param {Object} params - Parameters for the streaming completion
   * @returns {Promise<Object>} Final completion and metadata
   */
  async streamCompletion(params) {
    const { prompt, maxTokens, temperature, topP, stopSequences, onToken, options = {} } = params;
    
    if (!onToken || typeof onToken !== 'function') {
      throw new Error('onToken callback function is required for streaming');
    }
    
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
        ...(this.config.organization ? { 'OpenAI-Organization': this.config.organization } : {})
      },
      body: JSON.stringify({
        model: options.model || this.config.defaultModel,
        prompt,
        max_tokens: maxTokens || this.config.defaultParams.maxTokens,
        temperature: temperature !== undefined ? temperature : this.config.defaultParams.temperature,
        top_p: topP !== undefined ? topP : this.config.defaultParams.topP,
        stream: true,
        ...(stopSequences && stopSequences.length ? { stop: stopSequences } : {}),
        ...options
      })
    };
    
    try {
      const response = await fetch('https://api.openai.com/v1/completions', requestOptions);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(`OpenAI API Error: ${error.error?.message || response.statusText}`);
      }
      
      if (!response.body) {
        throw new Error('ReadableStream not supported in this environment');
      }
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      
      let fullText = '';
      let finishReason = null;
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk
          .split('\n')
          .filter(line => line.trim() !== '' && line.trim() !== 'data: [DONE]');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              const text = data.choices[0]?.text || '';
              const reason = data.choices[0]?.finish_reason;
              
              fullText += text;
              
              if (reason) {
                finishReason = reason;
              }
              
              onToken({
                text,
                finishReason: reason,
                provider: 'openai',
                rawData: data
              });
            } catch (error) {
              console.error('Error parsing streaming data:', error);
            }
          }
        }
      }
      
      // Estimate token usage - this is an approximation since streaming doesn't return usage info
      const estimatedTokens = this._estimateTokenCount(prompt) + this._estimateTokenCount(fullText);
      
      // Track usage
      this._updateUsage({
        promptTokens: this._estimateTokenCount(prompt),
        completionTokens: this._estimateTokenCount(fullText),
        totalTokens: estimatedTokens
      });
      
      return {
        text: fullText,
        finishReason,
        usage: {
          promptTokens: this._estimateTokenCount(prompt),
          completionTokens: this._estimateTokenCount(fullText),
          totalTokens: estimatedTokens
        },
        model: options.model || this.config.defaultModel,
        provider: 'openai'
      };
    } catch (error) {
      console.error('OpenAI streaming completion error:', error);
      throw error;
    }
  }

  /**
   * Generate a stream of chat completions using OpenAI's API
   * 
   * @param {Object} params - Parameters for the streaming chat completion
   * @returns {Promise<Object>} Final completion and metadata
   */
  async streamChatCompletion(params) {
    const { messages, maxTokens, temperature, topP, stopSequences, onToken, options = {} } = params;
    
    if (!onToken || typeof onToken !== 'function') {
      throw new Error('onToken callback function is required for streaming');
    }
    
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
        ...(this.config.organization ? { 'OpenAI-Organization': this.config.organization } : {})
      },
      body: JSON.stringify({
        model: options.model || this.config.defaultModel,
        messages,
        max_tokens: maxTokens || this.config.defaultParams.maxTokens,
        temperature: temperature !== undefined ? temperature : this.config.defaultParams.temperature,
        top_p: topP !== undefined ? topP : this.config.defaultParams.topP,
        stream: true,
        ...(stopSequences && stopSequences.length ? { stop: stopSequences } : {}),
        ...options
      })
    };
    
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', requestOptions);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(`OpenAI API Error: ${error.error?.message || response.statusText}`);
      }
      
      if (!response.body) {
        throw new Error('ReadableStream not supported in this environment');
      }
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      
      let fullContent = '';
      let finishReason = null;
      let role = null;
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk
          .split('\n')
          .filter(line => line.trim() !== '' && line.trim() !== 'data: [DONE]');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              const delta = data.choices[0]?.delta || {};
              const text = delta.content || '';
              const reason = data.choices[0]?.finish_reason;
              
              if (delta.role) {
                role = delta.role;
              }
              
              fullContent += text;
              
              if (reason) {
                finishReason = reason;
              }
              
              onToken({
                text,
                role,
                finishReason: reason,
                provider: 'openai',
                rawData: data
              });
            } catch (error) {
              console.error('Error parsing streaming data:', error);
            }
          }
        }
      }
      
      // Estimate token usage
      const promptTokens = messages.reduce((acc, msg) => acc + this._estimateTokenCount(msg.content), 0);
      const completionTokens = this._estimateTokenCount(fullContent);
      
      // Track usage
      this._updateUsage({
        promptTokens,
        completionTokens,
        totalTokens: promptTokens + completionTokens
      });
      
      return {
        message: {
          role: role || 'assistant',
          content: fullContent
        },
        text: fullContent,
        finishReason,
        usage: {
          promptTokens,
          completionTokens,
          totalTokens: promptTokens + completionTokens
        },
        model: options.model || this.config.defaultModel,
        provider: 'openai'
      };
    } catch (error) {
      console.error('OpenAI streaming chat completion error:', error);
      throw error;
    }
  }

  /**
   * Count tokens in a string or message array using OpenAI's tokenizer
   * 
   * @param {Object} params - Parameters for token counting
   * @returns {Promise<number>} Token count
   */
  async countTokens(params) {
    const { input, model } = params;
    
    // For a proper implementation, we would use OpenAI's tiktoken library
    // For simplicity, we're using a rough estimation here
    if (Array.isArray(input)) {
      // Handle message array
      return input.reduce((acc, msg) => acc + this._estimateTokenCount(msg.content), 0);
    } else {
      // Handle string
      return this._estimateTokenCount(input);
    }
  }

  /**
   * Get available models from OpenAI
   * 
   * @returns {Promise<Array<Object>>} List of available models
   */
  async getModels() {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        ...(this.config.organization ? { 'OpenAI-Organization': this.config.organization } : {})
      }
    };
    
    try {
      const response = await fetch('https://api.openai.com/v1/models', requestOptions);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(`OpenAI API Error: ${error.error?.message || response.statusText}`);
      }
      
      const data = await response.json();
      
      // Normalize the response format
      return data.data.map(model => ({
        id: model.id,
        name: model.id,
        provider: 'openai',
        created: model.created,
        owned_by: model.owned_by,
        rawData: model
      }));
    } catch (error) {
      console.error('OpenAI models error:', error);
      throw error;
    }
  }

  /**
   * Get usage information for this adapter instance
   * 
   * @returns {Object} Usage information
   */
  async getUsage() {
    return {
      ...this.usage,
      provider: 'openai'
    };
  }

  /**
   * Update usage tracking
   * @private
   */
  _updateUsage(usage) {
    this.usage.promptTokens += usage.promptTokens;
    this.usage.completionTokens += usage.completionTokens;
    this.usage.totalTokens += usage.totalTokens;
    this.usage.totalRequests++;
    this.usage.lastRequest = new Date();
    
    // Call the onTokenUsage callback if provided
    if (this.config.onTokenUsage && typeof this.config.onTokenUsage === 'function') {
      this.config.onTokenUsage(usage);
    }
  }

  /**
   * Estimate token count for a string
   * This is a very rough approximation. For accurate token counting, 
   * use a proper tokenizer like OpenAI's tiktoken
   * @private
   */
  _estimateTokenCount(text) {
    if (!text) return 0;
    
    // Very rough approximation: 1 token ≈ 4 characters
    return Math.ceil(text.length / 4);
  }
}

export default OpenAIAdapter;
