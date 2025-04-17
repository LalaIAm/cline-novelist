import Quill from 'quill';
import ChapterBlot from './ChapterBlot';
import SceneBlot from './SceneBlot';
import BeatBlot from './BeatBlot';

// Import Quill formats we'll be extending
const Module = Quill.import('core/module');

class NovelStructureModule extends Module {
  constructor(quill, options) {
    super(quill, options);
    
    // Register our custom blots
    Quill.register(ChapterBlot);
    Quill.register(SceneBlot);
    Quill.register(BeatBlot);
    
    // Bind our methods to the quill instance
    this.quill = quill;
    this.options = options || {};
    
    // Initialize structure navigation sidebar if enabled
    if (this.options.structureSidebar) {
      this._initializeStructureSidebar();
    }
    
    // Add keyboard shortcuts if enabled
    if (this.options.keyboardShortcuts) {
      this._addKeyboardShortcuts();
    }
    
    // Initialize the document structure on load if content exists
    this._initializeDocumentStructure();
    
    // Track document structure changes
    this.quill.on('text-change', this._onTextChange.bind(this));
  }
  
  // Public API
  
  /**
   * Adds a new chapter at the current cursor position
   * @param {Object} chapterData - Chapter data to insert
   */
  insertChapter(chapterData = {}) {
    const range = this.quill.getSelection(true);
    this.quill.insertText(range.index, '\n', Quill.sources.USER);
    this.quill.insertEmbed(range.index + 1, 'chapter', chapterData, Quill.sources.USER);
    this.quill.setSelection(range.index + 2, 0, Quill.sources.SILENT);
  }
  
  /**
   * Adds a new scene at the current cursor position
   * @param {Object} sceneData - Scene data to insert
   */
  insertScene(sceneData = {}) {
    const range = this.quill.getSelection(true);
    this.quill.insertText(range.index, '\n', Quill.sources.USER);
    this.quill.insertEmbed(range.index + 1, 'scene', sceneData, Quill.sources.USER);
    this.quill.setSelection(range.index + 2, 0, Quill.sources.SILENT);
  }
  
  /**
   * Adds a new beat at the current cursor position
   * @param {Object} beatData - Beat data to insert
   */
  insertBeat(beatData = {}) {
    const range = this.quill.getSelection(true);
    this.quill.insertText(range.index, '\n', Quill.sources.USER);
    this.quill.insertEmbed(range.index + 1, 'beat', beatData, Quill.sources.USER);
    this.quill.setSelection(range.index + 2, 0, Quill.sources.SILENT);
  }
  
  /**
   * Updates chapter data for the chapter containing the current selection
   * @param {Object} chapterData - New chapter data
   */
  updateCurrentChapter(chapterData = {}) {
    const range = this.quill.getSelection();
    if (!range) return false;
    
    const [chapter, offset] = this._findEnclosingChapter(range.index);
    if (!chapter) return false;
    
    // Get existing data and merge with updates
    const existingData = ChapterBlot.formats(chapter);
    const updatedData = { ...existingData, ...chapterData };
    
    // Replace the chapter with updated data
    const length = chapter.offsetHeight;
    this.quill.formatLine(offset, length, 'chapter', updatedData, Quill.sources.USER);
    
    return true;
  }
  
  /**
   * Updates scene data for the scene containing the current selection
   * @param {Object} sceneData - New scene data
   */
  updateCurrentScene(sceneData = {}) {
    const range = this.quill.getSelection();
    if (!range) return false;
    
    const [scene, offset] = this._findEnclosingScene(range.index);
    if (!scene) return false;
    
    // Get existing data and merge with updates
    const existingData = SceneBlot.formats(scene);
    const updatedData = { ...existingData, ...sceneData };
    
    // Replace the scene with updated data
    const length = scene.offsetHeight;
    this.quill.formatLine(offset, length, 'scene', updatedData, Quill.sources.USER);
    
    return true;
  }
  
  /**
   * Updates beat data for the beat containing the current selection
   * @param {Object} beatData - New beat data
   */
  updateCurrentBeat(beatData = {}) {
    const range = this.quill.getSelection();
    if (!range) return false;
    
    const [beat, offset] = this._findEnclosingBeat(range.index);
    if (!beat) return false;
    
    // Get existing data and merge with updates
    const existingData = BeatBlot.formats(beat);
    const updatedData = { ...existingData, ...beatData };
    
    // Replace the beat with updated data
    const length = beat.offsetHeight;
    this.quill.formatLine(offset, length, 'beat', updatedData, Quill.sources.USER);
    
    return true;
  }
  
  /**
   * Gets the document structure as a hierarchical object
   * @returns {Object} Document structure
   */
  getDocumentStructure() {
    const structure = {
      chapters: []
    };
    
    const editor = this.quill.editor;
    const scroll = editor.scroll;
    
    // Iterate through the document to find chapters, scenes, and beats
    let currentChapter = null;
    let currentScene = null;
    
    scroll.domNode.childNodes.forEach(node => {
      if (node.classList && node.classList.contains('novel-chapter')) {
        // Start a new chapter
        currentChapter = ChapterBlot.formats(node);
        currentChapter.scenes = [];
        structure.chapters.push(currentChapter);
        currentScene = null;
      } 
      else if (node.classList && node.classList.contains('novel-scene')) {
        // Start a new scene
        if (!currentChapter) {
          // Create an untitled chapter if a scene is found without a chapter
          currentChapter = {
            id: crypto.randomUUID(),
            title: 'Untitled Chapter',
            number: structure.chapters.length + 1,
            scenes: []
          };
          structure.chapters.push(currentChapter);
        }
        
        currentScene = SceneBlot.formats(node);
        currentScene.beats = [];
        currentChapter.scenes.push(currentScene);
      }
      else if (node.classList && node.classList.contains('novel-beat')) {
        // Add a beat to the current scene
        if (!currentScene) {
          // Create an untitled scene if a beat is found without a scene
          if (!currentChapter) {
            // Create an untitled chapter if needed
            currentChapter = {
              id: crypto.randomUUID(),
              title: 'Untitled Chapter',
              number: structure.chapters.length + 1,
              scenes: []
            };
            structure.chapters.push(currentChapter);
          }
          
          currentScene = {
            id: crypto.randomUUID(),
            title: '',
            number: currentChapter.scenes.length + 1,
            beats: []
          };
          currentChapter.scenes.push(currentScene);
        }
        
        const beat = BeatBlot.formats(node);
        currentScene.beats.push(beat);
      }
    });
    
    return structure;
  }
  
  // Private methods
  
  /**
   * Initializes the document structure on load
   * @private
   */
  _initializeDocumentStructure() {
    // Implementation will analyze existing content and ensure proper structure
    // This will be developed as part of the document structure serialization work
  }
  
  /**
   * Initializes the structure sidebar if enabled
   * @private
   */
  _initializeStructureSidebar() {
    // Implementation will be added as part of the structure visualization work
  }
  
  /**
   * Adds keyboard shortcuts for common novel actions
   * @private
   */
  _addKeyboardShortcuts() {
    // Add keyboard shortcuts for inserting chapters, scenes, and beats
    const keyboard = this.quill.keyboard;
    
    // Example: Alt+Shift+C to insert a chapter
    keyboard.addBinding({
      key: 'C',
      altKey: true,
      shiftKey: true,
      handler: () => {
        this.insertChapter();
        return false;
      }
    });
    
    // Example: Alt+Shift+S to insert a scene
    keyboard.addBinding({
      key: 'S',
      altKey: true,
      shiftKey: true,
      handler: () => {
        this.insertScene();
        return false;
      }
    });
    
    // Example: Alt+Shift+B to insert a beat
    keyboard.addBinding({
      key: 'B',
      altKey: true,
      shiftKey: true,
      handler: () => {
        this.insertBeat();
        return false;
      }
    });
  }
  
  /**
   * Handles text change events to maintain document structure
   * @private
   */
  _onTextChange(delta, oldContents, source) {
    // Implementation will track changes and update structure as needed
    // This will be developed as part of the editor state persistence work
  }
  
  /**
   * Finds the chapter containing the given index
   * @private
   */
  _findEnclosingChapter(index) {
    const [leaf, offset] = this.quill.getLeaf(index);
    let node = leaf.parent;
    
    // Walk up the DOM until we find a chapter or reach the root
    while (node != null && node.domNode.classList && !node.domNode.classList.contains('novel-chapter')) {
      node = node.parent;
    }
    
    if (node && node.domNode.classList && node.domNode.classList.contains('novel-chapter')) {
      return [node.domNode, this.quill.getIndex(node)];
    }
    
    return [null, -1];
  }
  
  /**
   * Finds the scene containing the given index
   * @private
   */
  _findEnclosingScene(index) {
    const [leaf, offset] = this.quill.getLeaf(index);
    let node = leaf.parent;
    
    // Walk up the DOM until we find a scene or reach the root
    while (node != null && node.domNode.classList && !node.domNode.classList.contains('novel-scene')) {
      node = node.parent;
    }
    
    if (node && node.domNode.classList && node.domNode.classList.contains('novel-scene')) {
      return [node.domNode, this.quill.getIndex(node)];
    }
    
    return [null, -1];
  }
  
  /**
   * Finds the beat containing the given index
   * @private
   */
  _findEnclosingBeat(index) {
    const [leaf, offset] = this.quill.getLeaf(index);
    let node = leaf.parent;
    
    // Walk up the DOM until we find a beat or reach the root
    while (node != null && node.domNode.classList && !node.domNode.classList.contains('novel-beat')) {
      node = node.parent;
    }
    
    if (node && node.domNode.classList && node.domNode.classList.contains('novel-beat')) {
      return [node.domNode, this.quill.getIndex(node)];
    }
    
    return [null, -1];
  }
}

// Register our module with Quill
Quill.register('modules/novelStructure', NovelStructureModule);

export default NovelStructureModule;
