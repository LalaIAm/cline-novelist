import React, { useState } from 'react';

const WritingStyleStepWireframe = ({ formData, onInputChange, onNext, onPrevious }) => {
  const [errors, setErrors] = useState({});
  
  // Writing style options
  const styleOptions = [
    { value: 'descriptive', label: 'Descriptive', description: 'Rich in details and sensory information' },
    { value: 'concise', label: 'Concise', description: 'Clear and to the point' },
    { value: 'dialogue-heavy', label: 'Dialogue-Heavy', description: 'Character-driven with extensive dialogue' },
    { value: 'poetic', label: 'Poetic', description: 'Lyrical with metaphors and imagery' },
    { value: 'analytical', label: 'Analytical', description: 'Logical and structured' },
  ];
  
  // AI assistance level details
  const assistanceLevels = [
    { 
      value: 'Minimal', 
      title: 'Minimal',
      description: 'Only provides suggestions when explicitly requested',
      features: [
        'Manual AI assistance only',
        'No automated suggestions',
        'Focus on uninterrupted writing'
      ]
    },
    { 
      value: 'Moderate', 
      title: 'Moderate',
      description: 'Offers suggestions during natural pauses in writing',
      features: [
        'Smart pause detection',
        'Balanced AI interaction',
        'Plot and character consistency checks'
      ]
    },
    { 
      value: 'Active', 
      title: 'Active',
      description: 'Proactively suggests improvements and ideas',
      features: [
        'Regular writing prompts',
        'Style and grammar suggestions',
        'Plot development assistance',
        'Character depth recommendations'
      ]
    }
  ];
  
  // Focus area options
  const focusAreaOptions = [
    { value: 'plot-development', label: 'Plot Development' },
    { value: 'character-depth', label: 'Character Development' },
    { value: 'dialogue', label: 'Dialogue' },
    { value: 'descriptions', label: 'Descriptions & Setting' },
    { value: 'pacing', label: 'Pacing' },
    { value: 'style-consistency', label: 'Style Consistency' },
  ];

  const handleStyleSelection = (styleValue) => {
    onInputChange('writingStyle', styleValue);
    
    // Clear error if a style is selected
    if (errors.writingStyle) {
      setErrors({
        ...errors,
        writingStyle: null
      });
    }
  };

  const handleAssistanceLevelChange = (level) => {
    onInputChange('assistanceLevel', level);
    
    // Clear error if an assistance level is selected
    if (errors.assistanceLevel) {
      setErrors({
        ...errors,
        assistanceLevel: null
      });
    }
  };

  const handleFocusAreaToggle = (area) => {
    const currentFocusAreas = [...formData.focusAreas];
    
    if (currentFocusAreas.includes(area)) {
      // Remove area if already selected
      const updatedAreas = currentFocusAreas.filter(a => a !== area);
      onInputChange('focusAreas', updatedAreas);
    } else {
      // Add area if not already selected (limit to 3)
      if (currentFocusAreas.length < 3) {
        onInputChange('focusAreas', [...currentFocusAreas, area]);
      }
    }
    
    // Clear error if at least one focus area is selected
    if (errors.focusAreas && currentFocusAreas.length > 0) {
      setErrors({
        ...errors,
        focusAreas: null
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    
    // Validate writing style
    if (!formData.writingStyle) {
      newErrors.writingStyle = 'Please select a writing style preference';
    }
    
    // Focus areas validation (optional in this implementation)
    // if (!formData.focusAreas || formData.focusAreas.length === 0) {
    //   newErrors.focusAreas = 'Please select at least one focus area';
    // }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      onNext();
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Writing Style Preferences</h2>
      <p className="text-center text-gray-600 mb-8">
        Customize how AI assists you based on your writing style
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Writing style selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What writing style do you prefer?
          </label>
          {errors.writingStyle && (
            <p className="mt-1 mb-2 text-sm text-red-600">{errors.writingStyle}</p>
          )}
          <div className="space-y-2">
            {styleOptions.map(style => (
              <div 
                key={style.value}
                className={`
                  border rounded-lg p-3 cursor-pointer transition
                  ${formData.writingStyle === style.value 
                    ? 'border-primary-500 bg-primary-50' 
                    : 'border-gray-300 hover:border-gray-400'}
                `}
                onClick={() => handleStyleSelection(style.value)}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{style.label}</span>
                  {formData.writingStyle === style.value && (
                    <span className="text-primary-600">✓</span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">{style.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* AI Assistance Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Choose your AI assistance level
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {assistanceLevels.map(level => (
              <div 
                key={level.value}
                className={`
                  border rounded-lg p-4 cursor-pointer transition
                  ${formData.assistanceLevel === level.value 
                    ? 'border-primary-500 bg-primary-50' 
                    : 'border-gray-300 hover:border-gray-400'}
                `}
                onClick={() => handleAssistanceLevelChange(level.value)}
              >
                <div className="font-medium mb-2">{level.title}</div>
                <p className="text-sm text-gray-600 mb-3">{level.description}</p>
                <ul className="text-xs text-gray-600 space-y-1">
                  {level.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-primary-600 mr-1">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        
        {/* Focus Areas */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select your writing focus areas (Choose up to 3)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {focusAreaOptions.map(area => (
              <div 
                key={area.value}
                className={`
                  border rounded-lg p-3 text-center cursor-pointer transition
                  ${formData.focusAreas.includes(area.value) 
                    ? 'border-primary-500 bg-primary-50 text-primary-700' 
                    : 'border-gray-300 hover:border-gray-400 text-gray-700'}
                `}
                onClick={() => handleFocusAreaToggle(area.value)}
              >
                {area.label}
              </div>
            ))}
          </div>
          <p className="mt-2 text-xs text-gray-500">
            {formData.focusAreas.length}/3 focus areas selected
          </p>
        </div>
        
        {/* Additional Preferences Toggle */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-center cursor-pointer">
            <span className="font-medium text-gray-700">Advanced AI Settings</span>
            <button 
              type="button"
              className="text-primary-600 hover:text-primary-800 text-sm font-medium"
            >
              Customize
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Fine-tune AI behavior, tone preferences, and suggestion frequency
          </p>
        </div>
        
        {/* Navigation buttons */}
        <div className="flex justify-between pt-6">
          <button
            type="button"
            onClick={onPrevious}
            className="btn-secondary"
          >
            Back
          </button>
          <button
            type="submit"
            className="btn-primary"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );
};

export default WritingStyleStepWireframe;
