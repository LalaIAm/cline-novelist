import React, { useState } from 'react';
import CharacterListViewWireframe from './CharacterListViewWireframe';
import CharacterGalleryViewWireframe from './CharacterGalleryViewWireframe';
import CharacterRelationshipMapWireframe from './CharacterRelationshipMapWireframe';

// Mock data for wireframe demonstration
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

const CharacterDashboardWireframe = () => {
  const [activeView, setActiveView] = useState('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterImportance, setFilterImportance] = useState('');
  const [selectedCharacter, setSelectedCharacter] = useState(null);

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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-primary-700">Character Management</h1>
      
      {/* Dashboard Header with Controls */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <div className="flex flex-wrap gap-2">
            <button 
              className={`px-4 py-2 rounded-md ${activeView === 'list' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-800'}`}
              onClick={() => setActiveView('list')}
            >
              List View
            </button>
            <button 
              className={`px-4 py-2 rounded-md ${activeView === 'gallery' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-800'}`}
              onClick={() => setActiveView('gallery')}
            >
              Gallery View
            </button>
            <button 
              className={`px-4 py-2 rounded-md ${activeView === 'relationships' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-800'}`}
              onClick={() => setActiveView('relationships')}
            >
              Relationship Map
            </button>
          </div>
          
          <button className="btn-success">
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
          
          <div className="flex gap-2">
            <select 
              className="input-field"
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
              className="input-field"
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
          <CharacterRelationshipMapWireframe characters={mockCharacters} />
        )}
      </div>
      
      {/* Status Bar */}
      <div className="mt-4 text-sm text-gray-500 flex justify-between">
        <span>{filteredCharacters.length} characters</span>
        <span>Last updated: {new Date().toLocaleDateString()}</span>
      </div>
    </div>
  );
};

export default CharacterDashboardWireframe;
