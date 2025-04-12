import React, { useState } from 'react';
import CharacterListViewWireframe from './CharacterListViewWireframe';
import CharacterGalleryViewWireframe from './CharacterGalleryViewWireframe';
import CharacterRelationshipMapWireframe from './CharacterRelationshipMapWireframe';
import { 
  ResponsiveContainer, 
  ResponsiveNavigation, 
  ResponsiveVisualization,
  ResponsiveGrid 
} from '../responsive';

// Mock data for wireframe demonstration (same as CharacterDashboardWireframe)
const mockCharacters = [
  {
    id: '1',
    name: 'Alex Morgan',
    role: 'Protagonist',
    importance: 'Main',
    image: 'https://via.placeholder.com/100',
    lastEdited: '2025-04-01T10:30:00Z',
    description: 'A determined journalist with a knack for uncovering conspiracies.',
    attributes: {
      physical: ['Athletic', 'Short brown hair', 'Green eyes'],
      personality: ['Curious', 'Persistent', 'Empathetic']
    }
  },
  {
    id: '2',
    name: 'Eleanor Frost',
    role: 'Antagonist',
    importance: 'Main',
    image: 'https://via.placeholder.com/100',
    lastEdited: '2025-04-02T14:45:00Z',
    description: 'A brilliant but ruthless corporate executive with hidden motives.',
    attributes: {
      physical: ['Tall', 'Blonde hair', 'Always impeccably dressed'],
      personality: ['Calculating', 'Charismatic', 'Manipulative']
    }
  },
  {
    id: '3',
    name: 'Marcus Chen',
    role: 'Ally',
    importance: 'Supporting',
    image: 'https://via.placeholder.com/100',
    lastEdited: '2025-04-03T09:15:00Z',
    description: 'A tech expert who helps the protagonist navigate digital challenges.',
    attributes: {
      physical: ['Glasses', 'Casual style', 'Constantly fidgeting'],
      personality: ['Brilliant', 'Anxious', 'Loyal']
    }
  },
  {
    id: '4',
    name: 'Sophia Kim',
    role: 'Mentor',
    importance: 'Supporting',
    image: 'https://via.placeholder.com/100',
    lastEdited: '2025-04-05T16:20:00Z',
    description: 'A former journalist who guides the protagonist through difficult situations.',
    attributes: {
      physical: ['Gray-streaked hair', 'Warm smile', 'Business casual attire'],
      personality: ['Wise', 'Patient', 'Occasionally cynical']
    }
  },
  {
    id: '5',
    name: 'Detective Rivera',
    role: 'Ally/Obstacle',
    importance: 'Supporting',
    image: 'https://via.placeholder.com/100',
    lastEdited: '2025-04-07T11:10:00Z',
    description: 'A by-the-book detective who sometimes helps and sometimes hinders the protagonist.',
    attributes: {
      physical: ['Weathered face', 'Always in a suit', 'Perpetually tired'],
      personality: ['Methodical', 'Skeptical', 'Principled']
    }
  },
  {
    id: '6',
    name: 'Thomas Wright',
    role: 'Secondary Antagonist',
    importance: 'Supporting',
    image: 'https://via.placeholder.com/100',
    lastEdited: '2025-04-08T13:50:00Z',
    description: 'A security chief working for the main antagonist.',
    attributes: {
      physical: ['Muscular', 'Military haircut', 'Scar on left cheek'],
      personality: ['Disciplined', 'Ruthless', 'Loyal to employer']
    }
  }
];

// Mobile relationship visualization component
const MobileRelationshipMap = ({ characters }) => {
  const [expandedCharacter, setExpandedCharacter] = useState(null);
  
  // Find a character by ID
  const getCharacter = (id) => characters.find(char => char.id === id);
  
  // Toggle expanded character
  const toggleCharacter = (id) => {
    setExpandedCharacter(expandedCharacter === id ? null : id);
  };
  
  // Mock relationship data (in a real implementation, this would come from backend)
  const relationships = [
    { source: '1', target: '2', type: 'Nemesis' },
    { source: '1', target: '3', type: 'Friend' },
    { source: '1', target: '4', type: 'Mentee' },
    { source: '1', target: '5', type: 'Professional' },
    { source: '2', target: '6', type: 'Boss' },
    { source: '3', target: '4', type: 'Acquaintance' },
    { source: '5', target: '2', type: 'Investigation' }
  ];
  
  // Get relationships for a specific character
  const getRelationshipsForCharacter = (characterId) => {
    return relationships.filter(
      rel => rel.source === characterId || rel.target === characterId
    ).map(rel => {
      const otherCharacterId = rel.source === characterId ? rel.target : rel.source;
      const otherCharacter = getCharacter(otherCharacterId);
      return {
        character: otherCharacter,
        type: rel.type,
        direction: rel.source === characterId ? 'outgoing' : 'incoming'
      };
    });
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-2">Character Relationships</h3>
      <p className="text-sm text-gray-500 mb-4">Select a character to see their relationships</p>
      
      {/* Character list with expandable sections */}
      <div className="space-y-2">
        {characters.map(character => (
          <div key={character.id} className="border rounded-lg overflow-hidden">
            <button 
              className="w-full text-left p-3 bg-white hover:bg-gray-50 flex justify-between items-center"
              onClick={() => toggleCharacter(character.id)}
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden mr-3">
                  <img src={character.image} alt={character.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-medium">{character.name}</h4>
                  <span className="text-sm text-gray-500">{character.role}</span>
                </div>
              </div>
              <svg 
                className={`w-5 h-5 transform transition-transform ${expandedCharacter === character.id ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {/* Expanded relationship section */}
            {expandedCharacter === character.id && (
              <div className="border-t p-3 bg-gray-50">
                <h5 className="font-medium mb-2">Relationships:</h5>
                {getRelationshipsForCharacter(character.id).length > 0 ? (
                  <ul className="space-y-2">
                    {getRelationshipsForCharacter(character.id).map((rel, idx) => (
                      <li key={idx} className="flex items-start">
                        <div className="w-8 h-8 bg-gray-200 rounded-full overflow-hidden mr-2 flex-shrink-0">
                          <img src={rel.character.image} alt={rel.character.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <div className="font-medium">{rel.character.name}</div>
                          <div className="text-sm">
                            <span className="text-gray-500">{rel.type} </span>
                            <span className="text-xs bg-gray-200 rounded px-1">
                              {rel.direction === 'outgoing' ? 'to' : 'from'}
                            </span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">No relationships defined</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const ResponsiveCharacterDashboardWireframe = () => {
  const [activeView, setActiveView] = useState('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterImportance, setFilterImportance] = useState('');
  const [selectedCharacter, setSelectedCharacter] = useState(null);

  // Navigation items for view switching
  const navigationItems = [
    { id: 'list', label: 'List View' },
    { id: 'gallery', label: 'Gallery View' },
    { id: 'relationships', label: 'Relationship Map' }
  ];

  // Filtered characters based on search and filters
  const filteredCharacters = mockCharacters.filter(character => {
    const matchesSearch = searchTerm === '' || 
      character.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      character.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === '' || character.role === filterRole;
    const matchesImportance = filterImportance === '' || character.importance === filterImportance;
    
    return matchesSearch && matchesRole && matchesImportance;
  });

  const handleCharacterSelect = (character) => {
    setSelectedCharacter(character);
    // In a real implementation, this might navigate to a character detail page
    // or open a modal with character details
    console.log('Selected character:', character);
  };

  return (
    <ResponsiveContainer>
      <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-primary-700">Character Management</h1>
      
      {/* Dashboard Header with Controls */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-4 md:mb-6">
        <div className="flex flex-col space-y-4 mb-4">
          {/* View Navigation */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <ResponsiveNavigation 
              items={navigationItems}
              onSelect={setActiveView}
              activeItem={activeView}
            />
            
            <button className="btn-success w-full md:w-auto">
              Add New Character
            </button>
          </div>
          
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow">
              <input
                type="text"
                placeholder="Search characters..."
                className="input-field w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <select 
                className="input-field w-full sm:w-auto"
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
              >
                <option value="">All Roles</option>
                <option value="Protagonist">Protagonist</option>
                <option value="Antagonist">Antagonist</option>
                <option value="Ally">Ally</option>
                <option value="Mentor">Mentor</option>
                <option value="Ally/Obstacle">Ally/Obstacle</option>
                <option value="Secondary Antagonist">Secondary Antagonist</option>
              </select>
              
              <select 
                className="input-field w-full sm:w-auto"
                value={filterImportance}
                onChange={(e) => setFilterImportance(e.target.value)}
              >
                <option value="">All Importance</option>
                <option value="Main">Main</option>
                <option value="Supporting">Supporting</option>
                <option value="Minor">Minor</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      {/* Character View Content */}
      <div className="bg-white rounded-lg shadow-md p-4">
        {activeView === 'list' && (
          <CharacterListViewWireframe 
            characters={filteredCharacters} 
            onSelectCharacter={handleCharacterSelect} 
          />
        )}
        
        {activeView === 'gallery' && (
          <CharacterGalleryViewWireframe 
            characters={filteredCharacters} 
            onSelectCharacter={handleCharacterSelect} 
          />
        )}
        
        {activeView === 'relationships' && (
          <ResponsiveVisualization 
            desktopVisualization={<CharacterRelationshipMapWireframe characters={mockCharacters} />}
            mobileVisualization={<MobileRelationshipMap characters={mockCharacters} />}
            withToggle={true} // For demonstration purposes
          />
        )}
      </div>
      
      {/* Status Bar */}
      <div className="mt-3 text-sm text-gray-500 flex flex-col sm:flex-row justify-between">
        <span>{filteredCharacters.length} characters</span>
        <span>Last updated: {new Date().toLocaleDateString()}</span>
      </div>
    </ResponsiveContainer>
  );
};

export default ResponsiveCharacterDashboardWireframe;
