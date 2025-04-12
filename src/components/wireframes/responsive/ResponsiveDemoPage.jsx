import React, { useState } from 'react';
import { ResponsiveContainer, ResponsiveTabs } from './index';
import ResponsiveCharacterDashboardWireframe from '../character-management/ResponsiveCharacterDashboardWireframe';
import ResponsivePlotDashboardWireframe from '../plot-management/ResponsivePlotDashboardWireframe';
import ResponsiveNovelSettingsDashboardWireframe from '../novel-settings/ResponsiveNovelSettingsDashboardWireframe';
import ResponsiveOnboardingFlowWireframe from '../onboarding/ResponsiveOnboardingFlowWireframe';
import ResponsiveWritingWorkspaceWireframe from '../writing-workspace/ResponsiveWritingWorkspaceWireframe';

/**
 * ResponsiveDemoPage component showcases all the responsive wireframes
 * created for the application. It provides a way to switch between
 * different wireframes and test their responsive behavior.
 */
const ResponsiveDemoPage = () => {
  const [activeTab, setActiveTab] = useState('intro');
  
  // Tabs for the demo
  const tabs = [
    { id: 'intro', label: 'Introduction' },
    { id: 'writing', label: 'Writing Workspace' },
    { id: 'characters', label: 'Character Management' },
    { id: 'plot', label: 'Plot Management' },
    { id: 'settings', label: 'Novel Settings' },
    { id: 'onboarding', label: 'Onboarding Flow' }
  ];
  
  // Helper to get device information
  const getDeviceInfo = () => {
    return {
      viewport: window.innerWidth,
      breakpoints: {
        xs: 'Tailwind: xs (< 640px)', 
        sm: 'Tailwind: sm (≥ 640px)',
        md: 'Tailwind: md (≥ 768px)',
        lg: 'Tailwind: lg (≥ 1024px)',
        xl: 'Tailwind: xl (≥ 1280px)'
      }
    };
  };
  
  // Function to render the appropriate view based on the active tab
  const renderContent = () => {
    switch(activeTab) {
      case 'writing':
        return <ResponsiveWritingWorkspaceWireframe />;
      case 'characters':
        return <ResponsiveCharacterDashboardWireframe />;
      case 'plot':
        return <ResponsivePlotDashboardWireframe />;
      case 'settings':
        return <ResponsiveNovelSettingsDashboardWireframe />;
      case 'onboarding':
        return <ResponsiveOnboardingFlowWireframe />;
      case 'intro':
      default:
        return (
          <div className="py-8">
            <h2 className="text-2xl font-bold mb-4">Responsive Wireframes Demo</h2>
            <p className="mb-4">
              This page demonstrates the responsive wireframes created for Novylist. 
              Use the tabs above to navigate between different wireframes.
            </p>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">Responsive Components</h3>
            <p className="mb-4">
              The following reusable responsive components have been created to support 
              these wireframes:
            </p>
            
            <ul className="list-disc ml-6 space-y-2 mb-6">
              <li><strong>ResponsiveContainer</strong> - Provides consistent padding and layout for all pages</li>
              <li><strong>ResponsiveNavigation</strong> - Collapses to a dropdown menu on mobile screens</li>
              <li><strong>ResponsiveTabs</strong> - Converts horizontal tabs to a dropdown selector on mobile</li>
              <li><strong>ResponsiveGrid</strong> - Adjusts columns based on screen size</li>
              <li><strong>ResponsiveVisualization</strong> - Provides simplified alternatives for complex visualizations on mobile</li>
            </ul>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">Implemented Wireframes</h3>
            <p className="mb-4">
              The following wireframes have been implemented with responsive adaptations:
            </p>
            
            <div className="space-y-4">
              <div className="p-4 border rounded-lg hover:bg-gray-50">
                <h4 className="font-medium">Writing Workspace</h4>
                <p className="text-sm text-gray-600">
                  Features responsive editor layout with adaptive AI assistance panel, document structure navigation,
                  and optimized mobile interaction patterns for writing on any device.
                </p>
              </div>
              
              <div className="p-4 border rounded-lg hover:bg-gray-50">
                <h4 className="font-medium">Character Management Dashboard</h4>
                <p className="text-sm text-gray-600">
                  Features responsive navigation, mobile-friendly list/gallery views, and an 
                  alternative visualization for character relationships on mobile devices.
                </p>
              </div>
              
              <div className="p-4 border rounded-lg hover:bg-gray-50">
                <h4 className="font-medium">Plot Management Dashboard</h4>
                <p className="text-sm text-gray-600">
                  Includes responsive timeline visualization, collapsible three-act structure, 
                  and adaptive scene organization.
                </p>
              </div>
              
              <div className="p-4 border rounded-lg hover:bg-gray-50">
                <h4 className="font-medium">Novel Settings Dashboard</h4>
                <p className="text-sm text-gray-600">
                  Features responsive tab navigation, stacked form fields on mobile,
                  and adapted version history visualization.
                </p>
              </div>
              
              <div className="p-4 border rounded-lg hover:bg-gray-50">
                <h4 className="font-medium">Onboarding Flow</h4>
                <p className="text-sm text-gray-600">
                  Provides a mobile-friendly multi-step registration process with
                  progress tracking and responsive form layouts.
                </p>
              </div>
            </div>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">Testing Instructions</h3>
            <p className="mb-2">
              To test the responsive behavior:
            </p>
            <ol className="list-decimal ml-6 space-y-1 mb-6">
              <li>Use your browser's responsive design mode (F12 developer tools)</li>
              <li>Resize your browser window to different widths</li>
              <li>Test on actual mobile devices if possible</li>
              <li>Verify that interfaces remain usable at all sizes</li>
            </ol>
            
            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="text-lg font-medium text-blue-800 mb-2">Your Current Viewport</h3>
              <div className="text-sm" id="viewport-info">
                <p>Width: <span id="viewport-width">{window.innerWidth}px</span></p>
                <p>Current breakpoint: 
                  <span className="hidden xs:inline sm:hidden"> xs (≥ 0px)</span>
                  <span className="hidden sm:inline md:hidden"> sm (≥ 640px)</span>
                  <span className="hidden md:inline lg:hidden"> md (≥ 768px)</span>
                  <span className="hidden lg:inline xl:hidden"> lg (≥ 1024px)</span>
                  <span className="hidden xl:inline"> xl (≥ 1280px)</span>
                </p>
              </div>
            </div>
          </div>
        );
    }
  };
  
  return (
    <div className="bg-gray-100 min-h-screen pb-12">
      {/* Intro banner - only shown on intro page */}
      {activeTab === 'intro' && (
        <div className="bg-primary-700 text-white py-12 px-4 mb-6">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Novylist Responsive Wireframes</h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto">
              A comprehensive demonstration of responsive wireframes for the Novylist novel writing platform
            </p>
          </div>
        </div>
      )}
      
      <div className="max-w-7xl mx-auto px-4">
        {/* Tabs Navigation */}
        <div className="bg-white rounded-lg shadow-md mb-6 sticky top-0 z-10">
          <ResponsiveTabs 
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>
        
        {/* Content Area */}
        <div className={activeTab === 'intro' ? '' : 'bg-white rounded-lg shadow-md p-4'}>
          {renderContent()}
        </div>
        
        {/* Device resize hint */}
        {activeTab !== 'intro' && (
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Resize your browser window to see how the wireframe adapts to different screen sizes</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResponsiveDemoPage;
