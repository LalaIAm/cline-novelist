/**
 * Context Handling Implementation for Novel Writing
 * 
 * This module implements context management strategies for long-form novel content
 * to optimize AI prompt context windows, improve response relevance, and handle
 * novel-length documents effectively.
 * 
 * Based on the strategies defined in EXP-002-context-handling-strategies.md
 */

/**
 * Utility for estimating token count in a string
 * Note: This is a simplified estimation; in production, use a proper tokenizer
 */
function estimateTokenCount(text) {
  return Math.ceil(text.split(/\s+/).length * 1.3); // Very rough estimate
}

/**
 * Handles text segmentation based on different strategies
 */
class TextSegmenter {
  constructor(options = {}) {
    this.defaultStrategy = options.defaultStrategy || 'paragraph';
    this.paragraphBreak = options.paragraphBreak || '\n\n';
    this.sceneBreak = options.sceneBreak || '#';
    this.maxChunkSize = options.maxChunkSize || 1000; // tokens
  }

  /**
   * Segment text into chunks using the specified strategy
   * @param {string} text - The text to segment
   * @param {object} options - Segmentation options
   * @returns {array} Array of text chunks
   */
  segmentText(text, options = {}) {
    const strategy = options.strategy || this.defaultStrategy;
    
    switch (strategy) {
      case 'paragraph':
        return this.segmentByParagraph(text, options);
      case 'scene':
        return this.segmentByScene(text, options);
      case 'semantic':
        return this.segmentBySemantic(text, options);
      case 'fixed':
        return this.segmentByFixedSize(text, options);
      default:
        return this.segmentByParagraph(text, options);
    }
  }

  /**
   * Segment text by paragraphs
   * @param {string} text - The text to segment
   * @param {object} options - Segmentation options
   * @returns {array} Array of paragraphs
   */
  segmentByParagraph(text, options = {}) {
    const paragraphBreak = options.paragraphBreak || this.paragraphBreak;
    const paragraphs = text.split(paragraphBreak).filter(p => p.trim().length > 0);
    
    // Merge small paragraphs if they would result in too many tiny chunks
    return this._mergeSmallChunks(paragraphs, options);
  }

  /**
   * Segment text by scene breaks
   * @param {string} text - The text to segment
   * @param {object} options - Segmentation options
   * @returns {array} Array of scenes
   */
  segmentByScene(text, options = {}) {
    const sceneBreak = options.sceneBreak || this.sceneBreak;
    // Scene breaks can be represented in various ways (#, ***, scene break text, etc.)
    const sceneBreakPattern = new RegExp(`(^|\\n)\\s*${sceneBreak}+\\s*($|\\n)`, 'g');
    
    // Split by scene breaks
    const scenes = text.split(sceneBreakPattern).filter(s => s.trim().length > 0);
    
    // If scenes are too large, further segment them
    return this._handleOversizedChunks(scenes, options);
  }

  /**
   * Segment text by fixed size chunks
   * @param {string} text - The text to segment
   * @param {object} options - Segmentation options
   * @returns {array} Array of fixed-size chunks
   */
  segmentByFixedSize(text, options = {}) {
    const maxTokens = options.maxTokens || this.maxChunkSize;
    const chunks = [];
    const words = text.split(/\s+/);
    
    let currentChunk = [];
    let currentTokenCount = 0;
    
    for (const word of words) {
      // Rough token estimation for the word
      const wordTokens = Math.ceil(word.length / 4) + 1;
      
      if (currentTokenCount + wordTokens > maxTokens && currentChunk.length > 0) {
        // Chunk is full, store it and start a new one
        chunks.push(currentChunk.join(' '));
        currentChunk = [word];
        currentTokenCount = wordTokens;
      } else {
        // Add word to current chunk
        currentChunk.push(word);
        currentTokenCount += wordTokens;
      }
    }
    
    // Add the last chunk if it has content
    if (currentChunk.length > 0) {
      chunks.push(currentChunk.join(' '));
    }
    
    return chunks;
  }

  /**
   * Segment text based on semantic coherence
   * Note: This is a placeholder. A full implementation would use
   * embeddings and topic detection algorithms.
   */
  segmentBySemantic(text, options = {}) {
    // For now, default to paragraph-based segmentation
    // A real implementation would analyze semantic coherence
    return this.segmentByParagraph(text, options);
  }

  /**
   * Merge small chunks to avoid too many tiny segments
   * @private
   */
  _mergeSmallChunks(chunks, options = {}) {
    const minChunkSize = options.minChunkSize || 100; // tokens
    const maxChunkSize = options.maxChunkSize || this.maxChunkSize;
    const mergedChunks = [];
    
    let currentChunk = '';
    let currentSize = 0;
    
    for (const chunk of chunks) {
      const chunkSize = estimateTokenCount(chunk);
      
      // If adding this chunk would exceed max size, store current and start new
      if (currentSize + chunkSize > maxChunkSize && currentChunk) {
        mergedChunks.push(currentChunk);
        currentChunk = chunk;
        currentSize = chunkSize;
      } 
      // If current chunk is too small, or this would make a good-sized chunk, combine them
      else if (currentSize < minChunkSize || currentSize + chunkSize <= maxChunkSize) {
        currentChunk = currentChunk ? `${currentChunk}\n\n${chunk}` : chunk;
        currentSize += chunkSize;
      } 
      // Otherwise, store current and start with this one
      else {
        mergedChunks.push(currentChunk);
        currentChunk = chunk;
        currentSize = chunkSize;
      }
    }
    
    // Add the last chunk if it has content
    if (currentChunk) {
      mergedChunks.push(currentChunk);
    }
    
    return mergedChunks;
  }

  /**
   * Handle chunks that exceed maximum size
   * @private
   */
  _handleOversizedChunks(chunks, options = {}) {
    const maxChunkSize = options.maxChunkSize || this.maxChunkSize;
    const processedChunks = [];
    
    for (const chunk of chunks) {
      const chunkSize = estimateTokenCount(chunk);
      
      if (chunkSize > maxChunkSize) {
        // If the chunk is too big, segment it further
        const subChunks = this.segmentByFixedSize(chunk, options);
        processedChunks.push(...subChunks);
      } else {
        processedChunks.push(chunk);
      }
    }
    
    return processedChunks;
  }
}

/**
 * Manages the content window for AI context
 */
class ContextWindow {
  constructor(options = {}) {
    this.strategy = options.strategy || 'sliding';
    this.windowSize = options.windowSize || 2000; // tokens
    this.overlapSize = options.overlapSize || 200; // tokens for sliding window overlap
    this.recencyWeight = options.recencyWeight || 0.7; // Weight for recency in adaptive window
    this.relevanceWeight = options.relevanceWeight || 0.3; // Weight for relevance in adaptive window
  }

  /**
   * Get context window based on the current strategy
   * @param {array} chunks - Array of text chunks
   * @param {number} currentPosition - Current position in the text (chunk index)
   * @param {object} options - Window options
   * @returns {array} Selected chunks for the context window
   */
  getWindow(chunks, currentPosition, options = {}) {
    const strategy = options.strategy || this.strategy;
    
    switch (strategy) {
      case 'fixed':
        return this.getFixedWindow(chunks, currentPosition, options);
      case 'sliding':
        return this.getSlidingWindow(chunks, currentPosition, options);
      case 'adaptive':
        return this.getAdaptiveWindow(chunks, currentPosition, options);
      default:
        return this.getSlidingWindow(chunks, currentPosition, options);
    }
  }

  /**
   * Get a fixed window of context centered on the current position
   * @param {array} chunks - Array of text chunks
   * @param {number} currentPosition - Current position in the text (chunk index)
   * @param {object} options - Window options
   * @returns {array} Selected chunks for the context window
   */
  getFixedWindow(chunks, currentPosition, options = {}) {
    const windowSize = options.windowSize || this.windowSize;
    // Calculate how many chunks to include based on average chunk size
    // This is a simplification; a real implementation would track token counts more precisely
    const averageChunkSize = 250; // Assume average of 250 tokens per chunk
    const chunkCount = Math.floor(windowSize / averageChunkSize);
    
    // Calculate window boundaries centered on current position
    const halfCount = Math.floor(chunkCount / 2);
    let startPos = Math.max(0, currentPosition - halfCount);
    const endPos = Math.min(chunks.length - 1, startPos + chunkCount - 1);
    
    // Adjust start position if we hit the end
    startPos = Math.max(0, endPos - chunkCount + 1);
    
    // Extract the window chunks
    return chunks.slice(startPos, endPos + 1);
  }

  /**
   * Get a sliding window of context centered on the current position
   * @param {array} chunks - Array of text chunks
   * @param {number} currentPosition - Current position in the text (chunk index)
   * @param {object} options - Window options
   * @returns {array} Selected chunks for the context window
   */
  getSlidingWindow(chunks, currentPosition, options = {}) {
    const windowSize = options.windowSize || this.windowSize;
    const overlapSize = options.overlapSize || this.overlapSize;
    
    // Calculate how many chunks to include
    const averageChunkSize = 250; // Assume average of 250 tokens per chunk
    const chunkCount = Math.floor(windowSize / averageChunkSize);
    
    // Calculate overlap in chunks
    const overlapChunks = Math.ceil(overlapSize / averageChunkSize);
    
    // Calculate window boundaries with emphasis on recent context
    // For a sliding window, we want more chunks after the current position
    const previousChunks = Math.floor(chunkCount * 0.4); // 40% before
    const followingChunks = chunkCount - previousChunks; // 60% after
    
    const startPos = Math.max(0, currentPosition - previousChunks);
    const endPos = Math.min(chunks.length - 1, currentPosition + followingChunks);
    
    // Extract the window chunks
    return chunks.slice(startPos, endPos + 1);
  }

  /**
   * Get an adaptive window of context based on relevance and recency
   * This is a placeholder. A full implementation would use semantic relevance.
   * @param {array} chunks - Array of text chunks
   * @param {number} currentPosition - Current position in the text (chunk index)
   * @param {object} options - Window options
   * @returns {array} Selected chunks for the context window
   */
  getAdaptiveWindow(chunks, currentPosition, options = {}) {
    // Currently falls back to sliding window
    // A full implementation would score chunks by relevance to current content
    return this.getSlidingWindow(chunks, currentPosition, options);
  }
}

/**
 * Manages summaries at different levels
 */
class SummaryManager {
  constructor(options = {}) {
    this.maxSummaryLevels = options.maxLevels || 3;
    this.compressionRate = options.compressionRate || 0.25;
    this.summaries = new Map(); // Cache for generated summaries
  }

  /**
   * Get or generate a summary for the given text
   * @param {string} text - Text to summarize
   * @param {string} id - Identifier for caching
   * @param {object} options - Summary options
   * @returns {string} Generated summary
   */
  getSummary(text, id, options = {}) {
    const level = options.level || 1;
    const summaryKey = `${id}_L${level}`;
    
    // Check if we have a cached summary
    if (this.summaries.has(summaryKey)) {
      return this.summaries.get(summaryKey);
    }
    
    // Generate a new summary
    // This is a placeholder. A real implementation would use GPT or another summarization method
    const summary = this._generateSummary(text, level, options);
    
    // Cache the summary
    this.summaries.set(summaryKey, summary);
    
    return summary;
  }

  /**
   * Generate hierarchical summaries for structured content
   * @param {object} structure - Nested structure (chapters, scenes, etc.)
   * @param {object} options - Summary options
   * @returns {object} Structure with summaries
   */
  getHierarchicalSummaries(structure, options = {}) {
    // Placeholder for hierarchical summary generation
    // Would recursively summarize each level of the structure
    return structure;
  }

  /**
   * Generate a progressive summary (summary of summaries)
   * @param {string} text - Full text
   * @param {number} levels - Number of levels to generate
   * @param {object} options - Summary options
   * @returns {array} Array of increasingly compressed summaries
   */
  getProgressiveSummaries(text, levels = 3, options = {}) {
    const summaries = [];
    let currentText = text;
    
    for (let i = 1; i <= levels; i++) {
      const summary = this.getSummary(currentText, options.id || 'text', { 
        ...options, 
        level: i
      });
      
      summaries.push(summary);
      currentText = summary; // Each level summarizes the previous summary
    }
    
    return summaries;
  }

  /**
   * Generate a summary for the given text
   * @private
   */
  _generateSummary(text, level, options = {}) {
    // Placeholder for actual summarization
    // In a real implementation, this would call the OpenAI API or use another summarization method
    
    // For now, just extract the first few sentences as a crude summary
    const compression = options.compressionRate || this.compressionRate;
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
    const sentenceCount = Math.max(1, Math.ceil(sentences.length * compression / level));
    
    return sentences.slice(0, sentenceCount).join(' ');
  }
}

/**
 * Enriches context with metadata
 */
class MetadataEnricher {
  constructor(options = {}) {
    this.includeCharacters = options.includeCharacters !== false;
    this.includePlotElements = options.includePlotElements !== false;
    this.includeStructure = options.includeStructure !== false;
  }

  /**
   * Format character information
   * @param {array} characters - Character data
   * @param {object} options - Formatting options
   * @returns {string} Formatted character information
   */
  formatCharacterContext(characters, options = {}) {
    if (!characters || characters.length === 0) {
      return '';
    }
    
    const relevantChars = options.limit ? characters.slice(0, options.limit) : characters;
    
    return relevantChars.map(char => {
      // Format each character's information
      const basic = `${char.name}: ${char.description || ''}`;
      const details = options.detailed ? 
        ` Goals: ${char.goals || ''} Conflicts: ${char.conflicts || ''}` : '';
      
      return basic + details;
    }).join('\n\n');
  }

  /**
   * Format plot element information
   * @param {array} plotElements - Plot element data
   * @param {object} options - Formatting options
   * @returns {string} Formatted plot information
   */
  formatPlotContext(plotElements, options = {}) {
    if (!plotElements || plotElements.length === 0) {
      return '';
    }
    
    const relevantPlots = options.limit ? plotElements.slice(0, options.limit) : plotElements;
    
    return relevantPlots.map(plot => {
      // Format each plot element's information
      return `${plot.type}: ${plot.description} (${plot.status || 'Unknown'})`;
    }).join('\n\n');
  }

  /**
   * Format narrative structure information
   * @param {object} structure - Narrative structure data
   * @param {object} options - Formatting options
   * @returns {string} Formatted structure information
   */
  formatStructureContext(structure, options = {}) {
    if (!structure) {
      return '';
    }
    
    return `Current position: Chapter ${structure.currentChapter}, Scene ${structure.currentScene}
Chapter title: "${structure.chapterTitle || 'Untitled'}"
Previous scene summary: ${structure.previousSceneSummary || 'None'}
Position in narrative: ${structure.position || 'Unknown'}`;
  }

  /**
   * Combine all metadata into context
   * @param {object} metadata - All metadata
   * @param {object} options - Formatting options
   * @returns {string} Formatted metadata context
   */
  formatFullContext(metadata, options = {}) {
    const sections = [];
    
    // Add novel information
    if (metadata.novelInfo) {
      sections.push(`## Novel Information
Title: ${metadata.novelInfo.title || 'Untitled'}
Genre: ${metadata.novelInfo.genre || 'Unknown'}
Writing Style: ${metadata.novelInfo.writingStyle || ''}
Point of View: ${metadata.novelInfo.pointOfView || ''}
Setting: ${metadata.novelInfo.setting || ''}
Current narrative focus: ${metadata.novelInfo.narrativeFocus || ''}`);
    }
    
    // Add structure information
    if (this.includeStructure && metadata.structure) {
      sections.push(`## Novel Structure Context
${this.formatStructureContext(metadata.structure, options)}`);
    }
    
    // Add character information
    if (this.includeCharacters && metadata.characters) {
      sections.push(`## Character Information
${this.formatCharacterContext(metadata.characters, options)}`);
    }
    
    // Add plot information
    if (this.includePlotElements && metadata.plotElements) {
      sections.push(`## Plot Elements
${this.formatPlotContext(metadata.plotElements, options)}`);
    }
    
    return sections.join('\n\n');
  }
}

/**
 * Selects the most relevant context elements
 */
class ContextSelector {
  constructor(options = {}) {
    this.maxContextTokens = options.maxContextTokens || 4000;
    this.recentTextWeight = options.recentTextWeight || 0.6;
    this.metadataWeight = options.metadataWeight || 0.2;
    this.summaryWeight = options.summaryWeight || 0.2;
  }

  /**
   * Select context elements to fit within token budget
   * @param {object} contextElements - Available context elements
   * @param {object} options - Selection options
   * @returns {object} Selected context elements
   */
  selectContext(contextElements, options = {}) {
    const maxTokens = options.maxTokens || this.maxContextTokens;
    const selectedContext = {};
    let tokenBudget = maxTokens;
    
    // Allocate tokens according to weights
    const recentTextBudget = Math.floor(tokenBudget * this.recentTextWeight);
    const metadataBudget = Math.floor(tokenBudget * this.metadataWeight);
    const summaryBudget = Math.floor(tokenBudget * this.summaryWeight);
    
    // Select recent text within budget
    if (contextElements.recentText) {
      selectedContext.recentText = this._fitToTokenBudget(
        contextElements.recentText, 
        recentTextBudget
      );
    }
    
    // Select metadata within budget
    if (contextElements.metadata) {
      selectedContext.metadata = this._fitToTokenBudget(
        contextElements.metadata, 
        metadataBudget
      );
    }
    
    // Select summaries within budget
    if (contextElements.summaries) {
      selectedContext.summaries = this._fitToTokenBudget(
        contextElements.summaries, 
        summaryBudget
      );
    }
    
    // Redistribute any unused budget
    const usedTokens = 
      estimateTokenCount(selectedContext.recentText || '') +
      estimateTokenCount(selectedContext.metadata || '') +
      estimateTokenCount(selectedContext.summaries || '');
    
    const remainingBudget = Math.max(0, maxTokens - usedTokens);
    
    if (remainingBudget > 100) { // Only redistribute if significant tokens remain
      // Prioritize adding more recent text
      if (contextElements.recentText && selectedContext.recentText !== contextElements.recentText) {
        selectedContext.recentText = this._extendToFitBudget(
          contextElements.recentText,
          selectedContext.recentText,
          remainingBudget
        );
      }
    }
    
    return selectedContext;
  }

  /**
   * Fit text to token budget
   * @private
   */
  _fitToTokenBudget(text, budget) {
    if (!text) return '';
    
    const tokenCount = estimateTokenCount(text);
    
    if (tokenCount <= budget) {
      return text;
    }
    
    // Simple truncation approach - in a real implementation,
    // we'd want to truncate at meaningful boundaries
    const truncationRatio = budget / tokenCount;
    const words = text.split(/\s+/);
    const truncatedLength = Math.floor(words.length * truncationRatio);
    
    return words.slice(0, truncatedLength).join(' ');
  }

  /**
   * Extend selected text to use remaining budget
   * @private
   */
  _extendToFitBudget(fullText, selectedText, additionalBudget) {
    if (fullText === selectedText) return selectedText;
    
    const selectedTokens = estimateTokenCount(selectedText);
    const targetTokens = selectedTokens + additionalBudget;
    
    return this._fitToTokenBudget(fullText, targetTokens);
  }
}

/**
 * Main class that combines all components for context handling
 */
class NovelContextManager {
  constructor(options = {}) {
    this.segmenter = new TextSegmenter(options.segmentation);
    this.window = new ContextWindow(options.window);
    this.summaryManager = new SummaryManager(options.summaries);
    this.metadataEnricher = new MetadataEnricher(options.metadata);
    this.contextSelector = new ContextSelector(options.selection);
    
    // Configuration options
    this.maxTokens = options.maxTokens || 4000;
    this.useMetadata = options.useMetadata !== false;
    this.useSummaries = options.useSummaries !== false;
  }
  
  /**
   * Get optimized context for a prompt
   * @param {string} novelContent - Full novel content
   * @param {number} currentPosition - Current position in the novel
   * @param {object} metadata - Novel metadata (characters, plot, etc.)
   * @param {object} options - Context options
   * @returns {object} Optimized context for AI prompt
   */
  getContext(novelContent, currentPosition, metadata, options = {}) {
    // 1. Segment the novel content
    const segmentOptions = {
      strategy: options.segmentStrategy || 'paragraph',
      maxChunkSize: options.maxChunkSize || 500
    };
    const chunks = this.segmenter.segmentText(novelContent, segmentOptions);
    
    // 2. Determine current position in chunks
    const chunkIndex = this._findCurrentChunkIndex(chunks, currentPosition);
    
    // 3. Get context window around current position
    const windowOptions = {
      strategy: options.windowStrategy || 'sliding',
      windowSize: options.windowSize || 2000
    };
    const contextChunks = this.window.getWindow(chunks, chunkIndex, windowOptions);
    
    // 4. Combine chunks for recent text context
    const recentText = contextChunks.join('\n\n');
    
    // 5. Generate summaries if enabled
    let summaryText = '';
    if (this.useSummaries && options.useSummaries !== false) {
      // Get summary of content not included in the recent text
      const otherChunks = this._getOtherChunks(chunks, contextChunks);
      const otherText = otherChunks.join('\n\n');
      
      // Get progressive summaries
      const summaries = this.summaryManager.getProgressiveSummaries(otherText, 2, {
        id: 'novel',
        compressionRate: options.compressionRate || 0.2
      });
      
      summaryText = `## Previous Content Summary\n${summaries[summaries.length - 1]}`;
    }
    
    // 6. Format metadata context if enabled
    let metadataText = '';
    if (this.useMetadata && options.useMetadata !== false) {
      metadataText = this.metadataEnricher.formatFullContext(metadata, {
        detailed: options.detailedMetadata || false,
        limit: options.characterLimit || 5 // Limit to most relevant characters
      });
    }
    
    // 7. Select and prioritize context to fit within token budget
    const contextElements = {
      recentText,
      summaries: summaryText,
      metadata: metadataText
    };
    
    const selectedContext = this.contextSelector.selectContext(contextElements, {
      maxTokens: options.maxTokens || this.maxTokens
    });
    
    // 8. Format the final context
    return this._formatFinalContext(selectedContext);
  }
  
  /**
   * Find the index of the chunk containing the current position
   * @private
   */
  _findCurrentChunkIndex(chunks, currentPosition) {
    // In a real implementation, this would map a character/word position
    // to the correct chunk. For now, we'll use a simplified approach.
    
    // If currentPosition is a number between 0 and 1, treat it as a percentage
    if (typeof currentPosition === 'number' && currentPosition >= 0 && currentPosition <= 1) {
      return Math.floor(chunks.length * currentPosition);
    }
    
    // If it's a large number, assume it's a character position and find the right chunk
    if (typeof currentPosition === 'number' && currentPosition > 1) {
      let charCount = 0;
      for (let i = 0; i < chunks.length; i++) {
        charCount += chunks[i].length;
        if (charCount >= currentPosition) {
          return i;
        }
      }
      return chunks.length - 1;
    }
    
    // Default to the last chunk (for continuing writing)
    return chunks.length - 1;
  }
  
  /**
   * Get chunks not included in the context window
   * @private
   */
  _getOtherChunks(allChunks, contextChunks) {
    // Create a set of context chunks for efficient checking
    const contextSet = new Set(contextChunks);
    
    // Return chunks not in the context
    return allChunks.filter(chunk => !contextSet.has(chunk));
  }
  
  /**
   * Format the final context from selected elements
   * @private
   */
  _formatFinalContext(selectedContext) {
    const parts = [];
    
    // Add recent text (most important)
    if (selectedContext.recentText) {
      parts.push(`## Recent Context\n${selectedContext.recentText}`);
    }
    
    // Add summaries (historical context)
    if (selectedContext.summaries) {
      parts.push(selectedContext.summaries);
    }
    
    // Add metadata (background information)
    if (selectedContext.metadata) {
      parts.push(selectedContext.metadata);
    }
    
    // Join all parts into the final context
    return {
      contextText: parts.join('\n\n'),
      contextComponents: {
        hasRecentText: Boolean(selectedContext.recentText),
        hasSummaries: Boolean(selectedContext.summaries),
        hasMetadata: Boolean(selectedContext.metadata)
      },
      estimatedTokens: estimateTokenCount(parts.join('\n\n'))
    };
  }
}

module.exports = {
  estimateTokenCount,
  TextSegmenter,
  ContextWindow,
  SummaryManager,
  MetadataEnricher,
  ContextSelector,
  NovelContextManager
};
