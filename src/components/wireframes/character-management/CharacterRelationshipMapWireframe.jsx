import React, { useState } from 'react';

// Mock relationship data for demonstration purposes
const mockRelationships = [
  { source: '1', target: '2', type: 'Conflict', strength: 'Strong' },
  { source: '1', target: '3', type: 'Alliance', strength: 'Strong' },
  { source: '1', target: '4', type: 'Mentorship', strength: 'Medium' },
  { source: '1', target: '5', type: 'Complex', strength: 'Medium' },
  { source: '2', target: '6', type: 'Alliance', strength: 'Strong' },
  { source: '3', target: '4', type: 'Friendship', strength: 'Medium' },
  { source: '4', target: '5', type: 'Professional', strength: 'Weak' },
  { source: '2', target: '5', type: 'Conflict', strength: 'Medium' }
];

const CharacterRelationshipMapWireframe = ({ characters }) => {
  const [activeCharacter, setActiveCharacter] = useState(null);
  const [selectedRelationship, setSelectedRelationship] = useState(null);
  const [relationshipView, setRelationshipView] = useState('all'); // 'all', 'direct', 'custom'

  // Get connections for a specific character
  const getCharacterConnections = (characterId) => {
    return mockRelationships.filter(rel => 
      rel.source === characterId || rel.target === characterId
    );
  };

  // Get relationship color based on type
  const getRelationshipColor = (type) => {
    const colors = {
      'Conflict': '#ef4444', // red
      'Alliance': '#22c55e', // green
      'Mentorship': '#8b5cf6', // purple
      'Friendship': '#3b82f6', // blue
      'Professional': '#f59e0b', // amber
      'Complex': '#6366f1', // indigo
    };
    
    return colors[type] || '#94a3b8'; // default gray
  };

  // Get relationship line style based on strength
  const getRelationshipLineStyle = (strength) => {
    const styles = {
      'Strong': 'stroke-[3px]',
      'Medium': 'stroke-[2px]',
      'Weak': 'stroke-[1px] stroke-dasharray-2'
    };
    
    return styles[strength] || '';
  };

  // Handle selecting a relationship
  const handleRelationshipClick = (relationship) => {
    setSelectedRelationship(relationship);
  };

  // Find a character by ID
  const findCharacter = (id) => {
    return characters.find(char => char.id === id);
  };

  // This is a simplified visualization of relationships
  // In a real implementation, you would use a proper visualization library like D3.js
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Character Relationships</h2>
      
      <div className="mb-4 flex flex-wrap gap-2">
        <button 
          className={`px-3 py-1 rounded-md ${relationshipView === 'all' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-800'}`}
          onClick={() => setRelationshipView('all')}
        >
          All Relationships
        </button>
        <button 
          className={`px-3 py-1 rounded-md ${relationshipView === 'direct' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-800'}`}
          onClick={() => setRelationshipView('direct')}
        >
          Direct Connections Only
        </button>
        <button 
          className={`px-3 py-1 rounded-md ${relationshipView === 'custom' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-800'}`}
          onClick={() => setRelationshipView('custom')}
        >
          Custom View
        </button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Visualization area - simplified for wireframe purposes */}
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 flex-grow h-[500px] relative">
          {/* Character nodes */}
          {characters.map((character, index) => {
            // Calculate positions in a circular layout
            // This is a simplification - real implementation would use proper force-directed layout
            const angle = (2 * Math.PI * index) / characters.length;
            const radius = 180;
            const centerX = 300;
            const centerY = 220;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            
            const isActive = activeCharacter === character.id;
            
            return (
              <div 
                key={character.id}
                className={`absolute w-14 h-14 -ml-7 -mt-7 rounded-full border-2 ${isActive ? 'border-primary-600' : 'border-gray-300'} bg-white flex items-center justify-center cursor-pointer transition-all hover:scale-110`}
                style={{ left: `${x}px`, top: `${y}px` }}
                onClick={() => setActiveCharacter(isActive ? null : character.id)}
              >
                <img 
                  src={character.image} 
                  alt={character.name} 
                  className="w-12 h-12 rounded-full object-cover"
                />
              </div>
            );
          })}
          
          {/* SVG for relationship lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <defs>
              <marker id="arrow-conflict" markerWidth="10" markerHeight="10" refX="0" refY="3" orient="auto" markerUnits="strokeWidth">
                <path d="M0,0 L0,6 L6,3 z" fill="#ef4444" />
              </marker>
              <marker id="arrow-alliance" markerWidth="10" markerHeight="10" refX="0" refY="3" orient="auto" markerUnits="strokeWidth">
                <path d="M0,0 L0,6 L6,3 z" fill="#22c55e" />
              </marker>
              <marker id="arrow-mentorship" markerWidth="10" markerHeight="10" refX="0" refY="3" orient="auto" markerUnits="strokeWidth">
                <path d="M0,0 L0,6 L6,3 z" fill="#8b5cf6" />
              </marker>
              <marker id="arrow-friendship" markerWidth="10" markerHeight="10" refX="0" refY="3" orient="auto" markerUnits="strokeWidth">
                <path d="M0,0 L0,6 L6,3 z" fill="#3b82f6" />
              </marker>
              <marker id="arrow-professional" markerWidth="10" markerHeight="10" refX="0" refY="3" orient="auto" markerUnits="strokeWidth">
                <path d="M0,0 L0,6 L6,3 z" fill="#f59e0b" />
              </marker>
              <marker id="arrow-complex" markerWidth="10" markerHeight="10" refX="0" refY="3" orient="auto" markerUnits="strokeWidth">
                <path d="M0,0 L0,6 L6,3 z" fill="#6366f1" />
              </marker>
            </defs>
            {/* Relationship lines - this is a simplified visualization */}
            {mockRelationships.map((rel, index) => {
              // Only show relevant relationships based on view mode
              if (relationshipView === 'direct' && activeCharacter && rel.source !== activeCharacter && rel.target !== activeCharacter) {
                return null;
              }
              
              // Find character positions
              const sourceIndex = characters.findIndex(c => c.id === rel.source);
              const targetIndex = characters.findIndex(c => c.id === rel.target);
              
              if (sourceIndex === -1 || targetIndex === -1) return null;
              
              const sourceAngle = (2 * Math.PI * sourceIndex) / characters.length;
              const targetAngle = (2 * Math.PI * targetIndex) / characters.length;
              
              const radius = 180;
              const centerX = 300;
              const centerY = 220;
              
              const x1 = centerX + radius * Math.cos(sourceAngle);
              const y1 = centerY + radius * Math.sin(sourceAngle);
              const x2 = centerX + radius * Math.cos(targetAngle);
              const y2 = centerY + radius * Math.sin(targetAngle);
              
              const isSelected = selectedRelationship === rel;
              const color = getRelationshipColor(rel.type);
              const lineStyle = getRelationshipLineStyle(rel.strength);
              const markerId = `arrow-${rel.type.toLowerCase()}`;
              
              return (
                <g key={`rel-${index}`}>
                  <line 
                    x1={x1} 
                    y1={y1} 
                    x2={x2} 
                    y2={y2} 
                    stroke={color}
                    className={`${lineStyle} ${isSelected ? 'stroke-opacity-100' : 'stroke-opacity-50'}`}
                    markerEnd={`url(#${markerId})`}
                    onClick={() => handleRelationshipClick(rel)}
                  />
                  {/* Midpoint label */}
                  <text 
                    x={(x1 + x2) / 2} 
                    y={(y1 + y2) / 2 - 5}
                    className="text-xs fill-current text-gray-800 pointer-events-none"
                    textAnchor="middle"
                  >
                    {rel.type}
                  </text>
                </g>
              );
            })}
          </svg>
          
          {/* Wireframe navigation controls */}
          <div className="absolute bottom-4 right-4 flex gap-2">
            <button className="p-2 bg-white rounded-full shadow hover:bg-gray-100">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
            <button className="p-2 bg-white rounded-full shadow hover:bg-gray-100">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <button className="p-2 bg-white rounded-full shadow hover:bg-gray-100">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Relationship details panel */}
        <div className="w-full md:w-80 h-[500px] bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold">
              {activeCharacter ? findCharacter(activeCharacter)?.name + "'s Relationships" : "Relationship Details"}
            </h3>
          </div>
          
          <div className="flex-grow overflow-y-auto p-4">
            {selectedRelationship ? (
              <div>
                <div className="mb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <img 
                      src={findCharacter(selectedRelationship.source)?.image} 
                      alt={findCharacter(selectedRelationship.source)?.name} 
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="font-medium">{findCharacter(selectedRelationship.source)?.name}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-8 h-8 flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    <div className="ml-3 bg-gray-100 px-3 py-1 rounded-full text-sm">
                      {selectedRelationship.type} ({selectedRelationship.strength})
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 mt-2">
                    <img 
                      src={findCharacter(selectedRelationship.target)?.image} 
                      alt={findCharacter(selectedRelationship.target)?.name} 
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="font-medium">{findCharacter(selectedRelationship.target)?.name}</span>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="font-medium mb-2">Relationship Details</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    {selectedRelationship.type === 'Conflict' && 'These characters are in conflict with each other, with opposing goals or values.'}
                    {selectedRelationship.type === 'Alliance' && 'These characters work together toward a common goal.'}
                    {selectedRelationship.type === 'Mentorship' && 'One character guides or teaches the other.'}
                    {selectedRelationship.type === 'Friendship' && 'These characters have a positive, supportive relationship.'}
                    {selectedRelationship.type === 'Professional' && 'These characters have a work-related relationship.'}
                    {selectedRelationship.type === 'Complex' && 'This relationship is nuanced with both positive and negative aspects.'}
                  </p>
                  
                  <div className="flex gap-2">
                    <button className="btn-secondary text-sm">Edit</button>
                    <button className="text-red-600 hover:text-red-800 text-sm">Delete</button>
                  </div>
                </div>
              </div>
            ) : activeCharacter ? (
              <div>
                <h4 className="font-medium mb-3">Connected Characters</h4>
                {getCharacterConnections(activeCharacter).map((conn, index) => {
                  const otherId = conn.source === activeCharacter ? conn.target : conn.source;
                  const otherCharacter = findCharacter(otherId);
                  
                  return (
                    <div 
                      key={index}
                      className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md cursor-pointer"
                      onClick={() => setSelectedRelationship(conn)}
                    >
                      <img 
                        src={otherCharacter?.image} 
                        alt={otherCharacter?.name} 
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <div className="font-medium">{otherCharacter?.name}</div>
                        <div className="text-xs text-gray-500">{conn.type} • {conn.strength}</div>
                      </div>
                    </div>
                  );
                })}
                
                <button className="mt-4 w-full btn-primary text-sm">
                  Add New Relationship
                </button>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Select a character or relationship to view details.</p>
                <button className="mt-4 btn-primary text-sm">
                  Add New Relationship
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Legend */}
      <div className="mt-4 bg-white p-3 rounded-lg border border-gray-200">
        <h4 className="font-medium mb-2">Relationship Types</h4>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: getRelationshipColor('Conflict') }}></div>
            <span className="text-sm">Conflict</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: getRelationshipColor('Alliance') }}></div>
            <span className="text-sm">Alliance</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: getRelationshipColor('Mentorship') }}></div>
            <span className="text-sm">Mentorship</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: getRelationshipColor('Friendship') }}></div>
            <span className="text-sm">Friendship</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: getRelationshipColor('Professional') }}></div>
            <span className="text-sm">Professional</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: getRelationshipColor('Complex') }}></div>
            <span className="text-sm">Complex</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterRelationshipMapWireframe;
