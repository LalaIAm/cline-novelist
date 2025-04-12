import React, { useState } from 'react';

const NovelExportOptionsWireframe = ({ novel, exportFormats }) => {
  const [selectedFormat, setSelectedFormat] = useState('pdf');
  const [exportOptions, setExportOptions] = useState({
    includeNotes: true,
    includeMeta: true,
    includeVersionInfo: false,
    optimizeForReading: true,
    separateChapters: true,
    includeCharacterList: false,
    includePlotSummary: false,
    includeTimeline: false,
    watermark: false,
    customFileName: novel.title
  });

  const handleOptionChange = (e) => {
    const { name, type, checked, value } = e.target;
    setExportOptions({
      ...exportOptions,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = () => {
    console.log('Exporting novel with format:', selectedFormat, 'and options:', exportOptions);
    // In a real implementation, this would trigger the export process
    alert(`Export initiated in ${selectedFormat.toUpperCase()} format`);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Export Options</h2>
      
      {/* Format Selection */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">Export Format</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {exportFormats.map(format => (
            <div 
              key={format.id}
              className={`border rounded-lg p-4 cursor-pointer transition ${
                selectedFormat === format.id 
                  ? 'border-primary-500 bg-primary-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onClick={() => setSelectedFormat(format.id)}
            >
              <div className="flex items-center">
                <div className="text-2xl mr-3">{format.icon}</div>
                <div>
                  <div className="font-medium">{format.name}</div>
                  <div className="text-sm text-gray-600">{format.description}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Export Options */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">Export Settings</h3>
        
        <div className="bg-gray-50 p-5 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="includeNotes"
                  name="includeNotes"
                  type="checkbox"
                  checked={exportOptions.includeNotes}
                  onChange={handleOptionChange}
                  className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="includeNotes" className="font-medium text-gray-700">Include Notes</label>
                <p className="text-gray-500">Include chapter and scene notes in export</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="includeMeta"
                  name="includeMeta"
                  type="checkbox"
                  checked={exportOptions.includeMeta}
                  onChange={handleOptionChange}
                  className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="includeMeta" className="font-medium text-gray-700">Include Metadata</label>
                <p className="text-gray-500">Include title, author, and description</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="includeVersionInfo"
                  name="includeVersionInfo"
                  type="checkbox"
                  checked={exportOptions.includeVersionInfo}
                  onChange={handleOptionChange}
                  className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="includeVersionInfo" className="font-medium text-gray-700">Include Version Info</label>
                <p className="text-gray-500">Add version number and date to export</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="optimizeForReading"
                  name="optimizeForReading"
                  type="checkbox"
                  checked={exportOptions.optimizeForReading}
                  onChange={handleOptionChange}
                  className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="optimizeForReading" className="font-medium text-gray-700">Optimize for Reading</label>
                <p className="text-gray-500">Format document for optimal reading experience</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="separateChapters"
                  name="separateChapters"
                  type="checkbox"
                  checked={exportOptions.separateChapters}
                  onChange={handleOptionChange}
                  className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="separateChapters" className="font-medium text-gray-700">Separate Chapters</label>
                <p className="text-gray-500">Start each chapter on a new page</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="includeCharacterList"
                  name="includeCharacterList"
                  type="checkbox"
                  checked={exportOptions.includeCharacterList}
                  onChange={handleOptionChange}
                  className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="includeCharacterList" className="font-medium text-gray-700">Include Character List</label>
                <p className="text-gray-500">Add appendix with character details</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="includePlotSummary"
                  name="includePlotSummary"
                  type="checkbox"
                  checked={exportOptions.includePlotSummary}
                  onChange={handleOptionChange}
                  className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="includePlotSummary" className="font-medium text-gray-700">Include Plot Summary</label>
                <p className="text-gray-500">Add plot outline as an appendix</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="includeTimeline"
                  name="includeTimeline"
                  type="checkbox"
                  checked={exportOptions.includeTimeline}
                  onChange={handleOptionChange}
                  className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="includeTimeline" className="font-medium text-gray-700">Include Timeline</label>
                <p className="text-gray-500">Add chronological timeline as an appendix</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="watermark"
                  name="watermark"
                  type="checkbox"
                  checked={exportOptions.watermark}
                  onChange={handleOptionChange}
                  className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="watermark" className="font-medium text-gray-700">Add Watermark</label>
                <p className="text-gray-500">Add a "Draft" watermark to document</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <label htmlFor="customFileName" className="block text-sm font-medium text-gray-700 mb-1">
              Custom File Name
            </label>
            <input
              type="text"
              id="customFileName"
              name="customFileName"
              value={exportOptions.customFileName}
              onChange={handleOptionChange}
              className="input-field w-full md:w-1/2"
              placeholder="Enter file name"
            />
            <p className="text-xs text-gray-500 mt-1">
              File will be saved as "{exportOptions.customFileName || novel.title}.{selectedFormat}"
            </p>
          </div>
        </div>
      </div>
      
      {/* Preview Section */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">Export Preview</h3>
        
        <div className="bg-gray-50 border border-gray-300 rounded-lg p-6 text-center">
          <div className="text-6xl mb-4">
            {exportFormats.find(f => f.id === selectedFormat)?.icon || '📄'}
          </div>
          <div className="text-xl font-medium mb-2">
            {exportOptions.customFileName || novel.title}.{selectedFormat}
          </div>
          <div className="text-sm text-gray-600 mb-4">
            Approximate Size: {Math.round(novel.wordCount * 0.006)} MB
          </div>
          <div className="text-sm text-gray-600">
            Content: {novel.wordCount.toLocaleString()} words | {Math.ceil(novel.wordCount / 250)} pages
          </div>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        <button className="btn-secondary">
          Cancel
        </button>
        <button onClick={handleSubmit} className="btn-primary">
          Export Now
        </button>
      </div>
    </div>
  );
};

export default NovelExportOptionsWireframe;
