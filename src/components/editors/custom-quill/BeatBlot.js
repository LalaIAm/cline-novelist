import Quill from 'quill';
const Block = Quill.import('blots/block');

class BeatBlot extends Block {
  static create(value) {
    const node = super.create();
    
    // Set default values if not provided
    const beatData = {
      id: value.id || crypto.randomUUID(),
      type: value.type || 'narrative', // narrative, dialogue, action, description, etc.
      characters: value.characters || [],
      emotion: value.emotion || null,
      importance: value.importance || 'normal', // low, normal, high
      aiAssistKey: value.aiAssistKey || null, // For AI-targeted assistance
      ...value
    };
    
    // Store the beat data as dataset attributes
    node.dataset.beatId = beatData.id;
    node.dataset.beatType = beatData.type;
    node.dataset.beatCharacters = JSON.stringify(beatData.characters);
    node.dataset.beatEmotion = beatData.emotion || '';
    node.dataset.beatImportance = beatData.importance;
    node.dataset.beatAiAssistKey = beatData.aiAssistKey || '';
    
    // Add classes for styling and identification
    node.classList.add('novel-beat');
    node.classList.add(`beat-type-${beatData.type}`);
    node.classList.add(`beat-importance-${beatData.importance}`);
    
    // Add indicators for certain beat types
    if (beatData.type === 'dialogue') {
      node.classList.add('dialogue-beat');
    } else if (beatData.type === 'action') {
      node.classList.add('action-beat');
    } else if (beatData.type === 'description') {
      node.classList.add('description-beat');
    }
    
    // Add importance indicator if not normal
    if (beatData.importance !== 'normal') {
      const importanceNode = document.createElement('span');
      importanceNode.className = `beat-importance-indicator ${beatData.importance}`;
      importanceNode.setAttribute('aria-hidden', 'true');
      node.appendChild(importanceNode);
    }
    
    // Add emotion marker if present
    if (beatData.emotion) {
      node.setAttribute('aria-label', `Emotional tone: ${beatData.emotion}`);
    }
    
    return node;
  }

  static formats(node) {
    // Return the beat data for serialization
    let characters = [];
    try {
      characters = JSON.parse(node.dataset.beatCharacters);
    } catch (e) {
      console.error('Error parsing beat characters:', e);
    }
    
    return {
      id: node.dataset.beatId,
      type: node.dataset.beatType,
      characters: characters,
      emotion: node.dataset.beatEmotion || null,
      importance: node.dataset.beatImportance,
      aiAssistKey: node.dataset.beatAiAssistKey || null
    };
  }
}

BeatBlot.blotName = 'beat';
BeatBlot.tagName = 'div';
BeatBlot.className = 'novel-beat';

export default BeatBlot;
