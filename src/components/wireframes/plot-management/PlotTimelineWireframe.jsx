import React from 'react';

const PlotTimelineWireframe = ({ plotElements, onSelectPlotElement }) => {
  // Sort plot elements by position to ensure proper timeline order
  const sortedElements = [...plotElements].sort((a, b) => a.position - b.position);
  
  // Segment the timeline into story sections
  const getSection = (position) => {
    if (position < 0.25) return 'Exposition';
    if (position < 0.50) return 'Rising Action';
    if (position < 0.75) return 'Climax';
    if (position < 0.9) return 'Falling Action';
    return 'Resolution';
  };

  // Group elements by section
  const groupedElements = sortedElements.reduce((acc, element) => {
    const section = getSection(element.position);
    if (!acc[section]) acc[section] = [];
    acc[section].push(element);
    return acc;
  }, {});

  // Get color based on element type
  const getTypeColor = (type) => {
    const colorMap = {
      'Major Plot Point': 'bg-blue-100 border-blue-500 text-blue-700',
      'Character Arc': 'bg-purple-100 border-purple-500 text-purple-700',
      'Subplot': 'bg-green-100 border-green-500 text-green-700',
      'Conflict': 'bg-red-100 border-red-500 text-red-700',
      'Revelation': 'bg-yellow-100 border-yellow-500 text-yellow-700',
      'Climax': 'bg-rose-100 border-rose-500 text-rose-700',
      'Resolution': 'bg-teal-100 border-teal-500 text-teal-700',
    };
    return colorMap[type] || 'bg-gray-100 border-gray-500 text-gray-700';
  };

  return (
    <div className="plot-timeline">
      {/* Timeline header */}
      <div className="flex justify-between mb-8 text-center text-sm font-medium">
        {['Exposition', 'Rising Action', 'Climax', 'Falling Action', 'Resolution'].map(section => (
          <div key={section} className="flex-1 bg-gray-200 p-2 mx-1 rounded">
            {section}
          </div>
        ))}
      </div>
      
      {/* Timeline visualization */}
      <div className="relative">
        <div className="absolute h-2 bg-gray-300 top-4 left-0 right-0 z-0 rounded-full"></div>
        
        <div className="relative z-10 flex justify-between mb-10">
          {sortedElements.map(element => (
            <div 
              key={element.id}
              className="flex flex-col items-center"
              style={{ 
                position: 'absolute', 
                left: `${element.position * 100}%`, 
                transform: 'translateX(-50%)' 
              }}
            >
              <div 
                className="w-4 h-4 rounded-full border-2 border-primary-500 bg-white cursor-pointer hover:scale-125 transition-transform"
                onClick={() => onSelectPlotElement(element)}
              ></div>
              <div className="mt-2 text-xs text-gray-500">Ch.{element.chapter}</div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Timeline elements by section */}
      <div className="mt-6">
        {Object.entries(groupedElements).map(([section, elements]) => (
          <div key={section} className="mb-8">
            <h3 className="text-lg font-semibold mb-3 text-primary-700">{section}</h3>
            <div className="space-y-3">
              {elements.map(element => (
                <div 
                  key={element.id} 
                  className={`p-3 border-l-4 rounded-r-md cursor-pointer shadow-sm hover:shadow-md transition-shadow ${getTypeColor(element.type)}`}
                  onClick={() => onSelectPlotElement(element)}
                >
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium">{element.title}</h4>
                    <span className="text-xs px-2 py-1 bg-white rounded-full">{element.type}</span>
                  </div>
                  <p className="text-sm mt-1">{element.description}</p>
                  <div className="flex justify-between items-center mt-2 text-xs text-gray-600">
                    <span>Chapter {element.chapter}</span>
                    <span>Impact: {element.impact}</span>
                    <span>{new Date(element.lastEdited).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {/* Timeline legend */}
      <div className="mt-10 p-3 bg-gray-50 rounded-md border border-gray-200">
        <h3 className="text-sm font-medium mb-2">Legend</h3>
        <div className="flex flex-wrap gap-2">
          {['Major Plot Point', 'Character Arc', 'Subplot', 'Conflict', 'Revelation', 'Climax', 'Resolution'].map(type => (
            <div key={type} className="flex items-center">
              <div className={`w-3 h-3 rounded-sm ${getTypeColor(type).split(' ')[0]} border ${getTypeColor(type).split(' ')[1]}`}></div>
              <span className="text-xs ml-1">{type}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlotTimelineWireframe;
