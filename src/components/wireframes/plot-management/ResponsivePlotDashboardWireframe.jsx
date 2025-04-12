import React, { useState } from 'react';
import PlotTimelineWireframe from './PlotTimelineWireframe';
import PlotStructureWireframe from './PlotStructureWireframe';
import PlotSceneOrganizationWireframe from './PlotSceneOrganizationWireframe';
import { 
  ResponsiveContainer, 
  ResponsiveNavigation, 
  ResponsiveVisualization 
} from '../responsive';

// Mock data for wireframe demonstration (same as PlotDashboardWireframe)
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

// Mobile timeline visualization component
const MobileTimelineVisualization = ({ plotElements, onSelectPlotElement }) => {
  // Sort elements by position
  const sortedElements = [...plotElements].sort((a, b) => a.position - b.position);
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-2">Plot Timeline</h3>
      <p className="text-sm text-gray-500 mb-4">Plot points in chronological order</p>
      
      {/* Timeline visualization */}
      <div className="relative pl-6 space-y-6">
        {/* Vertical line */}
        <div className="absolute top-0 bottom-0 left-2 w-0.5 bg-gray-300"></div>
        
        {sortedElements.map((element, index) => (
          <div 
            key={element.id} 
            className="relative"
            onClick={() => onSelectPlotElement(element)}
          >
            {/* Timeline dot */}
            <div className={`absolute -left-6 w-4 h-4 rounded-full border-2 border-white ${
              element.impact === 'Very High' ? 'bg-red-500' :
              element.impact === 'High' ? 'bg-orange-500' :
              element.impact === 'Medium' ? 'bg-blue-500' : 'bg-green-500'
            }`}></div>
            
            {/* Chapter indicator */}
            <div className="absolute -left-14 top-0 text-xs font-medium text-gray-500">Ch. {element.chapter}</div>
            
            {/* Content card */}
            <div className="bg-white border rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex justify-between mb-1">
                <span className="text-xs px-2 py-0.5 bg-gray-100 rounded">{element.type}</span>
                <span className={`text-xs px-2 py-0.5 rounded ${
                  element.impact === 'Very High' ? 'bg-red-100 text-red-800' :
                  element.impact === 'High' ? 'bg-orange-100 text-orange-800' :
                  element.impact === 'Medium' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                }`}>{element.impact}</span>
              </div>
              <h4 className="font-medium">{element.title}</h4>
              <p className="text-sm text-gray-600 line-clamp-2">{element.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Mobile structure visualization component
const MobileStructureVisualization = ({ plotElements, onSelectPlotElement }) => {
  const [expandedAct, setExpandedAct] = useState('act1');
  
  // Helper to toggle expanded act
  const toggleAct = (act) => {
    setExpandedAct(expandedAct === act ? null : act);
  };
  
  // Group elements into acts based on position
  const act1Elements = plotElements.filter(element => element.position < 0.35);
  const act2Elements = plotElements.filter(element => element.position >= 0.35 && element.position < 0.75);
  const act3Elements = plotElements.filter(element => element.position >= 0.75);
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-2">Plot Structure</h3>
      <p className="text-sm text-gray-500 mb-4">Three-act structure breakdown</p>
      
      {/* Act 1 */}
      <div className="border rounded-lg overflow-hidden">
        <button 
          className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 flex justify-between items-center"
          onClick={() => toggleAct('act1')}
        >
          <div>
            <h4 className="font-medium">Act 1: Setup</h4>
            <span className="text-sm text-gray-600">{act1Elements.length} plot elements</span>
          </div>
          <svg 
            className={`w-5 h-5 transform transition-transform ${expandedAct === 'act1' ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {expandedAct === 'act1' && (
          <div className="p-3 space-y-2">
            {act1Elements.length > 0 ? (
              act1Elements.map(element => (
                <div 
                  key={element.id}
                  className="p-2 border rounded hover:bg-gray-50 cursor-pointer"
                  onClick={() => onSelectPlotElement(element)}
                >
                  <div className="flex justify-between mb-1">
                    <span className="text-xs px-2 py-0.5 bg-gray-100 rounded">{element.type}</span>
                  </div>
                  <h5 className="font-medium">{element.title}</h5>
                  <p className="text-sm text-gray-600 line-clamp-1">{element.description}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 italic">No plot elements in Act 1</p>
            )}
          </div>
        )}
      </div>
      
      {/* Act 2 */}
      <div className="border rounded-lg overflow-hidden">
        <button 
          className="w-full text-left p-3 bg-purple-50 hover:bg-purple-100 flex justify-between items-center"
          onClick={() => toggleAct('act2')}
        >
          <div>
            <h4 className="font-medium">Act 2: Confrontation</h4>
            <span className="text-sm text-gray-600">{act2Elements.length} plot elements</span>
          </div>
          <svg 
            className={`w-5 h-5 transform transition-transform ${expandedAct === 'act2' ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {expandedAct === 'act2' && (
          <div className="p-3 space-y-2">
            {act2Elements.length > 0 ? (
              act2Elements.map(element => (
                <div 
                  key={element.id}
                  className="p-2 border rounded hover:bg-gray-50 cursor-pointer"
                  onClick={() => onSelectPlotElement(element)}
                >
                  <div className="flex justify-between mb-1">
                    <span className="text-xs px-2 py-0.5 bg-gray-100 rounded">{element.type}</span>
                  </div>
                  <h5 className="font-medium">{element.title}</h5>
                  <p className="text-sm text-gray-600 line-clamp-1">{element.description}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 italic">No plot elements in Act 2</p>
            )}
          </div>
        )}
      </div>
      
      {/* Act 3 */}
      <div className="border rounded-lg overflow-hidden">
        <button 
          className="w-full text-left p-3 bg-red-50 hover:bg-red-100 flex justify-between items-center"
          onClick={() => toggleAct('act3')}
        >
          <div>
            <h4 className="font-medium">Act 3: Resolution</h4>
            <span className="text-sm text-gray-600">{act3Elements.length} plot elements</span>
          </div>
          <svg 
            className={`w-5 h-5 transform transition-transform ${expandedAct === 'act3' ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {expandedAct === 'act3' && (
          <div className="p-3 space-y-2">
            {act3Elements.length > 0 ? (
              act3Elements.map(element => (
                <div 
                  key={element.id}
                  className="p-2 border rounded hover:bg-gray-50 cursor-pointer"
                  onClick={() => onSelectPlotElement(element)}
                >
                  <div className="flex justify-between mb-1">
                    <span className="text-xs px-2 py-0.5 bg-gray-100 rounded">{element.type}</span>
                  </div>
                  <h5 className="font-medium">{element.title}</h5>
                  <p className="text-sm text-gray-600 line-clamp-1">{element.description}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 italic">No plot elements in Act 3</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Mobile scene organization component
const MobileSceneOrganization = ({ scenes, plotElements }) => {
  const [expandedScene, setExpandedScene] = useState(null);
  
  // Toggle expanded scene
  const toggleScene = (sceneId) => {
    setExpandedScene(expandedScene === sceneId ? null : sceneId);
  };
  
  // Sort scenes by chapter
  const sortedScenes = [...scenes].sort((a, b) => a.chapter - b.chapter);
  
  // Helper to get plot element by ID
  const getPlotElement = (id) => plotElements.find(element => element.id === id);
  
  // Helper to get status style
  const getStatusStyle = (status) => {
    switch(status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Draft':
        return 'bg-blue-100 text-blue-800';
      case 'Outline':
        return 'bg-purple-100 text-purple-800';
      case 'Needs Revision':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-2">Scene Organization</h3>
      <p className="text-sm text-gray-500 mb-4">Scenes organized by chapter</p>
      
      {/* Scene list with expandable sections */}
      <div className="space-y-3">
        {sortedScenes.map(scene => (
          <div key={scene.id} className="border rounded-lg overflow-hidden">
            <button 
              className="w-full text-left p-3 bg-white hover:bg-gray-50 flex justify-between items-center"
              onClick={() => toggleScene(scene.id)}
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium">Chapter {scene.chapter}</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${getStatusStyle(scene.status)}`}>
                    {scene.status}
                  </span>
                </div>
                <h4 className="font-medium">{scene.title}</h4>
              </div>
              <svg 
                className={`w-5 h-5 transform transition-transform ${expandedScene === scene.id ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {/* Expanded scene details */}
            {expandedScene === scene.id && (
              <div className="border-t p-3 bg-gray-50">
                <p className="text-sm text-gray-600 mb-3">{scene.description}</p>
                
                <div className="flex justify-between text-sm text-gray-500 mb-3">
                  <span>{scene.wordCount} words</span>
                  <span>Last edited: {new Date(scene.lastEdited).toLocaleDateString()}</span>
                </div>
                
                {scene.plotElements && scene.plotElements.length > 0 ? (
                  <div className="mb-3">
                    <h5 className="text-sm font-medium mb-1">Related Plot Elements:</h5>
                    <div className="space-y-1">
                      {scene.plotElements.map(elementId => {
                        const element = getPlotElement(elementId);
                        return element ? (
                          <div key={elementId} className="text-sm p-2 bg-white border rounded">
                            {element.title}
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                ) : null}
                
                <div className="flex justify-end gap-2 mt-3">
                  <button className="text-sm px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded">
                    Edit
                  </button>
                  <button className="text-sm px-3 py-1 bg-primary-100 hover:bg-primary-200 text-primary-800 rounded">
                    View Scene
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const ResponsivePlotDashboardWireframe = () => {
  const [activeView, setActiveView] = useState('timeline');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterImpact, setFilterImpact] = useState('');
  const [selectedPlotElement, setSelectedPlotElement] = useState(null);

  // Navigation items for view switching
  const navigationItems = [
    { id: 'timeline', label: 'Timeline View' },
    { id: 'structure', label: 'Structure View' },
    { id: 'scenes', label: 'Scene Organization' }
  ];

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
    <ResponsiveContainer>
      <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-primary-700">Plot Management</h1>
      
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
            
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <select 
                className="input-field w-full sm:w-auto"
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
                className="input-field w-full sm:w-auto"
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
      </div>
      
      {/* Plot View Content */}
      <div className="bg-white rounded-lg shadow-md p-4">
        {activeView === 'timeline' && (
          <ResponsiveVisualization 
            desktopVisualization={
              <PlotTimelineWireframe 
                plotElements={filteredPlotElements} 
                onSelectPlotElement={handlePlotElementSelect} 
              />
            }
            mobileVisualization={
              <MobileTimelineVisualization 
                plotElements={filteredPlotElements} 
                onSelectPlotElement={handlePlotElementSelect} 
              />
            }
            withToggle={true} // For demonstration purposes
          />
        )}
        
        {activeView === 'structure' && (
          <ResponsiveVisualization 
            desktopVisualization={
              <PlotStructureWireframe 
                plotElements={filteredPlotElements} 
                onSelectPlotElement={handlePlotElementSelect} 
              />
            }
            mobileVisualization={
              <MobileStructureVisualization 
                plotElements={filteredPlotElements} 
                onSelectPlotElement={handlePlotElementSelect} 
              />
            }
            withToggle={true} // For demonstration purposes
          />
        )}
        
        {activeView === 'scenes' && (
          <ResponsiveVisualization 
            desktopVisualization={
              <PlotSceneOrganizationWireframe 
                scenes={mockScenes}
                plotElements={mockPlotElements}
              />
            }
            mobileVisualization={
              <MobileSceneOrganization 
                scenes={mockScenes}
                plotElements={mockPlotElements}
              />
            }
            withToggle={true} // For demonstration purposes
          />
        )}
      </div>
      
      {/* Status Bar */}
      <div className="mt-3 text-sm text-gray-500 flex flex-col sm:flex-row justify-between">
        <span>{filteredPlotElements.length} plot elements</span>
        <span>Last updated: {new Date().toLocaleDateString()}</span>
      </div>
    </ResponsiveContainer>
  );
};

export default ResponsivePlotDashboardWireframe;
