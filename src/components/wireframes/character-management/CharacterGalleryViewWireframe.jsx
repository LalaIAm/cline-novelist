import React from 'react';

const CharacterGalleryViewWireframe = ({ characters, onSelectCharacter }) => {
  // Get role-based styling
  const getRoleBadgeStyle = (role) => {
    const styles = {
      'Protagonist': 'bg-blue-100 text-blue-800',
      'Antagonist': 'bg-red-100 text-red-800',
      'Ally': 'bg-green-100 text-green-800',
      'Mentor': 'bg-purple-100 text-purple-800',
      'Ally/Obstacle': 'bg-yellow-100 text-yellow-800',
      'Secondary Antagonist': 'bg-orange-100 text-orange-800'
    };
    
    return styles[role] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Character Gallery</h2>
      
      {characters.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No characters found matching your criteria.</p>
          <p className="mt-2">Try adjusting your search or filters, or add a new character.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {characters.map((character) => (
            <div 
              key={character.id}
              className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow duration-300 cursor-pointer"
              onClick={() => onSelectCharacter(character)}
            >
              <div className="h-48 w-full overflow-hidden bg-gray-200 relative">
                <img 
                  src={character.image.replace('100', '300')} 
                  alt={character.name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3">
                  <h3 className="font-bold text-white text-lg">{character.name}</h3>
                </div>
                <span 
                  className={`absolute top-2 right-2 px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeStyle(character.role)}`}
                >
                  {character.role}
                </span>
              </div>
              
              <div className="p-4">
                <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                  {character.description}
                </p>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {character.attributes.personality.slice(0, 3).map((trait, index) => (
                    <span key={index} className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                      {trait}
                    </span>
                  ))}
                </div>
                
                <div className="flex justify-between">
                  <button
                    className="text-primary-600 hover:text-primary-800 text-sm font-medium"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectCharacter(character);
                    }}
                  >
                    View Details
                  </button>
                  <button
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('Edit character:', character.id);
                    }}
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {characters.length > 0 && (
        <div className="mt-6 flex justify-center">
          {/* Pagination - Wireframe only, not functional */}
          <div className="flex">
            <button
              className="px-3 py-1 border border-gray-300 rounded-l-md bg-white text-gray-500 hover:bg-gray-50"
              disabled
            >
              Previous
            </button>
            <button
              className="px-3 py-1 border border-gray-300 bg-primary-600 text-white"
            >
              1
            </button>
            <button
              className="px-3 py-1 border border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
            >
              2
            </button>
            <button
              className="px-3 py-1 border border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
            >
              3
            </button>
            <button
              className="px-3 py-1 border border-gray-300 rounded-r-md bg-white text-gray-500 hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CharacterGalleryViewWireframe;
