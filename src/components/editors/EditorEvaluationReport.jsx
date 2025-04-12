import React, { useState, useEffect } from 'react';

const EditorEvaluationReport = ({ draftMetrics, quillMetrics, onSave }) => {
  const [report, setReport] = useState({
    performanceNotes: '',
    customizationNotes: '',
    uiExperienceNotes: '',
    aiIntegrationNotes: '',
    mobileNotes: '',
    conclusion: '',
    selectedEditor: null,
  });
  
  // Track render times and interactions
  const [metrics, setMetrics] = useState({
    draftRenderTime: draftMetrics?.renderTime || 'Not measured',
    quillRenderTime: quillMetrics?.renderTime || 'Not measured',
    draftInteractionLatency: draftMetrics?.interactionLatency || 'Not measured',
    quillInteractionLatency: quillMetrics?.interactionLatency || 'Not measured',
  });

  const handleInputChange = (field, value) => {
    setReport(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    // Save report to localStorage for persistence
    localStorage.setItem('editorEvaluationReport', JSON.stringify(report));
    
    // If onSave callback is provided, call it with the report data
    if (onSave) {
      onSave(report);
    }
  };

  // Load saved report from localStorage on initial render
  useEffect(() => {
    const savedReport = localStorage.getItem('editorEvaluationReport');
    if (savedReport) {
      try {
        setReport(JSON.parse(savedReport));
      } catch (e) {
        console.error('Error parsing saved report:', e);
      }
    }
  }, []);

  // Update metrics if they change
  useEffect(() => {
    if (draftMetrics || quillMetrics) {
      setMetrics({
        draftRenderTime: draftMetrics?.renderTime || 'Not measured',
        quillRenderTime: quillMetrics?.renderTime || 'Not measured',
        draftInteractionLatency: draftMetrics?.interactionLatency || 'Not measured',
        quillInteractionLatency: quillMetrics?.interactionLatency || 'Not measured',
      });
    }
  }, [draftMetrics, quillMetrics]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-primary-700">Editor Evaluation Report</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="font-semibold mb-2">Draft.js Metrics</h3>
          <p><span className="font-medium">Render Time:</span> {metrics.draftRenderTime}</p>
          <p><span className="font-medium">Interaction Latency:</span> {metrics.draftInteractionLatency}</p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="font-semibold mb-2">Quill.js Metrics</h3>
          <p><span className="font-medium">Render Time:</span> {metrics.quillRenderTime}</p>
          <p><span className="font-medium">Interaction Latency:</span> {metrics.quillInteractionLatency}</p>
        </div>
      </div>
      
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Performance with Large Documents</h3>
        <textarea
          className="w-full h-24 p-2 border border-gray-300 rounded-md"
          value={report.performanceNotes}
          onChange={(e) => handleInputChange('performanceNotes', e.target.value)}
          placeholder="Document observations about loading times, typing responsiveness, and memory usage with large documents..."
        />
      </div>
      
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Ease of Customization and Extension</h3>
        <textarea
          className="w-full h-24 p-2 border border-gray-300 rounded-md"
          value={report.customizationNotes}
          onChange={(e) => handleInputChange('customizationNotes', e.target.value)}
          placeholder="Note observations about API flexibility, plugin ecosystem, and ability to extend for custom requirements..."
        />
      </div>
      
      <div className="mb-4">
        <h3 className="font-semibold mb-2">User Experience and Interface</h3>
        <textarea
          className="w-full h-24 p-2 border border-gray-300 rounded-md"
          value={report.uiExperienceNotes}
          onChange={(e) => handleInputChange('uiExperienceNotes', e.target.value)}
          placeholder="Document UI quality, intuitiveness, and ease of use..."
        />
      </div>
      
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Compatibility with AI Integration Requirements</h3>
        <textarea
          className="w-full h-24 p-2 border border-gray-300 rounded-md"
          value={report.aiIntegrationNotes}
          onChange={(e) => handleInputChange('aiIntegrationNotes', e.target.value)}
          placeholder="Evaluate how well each editor could integrate with planned AI assistance features..."
        />
      </div>
      
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Mobile Responsiveness</h3>
        <textarea
          className="w-full h-24 p-2 border border-gray-300 rounded-md"
          value={report.mobileNotes}
          onChange={(e) => handleInputChange('mobileNotes', e.target.value)}
          placeholder="Note observations about touch support, mobile display, and usability on smaller screens..."
        />
      </div>
      
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Conclusion and Recommendation</h3>
        <textarea
          className="w-full h-32 p-2 border border-gray-300 rounded-md"
          value={report.conclusion}
          onChange={(e) => handleInputChange('conclusion', e.target.value)}
          placeholder="Summarize findings and provide a recommendation with rationale..."
        />
      </div>
      
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Final Selection</h3>
        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="selectedEditor"
              value="draft"
              checked={report.selectedEditor === 'draft'}
              onChange={() => handleInputChange('selectedEditor', 'draft')}
              className="mr-2"
            />
            Draft.js
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="selectedEditor"
              value="quill"
              checked={report.selectedEditor === 'quill'}
              onChange={() => handleInputChange('selectedEditor', 'quill')}
              className="mr-2"
            />
            Quill.js
          </label>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          className="btn-success"
          onClick={handleSave}
        >
          Save Evaluation Report
        </button>
      </div>
    </div>
  );
};

export default EditorEvaluationReport;
