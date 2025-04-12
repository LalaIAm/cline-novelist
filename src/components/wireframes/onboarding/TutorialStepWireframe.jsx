import React, { useState } from 'react';

const TutorialStepWireframe = ({ formData, onInputChange, onFinish, onPrevious }) => {
  const [currentStep, setCurrentStep] = useState(0);
  
  // Tutorial steps
  const steps = [
    {
      title: "Getting Started",
      description: "Learn how to create your first project and navigate the main interface.",
      image: "placeholder-tutorial-1.png",
      tips: [
        "Click the '+' button on your dashboard to create a new novel",
        "Use the sidebar to navigate between different sections",
        "Save your work regularly with the save button in the top bar"
      ]
    },
    {
      title: "Using the Editor",
      description: "Our distraction-free editor helps you focus on your writing.",
      image: "placeholder-tutorial-2.png",
      tips: [
        "Format text using the floating toolbar",
        "Chapter breaks can be added with the + icon",
        "Access character and plot tools from the right sidebar"
      ]
    },
    {
      title: "AI Assistance",
      description: "Get smart suggestions to enhance your writing.",
      image: "placeholder-tutorial-3.png",
      tips: [
        "Highlight text and click 'AI Suggest' for targeted recommendations",
        "Use the 'Generate Ideas' button when you're stuck",
        "Adjust AI settings in your project preferences"
      ]
    },
    {
      title: "Character Management",
      description: "Keep track of your characters and their relationships.",
      image: "placeholder-tutorial-4.png",
      tips: [
        "Create detailed character profiles with traits and backgrounds",
        "Visualize character relationships with the relationship map",
        "Track character appearances throughout your story"
      ]
    },
    {
      title: "Plot Organization",
      description: "Structure your story with our powerful plotting tools.",
      image: "placeholder-tutorial-5.png",
      tips: [
        "Organize your plot using timeline, structure, or scene views",
        "Connect plot elements to characters for deeper storytelling",
        "Track themes and story arcs across your novel"
      ]
    }
  ];

  const goToNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onFinish();
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      onPrevious();
    }
  };

  const handleNotificationChange = (e) => {
    onInputChange('enableNotifications', e.target.checked);
  };

  const currentTutorial = steps[currentStep];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2 text-center text-gray-800">Getting Started</h2>
      <p className="text-center text-gray-600 mb-6">
        Follow this quick tutorial to learn the basics
      </p>
      
      {/* Progress indicator */}
      <div className="flex justify-center mb-6">
        <div className="flex space-x-2">
          {steps.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              className={`h-2.5 w-2.5 rounded-full ${
                index === currentStep ? 'bg-primary-600' : 'bg-gray-300'
              }`}
              aria-label={`Go to step ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Tutorial Content */}
      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <div className="text-center mb-4">
          <h3 className="text-xl font-medium text-gray-800 mb-2">
            {currentTutorial.title}
          </h3>
          <p className="text-gray-600">{currentTutorial.description}</p>
        </div>
        
        {/* Placeholder for image/gif */}
        <div className="bg-gray-200 rounded-lg h-48 mb-4 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <div className="text-5xl mb-2">🖼️</div>
            <p>Tutorial Image/Animation</p>
          </div>
        </div>
        
        {/* Tips */}
        <div className="bg-white rounded p-4 shadow-sm">
          <h4 className="font-medium text-gray-700 mb-2">Quick Tips:</h4>
          <ul className="space-y-2">
            {currentTutorial.tips.map((tip, index) => (
              <li key={index} className="flex items-start">
                <span className="text-primary-500 mr-2">•</span>
                <span className="text-gray-600 text-sm">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      {/* Notification preference */}
      {currentStep === steps.length - 1 && (
        <div className="mb-8">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="enableNotifications"
                name="enableNotifications"
                type="checkbox"
                checked={formData.enableNotifications}
                onChange={handleNotificationChange}
                className="h-4 w-4 text-primary-600 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="enableNotifications" className="font-medium text-gray-700">
                Enable tips and notifications
              </label>
              <p className="text-gray-500">
                Get helpful writing tips and feature updates as you use Novylist. You can change this later in settings.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          type="button"
          onClick={goToPreviousStep}
          className="btn-secondary"
        >
          {currentStep === 0 ? 'Back' : 'Previous'}
        </button>
        
        <div className="flex items-center">
          <div className="text-sm text-gray-500 mr-4">
            {currentStep + 1} of {steps.length}
          </div>
          
          {currentStep < steps.length - 1 ? (
            <button
              type="button"
              onClick={goToNextStep}
              className="btn-primary"
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={onFinish}
              className="btn-primary"
            >
              Get Started
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TutorialStepWireframe;
