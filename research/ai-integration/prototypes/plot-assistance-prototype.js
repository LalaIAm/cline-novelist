/**
 * Plot Assistance Prototype
 * 
 * This prototype demonstrates an AI-powered plot assistance tool
 * that helps authors identify and resolve plot issues, maintain narrative
 * structure, and enhance story cohesion. It leverages the same context handling
 * techniques used in the writing continuation and character development prototypes.
 * 
 * Features:
 * - Analyzes plot elements and structure for consistency and flow
 * - Identifies potential plot holes and suggests solutions
 * - Helps maintain narrative structure according to genre conventions
 * - Utilizes context enrichment for novel-length content
 * - Implements caching for improved performance
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
 * Common narrative structures by genre
 * Used to provide appropriate structural guidance
 */
const NARRATIVE_STRUCTURES = {
  mystery: {
    name: "Mystery Structure",
    elements: [
      "Introduction of crime/mystery",
      "Introduction of detective/protagonist",
      "Investigation begins",
      "Red herrings and false leads",
      "Key revelations and clues",
      "Protagonist danger/setback",
      "Final clues and realization",
      "Resolution and reveal"
    ]
  },
  fantasy: {
    name: "Hero's Journey",
    elements: [
      "Ordinary world",
      "Call to adventure",
      "Refusal of the call",
      "Meeting the mentor",
      "Crossing the threshold",
      "Tests, allies, and enemies",
      "Approach to the inmost cave",
      "The ordeal",
      "Reward",
      "The road back",
      "Resurrection",
      "Return with the elixir"
    ]
  },
  romance: {
    name: "Romance Arc",
    elements: [
      "Meet cute/introduction",
      "Attraction and chemistry",
      "Barrier or conflict emerges",
      "Relationship deepens despite conflict",
      "Dark moment/relationship crisis",
      "Growth and change",
      "Resolution of external conflicts",
      "Emotional commitment"
    ]
  },
  thriller: {
    name: "Thriller Structure",
    elements: [
      "Inciting incident/threat emerges",
      "Protagonist drawn into conflict",
      "Discovery of stakes and scope",
      "First confrontation",
      "Raising complications and threats",
      "False victory or defeat",
      "Darkest hour",
      "Final confrontation and resolution"
    ]
  },
  default: {
    name: "Three-Act Structure",
    elements: [
      "Act 1: Setup and inciting incident",
      "Plot point 1: Turning point into Act 2",
      "Act 2 First Half: Rising action and complications",
      "Midpoint: Major revelation or reversal",
      "Act 2 Second Half: Raising stakes",
      "Plot point 2: Crisis moment",
      "Act 3: Climax and resolution",
      "Denouement: New equilibrium"
    ]
  }
};

/**
 * Plot Analysis and Assistance
 * Analyzes plot elements and provides suggestions for improvement
 * 
 * @param {Object} plotData - Information about the plot (summary, elements, issues)
 * @param {string} narrativeContext - Additional context about the narrative
 * @param {Array} manuscriptSegments - Segments of the manuscript for context
 * @param {Object} options - Configuration options
 * @returns {Promise<Object>} - Plot assistance response
 */
async function generatePlotAssistance(plotData, narrativeContext = "", manuscriptSegments = [], options = {}) {
  try {
    // Start timing for performance measurement
    const startTime = Date.now();

    // Create a cache key based on inputs
    const cacheKey = JSON.stringify({
      title: plotData.novelTitle || "Untitled",
      plotSummary: plotData.plotSummary.substring(0, 100), // Use part of summary for reasonable key size
      request: plotData.authorRequest.substring(0, 100), // Use part of request for reasonable key size
    });

    // Check cache for existing response
    const cachedResult = await getCachedResponse(cacheKey);
    if (cachedResult) {
      console.log('✓ Using cached plot assistance response');
      return {
        ...cachedResult,
        fromCache: true,
        processingTime: 0
      };
    }

    // If not in cache, prepare context for API call
    console.log(`Generating plot assistance for "${plotData.novelTitle || 'Untitled'}"...`);

    // Token budget calculation
    const totalBudget = options.maxTokens || 3500;
    const reservedOutputTokens = options.outputTokens || 1200;
    const contextBudget = totalBudget - reservedOutputTokens;
    let currentBudget = contextBudget;

    // Determine narrative structure based on genre
    const genre = plotData.genre ? plotData.genre.toLowerCase() : "default";
    const narrativeStructure = NARRATIVE_STRUCTURES[genre] || NARRATIVE_STRUCTURES.default;

    // Build the plot overview section
    let plotOverview = `PLOT OVERVIEW:\n`;
    plotOverview += `Title: ${plotData.novelTitle || "Untitled"}\n`;
    plotOverview += `Genre: ${plotData.genre || "Unknown"}\n`;
    plotOverview += `Summary: ${plotData.plotSummary}\n\n`;

    // Add character information if available
    let charactersSection = "";
    if (plotData.characters) {
      charactersSection = "CHARACTERS:\n";
      
      // Handle different formats of character data
      if (typeof plotData.characters === 'object' && !Array.isArray(plotData.characters)) {
        // Handle object format with character roles as keys
        Object.entries(plotData.characters).forEach(([role, description]) => {
          charactersSection += `${role}: ${description}\n`;
        });
      } else if (Array.isArray(plotData.characters)) {
        // Handle array format
        plotData.characters.forEach(character => {
          if (typeof character === 'string') {
            charactersSection += `- ${character}\n`;
          } else if (typeof character === 'object') {
            const name = character.name || "Unnamed";
            const description = character.description || "";
            charactersSection += `- ${name}: ${description}\n`;
          }
        });
      }
      charactersSection += "\n";
    }

    // Add timeline information if available
    let timelineSection = "";
    if (plotData.timeline) {
      timelineSection = "TIMELINE:\n";
      
      // Handle different formats of timeline data
      if (typeof plotData.timeline === 'object' && !Array.isArray(plotData.timeline)) {
        // Handle object format with timeline points as keys
        Object.entries(plotData.timeline).forEach(([point, description]) => {
          timelineSection += `${point}: ${description}\n`;
        });
      } else if (Array.isArray(plotData.timeline)) {
        // Handle array format
        plotData.timeline.forEach((event, index) => {
          if (typeof event === 'string') {
            timelineSection += `Event ${index + 1}: ${event}\n`;
          } else if (typeof event === 'object') {
            const title = event.title || `Event ${index + 1}`;
            const description = event.description || "";
            timelineSection += `${title}: ${description}\n`;
          }
        });
      }
      timelineSection += "\n";
    }

    // Add evidence or plot elements if available
    let evidenceSection = "";
    if (plotData.evidenceFound || plotData.plotElements) {
      const elements = plotData.evidenceFound || plotData.plotElements || [];
      evidenceSection = "KEY PLOT ELEMENTS/EVIDENCE:\n";
      
      if (Array.isArray(elements)) {
        elements.forEach((item, index) => {
          evidenceSection += `${index + 1}. ${item}\n`;
        });
      } else if (typeof elements === 'object') {
        Object.entries(elements).forEach(([key, value]) => {
          evidenceSection += `${key}: ${value}\n`;
        });
      }
      evidenceSection += "\n";
    }

    // Include the narrative structure for this genre
    let structureSection = `NARRATIVE STRUCTURE (${narrativeStructure.name}):\n`;
    narrativeStructure.elements.forEach((element, index) => {
      structureSection += `${index + 1}. ${element}\n`;
    });
    structureSection += "\n";

    // Add the author's specific issue or request
    let issueSection = "";
    if (plotData.plotHoleIssue || plotData.authorRequest) {
      issueSection = "AUTHOR'S CONCERN:\n";
      if (plotData.plotHoleIssue) {
        issueSection += `${plotData.plotHoleIssue}\n\n`;
      }
      issueSection += `Request: ${plotData.authorRequest}\n\n`;
    }

    // Find relevant manuscript segments using semantic search if available
    let relevantExcerpts = '';
    if (manuscriptSegments && manuscriptSegments.length > 0) {
      // Create a query focused on the plot issue
      const query = plotData.authorRequest || plotData.plotHoleIssue || plotData.plotSummary;
      
      // Find segments most relevant to this plot issue
      const similarSegments = await findSimilarSegments(query, manuscriptSegments, 3);
      
      if (similarSegments && similarSegments.length > 0) {
        relevantExcerpts = 'RELEVANT MANUSCRIPT EXCERPTS:\n';
        similarSegments.forEach((segment, index) => {
          relevantExcerpts += `Excerpt ${index + 1}:\n${segment.text}\n\n`;
        });
      }
    }

    // Calculate tokens and adjust context to fit budget
    const plotOverviewTokens = Math.ceil(plotOverview.length / 4);
    const charactersTokens = Math.ceil(charactersSection.length / 4);
    const timelineTokens = Math.ceil(timelineSection.length / 4);
    const evidenceTokens = Math.ceil(evidenceSection.length / 4);
    const structureTokens = Math.ceil(structureSection.length / 4);
    const issueTokens = Math.ceil(issueSection.length / 4);
    const excerptTokens = Math.ceil(relevantExcerpts.length / 4);
    const narrativeContextTokens = Math.ceil(narrativeContext.length / 4);

    // Reserve space for prompt framing
    currentBudget -= 300;

    // Prioritize content to fit within token budget
    let contextContent = '';
    
    // Always include plot overview and issue
    contextContent += plotOverview;
    currentBudget -= plotOverviewTokens;

    if (currentBudget >= issueTokens) {
      contextContent += issueSection;
      currentBudget -= issueTokens;
    } else {
      // Summarize issue if too long
      const summarizedIssue = await summarizeText(issueSection, Math.floor(currentBudget/3));
      contextContent += summarizedIssue + "\n\n";
      currentBudget -= Math.ceil(summarizedIssue.length / 4) + 10;
    }

    // Include narrative structure if budget allows
    if (currentBudget >= structureTokens) {
      contextContent += structureSection;
      currentBudget -= structureTokens;
    } else {
      // Shorter version of structure if needed
      contextContent += `NARRATIVE STRUCTURE: ${narrativeStructure.name}\n\n`;
      currentBudget -= 20;
    }

    // Add characters if budget allows
    if (currentBudget >= charactersTokens && charactersSection) {
      contextContent += charactersSection;
      currentBudget -= charactersTokens;
    } else if (charactersSection) {
      // Summarize characters if too long
      const summarizedCharacters = await summarizeText(charactersSection, Math.floor(currentBudget/4));
      contextContent += `CHARACTERS (Summarized):\n${summarizedCharacters}\n\n`;
      currentBudget -= Math.ceil(summarizedCharacters.length / 4) + 30;
    }

    // Add timeline if budget allows
    if (currentBudget >= timelineTokens && timelineSection) {
      contextContent += timelineSection;
      currentBudget -= timelineTokens;
    } else if (timelineSection) {
      // Summarize timeline if too long
      const summarizedTimeline = await summarizeText(timelineSection, Math.floor(currentBudget/4));
      contextContent += `TIMELINE (Summarized):\n${summarizedTimeline}\n\n`;
      currentBudget -= Math.ceil(summarizedTimeline.length / 4) + 30;
    }

    // Add evidence/elements if budget allows
    if (currentBudget >= evidenceTokens && evidenceSection) {
      contextContent += evidenceSection;
      currentBudget -= evidenceTokens;
    } else if (evidenceSection) {
      // Summarize evidence if too long
      const summarizedEvidence = await summarizeText(evidenceSection, Math.floor(currentBudget/5));
      contextContent += `KEY ELEMENTS (Summarized):\n${summarizedEvidence}\n\n`;
      currentBudget -= Math.ceil(summarizedEvidence.length / 4) + 30;
    }

    // Add additional narrative context if available and budget allows
    if (currentBudget >= narrativeContextTokens && narrativeContext) {
      contextContent += `ADDITIONAL CONTEXT:\n${narrativeContext}\n\n`;
      currentBudget -= narrativeContextTokens;
    } else if (narrativeContext) {
      // Summarize narrative context if too long
      const summarizedContext = await summarizeText(narrativeContext, Math.floor(currentBudget/5));
      contextContent += `ADDITIONAL CONTEXT (Summarized):\n${summarizedContext}\n\n`;
      currentBudget -= Math.ceil(summarizedContext.length / 4) + 40;
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
    const prompt = `You are an expert narrative consultant and plot doctor with deep knowledge of story structure, particularly in the ${genre} genre.

${contextContent}

Please provide a comprehensive analysis of the plot issues and offer specific solutions. Address the author's concerns directly while maintaining the integrity of the story's vision.

Your response should include:
1. Plot Analysis: An assessment of the current plot structure and identification of issues
2. Structural Recommendations: Suggestions for improving narrative flow and addressing structural weaknesses
3. Plot Solutions: Specific solutions to the author's stated concerns
4. Scene Suggestions: Ideas for new or modified scenes that could strengthen the narrative
5. Consistency Check: Identification of any timeline inconsistencies, character motivation issues, or logic problems
6. Next Steps: Prioritized action items for the author to implement

Be specific and use examples from the manuscript where possible. Focus on maintaining the author's voice and vision while enhancing the narrative structure.`;

    // Call OpenAI API
    const response = await openai.createChatCompletion({
      model: options.model || "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are an expert narrative consultant and plot doctor with deep knowledge of story structure." },
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
      title: plotData.novelTitle || "Untitled",
      plotAnalysis: suggestion,
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
    
    const filename = `plot-assistance-${new Date().toISOString().replace(/:/g, '-')}.json`;
    fs.writeFileSync(
      path.join(resultsDir, filename),
      JSON.stringify(result, null, 2)
    );

    return result;
  } catch (error) {
    console.error('Error generating plot assistance:', error);
    return {
      error: true,
      message: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Demo function to run the plot assistance with sample data
 */
async function runPlotAssistanceDemo() {
  try {
    console.log("Running Plot Assistance Demo");
    
    // Load sample plot data
    const plotData = require('./prompts/plot-hole-mystery.json');
    
    // Sample manuscript segments (in a real implementation, these would come from the actual novel)
    const manuscriptSegments = [
      {
        text: `Samantha examined the security logs again. "There's something off about this glitch," she muttered. The IT specialist shrugged. "System crashes happen all the time." But Samantha knew better—in her fifteen years as a detective, coincidences like this were rarely just coincidences, especially when they conveniently erased two hours of footage on the night of a murder.`,
        position: "Chapter 3"
      },
      {
        text: `Thomas Harrington stood at the podium, his acceptance speech for the charity award perfectly rehearsed. His phone vibrated in his pocket—a message from Marcus: "It's done." Thomas smiled slightly before continuing his speech, making a point to mention his late uncle's generosity while scanning the crowd for any sign of suspicion.`,
        position: "Chapter 5"
      },
      {
        text: `"The partial footprint matches these Italian shoes," Samantha said, pointing to the evidence photos. "Only two people in the firm own this brand and size—Thomas Harrington and Marcus Reed." Her partner frowned. "Thomas has an airtight alibi for the time of death. He was at that charity gala with hundreds of witnesses." Samantha nodded slowly. "That's what's bothering me. It's too perfect."`,
        position: "Chapter 7"
      }
    ];
    
    // Run the plot assistance
    const result = await generatePlotAssistance(
      plotData,
      "This is the third book in a series following Detective Samantha Chen. Known for her methodical approach, she has never failed to close a case. The murder victim, James Harrington, was a controversial figure in the legal community, known for getting guilty clients acquitted through questionable but legal tactics.", 
      manuscriptSegments,
      { 
        model: "gpt-3.5-turbo",
        temperature: 0.7 
      }
    );
    
    // Display the results
    console.log("\n===== PLOT ANALYSIS AND ASSISTANCE =====\n");
    console.log(`For: ${result.title}`);
    console.log(`\n${result.plotAnalysis}`);
    console.log("\n=====\n");
    console.log(`Processing time: ${result.processingTime}ms`);
    console.log(`From cache: ${result.fromCache}`);
    console.log(`Token usage: ${JSON.stringify(result.usage)}`);
    
    return result;
  } catch (error) {
    console.error("Error running plot assistance demo:", error);
  }
}

// Export functions for use in other modules
module.exports = {
  generatePlotAssistance,
  runPlotAssistanceDemo,
  NARRATIVE_STRUCTURES
};

// Run the demo if this script is executed directly
if (require.main === module) {
  runPlotAssistanceDemo();
}
