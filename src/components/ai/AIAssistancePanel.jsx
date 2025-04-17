import React, { useState, useEffect } from 'react';
import AIService from '../../services/ai/AIService';

/**
 * AI Assistance Panel Component
 * 
 * This component provides AI assistance features for the novel editor,
 * including writing continuation, character development, and more.
 */
const AIAssistancePanel = ({
  editorContent,
  documentStructure,
  currentPosition,
  metadata,
  onInsertContent,
  onError,
  className,
  apiKey,
  providerPreferences
}) => {
  // Initialize state
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState('continuation');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [streamingContent, setStreamingContent] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [aiService, setAiService] = useState(null);
  const [options, setOptions] = useState({
    temperature: 0.7,
    maxTokens: 500,
    provider: null, // Let the service handle provider selection
    streaming: true
  });

  // Initialize AI service when apiKey changes
  useEffect(() => {
    if (apiKey) {
      const service = new AIService();
      service.initialize({
        openaiApiKey: apiKey,
        userPreferences: providerPreferences || {}
      });
      
      setAiService(service);
      setIsInitialized(true);
    } else {
      setIsInitialized(false);
      setAiService(null);
    }
  }, [apiKey, providerPreferences]);

  // Available AI assistance features
  const features = [
    { id: 'continuation', name: 'Continue Writing', description: 'Continue writing from where you left off' },
    { id: 'character', name: 'Character Development', description: 'Get suggestions for character development' },
    { id: 'plot', name: 'Plot Development', description: 'Get suggestions for plot development' },
    { id: 'dialogue', name: 'Dialogue Enhancement', description: 'Improve dialogue and conversations' },
    { id: 'scene', name: 'Scene Description', description: 'Enhance setting descriptions' },
    { id: 'editing', name: 'Editing Suggestions', description: 'Get suggested edits and improvements' }
  ];

  // Handle feature selection
  const handleFeatureSelect = (featureId) => {
    setSelectedFeature(featureId);
    setResult(null);
    setStreamingContent('');
    setError(null);
  };

  // Handle option change
  const handleOptionChange = (optionName, value) => {
    setOptions(prev => ({
      ...prev,
      [optionName]: value
    }));
  };

  // Stream handler for receiving tokens
  const handleTokenStream = (token) => {
    setStreamingContent(prev => prev + (token.text || ''));
  };

  // Handle execute feature
  const handleExecute = async () => {
    if (!isInitialized || !aiService) {
      setError('AI service not initialized. Please check your API key.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setResult(null);
      setStreamingContent('');
      
      // Common parameters for all features
      const commonParams = {
        content: editorContent,
        document: documentStructure,
        position: currentPosition,
        metadata,
        options: {
          ...options,
          onToken: options.streaming ? handleTokenStream : undefined
        }
      };
      
      // Execute the selected feature
      let response;
      setIsStreaming(options.streaming);
      
      switch (selectedFeature) {
        case 'continuation':
          response = await aiService.continueWriting(commonParams);
          break;
        
        case 'character':
          response = await aiService.getCharacterSuggestions({
            ...commonParams,
            characterData: metadata?.characters || {}
          });
          break;
        
        case 'plot':
          response = await aiService.getPlotSuggestions({
            ...commonParams,
            plotData: metadata?.plot || {}
          });
          break;
        
        case 'dialogue':
          response = await aiService.getDialogueSuggestions({
            ...commonParams,
            characterData: metadata?.characters || {}
          });
          break;
        
        case 'scene':
          response = await aiService.getSceneDescriptionSuggestions(commonParams);
          break;
        
        case 'editing':
          response = await aiService.getEditingSuggestions(commonParams);
          break;
        
        default:
          throw new Error(`Unknown feature: ${selectedFeature}`);
      }
      
      setResult(response);
      setIsStreaming(false);
    } catch (err) {
      console.error('AI assistance error:', err);
      setError(err.message || 'An error occurred during AI processing');
      if (onError) {
        onError(err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle insert content into editor
  const handleInsert = (content) => {
    if (onInsertContent) {
      onInsertContent(content);
    }
  };

  // Render feature selection
  const renderFeatureSelector = () => (
    <div className="feature-selector mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        AI Assistance Feature
      </label>
      <select
        value={selectedFeature}
        onChange={(e) => handleFeatureSelect(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        disabled={isLoading || isStreaming}
      >
        {features.map(feature => (
          <option key={feature.id} value={feature.id}>
            {feature.name}
          </option>
        ))}
      </select>
      <p className="mt-1 text-sm text-gray-500">
        {features.find(f => f.id === selectedFeature)?.description}
      </p>
    </div>
  );

  // Render options panel
  const renderOptions = () => (
    <div className="options-panel mb-4">
      <div className="mb-2">
        <label className="flex items-center text-sm font-medium text-gray-700">
          <span className="mr-2">Temperature:</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={options.temperature}
            onChange={(e) => handleOptionChange('temperature', parseFloat(e.target.value))}
            disabled={isLoading || isStreaming}
            className="w-32"
          />
          <span className="ml-2">{options.temperature}</span>
        </label>
      </div>
      
      <div className="mb-2">
        <label className="flex items-center text-sm font-medium text-gray-700">
          <span className="mr-2">Max Length:</span>
          <select
            value={options.maxTokens}
            onChange={(e) => handleOptionChange('maxTokens', parseInt(e.target.value))}
            disabled={isLoading || isStreaming}
            className="px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="250">Short</option>
            <option value="500">Medium</option>
            <option value="1000">Long</option>
            <option value="2000">Very Long</option>
          </select>
        </label>
      </div>
      
      <div className="mb-2">
        <label className="flex items-center text-sm font-medium text-gray-700">
          <input
            type="checkbox"
            checked={options.streaming}
            onChange={(e) => handleOptionChange('streaming', e.target.checked)}
            disabled={isLoading || isStreaming}
            className="mr-2"
          />
          <span>Stream results</span>
        </label>
      </div>
    </div>
  );

  // Render results
  const renderResults = () => {
    const resultText = options.streaming && isStreaming
      ? streamingContent
      : result?.text || result?.message?.content || '';
      
    return (
      <div className="results-panel mb-4">
        <div className="border border-gray-300 rounded-md p-3 min-h-[200px] max-h-[500px] overflow-y-auto bg-white">
          {isLoading && !streamingContent ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-pulse text-gray-500">
                Processing...
              </div>
            </div>
          ) : (
            <>
              {resultText ? (
                <div className="whitespace-pre-wrap">{resultText}</div>
              ) : (
                <div className="text-gray-400 italic">
                  Results will appear here
                </div>
              )}
            </>
          )}
        </div>
        
        {resultText && (
          <div className="mt-2 flex justify-end">
            <button
              onClick={() => handleInsert(resultText)}
              className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
              disabled={isLoading || isStreaming}
            >
              Insert into Editor
            </button>
          </div>
        )}
        
        {error && (
          <div className="mt-2 p-2 bg-red-100 border border-red-300 rounded-md text-red-800 text-sm">
            {error}
          </div>
        )}
      </div>
    );
  };

  // Render token usage info
  const renderTokenUsage = () => {
    if (!result?.context?.tokensUsed) return null;
    
    const { tokensUsed } = result.context;
    
    return (
      <div className="token-usage text-xs text-gray-500 mb-4">
        <div className="mb-1">Token Usage:</div>
        <div className="grid grid-cols-2 gap-x-2">
          <div>Content: {tokensUsed.current}</div>
          <div>Nearby: {tokensUsed.nearby}</div>
          <div>Summaries: {tokensUsed.summaries}</div>
          <div>Metadata: {tokensUsed.metadata}</div>
          <div>Similar: {tokensUsed.similar}</div>
          <div className="font-semibold">Total: {tokensUsed.total}</div>
        </div>
      </div>
    );
  };

  return (
    <div className={`ai-assistance-panel p-4 ${className || ''}`}>
      <h3 className="text-lg font-semibold mb-4">AI Assistance</h3>
      
      {!apiKey ? (
        <div className="text-center p-4 border border-gray-300 rounded-md">
          <p className="text-gray-600 mb-2">
            Please provide an OpenAI API key to use AI assistance features.
          </p>
          <p className="text-sm text-gray-500">
            The key is stored locally in your browser and is never sent to our servers.
          </p>
        </div>
      ) : (
        <>
          {renderFeatureSelector()}
          {renderOptions()}
          
          <div className="mb-4">
            <button
              onClick={handleExecute}
              disabled={isLoading || !isInitialized || isStreaming}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Processing...' : `Generate ${features.find(f => f.id === selectedFeature)?.name}`}
            </button>
          </div>
          
          {renderResults()}
          {renderTokenUsage()}
          
          <div className="text-xs text-gray-500">
            <p>
              Provider: {result?.provider || 'Not specified'}
              {result?.model && ` • Model: ${result.model}`}
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default AIAssistancePanel;
