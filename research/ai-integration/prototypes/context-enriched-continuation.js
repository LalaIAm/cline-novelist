/**
 * Context-Enriched Writing Continuation
 * 
 * This module enhances the writing continuation prototype with advanced
 * context handling for novel-length documents, using semantic search
 * and intelligent summarization to optimize context relevance.
 */

require('dotenv').config();
const { OpenAI } = require('openai');
const fs = require('fs');
const path = require('path');
const { AICacheManager } = require('./caching-implementation');
const { NovelContextManager } = require('./context-handling-implementation');
const { SemanticContextFinder } = require('./semantic-similarity-search');
const { SummaryManager } = require('./summarization-utilities');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialize cache manager
const cacheManager = new AICacheManager({
  persistent: true,
  logCacheEvents: true,
  exactMatchTTL: 7 * 24 * 60 * 60 * 1000, // 7 days
  contextAwareTTL: 24 * 60 * 60 * 1000    // 24 hours
});

// Initialize the semantic context finder
const semanticContextFinder = new SemanticContextFinder({
  embedding: {
    model: 'text-embedding-ada-002',
    batchSize: 10
  },
  store: {
    storageDir: path.join(__dirname, 'cache'),
    defaultFilename: 'semantic-vectors.json'
  },
  cache: {
    storageDir: path.join(__dirname, 'cache'),
    defaultFilename: 'embedding-cache.json'
  },
  search: {
    minSimilarityScore: 0.7
  },
  topK: 5,
  autoSave: true
});

// Initialize the summary manager
const summaryManager = new SummaryManager({
  generator: {
    model: 'gpt-3.5-turbo',
    temperature: 0.3
  },
  cache: {
    storageDir: path.join(__dirname, 'cache'),
    defaultFilename: 'summary-cache.json'
  },
  maxLevels: 3,
  autoSave: true
});

// Initialize the novel context manager
const contextManager = new NovelContextManager({
  segmentation: {
    defaultStrategy: 'paragraph',
    maxChunkSize: 500
  },
  window: {
    strategy: 'sliding',
    windowSize: 2000,
    overlapSize: 200
  },
  summaries: {
    maxLevels: 3,
    compressionRate: 0.25
  },
  metadata: {
    includeCharacters: true,
    includePlotElements: true,
    includeStructure: true
  },
  selection: {
    maxContextTokens: 4000,
    recentTextWeight: 0.6,
    metadataWeight: 0.2,
    summaryWeight: 0.2
  },
  maxTokens: 4000,
  useMetadata: true,
  useSummaries: true
});

// Configuration
const CONFIG = {
  models: {
    standard: 'gpt-3.5-turbo', // Faster, more cost-effective for standard tasks
    premium: 'gpt-4'           // Higher quality for premium features
  },
  temperature: 0.7,            // Creative but consistent
  maxTokens: 1000,             // Reasonable length for continuation
  maxContextTokens: 4000,      // Maximum tokens to send as context
  useCache: true,              // Enable caching
  useSemanticSearch: true,     // Enable semantic search for relevant context
  useSummaries: true,          // Enable summarization for distant context
  fallbackToStandardModel: true, // Fall back to standard model if premium fails
};

// Novel metadata (in production, this would come from the database)
const NOVEL_METADATA = {
  title: "Echoes of Twilight",
  genre: "Fantasy",
  writingStyle: "Descriptive, character-focused, with detailed world-building",
  pointOfView: "Third-person limited, switching between main characters",
  setting: "The kingdom of Aethoria, a medieval fantasy world with elemental magic",
  narrativeFocus: "Character development and political intrigue",
};

// Character information (in production, this would come from the database)
const CHARACTERS = [
  {
    name: "Lyra Dawnseeker",
    role: "Protagonist",
    description: "A 24-year-old scholar with rare ability to manipulate time magic. Determined but socially awkward.",
    goals: "Discover the truth about her missing father and the ancient artifacts he was studying.",
    conflicts: "Struggles with the ethical implications of her growing powers."
  },
  {
    name: "Kaelen Nightshade",
    role: "Deuteragonist",
    description: "A 30-year-old former royal guard with shadow magic abilities. Honorable but haunted by past failures.",
    goals: "Protect the royal family from a prophesied threat while seeking redemption for past mistakes.",
    conflicts: "Torn between duty to the crown and growing suspicions about royal corruption."
  },
  {
    name: "Erindor the Wise",
    role: "Mentor",
    description: "An elderly archmage with vast knowledge of elemental magic. Patient and enigmatic.",
    goals: "Guide the next generation of mages while hiding dangerous secrets about magic's true nature.",
    conflicts: "Knows too much about the coming catastrophe but must reveal information carefully."
  }
];

// Plot elements (in production, this would come from the database)
const PLOT_ELEMENTS = [
  {
    type: "Main Plot",
    description: "The hunt for five elemental artifacts that can prevent a magical cataclysm.",
    status: "In progress - two artifacts recovered, three remaining"
  },
  {
    type: "Subplot",
    description: "Political intrigue within the royal court as factions vie for influence.",
    status: "Ongoing - Kaelen has discovered evidence of treason"
  },
  {
    type: "Subplot",
    description: "Lyra's search for her father leads to revelations about her own identity.",
    status: "Recent discovery - found her father's journal with coded messages"
  }
];

// Chapter structure (in production, this would come from the database)
const NOVEL_STRUCTURE = {
  currentChapter: 12,
  chapterTitle: "Shadows in the Archives",
  currentScene: 3,
  previousSceneSummary: "Lyra discovered a hidden compartment in her father's study containing an ancient text on time magic. As she began to decipher it, she sensed someone watching her.",
  position: "Middle of Chapter 12, approaching a tension point"
};

/**
 * Helper function to count tokens in a string.
 * Note: This is a simplified estimation; in production, use a proper tokenizer.
 */
function estimateTokenCount(text) {
  return Math.ceil(text.split(/\s+/).length * 1.3); // Very rough estimate
}

/**
 * Creates an enhanced context-aware prompt for writing continuation
 * that uses advanced context handling strategies
 */
async function createEnhancedContinuationPrompt(
  novelContent,
  currentPosition,
  metadata = {},
  options = {}
) {
  console.log(`Creating enhanced continuation prompt at position ${currentPosition} in novel...`);
  
  // 1. Get optimized context using the context manager
  const context = contextManager.getContext(
    novelContent,
    currentPosition,
    {
      novelInfo: metadata.novelInfo || NOVEL_METADATA,
      characters: metadata.characters || CHARACTERS,
      plotElements: metadata.plotElements || PLOT_ELEMENTS,
      structure: metadata.structure || NOVEL_STRUCTURE
    },
    {
      segmentStrategy: options.segmentStrategy || 'paragraph',
      windowStrategy: options.windowStrategy || 'sliding',
      maxTokens: options.maxContextTokens || CONFIG.maxContextTokens,
      useSummaries: options.useSummaries !== undefined ? options.useSummaries : CONFIG.useSummaries
    }
  );
  
  console.log(`Generated context with ${context.estimatedTokens} estimated tokens`);
  
  // 2. If semantic search is enabled, find relevant context from other parts of the novel
  let semanticContext = '';
  if (CONFIG.useSemanticSearch && options.useSemanticSearch !== false) {
    console.log('Finding semantically relevant passages...');
    
    // Get recent text to use as query
    const recentText = context.contextComponents.hasRecentText
      ? context.contextText.split('## Recent Context')[1].split('##')[0].trim()
      : '';
    
    // Only proceed if we have recent text to use as query
    if (recentText) {
      try {
        // Ensure the novel content is indexed for semantic search
        const chunks = contextManager.segmenter.segmentText(novelContent, { 
          strategy: 'paragraph',
          maxChunkSize: 300
        });
        
        // Prepare chunks for indexing
        const textChunks = chunks.map((chunk, index) => ({
          id: `chunk-${index}`,
          text: chunk,
          metadata: {
            index,
            estimatedPosition: index / chunks.length
          }
        }));
        
        // Index the text chunks
        await semanticContextFinder.indexTexts(textChunks, { autoSave: true });
        
        // Find relevant chunks
        const relevantChunks = await semanticContextFinder.findRelevantContext(recentText, {
          topK: 3
        });
        
        // Format semantic context if we found relevant chunks
        if (relevantChunks && relevantChunks.length > 0) {
          semanticContext = `## Semantically Relevant Context\n${relevantChunks
            .map(chunk => `(Similarity: ${(chunk.similarity * 100).toFixed(1)}%) ${chunk.text}`)
            .join('\n\n')}`;
        }
      } catch (error) {
        console.error('Error finding semantic context:', error.message);
      }
    }
  }
  
  // 3. Create the final prompt combining all context
  const prompt = `
# Novel Writing Assistant - Context-Enriched Mode

${context.contextText}

${semanticContext}

## Task-Specific Instructions
Continue the narrative from where it left off, maintaining the established style, tone, and character voices. The continuation should feel natural and seamless, as if written by the same author. Keep the same point of view and tense.

Write approximately ${options.wordCount || 300} words that would serve as a natural continuation of the scene. Focus on advancing the current situation while maintaining narrative tension.

Don't summarize or explain what you're doing. Just write the continuation text as it would appear in the novel.
`;

  return prompt;
}

/**
 * Gets a continuation suggestion with enhanced context handling
 */
async function getEnhancedContinuationSuggestion(
  novelContent,
  currentPosition,
  metadata = {},
  options = {}
) {
  const wordCount = options.wordCount || 300;
  const usePremiumModel = options.premium || false;
  const model = usePremiumModel ? CONFIG.models.premium : CONFIG.models.standard;
  const parameters = {
    temperature: options.temperature || CONFIG.temperature,
    maxTokens: options.maxTokens || CONFIG.maxTokens
  };
  
  console.log(`Generating enhanced continuation at position ${currentPosition}${usePremiumModel ? ' (premium model)' : ''}`);
  
  // Start measuring performance
  const startTime = Date.now();
  
  // Create the enhanced context-aware prompt
  const prompt = await createEnhancedContinuationPrompt(
    novelContent,
    currentPosition,
    metadata,
    {
      ...options,
      wordCount
    }
  );
  
  // Check if prompt is within token limits
  const estimatedPromptTokens = estimateTokenCount(prompt);
  if (estimatedPromptTokens > CONFIG.maxContextTokens) {
    console.warn(`Warning: Prompt may exceed token limit (est: ${estimatedPromptTokens}). Continuing anyway.`);
  }
  
  // Try to get from cache first
  if (CONFIG.useCache) {
    // Try exact match cache first
    const exactMatchResult = cacheManager.getExactMatch(prompt, parameters);
    if (exactMatchResult) {
      console.log(`Exact match cache hit! Response retrieved in ${Date.now() - startTime}ms`);
      return {
        ...exactMatchResult,
        fromCache: true,
        cacheType: 'exact-match',
        latency: Date.now() - startTime
      };
    }
    
    // Try context-aware cache
    const contextAwareResult = cacheManager.getContextAware(
      {
        novelInfo: metadata.novelInfo || NOVEL_METADATA,
        characters: metadata.characters || CHARACTERS
      },
      novelContent.substring(Math.max(0, currentPosition - 1000), currentPosition),
      parameters
    );
    
    if (contextAwareResult) {
      console.log(`Context-aware cache hit! Response retrieved in ${Date.now() - startTime}ms`);
      return {
        ...contextAwareResult,
        fromCache: true,
        cacheType: 'context-aware',
        latency: Date.now() - startTime
      };
    }
  }
  
  // Cache miss, make API call
  console.log(`Cache miss. Sending request to OpenAI with model: ${model}...`);
  
  try {
    // Call the OpenAI API
    const response = await openai.chat.completions.create({
      model: model,
      messages: [{ role: "user", content: prompt }],
      temperature: parameters.temperature,
      max_tokens: parameters.maxTokens,
    });
    
    const latency = Date.now() - startTime;
    console.log(`Received response in ${latency}ms`);
    
    // Extract the continuation text
    const continuation = response.choices[0].message.content;
    
    // Log token usage
    console.log(`Completion tokens: ${response.usage.completion_tokens}`);
    console.log(`Total tokens: ${response.usage.total_tokens}`);
    
    // Create result object
    const result = {
      continuation,
      latency,
      tokenUsage: {
        prompt: response.usage.prompt_tokens,
        completion: response.usage.completion_tokens,
        total: response.usage.total_tokens
      },
      model,
      fromCache: false
    };
    
    // Cache the result
    if (CONFIG.useCache) {
      cacheManager.setExactMatch(prompt, result, parameters);
      cacheManager.setContextAware(
        {
          novelInfo: metadata.novelInfo || NOVEL_METADATA,
          characters: metadata.characters || CHARACTERS
        },
        novelContent.substring(Math.max(0, currentPosition - 1000), currentPosition),
        result,
        parameters
      );
      
      // Persist caches to disk
      cacheManager.persistCaches();
    }
    
    return result;
  } catch (error) {
    console.error(`Error generating continuation with ${model}:`, error.message);
    
    // Try fallback to standard model if using premium failed
    if (usePremiumModel && CONFIG.fallbackToStandardModel) {
      console.log("Falling back to standard model...");
      return getEnhancedContinuationSuggestion(novelContent, currentPosition, metadata, {
        ...options,
        premium: false
      });
    }
    
    return {
      error: error.message,
      continuation: null,
      latency: Date.now() - startTime,
      model
    };
  }
}

/**
 * Preprocess a novel for optimal context handling
 * 
 * This function:
 * 1. Indexes the novel for semantic search
 * 2. Generates summaries at different levels
 * 3. Prepares the novel for efficient context retrieval
 */
async function preprocessNovel(novelContent, metadata = {}) {
  console.log('Preprocessing novel for enhanced context handling...');
  
  // 1. Segment the novel
  const segments = contextManager.segmenter.segmentText(novelContent, {
    strategy: 'paragraph'
  });
  console.log(`Novel segmented into ${segments.length} chunks`);
  
  // 2. Index for semantic search
  try {
    console.log('Indexing novel for semantic search...');
    const textChunks = segments.map((segment, index) => ({
      id: `segment-${index}`,
      text: segment,
      metadata: {
        index,
        estimatedPosition: index / segments.length
      }
    }));
    
    await semanticContextFinder.indexTexts(textChunks, { autoSave: true });
    console.log('Semantic indexing complete');
  } catch (error) {
    console.error('Error during semantic indexing:', error.message);
  }
  
  // 3. Generate chapter-level summaries
  if (metadata.chapters && Array.isArray(metadata.chapters)) {
    console.log('Generating chapter summaries...');
    
    for (let i = 0; i < metadata.chapters.length; i++) {
      const chapter = metadata.chapters[i];
      
      if (chapter.content) {
        console.log(`Summarizing chapter ${i + 1}: ${chapter.title || 'Untitled'}`);
        
        try {
          // Generate progressive summaries for the chapter
          const summaries = await summaryManager.generateProgressiveSummaries(
            chapter.content,
            3,
            {
              preserveStyle: true,
              focusOnPlot: true,
              focusOnCharacters: true
            }
          );
          
          // Store summaries on the chapter object
          chapter.summaries = summaries;
          console.log(`Generated ${summaries.length} levels of summaries for chapter ${i + 1}`);
        } catch (error) {
          console.error(`Error summarizing chapter ${i + 1}:`, error.message);
        }
      }
    }
  } else {
    console.log('No chapter structure provided, generating whole-novel summary');
    
    try {
      // Generate progressive summaries for the entire novel
      const summaries = await summaryManager.generateProgressiveSummaries(
        novelContent,
        3,
        {
          preserveStyle: false,
          focusOnPlot: true,
          focusOnCharacters: true
        }
      );
      
      // Return the summaries
      return {
        segments,
        indexSize: semanticContextFinder.getStats().vectorStore.size,
        summaries
      };
    } catch (error) {
      console.error('Error generating novel summaries:', error.message);
    }
  }
  
  // 4. Return preprocessing results
  return {
    segments,
    indexSize: semanticContextFinder.getStats().vectorStore.size,
    summaryCache: summaryManager.getStats()
  };
}

/**
 * Main function to demonstrate the enhanced continuation feature
 */
async function demonstrateEnhancedContinuation() {
  // Sample novel excerpt with multiple chapters
  const novelExcerpt = `
Chapter 1: The Echo of Time

The tower of Aethoria's Royal Academy cast long shadows as the afternoon sun began its descent. Lyra Dawnseeker hunched over ancient texts in the academy's vast library, her fingers tracing the faded symbols of a forgotten language. For three years she had searched for any mention of her father's research, and today, finally, she'd found something.

"Time is not a river but a sea," she translated, her voice barely above a whisper. "Its currents flow in patterns unseen to mortal eyes."

The text matched a phrase in her father's journal—the last entry before his disappearance. Lyra's heart raced. This was it, the first real connection to what he had been studying.

She carefully copied the symbols onto a piece of parchment, acutely aware of the library's closing bell that would soon ring. As she worked, a prickling sensation crept up her spine—the feeling of being watched. She glanced over her shoulder, scanning the towering bookshelves and shadowed corners, but saw nothing.

Returning to her work, Lyra couldn't shake her unease. The academy had eyes everywhere, especially for someone like her—a scholarship student from the Lower Quarter with an unusual affinity for time magic.

The ancient text continued: "Those who can perceive these currents may learn to navigate them. Those who can navigate them may learn to alter their course."

Lyra's hand trembled slightly. Was this what her father had discovered? A way to manipulate time itself? The implications were staggering and dangerous. Time magic was strictly regulated by the Royal Mage Council, and experimentation was forbidden after the Temporal Calamity a century ago.

A soft footstep from behind made her freeze. Lyra carefully slid her father's journal beneath the ancient text before turning.

"Researching something interesting, Scholar Dawnseeker?" The smooth voice belonged to Magister Kaelen Nightshade, former captain of the Royal Guard and now the academy's combat magic instructor. His tall figure emerged from the shadows, dark eyes evaluating her with unsettling intensity.

"Just translating practice, Magister," Lyra replied, keeping her voice steady despite her racing heart. Kaelen had always treated her fairly, unlike some of the other instructors who resented her common birth, but his connection to the Royal Court made him dangerous to her secret research.

"Ancient Aethorian is an unusual choice for practice," he remarked, glancing at the text before her. "Most scholars prefer Classical Vernish."

Lyra maintained a neutral expression. "I find the symbolic resonances of Ancient Aethorian more aligned with temporal theory."

Kaelen's eyebrow raised slightly. "Indeed." His gaze lingered on her work. "The Council has been discussing your progress. Your talent for time magic is... remarkable."

The word hung in the air between them—both compliment and warning. Remarkable talents attracted remarkable attention in Aethoria, not all of it welcome.

"Thank you, Magister," she said carefully.

"Be cautious with your research, Lyra," he said, his voice lowered. "There are political currents at play that even I cannot fully navigate. The royal court has taken a special interest in temporal magic lately."

Before she could respond, the library bell rang, signaling closing time. Kaelen nodded once and turned to leave, his dark cloak sweeping behind him.

Lyra waited until he was gone before exhaling. She quickly gathered her materials, heart pounding. The Magister's warning was clear enough, though his intentions remained murky. Was he trying to help her or warn her away from dangerous knowledge?

As she slipped the ancient text back onto its shelf, a small piece of paper fluttered to the floor—a note that hadn't been there before. In elegant handwriting it read: "Your father found the first artifact. The Crown now seeks the others. Trust no one within these walls."
`;

  console.log("=== Context-Enriched Writing Continuation Demo ===\n");
  console.log("Original text excerpt:");
  console.log("-".repeat(50));
  console.log(novelExcerpt.substring(0, 500) + "...");
  console.log("-".repeat(50));
  
  // Preprocess the novel
  console.log("\nPreprocessing novel for context handling...");
  const preprocessingResults = await preprocessNovel(novelExcerpt);
  console.log(`Novel preprocessing complete: ${preprocessingResults.segments.length} segments, ${preprocessingResults.indexSize} indexed chunks`);
  
  // Demo different continuation strategies
  
  // 1. Get a standard continuation (with enhanced context handling)
  console.log("\n\n1. Standard continuation with context handling:");
  const standardResult = await getEnhancedContinuationSuggestion(
    novelExcerpt,
    novelExcerpt.length,
    {},
    { premium: false }
  );
  
  console.log("\nGenerated continuation:");
  console.log("-".repeat(50));
  console.log(standardResult.continuation);
  console.log("-".repeat(50));
  
  console.log("\nPerformance metrics:");
  console.log(`Latency: ${standardResult.latency}ms`);
  console.log(`From cache: ${standardResult.fromCache ? 'Yes' : 'No'}`);
  console.log(`Model used: ${standardResult.model}`);
  if (standardResult.tokenUsage) {
    console.log(`Token usage: ${standardResult.tokenUsage.total} total tokens`);
    console.log(`- Prompt tokens: ${standardResult.tokenUsage.prompt}`);
    console.log(`- Completion tokens: ${standardResult.tokenUsage.completion}`);
  }
  
  // 2. Get a premium continuation (with enhanced context handling)
  console.log("\n\n2. Premium continuation with context handling:");
  const premiumResult = await getEnhancedContinuationSuggestion(
    novelExcerpt,
    novelExcerpt.length,
    {},
    { premium: true }
  );
  
  console.log("\nGenerated continuation:");
  console.log("-".repeat(50));
  console.log(premiumResult.continuation);
  console.log("-".repeat(50));
  
  console.log("\nPerformance metrics:");
  console.log(`Latency: ${premiumResult.latency}ms`);
  console.log(`From cache: ${premiumResult.fromCache ? 'Yes' : 'No'}`);
  console.log(`Model used: ${premiumResult.model}`);
  if (premiumResult.tokenUsage) {
    console.log(`Token usage: ${premiumResult.tokenUsage.total} total tokens`);
    console.log(`- Prompt tokens: ${premiumResult.tokenUsage.prompt}`);
    console.log(`- Completion tokens: ${premiumResult.tokenUsage.completion}`);
  }
  
  // 3. Second request (should be cached)
  console.log("\n\n3. Second standard request (expect cache hit):");
  const cachedResult = await getEnhancedContinuationSuggestion(
    novelExcerpt,
    novelExcerpt.length,
    {},
    { premium: false }
  );
  
  console.log("\nPerformance metrics:");
  console.log(`Latency: ${cachedResult.latency}ms`);
  console.log(`From cache: ${cachedResult.fromCache ? 'Yes' : 'No'}`);
  console.log(`Cache type: ${cachedResult.cacheType || 'N/A'}`);
  console.log(`Latency improvement: ${standardResult.latency > 0 ? ((standardResult.latency - cachedResult.latency) / standardResult.latency * 100).toFixed(2) + '%' : 'N/A'}`);
  
  // Save the demonstration results
  const outputDir = path.join(__dirname, 'results');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const timestamp = new Date().toISOString().replace(/:/g, '-');
  const outputPath = path.join(outputDir, `context-enriched-continuation-demo-${timestamp}.json`);
  
  fs.writeFileSync(outputPath, JSON.stringify({
    originalText: novelExcerpt,
    preprocessingResults,
    standardResult,
    premiumResult,
    cachedResult,
    configuration: CONFIG,
  }, null, 2));
  
  console.log(`\nDemonstration results saved to ${outputPath}`);
  
  // Summary of benefits
  console.log("\n=== Context Handling Benefits Summary ===");
  console.log("1. Optimized Context Selection:");
  console.log("   - Intelligently selects most relevant context within token limits");
  console.log("   - Balances recent text, metadata, and summaries");
  console.log("   - Adapts to different positions in the novel");
  
  console.log("\n2. Semantic Search Integration:");
  console.log("   - Finds thematically relevant passages from throughout the novel");
  console.log("   - Maintains narrative consistency with distant references");
  console.log("   - Provides rich context beyond linear reading");
  
  console.log("\n3. Summarization for Compression:");
  console.log("   - Creates progressive summaries of distant content");
  console.log("   - Maintains awareness of the broader narrative");
  console.log("   - Efficiently uses token budget for better context");
  
  console.log("\n4. Performance Optimization:");
  console.log("   - Caching reduces response time from seconds to milliseconds");
  console.log("   - Enhanced context quality improves continuation relevance");
  console.log("   - Tiered model approach balances quality and cost");
}

// Export the functionality
module.exports = {
  getEnhancedContinuationSuggestion,
  preprocessNovel,
  createEnhancedContinuationPrompt,
  demonstrateEnhancedContinuation
};

// Execute the demonstration if this file is run directly
if (require.main === module) {
  demonstrateEnhancedContinuation().catch(console.error);
}
