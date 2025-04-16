/**
 * AI Routes
 * 
 * This module defines the API routes for AI-assisted features,
 * with rate limiting and token-based access controls.
 */

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getWritingContinuation,
  getCharacterSuggestions,
  getPlotAnalysis,
  getDialogueEnhancement,
  getAISettings,
  updateAISettings,
  getAIUsage,
  estimateRequestCost
} = require('../controllers/ai');

// All AI routes are protected and require authentication
router.use(protect);

// Writing Continuation
router.post('/writing/continuation', getWritingContinuation);

// Character Development Suggestions
router.post('/character/suggestions', getCharacterSuggestions);

// Plot Analysis
router.post('/plot/analysis', getPlotAnalysis);

// Dialogue Enhancement
router.post('/dialogue/enhance', getDialogueEnhancement);

// AI Settings
router.get('/settings', getAISettings);
router.put('/settings', updateAISettings);

// Usage Statistics & Costs
router.get('/usage', getAIUsage);
router.post('/estimate-cost', estimateRequestCost);

module.exports = router;
