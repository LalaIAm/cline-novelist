import React, { useState, useEffect, useRef } from 'react';
import NovelEditor from '../components/editors/NovelEditor';
import AIAssistancePanel from '../components/ai/AIAssistancePanel';

const WritingWorkspacePage = () => {
  const [structure, setStructure] = useState({ chapters: [] });
  const [showSidebar, setShowSidebar] = useState(true);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [editorContent, setEditorContent] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [currentPosition, setCurrentPosition] = useState({
    chapterId: null,
    sceneId: null,
    beatId: null
  });
  
  // Editor reference
  const editorRef = useRef(null);
  
  // Load API key from localStorage on component mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem('novylist_ai_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);
  
  // Demo initial content with chapter, scene, and beat structures
  const initialContent = `<h1>My Novel</h1><p>Start writing your masterpiece...</p>`;
  
  // Handle structure changes from the editor
  const handleStructureChange = (newStructure) => {
    setStructure(newStructure);
  };
  
  // Handle content changes from the editor
  const handleContentChange = (content) => {
    // Store content for AI processing
    setEditorContent(content);
    
    // In a real implementation, this would trigger debounced saving
    console.log('Content updated');
  };
  
  // Toggle structure sidebar
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };
  
  // Toggle AI assistance panel
  const toggleAIPanel = () => {
    setShowAIPanel(!showAIPanel);
  };
  
  // Handle inserting AI-generated content into the editor
  const handleInsertContent = (content) => {
    if (editorRef.current) {
      // Insert content at cursor position using the ref method
      editorRef.current.insertAtCursor(content);
      console.log('Content inserted at cursor position');
    }
  };
  
  // Handle API key setting
  const handleSetApiKey = () => {
    const key = prompt('Enter your OpenAI API key:');
    if (key) {
      localStorage.setItem('novylist_ai_api_key', key);
      setApiKey(key);
    }
  };
  
  // Handle clear API key
  const handleClearApiKey = () => {
    if (confirm('Are you sure you want to remove your API key?')) {
      localStorage.removeItem('novylist_ai_api_key');
      setApiKey('');
    }
  };
  
  // Render the AI assistance panel
  const renderAIPanel = () => {
    if (!showAIPanel) return null;
    
    return (
      <AIAssistancePanel
        editorContent={editorContent}
        documentStructure={structure}
        currentPosition={currentPosition}
        metadata={{
          characters: {}, // Would be populated from character management
          plot: {},       // Would be populated from plot management
          settings: {}    // Would be populated from settings management
        }}
        onInsertContent={handleInsertContent}
        onError={(error) => console.error('AI Panel error:', error)}
        className="w-80 border-l border-gray-200 flex flex-col h-full overflow-y-auto"
        apiKey={apiKey}
      />
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header with navigation and controls */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-800">Novylist</h1>
            <span className="mx-4 text-gray-300">|</span>
            <h2 className="text-lg text-gray-600">My Novel</h2>
          </div>
          
          <div className="flex space-x-4">
            <button 
              className="px-3 py-1 text-sm rounded border border-gray-300 hover:bg-gray-100"
              onClick={toggleSidebar}
            >
              {showSidebar ? 'Hide Structure' : 'Show Structure'}
            </button>
            
            <button 
              className="px-3 py-1 text-sm rounded border border-gray-300 hover:bg-gray-100"
              onClick={toggleAIPanel}
            >
              {showAIPanel ? 'Hide AI' : 'Show AI'}
            </button>
            
            {showAIPanel && (
              <button
                className="px-3 py-1 text-sm rounded border border-gray-300 hover:bg-gray-100"
                onClick={apiKey ? handleClearApiKey : handleSetApiKey}
              >
                {apiKey ? 'Clear API Key' : 'Set API Key'}
              </button>
            )}
            
            <button className="px-3 py-1 text-sm rounded bg-blue-600 text-white hover:bg-blue-700">
              Save
            </button>
          </div>
        </div>
      </header>
      
      {/* Main content area with editor and panels */}
      <div className="flex-grow flex overflow-hidden">
        {/* Editor with optional structure sidebar */}
        <NovelEditor
          ref={editorRef}
          initialContent={initialContent}
          onChange={handleContentChange}
          onStructureChange={handleStructureChange}
          showStructureSidebar={showSidebar}
          autoSave={true}
        />
        
        {/* AI assistance panel */}
        {renderAIPanel()}
      </div>
    </div>
  );
};

export default WritingWorkspacePage;
