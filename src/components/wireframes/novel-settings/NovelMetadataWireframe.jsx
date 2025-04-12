import React, { useState } from 'react';

const NovelMetadataWireframe = ({ novel, onUpdate }) => {
  const [formData, setFormData] = useState({
    title: novel.title,
    description: novel.description,
    genre: novel.genre.join(', '),
    status: novel.status,
    targetWordCount: novel.targetWordCount,
    author: novel.author
  });

  const [collaborators, setCollaborators] = useState(novel.collaborators || []);
  const [newCollaborator, setNewCollaborator] = useState({ name: '', role: 'Reviewer' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSave = () => {
    // Process genres from comma-separated string to array
    const genreArray = formData.genre
      .split(',')
      .map(g => g.trim())
      .filter(g => g !== '');

    const updatedNovel = {
      ...formData,
      genre: genreArray,
      collaborators
    };

    onUpdate(updatedNovel);
  };

  const handleAddCollaborator = () => {
    if (newCollaborator.name.trim() === '') return;
    
    const updatedCollaborators = [
      ...collaborators,
      { ...newCollaborator, id: `user${Date.now()}` }
    ];
    
    setCollaborators(updatedCollaborators);
    setNewCollaborator({ name: '', role: 'Reviewer' });
  };

  const handleRemoveCollaborator = (id) => {
    setCollaborators(collaborators.filter(c => c.id !== id));
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Novel Metadata</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="input-field w-full"
              placeholder="Novel title"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="input-field w-full h-32"
              placeholder="Brief description of your novel"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Genres</label>
            <input
              type="text"
              name="genre"
              value={formData.genre}
              onChange={handleInputChange}
              className="input-field w-full"
              placeholder="Comma-separated genres (e.g., Fantasy, Adventure)"
            />
            <p className="text-xs text-gray-500 mt-1">Separate multiple genres with commas</p>
          </div>
        </div>
        
        {/* Right Column */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="input-field w-full"
            >
              <option value="Planning">Planning</option>
              <option value="In Progress">In Progress</option>
              <option value="First Draft">First Draft</option>
              <option value="Revision">Revision</option>
              <option value="Editing">Editing</option>
              <option value="Final">Final</option>
              <option value="Published">Published</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Target Word Count</label>
            <input
              type="number"
              name="targetWordCount"
              value={formData.targetWordCount}
              onChange={handleInputChange}
              className="input-field w-full"
              placeholder="Target word count"
              min="0"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleInputChange}
              className="input-field w-full"
              placeholder="Author name"
            />
          </div>
          
          <div className="pt-2">
            <button onClick={handleSave} className="btn-primary w-full">
              Update Metadata
            </button>
          </div>
        </div>
      </div>
      
      {/* Collaborators Section */}
      <div className="mt-8">
        <h3 className="text-lg font-medium mb-3">Collaborators</h3>
        
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <div className="mb-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-grow">
                <input
                  type="text"
                  value={newCollaborator.name}
                  onChange={(e) => setNewCollaborator({...newCollaborator, name: e.target.value})}
                  className="input-field w-full"
                  placeholder="Collaborator name"
                />
              </div>
              <div className="sm:w-1/4">
                <select
                  value={newCollaborator.role}
                  onChange={(e) => setNewCollaborator({...newCollaborator, role: e.target.value})}
                  className="input-field w-full"
                >
                  <option value="Reviewer">Reviewer</option>
                  <option value="Editor">Editor</option>
                  <option value="Co-Author">Co-Author</option>
                  <option value="Consultant">Consultant</option>
                </select>
              </div>
              <div>
                <button 
                  onClick={handleAddCollaborator}
                  className="btn-secondary w-full sm:w-auto"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
          
          {collaborators.length > 0 ? (
            <div className="border rounded-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {collaborators.map((collaborator) => (
                    <tr key={collaborator.id}>
                      <td className="px-4 py-2 whitespace-nowrap">{collaborator.name}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{collaborator.role}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-right">
                        <button 
                          onClick={() => handleRemoveCollaborator(collaborator.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-2">No collaborators added yet</p>
          )}
        </div>
        
        <div className="text-sm text-gray-600">
          <h4 className="font-medium mb-1">Collaboration Notes:</h4>
          <ul className="list-disc pl-5 space-y-1">
            <li>Collaborators will need a Novylist account to access your novel</li>
            <li>Different roles have different permission levels</li>
            <li>You can change or revoke access at any time</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NovelMetadataWireframe;
