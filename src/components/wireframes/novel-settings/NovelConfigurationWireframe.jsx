import React, { useState } from 'react';

const NovelConfigurationWireframe = ({ settings, onUpdate }) => {
  const [configData, setConfigData] = useState({
    aiAssistanceLevel: settings.aiAssistanceLevel || 'Moderate',
    notifications: {
      dailyReminders: settings.notifications?.dailyReminders || false,
      weeklyProgress: settings.notifications?.weeklyProgress || false,
      aiSuggestions: settings.notifications?.aiSuggestions || false,
    },
    editorPreferences: {
      fontSize: settings.editorPreferences?.fontSize || 16,
      fontFamily: settings.editorPreferences?.fontFamily || 'Georgia',
      lineSpacing: settings.editorPreferences?.lineSpacing || 1.5,
      theme: settings.editorPreferences?.theme || 'Light',
      focusMode: settings.editorPreferences?.focusMode || false,
    }
  });

  const handleAiLevelChange = (level) => {
    setConfigData({
      ...configData,
      aiAssistanceLevel: level
    });
  };

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setConfigData({
      ...configData,
      notifications: {
        ...configData.notifications,
        [name]: checked
      }
    });
  };

  const handleEditorPrefChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setConfigData({
      ...configData,
      editorPreferences: {
        ...configData.editorPreferences,
        [name]: newValue
      }
    });
  };

  const handleSave = () => {
    onUpdate({ settings: configData });
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Novel Configuration</h2>
      
      {/* AI Assistance Section */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">AI Assistance Settings</h3>
        
        <div className="bg-gray-50 p-5 rounded-lg">
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              AI Assistance Level
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div
                className={`border rounded-lg p-4 text-center cursor-pointer transition ${
                  configData.aiAssistanceLevel === 'Minimal' 
                    ? 'border-primary-500 bg-primary-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onClick={() => handleAiLevelChange('Minimal')}
              >
                <div className="font-medium mb-1">Minimal</div>
                <div className="text-sm text-gray-600">Occasional suggestions only when requested</div>
              </div>
              <div
                className={`border rounded-lg p-4 text-center cursor-pointer transition ${
                  configData.aiAssistanceLevel === 'Moderate' 
                    ? 'border-primary-500 bg-primary-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onClick={() => handleAiLevelChange('Moderate')}
              >
                <div className="font-medium mb-1">Moderate</div>
                <div className="text-sm text-gray-600">Regular suggestions during natural pauses</div>
              </div>
              <div
                className={`border rounded-lg p-4 text-center cursor-pointer transition ${
                  configData.aiAssistanceLevel === 'Active' 
                    ? 'border-primary-500 bg-primary-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onClick={() => handleAiLevelChange('Active')}
              >
                <div className="font-medium mb-1">Active</div>
                <div className="text-sm text-gray-600">Frequent suggestions and writing prompts</div>
              </div>
            </div>
          </div>
          
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              AI Content Focus
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="focus-plot"
                  className="mr-2"
                  defaultChecked
                />
                <label htmlFor="focus-plot" className="text-sm">Plot Development</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="focus-character"
                  className="mr-2"
                  defaultChecked
                />
                <label htmlFor="focus-character" className="text-sm">Character Depth</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="focus-pacing"
                  className="mr-2"
                  defaultChecked
                />
                <label htmlFor="focus-pacing" className="text-sm">Pacing</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="focus-dialogue"
                  className="mr-2"
                  defaultChecked
                />
                <label htmlFor="focus-dialogue" className="text-sm">Dialogue</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="focus-setting"
                  className="mr-2"
                  defaultChecked
                />
                <label htmlFor="focus-setting" className="text-sm">Setting & Description</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="focus-conflict"
                  className="mr-2"
                  defaultChecked
                />
                <label htmlFor="focus-conflict" className="text-sm">Conflict</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="focus-theme"
                  className="mr-2"
                />
                <label htmlFor="focus-theme" className="text-sm">Themes & Symbolism</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="focus-style"
                  className="mr-2"
                />
                <label htmlFor="focus-style" className="text-sm">Writing Style</label>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              AI Tone & Style
            </label>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Formality</label>
                <input 
                  type="range" 
                  min="1" 
                  max="5" 
                  defaultValue="3" 
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Casual</span>
                  <span>Formal</span>
                </div>
              </div>
              
              <div>
                <label className="block text-xs text-gray-600 mb-1">Creativity</label>
                <input 
                  type="range" 
                  min="1" 
                  max="5" 
                  defaultValue="4" 
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Conservative</span>
                  <span>Experimental</span>
                </div>
              </div>
              
              <div>
                <label className="block text-xs text-gray-600 mb-1">Detail Level</label>
                <input 
                  type="range" 
                  min="1" 
                  max="5" 
                  defaultValue="3" 
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Concise</span>
                  <span>Detailed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Editor Preferences Section */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">Editor Preferences</h3>
        
        <div className="bg-gray-50 p-5 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Font Family
              </label>
              <select
                name="fontFamily"
                value={configData.editorPreferences.fontFamily}
                onChange={handleEditorPrefChange}
                className="input-field w-full"
              >
                <option value="Georgia">Georgia</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Arial">Arial</option>
                <option value="Verdana">Verdana</option>
                <option value="Courier New">Courier New</option>
                <option value="Palatino">Palatino</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Font Size
              </label>
              <div className="flex items-center">
                <input
                  type="range"
                  name="fontSize"
                  min="12"
                  max="24"
                  value={configData.editorPreferences.fontSize}
                  onChange={handleEditorPrefChange}
                  className="flex-grow mr-2"
                />
                <span className="text-sm font-mono w-8 text-center">
                  {configData.editorPreferences.fontSize}px
                </span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Line Spacing
              </label>
              <div className="flex items-center">
                <input
                  type="range"
                  name="lineSpacing"
                  min="1"
                  max="3"
                  step="0.1"
                  value={configData.editorPreferences.lineSpacing}
                  onChange={handleEditorPrefChange}
                  className="flex-grow mr-2"
                />
                <span className="text-sm font-mono w-8 text-center">
                  {configData.editorPreferences.lineSpacing}
                </span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Theme
              </label>
              <select
                name="theme"
                value={configData.editorPreferences.theme}
                onChange={handleEditorPrefChange}
                className="input-field w-full"
              >
                <option value="Light">Light</option>
                <option value="Dark">Dark</option>
                <option value="Sepia">Sepia</option>
                <option value="Night">Night</option>
              </select>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="focusMode"
                name="focusMode"
                checked={configData.editorPreferences.focusMode}
                onChange={handleEditorPrefChange}
                className="mr-2"
              />
              <label htmlFor="focusMode" className="text-sm font-medium text-gray-700">Enable Focus Mode</label>
            </div>
            <p className="text-xs text-gray-500 mt-1 ml-6">Highlights only the current sentence or paragraph you're working on</p>
          </div>
        </div>
      </div>
      
      {/* Notifications Section */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">Notification Settings</h3>
        
        <div className="bg-gray-50 p-5 rounded-lg">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label htmlFor="dailyReminders" className="text-sm font-medium text-gray-700">Daily Writing Reminders</label>
                <p className="text-xs text-gray-500">Receive a daily reminder to continue your novel</p>
              </div>
              <div className="flex items-center h-5">
                <input
                  id="dailyReminders"
                  name="dailyReminders"
                  type="checkbox"
                  checked={configData.notifications.dailyReminders}
                  onChange={handleNotificationChange}
                  className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                />
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-3"></div>
            
            <div className="flex items-center justify-between">
              <div>
                <label htmlFor="weeklyProgress" className="text-sm font-medium text-gray-700">Weekly Progress Reports</label>
                <p className="text-xs text-gray-500">Receive weekly stats about your writing progress</p>
              </div>
              <div className="flex items-center h-5">
                <input
                  id="weeklyProgress"
                  name="weeklyProgress"
                  type="checkbox"
                  checked={configData.notifications.weeklyProgress}
                  onChange={handleNotificationChange}
                  className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                />
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-3"></div>
            
            <div className="flex items-center justify-between">
              <div>
                <label htmlFor="aiSuggestions" className="text-sm font-medium text-gray-700">AI Suggestion Notifications</label>
                <p className="text-xs text-gray-500">Receive notifications when AI has new suggestions</p>
              </div>
              <div className="flex items-center h-5">
                <input
                  id="aiSuggestions"
                  name="aiSuggestions"
                  type="checkbox"
                  checked={configData.notifications.aiSuggestions}
                  onChange={handleNotificationChange}
                  className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button onClick={handleSave} className="btn-primary">
          Save Configuration
        </button>
      </div>
    </div>
  );
};

export default NovelConfigurationWireframe;
