/**
 * Semantic Similarity Search for Context Relevance
 * 
 * This module implements vector embeddings and similarity search
 * to find the most relevant context for a given query or position
 * in a novel-length document.
 */

const { OpenAI } = require('openai');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Initialize OpenAI client for embeddings
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Calculates cosine similarity between two vectors
 * @param {Array<number>} a - First vector
 * @param {Array<number>} b - Second vector
 * @returns {number} Similarity score between 0 and 1
 */
function cosineSimilarity(a, b) {
  if (a.length !== b.length) {
    throw new Error('Vectors must have the same dimensions');
  }
  
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  
  normA = Math.sqrt(normA);
  normB = Math.sqrt(normB);
  
  if (normA === 0 || normB === 0) {
    return 0;
  }
  
  return dotProduct / (normA * normB);
}

/**
 * Generates vector embeddings for text using OpenAI's embedding API
 */
class EmbeddingGenerator {
  constructor(options = {}) {
    this.model = options.model || 'text-embedding-ada-002';
    this.batchSize = options.batchSize || 10; // Number of texts to embed in one batch
    this.defaultDimensions = options.dimensions || 1536; // Ada-002 dimensions
  }
  
  /**
   * Generate an embedding for a single text
   * @param {string} text - Text to embed
   * @returns {Promise<Array<number>>} Vector embedding
   */
  async embedText(text) {
    try {
      const response = await openai.embeddings.create({
        model: this.model,
        input: text,
      });
      
      return response.data[0].embedding;
    } catch (error) {
      console.error('Error generating embedding:', error.message);
      
      // Return a zero vector as fallback
      return new Array(this.defaultDimensions).fill(0);
    }
  }
  
  /**
   * Generate embeddings for multiple texts
   * @param {Array<string>} texts - Texts to embed
   * @returns {Promise<Array<Array<number>>>} Array of vector embeddings
   */
  async embedTexts(texts) {
    const embeddings = [];
    
    // Process in batches to avoid rate limits
    for (let i = 0; i < texts.length; i += this.batchSize) {
      const batch = texts.slice(i, i + this.batchSize);
      console.log(`Embedding batch ${i / this.batchSize + 1} of ${Math.ceil(texts.length / this.batchSize)}`);
      
      try {
        const response = await openai.embeddings.create({
          model: this.model,
          input: batch,
        });
        
        const batchEmbeddings = response.data.map(item => item.embedding);
        embeddings.push(...batchEmbeddings);
      } catch (error) {
        console.error(`Error embedding batch at index ${i}:`, error.message);
        
        // Add zero vectors as fallback
        for (let j = 0; j < batch.length; j++) {
          embeddings.push(new Array(this.defaultDimensions).fill(0));
        }
      }
      
      // Simple rate limiting
      if (i + this.batchSize < texts.length) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    return embeddings;
  }
}

/**
 * Stores and manages embeddings with optional persistence
 */
class VectorStore {
  constructor(options = {}) {
    this.storageDir = options.storageDir || path.join(__dirname, 'cache');
    this.defaultFilename = options.defaultFilename || 'vector-store.json';
    this.vectors = new Map(); // Map of id -> {text, embedding, metadata}
    
    // Create storage directory if it doesn't exist
    if (!fs.existsSync(this.storageDir)) {
      fs.mkdirSync(this.storageDir, { recursive: true });
    }
  }
  
  /**
   * Add a vector to the store
   * @param {string} id - Unique identifier for the vector
   * @param {string} text - Original text
   * @param {Array<number>} embedding - Vector embedding
   * @param {Object} metadata - Optional metadata
   */
  addVector(id, text, embedding, metadata = {}) {
    this.vectors.set(id, {
      text,
      embedding,
      metadata,
      timestamp: Date.now()
    });
  }
  
  /**
   * Add multiple vectors to the store
   * @param {Array<Object>} vectors - Array of {id, text, embedding, metadata} objects
   */
  addVectors(vectors) {
    for (const vector of vectors) {
      this.addVector(vector.id, vector.text, vector.embedding, vector.metadata);
    }
  }
  
  /**
   * Get a vector from the store
   * @param {string} id - Unique identifier for the vector
   * @returns {Object|null} Vector object or null if not found
   */
  getVector(id) {
    return this.vectors.get(id) || null;
  }
  
  /**
   * Get all vectors in the store
   * @returns {Array<Object>} Array of vector objects
   */
  getAllVectors() {
    return Array.from(this.vectors.entries())
      .map(([id, data]) => ({ id, ...data }));
  }
  
  /**
   * Save the vector store to disk
   * @param {string} filename - Optional filename
   */
  save(filename = this.defaultFilename) {
    const filePath = path.join(this.storageDir, filename);
    
    const serializable = Array.from(this.vectors.entries())
      .map(([id, data]) => ({ id, ...data }));
    
    fs.writeFileSync(filePath, JSON.stringify({
      vectors: serializable,
      saved: new Date().toISOString()
    }, null, 2));
    
    console.log(`Vector store saved to ${filePath}`);
  }
  
  /**
   * Load the vector store from disk
   * @param {string} filename - Optional filename
   * @returns {boolean} Success status
   */
  load(filename = this.defaultFilename) {
    const filePath = path.join(this.storageDir, filename);
    
    if (!fs.existsSync(filePath)) {
      console.warn(`Vector store file not found: ${filePath}`);
      return false;
    }
    
    try {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      
      this.vectors.clear();
      for (const vector of data.vectors) {
        const { id, ...vectorData } = vector;
        this.vectors.set(id, vectorData);
      }
      
      console.log(`Vector store loaded from ${filePath}`);
      return true;
    } catch (error) {
      console.error(`Error loading vector store:`, error.message);
      return false;
    }
  }
  
  /**
   * Clear all vectors from the store
   */
  clear() {
    this.vectors.clear();
  }
  
  /**
   * Get the number of vectors in the store
   * @returns {number} Vector count
   */
  size() {
    return this.vectors.size;
  }
}

/**
 * Performs similarity search between vectors
 */
class SimilaritySearch {
  constructor(options = {}) {
    this.similarityFunction = options.similarityFunction || cosineSimilarity;
    this.minSimilarityScore = options.minSimilarityScore || 0.7;
  }
  
  /**
   * Find the most similar vectors to a query vector
   * @param {Array<number>} queryVector - Query vector
   * @param {Array<Object>} targetVectors - Array of {id, embedding, ...} objects
   * @param {number} topK - Number of results to return
   * @returns {Array<Object>} Array of {id, similarity, ...} objects
   */
  findSimilar(queryVector, targetVectors, topK = 5) {
    const results = targetVectors.map(target => {
      const similarity = this.similarityFunction(queryVector, target.embedding);
      return {
        id: target.id,
        similarity,
        text: target.text,
        metadata: target.metadata
      };
    });
    
    // Sort by similarity (descending)
    results.sort((a, b) => b.similarity - a.similarity);
    
    // Filter by minimum similarity score
    const filteredResults = results.filter(
      result => result.similarity >= this.minSimilarityScore
    );
    
    // Return top K results
    return filteredResults.slice(0, topK);
  }
  
  /**
   * Find the most similar text chunks to a query text
   * @param {Array<number>} queryVector - Query vector
   * @param {VectorStore} vectorStore - Vector store
   * @param {number} topK - Number of results to return
   * @returns {Array<Object>} Array of {id, similarity, text, ...} objects
   */
  findSimilarFromStore(queryVector, vectorStore, topK = 5) {
    const targetVectors = vectorStore.getAllVectors();
    return this.findSimilar(queryVector, targetVectors, topK);
  }
}

/**
 * Caches embeddings to reduce API calls
 */
class EmbeddingCache {
  constructor(options = {}) {
    this.storageDir = options.storageDir || path.join(__dirname, 'cache');
    this.defaultFilename = options.defaultFilename || 'embedding-cache.json';
    this.cache = new Map(); // Map of text hash -> embedding
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
   * Hash text for cache key
   * @param {string} text - Text to hash
   * @returns {string} Hash
   */
  _hashText(text) {
    // Simple hash function
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString(16);
  }
  
  /**
   * Get embedding from cache
   * @param {string} text - Text to get embedding for
   * @returns {Array<number>|null} Embedding or null if not in cache
   */
  getEmbedding(text) {
    const hash = this._hashText(text);
    
    if (!this.cache.has(hash)) {
      this.stats.misses++;
      return null;
    }
    
    const entry = this.cache.get(hash);
    
    // Check if expired
    if (entry.expiry < Date.now()) {
      this.cache.delete(hash);
      this.stats.misses++;
      return null;
    }
    
    this.stats.hits++;
    return entry.embedding;
  }
  
  /**
   * Store embedding in cache
   * @param {string} text - Text the embedding is for
   * @param {Array<number>} embedding - Vector embedding
   */
  storeEmbedding(text, embedding) {
    const hash = this._hashText(text);
    
    this.cache.set(hash, {
      embedding,
      created: Date.now(),
      expiry: Date.now() + this.ttl
    });
  }
  
  /**
   * Save cache to disk
   */
  saveToDisk() {
    const filePath = path.join(this.storageDir, this.defaultFilename);
    
    const serializable = {};
    for (const [hash, entry] of this.cache.entries()) {
      serializable[hash] = entry;
    }
    
    fs.writeFileSync(filePath, JSON.stringify({
      cache: serializable,
      stats: this.stats,
      saved: new Date().toISOString()
    }, null, 2));
    
    console.log(`Embedding cache saved to ${filePath}`);
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
        for (const [hash, entry] of Object.entries(data.cache)) {
          // Skip expired entries
          if (entry.expiry > Date.now()) {
            this.cache.set(hash, entry);
          }
        }
      }
      
      if (data.stats) {
        this.stats = data.stats;
      }
      
      console.log(`Embedding cache loaded from ${filePath}`);
    } catch (error) {
      console.error(`Error loading embedding cache:`, error.message);
    }
  }
  
  /**
   * Get cache statistics
   * @returns {Object} Cache statistics
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
  
  /**
   * Clear the cache
   */
  clear() {
    this.cache.clear();
    this.stats.hits = 0;
    this.stats.misses = 0;
  }
}

/**
 * Main class that combines embedding generation, storage, and search
 */
class SemanticContextFinder {
  constructor(options = {}) {
    this.embeddingGenerator = new EmbeddingGenerator(options.embedding);
    this.vectorStore = new VectorStore(options.store);
    this.similaritySearch = new SimilaritySearch(options.search);
    this.embeddingCache = new EmbeddingCache(options.cache);
    
    // Configuration
    this.topK = options.topK || 5;
    this.similarityThreshold = options.similarityThreshold || 0.7;
    this.autoSave = options.autoSave !== false;
  }
  
  /**
   * Index a collection of text chunks
   * @param {Array<Object>} textChunks - Array of {id, text, metadata} objects
   * @param {Object} options - Indexing options
   * @returns {Promise<boolean>} Success status
   */
  async indexTexts(textChunks, options = {}) {
    if (!textChunks || textChunks.length === 0) {
      console.warn('No text chunks provided for indexing');
      return false;
    }
    
    try {
      console.log(`Indexing ${textChunks.length} text chunks...`);
      
      // Process each chunk, checking cache first
      const textsToEmbed = [];
      const textsToEmbedIndices = [];
      const results = new Array(textChunks.length);
      
      // Check cache first
      for (let i = 0; i < textChunks.length; i++) {
        const cachedEmbedding = this.embeddingCache.getEmbedding(textChunks[i].text);
        
        if (cachedEmbedding) {
          // Use cached embedding
          results[i] = cachedEmbedding;
        } else {
          // Need to generate embedding
          textsToEmbed.push(textChunks[i].text);
          textsToEmbedIndices.push(i);
        }
      }
      
      // Generate embeddings for texts not in cache
      if (textsToEmbed.length > 0) {
        console.log(`Generating embeddings for ${textsToEmbed.length} texts not in cache...`);
        const newEmbeddings = await this.embeddingGenerator.embedTexts(textsToEmbed);
        
        // Store new embeddings in cache and results
        for (let i = 0; i < newEmbeddings.length; i++) {
          const originalIndex = textsToEmbedIndices[i];
          results[originalIndex] = newEmbeddings[i];
          this.embeddingCache.storeEmbedding(textChunks[originalIndex].text, newEmbeddings[i]);
        }
      }
      
      // Add vectors to store
      for (let i = 0; i < textChunks.length; i++) {
        this.vectorStore.addVector(
          textChunks[i].id,
          textChunks[i].text,
          results[i],
          textChunks[i].metadata
        );
      }
      
      console.log(`Successfully indexed ${textChunks.length} text chunks`);
      
      // Save to disk if auto-save is enabled
      if (this.autoSave) {
        this.vectorStore.save();
        this.embeddingCache.saveToDisk();
      }
      
      return true;
    } catch (error) {
      console.error('Error indexing texts:', error.message);
      return false;
    }
  }
  
  /**
   * Find the most relevant text chunks for a query
   * @param {string} query - Query text
   * @param {Object} options - Search options
   * @returns {Promise<Array<Object>>} Array of {id, similarity, text, ...} objects
   */
  async findRelevantContext(query, options = {}) {
    try {
      const topK = options.topK || this.topK;
      
      // Check cache for query embedding
      let queryEmbedding = this.embeddingCache.getEmbedding(query);
      
      // Generate embedding if not in cache
      if (!queryEmbedding) {
        queryEmbedding = await this.embeddingGenerator.embedText(query);
        this.embeddingCache.storeEmbedding(query, queryEmbedding);
      }
      
      // Find similar vectors
      const results = this.similaritySearch.findSimilarFromStore(
        queryEmbedding,
        this.vectorStore,
        topK
      );
      
      return results;
    } catch (error) {
      console.error('Error finding relevant context:', error.message);
      return [];
    }
  }
  
  /**
   * Save all data to disk
   */
  saveToDisk() {
    this.vectorStore.save();
    this.embeddingCache.saveToDisk();
  }
  
  /**
   * Load all data from disk
   * @returns {boolean} Success status
   */
  loadFromDisk() {
    const vectorStoreLoaded = this.vectorStore.load();
    return vectorStoreLoaded; // Cache is loaded in constructor
  }
  
  /**
   * Get statistics about the finder
   * @returns {Object} Statistics
   */
  getStats() {
    return {
      vectorStore: {
        size: this.vectorStore.size()
      },
      embeddingCache: this.embeddingCache.getStats()
    };
  }
}

module.exports = {
  cosineSimilarity,
  EmbeddingGenerator,
  VectorStore,
  SimilaritySearch,
  EmbeddingCache,
  SemanticContextFinder
};
