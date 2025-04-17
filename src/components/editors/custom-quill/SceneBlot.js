import Quill from 'quill';
const Block = Quill.import('blots/block');

class SceneBlot extends Block {
  static create(value) {
    const node = super.create();
    
    // Set default values if not provided
    const sceneData = {
      id: value.id || crypto.randomUUID(),
      title: value.title || '',
      number: value.number || 1,
      pov: value.pov || null,
      location: value.location || null,
      timeMarker: value.timeMarker || null,
      ...value
    };
    
    // Store the scene data as dataset attributes
    node.dataset.sceneId = sceneData.id;
    node.dataset.sceneTitle = sceneData.title;
    node.dataset.sceneNumber = sceneData.number;
    node.dataset.scenePov = sceneData.pov || '';
    node.dataset.sceneLocation = sceneData.location || '';
    node.dataset.sceneTimeMarker = sceneData.timeMarker || '';
    
    // Set attributes for styling
    node.classList.add('novel-scene');
    
    // Add scene title if present
    if (sceneData.title) {
      const titleNode = document.createElement('div');
      titleNode.className = 'scene-title';
      titleNode.contentEditable = 'true';
      titleNode.textContent = sceneData.title;
      node.appendChild(titleNode);
    }
    
    // Add scene metadata (optional)
    if (sceneData.pov || sceneData.location || sceneData.timeMarker) {
      const metaNode = document.createElement('div');
      metaNode.className = 'scene-metadata';
      
      let metaText = [];
      if (sceneData.pov) metaText.push(`POV: ${sceneData.pov}`);
      if (sceneData.location) metaText.push(`Location: ${sceneData.location}`);
      if (sceneData.timeMarker) metaText.push(`Time: ${sceneData.timeMarker}`);
      
      metaNode.textContent = metaText.join(' • ');
      node.appendChild(metaNode);
    }
    
    return node;
  }

  static formats(node) {
    // Return the scene data for serialization
    return {
      id: node.dataset.sceneId,
      title: node.dataset.sceneTitle,
      number: parseInt(node.dataset.sceneNumber, 10),
      pov: node.dataset.scenePov || null,
      location: node.dataset.sceneLocation || null,
      timeMarker: node.dataset.sceneTimeMarker || null
    };
  }
}

SceneBlot.blotName = 'scene';
SceneBlot.tagName = 'div';
SceneBlot.className = 'novel-scene';

export default SceneBlot;
