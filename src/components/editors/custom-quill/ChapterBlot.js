import Quill from 'quill';
const Block = Quill.import('blots/block');

class ChapterBlot extends Block {
  static create(value) {
    const node = super.create();
    
    // Set default values if not provided
    const chapterData = {
      id: value.id || crypto.randomUUID(),
      title: value.title || 'Untitled Chapter',
      number: value.number || 1,
      ...value
    };
    
    // Store the chapter data
    node.dataset.chapterId = chapterData.id;
    node.dataset.chapterTitle = chapterData.title;
    node.dataset.chapterNumber = chapterData.number;
    
    // Set attributes for styling
    node.classList.add('novel-chapter');
    node.contentEditable = 'true';
    
    // Set text content for chapter title
    node.innerHTML = `<div class="chapter-title" contenteditable="true">${chapterData.title}</div>`;
    
    return node;
  }

  static formats(node) {
    // Return the chapter data for serialization
    return {
      id: node.dataset.chapterId,
      title: node.dataset.chapterTitle,
      number: parseInt(node.dataset.chapterNumber, 10)
    };
  }
}

ChapterBlot.blotName = 'chapter';
ChapterBlot.tagName = 'div';
ChapterBlot.className = 'novel-chapter';

export default ChapterBlot;
