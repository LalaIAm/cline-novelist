import React from 'react';

const CharacterListViewWireframe = ({ characters, onSelectCharacter }) => {
  // Format the last edited date to a readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

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

  // Get importance-based styling
  const getImportanceBadgeStyle = (importance) => {
    const styles = {
      'Main': 'bg-indigo-100 text-indigo-800',
      'Supporting': 'bg-teal-100 text-teal-800',
      'Minor': 'bg-gray-100 text-gray-800'
    };
    
    return styles[importance] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Characters</h2>
      
      {characters.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No characters found matching your criteria.</p>
          <p className="mt-2">Try adjusting your search or filters, or add a new character.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Character</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Importance</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Edited</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {characters.map((character) => (
                <tr 
                  key={character.id} 
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => onSelectCharacter(character)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img className="h-10 w-10 rounded-full" src={character.image} alt={character.name} />
                      </div>
                      <div className="ml-4">
                        <div className="font-medium text-gray-900">{character.name}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {character.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeStyle(character.role)}`}>
                      {character.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getImportanceBadgeStyle(character.importance)}`}>
                      {character.importance}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(character.lastEdited)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      className="text-primary-600 hover:text-primary-900 mr-3"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectCharacter(character);
                      }}
                    >
                      View
                    </button>
                    <button
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log('Edit character:', character.id);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-600 hover:text-red-900"
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log('Delete character:', character.id);
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {characters.length > 0 && (
        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Showing {characters.length} characters
          </div>
          
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

export default CharacterListViewWireframe;
