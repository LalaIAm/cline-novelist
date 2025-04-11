import React, { useState, useEffect } from 'react';
import { Editor, EditorState, RichUtils, getDefaultKeyBinding, convertToRaw, convertFromRaw } from 'draft-js';
import 'draft-js/dist/Draft.css';

const DraftEditor = ({ initialContent, onChange }) => {
  // Initialize with empty editor state or with provided content
  const [editorState, setEditorState] = useState(() => {
    if (initialContent) {
      try {
        const contentState = convertFromRaw(JSON.parse(initialContent));
        return EditorState.createWithContent(contentState);
      } catch (e) {
        console.error('Error parsing initial content:', e);
      }
    }
    return EditorState.createEmpty();
  });

  // Track focus state
  const [isFocused, setIsFocused] = useState(false);

  // Handle changes to editor state
  const handleChange = (newEditorState) => {
    setEditorState(newEditorState);
    
    // If onChange callback is provided, convert content to raw and pass to parent
    if (onChange) {
      const contentState = newEditorState.getCurrentContent();
      const rawContent = JSON.stringify(convertToRaw(contentState));
      onChange(rawContent);
    }
  };

  // Handle keyboard shortcuts
  const handleKeyCommand = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      handleChange(newState);
      return 'handled';
    }
    return 'not-handled';
  };

  // Custom key binding function
  const mapKeyToEditorCommand = (e) => {
    return getDefaultKeyBinding(e);
  };

  // Toggle inline styles (bold, italic, etc.)
  const toggleInlineStyle = (style) => {
    handleChange(RichUtils.toggleInlineStyle(editorState, style));
  };

  // Toggle block styles (h1, h2, blockquote, etc.)
  const toggleBlockType = (blockType) => {
    handleChange(RichUtils.toggleBlockType(editorState, blockType));
  };

  // Format buttons for toolbar
  const InlineStyleButton = ({ style, label }) => (
    <button
      className={`p-2 rounded-md hover:bg-gray-200 ${
        editorState.getCurrentInlineStyle().has(style) ? 'bg-gray-200' : ''
      }`}
      onMouseDown={(e) => {
        e.preventDefault();
        toggleInlineStyle(style);
      }}
    >
      {label}
    </button>
  );

  const BlockStyleButton = ({ blockType, label }) => {
    const currentBlockType = RichUtils.getCurrentBlockType(editorState);
    return (
      <button
        className={`p-2 rounded-md hover:bg-gray-200 ${
          currentBlockType === blockType ? 'bg-gray-200' : ''
        }`}
        onMouseDown={(e) => {
          e.preventDefault();
          toggleBlockType(blockType);
        }}
      >
        {label}
      </button>
    );
  };

  // Editor container element for focus handling
  const editorRef = React.useRef(null);

  return (
    <div className="editor-container">
      <div className="flex flex-wrap gap-2 mb-2 p-2 border-b border-gray-200">
        <InlineStyleButton style="BOLD" label="Bold" />
        <InlineStyleButton style="ITALIC" label="Italic" />
        <InlineStyleButton style="UNDERLINE" label="Underline" />
        <BlockStyleButton blockType="header-one" label="H1" />
        <BlockStyleButton blockType="header-two" label="H2" />
        <BlockStyleButton blockType="blockquote" label="Quote" />
        <BlockStyleButton blockType="unordered-list-item" label="List" />
      </div>
      
      <div 
        className={`editor-content ${isFocused ? 'ring-2 ring-primary-500' : ''}`}
        onClick={() => {
          editorRef.current.focus();
          setIsFocused(true);
        }}
        ref={editorRef}
      >
        <Editor
          editorState={editorState}
          onChange={handleChange}
          handleKeyCommand={handleKeyCommand}
          keyBindingFn={mapKeyToEditorCommand}
          placeholder="Write your story..."
          spellCheck={true}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </div>
      
      <div className="mt-2 text-sm text-gray-500">
        <p>Draft.js Editor - Character count: {editorState.getCurrentContent().getPlainText().length}</p>
      </div>
    </div>
  );
};

export default DraftEditor;
