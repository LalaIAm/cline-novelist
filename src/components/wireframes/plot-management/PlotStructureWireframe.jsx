import React, { useState } from 'react';

const PlotStructureWireframe = ({ plotElements, onSelectPlotElement }) => {
  const [expandedAct, setExpandedAct] = useState('all');
  
  // Map plot positions to three-act structure
  const getAct = (position) => {
    if (position < 0.30) return "Act I: Setup";
    if (position < 0.75) return "Act II: Confrontation";
    return "Act III: Resolution";
  };

  // Group elements by act
  const groupedByAct = plotElements.reduce((acc, element) => {
    const act = getAct(element.position);
    if (!acc[act]) acc[act] = [];
    acc[act].push(element);
    return acc;
  }, {});

  // Sort elements within each act
  Object.keys(groupedByAct).forEach(act => {
    groupedByAct[act].sort((a, b) => a.position - b.position);
  });

  // Determine specific plot structure beats
  const findBeat = (elements, type, position) => {
    return elements.find(e => 
      e.type === type && 
      Math.abs(e.position - position) < 0.1
    );
  };

  const getStructureBeat = (element) => {
    const pos = element.position;
    const type = element.type;
    
    if (pos < 0.05) return 'Exposition';
    if (pos >= 0.05 && pos < 0.12) return 'Inciting Incident';
    if (pos >= 0.12 && pos < 0.2) return 'First Plot Point';
    if (pos >= 0.2 && pos < 0.35) return 'First Pinch Point';
    if (pos >= 0.35 && pos < 0.45) return 'Midpoint';
    if (pos >= 0.45 && pos < 0.55) return 'Second Pinch Point';
    if (pos >= 0.55 && pos < 0.7) return 'Second Plot Point';
    if (pos >= 0.7 && pos < 0.85) return 'Climax';
    if (pos >= 0.85) return 'Resolution';
    
    return 'Development';
  };

  // Get card styling by beat type
  const getBeatStyle = (beat) => {
    const styleMap = {
      'Exposition': 'border-blue-300 bg-blue-50',
      'Inciting Incident': 'border-green-300 bg-green-50',
      'First Plot Point': 'border-purple-300 bg-purple-50',
      'First Pinch Point': 'border-amber-300 bg-amber-50',
      'Midpoint': 'border-red-300 bg-red-50',
      'Second Pinch Point': 'border-amber-300 bg-amber-50',
      'Second Plot Point': 'border-purple-300 bg-purple-50',
      'Climax': 'border-red-300 bg-red-50',
      'Resolution': 'border-teal-300 bg-teal-50',
      'Development': 'border-gray-300 bg-gray-50'
    };
    
    return styleMap[beat] || 'border-gray-300 bg-gray-50';
  };

  // Render the structure diagram
  return (
    <div className="plot-structure">
      {/* Act selectors */}
      <div className="flex justify-center gap-4 mb-8">
        <button 
          className={`px-4 py-2 rounded-md ${expandedAct === 'all' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-800'}`}
          onClick={() => setExpandedAct('all')}
        >
          All Acts
        </button>
        <button 
          className={`px-4 py-2 rounded-md ${expandedAct === 'Act I: Setup' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-800'}`}
          onClick={() => setExpandedAct('Act I: Setup')}
        >
          Act I: Setup
        </button>
        <button 
          className={`px-4 py-2 rounded-md ${expandedAct === 'Act II: Confrontation' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-800'}`}
          onClick={() => setExpandedAct('Act II: Confrontation')}
        >
          Act II: Confrontation
        </button>
        <button 
          className={`px-4 py-2 rounded-md ${expandedAct === 'Act III: Resolution' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-800'}`}
          onClick={() => setExpandedAct('Act III: Resolution')}
        >
          Act III: Resolution
        </button>
      </div>
      
      {/* Three-act structure visualization */}
      <div className="relative mb-6 h-8">
        <div className="flex h-full">
          <div 
            className={`bg-blue-200 flex-grow-0 flex-shrink-0 flex items-center justify-center ${expandedAct === 'Act I: Setup' || expandedAct === 'all' ? 'basis-3/12' : 'basis-1/12'}`}
            style={{ transition: 'flex-basis 0.3s ease' }}
          >
            <span className="text-xs font-medium">Act I: Setup</span>
          </div>
          <div 
            className={`bg-purple-200 flex-grow-0 flex-shrink-0 flex items-center justify-center ${expandedAct === 'Act II: Confrontation' || expandedAct === 'all' ? 'basis-6/12' : 'basis-1/12'}`}
            style={{ transition: 'flex-basis 0.3s ease' }}
          >
            <span className="text-xs font-medium">Act II: Confrontation</span>
          </div>
          <div 
            className={`bg-teal-200 flex-grow-0 flex-shrink-0 flex items-center justify-center ${expandedAct === 'Act III: Resolution' || expandedAct === 'all' ? 'basis-3/12' : 'basis-1/12'}`}
            style={{ transition: 'flex-basis 0.3s ease' }}
          >
            <span className="text-xs font-medium">Act III: Resolution</span>
          </div>
        </div>
      </div>
      
      {/* Act content */}
      {Object.entries(groupedByAct).map(([act, elements]) => {
        // Only show the selected act, or all acts if 'all' is selected
        if (expandedAct !== 'all' && act !== expandedAct) return null;
        
        return (
          <div key={act} className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-primary-700">{act}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {elements.map(element => {
                const beat = getStructureBeat(element);
                const beatStyle = getBeatStyle(beat);
                
                return (
                  <div 
                    key={element.id}
                    className={`border-l-4 rounded shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow ${beatStyle}`}
                    onClick={() => onSelectPlotElement(element)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{element.title}</h4>
                      <span className="text-xs bg-white px-2 py-1 rounded-full border border-gray-200">{beat}</span>
                    </div>
                    
                    <p className="text-sm mb-3">{element.description}</p>
                    
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>Chapter {element.chapter}</span>
                      <span>{element.type}</span>
                      <span>Impact: {element.impact}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
      
      {/* Structure Guide */}
      <div className="mt-8 p-4 bg-gray-50 rounded-md border border-gray-200">
        <h3 className="text-sm font-medium mb-2">Three-Act Structure Guide</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <h4 className="font-medium text-blue-700">Act I: Setup (0-25%)</h4>
            <ul className="list-disc ml-4 mt-1 space-y-1">
              <li>Exposition</li>
              <li>Inciting Incident</li>
              <li>First Plot Point</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-purple-700">Act II: Confrontation (25-75%)</h4>
            <ul className="list-disc ml-4 mt-1 space-y-1">
              <li>First Pinch Point</li>
              <li>Midpoint</li>
              <li>Second Pinch Point</li>
              <li>Second Plot Point</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-teal-700">Act III: Resolution (75-100%)</h4>
            <ul className="list-disc ml-4 mt-1 space-y-1">
              <li>Climax</li>
              <li>Resolution</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlotStructureWireframe;
