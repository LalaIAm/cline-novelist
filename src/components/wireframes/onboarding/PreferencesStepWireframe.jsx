import React, { useState } from 'react';

const PreferencesStepWireframe = ({ formData, onInputChange, onNext, onPrevious }) => {
  const [errors, setErrors] = useState({});
  
  // Available genre options
  const genreOptions = [
    'Fantasy', 'Science Fiction', 'Mystery', 'Thriller', 'Romance', 
    'Historical Fiction', 'Literary Fiction', 'Horror', 'Young Adult', 
    'Children\'s', 'Biography', 'Memoir', 'Self-help', 'Non-fiction'
  ];
  
  // Writing frequency options
  const frequencyOptions = [
    { value: 'daily', label: 'Daily' },
    { value: 'several-times-week', label: 'Several times a week' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'occasionally', label: 'Occasionally' },
  ];
  
  // Writing goals options
  const goalOptions = [
    { value: 'complete-novel', label: 'Complete a novel' },
    { value: 'improve-skills', label: 'Improve writing skills' },
    { value: 'develop-habit', label: 'Develop a writing habit' },
    { value: 'publish-work', label: 'Publish my work' },
    { value: 'explore-ideas', label: 'Explore creative ideas' },
  ];

  const handleGenreToggle = (genre) => {
    const currentGenres = [...formData.genres];
    
    if (currentGenres.includes(genre)) {
      // Remove genre if already selected
      const updatedGenres = currentGenres.filter(g => g !== genre);
      onInputChange('genres', updatedGenres);
    } else {
      // Add genre if not already selected (limit to 3)
      if (currentGenres.length < 3) {
        onInputChange('genres', [...currentGenres, genre]);
      }
    }
    
    // Clear error if at least one genre is selected
    if (errors.genres && currentGenres.length > 0) {
      setErrors({
        ...errors,
        genres: null
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    onInputChange(name, value);
    
    // Clear error for this field when user makes a selection
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    
    // Validate genres (at least one must be selected)
    if (!formData.genres || formData.genres.length === 0) {
      newErrors.genres = 'Please select at least one genre';
    }
    
    // Validate writing frequency
    if (!formData.writingFrequency) {
      newErrors.writingFrequency = 'Please select your writing frequency';
    }
    
    // Validate writing goals
    if (!formData.writingGoals) {
      newErrors.writingGoals = 'Please select your writing goal';
    }
    
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
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Writing Preferences</h2>
      <p className="text-center text-gray-600 mb-8">
        Tell us about your interests to personalize your experience
      </p>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-8">
          {/* Genre selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What genres are you interested in? (Choose up to 3)
            </label>
            {errors.genres && (
              <p className="mt-1 mb-2 text-sm text-red-600">{errors.genres}</p>
            )}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {genreOptions.map(genre => (
                <div 
                  key={genre}
                  className={`
                    border rounded-lg p-3 text-center cursor-pointer transition
                    ${formData.genres.includes(genre) 
                      ? 'border-primary-500 bg-primary-50 text-primary-700' 
                      : 'border-gray-300 hover:border-gray-400 text-gray-700'}
                  `}
                  onClick={() => handleGenreToggle(genre)}
                >
                  {genre}
                </div>
              ))}
            </div>
            <p className="mt-2 text-xs text-gray-500">
              {formData.genres.length}/3 genres selected
            </p>
          </div>
          
          {/* Writing frequency */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              How often do you plan to write?
            </label>
            <div className="mt-1 space-y-2">
              {frequencyOptions.map(option => (
                <div 
                  key={option.value}
                  className="relative flex items-start"
                >
                  <div className="flex items-center h-5">
                    <input
                      id={`frequency-${option.value}`}
                      name="writingFrequency"
                      type="radio"
                      value={option.value}
                      checked={formData.writingFrequency === option.value}
                      onChange={handleChange}
                      className="h-4 w-4 text-primary-600 border-gray-300"
                    />
                  </div>
                  <div className="ml-3">
                    <label htmlFor={`frequency-${option.value}`} className="text-sm text-gray-700">
                      {option.label}
                    </label>
                  </div>
                </div>
              ))}
            </div>
            {errors.writingFrequency && (
              <p className="mt-1 text-sm text-red-600">{errors.writingFrequency}</p>
            )}
          </div>
          
          {/* Writing goals */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What is your primary writing goal?
            </label>
            <div className="mt-1">
              <select
                id="writingGoals"
                name="writingGoals"
                value={formData.writingGoals}
                onChange={handleChange}
                className={`input-field w-full ${errors.writingGoals ? 'border-red-500' : ''}`}
              >
                <option value="" disabled>Select your goal</option>
                {goalOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            {errors.writingGoals && (
              <p className="mt-1 text-sm text-red-600">{errors.writingGoals}</p>
            )}
          </div>
          
          {/* Experience level - optional field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What's your writing experience level? (Optional)
            </label>
            <div className="mt-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Beginner</span>
                <span className="text-xs text-gray-500">Intermediate</span>
                <span className="text-xs text-gray-500">Advanced</span>
              </div>
              <input
                type="range"
                min="1"
                max="3"
                step="1"
                defaultValue="2"
                className="w-full mt-2"
              />
            </div>
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
        </div>
      </form>
    </div>
  );
};

export default PreferencesStepWireframe;
