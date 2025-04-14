/**
 * Writing Continuation Feature Prototype
 * 
 * This prototype demonstrates how the AI writing continuation feature
 * would work within Novylist. It uses the context handling strategies
 * and OpenAI integration to provide seamless writing assistance.
 */

require('dotenv').config();
const { OpenAI } = require('openai');
const fs = require('fs');
const path = require('path');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Configuration
const CONFIG = {
  model: 'gpt-4', // Use the best model for writing quality (adjust based on evaluation results)
  temperature: 0.7, // Creative but consistent
  maxTokens: 1000, // Reasonable length for continuation
  maxContextTokens: 4000, // Maximum tokens to send as context
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
 * Gets a continuation suggestion for the provided text
 */
async function getContinuationSuggestion(recentText, wordCount = 300) {
  console.log(`Generating continuation for text starting with: "${recentText.substring(0, 50)}..."`);
  
  try {
    // Create the context-aware prompt
    const prompt = createContinuationPrompt(
      recentText, 
      NOVEL_METADATA, 
      CHARACTERS, 
      PLOT_ELEMENTS, 
      NOVEL_STRUCTURE,
      wordCount
    );
    
    // Check if prompt is within token limits
    const estimatedPromptTokens = estimateTokenCount(prompt);
    if (estimatedPromptTokens > CONFIG.maxContextTokens) {
      console.warn(`Warning: Prompt may exceed token limit (est: ${estimatedPromptTokens}). Continuing anyway.`);
    }
    
    console.log("Sending request to OpenAI...");
    const startTime = Date.now();
    
    // Call the OpenAI API
    const response = await openai.chat.completions.create({
      model: CONFIG.model,
      messages: [{ role: "user", content: prompt }],
      temperature: CONFIG.temperature,
      max_tokens: CONFIG.maxTokens,
    });
    
    const latency = Date.now() - startTime;
    console.log(`Received response in ${latency}ms`);
    
    // Extract the continuation text
    const continuation = response.choices[0].message.content;
    
    // In a real implementation, we would parse the token usage and log metrics
    console.log(`Completion tokens: ${response.usage.completion_tokens}`);
    console.log(`Total tokens: ${response.usage.total_tokens}`);
    
    return {
      continuation,
      latency,
      tokenUsage: {
        prompt: response.usage.prompt_tokens,
        completion: response.usage.completion_tokens,
        total: response.usage.total_tokens
      }
    };
  } catch (error) {
    console.error("Error generating continuation:", error.message);
    return {
      error: error.message,
      continuation: null
    };
  }
}

/**
 * Main function to demonstrate the continuation feature
 */
async function demonstrateContinuation() {
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

  console.log("=== Writing Continuation Prototype Demo ===\n");
  console.log("Original text excerpt:");
  console.log("-".repeat(50));
  console.log(recentText);
  console.log("-".repeat(50));
  console.log("\nGenerating continuation...\n");
  
  const result = await getContinuationSuggestion(recentText);
  
  if (result.continuation) {
    console.log("Generated continuation:");
    console.log("-".repeat(50));
    console.log(result.continuation);
    console.log("-".repeat(50));
    
    console.log("\nPerformance metrics:");
    console.log(`Latency: ${result.latency}ms`);
    console.log(`Token usage: ${result.tokenUsage ? result.tokenUsage.total : 'N/A'} tokens`);
    
    // In a real implementation, we would provide UI for accepting/rejecting/editing the continuation
    console.log("\nIn the actual application, the user would now be able to:");
    console.log("- Accept the continuation as written");
    console.log("- Edit the continuation before accepting");
    console.log("- Reject and request a new continuation");
    console.log("- Adjust parameters (length, creativity, focus) and try again");
  } else {
    console.log("Error generating continuation:", result.error);
  }
  
  // Save the demonstration results
  const outputDir = './results';
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const timestamp = new Date().toISOString().replace(/:/g, '-');
  const outputPath = path.join(outputDir, `continuation-demo-${timestamp}.json`);
  
  fs.writeFileSync(outputPath, JSON.stringify({
    originalText: recentText,
    result: result,
    configuration: CONFIG,
    novel: {
      metadata: NOVEL_METADATA,
      characters: CHARACTERS,
      plotElements: PLOT_ELEMENTS,
      structure: NOVEL_STRUCTURE
    }
  }, null, 2));
  
  console.log(`\nDemonstration results saved to ${outputPath}`);
}

// Execute the demonstration if this file is run directly
if (require.main === module) {
  demonstrateContinuation().catch(console.error);
}

module.exports = {
  getContinuationSuggestion,
  createContinuationPrompt
};
