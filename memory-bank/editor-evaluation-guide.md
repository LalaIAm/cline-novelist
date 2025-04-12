# Editor Evaluation Guide

This document provides instructions for using the enhanced editor comparison tools and recording evaluation results for the Novylist project.

## Running the Editor Comparison Test

We've created a dedicated script to make it easy to launch the editor comparison test:

```bash
# From the project root directory
yarn editor-test
```

This will launch the development server and automatically open the editor comparison page in your default browser.

Alternatively, you can:

1. Start the development server with `yarn dev`
2. Navigate to `http://localhost:3000/editor-comparison` in your browser

## Using the Evaluation Tools

### Performance Testing

1. **Loading Large Documents**
   - Click the "Load Long Text for Performance Testing" button to generate 100 paragraphs of text in both editors
   - The render time will be automatically measured and displayed

2. **Measuring Interaction Latency**
   - After loading text, click the "Measure Interaction Latency" button for each editor
   - This simulates a text insertion and measures how quickly the editor responds

3. **Visual Comparison**
   - Use the radio buttons to toggle between showing both editors or focusing on one at a time
   - This can help isolate performance issues when working with large documents

### Recording Evaluation Results

1. Click the "Show Evaluation Report" button to open the structured evaluation form
2. Document your observations in each category:
   - Performance with large documents
   - Ease of customization and extension
   - User experience and interface
   - Compatibility with AI integration requirements
   - Mobile responsiveness

3. Enter a conclusion and select your recommended editor
4. Click "Save Evaluation Report" to persist your findings (saved to localStorage)

## Key Comparison Areas

When evaluating the editors, focus on these critical factors for Novylist:

1. **Performance Considerations**
   - How does each editor handle documents with 50K+ words?
   - Is there noticeable input lag when typing in large documents?
   - Does scrolling remain smooth with large content?

2. **Customization for AI Integration**
   - How easily can we inject AI suggestions into the editor?
   - Can we highlight or annotate specific sections of text?
   - How accessible is the content model for AI analysis?

3. **User Experience Quality**
   - Formatting capabilities and ease of use
   - Copy/paste behavior with formatted text
   - Keyboard shortcuts and accessibility

4. **Mobile Considerations**
   - Touch input responsiveness
   - Mobile rendering and formatting
   - Performance on lower-powered devices

## Decision Timeline

The editor selection decision needs to be finalized by the end of Week 2 before proceeding to the UI/UX design phase. Please complete your evaluation and document your findings in the evaluation report by the end of the week.

## Technical Details

The technical implementation includes:

- `EditorComparisonPage.jsx`: Main comparison test harness
- `DraftEditor.jsx`: Draft.js implementation 
- `QuillEditor.jsx`: Quill.js implementation
- `EditorEvaluationReport.jsx`: Structured evaluation form

Additional documentation can be found in `memory-bank/editor-evaluation.md`.
