/**
 * Prompt Template Service
 * 
 * This service manages prompt templates for various AI features.
 * It provides a standardized way to format prompts for different
 * AI operations while supporting different model types and prompting strategies.
 */
class PromptTemplateService {
  /**
   * Create a new prompt template service
   * 
   * @param {Object} config - Configuration for the service
   * @param {Object} config.templates - Predefined prompt templates
   */
  constructor(config = {}) {
    this.config = {
      templates: {},
      ...config
    };
    
    // Initialize the template registry
    this.templates = { ...this.config.templates };
    
    // Load built-in templates
    this._loadBuiltInTemplates();
  }

  /**
   * Get a prompt template by name
   * 
   * @param {string} templateName - Name of the template to retrieve
   * @returns {Object} The prompt template
   */
  getTemplate(templateName) {
    if (!this.templates[templateName]) {
      throw new Error(`Template not found: ${templateName}`);
    }
    
    return { ...this.templates[templateName] };
  }

  /**
   * Add a new prompt template or update an existing one
   * 
   * @param {string} templateName - Name of the template
   * @param {Object} template - The prompt template object
   */
  addTemplate(templateName, template) {
    // Validate the template
    this._validateTemplate(template);
    
    // Store the template
    this.templates[templateName] = { ...template };
  }

  /**
   * Remove a prompt template
   * 
   * @param {string} templateName - Name of the template to remove
   */
  removeTemplate(templateName) {
    delete this.templates[templateName];
  }

  /**
   * Get all available template names
   * 
   * @returns {Array<string>} Array of template names
   */
  getTemplateNames() {
    return Object.keys(this.templates);
  }

  /**
   * Get templates by category
   * 
   * @param {string} category - Category to filter by
   * @returns {Object} Object of template names and templates
   */
  getTemplatesByCategory(category) {
    const result = {};
    
    for (const [name, template] of Object.entries(this.templates)) {
      if (template.category === category) {
        result[name] = { ...template };
      }
    }
    
    return result;
  }

  /**
   * Create an empty template object
   * 
   * @param {string} type - Template type ('text' or 'chat')
   * @returns {Object} Empty template object
   */
  createEmptyTemplate(type = 'text') {
    if (type === 'text') {
      return {
        type: 'text',
        name: '',
        description: '',
        category: '',
        template: '',
        parameters: []
      };
    } else if (type === 'chat') {
      return {
        type: 'chat',
        name: '',
        description: '',
        category: '',
        messages: [
          { role: 'system', content: '' }
        ],
        parameters: []
      };
    } else {
      throw new Error(`Invalid template type: ${type}`);
    }
  }

  /**
   * Validate a prompt template
   * 
   * @param {Object} template - The template to validate
   * @private
   */
  _validateTemplate(template) {
    // Check that template has required properties
    if (!template.type) {
      throw new Error('Template must have a type');
    }
    
    if (template.type === 'text' && !template.template) {
      throw new Error('Text template must have a template string');
    }
    
    if (template.type === 'chat' && (!template.messages || !Array.isArray(template.messages) || template.messages.length === 0)) {
      throw new Error('Chat template must have an array of messages');
    }
    
    // For chat templates, validate messages
    if (template.type === 'chat') {
      template.messages.forEach((message, index) => {
        if (!message.role) {
          throw new Error(`Message at index ${index} must have a role`);
        }
        
        if (!message.content && message.content !== '') {
          throw new Error(`Message at index ${index} must have a content property`);
        }
      });
    }
    
    // Validate parameters if present
    if (template.parameters && !Array.isArray(template.parameters)) {
      throw new Error('Parameters must be an array');
    }
  }

  /**
   * Load built-in templates
   * @private
   */
  _loadBuiltInTemplates() {
    // Writing Continuation Template (Text)
    this.addTemplate('writing-continuation-text', {
      type: 'text',
      name: 'Writing Continuation',
      description: 'Continues the current writing in the same style',
      category: 'writing',
      template: `You are an expert writing assistant with expertise in creative writing and storytelling.
        
Your task is to continue the writing below, matching the style, tone, and narrative voice of the existing text. Pay close attention to the context and maintain consistency with characters, settings, and plot elements.

{{context}}

Continue the writing from here, maintaining the same style and narrative flow:`,
      parameters: [
        { name: 'context', description: 'The current writing context', required: true }
      ]
    });

    // Writing Continuation Template (Chat)
    this.addTemplate('writing-continuation-chat', {
      type: 'chat',
      name: 'Writing Continuation',
      description: 'Continues the current writing in the same style',
      category: 'writing',
      messages: [
        {
          role: 'system',
          content: `You are an expert writing assistant with expertise in creative writing and storytelling. 
          
Your task is to continue the writing provided by the user, matching the style, tone, and narrative voice of the existing text. Pay close attention to the context and maintain consistency with characters, settings, and plot elements.`
        },
        {
          role: 'user',
          content: `Please continue my writing from where I left off. Here's the context and my current text:
          
{{context}}

Continue from the end of the current content, maintaining the same style and narrative flow.`
        }
      ],
      parameters: [
        { name: 'context', description: 'The current writing context', required: true }
      ]
    });

    // Character Development Template
    this.addTemplate('character-development', {
      type: 'chat',
      name: 'Character Development',
      description: 'Provides suggestions for character development',
      category: 'characters',
      messages: [
        {
          role: 'system',
          content: `You are an expert writing assistant specializing in character development. 
          
Your task is to analyze the current context and provide insightful suggestions for developing the characters in the narrative. Focus on depth, believability, and emotional resonance.`
        },
        {
          role: 'user',
          content: `Please analyze the characters in my writing and provide suggestions for their development. Here's the context:
          
{{context}}

Please suggest ways to develop these characters further, including:
1. Character motivations and inner conflicts
2. Character arc possibilities
3. Relationship dynamics
4. Background elements that could be revealed
5. Unique traits or quirks to make the character more memorable`
        }
      ],
      parameters: [
        { name: 'context', description: 'The current writing context', required: true }
      ]
    });

    // Plot Development Template
    this.addTemplate('plot-development', {
      type: 'chat',
      name: 'Plot Development',
      description: 'Provides suggestions for plot development',
      category: 'plotting',
      messages: [
        {
          role: 'system',
          content: `You are an expert writing assistant specializing in plot and narrative structure. 
          
Your task is to analyze the current context and provide insightful suggestions for developing the plot. Focus on narrative arc, tension, pacing, and coherence.`
        },
        {
          role: 'user',
          content: `Please analyze the plot in my writing and provide suggestions for development. Here's the context:
          
{{context}}

Please suggest:
1. Potential plot developments or complications
2. Ways to raise stakes or increase tension
3. Foreshadowing opportunities
4. Plot holes or inconsistencies to address
5. Structural improvements for pacing and flow`
        }
      ],
      parameters: [
        { name: 'context', description: 'The current writing context', required: true }
      ]
    });

    // Dialogue Enhancement Template
    this.addTemplate('dialogue-enhancement', {
      type: 'chat',
      name: 'Dialogue Enhancement',
      description: 'Provides suggestions for improving dialogue',
      category: 'writing',
      messages: [
        {
          role: 'system',
          content: `You are an expert writing assistant specializing in dialogue writing and revision. 
          
Your task is to analyze the current dialogue in the context and provide suggestions for improvement. Focus on authenticity, character voice, subtext, and conversational flow.`
        },
        {
          role: 'user',
          content: `Please help me improve the dialogue in my writing. Here's the context:
          
{{context}}

Please provide:
1. Suggested revisions to make dialogue more natural and character-specific
2. Ways to add subtext or deeper meaning
3. Ideas for dialogue tags and action beats
4. Balance between dialogue and narrative
5. Examples of voice-distinct dialogue for key characters`
        }
      ],
      parameters: [
        { name: 'context', description: 'The current writing context', required: true }
      ]
    });

    // Scene Description Template
    this.addTemplate('scene-description', {
      type: 'chat',
      name: 'Scene Description',
      description: 'Provides suggestions for scene setting and description',
      category: 'writing',
      messages: [
        {
          role: 'system',
          content: `You are an expert writing assistant specializing in scene description and setting. 
          
Your task is to help improve scene descriptions with vivid, evocative details that engage all senses while maintaining the appropriate tone and style for the narrative.`
        },
        {
          role: 'user',
          content: `Please help me enhance my scene descriptions. Here's the context:
          
{{context}}

Please provide:
1. Suggested sensory details (sight, sound, smell, taste, touch)
2. Ways to make the setting more vivid and memorable
3. Techniques to establish mood and atmosphere
4. Balance between description and action/dialogue
5. Examples that maintain the current writing style`
        }
      ],
      parameters: [
        { name: 'context', description: 'The current writing context', required: true }
      ]
    });

    // Editing Suggestions Template
    this.addTemplate('editing-suggestions', {
      type: 'chat',
      name: 'Editing Suggestions',
      description: 'Provides general editing suggestions for the current text',
      category: 'editing',
      messages: [
        {
          role: 'system',
          content: `You are an expert editor with a keen eye for improving prose while respecting the author's voice and style. 
          
Your task is to provide constructive editing suggestions that enhance clarity, flow, and impact without fundamentally changing the author's unique voice.`
        },
        {
          role: 'user',
          content: `Please provide editing suggestions for my writing. Here's the text:
          
{{context}}

Please provide:
1. Suggestions for improving clarity and readability
2. Ideas for tightening prose and eliminating redundancies
3. Ways to enhance rhythm and flow
4. Options for stronger word choices where appropriate
5. Identification of any grammatical or consistency issues`
        }
      ],
      parameters: [
        { name: 'context', description: 'The current writing context', required: true }
      ]
    });
  }
}

export default PromptTemplateService;
