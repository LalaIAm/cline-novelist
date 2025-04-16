/**
 * Character Development Assistance Prototype
 * 
 * This prototype demonstrates an AI-powered character development assistant
 * that leverages the context handling techniques developed for
 * writing continuation to provide deeper character insights and development suggestions.
 * 
 * Features:
 * - Uses character profile and story context for informed suggestions
 * - Incorporates semantic search for finding relevant character moments across the manuscript
 * - Implements caching for improved performance
 * - Leverages the same context handling approach proven successful for writing continuation
 */

require('dotenv').config();
const { Configuration, OpenAIApi } = require('openai');
const fs = require('fs');
const path = require('path');
const { summarizeText } = require('./summarization-utilities');
const { findSimilarSegments } = require('./semantic-similarity-search');
const { getCachedResponse, cacheResponse } = require('./caching-implementation');

// Initialize OpenAI API
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

/**
 * Character Development Assistant 
 * Provides character development suggestions based on the character profile,
 * story context, and relevant excerpts from the manuscript
 * 
 * @param {Object} characterProfile - Character details (name, background, traits, etc.)
 * @param {string} worldContext - Information about the story world
 * @param {string} developmentRequest - The specific character development question or request
 * @param {Array} manuscriptSegments - Segments of the manuscript for context
 * @param {Object} options - Configuration options
 * @returns {Promise<Object>} - Character development assistance response
 */
async function generateCharacterDevelopment(characterProfile, worldContext, developmentRequest, manuscriptSegments = [], options = {}) {
  try {
    // Start timing for performance measurement
    const startTime = Date.now();

    // Create a cache key based on inputs
    const cacheKey = JSON.stringify({
      character: characterProfile.characterName,
      request: developmentRequest,
      worldContext: worldContext.substring(0, 100) // Use part of context for reasonable key size
    });

    // Check cache for existing response
    const cachedResult = await getCachedResponse(cacheKey);
    if (cachedResult) {
      console.log('✓ Using cached character development suggestion');
      return {
        ...cachedResult,
        fromCache: true,
        processingTime: 0
      };
    }

    // If not in cache, prepare context for API call
    console.log(`Generating character development suggestions for ${characterProfile.characterName}...`);

    // Token budget calculation
    const totalBudget = options.maxTokens || 3000;
    const reservedOutputTokens = options.outputTokens || 1000;
    const contextBudget = totalBudget - reservedOutputTokens;
    let currentBudget = contextBudget;

    // Build the character profile section
    let characterContext = `CHARACTER PROFILE:\n`;
    characterContext += `Name: ${characterProfile.characterName}\n`;
    characterContext += `Concept: ${characterProfile.characterConcept}\n`;
    characterContext += `Description: ${characterProfile.currentDescription}\n`;
    characterContext += `Goals: ${characterProfile.characterGoals}\n`;
    characterContext += `Flaws: ${characterProfile.characterFlaws}\n`;
    
    if (characterProfile.storyRole) {
      characterContext += `Role in story: ${characterProfile.storyRole}\n`;
    }

    // Add world context
    let worldContextSection = `WORLD CONTEXT:\n${worldContext}\n\n`;

    // Find relevant manuscript segments using semantic search if available
    let relevantExcerpts = '';
    if (manuscriptSegments && manuscriptSegments.length > 0) {
      // Create a query focused on the character
      const query = `${characterProfile.characterName} ${characterProfile.characterConcept} ${developmentRequest}`;
      
      // Find segments most relevant to this character and development request
      const similarSegments = await findSimilarSegments(query, manuscriptSegments, 3);
      
      if (similarSegments && similarSegments.length > 0) {
        relevantExcerpts = 'RELEVANT MANUSCRIPT EXCERPTS:\n';
        similarSegments.forEach((segment, index) => {
          relevantExcerpts += `Excerpt ${index + 1}:\n${segment.text}\n\n`;
        });
      }
    }

    // Calculate tokens and adjust context to fit budget
    const characterTokens = Math.ceil(characterContext.length / 4);
    const worldTokens = Math.ceil(worldContextSection.length / 4);
    const excerptTokens = Math.ceil(relevantExcerpts.length / 4);
    const requestTokens = Math.ceil(developmentRequest.length / 4);

    currentBudget -= (requestTokens + 200); // Reserve space for the request and prompt framing

    // Prioritize content to fit within token budget
    let contextContent = '';
    
    // Always include character profile and development request
    contextContent += characterContext;
    currentBudget -= characterTokens;

    // Add world context if budget allows
    if (currentBudget >= worldTokens) {
      contextContent += worldContextSection;
      currentBudget -= worldTokens;
    } else {
      // If not enough budget, summarize world context
      const summarizedWorld = await summarizeText(worldContext, Math.floor(currentBudget/2));
      contextContent += `WORLD CONTEXT (Summarized):\n${summarizedWorld}\n\n`;
      currentBudget -= Math.ceil(summarizedWorld.length / 4) + 30; // +30 for the header
    }

    // Add relevant excerpts if budget allows
    if (currentBudget >= excerptTokens && relevantExcerpts) {
      contextContent += relevantExcerpts;
    } else if (relevantExcerpts) {
      // If excerpts won't fit, select fewer or summarize them
      const excerptBudget = Math.max(100, currentBudget);
      const summarizedExcerpts = await summarizeText(relevantExcerpts, excerptBudget);
      contextContent += `RELEVANT MANUSCRIPT EXCERPTS (Summarized):\n${summarizedExcerpts}\n\n`;
    }

    // Build the complete prompt
    const prompt = `You are an expert creative writing coach and character development specialist.
I'll provide you with information about a character, the world they exist in, and parts of the manuscript where they appear.

${contextContent}

DEVELOPMENT REQUEST:
${developmentRequest}

Please provide detailed, thoughtful character development suggestions. 
Include psychological insights, potential character arcs, and specific scenes or moments that could reveal character depth. 
Offer ideas that maintain consistency with the existing character while adding nuance and complexity.

Your response should include:
1. Character Psychology: Deeper insights into the character's mind and motivations
2. Background Development: Suggestions for backstory elements that inform their current behavior
3. Arc Development: Potential growth trajectories and transformative moments
4. Scene Suggestions: Specific scenarios that could showcase character depth
5. Relationship Dynamics: How their interactions with other characters could evolve`;

    // Call OpenAI API
    const response = await openai.createChatCompletion({
      model: options.model || "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are an expert creative writing coach and character development specialist." },
        { role: "user", content: prompt }
      ],
      max_tokens: reservedOutputTokens,
      temperature: options.temperature || 0.7,
    });

    // Process the result
    const suggestion = response.data.choices[0].message.content.trim();
    const endTime = Date.now();
    const processingTime = endTime - startTime;

    // Format token usage information
    const usage = {
      promptTokens: response.data.usage.prompt_tokens,
      completionTokens: response.data.usage.completion_tokens,
      totalTokens: response.data.usage.total_tokens
    };

    // Create final result object
    const result = {
      character: characterProfile.characterName,
      suggestion,
      processingTime,
      usage,
      fromCache: false,
      timestamp: new Date().toISOString()
    };

    // Cache the result for future use
    await cacheResponse(cacheKey, result);

    // Save result to disk for analysis
    const resultsDir = path.join(__dirname, 'results');
    if (!fs.existsSync(resultsDir)) {
      fs.mkdirSync(resultsDir);
    }
    
    const filename = `character-development-${new Date().toISOString().replace(/:/g, '-')}.json`;
    fs.writeFileSync(
      path.join(resultsDir, filename),
      JSON.stringify(result, null, 2)
    );

    return result;
  } catch (error) {
    console.error('Error generating character development suggestions:', error);
    return {
      error: true,
      message: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Demo function to run the character development assistant with sample data
 */
async function runCharacterDevelopmentDemo() {
  try {
    console.log("Running Character Development Assistant Demo");
    
    // Load sample character profile
    const characterData = require('./prompts/character-development-fantasy.json');
    
    // Sample manuscript segments (in a real implementation, these would come from the actual novel)
    const manuscriptSegments = [
      {
        text: "Kael flinched as the cup on the table began to vibrate, responding to his agitation. He closed his eyes, took three deep breaths like he'd taught himself, and focused on pushing the energy back down. The cup stilled, but not before Mira had noticed. 'It's getting stronger, isn't it?' she asked quietly.",
        position: "Chapter 2"
      },
      {
        text: "The Spellbreaker's tracking rune pulsed bright blue, and Kael felt the familiar panic rise in his chest. 'They're coming,' he muttered, already backing toward the tavern's rear exit. The barkeep gave him a knowing look but said nothing. This wasn't the first time someone had fled from imperial agents in his establishment.",
        position: "Chapter 3"
      },
      {
        text: "'My father was like you,' the old hermit said, studying Kael with eyes that seemed to see more than they should. 'Afraid of his own shadow because that shadow could level a mountain.' Kael stiffened. 'I'm not afraid,' he lied. The hermit's laugh was like stones rolling down a hillside. 'That's your first problem, boy.'",
        position: "Chapter 7"
      }
    ];
    
    // Run the character development assistant
    const result = await generateCharacterDevelopment(
      characterData,
      characterData.worldContext,
      characterData.developmentRequest,
      manuscriptSegments,
      { 
        model: "gpt-3.5-turbo",
        temperature: 0.7 
      }
    );
    
    // Display the results
    console.log("\n===== CHARACTER DEVELOPMENT SUGGESTIONS =====\n");
    console.log(`For: ${result.character}`);
    console.log(`\n${result.suggestion}`);
    console.log("\n=====\n");
    console.log(`Processing time: ${result.processingTime}ms`);
    console.log(`From cache: ${result.fromCache}`);
    console.log(`Token usage: ${JSON.stringify(result.usage)}`);
    
    return result;
  } catch (error) {
    console.error("Error running character development demo:", error);
  }
}

// Export functions for use in other modules
module.exports = {
  generateCharacterDevelopment,
  runCharacterDevelopmentDemo
};

// Run the demo if this script is executed directly
if (require.main === module) {
  runCharacterDevelopmentDemo();
}
