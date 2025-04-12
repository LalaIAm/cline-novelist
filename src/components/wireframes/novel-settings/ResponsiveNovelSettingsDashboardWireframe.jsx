import React, { useState } from 'react';
import NovelMetadataWireframe from './NovelMetadataWireframe';
import NovelConfigurationWireframe from './NovelConfigurationWireframe';
import NovelExportOptionsWireframe from './NovelExportOptionsWireframe';
import NovelVersionHistoryWireframe from './NovelVersionHistoryWireframe';
import { 
  ResponsiveContainer, 
  ResponsiveTabs
} from '../responsive';

// Mock data for wireframe demonstration (same as NovelSettingsDashboardWireframe)
const mockNovelData = {
  id: '123',
  title: 'The Silicon Conspiracy',
  description: 'A thrilling expose of corporate corruption and journalistic courage in the tech industry.',
  genre: ['Thriller', 'Mystery', 'Tech Fiction'],
  status: 'In Progress',
  lastEdited: '2025-04-10T16:45:00Z',
  created: '2025-03-15T09:30:00Z',
  wordCount: 45780,
  targetWordCount: 85000,
  progress: 53.9,
  author: 'J. Smith',
  collaborators: [
    { id: 'user1', name: 'A. Johnson', role: 'Editor' },
    { id: 'user2', name: 'M. Williams', role: 'Reviewer' }
  ],
  settings: {
    aiAssistanceLevel: 'Moderate',
    notifications: {
      dailyReminders: true,
      weeklyProgress: true,
      aiSuggestions: true
    },
    editorPreferences: {
      fontSize: 16,
      fontFamily: 'Georgia',
      lineSpacing: 1.5,
      theme: 'Light',
      focusMode: true
    }
  }
};

// Mock version history data
const mockVersionHistory = [
  {
    id: 'v1',
    version: '1.0',
    timestamp: '2025-03-15T09:30:00Z',
    description: 'Initial draft',
    wordCount: 12500,
    changes: 'Created initial project structure and first three chapters',
    author: 'J. Smith'
  },
  {
    id: 'v2',
    version: '1.1',
    timestamp: '2025-03-22T14:15:00Z',
    description: 'Character development',
    wordCount: 18700,
    changes: 'Expanded character backstories and added character arc for protagonist',
    author: 'J. Smith'
  },
  {
    id: 'v3',
    version: '1.2',
    timestamp: '2025-03-29T11:40:00Z',
    description: 'Plot refinement',
    wordCount: 27300,
    changes: 'Reworked main plot structure and added subplot for supporting character',
    author: 'J. Smith'
  },
  {
    id: 'v4',
    version: '1.3',
    timestamp: '2025-04-05T16:20:00Z',
    description: 'Editor feedback implementation',
    wordCount: 38200,
    changes: 'Addressed feedback on pacing and dialogue from editor review',
    author: 'J. Smith'
  },
  {
    id: 'v5',
    version: '1.4',
    timestamp: '2025-04-10T16:45:00Z',
    description: 'Current draft',
    wordCount: 45780,
    changes: 'Completed climax scene and began resolution chapter',
    author: 'J. Smith'
  }
];

// Mock export format options
const mockExportFormats = [
  { id: 'pdf', name: 'PDF', description: 'Portable Document Format', icon: '📄' },
  { id: 'docx', name: 'Word Document', description: 'Microsoft Word format', icon: '📝' },
  { id: 'epub', name: 'ePub', description: 'Electronic Publication format for e-readers', icon: '📚' },
  { id: 'html', name: 'HTML', description: 'Web-based format', icon: '🌐' },
  { id: 'txt', name: 'Plain Text', description: 'Simple text format without formatting', icon: '📄' },
  { id: 'rtf', name: 'Rich Text Format', description: 'Formatted text that works with most word processors', icon: '📄' },
];

const ResponsiveNovelSettingsDashboardWireframe = () => {
  const [activeTab, setActiveTab] = useState('metadata');
  const [novel, setNovel] = useState(mockNovelData);
  
  // Tabs for the TabPanel
  const tabs = [
    { id: 'metadata', label: 'Metadata' },
    { id: 'configuration', label: 'Configuration' },
    { id: 'export', label: 'Export Options' },
    { id: 'version-history', label: 'Version History' }
  ];
  
  // Mock function to handle novel data changes
  const handleNovelUpdate = (updatedData) => {
    // In a real implementation, this would update the state and potentially save to database
    setNovel({...novel, ...updatedData});
    console.log('Novel updated:', updatedData);
  };

  return (
    <ResponsiveContainer>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 md:mb-6 gap-3">
        <h1 className="text-2xl md:text-3xl font-bold text-primary-700">Novel Settings</h1>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-sm text-gray-500 hidden sm:inline">Last saved: {new Date(novel.lastEdited).toLocaleString()}</span>
          <button className="btn-primary w-full sm:w-auto">
            Save Changes
          </button>
        </div>
      </div>
      
      {/* Novel Title and Quick Stats */}
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-4 md:mb-6">
        <h2 className="text-xl md:text-2xl font-bold mb-2 md:mb-3">{novel.title}</h2>
        <div className="flex flex-col sm:flex-row flex-wrap gap-y-2 gap-x-4 md:gap-x-8 text-gray-600 text-sm md:text-base">
          <div>
            <span className="font-semibold">Status:</span> {novel.status}
          </div>
          <div>
            <span className="font-semibold">Words:</span> {novel.wordCount.toLocaleString()} / {novel.targetWordCount.toLocaleString()}
          </div>
          <div>
            <span className="font-semibold">Progress:</span> {novel.progress}%
          </div>
          <div>
            <span className="font-semibold">Created:</span> {new Date(novel.created).toLocaleDateString()}
          </div>
        </div>
      </div>
      
      {/* Tabs Navigation */}
      <div className="bg-white rounded-lg shadow-md mb-4 md:mb-6">
        <ResponsiveTabs 
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>
      
      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
        {activeTab === 'metadata' && (
          <NovelMetadataWireframe 
            novel={novel} 
            onUpdate={handleNovelUpdate} 
          />
        )}
        
        {activeTab === 'configuration' && (
          <NovelConfigurationWireframe 
            settings={novel.settings} 
            onUpdate={handleNovelUpdate} 
          />
        )}
        
        {activeTab === 'export' && (
          <NovelExportOptionsWireframe 
            novel={novel} 
            exportFormats={mockExportFormats} 
          />
        )}
        
        {activeTab === 'version-history' && (
          <NovelVersionHistoryWireframe 
            versionHistory={mockVersionHistory} 
            currentVersion={mockVersionHistory[4]} 
          />
        )}
      </div>
      
      {/* Status Bar */}
      <div className="mt-3 text-sm text-gray-500 flex flex-col sm:flex-row justify-between">
        <span>Last edited: {new Date(novel.lastEdited).toLocaleDateString()}</span>
        <span className="hidden xs:inline">Version: {mockVersionHistory[4].version}</span>
      </div>
    </ResponsiveContainer>
  );
};

export default ResponsiveNovelSettingsDashboardWireframe;
