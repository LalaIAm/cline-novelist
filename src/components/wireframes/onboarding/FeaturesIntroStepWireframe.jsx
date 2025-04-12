import React from 'react';

const FeaturesIntroStepWireframe = ({ onNext, onPrevious, onSkip }) => {
  // Core features to highlight in the onboarding process
  const features = [
    {
      title: 'Smart AI Writing Assistant',
      description: 'Get personalized writing suggestions, plot ideas, and character development assistance.',
      icon: '🤖',
      color: 'bg-blue-100'
    },
    {
      title: 'Character Management',
      description: 'Track characters, their relationships, and ensure consistency throughout your novel.',
      icon: '👤',
      color: 'bg-green-100'
    },
    {
      title: 'Plot Structure Tools',
      description: 'Visualize your plot with timeline, structure, and scene organization views.',
      icon: '📊',
      color: 'bg-purple-100'
    },
    {
      title: 'Distraction-Free Writing',
      description: 'Focus on your creativity with a clean, customizable writing environment.',
      icon: '✍️',
      color: 'bg-yellow-100'
    },
    {
      title: 'Version History',
      description: 'Keep track of changes with comprehensive version history and branching options.',
      icon: '🕒',
      color: 'bg-red-100'
    },
    {
      title: 'Collaboration Tools',
      description: 'Share your work and collaborate with editors, co-authors, and reviewers.',
      icon: '👥',
      color: 'bg-indigo-100'
    }
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Discover Novylist Features</h2>
      <p className="text-center text-gray-600 mb-8">
        Explore the powerful tools that will enhance your novel writing experience
      </p>
      
      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {features.map((feature, index) => (
          <div 
            key={index}
            className={`${feature.color} rounded-lg p-4 flex items-start`}
          >
            <div className="text-3xl mr-4">{feature.icon}</div>
            <div>
              <h3 className="font-medium text-gray-800">{feature.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Video Preview Placeholder */}
      <div className="rounded-lg bg-gray-200 p-4 mb-8">
        <div className="aspect-w-16 aspect-h-9 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-2">▶️</div>
            <p className="text-gray-600">Feature Demo Video</p>
            <p className="text-sm text-gray-500 mt-1">See Novylist in action (2 min)</p>
          </div>
        </div>
      </div>
      
      {/* Community/Social Proof Section */}
      <div className="rounded-lg border border-gray-200 p-4 mb-8">
        <h3 className="font-medium text-gray-800 mb-2">Join the Novylist Community</h3>
        <p className="text-sm text-gray-600 mb-4">
          Connect with thousands of writers who use Novylist to create their best work
        </p>
        <div className="flex items-center justify-between text-center">
          <div>
            <div className="font-bold text-xl text-primary-600">15k+</div>
            <div className="text-xs text-gray-500">Active Writers</div>
          </div>
          <div>
            <div className="font-bold text-xl text-primary-600">200k+</div>
            <div className="text-xs text-gray-500">Novels Started</div>
          </div>
          <div>
            <div className="font-bold text-xl text-primary-600">4.8/5</div>
            <div className="text-xs text-gray-500">Average Rating</div>
          </div>
          <div>
            <div className="font-bold text-xl text-primary-600">1.2M+</div>
            <div className="text-xs text-gray-500">Words Written Daily</div>
          </div>
        </div>
      </div>
      
      {/* Testimonial */}
      <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-primary-500 mb-8">
        <p className="text-gray-600 italic">
          "Novylist completely transformed my writing process. The AI assistant helps me overcome writer's block, and the character management tools keep my story consistent."
        </p>
        <p className="text-right text-sm font-medium text-gray-700 mt-2">
          — Sarah Johnson, Fantasy Author
        </p>
      </div>
      
      {/* Navigation buttons */}
      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={onPrevious}
          className="btn-secondary"
        >
          Back
        </button>
        <div className="space-x-4">
          <button
            type="button"
            onClick={onSkip}
            className="btn-outline"
          >
            Skip Tutorial
          </button>
          <button
            type="button"
            onClick={onNext}
            className="btn-primary"
          >
            Continue to Tutorial
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeaturesIntroStepWireframe;
