import React, { useState } from 'react';

// Mock data for relationships (simplified version of what's in the relationship map)
const mockRelationships = [
  { id: '1', source: '1', target: '2', type: 'Conflict', strength: 'Strong' },
  { id: '2', source: '1', target: '3', type: 'Alliance', strength: 'Strong' },
  { id: '3', source: '1', target: '4', type: 'Mentorship', strength: 'Medium' },
  { id: '4', source: '1', target: '5', type: 'Complex', strength: 'Medium' }
];

// Mock data for appearances in scenes
const mockSceneAppearances = [
  { id: '1', chapter: 'Chapter 1', scene: 'The Revelation', importance: 'Major', pov: true },
  { id: '2', chapter: 'Chapter 3', scene: 'The Confrontation', importance: 'Major', pov: false },
  { id: '3', chapter: 'Chapter 5', scene: 'The Decision', importance: 'Major', pov: true },
  { id: '4', chapter: 'Chapter 8', scene: 'The Betrayal', importance: 'Supporting', pov: false },
  { id: '5', chapter: 'Chapter 12', scene: 'The Resolution', importance: 'Major', pov: true }
];

// Mock data for character arc
const mockCharacterArc = [
  { 
    id: '1', 
    stage: 'Beginning',
    description: 'Ambitious but naive journalist seeking to make a name for themselves.',
    emotions: ['Determined', 'Idealistic', 'Impatient'],
    goals: ['Break a major story', 'Gain recognition in the field']
  },
  { 
    id: '2', 
    stage: 'Midpoint',
    description: 'Seasoned reporter who has uncovered disturbing truths and faces moral dilemmas.',
    emotions: ['Conflicted', 'Concerned', 'Resolute'],
    goals: ['Expose the conspiracy', 'Protect sources', 'Navigate dangerous situations']
  },
  { 
    id: '3', 
    stage: 'End',
    description: 'Transformed investigative journalist who values truth over fame and has learned to navigate complex ethical situations.',
    emotions: ['Confident', 'Principled', 'Cautious'],
    goals: ['Use platform responsibly', 'Mentor others', 'Balance personal and professional life']
  }
];

const CharacterDetailWireframe = ({ character = null, onBack }) => {
  // For wireframe purposes, we'll use the first character if none is provided
  const defaultCharacter = {
    id: '1',
    name: 'Alex Morgan',
    role: 'Protagonist',
    importance: 'Main',
    image: 'https://via.placeholder.com/300',
    lastEdited: '2025-04-01T10:30:00Z',
    description: 'A determined journalist with a knack for uncovering conspiracies.',
    attributes: {
      physical: ['Athletic', 'Short brown hair', 'Green eyes', 'Age: 32', 'Height: 5\'10"', 'Distinctive scar on right eyebrow'],
      personality: ['Curious', 'Persistent', 'Empathetic', 'Risk-taker', 'Idealistic', 'Strategic thinker'],
      background: ['Grew up in small-town Midwest', 'Journalism degree from prestigious university', 'Worked at several newspapers before going freelance', 'Lost a mentor in suspicious circumstances'],
      skills: ['Investigative research', 'Persuasive interviewing', 'Quick thinking', 'Basic self-defense', 'Photography', 'Data analysis']
    }
  };
  
  const characterData = character || defaultCharacter;
  const [activeTab, setActiveTab] = useState('profile');
  const [editMode, setEditMode] = useState(false);
  
  // Get related characters (simplified for wireframe)
  const getRelatedCharacters = (relations, chars) => {
    // In a real implementation, you would fetch the actual character data
    // Here we're just returning placeholder data
    return relations.map(rel => ({
      id: rel.target === characterData.id ? rel.source : rel.target,
      name: rel.target === characterData.id ? 'Character ' + rel.source : 'Character ' + rel.target,
      image: 'https://via.placeholder.com/100',
      relationshipType: rel.type,
      relationshipStrength: rel.strength
    }));
  };
  
  const relatedCharacters = getRelatedCharacters(mockRelationships, []);
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Back button and actions */}
      <div className="flex justify-between items-center mb-6">
        <button 
          className="flex items-center text-primary-600 hover:text-primary-800"
          onClick={onBack}
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Characters
        </button>
        
        <div className="flex gap-2">
          <button 
            className={`px-4 py-2 rounded-md ${editMode ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-800'}`}
            onClick={() => setEditMode(!editMode)}
          >
            {editMode ? 'Save Changes' : 'Edit Character'}
          </button>
          <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
            Delete
          </button>
        </div>
      </div>
      
      {/* Character header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/4">
            <div className="relative">
              <img 
                src={characterData.image} 
                alt={characterData.name} 
                className="w-full aspect-square object-cover rounded-lg shadow-md"
              />
              {editMode && (
                <button className="absolute bottom-2 right-2 p-2 bg-white rounded-full shadow-md">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              )}
            </div>
          </div>
          
          <div className="w-full md:w-3/4">
            <div className="flex justify-between items-start mb-2">
              {editMode ? (
                <input 
                  type="text" 
                  className="text-3xl font-bold text-gray-800 input-field w-full"
                  defaultValue={characterData.name}
                />
              ) : (
                <h1 className="text-3xl font-bold text-gray-800">{characterData.name}</h1>
              )}
              
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                  {characterData.role}
                </span>
                <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-semibold">
                  {characterData.importance}
                </span>
              </div>
            </div>
            
            {editMode ? (
              <textarea 
                className="w-full h-32 input-field mb-4"
                defaultValue={characterData.description}
              />
            ) : (
              <p className="text-gray-600 mb-4">{characterData.description}</p>
            )}
            
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <span className="text-sm text-gray-500">Last edited:</span>
                <span className="text-sm font-medium">
                  {new Date(characterData.lastEdited).toLocaleString()}
                </span>
              </div>
              {editMode && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Role</label>
                    <select className="input-field w-full">
                      <option value="Protagonist">Protagonist</option>
                      <option value="Antagonist">Antagonist</option>
                      <option value="Ally">Ally</option>
                      <option value="Mentor">Mentor</option>
                      <option value="Ally/Obstacle">Ally/Obstacle</option>
                      <option value="Secondary Antagonist">Secondary Antagonist</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Importance</label>
                    <select className="input-field w-full">
                      <option value="Main">Main</option>
                      <option value="Supporting">Supporting</option>
                      <option value="Minor">Minor</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs navigation */}
      <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
        <button 
          className={`px-4 py-3 font-medium text-sm ${activeTab === 'profile' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('profile')}
        >
          Profile & Attributes
        </button>
        <button 
          className={`px-4 py-3 font-medium text-sm ${activeTab === 'relationships' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('relationships')}
        >
          Relationships
        </button>
        <button 
          className={`px-4 py-3 font-medium text-sm ${activeTab === 'development' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('development')}
        >
          Character Arc
        </button>
        <button 
          className={`px-4 py-3 font-medium text-sm ${activeTab === 'appearances' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('appearances')}
        >
          Appearances
        </button>
        <button 
          className={`px-4 py-3 font-medium text-sm ${activeTab === 'notes' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('notes')}
        >
          Notes
        </button>
        <button 
          className={`px-4 py-3 font-medium text-sm ${activeTab === 'ai' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('ai')}
        >
          AI Suggestions
        </button>
      </div>
      
      {/* Tab content */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Profile tab */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Physical attributes */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Physical Attributes</h3>
                {editMode && (
                  <button className="text-primary-600 hover:text-primary-800 text-sm font-medium">
                    Add Attribute
                  </button>
                )}
              </div>
              {editMode ? (
                <div className="space-y-3">
                  {characterData.attributes.physical.map((attr, index) => (
                    <div key={index} className="flex items-center">
                      <input
                        type="text"
                        className="input-field w-full"
                        defaultValue={attr}
                      />
                      <button className="ml-2 text-red-500 hover:text-red-700">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                  <button className="w-full py-2 border-2 border-dashed border-gray-300 text-gray-500 rounded-md hover:bg-gray-50">
                    + Add Physical Attribute
                  </button>
                </div>
              ) : (
                <ul className="space-y-2">
                  {characterData.attributes.physical.map((attr, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="w-5 h-5 text-gray-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{attr}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            
            {/* Personality traits */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Personality Traits</h3>
                {editMode && (
                  <button className="text-primary-600 hover:text-primary-800 text-sm font-medium">
                    Add Trait
                  </button>
                )}
              </div>
              {editMode ? (
                <div className="space-y-3">
                  {characterData.attributes.personality.map((trait, index) => (
                    <div key={index} className="flex items-center">
                      <input
                        type="text"
                        className="input-field w-full"
                        defaultValue={trait}
                      />
                      <button className="ml-2 text-red-500 hover:text-red-700">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                  <button className="w-full py-2 border-2 border-dashed border-gray-300 text-gray-500 rounded-md hover:bg-gray-50">
                    + Add Personality Trait
                  </button>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {characterData.attributes.personality.map((trait, index) => (
                    <span key={index} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                      {trait}
                    </span>
                  ))}
                </div>
              )}
            </div>
            
            {/* Background */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Background</h3>
                {editMode && (
                  <button className="text-primary-600 hover:text-primary-800 text-sm font-medium">
                    Add Background
                  </button>
                )}
              </div>
              {editMode ? (
                <div className="space-y-3">
                  {characterData.attributes.background.map((bg, index) => (
                    <div key={index} className="flex items-center">
                      <input
                        type="text"
                        className="input-field w-full"
                        defaultValue={bg}
                      />
                      <button className="ml-2 text-red-500 hover:text-red-700">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                  <button className="w-full py-2 border-2 border-dashed border-gray-300 text-gray-500 rounded-md hover:bg-gray-50">
                    + Add Background Element
                  </button>
                </div>
              ) : (
                <ul className="space-y-2">
                  {characterData.attributes.background.map((bg, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="w-5 h-5 text-gray-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      <span>{bg}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            
            {/* Skills and abilities */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Skills & Abilities</h3>
                {editMode && (
                  <button className="text-primary-600 hover:text-primary-800 text-sm font-medium">
                    Add Skill
                  </button>
                )}
              </div>
              {editMode ? (
                <div className="space-y-3">
                  {characterData.attributes.skills.map((skill, index) => (
                    <div key={index} className="flex items-center">
                      <input
                        type="text"
                        className="input-field w-full"
                        defaultValue={skill}
                      />
                      <button className="ml-2 text-red-500 hover:text-red-700">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                  <button className="w-full py-2 border-2 border-dashed border-gray-300 text-gray-500 rounded-md hover:bg-gray-50">
                    + Add Skill
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {characterData.attributes.skills.map((skill, index) => (
                    <div key={index} className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{skill}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* AI Integration element */}
            <div className="col-span-1 md:col-span-2 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-100">
              <div className="flex items-start">
                <div className="bg-indigo-100 rounded-full p-2 mr-3">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-md font-semibold text-indigo-800 mb-1">AI Character Consistency Check</h3>
                  <p className="text-sm text-indigo-700 mb-3">
                    The AI has analyzed this character and found potential inconsistencies or development opportunities.
                  </p>
                  <div className="bg-white rounded-md p-3 text-sm border border-indigo-100">
                    <p className="mb-2">
                      <span className="font-medium">Consistency Alert:</span> The character is described as both "risk-taker" and "cautious strategist" which might be contradictory depending on context.
                    </p>
                    <p>
                      <span className="font-medium">Development Opportunity:</span> Consider adding more specific personality flaws to create a more three-dimensional character arc.
                    </p>
                    <button className="text-indigo-600 font-medium text-sm mt-2 hover:text-indigo-800">
                      See all AI suggestions
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Relationships tab */}
        {activeTab === 'relationships' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Character Relationships</h2>
              <button className="btn-primary">
                Add Relationship
              </button>
            </div>
            
            {relatedCharacters.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-600 mb-3">This character doesn't have any recorded relationships yet.</p>
                <button className="btn-primary">Add First Relationship</button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Relationship cards */}
                {relatedCharacters.map((rel, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-start">
                      <img src={rel.image} alt={rel.name} className="w-12 h-12 rounded-full mr-4" />
                      <div className="flex-grow">
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium">{rel.name}</h3>
                          <div className="flex gap-1">
                            <button className="text-primary-600 hover:text-primary-800 text-sm">
                              Edit
                            </button>
                            <button className="text-red-600 hover:text-red-800 text-sm">
                              Remove
                            </button>
                          </div>
                        </div>
                        
                        <div className="flex items-center mt-1">
                          <span className={`inline-block px-2 py-1 text-xs rounded-full font-medium
                            ${rel.relationshipType === 'Alliance' ? 'bg-green-100 text-green-800' : ''}
                            ${rel.relationshipType === 'Conflict' ? 'bg-red-100 text-red-800' : ''}
                            ${rel.relationshipType === 'Mentorship' ? 'bg-purple-100 text-purple-800' : ''}
                            ${rel.relationshipType === 'Complex' ? 'bg-indigo-100 text-indigo-800' : ''}
                          `}>
                            {rel.relationshipType}
                          </span>
                          <span className="mx-1 text-gray-400">•</span>
                          <span className="text-sm text-gray-600">{rel.relationshipStrength} connection</span>
                        </div>
                        
                        <p className="text-sm text-gray-600 mt-2">
                          {rel.relationshipType === 'Alliance' && 'These characters work together toward common goals and generally trust each other.'}
                          {rel.relationshipType === 'Conflict' && 'These characters are in opposition, with competing goals or values.'}
                          {rel.relationshipType === 'Mentorship' && 'One character serves as a guide or teacher to the other.'}
                          {rel.relationshipType === 'Complex' && 'A nuanced relationship with both positive and negative aspects.'}
                        </p>
                        
                        {editMode && (
                          <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Relationship Type</label>
                              <select className="input-field w-full text-sm py-1" defaultValue={rel.relationshipType}>
                                <option value="Alliance">Alliance</option>
                                <option value="Conflict">Conflict</option>
                                <option value="Mentorship">Mentorship</option>
                                <option value="Friendship">Friendship</option>
                                <option value="Professional">Professional</option>
                                <option value="Complex">Complex</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Strength</label>
                              <select className="input-field w-full text-sm py-1" defaultValue={rel.relationshipStrength}>
                                <option value="Strong">Strong</option>
                                <option value="Medium">Medium</option>
                                <option value="Weak">Weak</option>
                              </select>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Add relationship button */}
                <button className="w-full py-3 border-2 border-dashed border-gray-300 text-gray-500 rounded-lg hover:bg-gray-50">
                  + Add Another Relationship
                </button>
                
                {/* Relationship Map link */}
                <div className="flex justify-center mt-4">
                  <button className="text-primary-600 hover:text-primary-800 font-medium flex items-center">
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    View Full Relationship Map
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Character Arc tab */}
        {activeTab === 'development' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Character Arc</h2>
              {editMode && (
                <button className="btn-primary">
                  Add Arc Stage
                </button>
              )}
            </div>
            
            {/* Character arc visualization */}
            <div className="relative mb-6 pt-8">
              {/* Arc timeline */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gray-200 rounded-full">
                <div className="absolute top-0 left-0 h-2 bg-primary-600 rounded-full" style={{ width: '70%' }}></div>
              </div>
              
              {/* Arc stages */}
              <div className="flex justify-between">
                {mockCharacterArc.map((stage, index) => (
                  <div key={stage.id} className="w-1/3 px-2">
                    <div 
                      className={`h-4 w-4 rounded-full mb-2 mx-auto ${index === 0 ? 'bg-primary-600' : index === 1 ? 'bg-primary-600' : 'bg-gray-300'}`}
                      style={{ marginTop: '-16px' }}
                    ></div>
                    <div className={`text-center font-medium ${index === 0 || index === 1 ? 'text-primary-600' : 'text-gray-400'}`}>
                      {stage.stage}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Arc stages details */}
            <div className="space-y-6">
              {mockCharacterArc.map((stage, index) => (
                <div 
                  key={stage.id} 
                  className={`border rounded-lg p-4 ${index === 0 || index === 1 ? 'border-primary-100 bg-primary-50' : 'border-gray-200'}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{stage.stage}</h3>
                    {editMode && (
                      <div className="flex gap-2">
                        <button className="text-primary-600 hover:text-primary-800 text-sm">
                          Edit
                        </button>
                        <button className="text-red-600 hover:text-red-800 text-sm">
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {editMode ? (
                    <textarea 
                      className="w-full h-24 input-field mb-3"
                      defaultValue={stage.description}
                    />
                  ) : (
                    <p className="text-gray-600 mb-3">{stage.description}</p>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Emotions */}
                    <div>
                      <h4 className="font-medium text-sm mb-2 text-gray-700">Key Emotions</h4>
                      {editMode ? (
                        <div className="space-y-2">
                          {stage.emotions.map((emotion, i) => (
                            <div key={i} className="flex items-center">
                              <input 
                                type="text" 
                                className="input-field w-full text-sm py-1"
                                defaultValue={emotion}
                              />
                              <button className="ml-2 text-red-500 hover:text-red-700">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          ))}
                          <button className="w-full py-1 border border-dashed border-gray-300 text-gray-500 rounded-md hover:bg-gray-50 text-sm">
                            + Add Emotion
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {stage.emotions.map((emotion, i) => (
                            <span key={i} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                              {emotion}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {/* Goals */}
                    <div>
                      <h4 className="font-medium text-sm mb-2 text-gray-700">Goals & Motivations</h4>
                      {editMode ? (
                        <div className="space-y-2">
                          {stage.goals.map((goal, i) => (
                            <div key={i} className="flex items-center">
                              <input 
                                type="text" 
                                className="input-field w-full text-sm py-1"
                                defaultValue={goal}
                              />
                              <button className="ml-2 text-red-500 hover:text-red-700">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          ))}
                          <button className="w-full py-1 border border-dashed border-gray-300 text-gray-500 rounded-md hover:bg-gray-50 text-sm">
                            + Add Goal
                          </button>
                        </div>
                      ) : (
                        <ul className="space-y-1">
                          {stage.goals.map((goal, i) => (
                            <li key={i} className="flex items-start text-sm">
                              <svg className="w-4 h-4 text-green-500 mr-1 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>{goal}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Add new stage button (when in edit mode) */}
              {editMode && (
                <button className="w-full py-3 border-2 border-dashed border-gray-300 text-gray-500 rounded-lg hover:bg-gray-50">
                  + Add New Character Arc Stage
                </button>
              )}
            </div>
            
            {/* AI Integration element */}
            <div className="mt-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-100">
              <div className="flex items-start">
                <div className="bg-indigo-100 rounded-full p-2 mr-3">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-md font-semibold text-indigo-800 mb-1">AI Character Arc Suggestions</h3>
                  <p className="text-sm text-indigo-700 mb-3">
                    Based on analysis of successful character arcs in this genre, the AI has suggestions:
                  </p>
                  <div className="bg-white rounded-md p-3 text-sm border border-indigo-100">
                    <p className="mb-2">
                      <span className="font-medium">Growth Opportunity:</span> Consider a more pronounced low point before the final stage to create a more dramatic transformation.
                    </p>
                    <p className="mb-2">
                      <span className="font-medium">Arc Balance:</span> The character's goals shift appropriately throughout their journey, but emotional transitions could be more clearly defined.
                    </p>
                    <button className="text-indigo-600 font-medium text-sm mt-2 hover:text-indigo-800">
                      Generate detailed arc suggestions
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Appearances tab */}
        {activeTab === 'appearances' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Scene Appearances</h2>
              <button className="btn-primary">
                Add Scene Appearance
              </button>
            </div>
            
            {mockSceneAppearances.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-600 mb-3">No scene appearances recorded for this character yet.</p>
                <button className="btn-primary">Add First Scene</button>
              </div>
            ) : (
              <div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chapter</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scene</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">POV</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {mockSceneAppearances.map((appearance) => (
                        <tr key={appearance.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {appearance.chapter}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {appearance.scene}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              appearance.importance === 'Major' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {appearance.importance}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {appearance.pov ? (
                              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-primary-600 hover:text-primary-900 mr-3">
                              Edit
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Character presence visualization */}
                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-4">Character Presence Throughout Story</h3>
                  <div className="h-16 bg-gray-100 rounded-lg relative">
                    {/* Markers for each chapter, simplified visualization */}
                    <div className="absolute inset-0 flex items-center">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((chapter) => (
                        <div 
                          key={chapter} 
                          className="flex-grow flex flex-col items-center"
                        >
                          <div 
                            className={`h-8 w-full ${
                              mockSceneAppearances.some(a => a.chapter === `Chapter ${chapter}`) 
                                ? 'bg-primary-500' 
                                : 'bg-transparent'
                            }`}
                          ></div>
                          <div className="text-xs text-gray-500 mt-1">Ch {chapter}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Beginning</span>
                    <span>Middle</span>
                    <span>End</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Notes tab */}
        {activeTab === 'notes' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Character Notes</h2>
            </div>
            
            {editMode ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">General Notes</label>
                  <textarea
                    className="input-field w-full h-40"
                    placeholder="Add general notes about this character..."
                    defaultValue="Alex's background in journalism should be emphasized throughout their character arc. Their relationships with sources become increasingly important as the story progresses."
                  ></textarea>
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Research Notes</label>
                  <textarea
                    className="input-field w-full h-40"
                    placeholder="Add research notes related to this character..."
                    defaultValue="Investigated typical career progression of investigative journalists and common ethical dilemmas they face. Need to research more about the legal protections for journalists and their sources."
                  ></textarea>
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Development Ideas</label>
                  <textarea
                    className="input-field w-full h-40"
                    placeholder="Add character development ideas..."
                    defaultValue="Consider adding a personal connection to the conspiracy that is revealed in the third act, raising the emotional stakes. Could involve a family member or close friend from Alex's past."
                  ></textarea>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">General Notes</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p>Alex's background in journalism should be emphasized throughout their character arc. Their relationships with sources become increasingly important as the story progresses.</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Research Notes</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p>Investigated typical career progression of investigative journalists and common ethical dilemmas they face. Need to research more about the legal protections for journalists and their sources.</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Development Ideas</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p>Consider adding a personal connection to the conspiracy that is revealed in the third act, raising the emotional stakes. Could involve a family member or close friend from Alex's past.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* AI Suggestions tab */}
        {activeTab === 'ai' && (
          <div>
            <div className="mb-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4">
              <div className="flex items-center">
                <div className="bg-indigo-100 rounded-full p-2 mr-3">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-indigo-800">AI-Generated Character Suggestions</h3>
              </div>
              <p className="text-sm text-indigo-700 mt-2">
                Based on analysis of this character and successful narrative patterns, the AI has generated the following suggestions to enhance this character.
              </p>
            </div>
            
            <div className="space-y-6">
              {/* Character Consistency */}
              <div className="border border-gray-200 rounded-lg">
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                  <h3 className="font-medium">Character Consistency Analysis</h3>
                </div>
                <div className="p-4">
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-0.5">
                        <svg className="h-5 w-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h4 className="text-sm font-medium text-yellow-800">Potential Contradiction</h4>
                        <p className="text-sm text-gray-600">
                          This character is described as both "risk-taker" and "strategic thinker" which could be contradictory. Consider adding context that bridges these traits, such as "calculates risks before taking them."
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-0.5">
                        <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h4 className="text-sm font-medium text-green-800">Strong Character Traits</h4>
                        <p className="text-sm text-gray-600">
                          The character's journalism background and investigative skills are well-developed and consistently referenced throughout their description.
                        </p>
                      </div>
                    </div>
                    
                    <button className="text-indigo-600 text-sm font-medium">
                      See full consistency analysis
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Character Development Suggestions */}
              <div className="border border-gray-200 rounded-lg">
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                  <h3 className="font-medium">Development Suggestions</h3>
                </div>
                <div className="p-4">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-1">Add a Defining Flaw</h4>
                      <p className="text-sm text-gray-600 mb-2">
                        This character would benefit from a more prominent character flaw that creates internal conflict and growth opportunities.
                      </p>
                      <div className="bg-indigo-50 p-3 rounded-md">
                        <h5 className="text-xs font-medium text-indigo-800 mb-1">AI-Generated Suggestions:</h5>
                        <ul className="text-sm space-y-1 text-gray-700">
                          <li>• Tendency to become obsessed with stories at the expense of personal relationships</li>
                          <li>• Difficulty trusting authority figures due to past betrayal</li>
                          <li>• Willingness to bend ethical rules "for the greater good"</li>
                        </ul>
                        <button className="text-indigo-600 text-sm font-medium mt-2">
                          Generate more flaws
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-1">Enhance Character Arc</h4>
                      <p className="text-sm text-gray-600 mb-2">
                        The character's transformation from beginning to end could be more dramatically defined.
                      </p>
                      <div className="bg-indigo-50 p-3 rounded-md">
                        <h5 className="text-xs font-medium text-indigo-800 mb-1">AI-Generated Suggestions:</h5>
                        <p className="text-sm text-gray-700">
                          Consider a more pronounced low point where the character faces a major ethical dilemma that challenges their core values before their final transformation.
                        </p>
                        <button className="text-indigo-600 text-sm font-medium mt-2">
                          Generate arc enhancements
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Character Dialogue Samples */}
              <div className="border border-gray-200 rounded-lg">
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                  <h3 className="font-medium">AI-Generated Dialogue Samples</h3>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-600 mb-4">
                    Based on this character's traits and background, here are some dialogue snippets that could help establish their voice:
                  </p>
                  
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-3 rounded-md">
                      <div className="text-sm italic">
                        "The truth isn't just some abstract concept. It's a weapon, a shield, and sometimes a burden. But it's always worth the cost."
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        - Reflects idealism and principled nature
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded-md">
                      <div className="text-sm italic">
                        "I've learned to read between the lines. People don't always lie with their words—sometimes it's in what they don't say."
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        - Showcases investigative instincts
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded-md">
                      <div className="text-sm italic">
                        "My editor used to say, 'follow the money.' I say follow the fear. People don't guard anything more closely than what terrifies them."
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        - Highlights strategic thinking and experience
                      </div>
                    </div>
                    
                    <button className="text-indigo-600 text-sm font-medium">
                      Generate more dialogue samples
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CharacterDetailWireframe;
