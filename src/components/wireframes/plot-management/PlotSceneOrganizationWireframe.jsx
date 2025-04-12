import React, { useState } from 'react';

const PlotSceneOrganizationWireframe = ({ scenes, plotElements }) => {
  const [filterStatus, setFilterStatus] = useState('');
  const [filterChapter, setFilterChapter] = useState('');
  
  // Extract unique chapters for filtering
  const chapters = [...new Set(scenes.map(scene => scene.chapter))].sort((a, b) => a - b);
  
  // Filter scenes based on selected filters
  const filteredScenes = scenes.filter(scene => {
    const matchesStatus = filterStatus === '' || scene.status === filterStatus;
    const matchesChapter = filterChapter === '' || scene.chapter.toString() === filterChapter;
    return matchesStatus && matchesChapter;
  });
  
  // Sort scenes by chapter and position
  const sortedScenes = [...filteredScenes].sort((a, b) => {
    if (a.chapter !== b.chapter) return a.chapter - b.chapter;
    return a.position - b.position;
  });
  
  // Group scenes by chapter
  const scenesByChapter = sortedScenes.reduce((acc, scene) => {
    const chapter = scene.chapter;
    if (!acc[chapter]) acc[chapter] = [];
    acc[chapter].push(scene);
    return acc;
  }, {});
  
  // Find related plot elements for a scene
  const getPlotElementsForScene = (scene) => {
    if (!scene.plotElements || scene.plotElements.length === 0) return [];
    
    return scene.plotElements.map(elementId => 
      plotElements.find(element => element.id === elementId)
    ).filter(Boolean); // Filter out any undefined elements
  };
  
  // Get status color
  const getStatusColor = (status) => {
    const colorMap = {
      'Completed': 'bg-green-100 text-green-800 border-green-200',
      'Draft': 'bg-blue-100 text-blue-800 border-blue-200',
      'Outline': 'bg-purple-100 text-purple-800 border-purple-200',
      'Needs Revision': 'bg-amber-100 text-amber-800 border-amber-200',
      'Not Started': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="scene-organization">
      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-grow">
          <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Chapter:</label>
          <select
            className="input-field w-full"
            value={filterChapter}
            onChange={(e) => setFilterChapter(e.target.value)}
          >
            <option value="">All Chapters</option>
            {chapters.map(chapter => (
              <option key={chapter} value={chapter.toString()}>Chapter {chapter}</option>
            ))}
          </select>
        </div>
        
        <div className="flex-grow">
          <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Status:</label>
          <select
            className="input-field w-full"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="Completed">Completed</option>
            <option value="Draft">Draft</option>
            <option value="Outline">Outline</option>
            <option value="Needs Revision">Needs Revision</option>
            <option value="Not Started">Not Started</option>
          </select>
        </div>
      </div>
      
      {/* Scene Organization by Chapter */}
      <div className="scene-chapters space-y-8">
        {Object.entries(scenesByChapter).map(([chapter, chapterScenes]) => (
          <div key={chapter} className="chapter-group">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xl font-semibold text-primary-700">Chapter {chapter}</h3>
              <button className="text-sm text-primary-600 hover:text-primary-700">
                + Add Scene to Chapter {chapter}
              </button>
            </div>
            
            {/* Timeline visualization for this chapter */}
            <div className="relative mb-4 h-6 bg-gray-100 rounded-full overflow-hidden">
              {chapterScenes.map(scene => (
                <div 
                  key={scene.id}
                  className={`absolute h-full ${getStatusColor(scene.status).split(' ')[0]}`}
                  style={{ 
                    left: `${Math.max(0, (scene.position * 100) - 12.5)}%`, 
                    width: '25%',
                    opacity: 0.7
                  }}
                ></div>
              ))}
            </div>
            
            {/* Scene cards */}
            <div className="space-y-4">
              {chapterScenes.map(scene => {
                const relatedPlotElements = getPlotElementsForScene(scene);
                
                return (
                  <div key={scene.id} className="border rounded-md shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between border-b p-3">
                      <h4 className="font-medium">{scene.title}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(scene.status)}`}>
                        {scene.status}
                      </span>
                    </div>
                    
                    <div className="p-3">
                      <p className="text-sm text-gray-700 mb-3">{scene.description}</p>
                      
                      {/* Scene metadata */}
                      <div className="flex justify-between text-xs text-gray-500 mb-2">
                        <span>Word Count: {scene.wordCount}</span>
                        <span>Last Edited: {new Date(scene.lastEdited).toLocaleDateString()}</span>
                      </div>
                      
                      {/* Related plot elements */}
                      {relatedPlotElements.length > 0 && (
                        <div className="mt-3">
                          <h5 className="text-xs font-medium mb-1">Related Plot Elements:</h5>
                          <div className="flex flex-wrap gap-2">
                            {relatedPlotElements.map(element => (
                              <span 
                                key={element.id}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800"
                              >
                                {element.title}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Characters in scene */}
                      {scene.characters && scene.characters.length > 0 && (
                        <div className="mt-3">
                          <h5 className="text-xs font-medium mb-1">Characters:</h5>
                          <div className="flex flex-wrap gap-1">
                            {scene.characters.map(charId => (
                              <span 
                                key={charId}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary-100 text-primary-800"
                              >
                                Character #{charId}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Card actions */}
                    <div className="border-t px-3 py-2 bg-gray-50 flex justify-end gap-2">
                      <button className="text-xs text-primary-600 hover:text-primary-800">Edit</button>
                      <button className="text-xs text-gray-500 hover:text-gray-700">Move</button>
                      <button className="text-xs text-red-600 hover:text-red-800">Delete</button>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* End of chapter */}
            <div className="mt-4 border-b border-dashed border-gray-300"></div>
          </div>
        ))}
      </div>
      
      {/* Empty state */}
      {Object.keys(scenesByChapter).length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No scenes found</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new scene.</p>
          <div className="mt-6">
            <button className="btn-primary">Add New Scene</button>
          </div>
        </div>
      )}
      
      {/* Summary statistics */}
      <div className="mt-8 p-3 bg-gray-50 rounded-md border border-gray-200">
        <h3 className="text-sm font-medium mb-2">Scene Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-xl font-bold text-primary-600">{sortedScenes.length}</div>
            <div className="text-xs text-gray-500">Total Scenes</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-green-600">
              {sortedScenes.filter(s => s.status === 'Completed').length}
            </div>
            <div className="text-xs text-gray-500">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-blue-600">
              {sortedScenes.filter(s => s.status === 'Draft').length}
            </div>
            <div className="text-xs text-gray-500">In Draft</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-amber-600">
              {sortedScenes.filter(s => s.status === 'Needs Revision').length}
            </div>
            <div className="text-xs text-gray-500">Needs Revision</div>
          </div>
        </div>
        
        <div className="mt-4 pt-3 border-t border-gray-200">
          <div className="text-sm">Total Word Count: <span className="font-bold">
            {sortedScenes.reduce((total, scene) => total + scene.wordCount, 0).toLocaleString()}
          </span></div>
        </div>
      </div>
    </div>
  );
};

export default PlotSceneOrganizationWireframe;
