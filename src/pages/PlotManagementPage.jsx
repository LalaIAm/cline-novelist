import React, { useState } from 'react';
import PlotDashboardWireframe from '../components/wireframes/plot-management/PlotDashboardWireframe';
import PlotElementDetailWireframe from '../components/wireframes/plot-management/PlotElementDetailWireframe';

const PlotManagementPage = () => {
  const [view, setView] = useState('dashboard'); // 'dashboard' or 'detail'
  const [selectedPlotElement, setSelectedPlotElement] = useState(null);
  
  const handleSelectPlotElement = (plotElement) => {
    setSelectedPlotElement(plotElement);
    setView('detail');
  };
  
  const handleBackToDashboard = () => {
    setView('dashboard');
  };
  
  return (
    <div>
      <header className="bg-white shadow border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-900">Novylist</h1>
          <nav className="flex space-x-4">
            <button className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Dashboard</button>
            <button className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Characters</button>
            <button className="text-primary-600 hover:text-primary-800 px-3 py-2 rounded-md text-sm font-medium border-b-2 border-primary-600">Plot</button>
            <button className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Scenes</button>
            <button className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Settings</button>
          </nav>
          <div>
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
              AI Assistant
            </button>
          </div>
        </div>
      </header>
      
      <div className="min-h-screen bg-gray-50">
        {view === 'dashboard' && (
          <PlotDashboardWireframe onSelectPlotElement={handleSelectPlotElement} />
        )}
        
        {view === 'detail' && selectedPlotElement && (
          <div className="container mx-auto px-4 py-8">
            <button 
              onClick={handleBackToDashboard}
              className="mb-4 flex items-center text-primary-600 hover:text-primary-800"
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"></path>
              </svg>
              Back to Plot Dashboard
            </button>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="mb-6">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="inline-block px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 mb-2">
                      {selectedPlotElement.type}
                    </span>
                    <h1 className="text-2xl font-bold text-gray-900">{selectedPlotElement.title}</h1>
                  </div>
                  
                  <div className="flex gap-2">
                    <button className="px-3 py-1 bg-primary-100 text-primary-700 rounded hover:bg-primary-200">
                      Edit
                    </button>
                    <button className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200">
                      Delete
                    </button>
                  </div>
                </div>
                
                <div className="mt-4 text-sm text-gray-500">
                  Last edited: {new Date(selectedPlotElement.lastEdited).toLocaleString()}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-2">Description</h2>
                    <p className="text-gray-700">{selectedPlotElement.description}</p>
                  </div>
                  
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-2">Notes</h2>
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                      <p className="text-gray-700">{selectedPlotElement.notes || "No notes added yet."}</p>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-2">Connected Scenes</h2>
                    <div className="bg-gray-50 rounded-md p-4">
                      <ul className="space-y-2">
                        <li className="flex items-center justify-between p-2 hover:bg-white rounded">
                          <span>Chapter {selectedPlotElement.chapter}: A scene that involves this plot element</span>
                          <button className="text-xs text-primary-600">View</button>
                        </li>
                        <li className="flex items-center justify-between p-2 hover:bg-white rounded">
                          <span>Chapter {selectedPlotElement.chapter + 2}: Another scene that references this</span>
                          <button className="text-xs text-primary-600">View</button>
                        </li>
                        <li className="flex justify-center p-2">
                          <button className="text-sm text-primary-600">+ Add Connected Scene</button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-2">Details</h2>
                    <div className="bg-gray-50 rounded-md p-4">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-gray-500">Type:</div>
                        <div>{selectedPlotElement.type}</div>
                        
                        <div className="text-gray-500">Impact:</div>
                        <div>{selectedPlotElement.impact}</div>
                        
                        <div className="text-gray-500">Chapter:</div>
                        <div>{selectedPlotElement.chapter}</div>
                        
                        <div className="text-gray-500">Position:</div>
                        <div>{Math.round(selectedPlotElement.position * 100)}% into story</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-2">Related Characters</h2>
                    <div className="bg-gray-50 rounded-md p-4">
                      {selectedPlotElement.relatedCharacters && selectedPlotElement.relatedCharacters.length > 0 ? (
                        <ul className="space-y-1">
                          {selectedPlotElement.relatedCharacters.map(charId => (
                            <li key={charId} className="flex items-center justify-between p-2 hover:bg-white rounded">
                              <span>Character #{charId}</span>
                              <button className="text-xs text-primary-600">View</button>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500 text-sm">No characters linked to this plot element.</p>
                      )}
                      <div className="mt-3">
                        <button className="text-sm text-primary-600">+ Add Character</button>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h2 className="text-lg font-semibold mb-2">AI Suggestions</h2>
                    <div className="bg-primary-50 border border-primary-200 rounded-md p-4">
                      <div className="text-sm text-gray-800 space-y-3">
                        <p>Consider how this plot element affects character motivation, especially for Character #1.</p>
                        <p>This element could be strengthened by adding foreshadowing in earlier chapters.</p>
                        <p>There might be potential plot holes regarding how the character obtains this information.</p>
                      </div>
                      <button className="mt-3 text-sm text-primary-600">Generate More Suggestions</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Wireframe Note */}
      <div className="fixed bottom-4 right-4 bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded shadow-lg">
        <div className="flex">
          <div className="py-1 mr-2">
            <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div>
            <p className="font-bold">Wireframe Prototype</p>
            <p className="text-sm">This is a non-functional wireframe for the Plot Management interface.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlotManagementPage;
