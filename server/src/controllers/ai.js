/**
 * AI Controller
 * 
 * This controller handles AI-related requests for Novylist,
 * including rate-limited and cost-managed interactions with OpenAI API.
 */

const openaiService = require('../services/openaiService');
const costManagementService = require('../services/costManagementService');
const User = require('../models/User');

/**
 * Get Writing Continuation
 * @route POST /api/v1/ai/writing/continuation
 * @desc Generate a continuation for the user's writing
 * @access Private
 */
exports.getWritingContinuation = async (req, res) => {
  try {
    const {
      novelId,
      chapterId,
      recentText,
      writingStyle,
      genre,
      pointOfView,
      setting,
      narrativeFocus,
      characterInfo,
      recentPlotPoints,
      wordCount
    } = req.body;

    // Validate required fields
    if (!novelId || !recentText) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_REQUEST',
          message: 'Missing required fields: novelId and recentText are required'
        }
      });
    }

    // Get user from request (set by auth middleware)
    const user = req.user;
    const subscriptionTier = user.subscription?.tier || 'free';

    // Construct a prompt for the AI
    let prompt = `Continue the following text in the same style. `;
    
    // Add writing style if provided
    if (writingStyle) {
      prompt += `The writing style is ${writingStyle}. `;
    }
    
    // Add genre if provided
    if (genre) {
      prompt += `The genre is ${genre}. `;
    }
    
    // Add point of view if provided
    if (pointOfView) {
      prompt += `Written in ${pointOfView} perspective. `;
    }
    
    // Add setting if provided
    if (setting) {
      prompt += `The setting is ${setting}. `;
    }
    
    // Add narrative focus if provided
    if (narrativeFocus) {
      prompt += `The current focus is on ${narrativeFocus}. `;
    }
    
    // Add character info if provided
    if (characterInfo) {
      prompt += `Characters involved: ${characterInfo}. `;
    }
    
    // Add recent plot points if provided
    if (recentPlotPoints) {
      prompt += `Recent plot developments: ${recentPlotPoints}. `;
    }
    
    // Add the recent text
    prompt += `\n\nRecent text:\n${recentText}\n\nContinuation:`;

    // Calculate output token limit based on word count (if provided)
    const maxTokens = wordCount ? Math.ceil(wordCount * 1.5) : 500;

    // Call OpenAI service with rate limiting and cost management
    const completionResult = await openaiService.completeText(
      user._id.toString(),
      subscriptionTier,
      'writingContinuation',
      prompt,
      {
        maxTokens,
        temperature: 0.7, // More creative
        presencePenalty: 0.6 // Discourage repetition
      }
    );

    // If there was an error, return it
    if (!completionResult.success) {
      return res.status(429).json(completionResult);
    }

    // Record usage in user document
    await User.findByIdAndUpdate(user._id, {
      $inc: {
        'usage.aiRequests.daily.count': 1,
        'usage.aiRequests.monthly.tokensUsed': completionResult.data.usage.totalTokens,
        'usage.features.writingContinuation.count': 1,
        'usage.features.writingContinuation.tokensUsed': completionResult.data.usage.totalTokens
      }
    });

    // Send response with rate limit headers
    res.set({
      'X-RateLimit-Limit': completionResult.data.rateLimit?.limit || 0,
      'X-RateLimit-Remaining': completionResult.data.rateLimit?.remaining || 0,
      'X-RateLimit-Reset': completionResult.data.rateLimit?.reset || 0
    });

    // Return successful response
    return res.status(200).json({
      success: true,
      data: {
        continuation: completionResult.data.content,
        tokenUsage: completionResult.data.usage,
        processingTime: completionResult.data.processingTime
      }
    });
  } catch (error) {
    console.error('Writing continuation error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An error occurred while generating writing continuation'
      }
    });
  }
};

/**
 * Get Character Development Suggestions
 * @route POST /api/v1/ai/character/suggestions
 * @desc Generate character development suggestions
 * @access Private
 */
exports.getCharacterSuggestions = async (req, res) => {
  try {
    const {
      novelId,
      characterId,
      characterInfo,
      suggestionType = 'personality',
      genre,
      count = 3
    } = req.body;

    // Validate required fields
    if (!novelId || !characterId || !characterInfo) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_REQUEST',
          message: 'Missing required fields: novelId, characterId, and characterInfo are required'
        }
      });
    }

    // Get user from request (set by auth middleware)
    const user = req.user;
    const subscriptionTier = user.subscription?.tier || 'free';

    // Construct a prompt for the AI
    let prompt = `Generate ${count} creative suggestions for developing this character: `;
    
    // Add character info
    if (typeof characterInfo === 'object') {
      prompt += `\nName: ${characterInfo.name || 'Unknown'}`;
      prompt += characterInfo.description ? `\nDescription: ${characterInfo.description}` : '';
      prompt += characterInfo.background ? `\nBackground: ${characterInfo.background}` : '';
      prompt += characterInfo.personality ? `\nPersonality: ${characterInfo.personality}` : '';
      prompt += characterInfo.goals ? `\nGoals: ${characterInfo.goals}` : '';
      
      // Add relationships if provided as array
      if (Array.isArray(characterInfo.relationships) && characterInfo.relationships.length > 0) {
        prompt += `\nRelationships: ${characterInfo.relationships.join(', ')}`;
      } else if (characterInfo.relationships) {
        prompt += `\nRelationships: ${characterInfo.relationships}`;
      }
      
      prompt += characterInfo.development ? `\nDevelopment so far: ${characterInfo.development}` : '';
    } else {
      // If character info is provided as a string
      prompt += characterInfo;
    }
    
    // Add genre if provided
    if (genre) {
      prompt += `\n\nThe genre is ${genre}.`;
    }
    
    // Add suggestion type
    prompt += `\n\nFocus on ${suggestionType} aspects of the character.`;
    
    // Specify response format
    prompt += `\n\nProvide responses in this format:
1. [Brief title of suggestion]
   [Detailed description]
   [Reasoning why this would enhance the character]

2. [Next suggestion...]`;

    // Call OpenAI service with rate limiting and cost management
    const completionResult = await openaiService.completeText(
      user._id.toString(),
      subscriptionTier,
      'characterDevelopment',
      prompt,
      {
        maxTokens: 800, // Longer suggestions need more tokens
        temperature: 0.8, // More creative for character ideas
        topP: 0.9
      }
    );

    // If there was an error, return it
    if (!completionResult.success) {
      return res.status(429).json(completionResult);
    }

    // Record usage in user document
    await User.findByIdAndUpdate(user._id, {
      $inc: {
        'usage.aiRequests.daily.count': 1,
        'usage.aiRequests.monthly.tokensUsed': completionResult.data.usage.totalTokens,
        'usage.features.characterDevelopment.count': 1,
        'usage.features.characterDevelopment.tokensUsed': completionResult.data.usage.totalTokens
      }
    });

    // Parse suggestions from AI response
    const suggestionText = completionResult.data.content;
    const suggestionRegex = /(\d+)\.\s+([^\n]+)\s+([^1-9]+)/g;
    const suggestions = [];
    
    let match;
    while ((match = suggestionRegex.exec(suggestionText + '\n1.'))) {
      const [_, number, title, content] = match;
      
      // Split content into description and reasoning (if available)
      const parts = content.trim().split(/Reasoning:|Why:|Because:/i);
      
      suggestions.push({
        type: suggestionType,
        title: title.trim(),
        content: parts[0].trim(),
        reasoning: parts.length > 1 ? parts[1].trim() : ''
      });
    }

    // Send response with rate limit headers
    res.set({
      'X-RateLimit-Limit': completionResult.data.rateLimit?.limit || 0,
      'X-RateLimit-Remaining': completionResult.data.rateLimit?.remaining || 0,
      'X-RateLimit-Reset': completionResult.data.rateLimit?.reset || 0
    });

    // Return successful response
    return res.status(200).json({
      success: true,
      data: {
        suggestions: suggestions.length > 0 ? suggestions : [{ 
          type: suggestionType, 
          content: completionResult.data.content.trim(),
          reasoning: '' 
        }],
        tokenUsage: completionResult.data.usage,
        processingTime: completionResult.data.processingTime
      }
    });
  } catch (error) {
    console.error('Character suggestion error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An error occurred while generating character suggestions'
      }
    });
  }
};

/**
 * Get Plot Analysis
 * @route POST /api/v1/ai/plot/analysis
 * @desc Analyze plot and provide suggestions
 * @access Private
 */
exports.getPlotAnalysis = async (req, res) => {
  try {
    const {
      novelId,
      plotElements,
      analysisType = 'holes',
      currentContent,
      genre
    } = req.body;

    // Validate required fields
    if (!novelId || !analysisType) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_REQUEST',
          message: 'Missing required fields: novelId and analysisType are required'
        }
      });
    }

    // Get user from request (set by auth middleware)
    const user = req.user;
    const subscriptionTier = user.subscription?.tier || 'free';

    // Construct a prompt for the AI
    let prompt = `Perform a ${analysisType} analysis on this plot:`;
    
    // Add genre if provided
    if (genre) {
      prompt += `\nGenre: ${genre}`;
    }
    
    // Add plot elements if provided
    if (Array.isArray(plotElements) && plotElements.length > 0) {
      prompt += `\n\nPlot elements:`;
      plotElements.forEach((element, index) => {
        prompt += `\n${index + 1}. `;
        if (typeof element === 'object') {
          prompt += element.description || element.title || JSON.stringify(element);
        } else {
          prompt += element;
        }
      });
    }
    
    // Add current content if provided
    if (currentContent) {
      prompt += `\n\nCurrent content:\n${currentContent}`;
    }
    
    // Specify request based on analysis type
    switch (analysisType) {
      case 'holes':
        prompt += `\n\nIdentify potential plot holes, inconsistencies, or logical problems in this plot. For each issue, provide:
1. A brief description of the plot hole
2. Why it's a problem
3. A suggestion for how to fix it`;
        break;
        
      case 'suggestions':
        prompt += `\n\nProvide creative suggestions to enhance this plot. For each suggestion, include:
1. The suggestion title
2. A detailed description
3. How it would improve the story`;
        break;
        
      case 'structure':
        prompt += `\n\nAnalyze the structure of this plot against standard three-act structure. Include:
1. Assessment of the current structure
2. Identification of key structural elements (inciting incident, midpoint, etc.)
3. Suggestions for structural improvements`;
        break;
        
      case 'pacing':
        prompt += `\n\nAnalyze the pacing of this plot. Include:
1. Identification of pacing issues (too fast, too slow)
2. Analysis of tension and conflict distribution
3. Suggestions for pacing improvements`;
        break;
        
      default:
        prompt += `\n\nProvide general analysis and suggestions for improving this plot.`;
    }

    // Call OpenAI service with rate limiting and cost management
    const completionResult = await openaiService.completeText(
      user._id.toString(),
      subscriptionTier,
      'plotAnalysis',
      prompt,
      {
        maxTokens: 1000, // Plot analysis needs more detail
        temperature: 0.6 // More analytical
      }
    );

    // If there was an error, return it
    if (!completionResult.success) {
      return res.status(429).json(completionResult);
    }

    // Record usage in user document
    await User.findByIdAndUpdate(user._id, {
      $inc: {
        'usage.aiRequests.daily.count': 1,
        'usage.aiRequests.monthly.tokensUsed': completionResult.data.usage.totalTokens,
        'usage.features.plotAnalysis.count': 1,
        'usage.features.plotAnalysis.tokensUsed': completionResult.data.usage.totalTokens
      }
    });

    // Parse findings and suggestions from AI response
    const analysisText = completionResult.data.content;
    const findings = [];
    const suggestions = [];
    
    // Simple heuristic parsing - this could be improved with better regex
    // or by asking the AI to structure the response in a parseable format
    const responseLines = analysisText.split('\n');
    let currentItem = null;
    let currentType = null;
    
    for (const line of responseLines) {
      // Check for numbered items that indicate findings or suggestions
      const itemMatch = line.match(/^\d+\.\s+(.*)/);
      
      if (itemMatch) {
        // Save previous item if it exists
        if (currentItem) {
          if (currentType === 'finding') {
            findings.push(currentItem);
          } else if (currentType === 'suggestion') {
            suggestions.push(currentItem);
          }
        }
        
        // Start new item
        currentItem = { title: itemMatch[1], description: '' };
        
        // Determine if this is a finding or suggestion based on keywords
        const lowerTitle = currentItem.title.toLowerCase();
        if (
          lowerTitle.includes('issue') || 
          lowerTitle.includes('hole') || 
          lowerTitle.includes('problem') || 
          lowerTitle.includes('inconsistency')
        ) {
          currentType = 'finding';
        } else {
          currentType = 'suggestion';
        }
      } else if (currentItem) {
        // Add to current item description
        currentItem.description += line.trim() ? ' ' + line.trim() : '';
      }
    }
    
    // Save the last item
    if (currentItem) {
      if (currentType === 'finding') {
        findings.push(currentItem);
      } else if (currentType === 'suggestion') {
        suggestions.push(currentItem);
      }
    }

    // Send response with rate limit headers
    res.set({
      'X-RateLimit-Limit': completionResult.data.rateLimit?.limit || 0,
      'X-RateLimit-Remaining': completionResult.data.rateLimit?.remaining || 0,
      'X-RateLimit-Reset': completionResult.data.rateLimit?.reset || 0
    });

    // If we couldn't parse structured data, return the raw analysis
    if (findings.length === 0 && suggestions.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          analysis: {
            type: analysisType,
            findings: [{ description: completionResult.data.content }],
            suggestions: []
          },
          tokenUsage: completionResult.data.usage,
          processingTime: completionResult.data.processingTime
        }
      });
    }

    // Return structured response
    return res.status(200).json({
      success: true,
      data: {
        analysis: {
          type: analysisType,
          findings,
          suggestions
        },
        tokenUsage: completionResult.data.usage,
        processingTime: completionResult.data.processingTime
      }
    });
  } catch (error) {
    console.error('Plot analysis error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An error occurred while analyzing plot'
      }
    });
  }
};

/**
 * Get Dialogue Enhancement
 * @route POST /api/v1/ai/dialogue/enhance
 * @desc Enhance or generate dialogue
 * @access Private
 */
exports.getDialogueEnhancement = async (req, res) => {
  try {
    const {
      novelId,
      characters,
      existingDialogue,
      context,
      tone,
      goal
    } = req.body;

    // Validate required fields
    if (!novelId || !characters) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_REQUEST',
          message: 'Missing required fields: novelId and characters are required'
        }
      });
    }

    // Get user from request (set by auth middleware)
    const user = req.user;
    const subscriptionTier = user.subscription?.tier || 'free';

    // Construct a prompt for the AI
    let prompt = `Generate dialogue between the following characters:`;
    
    // Add characters
    if (Array.isArray(characters)) {
      characters.forEach(character => {
        if (typeof character === 'object') {
          prompt += `\n- ${character.name || 'Character'}: ${character.description || ''}`;
        } else {
          prompt += `\n- ${character}`;
        }
      });
    } else {
      prompt += `\n- ${characters}`;
    }
    
    // Add context if provided
    if (context) {
      prompt += `\n\nContext: ${context}`;
    }
    
    // Add tone if provided
    if (tone) {
      prompt += `\n\nTone: ${tone}`;
    }
    
    // Add goal if provided
    if (goal) {
      prompt += `\n\nGoal of the conversation: ${goal}`;
    }
    
    // Add existing dialogue if provided
    if (existingDialogue) {
      prompt += `\n\nExisting dialogue to enhance or continue:\n${existingDialogue}`;
    }
    
    // Add formatting instructions
    prompt += `\n\nFormat the dialogue with character names followed by their lines. Make the dialogue natural, engaging, and reflective of each character's personality.`;
    
    // Add additional options for premium tiers
    if (subscriptionTier === 'premium') {
      prompt += `\n\nAlso provide 2 alternative versions of the dialogue with different approaches.`;
    }

    // Call OpenAI service with rate limiting and cost management
    const completionResult = await openaiService.completeText(
      user._id.toString(),
      subscriptionTier,
      'dialogueEnhancement',
      prompt,
      {
        maxTokens: 1000, // Dialogue needs space
        temperature: 0.8, // More creative for dialogue
        presencePenalty: 0.6 // Reduce repetition
      }
    );

    // If there was an error, return it
    if (!completionResult.success) {
      return res.status(429).json(completionResult);
    }

    // Record usage in user document
    await User.findByIdAndUpdate(user._id, {
      $inc: {
        'usage.aiRequests.daily.count': 1,
        'usage.aiRequests.monthly.tokensUsed': completionResult.data.usage.totalTokens,
        'usage.features.dialogueEnhancement.count': 1,
        'usage.features.dialogueEnhancement.tokensUsed': completionResult.data.usage.totalTokens
      }
    });

    // Parse dialogue and alternatives
    const fullResponse = completionResult.data.content;
    let enhancedDialogue = fullResponse;
    const alternativeVersions = [];
    
    // Check for alternative versions (for premium tier)
    if (subscriptionTier === 'premium') {
      // Look for section dividers like "Alternative 1:" or "Version 2:"
      const versionMatches = fullResponse.match(/(?:Alternative|Version|Variation)(?:\s+)(\d+)\s*:/gi);
      
      if (versionMatches && versionMatches.length > 0) {
        // Split the response by version markers
        const versions = fullResponse.split(/(?:Alternative|Version|Variation)(?:\s+)(?:\d+)\s*:/i);
        
        // The first part is the main dialogue
        enhancedDialogue = versions[0].trim();
        
        // The rest are alternative versions
        for (let i = 1; i < versions.length; i++) {
          if (versions[i].trim()) {
            alternativeVersions.push(versions[i].trim());
          }
        }
      }
    }

    // Send response with rate limit headers
    res.set({
      'X-RateLimit-Limit': completionResult.data.rateLimit?.limit || 0,
      'X-RateLimit-Remaining': completionResult.data.rateLimit?.remaining || 0,
      'X-RateLimit-Reset': completionResult.data.rateLimit?.reset || 0
    });

    // Return successful response
    return res.status(200).json({
      success: true,
      data: {
        enhancedDialogue,
        alternativeVersions,
        tokenUsage: completionResult.data.usage,
        processingTime: completionResult.data.processingTime
      }
    });
  } catch (error) {
    console.error('Dialogue enhancement error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An error occurred while enhancing dialogue'
      }
    });
  }
};

/**
 * Get User AI Settings
 * @route GET /api/v1/ai/settings
 * @desc Get AI settings for the user
 * @access Private
 */
exports.getAISettings = async (req, res) => {
  try {
    // Get user from request (set by auth middleware)
    const user = req.user;
    
    // Get AI settings from user document
    const aiAssistanceLevel = user.profile?.preferences?.aiAssistanceLevel || 'moderate';
    const genres = user.profile?.preferences?.genre || [];
    const writingStyle = user.profile?.preferences?.writingStyle || '';
    
    // Return settings
    return res.status(200).json({
      success: true,
      data: {
        aiAssistanceLevel,
        preferredModel: user.subscription?.tier === 'premium' ? 'gpt-4' : 'gpt-3.5-turbo',
        genres,
        writingStyle,
        nudgingFrequency: aiAssistanceLevel === 'minimal' ? 'low' : 
                          aiAssistanceLevel === 'moderate' ? 'medium' : 'high',
        customPrompts: [] // Placeholder for future feature
      }
    });
  } catch (error) {
    console.error('AI settings error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An error occurred while retrieving AI settings'
      }
    });
  }
};

/**
 * Update User AI Settings
 * @route PUT /api/v1/ai/settings
 * @desc Update AI settings for the user
 * @access Private
 */
exports.updateAISettings = async (req, res) => {
  try {
    const {
      aiAssistanceLevel,
      genres,
      writingStyle,
      nudgingFrequency
    } = req.body;

    // Get user from request (set by auth middleware)
    const user = req.user;
    
    // Validate aiAssistanceLevel
    if (aiAssistanceLevel && !['minimal', 'moderate', 'extensive'].includes(aiAssistanceLevel)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_REQUEST',
          message: 'Invalid aiAssistanceLevel. Must be one of: minimal, moderate, extensive'
        }
      });
    }
    
    // Build update object
    const updateFields = {};
    
    if (aiAssistanceLevel) {
      updateFields['profile.preferences.aiAssistanceLevel'] = aiAssistanceLevel;
    }
    
    if (genres) {
      updateFields['profile.preferences.genre'] = Array.isArray(genres) ? genres : [genres];
    }
    
    if (writingStyle) {
      updateFields['profile.preferences.writingStyle'] = writingStyle;
    }
    
    // Update user document
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $set: updateFields },
      { new: true }
    );
    
    // Return updated settings
    return res.status(200).json({
      success: true,
      data: {
        updated: true,
        settings: {
          aiAssistanceLevel: updatedUser.profile?.preferences?.aiAssistanceLevel || 'moderate',
          preferredModel: updatedUser.subscription?.tier === 'premium' ? 'gpt-4' : 'gpt-3.5-turbo',
          genres: updatedUser.profile?.preferences?.genre || [],
          writingStyle: updatedUser.profile?.preferences?.writingStyle || '',
          nudgingFrequency: nudgingFrequency || 
                            (updatedUser.profile?.preferences?.aiAssistanceLevel === 'minimal' ? 'low' : 
                             updatedUser.profile?.preferences?.aiAssistanceLevel === 'moderate' ? 'medium' : 'high'),
          customPrompts: [] // Placeholder for future feature
        }
      }
    });
  } catch (error) {
    console.error('AI settings update error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An error occurred while updating AI settings'
      }
    });
  }
};

/**
 * Get User's AI Usage
 * @route GET /api/v1/ai/usage
 * @desc Get user's AI usage statistics
 * @access Private
 */
exports.getAIUsage = async (req, res) => {
  try {
    // Get user from request (set by auth middleware)
    const user = req.user;
    const subscriptionTier = user.subscription?.tier || 'free';
    
    // Get usage statistics from OpenAI service
    const usageStats = await openaiService.getUserUsageStats(
      user._id.toString(),
      subscriptionTier
    );
    
    // If there was an error, return it
    if (!usageStats.success) {
      return res.status(500).json(usageStats);
    }
    
    // Get usage from user document
    const userUsage = user.usage || {
      aiRequests: {
        daily: { count: 0 },
        monthly: { tokensUsed: 0 }
      },
      features: {
        writingContinuation: { count: 0, tokensUsed: 0 },
        characterDevelopment: { count: 0, tokensUsed: 0 },
        plotAnalysis: { count: 0, tokensUsed: 0 },
        dialogueEnhancement: { count: 0, tokensUsed: 0 }
      }
    };
    
    // Enhance response with data from user document
    usageStats.data.userDocument = {
      dailyRequestCount: userUsage.aiRequests.daily.count,
      monthlyTokensUsed: userUsage.aiRequests.monthly.tokensUsed,
      featureCounts: {
        writingContinuation: userUsage.features.writingContinuation.count,
        characterDevelopment: userUsage.features.characterDevelopment.count,
        plotAnalysis: userUsage.features.plotAnalysis.count,
        dialogueEnhancement: userUsage.features.dialogueEnhancement.count
      }
    };
    
    // Send response with rate limit headers
    res.set({
      'X-RateLimit-Limit': usageStats.data.rateLimit?.limit || 0,
      'X-RateLimit-Remaining': usageStats.data.rateLimit?.remaining || 0,
      'X-RateLimit-Reset': usageStats.data.rateLimit?.reset || 0
    });
    
    return res.status(200).json(usageStats);
  } catch (error) {
    console.error('AI usage stats error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An error occurred while retrieving AI usage statistics'
      }
    });
  }
};

/**
 * Estimate Request Cost
 * @route POST /api/v1/ai/estimate-cost
 * @desc Estimate the cost of an AI request
 * @access Private
 */
exports.estimateRequestCost = async (req, res) => {
  try {
    const {
      featureType,
      promptLength,
      outputLength,
      modelOverride
    } = req.body;

    // Validate required fields
    if (!featureType) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_REQUEST',
          message: 'Missing required field: featureType'
        }
      });
    }

    // Get user from request (set by auth middleware)
    const user = req.user;
    const subscriptionTier = user.subscription?.tier || 'free';
    
    // Determine model to use
    const modelName = modelOverride || 
                      costManagementService.selectModelForTier(subscriptionTier, featureType);
    
    // Determine token counts based on provided lengths or defaults
    const estimatedInputTokens = promptLength || 500;
    const estimatedOutputTokens = outputLength || 500;
    
    // Get cost estimate
    const costEstimate = costManagementService.estimateCost(
      modelName,
      estimatedInputTokens,
      estimatedOutputTokens
    );
    
    // Check if the user would exceed budget with this request
    const budgetStatus = await costManagementService.checkBudgetLimits(
      user._id.toString(),
      subscriptionTier,
      costEstimate.totalCost
    );
    
    // Return estimate and budget status
    return res.status(200).json({
      success: true,
      data: {
        estimate: costEstimate,
        budget: {
          wouldExceedLimit: budgetStatus.hasExceededLimit,
          dailyUsage: budgetStatus.dailyUsage,
          monthlyUsage: budgetStatus.monthlyUsage,
          dailyRemaining: budgetStatus.dailyRemaining,
          monthlyRemaining: budgetStatus.monthlyRemaining
        },
        modelSelected: modelName,
        tierName: subscriptionTier
      }
    });
  } catch (error) {
    console.error('Cost estimation error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An error occurred while estimating request cost'
      }
    });
  }
};
