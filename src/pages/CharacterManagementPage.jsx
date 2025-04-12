import React, { useState } from 'react';
import CharacterDashboardWireframe from '../components/wireframes/character-management/CharacterDashboardWireframe';
import CharacterDetailWireframe from '../components/wireframes/character-management/CharacterDetailWireframe';

const CharacterManagementPage = () => {
  const [view, setView] = useState('dashboard'); // 'dashboard' or 'detail'
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  
  const handleSelectCharacter = (character) => {
    setSelectedCharacter(character);
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
            <button className="text-primary-600 hover:text-primary-800 px-3 py-2 rounded-md text-sm font-medium border-b-2 border-primary-600">Characters</button>
            <button className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Plot</button>
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
          <CharacterDashboardWireframe onSelectCharacter={handleSelectCharacter} />
        )}
        
        {view === 'detail' && (
          <CharacterDetailWireframe 
            character={selectedCharacter} 
            onBack={handleBackToDashboard} 
          />
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
            <p className="text-sm">This is a non-functional wireframe for the Character Management interface.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterManagementPage;
