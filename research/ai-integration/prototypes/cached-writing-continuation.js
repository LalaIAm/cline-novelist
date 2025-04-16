/**
 * Cached Writing Continuation Feature Prototype
 * 
 * This prototype enhances the writing continuation feature with caching
 * for improved performance, reduced API costs, and better user experience.
 */

require('dotenv').config();
const { OpenAI } = require('openai');
const fs = require('fs');
const path = require('path');
const { AICacheManager } = require('./caching-implementation');

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
 * Creates a context-aware prompt for writing continuation
 */
function createContinuationPrompt(recentText, novelInfo, characterInfo, plotInfo, structureInfo, continuationLength = 300) {
  // Construct the character information string
  const charactersText = characterInfo
    .map(char => `${char.name}: ${char.description} ${char.goals} ${char.conflicts}`)
    .join('\n\n');
  
  // Construct the plot elements string
  const plotText = plotInfo
    .map(plot => `${plot.type}: ${plot.description} (${plot.status})`)
    .join('\n\n');

  // Create the prompt using our prompt template structure
  const prompt = `
# Novel Writing Assistant - Context-Aware Mode

## Current Writing Context
${recentText}

## Novel Structure Context
Current position: Chapter ${structureInfo.currentChapter}, Scene ${structureInfo.currentScene}
Chapter title: "${structureInfo.chapterTitle}"
Previous scene summary: ${structureInfo.previousSceneSummary}
Position in narrative: ${structureInfo.position}

## Character Information
${charactersText}

## Plot Elements
${plotText}

## Novel Information
Title: ${novelInfo.title}
Genre: ${novelInfo.genre}
Writing Style: ${novelInfo.writingStyle}
Point of View: ${novelInfo.pointOfView}
Setting: ${novelInfo.setting}
Current narrative focus: ${novelInfo.narrativeFocus}

## Task-Specific Instructions
Continue the narrative from where it left off, maintaining the established style, tone, and character voices. The continuation should feel natural and seamless, as if written by the same author. Keep the same point of view and tense.

Write approximately ${continuationLength} words that would serve as a natural continuation of the scene. Focus on advancing the current situation while maintaining narrative tension.

Don't summarize or explain what you're doing. Just write the continuation text as it would appear in the novel.
`;

  return prompt;
}

/**
 * Gets a continuation suggestion with caching
 */
async function getCachedContinuationSuggestion(recentText, metadata = {}, options = {}) {
  const wordCount = options.wordCount || 300;
  const usePremiumModel = options.premium || false;
  const model = usePremiumModel ? CONFIG.models.premium : CONFIG.models.standard;
  const parameters = {
    temperature: options.temperature || CONFIG.temperature,
    maxTokens: options.maxTokens || CONFIG.maxTokens
  };
  
  console.log(`Generating continuation for text starting with: "${recentText.substring(0, 50)}..."${usePremiumModel ? ' (premium model)' : ''}`);
  
  // Create the context-aware prompt
  const prompt = createContinuationPrompt(
    recentText, 
    metadata.novelInfo || NOVEL_METADATA, 
    metadata.characters || CHARACTERS, 
    metadata.plotElements || PLOT_ELEMENTS, 
    metadata.structure || NOVEL_STRUCTURE,
    wordCount
  );
  
  // Check if prompt is within token limits
  const estimatedPromptTokens = estimateTokenCount(prompt);
  if (estimatedPromptTokens > CONFIG.maxContextTokens) {
    console.warn(`Warning: Prompt may exceed token limit (est: ${estimatedPromptTokens}). Continuing anyway.`);
  }
  
  // Start measuring performance
  const startTime = Date.now();
  
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
      recentText,
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
        recentText,
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
      return getCachedContinuationSuggestion(recentText, metadata, {
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
 * Main function to demonstrate the continuation feature with caching
 */
async function demonstrateCachedContinuation() {
  // Sample recent text from the novel
  const recentText = `
Lyra's fingers trembled as she carefully turned the pages of the ancient text. The archives were silent save for the occasional creak of the old wooden shelves and the soft whisper of parchment against skin. Each symbol in the book seemed to shimmer slightly under her gaze, as if the magic within recognized her presence.

A chill ran down her spine. The sensation of being watched intensified, and she glanced over her shoulder toward the shadowy corners of the archive room. Nothing. Yet the feeling persisted.

"I know you're there," she said, her voice barely above a whisper. "You might as well show yourself."

The shadows in the far corner seemed to deepen, then shift. Kaelen emerged, his dark cloak making him nearly invisible until he moved.

"Your awareness is improving," he said, his voice low and grave. "But others might not announce themselves so readily."

Lyra clutched the book tighter to her chest. "What are you doing here? I thought you were meeting with the Royal Council."

"The meeting ended early." Kaelen's gaze fell to the book in her hands, his expression hardening. "What have you found?"
`;

  console.log("=== Cached Writing Continuation Prototype Demo ===\n");
  console.log("Original text excerpt:");
  console.log("-".repeat(50));
  console.log(recentText);
  console.log("-".repeat(50));
  
  // Demo sequence showing caching benefits
  
  // 1. First request - should be a cache miss
  console.log("\nFirst request (standard model, expect cache miss):");
  const firstResult = await getCachedContinuationSuggestion(recentText, {}, { premium: false });
  
  console.log("\nGenerated continuation:");
  console.log("-".repeat(50));
  console.log(firstResult.continuation);
  console.log("-".repeat(50));
  
  console.log("\nPerformance metrics:");
  console.log(`Latency: ${firstResult.latency}ms`);
  console.log(`From cache: ${firstResult.fromCache ? 'Yes' : 'No'}`);
  console.log(`Model used: ${firstResult.model}`);
  console.log(`Token usage: ${firstResult.tokenUsage ? firstResult.tokenUsage.total : 'N/A'} tokens`);
  
  // 2. Second request with same text - should be a cache hit
  console.log("\n\nSecond request (standard model, expect cache hit):");
  const secondResult = await getCachedContinuationSuggestion(recentText, {}, { premium: false });
  
  console.log("\nPerformance metrics:");
  console.log(`Latency: ${secondResult.latency}ms`);
  console.log(`From cache: ${secondResult.fromCache ? 'Yes' : 'No'}`);
  console.log(`Cache type: ${secondResult.cacheType || 'N/A'}`);
  console.log(`Latency improvement: ${firstResult.latency > 0 ? ((firstResult.latency - secondResult.latency) / firstResult.latency * 100).toFixed(2) + '%' : 'N/A'}`);

  // 3. Request with premium model - should be a cache miss
  console.log("\n\nPremium model request (expect cache miss):");
  const premiumResult = await getCachedContinuationSuggestion(recentText, {}, { premium: true });
  
  console.log("\nGenerated continuation:");
  console.log("-".repeat(50));
  console.log(premiumResult.continuation);
  console.log("-".repeat(50));
  
  console.log("\nPerformance metrics:");
  console.log(`Latency: ${premiumResult.latency}ms`);
  console.log(`From cache: ${premiumResult.fromCache ? 'Yes' : 'No'}`);
  console.log(`Model used: ${premiumResult.model}`);
  console.log(`Token usage: ${premiumResult.tokenUsage ? premiumResult.tokenUsage.total : 'N/A'} tokens`);
  
  // 4. Second premium request - should be a cache hit
  console.log("\n\nSecond premium request (expect cache hit):");
  const secondPremiumResult = await getCachedContinuationSuggestion(recentText, {}, { premium: true });
  
  console.log("\nPerformance metrics:");
  console.log(`Latency: ${secondPremiumResult.latency}ms`);
  console.log(`From cache: ${secondPremiumResult.fromCache ? 'Yes' : 'No'}`);
  console.log(`Cache type: ${secondPremiumResult.cacheType || 'N/A'}`);
  console.log(`Latency improvement: ${premiumResult.latency > 0 ? ((premiumResult.latency - secondPremiumResult.latency) / premiumResult.latency * 100).toFixed(2) + '%' : 'N/A'}`);
  
  // Display cache statistics
  console.log("\n\nCache Statistics:");
  console.log(JSON.stringify(cacheManager.getStats(), null, 2));
  
  // Save the demonstration results
  const outputDir = './results';
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const timestamp = new Date().toISOString().replace(/:/g, '-');
  const outputPath = path.join(outputDir, `cached-continuation-demo-${timestamp}.json`);
  
  fs.writeFileSync(outputPath, JSON.stringify({
    originalText: recentText,
    firstResult,
    secondResult,
    premiumResult,
    secondPremiumResult,
    cacheStats: cacheManager.getStats(),
    configuration: CONFIG,
    novel: {
      metadata: NOVEL_METADATA,
      characters: CHARACTERS,
      plotElements: PLOT_ELEMENTS,
      structure: NOVEL_STRUCTURE
    }
  }, null, 2));
  
  console.log(`\nDemonstration results saved to ${outputPath}`);
  
  // In a real implementation, we would provide UI options for accepting/rejecting the continuation
  console.log("\nIn the actual application, the user would now be able to:");
  console.log("- Accept the continuation as written");
  console.log("- Edit the continuation before accepting");
  console.log("- Reject and request a new continuation");
  console.log("- Switch between standard and premium models");
  console.log("- Adjust parameters (length, creativity, focus) and try again");
}

// Execute the demonstration if this file is run directly
if (require.main === module) {
  demonstrateCachedContinuation().catch(console.error);
}

module.exports = {
  getCachedContinuationSuggestion,
  createContinuationPrompt
};
