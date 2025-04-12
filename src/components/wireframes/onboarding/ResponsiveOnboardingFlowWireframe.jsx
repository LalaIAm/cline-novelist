import React, { useState } from 'react';
import RegistrationStepWireframe from './RegistrationStepWireframe';
import PreferencesStepWireframe from './PreferencesStepWireframe';
import WritingStyleStepWireframe from './WritingStyleStepWireframe';
import TutorialStepWireframe from './TutorialStepWireframe';
import FeaturesIntroStepWireframe from './FeaturesIntroStepWireframe';
import { ResponsiveContainer } from '../responsive';

const ResponsiveOnboardingFlowWireframe = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // User registration data
    email: '',
    password: '',
    name: '',
    username: '',
    
    // User preferences
    genres: [],
    writingFrequency: '',
    writingGoals: '',
    
    // Writing style preferences
    writingStyle: '',
    assistanceLevel: 'Moderate',
    focusAreas: [],
    
    // Onboarding preferences
    skipTutorial: false,
    enableNotifications: true
  });

  const totalSteps = 5;

  const handleNextStep = () => {
    window.scrollTo(0, 0);
    setCurrentStep(current => Math.min(current + 1, totalSteps));
  };

  const handlePreviousStep = () => {
    window.scrollTo(0, 0);
    setCurrentStep(current => Math.max(current - 1, 1));
  };

  const handleSkipToFinal = () => {
    window.scrollTo(0, 0);
    setCurrentStep(totalSteps);
  };

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const handleFormSubmit = () => {
    // In a real implementation, this would submit the registration/preferences
    // and redirect to the dashboard
    console.log('Onboarding data submitted:', formData);
    alert('Onboarding completed! Redirecting to dashboard...');
  };

  // Render different step based on currentStep
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <RegistrationStepWireframe 
            formData={formData} 
            onInputChange={handleInputChange}
            onNext={handleNextStep}
          />
        );
      case 2:
        return (
          <PreferencesStepWireframe 
            formData={formData} 
            onInputChange={handleInputChange}
            onNext={handleNextStep}
            onPrevious={handlePreviousStep}
          />
        );
      case 3:
        return (
          <WritingStyleStepWireframe 
            formData={formData} 
            onInputChange={handleInputChange}
            onNext={handleNextStep}
            onPrevious={handlePreviousStep}
          />
        );
      case 4:
        return (
          <FeaturesIntroStepWireframe 
            onNext={handleNextStep}
            onPrevious={handlePreviousStep}
            onSkip={handleSkipToFinal}
          />
        );
      case 5:
        return (
          <TutorialStepWireframe 
            formData={formData}
            onInputChange={handleInputChange}
            onFinish={handleFormSubmit}
            onPrevious={handlePreviousStep}
          />
        );
      default:
        return null;
    }
  };

  // Progress indicators
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gray-50 py-6 md:py-12">
      <div className="w-full max-w-4xl mx-auto px-4">
        {/* Header with logo */}
        <div className="flex justify-center mb-6 md:mb-8">
          <div className="text-2xl md:text-3xl font-bold text-primary-600">Novylist</div>
        </div>

        {/* Progress indicator */}
        <div className="mb-6 md:mb-8">
          <div className="flex justify-between items-center mb-2">
            <div className="text-sm font-medium text-gray-500">
              Step {currentStep} of {totalSteps}
            </div>
            <div className="text-sm font-medium text-gray-500">
              {Math.round(progressPercentage)}% Complete
            </div>
          </div>
          <div className="overflow-hidden h-2 bg-gray-200 rounded-full">
            <div 
              className="h-full bg-primary-600 rounded-full transition-all duration-300 ease-in-out" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Step titles - hidden on mobile */}
        <div className="hidden md:flex justify-between mb-6">
          <div className={`text-sm font-medium ${currentStep === 1 ? 'text-primary-600' : 'text-gray-500'}`}>Account Setup</div>
          <div className={`text-sm font-medium ${currentStep === 2 ? 'text-primary-600' : 'text-gray-500'}`}>Preferences</div>
          <div className={`text-sm font-medium ${currentStep === 3 ? 'text-primary-600' : 'text-gray-500'}`}>Writing Style</div>
          <div className={`text-sm font-medium ${currentStep === 4 ? 'text-primary-600' : 'text-gray-500'}`}>Features</div>
          <div className={`text-sm font-medium ${currentStep === 5 ? 'text-primary-600' : 'text-gray-500'}`}>Tutorial</div>
        </div>

        {/* Step indicator for mobile */}
        <div className="flex md:hidden justify-between mb-4 overflow-x-auto">
          {[1, 2, 3, 4, 5].map(step => (
            <div 
              key={step} 
              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep === step 
                  ? 'bg-primary-600 text-white' 
                  : currentStep > step 
                    ? 'bg-green-100 text-green-800 border border-green-300' 
                    : 'bg-gray-200 text-gray-400'
              }`}
            >
              {currentStep > step ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                step
              )}
            </div>
          ))}
        </div>

        {/* Main content area */}
        <div className="bg-white rounded-lg shadow-md md:shadow-lg p-4 md:p-8">
          {renderStep()}
        </div>

        {/* Skip and help links */}
        <div className="mt-4 flex justify-between text-sm">
          {currentStep < 5 && (
            <button 
              onClick={handleSkipToFinal}
              className="text-gray-500 hover:text-gray-700"
            >
              Skip to final step
            </button>
          )}
          <a href="#" className="text-primary-600 hover:text-primary-800">
            Need help?
          </a>
        </div>
      </div>
    </div>
  );
};

export default ResponsiveOnboardingFlowWireframe;
