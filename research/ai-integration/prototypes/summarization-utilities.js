/**
 * Summarization Utilities for Novel Content
 * 
 * This module provides utilities for creating and managing summaries
 * of novel content at different levels of granularity.
 */

const { OpenAI } = require('openai');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Estimator for token counts (simplified)
 * @param {string} text - Text to estimate tokens for
 * @returns {number} Estimated token count
 */
function estimateTokenCount(text) {
  return Math.ceil(text.split(/\s+/).length * 1.3); // Very rough estimate
}

/**
 * Generates summaries for text using AI models
 */
class SummaryGenerator {
  constructor(options = {}) {
    this.model = options.model || 'gpt-3.5-turbo';
    this.maxSummaryLength = options.maxSummaryLength || 1000;
    this.temperature = options.temperature || 0.3; // Lower for more deterministic summaries
    this.compressionRates = options.compressionRates || {
      high: 0.1,    // Compress to ~10% of original (very concise)
      medium: 0.25, // Compress to ~25% of original (balanced)
      low: 0.4      // Compress to ~40% of original (detailed)
    };
  }
  
  /**
   * Generate a summary of the given text
   * @param {string} text - Text to summarize
   * @param {object} options - Summary options
   * @returns {Promise<string>} Generated summary
   */
  async summarizeText(text, options = {}) {
    const compressionLevel = options.compressionLevel || 'medium';
    const compressionRate = this.compressionRates[compressionLevel] || this.compressionRates.medium;
    const originalTokens = estimateTokenCount(text);
    const targetTokens = Math.min(
      this.maxSummaryLength,
      Math.ceil(originalTokens * compressionRate)
    );
    
    // Create prompt for summarization
    const prompt = this._createSummarizationPrompt(text, {
      ...options,
      targetTokens
    });
    
    // Call API for summary generation
    try {
      const response = await openai.chat.completions.create({
        model: options.model || this.model,
        messages: [{ role: "user", content: prompt }],
        temperature: options.temperature || this.temperature,
        max_tokens: Math.min(2048, targetTokens * 1.2), // Allow some buffer
      });
      
      return response.choices[0].message.content.trim();
    } catch (error) {
      console.error('Error generating summary:', error.message);
      
      // Fallback to a simple extractive summary
      return this._generateFallbackSummary(text, targetTokens);
    }
  }
  
  /**
   * Create a prompt for summarization
   * @private
   */
  _createSummarizationPrompt(text, options = {}) {
    const targetTokens = options.targetTokens || 200;
    const preserveStyle = options.preserveStyle !== false;
    const preserveDialogue = options.preserveDialogue !== false;
    const focusOnPlot = options.focusOnPlot !== false;
    const focusOnCharacters = options.focusOnCharacters !== false;
    
    return `
# Summarization Task

## Content to Summarize
${text}

## Instructions
Please create a concise summary of the above content with the following characteristics:
- Aim for approximately ${targetTokens} tokens
- ${preserveStyle ? 'Preserve the original writing style and tone' : 'Use a neutral, informative tone'}
- ${preserveDialogue ? 'Include key dialogue exchanges that reveal character or advance plot' : 'Focus on narrative events rather than dialogue'}
- ${focusOnPlot ? 'Prioritize plot progression and key events' : 'Balance coverage of all content elements'}
- ${focusOnCharacters ? 'Highlight character development and motivations' : 'Focus on events and actions more than character details'}

The summary should capture the essential information while significantly condensing the original text. 
Do not include meta-commentary about the summarization process itself.
`;
  }
  
  /**
   * Generate a fallback summary if the API call fails
   * Simple extractive approach as backup
   * @private
   */
  _generateFallbackSummary(text, targetTokens) {
    // Extract sentences
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
    
    if (sentences.length === 0) {
      return 'Error: Could not generate summary.';
    }
    
    // Simple extractive approach - take first sentence and a sample of others
    const firstSentence = sentences[0];
    const avgSentenceTokens = estimateTokenCount(text) / sentences.length;
    const sentencesToExtract = Math.max(1, Math.floor(targetTokens / avgSentenceTokens) - 1);
    
    // Take sentences distributed through the text for better coverage
    const extractedSentences = [firstSentence];
    if (sentences.length > 1 && sentencesToExtract > 0) {
      const interval = Math.max(1, Math.floor(sentences.length / sentencesToExtract));
      for (let i = interval; i < sentences.length && extractedSentences.length < sentencesToExtract + 1; i += interval) {
        extractedSentences.push(sentences[i]);
      }
    }
    
    return extractedSentences.join(' ');
  }
}

/**
 * Creates summaries across hierarchical document structure
 */
class HierarchicalSummarizer {
  constructor(options = {}) {
    this.summaryGenerator = new SummaryGenerator(options.generator);
    this.defaultLevels = options.defaultLevels || ['chapter', 'scene', 'beat'];
    this.compressionRate = options.compressionRate || 0.25;
  }
  
  /**
   * Generate summaries for a hierarchical document structure
   * @param {object} document - Document with hierarchical structure
   * @param {object} options - Summarization options
   * @returns {Promise<object>} Document with added summaries
   */
  async summarizeDocument(document, options = {}) {
    const levels = options.levels || this.defaultLevels;
    const result = { ...document };
    
    // Process each level in the hierarchy
    for (const level of levels) {
      await this._processLevel(result, level, options);
    }
    
    // Generate a document-level summary if needed
    if (options.documentSummary !== false) {
      result.summary = await this._generateDocumentSummary(result, options);
    }
    
    return result;
  }
  
  /**
   * Process a single level in the hierarchy
   * @private
   */
  async _processLevel(document, level, options) {
    // Check if this level exists in the document
    if (!document[level + 's'] || !Array.isArray(document[level + 's'])) {
      return;
    }
    
    // Process each item at this level
    for (const item of document[level + 's']) {
      // Generate summary for this item if it has content
      if (item.content) {
        item.summary = await this.summaryGenerator.summarizeText(item.content, {
          ...options,
          compressionLevel: options[level + 'CompressionLevel'] || 'medium'
        });
      }
      
      // Recursively process any child levels
      for (const childLevel of levels) {
        if (childLevel !== level) {
          await this._processLevel(item, childLevel, options);
        }
      }
    }
  }
  
  /**
   * Generate a document-level summary
   * @private
   */
  async _generateDocumentSummary(document, options) {
    // Compile all chapter summaries into one text
    const chapterSummaries = document.chapters
      ? document.chapters.map(chapter => chapter.summary || '').filter(Boolean).join('\n\n')
      : '';
    
    if (!chapterSummaries) {
      return '';
    }
    
    // Generate a summary of summaries
    return await this.summaryGenerator.summarizeText(chapterSummaries, {
      ...options,
      compressionLevel: options.documentCompressionLevel || 'high'
    });
  }
}

/**
 * Creates increasingly compressed summaries
 */
class ProgressiveSummarizer {
  constructor(options = {}) {
    this.summaryGenerator = new SummaryGenerator(options.generator);
    this.levels = options.levels || 3;
    this.baseCompressionRate = options.baseCompressionRate || 0.4; // Start with 40% compression
    this.levelMultiplier = options.levelMultiplier || 0.5; // Each level compresses by 50% of previous
  }
  
  /**
   * Generate progressively compressed summaries
   * @param {string} text - Original text
   * @param {object} options - Summarization options
   * @returns {Promise<Array<string>>} Array of increasingly compressed summaries
   */
  async generateProgressiveSummaries(text, options = {}) {
    const levels = options.levels || this.levels;
    const summaries = [];
    
    let currentText = text;
    
    for (let i = 0; i < levels; i++) {
      // Calculate compression rate for this level
      const levelCompression = this.baseCompressionRate * Math.pow(this.levelMultiplier, i);
      
      // Generate summary
      const summary = await this.summaryGenerator.summarizeText(currentText, {
        ...options,
        compressionRate: levelCompression
      });
      
      summaries.push(summary);
      currentText = summary; // Next level summarizes the previous summary
    }
    
    return summaries;
  }
  
  /**
   * Get a specific level of summary
   * @param {string} text - Original text
   * @param {number} level - Summary level (0 = least compressed, higher = more compressed)
   * @param {object} options - Summarization options
   * @returns {Promise<string>} Generated summary
   */
  async getSummaryAtLevel(text, level, options = {}) {
    if (level <= 0) {
      return text;
    }
    
    const summaries = await this.generateProgressiveSummaries(text, {
      ...options,
      levels: level
    });
    
    return summaries[summaries.length - 1];
  }
}

/**
 * Caches and manages summaries to avoid regeneration
 */
class SummaryCache {
  constructor(options = {}) {
    this.storageDir = options.storageDir || path.join(__dirname, 'cache');
    this.defaultFilename = options.defaultFilename || 'summary-cache.json';
    this.cache = new Map(); // Map of contentHash -> summary
    this.ttl = options.ttl || 7 * 24 * 60 * 60 * 1000; // 7 days
    this.stats = {
      hits: 0,
      misses: 0
    };
    
    // Create storage directory if it doesn't exist
    if (!fs.existsSync(this.storageDir)) {
      fs.mkdirSync(this.storageDir, { recursive: true });
    }
    
    // Load cache from disk
    this._loadFromDisk();
  }
  
  /**
   * Get a summary from cache
   * @param {string} content - Content to get summary for
   * @param {string} type - Type of summary (e.g., 'progressive-1', 'hierarchical-chapter')
   * @returns {string|null} Cached summary or null if not found
   */
  getSummary(content, type) {
    const key = this._generateKey(content, type);
    
    if (!this.cache.has(key)) {
      this.stats.misses++;
      return null;
    }
    
    const entry = this.cache.get(key);
    
    // Check if expired
    if (entry.expiry < Date.now()) {
      this.cache.delete(key);
      this.stats.misses++;
      return null;
    }
    
    this.stats.hits++;
    return entry.summary;
  }
  
  /**
   * Store a summary in cache
   * @param {string} content - Original content
   * @param {string} summary - Generated summary
   * @param {string} type - Type of summary
   */
  storeSummary(content, summary, type) {
    const key = this._generateKey(content, type);
    
    this.cache.set(key, {
      summary,
      created: Date.now(),
      expiry: Date.now() + this.ttl
    });
  }
  
  /**
   * Generate a cache key
   * @private
   */
  _generateKey(content, type) {
    // Simple hash function
    let hash = 0;
    const str = content.substring(0, 1000); // Use first 1000 chars for efficiency
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    
    return `${type}-${hash.toString(16)}`;
  }
  
  /**
   * Save cache to disk
   */
  saveToDisk() {
    const filePath = path.join(this.storageDir, this.defaultFilename);
    
    const serializable = {};
    for (const [key, entry] of this.cache.entries()) {
      serializable[key] = entry;
    }
    
    fs.writeFileSync(filePath, JSON.stringify({
      cache: serializable,
      stats: this.stats,
      saved: new Date().toISOString()
    }, null, 2));
    
    console.log(`Summary cache saved to ${filePath}`);
  }
  
  /**
   * Load cache from disk
   * @private
   */
  _loadFromDisk() {
    const filePath = path.join(this.storageDir, this.defaultFilename);
    
    if (!fs.existsSync(filePath)) {
      return;
    }
    
    try {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      
      if (data.cache) {
        for (const [key, entry] of Object.entries(data.cache)) {
          // Skip expired entries
          if (entry.expiry > Date.now()) {
            this.cache.set(key, entry);
          }
        }
      }
      
      if (data.stats) {
        this.stats = data.stats;
      }
      
      console.log(`Summary cache loaded from ${filePath}`);
    } catch (error) {
      console.error(`Error loading summary cache:`, error.message);
    }
  }
  
  /**
   * Get cache statistics
   * @returns {object} Cache statistics
   */
  getStats() {
    const hitRate = this.stats.hits + this.stats.misses === 0 
      ? 0 
      : (this.stats.hits / (this.stats.hits + this.stats.misses)) * 100;
    
    return {
      ...this.stats,
      hitRate: `${hitRate.toFixed(2)}%`,
      size: this.cache.size
    };
  }
}

/**
 * Main class for summary management
 */
class SummaryManager {
  constructor(options = {}) {
    this.summaryGenerator = new SummaryGenerator(options.generator);
    this.hierarchicalSummarizer = new HierarchicalSummarizer({
      ...options.hierarchical,
      generator: options.generator
    });
    this.progressiveSummarizer = new ProgressiveSummarizer({
      ...options.progressive,
      generator: options.generator
    });
    this.summaryCache = new SummaryCache(options.cache);
    
    this.maxLevels = options.maxLevels || 3;
    this.autoSave = options.autoSave !== false;
  }
  
  /**
   * Generate a simple summary for text
   * @param {string} text - Text to summarize
   * @param {object} options - Summary options
   * @returns {Promise<string>} Generated summary
   */
  async summarizeText(text, options = {}) {
    const type = `simple-${options.compressionLevel || 'medium'}`;
    
    // Check cache first
    const cachedSummary = this.summaryCache.getSummary(text, type);
    if (cachedSummary) {
      return cachedSummary;
    }
    
    // Generate new summary
    const summary = await this.summaryGenerator.summarizeText(text, options);
    
    // Cache the result
    this.summaryCache.storeSummary(text, summary, type);
    
    // Save cache if auto-save is enabled
    if (this.autoSave) {
      this.summaryCache.saveToDisk();
    }
    
    return summary;
  }
  
  /**
   * Generate progressive summaries for text
   * @param {string} text - Text to summarize
   * @param {number} levels - Number of summary levels to generate
   * @param {object} options - Summary options
   * @returns {Promise<Array<string>>} Array of summaries
   */
  async generateProgressiveSummaries(text, levels = 3, options = {}) {
    const actualLevels = Math.min(levels, this.maxLevels);
    
    // Check cache first for highest level as a quick first check
    const topLevelType = `progressive-${actualLevels}`;
    const cachedTopLevel = this.summaryCache.getSummary(text, topLevelType);
    
    // If we don't even have the top level cached, generate all levels
    if (!cachedTopLevel) {
      const summaries = await this.progressiveSummarizer.generateProgressiveSummaries(text, {
        ...options,
        levels: actualLevels
      });
      
      // Cache each level
      for (let i = 0; i < summaries.length; i++) {
        this.summaryCache.storeSummary(text, summaries[i], `progressive-${i + 1}`);
      }
      
      // Save cache if auto-save is enabled
      if (this.autoSave) {
        this.summaryCache.saveToDisk();
      }
      
      return summaries;
    }
    
    // Otherwise, check each level and regenerate missing ones
    const summaries = [];
    let currentText = text;
    
    for (let i = 0; i < actualLevels; i++) {
      const levelType = `progressive-${i + 1}`;
      const cachedSummary = this.summaryCache.getSummary(currentText, levelType);
      
      if (cachedSummary) {
        summaries.push(cachedSummary);
        currentText = cachedSummary;
      } else {
        // Generate this level from the current text
        const summary = await this.summaryGenerator.summarizeText(currentText, {
          ...options,
          compressionRate: this.progressiveSummarizer.baseCompressionRate * 
            Math.pow(this.progressiveSummarizer.levelMultiplier, i)
        });
        
        summaries.push(summary);
        this.summaryCache.storeSummary(currentText, summary, levelType);
        currentText = summary;
      }
    }
    
    // Save cache if auto-save is enabled
    if (this.autoSave) {
      this.summaryCache.saveToDisk();
    }
    
    return summaries;
  }
  
  /**
   * Generate hierarchical summaries for a document structure
   * @param {object} document - Document with hierarchical structure
   * @param {object} options - Summary options
   * @returns {Promise<object>} Document with summaries
   */
  async generateHierarchicalSummaries(document, options = {}) {
    // For hierarchical summaries, caching is more complex
    // We'll do a simplified approach for now
    
    // Use a hash of the document structure as cache key
    const documentStr = JSON.stringify(document);
    const type = `hierarchical`;
    
    // Check cache
    const cachedSummary = this.summaryCache.getSummary(documentStr, type);
    if (cachedSummary) {
      return JSON.parse(cachedSummary);
    }
    
    // Generate hierarchical summaries
    const result = await this.hierarchicalSummarizer.summarizeDocument(document, options);
    
    // Cache the result
    this.summaryCache.storeSummary(documentStr, JSON.stringify(result), type);
    
    // Save cache if auto-save is enabled
    if (this.autoSave) {
      this.summaryCache.saveToDisk();
    }
    
    return result;
  }
  
  /**
   * Save all cached summaries to disk
   */
  saveToDisk() {
    this.summaryCache.saveToDisk();
  }
  
  /**
   * Get statistics about the cache
   * @returns {object} Cache statistics
   */
  getStats() {
    return this.summaryCache.getStats();
  }
}

module.exports = {
  estimateTokenCount,
  SummaryGenerator,
  HierarchicalSummarizer,
  ProgressiveSummarizer,
  SummaryCache,
  SummaryManager
};
