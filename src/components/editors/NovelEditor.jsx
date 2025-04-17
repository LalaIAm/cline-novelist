import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './custom-quill/novel-formats.css';

// Import our custom Quill components
import './custom-quill/NovelStructureModule';
import ChapterBlot from './custom-quill/ChapterBlot';
import SceneBlot from './custom-quill/SceneBlot';
import BeatBlot from './custom-quill/BeatBlot';

// Register the formats with Quill (registration will be handled by NovelStructureModule)

const NovelEditor = forwardRef(({
  initialContent,
  onChange,
  onStructureChange,
  showStructureSidebar = false,
  focusMode = false,
  autoSave = true,
}, ref) => {
  // Editor state
  const [content, setContent] = useState(initialContent || '');
  const [charCount, setCharCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [structure, setStructure] = useState({ chapters: [] });
  const [isFocusMode, setIsFocusMode] = useState(focusMode);
  
  // Autosave state
  const [lastSaved, setLastSaved] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  
  // References
  const quillRef = useRef(null);
  const novelStructureRef = useRef(null);
  const autoSaveTimerRef = useRef(null);

  // Expose methods to parent component via ref
  useImperativeHandle(ref, () => ({
    // Get editor content
    getContent: () => content,
    
    // Set editor content
    setContent: (newContent) => {
      setContent(newContent);
      if (quillRef.current) {
        quillRef.current.getEditor().setText(newContent);
      }
    },
    
    // Insert content at cursor position
    insertAtCursor: (textToInsert) => {
      if (quillRef.current) {
        const quill = quillRef.current.getEditor();
        const range = quill.getSelection();
        if (range) {
          quill.insertText(range.index, textToInsert);
        } else {
          // If no selection, insert at end
          quill.insertText(quill.getLength() - 1, textToInsert);
        }
      }
    },
    
    // Access the structure module
    getStructureModule: () => novelStructureRef.current,
    
    // Insert chapter
    insertChapter: (chapterData) => {
      if (novelStructureRef.current) {
        novelStructureRef.current.insertChapter(chapterData);
      }
    },
    
    // Insert scene
    insertScene: (sceneData) => {
      if (novelStructureRef.current) {
        novelStructureRef.current.insertScene(sceneData);
      }
    },
    
    // Insert beat
    insertBeat: (beatData) => {
      if (novelStructureRef.current) {
        novelStructureRef.current.insertBeat(beatData);
      }
    }
  }));

  // Initialize the editor with our novel structure module
  useEffect(() => {
    if (quillRef.current) {
      const quill = quillRef.current.getEditor();
      // Store reference to the novel structure module
      novelStructureRef.current = quill.getModule('novelStructure');
      
      // Initial structure update
      updateStructure();
    }
  }, []);

  // Update content stats when content changes
  useEffect(() => {
    if (quillRef.current) {
      const text = quillRef.current.getEditor().getText();
      // Subtract 1 to account for trailing newline that Quill adds
      const chars = Math.max(0, text.length - 1);
      setCharCount(chars);
      
      // Count words (split by whitespace and filter out empty strings)
      const words = text.split(/\s+/).filter(Boolean).length;
      setWordCount(words);
      
      // Mark as dirty for autosave
      setIsDirty(true);
      
      // Update document structure
      updateStructure();
    }
  }, [content]);

  // Handle autosave
  useEffect(() => {
    if (autoSave && isDirty) {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
      
      autoSaveTimerRef.current = setTimeout(() => {
        // Save to localStorage
        localStorage.setItem('novylist_autosave', content);
        setLastSaved(new Date());
        setIsDirty(false);
        
        // Add more sophisticated autosave functionality here
        // e.g., saving to server, version management, etc.
      }, 2000); // 2 second debounce
    }
    
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [content, isDirty, autoSave]);

  // Handle content changes
  const handleChange = (value) => {
    setContent(value);
    
    // If onChange callback is provided, pass the new content to parent
    if (onChange) {
      onChange(value);
    }
  };

  // Update document structure from editor
  const updateStructure = () => {
    if (novelStructureRef.current) {
      const docStructure = novelStructureRef.current.getDocumentStructure();
      setStructure(docStructure);
      
      // If structure change callback is provided, pass the structure to parent
      if (onStructureChange) {
        onStructureChange(docStructure);
      }
    }
  };

  // Novel-specific toolbar configuration
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
    // Add our custom novel structure module
    novelStructure: {
      structureSidebar: showStructureSidebar,
      keyboardShortcuts: true,
    }
  };

  // Format configuration including our custom formats
  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'blockquote', 'code-block',
    'script',
    'align',
    'link', 'image',
    // Novel-specific formats
    'chapter',
    'scene',
    'beat'
  ];

  // Helper methods that expose the novel structure module's functionality
  const insertChapter = (chapterData = {}) => {
    if (novelStructureRef.current) {
      novelStructureRef.current.insertChapter(chapterData);
    }
  };
  
  const insertScene = (sceneData = {}) => {
    if (novelStructureRef.current) {
      novelStructureRef.current.insertScene(sceneData);
    }
  };
  
  const insertBeat = (beatData = {}) => {
    if (novelStructureRef.current) {
      novelStructureRef.current.insertBeat(beatData);
    }
  };
  
  const toggleFocusMode = () => {
    setIsFocusMode(!isFocusMode);
  };

  // Render the structure sidebar if enabled
  const renderStructureSidebar = () => {
    if (!showStructureSidebar) return null;
    
    return (
      <div className="novel-structure-sidebar">
        <h3 className="text-lg font-semibold mb-4">Document Structure</h3>
        {structure.chapters.map((chapter, index) => (
          <div key={chapter.id} className="mb-4">
            <div className="chapter-item structure-item" onClick={() => navigateToChapter(chapter.id)}>
              Chapter {chapter.number}: {chapter.title}
            </div>
            
            {chapter.scenes && chapter.scenes.map((scene, sceneIndex) => (
              <div key={scene.id} className="ml-4 mb-2">
                <div className="scene-item structure-item" onClick={() => navigateToScene(scene.id)}>
                  Scene {scene.number}{scene.title ? `: ${scene.title}` : ''}
                </div>
                
                {scene.beats && scene.beats.map((beat, beatIndex) => (
                  <div 
                    key={beat.id}
                    className="beat-item structure-item"
                    onClick={() => navigateToBeat(beat.id)}
                  >
                    {beat.type.charAt(0).toUpperCase() + beat.type.slice(1)} Beat
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  // Navigation handlers (these will be implemented in the future)
  const navigateToChapter = (chapterId) => {
    // Implementation will be added as part of the structure navigation work
    console.log(`Navigate to chapter: ${chapterId}`);
  };
  
  const navigateToScene = (sceneId) => {
    // Implementation will be added as part of the structure navigation work
    console.log(`Navigate to scene: ${sceneId}`);
  };
  
  const navigateToBeat = (beatId) => {
    // Implementation will be added as part of the structure navigation work
    console.log(`Navigate to beat: ${beatId}`);
  };

  return (
    <div className={`novel-editor-container flex ${showStructureSidebar ? 'with-sidebar' : ''}`}>
      <div className={`editor-main flex-grow ${isFocusMode ? 'quill-focus-mode' : ''}`}>
        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={content}
          onChange={handleChange}
          modules={modules}
          formats={formats}
          placeholder="Begin your novel..."
          className="editor-content mb-10" // Add margin bottom to account for Quill toolbar
        />
        
        {/* Novel-specific toolbar extension */}
        <div className="ql-novel-structure">
          <button className="ql-chapter" onClick={() => insertChapter()}>
            Add Chapter
          </button>
          <button className="ql-scene" onClick={() => insertScene()}>
            Add Scene
          </button>
          <button className="ql-beat" onClick={() => insertBeat()}>
            Add Beat
          </button>
          <button className="ql-focus-mode" onClick={toggleFocusMode}>
            {isFocusMode ? 'Exit Focus Mode' : 'Focus Mode'}
          </button>
        </div>
        
        <div className="mt-4 text-sm text-gray-500 flex justify-between">
          <div>
            <span>Words: {wordCount}</span>
            <span className="ml-4">Characters: {charCount}</span>
          </div>
          {lastSaved && (
            <div>
              Last saved: {lastSaved.toLocaleTimeString()}
            </div>
          )}
        </div>
      </div>
      
      {renderStructureSidebar()}
    </div>
  );
});

export default NovelEditor;
