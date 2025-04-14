# Prompt Template: Context Handling for Long Novels

## Template ID: PT-002
**Category**: Context Management  
**Created**: 4/13/2025  
**Status**: Draft  
**Use Case**: Managing context for long-form novel content

## Description
This template provides a structured approach for creating prompts that handle long-form novel content effectively. It addresses the challenge of maintaining narrative coherence when content exceeds model context limits by strategically combining immediate context, summaries, and metadata.

## Template Structure

```
# Novel Writing Assistant - Context-Aware Mode

## Current Writing Context
{immediate_context}

## Novel Structure Context
{novel_structure}

## Character Information
{character_info}

## Plot Elements
{plot_elements}

## Thematic Elements
{thematic_elements}

## Task-Specific Instructions
{task_instructions}

{specific_task_request}
```

## Variable Definitions

### Required Variables

- **immediate_context**: The text surrounding the current writing position (typically the most recent 1-2 paragraphs or 500-1000 tokens)
- **task_instructions**: The specific instructions for the AI assistant based on the task type (continuation, editing, etc.)
- **specific_task_request**: The detailed request describing what the user wants to accomplish

### Optional Variables (Include based on token availability and task relevance)

- **novel_structure**: Brief outline of the novel's structure (chapters, scenes, current position in the narrative)
- **character_info**: Relevant character descriptions, focusing on characters active in the current context
- **plot_elements**: Key plot points relevant to the current scene or task
- **thematic_elements**: Themes, motifs, or stylistic elements to maintain consistency

## Implementation Guidelines

### Token Management

1. Prioritize tokens in this order:
   - Immediate context
   - Task-specific instructions
   - Character information relevant to current scene
   - Key plot points relevant to current scene
   - Novel structure summary
   - Thematic elements

2. For long novels, maintain:
   - Chapter-level summaries
   - Character sheets with key traits and development arcs
   - Plot outline with major events
   - Setting descriptions

### Context Selection Strategy

For different task types, adjust the balance of context elements:

1. **Continuation Tasks**:
   - Emphasize immediate context (last few paragraphs)
   - Include relevant character information
   - Reference recent plot developments
   - Mention chapter position in overall structure

2. **Revision/Editing Tasks**:
   - Include both the text to revise and surrounding paragraphs
   - Add specific style guidelines or thematic elements
   - Reference relevant plot points for consistency

3. **Planning/Structuring Tasks**:
   - Emphasize novel structure and plot elements
   - Include minimal immediate context
   - Focus on character arcs and thematic development

4. **Character Development Tasks**:
   - Prioritize character information
   - Include character relationships
   - Reference key scenes featuring the character

## Example Implementation

```
# Novel Writing Assistant - Context-Aware Mode

## Current Writing Context
The rain pounded against the windows as Maria stared at the letter in her hands. Three years since she'd seen his handwriting, yet she recognized it instantly. The postmark was smudged, but the return address was clear enough - he was back in town. She thought of the night he left, how the same rain had soaked through her clothes as she stood in the driveway, watching his taillights disappear into the darkness.

"You shouldn't open it," said Rachel, placing a mug of tea on the table beside her. Her sister's concern was evident in the furrow of her brow.

## Novel Structure Context
Current position: Chapter A5, Scene 2
Previous scene summary: Maria discovers her sister Rachel has returned to their hometown after her divorce. They reconnect and agree to live together temporarily.
Next scene plans: Maria must decide whether to attend the town festival where she might encounter her ex.

## Character Information
Maria: 35, elementary school teacher, guarded and practical since being abandoned by her fiancé James. Has avoided romantic relationships since.
Rachel: 32, Maria's younger sister, recently divorced, impulsive but insightful. Has always been protective of Maria.
James (mentioned): Maria's ex-fiancé who left town suddenly three years ago, breaking their engagement. His return is a source of anxiety for Maria.

## Plot Elements
- Maria's careful, structured life is disrupted by her sister's return
- The unexpected letter from James creates a conflict for Maria
- Maria has been invited to chair the town festival committee, a position James used to hold
- There are hints that James left due to undisclosed circumstances rather than simply abandoning Maria

## Thematic Elements
- Reconciliation vs. self-protection
- Small town secrets and how they affect relationships
- The contrast between moving forward and holding onto the past
- Weather as a reflection of emotional states (rain, storms for turmoil)

## Task-Specific Instructions
Continue the narrative focusing on Maria's internal conflict about the letter. Maintain the established third-person limited perspective from Maria's viewpoint. Keep the same contemplative but tense tone. Use sensory details, especially related to the rain and storm, to enhance the mood.

Write approximately 250 words that would continue this scene, focusing on Maria's decision about whether to open the letter.
```

## Variants

### Context-Efficient Variant (For Token Constraints)

When token limitations are strict, use this condensed format:

```
# Novel Assistant

Context: {condensed_immediate_context}

Key Information:
- Character: {mini_character_info}
- Plot: {mini_plot_info}
- Chapter Position: {position_info}

Task: {condensed_task}
```

### Detail-Rich Variant (For Complex Narratives)

For complex narratives with multiple storylines, use this expanded format:

```
# Advanced Novel Context Manager

## Current Scene
{immediate_context}

## Narrative Threads
Thread A: {thread_a_summary}
Thread B: {thread_b_summary}

## Character Dynamics
{detailed_character_relationships}

## Timeline Position
{timeline_context}

## Setting Details
{setting_details}

## Stylistic Guidelines
{style_guide}

## Task Details
{detailed_task_instructions}
```

## Effectiveness Measures

This prompt template should be evaluated on:

1. **Narrative Coherence**: Does the AI maintain consistent characterization, plot elements, and themes?
2. **Context Utilization**: Does the AI effectively use the provided context in its responses?
3. **Token Efficiency**: Is the context provided in the most token-efficient way for the task?
4. **Adaptability**: How well does the template adapt to different novel genres and writing styles?

## Notes for Improvement

- Consider developing a dynamic system that adjusts the amount of context based on the specific task
- Experiment with different ratios of immediate context vs. summary information
- Test the impact of including or excluding specific elements based on the task
