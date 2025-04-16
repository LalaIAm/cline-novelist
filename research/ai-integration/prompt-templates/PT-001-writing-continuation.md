# Writing Continuation Prompt Template

## Metadata
- **Template ID**: PT-001
- **Name**: Writing Continuation Assistant
- **Category**: Writing Assistance
- **Version**: 1.0
- **Created**: 4/13/2025
- **Updated**: 4/13/2025
- **Target Model**: GPT-4

## Purpose
This prompt template helps authors continue their writing by generating contextually appropriate text suggestions that match their style, tone, and narrative direction. It's designed to overcome writer's block and maintain creative flow.

## Template Structure

```
You are an AI writing assistant for a novelist working on a {{genre}} novel. Your task is to help continue the narrative based on the provided context.

## Current Context
The following is the recent part of the novel the author is working on:

---
{{recentText}}
---

## Background Info
Genre: {{genre}}
Writing Style: {{writingStyle}}
POV: {{pointOfView}}
Setting: {{setting}}
Current narrative focus: {{narrativeFocus}}

## Important Characters
{{characterInfo}}

## Recent Plot Points
{{recentPlotPoints}}

## Writing Continuation Task
Continue the narrative from where it left off, maintaining the established style, tone, and character voices. The continuation should feel natural and seamless, as if written by the same author. Keep the same point of view and tense.

Focus on developing the current scene with attention to {{narrativeFocus}}. Write approximately {{wordCount}} words that would serve as a natural continuation.

Don't summarize or explain what you're doing. Just write the continuation text as it would appear in the novel.
```

## Variables
- `{{genre}}`: The genre of the novel (e.g., "fantasy", "mystery", "romance", "science fiction")
- `{{recentText}}`: The last few paragraphs of the author's writing (200-500 words)
- `{{writingStyle}}`: Description of the author's writing style (e.g., "descriptive and lyrical", "terse and direct", "dialogue-heavy")
- `{{pointOfView}}`: The narrative point of view (e.g., "first person", "third person limited", "third person omniscient")
- `{{setting}}`: Brief description of the current setting
- `{{narrativeFocus}}`: What the current scene is focusing on (e.g., "character development", "action sequence", "emotional revelation", "world building")
- `{{characterInfo}}`: Brief information about relevant characters in the scene
- `{{recentPlotPoints}}`: Brief summary of recent plot developments relevant to this scene
- `{{wordCount}}`: Desired word count for the continuation (typically 100-300)

## Example Instantiation

### Input Variables
```json
{
  "genre": "fantasy",
  "recentText": "Elara's fingers trembled as she traced the ancient runes carved into the stone door. The symbols glowed faintly at her touch, pulsing with an otherworldly light that cast long shadows across the chamber. Behind her, Marcus shifted uncomfortably, the hilt of his sword clicking against the stone floor.\n\n'Are you sure about this?' he whispered, his voice barely audible over the distant drip of water. 'The council specifically warned against opening sealed doors in the catacombs.'\n\nShe didn't turn to face him, her eyes fixed on the intricate pattern that was slowly revealing itself as her fingers moved. 'The answers we seek are behind this door, Marcus. I can feel it.'",
  "writingStyle": "descriptive and atmospheric with moments of sharp dialogue",
  "pointOfView": "third person limited",
  "setting": "Ancient underground catacombs beneath a magical academy",
  "narrativeFocus": "tension and discovery",
  "characterInfo": "Elara: A determined scholar of ancient magic, intuitive and sometimes reckless. Marcus: A cautious guard assigned to protect Elara, loyal but constantly worried about her pushing boundaries.",
  "recentPlotPoints": "The pair are searching for a lost artifact that could prevent a magical catastrophe threatening the academy. They've discovered that previous explorers never returned from these catacombs.",
  "wordCount": "200"
}
```

### Resulting Prompt
```
You are an AI writing assistant for a novelist working on a fantasy novel. Your task is to help continue the narrative based on the provided context.

## Current Context
The following is the recent part of the novel the author is working on:

---
Elara's fingers trembled as she traced the ancient runes carved into the stone door. The symbols glowed faintly at her touch, pulsing with an otherworldly light that cast long shadows across the chamber. Behind her, Marcus shifted uncomfortably, the hilt of his sword clicking against the stone floor.

'Are you sure about this?' he whispered, his voice barely audible over the distant drip of water. 'The council specifically warned against opening sealed doors in the catacombs.'

She didn't turn to face him, her eyes fixed on the intricate pattern that was slowly revealing itself as her fingers moved. 'The answers we seek are behind this door, Marcus. I can feel it.'
---

## Background Info
Genre: fantasy
Writing Style: descriptive and atmospheric with moments of sharp dialogue
POV: third person limited
Setting: Ancient underground catacombs beneath a magical academy
Current narrative focus: tension and discovery

## Important Characters
Elara: A determined scholar of ancient magic, intuitive and sometimes reckless. Marcus: A cautious guard assigned to protect Elara, loyal but constantly worried about her pushing boundaries.

## Recent Plot Points
The pair are searching for a lost artifact that could prevent a magical catastrophe threatening the academy. They've discovered that previous explorers never returned from these catacombs.

## Writing Continuation Task
Continue the narrative from where it left off, maintaining the established style, tone, and character voices. The continuation should feel natural and seamless, as if written by the same author. Keep the same point of view and tense.

Focus on developing the current scene with attention to tension and discovery. Write approximately 200 words that would serve as a natural continuation.

Don't summarize or explain what you're doing. Just write the continuation text as it would appear in the novel.
```

## Expected Output Format
A natural continuation of the narrative that maintains the style, voice, and flow of the original text.

```
The final rune pulsed brighter than the others, and a low rumble shook dust from the ceiling. Marcus drew his sword in one fluid motion, its enchanted blade casting a pale blue glow that mingled with the amber light of the runes.

"Elara," he hissed, more urgently now. "Step back."

But Elara remained transfixed as the ancient stone began to shift. Hairline fractures appeared along invisible seams, and the rumbling deepened to a guttural groan that seemed to come from the earth itself. The air grew heavy with the scent of something ancient – like crumbling parchment and oxidized metal.

"It's opening," she breathed, a mixture of triumph and apprehension in her voice. She finally stepped back, her shoulders brushing against Marcus's chest as the massive door began to recede into the wall.

Beyond lay darkness more complete than any they had encountered in the catacombs – a darkness that seemed almost solid, untouched by their torchlight. Elara reached into her satchel and withdrew a small crystal, which she whispered to in an ancient tongue. It flared to life, illuminating what lay beyond the threshold.

Marcus's sharp intake of breath mirrored her own shock. The chamber before them was vast, its ceiling lost to shadow, and at its center stood a pedestal untouched by the centuries of dust that blanketed everything else.
```

## Performance Metrics
- **Average Tokens**: Input: ~600 / Output: ~200
- **Average Latency**: ~2000ms
- **Quality Score**: 4.7/5 (based on initial testing)
- **Estimated Cost**: ~$0.03 per request with GPT-4

## Usage Guidelines
- Use when the author has written at least a paragraph or two and wants assistance continuing their draft
- Most effective when provided with sufficient context about characters and setting
- Can be adjusted for different word counts, but performs best with 150-300 word continuations
- For longer continuations, consider breaking into multiple sequential requests

## Alternative Approaches
- **Scene Planning Template**: If the author needs more structured guidance on where the scene should go
- **Character Voice Template**: If the focus is primarily on maintaining specific character dialogue patterns
- **Description Enhancement Template**: If the goal is to elaborate on setting or sensory details rather than advancing the action

## Version History
- **1.0**: Initial version - 4/13/2025
