import React, { useState } from 'react';
import DraftEditor from '../components/editors/DraftEditor';
import QuillEditor from '../components/editors/QuillEditor';

const EditorComparisonPage = () => {
  const [draftContent, setDraftContent] = useState('');
  const [quillContent, setQuillContent] = useState('');
  const [longTextTest, setLongTextTest] = useState(false);
  const [selectedEditor, setSelectedEditor] = useState('both');

  // Generate long text for performance testing
  const generateLongText = () => {
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
  };

  // Clear both editors
  const clearEditors = () => {
    setDraftContent('');
    setQuillContent('');
    setLongTextTest(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-primary-700">Editor Comparison (Technical Spike)</h1>

      <div className="mb-6 flex flex-col md:flex-row justify-center gap-4">
        <button
          className="btn-primary"
          onClick={generateLongText}
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

      <div className="mt-12 bg-gray-50 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Evaluation Notes</h2>
        <p className="mb-2">Use this section to document observations during testing:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Performance with large documents</li>
          <li>Ease of customization and extension</li>
          <li>User experience and interface</li>
          <li>Compatibility with AI integration requirements</li>
          <li>Mobile responsiveness</li>
        </ul>
        <textarea 
          className="w-full h-32 p-2 border border-gray-300 rounded-md"
          placeholder="Add your evaluation notes here..."
        ></textarea>
      </div>
    </div>
  );
};

export default EditorComparisonPage;
