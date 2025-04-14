/**
 * OpenAI Model Evaluation Test Harness
 * 
 * This script evaluates different OpenAI models for novel writing assistance,
 * measuring quality, latency, token usage, and cost.
 * 
 * Usage: 
 * 1. Set OPENAI_API_KEY as environment variable
 * 2. Run with: node openai-model-evaluation.js
 */

require('dotenv').config();
const { OpenAI } = require('openai');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  models: [
    'gpt-4',
    'gpt-3.5-turbo',
    'gpt-3.5-turbo-instruct'
  ],
  temperature: 0.7,
  maxTokens: 1000,
  repetitionsPerPrompt: 3,
  outputDirectory: './results',
};

// API cost rates per 1000 tokens (as of 4/13/2025)
const COST_RATES = {
  'gpt-4': { input: 0.03, output: 0.06 },
  'gpt-3.5-turbo': { input: 0.0015, output: 0.002 },
  'gpt-3.5-turbo-instruct': { input: 0.0015, output: 0.002 }
};

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helper function to load prompts safely
function safeRequire(path) {
  try {
    return require(path);
  } catch (error) {
    console.warn(`Warning: Could not load ${path}. This prompt will be skipped.`);
    return null;
  }
}

// Test categories and prompts
const TEST_PROMPTS = {
  'writing_continuation': [
    {
      title: 'Fantasy Scene Continuation',
      content: safeRequire('./prompts/writing-continuation-fantasy.json')
    },
    {
      title: 'Mystery Dialogue Continuation',
      content: safeRequire('./prompts/writing-continuation-mystery.json')
    },
    // Add more prompts as needed
  ].filter(prompt => prompt.content !== null),
  
  'character_development': [
    {
      title: 'Fantasy Character Development',
      content: safeRequire('./prompts/character-development-fantasy.json')
    },
    // Add more prompts as needed
  ].filter(prompt => prompt.content !== null),
  
  'plot_hole_identification': [
    {
      title: 'Mystery Plot Hole Analysis',
      content: safeRequire('./prompts/plot-hole-mystery.json')
    },
    // Add more prompts as needed
  ].filter(prompt => prompt.content !== null),
  
  'dialogue_enhancement': [
    {
      title: 'Romance Dialogue Enhancement',
      content: safeRequire('./prompts/dialogue-enhancement-romance.json')
    },
    // Add more prompts as needed
  ].filter(prompt => prompt.content !== null),
  
  'scene_description': [
    {
      title: 'Sci-fi Setting Description',
      content: safeRequire('./prompts/scene-description-scifi.json')
    },
    // Add more prompts as needed
  ].filter(prompt => prompt.content !== null),
};

// Remove empty categories
Object.keys(TEST_PROMPTS).forEach(category => {
  if (TEST_PROMPTS[category].length === 0) {
    console.warn(`Warning: Category '${category}' has no valid prompts and will be skipped.`);
    delete TEST_PROMPTS[category];
  }
});

/**
 * Creates the full prompt for a writing continuation test
 */
function createContinuationPrompt(promptData) {
  return `You are an AI writing assistant for a novelist working on a ${promptData.genre} novel. Your task is to help continue the narrative based on the provided context.

## Current Context
The following is the recent part of the novel the author is working on:

---
${promptData.recentText}
---

## Background Info
Genre: ${promptData.genre}
Writing Style: ${promptData.writingStyle}
POV: ${promptData.pointOfView}
Setting: ${promptData.setting}
Current narrative focus: ${promptData.narrativeFocus}

## Important Characters
${promptData.characterInfo}

## Recent Plot Points
${promptData.recentPlotPoints}

## Writing Continuation Task
Continue the narrative from where it left off, maintaining the established style, tone, and character voices. The continuation should feel natural and seamless, as if written by the same author. Keep the same point of view and tense.

Focus on developing the current scene with attention to ${promptData.narrativeFocus}. Write approximately ${promptData.wordCount} words that would serve as a natural continuation.

Don't summarize or explain what you're doing. Just write the continuation text as it would appear in the novel.`;
}

/**
 * Creates a prompt for character development requests
 */
function createCharacterDevelopmentPrompt(promptData) {
  return `You are an AI writing assistant for a novelist working on a ${promptData.genre} novel. Your task is to provide character development suggestions based on the provided information.

## Character Information
Character Name: ${promptData.characterName}
Character Concept: ${promptData.characterConcept}
Current Description: ${promptData.currentDescription}

## World Context
${promptData.worldContext}

## Story Role
${promptData.storyRole}

## Character Goals
${promptData.characterGoals}

## Character Flaws
${promptData.characterFlaws}

## Author's Notes
${promptData.authorNotes}

## Development Request
${promptData.developmentRequest}

Please provide thoughtful, nuanced character development suggestions that would add depth and complexity to this character while remaining consistent with the established elements.`;
}

/**
 * Creates a prompt for plot hole identification and resolution
 */
function createPlotHolePrompt(promptData) {
  return `You are an AI writing assistant for a novelist working on a ${promptData.genre} novel titled "${promptData.novelTitle}". Your task is to help identify and resolve plot holes in the narrative.

## Plot Summary
${promptData.plotSummary}

## Characters
Victim: ${promptData.characters.victim}
Detective: ${promptData.characters.detective}
Suspects:
${promptData.characters.suspects.map(suspect => `- ${suspect}`).join('\n')}

## Timeline
Day Before: ${promptData.timeline.dayBefore}
Murder Night: ${promptData.timeline.murderNight}
After Murder: ${promptData.timeline.afterMurder}

## Evidence Found
${promptData.evidenceFound.map(evidence => `- ${evidence}`).join('\n')}

## Plot Hole Issue
${promptData.plotHoleIssue}

## Author Request
${promptData.authorRequest}

Please provide a detailed analysis of the plot holes and suggest logical solutions that maintain the integrity of the mystery.`;
}

/**
 * Creates a prompt for dialogue enhancement
 */
function createDialogueEnhancementPrompt(promptData) {
  return `You are an AI writing assistant for a novelist working on a ${promptData.genre} novel. Your task is to enhance dialogue to better convey character and advance the story.

## Scene Context
${promptData.sceneContext}

## Current Dialogue
${promptData.currentDialogue}

## Character Information
Character 1: ${promptData.characterInfo.character1.name}
- Age: ${promptData.characterInfo.character1.age}
- Personality: ${promptData.characterInfo.character1.personality}
- Speech Pattern: ${promptData.characterInfo.character1.speech}

Character 2: ${promptData.characterInfo.character2.name}
- Age: ${promptData.characterInfo.character2.age}
- Personality: ${promptData.characterInfo.character2.personality}
- Speech Pattern: ${promptData.characterInfo.character2.speech}

## Relationship Development
Initial Dynamic: ${promptData.relationshipDevelopment.initialDynamic}
Intended Arc: ${promptData.relationshipDevelopment.intendedArc}
Key Tensions: ${promptData.relationshipDevelopment.keyTensions}

## Tone and Style
Overall Tone: ${promptData.toneAndStyle.overallTone}
Dialogue Style: ${promptData.toneAndStyle.dialogueStyle}
Pacing: ${promptData.toneAndStyle.pacing}

## Enhancement Request
${promptData.enhancementRequest}

Please rewrite the dialogue to better reflect the characters and their relationship, while maintaining the essential information exchange. Target approximately ${promptData.targetWordCount} words.`;
}

/**
 * Creates a prompt for scene description enhancement
 */
function createSceneDescriptionPrompt(promptData) {
  return `You are an AI writing assistant for a novelist working on a ${promptData.genre} novel. Your task is to enhance a scene description to create a more immersive setting.

## Novel Context
${promptData.novelContext}

## Current Scene Description
${promptData.currentDescription}

## Writing Parameters
Point of View: ${promptData.pointOfView}
Writing Style: ${promptData.writingStyle}

## Focus Elements
Sensory Details: ${promptData.focusElements.sensoryDetails}
Worldbuilding: ${promptData.focusElements.worldbuilding}
Character Focus: ${promptData.focusElements.character}

## Tone Goals
${promptData.toneGoals}

## Technical Elements
Technology: ${promptData.technicalElements.technology}
Environment: ${promptData.technicalElements.environment}
Alien Biology: ${promptData.technicalElements.alienBiology}

## Enhancement Request
${promptData.enhancementRequest}

Please provide an enhanced version of the scene description with approximately ${promptData.targetWordCount} words.`;
}

/**
 * Creates the appropriate prompt based on category and prompt data
 */
function createPrompt(category, promptData) {
  switch(category) {
    case 'writing_continuation':
      return createContinuationPrompt(promptData);
    case 'character_development':
      return createCharacterDevelopmentPrompt(promptData);
    case 'plot_hole_identification':
      return createPlotHolePrompt(promptData);
    case 'dialogue_enhancement':
      return createDialogueEnhancementPrompt(promptData);
    case 'scene_description':
      return createSceneDescriptionPrompt(promptData);
    default:
      console.warn(`Warning: Unknown category '${category}'. Using default prompt.`);
      return createContinuationPrompt(promptData);
  }
}

/**
 * Calculates estimated cost based on token usage and model
 */
function calculateCost(model, tokenUsage) {
  if (!COST_RATES[model]) return null;
  
  return (tokenUsage.prompt * COST_RATES[model].input + 
          tokenUsage.completion * COST_RATES[model].output) / 1000;
}

/**
 * Tests a model with a specific prompt
 */
async function testModelResponse(model, prompt, temperature = CONFIG.temperature, maxTokens = CONFIG.maxTokens) {
  console.log(`Testing model: ${model} with ${prompt.substring(0, 50)}...`);
  
  const startTime = Date.now();
  
  try {
    const response = await openai.chat.completions.create({
      model: model,
      messages: [{ role: "user", content: prompt }],
      temperature: temperature,
      max_tokens: maxTokens,
    });
    
    const latency = Date.now() - startTime;
    const tokenUsage = {
      prompt: response.usage.prompt_tokens,
      completion: response.usage.completion_tokens,
      total: response.usage.total_tokens
    };
    
    return {
      success: true,
      content: response.choices[0].message.content,
      latency,
      tokenUsage,
      estimatedCost: calculateCost(model, tokenUsage)
    };
  } catch (error) {
    console.error(`Error testing model ${model}:`, error.message);
    return {
      success: false,
      error: error.message,
      latency: Date.now() - startTime
    };
  }
}

/**
 * Runs all tests for all models
 */
async function runAllTests() {
  const results = {};
  const timestamp = new Date().toISOString().replace(/:/g, '-');
  
  // Ensure output directory exists
  if (!fs.existsSync(CONFIG.outputDirectory)) {
    fs.mkdirSync(CONFIG.outputDirectory, { recursive: true });
  }
  
  for (const model of CONFIG.models) {
    results[model] = {};
    
    for (const category in TEST_PROMPTS) {
      results[model][category] = [];
      
      for (const promptTest of TEST_PROMPTS[category]) {
        console.log(`\nTesting ${model} with "${promptTest.title}" (${category})`);
        const promptData = promptTest.content;
        const fullPrompt = createPrompt(category, promptData);
        
        const testResult = {
          title: promptTest.title,
          responses: []
        };
        
        // Run multiple tests per prompt for consistency
        for (let i = 0; i < CONFIG.repetitionsPerPrompt; i++) {
          const response = await testModelResponse(model, fullPrompt);
          testResult.responses.push(response);
          
          // Brief delay between requests to avoid rate limiting
          if (i < CONFIG.repetitionsPerPrompt - 1) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
        
        results[model][category].push(testResult);
      }
    }
  }
  
  // Save results to file
  const resultsPath = path.join(CONFIG.outputDirectory, `model-evaluation-${timestamp}.json`);
  fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));
  console.log(`\nResults saved to ${resultsPath}`);
  
  // Generate summary
  generateSummary(results, timestamp);
}

/**
 * Generates a summary of test results
 */
function generateSummary(results, timestamp) {
  const summary = {
    timestamp,
    modelComparison: {}
  };
  
  for (const model of CONFIG.models) {
    summary.modelComparison[model] = {
      averageLatency: 0,
      averageTokenUsage: { prompt: 0, completion: 0, total: 0 },
      averageCost: 0,
      successRate: 0,
      totalTests: 0,
      successfulTests: 0
    };
    
    let totalLatency = 0;
    let totalPromptTokens = 0;
    let totalCompletionTokens = 0;
    let totalCost = 0;
    let totalTests = 0;
    let successfulTests = 0;
    
    for (const category in results[model]) {
      for (const test of results[model][category]) {
        for (const response of test.responses) {
          totalTests++;
          
          if (response.success) {
            successfulTests++;
            totalLatency += response.latency;
            totalPromptTokens += response.tokenUsage.prompt;
            totalCompletionTokens += response.tokenUsage.completion;
            totalCost += response.estimatedCost;
          }
        }
      }
    }
    
    summary.modelComparison[model].averageLatency = totalLatency / successfulTests;
    summary.modelComparison[model].averageTokenUsage = {
      prompt: totalPromptTokens / successfulTests,
      completion: totalCompletionTokens / successfulTests,
      total: (totalPromptTokens + totalCompletionTokens) / successfulTests
    };
    summary.modelComparison[model].averageCost = totalCost / successfulTests;
    summary.modelComparison[model].successRate = (successfulTests / totalTests) * 100;
    summary.modelComparison[model].totalTests = totalTests;
    summary.modelComparison[model].successfulTests = successfulTests;
  }
  
  // Save summary to file
  const summaryPath = path.join(CONFIG.outputDirectory, `summary-${timestamp}.json`);
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
  console.log(`Summary saved to ${summaryPath}`);
  
  // Print summary to console
  console.log('\n===== MODEL COMPARISON SUMMARY =====');
  for (const model in summary.modelComparison) {
    const data = summary.modelComparison[model];
    console.log(`\n${model}:`);
    console.log(`  Success Rate: ${data.successRate.toFixed(2)}%`);
    console.log(`  Average Latency: ${data.averageLatency.toFixed(2)} ms`);
    console.log(`  Average Token Usage: ${data.averageTokenUsage.total.toFixed(2)} tokens`);
    console.log(`  Average Cost: $${data.averageCost.toFixed(5)} per request`);
  }
}

// Main execution
console.log('Starting OpenAI Model Evaluation...');
runAllTests().catch(error => {
  console.error('Error running tests:', error);
});
