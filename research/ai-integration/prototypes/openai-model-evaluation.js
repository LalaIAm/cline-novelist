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

// Test categories and prompts
const TEST_PROMPTS = {
  'writing_continuation': [
    {
      title: 'Fantasy Scene Continuation',
      content: require('./prompts/writing-continuation-fantasy.json')
    },
    {
      title: 'Mystery Dialogue Continuation',
      content: require('./prompts/writing-continuation-mystery.json')
    },
    // Add more prompts as needed
  ],
  'character_development': [
    {
      title: 'Fantasy Character Development',
      content: require('./prompts/character-development-fantasy.json')
    },
    // Add more prompts as needed
  ],
  'plot_hole_identification': [
    {
      title: 'Mystery Plot Hole Analysis',
      content: require('./prompts/plot-hole-mystery.json')
    },
    // Add more prompts as needed
  ],
  'dialogue_enhancement': [
    {
      title: 'Romance Dialogue Enhancement',
      content: require('./prompts/dialogue-enhancement-romance.json')
    },
    // Add more prompts as needed
  ],
  'scene_description': [
    {
      title: 'Sci-fi Setting Description',
      content: require('./prompts/scene-description-scifi.json')
    },
    // Add more prompts as needed
  ],
};

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
 * Creates the appropriate prompt based on category and prompt data
 */
function createPrompt(category, promptData) {
  switch(category) {
    case 'writing_continuation':
      return createContinuationPrompt(promptData);
    // Add other categories as needed
    default:
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
