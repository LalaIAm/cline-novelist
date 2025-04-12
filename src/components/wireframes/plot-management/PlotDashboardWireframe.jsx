import React, { useState } from 'react';
import PlotTimelineWireframe from './PlotTimelineWireframe';
import PlotStructureWireframe from './PlotStructureWireframe';
import PlotSceneOrganizationWireframe from './PlotSceneOrganizationWireframe';

// Mock data for wireframe demonstration
const mockPlotElements = [
  {
    id: '1',
    type: 'Major Plot Point',
    title: 'Discovery of Corporate Conspiracy',
    description: 'Alex discovers documents linking Frost Industries to illegal experiments.',
    chapter: 5,
    position: 0.25, // Represents position in the narrative (0-1)
    relatedCharacters: ['1', '2'], // References character IDs
    lastEdited: '2025-04-03T14:30:00Z',
    notes: 'This is the inciting incident that drives the main plot forward.',
    impact: 'High',
  },
  {
    id: '2',
    type: 'Character Arc',
    title: 'Alex Confronts Fear of Authority',
    description: 'Alex must overcome reluctance to challenge powerful figures.',
    chapter: 8,
    position: 0.35,
    relatedCharacters: ['1'],
    lastEdited: '2025-04-04T10:15:00Z',
    notes: 'Character development moment that allows the protagonist to grow.',
    impact: 'Medium',
  },
  {
    id: '3',
    type: 'Subplot',
    title: 'Marcus\'s Security System Hack',
    description: 'Marcus works to bypass Frost Industries security system.',
    chapter: 10,
    position: 0.45,
    relatedCharacters: ['1', '3'],
    lastEdited: '2025-04-05T16:45:00Z',
    notes: 'Provides tension and technical challenges that test the characters.',
    impact: 'Medium',
  },
  {
    id: '4',
    type: 'Conflict',
    title: 'Eleanor Discovers Alex\'s Investigation',
    description: 'Eleanor realizes Alex is investigating the company and sets a trap.',
    chapter: 12,
    position: 0.55,
    relatedCharacters: ['1', '2'],
    lastEdited: '2025-04-06T09:30:00Z',
    notes: 'Raises the stakes and puts the protagonist in danger.',
    impact: 'High',
  },
  {
    id: '5',
    type: 'Revelation',
    title: 'Sophia\'s True Identity',
    description: 'Alex discovers Sophia once worked for Frost Industries.',
    chapter: 15,
    position: 0.65,
    relatedCharacters: ['1', '4'],
    lastEdited: '2025-04-07T11:20:00Z',
    notes: 'Plot twist that complicates the protagonist\'s trust in her mentor.',
    impact: 'High',
  },
  {
    id: '6',
    type: 'Climax',
    title: 'Confrontation at Frost Industries HQ',
    description: 'Alex confronts Eleanor with evidence at the corporate gala.',
    chapter: 25,
    position: 0.9,
    relatedCharacters: ['1', '2', '3', '5'],
    lastEdited: '2025-04-08T15:10:00Z',
    notes: 'The final confrontation that resolves the main conflict.',
    impact: 'Very High',
  },
  {
    id: '7',
    type: 'Resolution',
    title: 'Aftermath and New Beginning',
    description: 'Alex publishes the exposé and considers next steps in career.',
    chapter: 28,
    position: 0.98,
    relatedCharacters: ['1', '3', '4'],
    lastEdited: '2025-04-09T13:40:00Z',
    notes: 'Wraps up the story and hints at future possibilities.',
    impact: 'Medium',
  }
];

// Mock scenes data
const mockScenes = [
  {
    id: '101',
    title: 'Newsroom Introduction',
    description: 'Alex at work in the busy newsroom, establishing character and setting.',
    chapter: 1,
    position: 0.05,
    plotElements: [],
    characters: ['1'],
    lastEdited: '2025-04-01T09:30:00Z',
    wordCount: 850,
    status: 'Completed',
  },
  {
    id: '102',
    title: 'Meeting with Anonymous Source',
    description: 'Alex meets a whistleblower who provides the first clue about Frost Industries.',
    chapter: 3,
    position: 0.15,
    plotElements: [],
    characters: ['1'],
    lastEdited: '2025-04-01T14:20:00Z',
    wordCount: 1200,
    status: 'Completed',
  },
  {
    id: '103',
    title: 'Discovery of Documents',
    description: 'Alex finds incriminating documents linking Frost Industries to illegal activities.',
    chapter: 5,
    position: 0.25,
    plotElements: ['1'],
    characters: ['1'],
    lastEdited: '2025-04-03T10:45:00Z',
    wordCount: 1450,
    status: 'Completed',
  },
  {
    id: '104',
    title: 'First Encounter with Eleanor',
    description: 'Alex interviews Eleanor Frost, establishing their antagonistic relationship.',
    chapter: 7,
    position: 0.3,
    plotElements: [],
    characters: ['1', '2'],
    lastEdited: '2025-04-03T16:15:00Z',
    wordCount: 1680,
    status: 'Needs Revision',
  },
  {
    id: '105',
    title: 'Recruiting Marcus for Help',
    description: 'Alex convinces Marcus to help hack into Frost Industries systems.',
    chapter: 9,
    position: 0.4,
    plotElements: ['3'],
    characters: ['1', '3'],
    lastEdited: '2025-04-04T11:30:00Z',
    wordCount: 1100,
    status: 'Draft',
  },
  {
    id: '106',
    title: 'Eleanor Discovers Investigation',
    description: 'Eleanor finds out about Alex\'s investigation and begins plotting against them.',
    chapter: 12,
    position: 0.55,
    plotElements: ['4'],
    characters: ['2', '6'],
    lastEdited: '2025-04-06T09:45:00Z',
    wordCount: 900,
    status: 'Draft',
  },
  {
    id: '107',
    title: 'Confrontation at Gala',
    description: 'Alex confronts Eleanor with evidence at the corporate gala.',
    chapter: 25,
    position: 0.9,
    plotElements: ['6'],
    characters: ['1', '2', '3', '5'],
    lastEdited: '2025-04-07T14:20:00Z',
    wordCount: 2200,
    status: 'Outline',
  }
];

const PlotDashboardWireframe = () => {
  const [activeView, setActiveView] = useState('timeline');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterImpact, setFilterImpact] = useState('');
  const [selectedPlotElement, setSelectedPlotElement] = useState(null);

  // Filtered plot elements based on search and filters
  const filteredPlotElements = mockPlotElements.filter(element => {
    const matchesSearch = searchTerm === '' || 
      element.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      element.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === '' || element.type === filterType;
    const matchesImpact = filterImpact === '' || element.impact === filterImpact;
    
    return matchesSearch && matchesType && matchesImpact;
  });

  const handlePlotElementSelect = (element) => {
    setSelectedPlotElement(element);
    // In a real implementation, this might navigate to a detail page
    // or open a modal with plot element details
    console.log('Selected plot element:', element);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-primary-700">Plot Management</h1>
      
      {/* Dashboard Header with Controls */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <div className="flex flex-wrap gap-2">
            <button 
              className={`px-4 py-2 rounded-md ${activeView === 'timeline' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-800'}`}
              onClick={() => setActiveView('timeline')}
            >
              Timeline View
            </button>
            <button 
              className={`px-4 py-2 rounded-md ${activeView === 'structure' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-800'}`}
              onClick={() => setActiveView('structure')}
            >
              Structure View
            </button>
            <button 
              className={`px-4 py-2 rounded-md ${activeView === 'scenes' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-800'}`}
              onClick={() => setActiveView('scenes')}
            >
              Scene Organization
            </button>
          </div>
          
          <button className="btn-success">
            Add Plot Element
          </button>
        </div>
        
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <input
              type="text"
              placeholder="Search plot elements..."
              className="input-field w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <select 
              className="input-field"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="">All Types</option>
              <option value="Major Plot Point">Major Plot Point</option>
              <option value="Character Arc">Character Arc</option>
              <option value="Subplot">Subplot</option>
              <option value="Conflict">Conflict</option>
              <option value="Revelation">Revelation</option>
              <option value="Climax">Climax</option>
              <option value="Resolution">Resolution</option>
            </select>
            
            <select 
              className="input-field"
              value={filterImpact}
              onChange={(e) => setFilterImpact(e.target.value)}
            >
              <option value="">All Impact Levels</option>
              <option value="Very High">Very High</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Plot View Content */}
      <div className="bg-white rounded-lg shadow-md p-4">
        {activeView === 'timeline' && (
          <PlotTimelineWireframe 
            plotElements={filteredPlotElements} 
            onSelectPlotElement={handlePlotElementSelect} 
          />
        )}
        
        {activeView === 'structure' && (
          <PlotStructureWireframe 
            plotElements={filteredPlotElements} 
            onSelectPlotElement={handlePlotElementSelect} 
          />
        )}
        
        {activeView === 'scenes' && (
          <PlotSceneOrganizationWireframe 
            scenes={mockScenes}
            plotElements={mockPlotElements}
          />
        )}
      </div>
      
      {/* Status Bar */}
      <div className="mt-4 text-sm text-gray-500 flex justify-between">
        <span>{filteredPlotElements.length} plot elements</span>
        <span>Last updated: {new Date().toLocaleDateString()}</span>
      </div>
    </div>
  );
};

export default PlotDashboardWireframe;
