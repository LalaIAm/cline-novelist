import React, { useState, useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const QuillEditor = ({ initialContent, onChange }) => {
  // Initialize with empty content or provided content
  const [content, setContent] = useState(initialContent || '');
  
  // Track character count
  const [charCount, setCharCount] = useState(0);
  
  // Reference to the ReactQuill component
  const quillRef = useRef(null);

  // Update character count when content changes
  useEffect(() => {
    if (quillRef.current) {
      const text = quillRef.current.getEditor().getText();
      // Subtract 1 to account for the trailing newline Quill adds
      setCharCount(Math.max(0, text.length - 1));
    }
  }, [content]);

  // Handle content changes
  const handleChange = (value) => {
    setContent(value);
    
    // If onChange callback is provided, pass the new content to parent
    if (onChange) {
      onChange(value);
    }
  };

  // Toolbar configuration
  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'header': 1 }, { 'header': 2 }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['blockquote', 'code-block'],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'align': [] }],
      ['link', 'image'],
      ['clean']
    ],
  };

  // Format configuration
  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'blockquote', 'code-block',
    'script',
    'align',
    'link', 'image'
  ];

  return (
    <div className="editor-container">
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={content}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        placeholder="Write your story..."
        className="editor-content mb-10" // Add margin bottom to account for Quill toolbar
      />
      
      <div className="mt-6 text-sm text-gray-500">
        <p>Quill.js Editor - Character count: {charCount}</p>
      </div>
    </div>
  );
};

export default QuillEditor;
