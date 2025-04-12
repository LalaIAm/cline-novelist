import React from 'react';

const PlotElementDetailWireframe = ({ plotElement, onBack }) => {
  if (!plotElement) return null;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <button 
        onClick={onBack}
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
                {plotElement.type}
              </span>
              <h1 className="text-2xl font-bold text-gray-900">{plotElement.title}</h1>
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
            Last edited: {new Date(plotElement.lastEdited).toLocaleString()}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Description</h2>
              <p className="text-gray-700">{plotElement.description}</p>
            </div>
            
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Notes</h2>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                <p className="text-gray-700">{plotElement.notes || "No notes added yet."}</p>
              </div>
            </div>
            
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Connected Scenes</h2>
              <div className="bg-gray-50 rounded-md p-4">
                <ul className="space-y-2">
                  <li className="flex items-center justify-between p-2 hover:bg-white rounded">
                    <span>Chapter {plotElement.chapter}: A scene that involves this plot element</span>
                    <button className="text-xs text-primary-600">View</button>
                  </li>
                  <li className="flex items-center justify-between p-2 hover:bg-white rounded">
                    <span>Chapter {plotElement.chapter + 2}: Another scene that references this</span>
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
                  <div>{plotElement.type}</div>
                  
                  <div className="text-gray-500">Impact:</div>
                  <div>{plotElement.impact}</div>
                  
                  <div className="text-gray-500">Chapter:</div>
                  <div>{plotElement.chapter}</div>
                  
                  <div className="text-gray-500">Position:</div>
                  <div>{Math.round(plotElement.position * 100)}% into story</div>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Related Characters</h2>
              <div className="bg-gray-50 rounded-md p-4">
                {plotElement.relatedCharacters && plotElement.relatedCharacters.length > 0 ? (
                  <ul className="space-y-1">
                    {plotElement.relatedCharacters.map(charId => (
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
  );
};

export default PlotElementDetailWireframe;
