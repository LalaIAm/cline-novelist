import React, { useState } from 'react';

const NovelVersionHistoryWireframe = ({ versionHistory, currentVersion }) => {
  const [selectedVersion, setSelectedVersion] = useState(currentVersion?.id || null);
  const [compareVersion, setCompareVersion] = useState(null);
  const [viewMode, setViewMode] = useState('timeline'); // 'timeline' or 'list'

  const handleVersionSelect = (versionId) => {
    if (selectedVersion === versionId) {
      setSelectedVersion(null);
    } else {
      setSelectedVersion(versionId);
    }
  };

  const handleCompareSelect = (versionId) => {
    setCompareVersion(versionId);
  };

  const handleRestore = (versionId) => {
    console.log(`Restoring to version: ${versionId}`);
    // In a real implementation, this would trigger the restore process
    alert(`Novel would be restored to version ${versionId}`);
  };

  const handleCreateBranch = (versionId) => {
    console.log(`Creating branch from version: ${versionId}`);
    // In a real implementation, this would open a modal to create a new branch
    alert(`New branch would be created from version ${versionId}`);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Version History</h2>
      
      {/* View Toggle */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex">
          <button
            className={`px-4 py-2 rounded-l-md ${viewMode === 'timeline' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-800'}`}
            onClick={() => setViewMode('timeline')}
          >
            Timeline View
          </button>
          <button
            className={`px-4 py-2 rounded-r-md ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-800'}`}
            onClick={() => setViewMode('list')}
          >
            List View
          </button>
        </div>
        
        <button className="btn-primary">
          Create Snapshot
        </button>
      </div>
      
      {/* Timeline View */}
      {viewMode === 'timeline' && (
        <div className="mb-8">
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-0 h-full w-1 bg-gray-300 top-0 ml-6"></div>
            
            {/* Version Points */}
            <ul className="space-y-10 relative">
              {versionHistory.map((version, index) => (
                <li 
                  key={version.id} 
                  className={`relative pl-14 ${selectedVersion === version.id ? 'bg-primary-50 -ml-4 -mr-4 pt-4 pb-4 pl-18 pr-4 rounded-md shadow-sm' : ''}`}
                >
                  {/* Timeline Circle */}
                  <div 
                    className={`absolute left-0 w-4 h-4 rounded-full border-4 mt-2 ml-4.5 ${
                      version.id === currentVersion?.id 
                        ? 'border-primary-600 bg-white' 
                        : 'border-gray-400 bg-white'
                    } ${selectedVersion === version.id ? 'ring-2 ring-primary-200' : ''}`}
                    onClick={() => handleVersionSelect(version.id)}
                  ></div>
                  
                  {/* Version Content */}
                  <div className="flex flex-col md:flex-row md:justify-between gap-4">
                    <div className="flex-grow">
                      <div className="flex items-center">
                        <h3 className="text-lg font-medium">{version.description}</h3>
                        {version.id === currentVersion?.id && (
                          <span className="ml-2 px-2 py-0.5 text-xs bg-primary-100 text-primary-800 rounded-full">Current</span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        Version {version.version} • {new Date(version.timestamp).toLocaleString()} • {version.wordCount.toLocaleString()} words
                      </div>
                      <div className="text-sm mt-2">{version.changes}</div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      {selectedVersion === version.id && (
                        <>
                          <button 
                            className="btn-secondary text-sm"
                            onClick={() => handleRestore(version.id)}
                          >
                            Restore
                          </button>
                          <button 
                            className="btn-secondary text-sm"
                            onClick={() => handleCreateBranch(version.id)}
                          >
                            Branch
                          </button>
                          <button 
                            className="btn-secondary text-sm"
                            onClick={() => handleCompareSelect(version.id)}
                          >
                            Compare
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      
      {/* List View */}
      {viewMode === 'list' && (
        <div className="bg-white rounded-lg overflow-hidden shadow border border-gray-200 mb-8">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Version</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Words</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {versionHistory.map((version) => (
                <tr 
                  key={version.id}
                  className={`${selectedVersion === version.id ? 'bg-primary-50' : ''} ${version.id === currentVersion?.id ? 'font-medium' : ''}`}
                  onClick={() => handleVersionSelect(version.id)}
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      {version.version}
                      {version.id === currentVersion?.id && (
                        <span className="ml-2 px-2 py-0.5 text-xs bg-primary-100 text-primary-800 rounded-full">Current</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {version.description}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {new Date(version.timestamp).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {version.wordCount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {version.author}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                    {selectedVersion === version.id && (
                      <div className="flex justify-end gap-2">
                        <button 
                          className="text-primary-600 hover:text-primary-900"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRestore(version.id);
                          }}
                        >
                          Restore
                        </button>
                        <button 
                          className="text-primary-600 hover:text-primary-900"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCreateBranch(version.id);
                          }}
                        >
                          Branch
                        </button>
                        <button 
                          className="text-primary-600 hover:text-primary-900"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCompareSelect(version.id);
                          }}
                        >
                          Compare
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Version Comparison Section */}
      {compareVersion && (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Version Comparison</h3>
            <button 
              className="text-gray-500 hover:text-gray-700"
              onClick={() => setCompareVersion(null)}
            >
              Close
            </button>
          </div>
          
          <div className="bg-gray-50 border border-gray-300 rounded-lg p-6">
            <div className="flex justify-between mb-4">
              <div className="text-center flex-1 border-r border-gray-300 pr-4">
                <div className="font-medium">Version {versionHistory.find(v => v.id === compareVersion)?.version}</div>
                <div className="text-sm text-gray-500">
                  {new Date(versionHistory.find(v => v.id === compareVersion)?.timestamp).toLocaleDateString()}
                </div>
              </div>
              <div className="text-center flex-1 pl-4">
                <div className="font-medium">Current Version {currentVersion.version}</div>
                <div className="text-sm text-gray-500">
                  {new Date(currentVersion.timestamp).toLocaleDateString()}
                </div>
              </div>
            </div>
            
            <div className="border rounded-md overflow-hidden">
              <div className="grid grid-cols-2 gap-0">
                <div className="bg-red-50 p-4 border-r border-gray-300 font-mono text-sm whitespace-pre-wrap">
                  {/* Simulated diff content - would be populated from actual diff in real implementation */}
                  <div className="line-removed">- As she approached the old mansion, Sarah felt a chill run down her spine.</div>
                  <div className="line-removed">- The windows, like vacant eyes, seemed to follow her every move.</div>
                  <div>The iron gate creaked loudly as she pushed it open.</div>
                  <div>Fallen leaves crunched beneath her feet as she walked the stone path.</div>
                </div>
                <div className="bg-green-50 p-4 font-mono text-sm whitespace-pre-wrap">
                  {/* Simulated diff content - would be populated from actual diff in real implementation */}
                  <div className="line-added">+ As she approached the Victorian mansion, Sarah felt a sense of foreboding.</div>
                  <div className="line-added">+ The darkened windows seemed to watch her with malevolent intent.</div>
                  <div>The iron gate creaked loudly as she pushed it open.</div>
                  <div>Fallen leaves crunched beneath her feet as she walked the stone path.</div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between mt-4">
              <div>
                <span className="inline-block w-3 h-3 bg-red-100 border border-red-300 mr-1"></span>
                <span className="text-sm text-gray-600">Removed content</span>
              </div>
              <div>
                <span className="inline-block w-3 h-3 bg-green-100 border border-green-300 mr-1"></span>
                <span className="text-sm text-gray-600">Added content</span>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end mt-4 space-x-4">
            <button 
              className="btn-secondary"
              onClick={() => handleRestore(compareVersion)}
            >
              Restore to This Version
            </button>
            <button
              className="btn-primary"
              onClick={() => setCompareVersion(null)}
            >
              Close Comparison
            </button>
          </div>
        </div>
      )}
      
      <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-600 mb-6">
        <h4 className="font-medium mb-2">Version Management</h4>
        <ul className="list-disc pl-5 space-y-1">
          <li>Versions are automatically created when significant changes are made</li>
          <li>You can manually create a snapshot at any time</li>
          <li>Each version stores the complete state of your novel at that point</li>
          <li>Creating branches allows you to explore alternative approaches while preserving your main draft</li>
        </ul>
      </div>
    </div>
  );
};

export default NovelVersionHistoryWireframe;
