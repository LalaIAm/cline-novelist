import React, { useState, useRef } from 'react';
import { ResponsiveContainer, ResponsiveNavigation, ResponsiveVisualization } from '../responsive';
import QuillEditor from '../../editors/QuillEditor';

/**
 * ResponsiveWritingWorkspaceWireframe demonstrates a responsive writing interface
 * with AI assistance, navigation, and tools that adapt to different screen sizes.
 */
const ResponsiveWritingWorkspaceWireframe = () => {
  const [activeView, setActiveView] = useState('write');
  const [aiPanelOpen, setAiPanelOpen] = useState(true);
  const [showFileBrowser, setShowFileBrowser] = useState(false);
  const [currentChapter, setCurrentChapter] = useState('Chapter 1');
  
  // For tracking editor content
  const [editorContent, setEditorContent] = useState('');
  
  // Navigation items for view switching
  const navigationItems = [
    { id: 'write', label: 'Write' },
    { id: 'outline', label: 'Outline' },
    { id: 'research', label: 'Research' },
    { id: 'notes', label: 'Notes' }
  ];

  // Mock AI suggestions for the writing assistant
  const mockSuggestions = [
    {
      id: 1,
      type: 'plot',
      content: "Consider adding a scene where Alex discovers evidence that directly links Eleanor to the illegal experiments.",
    },
    {
      id: 2,
      type: 'character',
      content: "Eleanor's motivation would be stronger if we establish her personal connection to the technology earlier.",
    },
    {
      id: 3,
      type: 'style',
      content: "The dialogue in this scene could benefit from more tension to reflect the stakes of the confrontation.",
    },
    {
      id: 4,
      type: 'continuity',
      content: "Remember that Marcus mentioned his fear of enclosed spaces in Chapter 3, which should affect his reaction here.",
    }
  ];

  // Mock document structure
  const mockDocumentStructure = [
    { 
      id: 'part1', 
      name: 'Part I: The Investigation', 
      items: [
        { id: 'ch1', name: 'Chapter 1: The Assignment', wordCount: 2450 },
        { id: 'ch2', name: 'Chapter 2: First Clues', wordCount: 1850 },
        { id: 'ch3', name: 'Chapter 3: The Whistleblower', wordCount: 2100 },
      ]
    },
    { 
      id: 'part2', 
      name: 'Part II: The Conspiracy', 
      items: [
        { id: 'ch4', name: 'Chapter 4: Corporate Secrets', wordCount: 1975 },
        { id: 'ch5', name: 'Chapter 5: The Meeting', wordCount: 2300 },
        { id: 'ch6', name: 'Chapter 6: Revelations', wordCount: 1650 },
      ]
    }
  ];

  // Large screen layout with side panels
  const DesktopWritingWorkspace = () => (
    <div className="flex h-[calc(100vh-200px)] min-h-[600px]">
      {/* Left sidebar for document structure */}
      <div className={`${showFileBrowser ? 'w-64' : 'w-0'} transition-all duration-300 overflow-hidden border-r bg-gray-50`}>
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">Document</h3>
            <button className="text-gray-500 hover:text-gray-700">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          </div>
          
          <div className="space-y-4">
            {mockDocumentStructure.map(section => (
              <div key={section.id} className="space-y-1">
                <h4 className="text-sm font-medium text-gray-700">{section.name}</h4>
                <ul className="pl-3 border-l-2 border-gray-200">
                  {section.items.map(item => (
                    <li key={item.id} className="py-1">
                      <button 
                        className={`text-sm w-full text-left px-2 py-1 rounded hover:bg-gray-200 ${item.name.includes('Chapter 1') ? 'bg-gray-200' : ''}`}
                        onClick={() => setCurrentChapter(item.name)}
                      >
                        {item.name}
                        <span className="text-xs text-gray-500 ml-1">({item.wordCount})</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Center editor area */}
      <div className="flex-grow flex flex-col overflow-hidden">
        {/* Editor toolbar */}
        <div className="flex items-center justify-between border-b p-2 bg-white">
          <div className="flex items-center">
            <button 
              className={`p-1 mr-2 rounded ${showFileBrowser ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
              onClick={() => setShowFileBrowser(!showFileBrowser)}
              title="Toggle document structure"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
              </svg>
            </button>
            <span className="text-sm font-medium">{currentChapter}</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="text-sm px-2 py-1 rounded hover:bg-gray-100" title="Save draft">
              <span className="text-gray-500 text-xs">Saved</span>
            </button>
            <button className="text-sm px-2 py-1 rounded hover:bg-gray-100">
              <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-4.5-6.5" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 2H6" />
              </svg>
            </button>
            <button className="text-sm px-2 py-1 rounded hover:bg-gray-100">
              <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7l4-4m0 0l4 4m-4-4v18" />
              </svg>
            </button>
            <button className="text-sm px-2 py-1 rounded hover:bg-gray-100">
              <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Actual editor */}
        <div className="flex-grow overflow-auto p-4 bg-white">
          <QuillEditor 
            initialContent={'<h2>Chapter 1: The Assignment</h2><p>Alex Morgan sipped his coffee as he scrolled through the news alerts on his phone. Another day, another scandal buried under celebrity gossip and political theater. But something caught his eye - a small mention of Frost Industries\' record profits alongside reports of mysterious lab closures.</p><p>It wasn\'t much, but his instincts were rarely wrong. There was a story here, one that could make his career if he played it right.</p><p>"Morgan!" His editor\'s voice cut through the newsroom noise. "In my office, now."</p>'}
            onChange={setEditorContent}
          />
        </div>
      </div>
      
      {/* Right sidebar for AI assistant */}
      <div className={`${aiPanelOpen ? 'w-80' : 'w-0'} transition-all duration-300 overflow-hidden border-l bg-gray-50`}>
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">AI Assistant</h3>
            <button 
              className="text-gray-500 hover:text-gray-700"
              onClick={() => setAiPanelOpen(!aiPanelOpen)}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="space-y-3">
            {/* AI suggestion type tabs */}
            <div className="flex space-x-1 text-sm">
              <button className="px-2 py-1 rounded bg-blue-100 text-blue-800">All</button>
              <button className="px-2 py-1 rounded hover:bg-gray-200">Plot</button>
              <button className="px-2 py-1 rounded hover:bg-gray-200">Character</button>
              <button className="px-2 py-1 rounded hover:bg-gray-200">Style</button>
            </div>
            
            {/* AI suggestion cards */}
            <div className="space-y-3 mt-2">
              {mockSuggestions.map(suggestion => (
                <div key={suggestion.id} className="p-3 bg-white rounded-lg border shadow-sm">
                  <div className="flex justify-between items-start">
                    <span className={`text-xs px-1.5 py-0.5 rounded ${
                      suggestion.type === 'plot' ? 'bg-purple-100 text-purple-800' :
                      suggestion.type === 'character' ? 'bg-green-100 text-green-800' :
                      suggestion.type === 'style' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {suggestion.type}
                    </span>
                    <div className="flex space-x-1">
                      <button className="text-gray-400 hover:text-gray-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                      <button className="text-gray-400 hover:text-gray-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <p className="text-sm mt-2">{suggestion.content}</p>
                  <div className="mt-3 text-right">
                    <button className="text-xs text-blue-600 hover:text-blue-800">Apply suggestion</button>
                  </div>
                </div>
              ))}
            </div>
            
            {/* AI controls */}
            <div className="pt-3 border-t mt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">AI Assistance Level</span>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">Active</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                defaultValue="70"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Minimal</span>
                <span>Balanced</span>
                <span>Proactive</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Mobile optimized version that stacks panels
  const MobileWritingWorkspace = () => {
    const [activePanel, setActivePanel] = useState('editor');
    
    return (
      <div className="flex flex-col h-[calc(100vh-200px)] min-h-[500px]">
        {/* Mobile toolbar with nav buttons */}
        <div className="flex items-center justify-between border-b p-2 bg-white">
          <div className="flex items-center">
            <button 
              className={`p-1 mr-2 rounded ${activePanel === 'document' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
              onClick={() => setActivePanel(activePanel === 'document' ? 'editor' : 'document')}
              title="Toggle document structure"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
              </svg>
            </button>
            <span className="text-sm font-medium truncate">{currentChapter}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="text-xs px-2 py-1 rounded bg-gray-100">Saved</button>
            <button 
              className={`p-1 rounded ${activePanel === 'ai' ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
              onClick={() => setActivePanel(activePanel === 'ai' ? 'editor' : 'ai')}
              title="Toggle AI assistant"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Document structure panel (conditionally shown) */}
        {activePanel === 'document' && (
          <div className="overflow-auto bg-gray-50 p-3 h-full">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium">Document Structure</h3>
              <button 
                className="text-gray-500"
                onClick={() => setActivePanel('editor')}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-3">
              {mockDocumentStructure.map(section => (
                <div key={section.id} className="space-y-1">
                  <h4 className="text-sm font-medium text-gray-700">{section.name}</h4>
                  <ul className="pl-3 border-l-2 border-gray-200">
                    {section.items.map(item => (
                      <li key={item.id} className="py-1">
                        <button 
                          className={`text-sm w-full text-left px-2 py-1 rounded hover:bg-gray-200 ${
                            item.name.includes('Chapter 1') ? 'bg-gray-200' : ''
                          }`}
                          onClick={() => {
                            setCurrentChapter(item.name);
                            setActivePanel('editor');
                          }}
                        >
                          {item.name}
                          <span className="text-xs text-gray-500 ml-1">({item.wordCount})</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Editor panel (shown by default) */}
        {activePanel === 'editor' && (
          <div className="flex-grow overflow-auto p-3 bg-white">
            <QuillEditor 
              initialContent={'<h2>Chapter 1: The Assignment</h2><p>Alex Morgan sipped his coffee as he scrolled through the news alerts on his phone. Another day, another scandal buried under celebrity gossip and political theater. But something caught his eye - a small mention of Frost Industries\' record profits alongside reports of mysterious lab closures.</p><p>It wasn\'t much, but his instincts were rarely wrong. There was a story here, one that could make his career if he played it right.</p><p>"Morgan!" His editor\'s voice cut through the newsroom noise. "In my office, now."</p>'}
              onChange={setEditorContent}
            />
          </div>
        )}
        
        {/* AI assistant panel (conditionally shown) */}
        {activePanel === 'ai' && (
          <div className="overflow-auto bg-gray-50 p-3 h-full">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium">AI Assistant</h3>
              <button 
                className="text-gray-500"
                onClick={() => setActivePanel('editor')}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* AI suggestion type tabs */}
            <div className="flex space-x-1 text-sm overflow-x-auto pb-1 mb-2">
              <button className="px-2 py-1 rounded bg-blue-100 text-blue-800 whitespace-nowrap">All</button>
              <button className="px-2 py-1 rounded hover:bg-gray-200 whitespace-nowrap">Plot</button>
              <button className="px-2 py-1 rounded hover:bg-gray-200 whitespace-nowrap">Character</button>
              <button className="px-2 py-1 rounded hover:bg-gray-200 whitespace-nowrap">Style</button>
            </div>
            
            {/* AI suggestion cards */}
            <div className="space-y-3">
              {mockSuggestions.map(suggestion => (
                <div key={suggestion.id} className="p-3 bg-white rounded-lg border shadow-sm">
                  <div className="flex justify-between items-start">
                    <span className={`text-xs px-1.5 py-0.5 rounded ${
                      suggestion.type === 'plot' ? 'bg-purple-100 text-purple-800' :
                      suggestion.type === 'character' ? 'bg-green-100 text-green-800' :
                      suggestion.type === 'style' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {suggestion.type}
                    </span>
                    <div className="flex space-x-1">
                      <button className="text-gray-400 hover:text-gray-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                      <button className="text-gray-400 hover:text-gray-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <p className="text-sm mt-2">{suggestion.content}</p>
                  <div className="mt-3 text-right">
                    <button 
                      className="text-xs text-blue-600 hover:text-blue-800"
                      onClick={() => setActivePanel('editor')}
                    >
                      Apply suggestion
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {/* AI controls */}
            <div className="pt-3 border-t mt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">AI Assistance Level</span>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">Active</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                defaultValue="70"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Minimal</span>
                <span>Balanced</span>
                <span>Proactive</span>
              </div>
            </div>
          </div>
        )}
        
        {/* Mobile bottom toolbar */}
        <div className="border-t bg-white p-2 flex justify-between items-center">
          <div className="flex space-x-3">
            <button className="p-1 rounded hover:bg-gray-100">
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button className="p-1 rounded hover:bg-gray-100">
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          
          <div className="text-xs text-gray-500">
            {/* Word count would come from Quill editor */}
            Word count: {editorContent ? 145 : 0}
          </div>
        </div>
      </div>
    );
  };

  return (
    <ResponsiveContainer>
      <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-primary-700">Writing Workspace</h1>
      
      {/* Mode Tabs */}
      <div className="bg-white rounded-lg shadow-md p-2 md:p-4 mb-4 md:mb-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <ResponsiveNavigation 
            items={navigationItems}
            onSelect={setActiveView}
            activeItem={activeView}
          />
          
          <div className="flex gap-2 w-full md:w-auto">
            <button 
              className={`btn-primary flex-1 md:flex-initial ${!aiPanelOpen ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}`}
              onClick={() => setAiPanelOpen(!aiPanelOpen)}
            >
              {aiPanelOpen ? 'Hide AI' : 'Show AI'}
            </button>
            <button className="btn-success flex-1 md:flex-initial">
              Save Draft
            </button>
          </div>
        </div>
      </div>
      
      {/* Writing Workspace */}
      <div className="bg-white rounded-lg shadow-md mb-4">
        <ResponsiveVisualization 
          desktopVisualization={<DesktopWritingWorkspace />}
          mobileVisualization={<MobileWritingWorkspace />}
          fallbackContent={
            <div className="p-6 text-center">
              <h3 className="text-lg font-medium mb-2">Writing Interface</h3>
              <p className="text-gray-600">
                The writing interface adapts to different screen sizes,
                providing a focused writing experience on all devices.
              </p>
            </div>
          }
        />
      </div>
      
      {/* Status Bar */}
      <div className="text-sm text-gray-500 flex flex-col sm:flex-row justify-between">
        <span>Current Project: The Investigator</span>
        <span>Last saved: Just now</span>
      </div>
    </ResponsiveContainer>
  );
};

export default ResponsiveWritingWorkspaceWireframe;
