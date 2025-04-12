import React, { useState, useEffect, useRef } from 'react';
import DraftEditor from '../components/editors/DraftEditor';
import QuillEditor from '../components/editors/QuillEditor';
import EditorEvaluationReport from '../components/editors/EditorEvaluationReport';

const EditorComparisonPage = () => {
  const [draftContent, setDraftContent] = useState('');
  const [quillContent, setQuillContent] = useState('');
  const [longTextTest, setLongTextTest] = useState(false);
  const [selectedEditor, setSelectedEditor] = useState('both');
  const [showEvaluationReport, setShowEvaluationReport] = useState(false);
  const [metrics, setMetrics] = useState({
    draft: { renderTime: null, interactionLatency: null },
    quill: { renderTime: null, interactionLatency: null }
  });

  // References for timing measurements
  const draftStartTimeRef = useRef(null);
  const quillStartTimeRef = useRef(null);

  // Function to measure editor render times
  const measureEditorPerformance = () => {
    // Start timing for both editors
    draftStartTimeRef.current = performance.now();
    quillStartTimeRef.current = performance.now();
    
    // Generate 100 paragraphs of lorem ipsum
    const paragraph = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
    
    const longText = Array(100)
      .fill(paragraph)
      .map((p, i) => `<h2>Paragraph ${i + 1}</h2><p>${p}</p>`)
      .join('');
    
    setQuillContent(longText);
    
    // Create a simplified version for Draft.js
    // Draft.js needs a special format, for this test we'll use a simplified version
    const draftText = Array(100)
      .fill(paragraph)
      .join('\n\n');
    
    setDraftContent(draftText);
    setLongTextTest(true);
    
    // We'll record the render time in useEffect after content change
  };
  
  // Record render time for editors after content changes
  useEffect(() => {
    if (longTextTest && draftStartTimeRef.current && quillStartTimeRef.current) {
      const now = performance.now();
      
      setMetrics(prev => ({
        draft: { 
          ...prev.draft,
          renderTime: `${(now - draftStartTimeRef.current).toFixed(2)}ms` 
        },
        quill: { 
          ...prev.quill,
          renderTime: `${(now - quillStartTimeRef.current).toFixed(2)}ms` 
        }
      }));
      
      // Reset start time refs
      draftStartTimeRef.current = null;
      quillStartTimeRef.current = null;
    }
  }, [draftContent, quillContent, longTextTest]);

  // Clear both editors and reset metrics
  const clearEditors = () => {
    setDraftContent('');
    setQuillContent('');
    setLongTextTest(false);
    setMetrics({
      draft: { renderTime: null, interactionLatency: null },
      quill: { renderTime: null, interactionLatency: null }
    });
  };
  
  // Measure interaction latency
  const measureInteractionLatency = (editor) => {
    const startTime = performance.now();
    
    // Simulate a complex interaction by adding and formatting text
    if (editor === 'draft') {
      // For Draft.js - add simple text since we can't programmatically manipulate the Draft.js state easily
      const newText = draftContent + '\n\nInteraction test - ' + new Date().toISOString();
      setDraftContent(newText);
      
      // Record latency
      const endTime = performance.now();
      setMetrics(prev => ({
        ...prev,
        draft: { 
          ...prev.draft,
          interactionLatency: `${(endTime - startTime).toFixed(2)}ms` 
        }
      }));
    } else if (editor === 'quill') {
      // For Quill.js - add simple text
      const newText = quillContent + '<p>Interaction test - ' + new Date().toISOString() + '</p>';
      setQuillContent(newText);
      
      // Record latency
      const endTime = performance.now();
      setMetrics(prev => ({
        ...prev,
        quill: { 
          ...prev.quill,
          interactionLatency: `${(endTime - startTime).toFixed(2)}ms` 
        }
      }));
    }
  };
  
  // Save evaluation report
  const handleSaveReport = (reportData) => {
    console.log('Evaluation report saved:', reportData);
    // Here you would typically send this to your backend or handle as needed
    alert('Evaluation report saved successfully!');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-primary-700">Editor Comparison (Technical Spike)</h1>

      <div className="mb-6 flex flex-col md:flex-row justify-center gap-4">
        <button
          className="btn-primary"
          onClick={measureEditorPerformance}
          disabled={longTextTest}
        >
          Load Long Text for Performance Testing
        </button>
        <button
          className="btn-secondary"
          onClick={clearEditors}
        >
          Clear Both Editors
        </button>
        <button
          className="btn-success"
          onClick={() => setShowEvaluationReport(!showEvaluationReport)}
        >
          {showEvaluationReport ? 'Hide Evaluation Report' : 'Show Evaluation Report'}
        </button>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Display Options:</h2>
        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="editorSelection"
              value="both"
              checked={selectedEditor === 'both'}
              onChange={() => setSelectedEditor('both')}
              className="mr-2"
            />
            Show Both Editors
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="editorSelection"
              value="draft"
              checked={selectedEditor === 'draft'}
              onChange={() => setSelectedEditor('draft')}
              className="mr-2"
            />
            Draft.js Only
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="editorSelection"
              value="quill"
              checked={selectedEditor === 'quill'}
              onChange={() => setSelectedEditor('quill')}
              className="mr-2"
            />
            Quill.js Only
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {(selectedEditor === 'both' || selectedEditor === 'draft') && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-primary-700">Draft.js Editor</h2>
            <p className="mb-4 text-gray-600">
              A rich text editor framework for React, focusing on composability and extensibility.
            </p>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <DraftEditor 
                initialContent={draftContent} 
                onChange={setDraftContent} 
              />
            </div>
          </div>
        )}
        
        {(selectedEditor === 'both' || selectedEditor === 'quill') && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-primary-700">Quill.js Editor</h2>
            <p className="mb-4 text-gray-600">
              A powerful WYSIWYG editor with a modular architecture and a clean API.
            </p>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <QuillEditor 
                initialContent={quillContent} 
                onChange={setQuillContent} 
              />
            </div>
          </div>
        )}
      </div>

      {longTextTest && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Performance Testing Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-2">Draft.js Metrics</h3>
              <div className="flex flex-col gap-2">
                <p>Render Time: {metrics.draft.renderTime || 'Not measured'}</p>
                <p>Interaction Latency: {metrics.draft.interactionLatency || 'Not measured'}</p>
                <button
                  className="btn-info"
                  onClick={() => measureInteractionLatency('draft')}
                >
                  Measure Interaction Latency
                </button>
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-2">Quill.js Metrics</h3>
              <div className="flex flex-col gap-2">
                <p>Render Time: {metrics.quill.renderTime || 'Not measured'}</p>
                <p>Interaction Latency: {metrics.quill.interactionLatency || 'Not measured'}</p>
                <button
                  className="btn-info"
                  onClick={() => measureInteractionLatency('quill')}
                >
                  Measure Interaction Latency
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {showEvaluationReport && (
        <EditorEvaluationReport 
          draftMetrics={metrics.draft}
          quillMetrics={metrics.quill}
          onSave={handleSaveReport}
        />
      )}
    </div>
  );
};

export default EditorComparisonPage;
