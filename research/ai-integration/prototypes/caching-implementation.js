/**
 * Caching Implementation for AI-Assisted Writing Features
 * 
 * This module implements basic caching strategies for AI-assisted writing features
 * to improve performance, reduce API costs, and enhance user experience.
 * 
 * Based on the strategies defined in EXP-003-caching-mechanisms.md
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

/**
 * Simple in-memory cache implementation
 */
class MemoryCache {
  constructor(options = {}) {
    this.cache = new Map();
    this.maxSize = options.maxSize || 1000; // Maximum number of entries
    this.ttl = options.ttl || 24 * 60 * 60 * 1000; // Default TTL: 24 hours
    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0,
      evictions: 0
    };
  }

  /**
   * Get a value from cache
   * @param {string} key - Cache key
   * @returns {object|null} - Cached value or null if not found/expired
   */
  get(key) {
    if (!this.cache.has(key)) {
      this.stats.misses++;
      return null;
    }

    const item = this.cache.get(key);
    
    // Check if expired
    if (item.expiry < Date.now()) {
      this.cache.delete(key);
      this.stats.misses++;
      return null;
    }

    // Update access time for LRU
    item.lastAccessed = Date.now();
    this.stats.hits++;
    return item.value;
  }

  /**
   * Set a value in cache
   * @param {string} key - Cache key
   * @param {object} value - Value to cache
   * @param {number} ttl - Time to live in ms (optional, uses default if not provided)
   */
  set(key, value, ttl = this.ttl) {
    // Evict items if cache is full
    if (this.cache.size >= this.maxSize) {
      this._evictLRU();
    }

    this.cache.set(key, {
      value,
      created: Date.now(),
      lastAccessed: Date.now(),
      expiry: Date.now() + ttl
    });
    
    this.stats.sets++;
  }

  /**
   * Clear the entire cache
   */
  clear() {
    this.cache.clear();
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
      size: this.cache.size,
      maxSize: this.maxSize
    };
  }

  /**
   * Evict least recently used items
   * @private
   */
  _evictLRU() {
    let oldest = Infinity;
    let oldestKey = null;

    // Find the least recently accessed item
    for (const [key, item] of this.cache.entries()) {
      if (item.lastAccessed < oldest) {
        oldest = item.lastAccessed;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
      this.stats.evictions++;
    }
  }
}

/**
 * Persistent cache that saves to disk
 */
class PersistentCache extends MemoryCache {
  constructor(options = {}) {
    super(options);
    this.filePath = options.filePath || path.join(__dirname, 'cache', 'ai-cache.json');
    this.saveInterval = options.saveInterval || 5 * 60 * 1000; // 5 minutes
    this.dirty = false;

    // Create cache directory if it doesn't exist
    const cacheDir = path.dirname(this.filePath);
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }

    // Load cache from disk if it exists
    this._loadFromDisk();

    // Set up periodic saving
    this._setupPeriodicSave();
  }

  /**
   * Set a value in cache and mark for saving
   * @override
   */
  set(key, value, ttl = this.ttl) {
    super.set(key, value, ttl);
    this.dirty = true;
  }

  /**
   * Save cache to disk
   */
  saveToDisk() {
    if (!this.dirty) return;

    try {
      // Convert cache to serializable format
      const serializable = {};
      for (const [key, item] of this.cache.entries()) {
        serializable[key] = item;
      }

      fs.writeFileSync(
        this.filePath, 
        JSON.stringify({
          cache: serializable,
          stats: this.stats,
          saved: new Date().toISOString()
        }, null, 2)
      );
      
      this.dirty = false;
      console.log(`Cache saved to ${this.filePath}`);
    } catch (error) {
      console.error('Error saving cache to disk:', error.message);
    }
  }

  /**
   * Load cache from disk
   * @private
   */
  _loadFromDisk() {
    try {
      if (fs.existsSync(this.filePath)) {
        const data = JSON.parse(fs.readFileSync(this.filePath, 'utf8'));
        
        // Restore cache
        if (data.cache) {
          for (const [key, item] of Object.entries(data.cache)) {
            // Skip expired items
            if (item.expiry > Date.now()) {
              this.cache.set(key, item);
            }
          }
        }
        
        // Restore stats
        if (data.stats) {
          this.stats = data.stats;
        }
        
        console.log(`Cache loaded from ${this.filePath}`);
      }
    } catch (error) {
      console.error('Error loading cache from disk:', error.message);
    }
  }

  /**
   * Set up periodic saving to disk
   * @private
   */
  _setupPeriodicSave() {
    setInterval(() => {
      this.saveToDisk();
    }, this.saveInterval);

    // Save on process exit
    process.on('exit', () => {
      this.saveToDisk();
    });
  }
}

/**
 * AI Response Cache Manager
 * Implements various caching strategies for AI responses
 */
class AICacheManager {
  constructor(options = {}) {
    // Create caches
    this.exactMatchCache = options.persistent 
      ? new PersistentCache({ 
          filePath: path.join(__dirname, 'cache', 'exact-match-cache.json'),
          ttl: options.exactMatchTTL || 7 * 24 * 60 * 60 * 1000 // 7 days
        })
      : new MemoryCache({
          ttl: options.exactMatchTTL || 7 * 24 * 60 * 60 * 1000 // 7 days
        });
    
    this.contextAwareCache = new MemoryCache({
      ttl: options.contextAwareTTL || 24 * 60 * 60 * 1000 // 24 hours
    });
    
    this.logCacheEvents = options.logCacheEvents || false;
  }

  /**
   * Generate a hash key for a prompt
   * @param {string} prompt - The prompt text
   * @param {object} parameters - Model parameters
   * @returns {string} Hash key
   */
  generateExactMatchKey(prompt, parameters = {}) {
    // Create a deterministic key based on prompt and relevant parameters
    const keySource = JSON.stringify({
      prompt,
      temperature: parameters.temperature,
      maxTokens: parameters.maxTokens
    });
    
    return crypto.createHash('sha256').update(keySource).digest('hex');
  }

  /**
   * Generate a context-aware key
   * @param {object} metadata - Novel metadata including characters, plot, etc.
   * @param {string} recentText - Recent text content
   * @param {object} parameters - Model parameters
   * @returns {string} Context-aware key
   */
  generateContextAwareKey(metadata, recentText, parameters = {}) {
    // Extract key elements for context matching
    const contextElements = {
      // Take only the last ~100 words of recent text for the key
      recentTextSample: recentText.split(/\s+/).slice(-100).join(' '),
      
      // Include key character names if present
      characterNames: metadata.characters ? 
        metadata.characters.map(c => c.name).join(',') : '',
      
      // Include genre and point of view if present
      genre: metadata.genre || '',
      pov: metadata.pointOfView || '',
      
      // Include model parameters
      temperature: parameters.temperature,
      maxTokens: parameters.maxTokens
    };
    
    const keySource = JSON.stringify(contextElements);
    return crypto.createHash('sha256').update(keySource).digest('hex');
  }

  /**
   * Get a cached response using exact match caching
   * @param {string} prompt - The exact prompt
   * @param {object} parameters - Model parameters
   * @returns {object|null} Cached response or null
   */
  getExactMatch(prompt, parameters) {
    const key = this.generateExactMatchKey(prompt, parameters);
    const result = this.exactMatchCache.get(key);
    
    if (this.logCacheEvents) {
      console.log(`Exact match cache ${result ? 'HIT' : 'MISS'} for key: ${key.substring(0, 8)}...`);
    }
    
    return result;
  }

  /**
   * Cache a response with exact match caching
   * @param {string} prompt - The exact prompt
   * @param {object} response - The response to cache
   * @param {object} parameters - Model parameters
   */
  setExactMatch(prompt, response, parameters) {
    const key = this.generateExactMatchKey(prompt, parameters);
    this.exactMatchCache.set(key, response);
    
    if (this.logCacheEvents) {
      console.log(`Cached response with exact match key: ${key.substring(0, 8)}...`);
    }
  }

  /**
   * Get a cached response using context-aware caching
   * @param {object} metadata - Novel metadata
   * @param {string} recentText - Recent text content
   * @param {object} parameters - Model parameters
   * @returns {object|null} Cached response or null
   */
  getContextAware(metadata, recentText, parameters) {
    const key = this.generateContextAwareKey(metadata, recentText, parameters);
    const result = this.contextAwareCache.get(key);
    
    if (this.logCacheEvents) {
      console.log(`Context-aware cache ${result ? 'HIT' : 'MISS'} for key: ${key.substring(0, 8)}...`);
    }
    
    return result;
  }

  /**
   * Cache a response with context-aware caching
   * @param {object} metadata - Novel metadata
   * @param {string} recentText - Recent text content
   * @param {object} response - The response to cache
   * @param {object} parameters - Model parameters
   */
  setContextAware(metadata, recentText, response, parameters) {
    const key = this.generateContextAwareKey(metadata, recentText, parameters);
    this.contextAwareCache.set(key, response);
    
    if (this.logCacheEvents) {
      console.log(`Cached response with context-aware key: ${key.substring(0, 8)}...`);
    }
  }

  /**
   * Get cache statistics
   * @returns {object} Cache statistics
   */
  getStats() {
    return {
      exactMatch: this.exactMatchCache.getStats(),
      contextAware: this.contextAwareCache.getStats()
    };
  }

  /**
   * Persist all caches to disk
   */
  persistCaches() {
    if (this.exactMatchCache instanceof PersistentCache) {
      this.exactMatchCache.saveToDisk();
    }
  }
}

module.exports = {
  MemoryCache,
  PersistentCache,
  AICacheManager
};
