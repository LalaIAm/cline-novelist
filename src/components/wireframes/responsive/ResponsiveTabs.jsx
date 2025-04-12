import React, { useState } from 'react';
import PropTypes from 'prop-types';

/**
 * ResponsiveTabs provides a tabbed interface that adapts to different screen sizes.
 * On mobile, it collapses to a dropdown selector, while on desktop it shows horizontal tabs.
 * 
 * @param {Object} props - Component props
 * @param {Array} props.tabs - Array of tab objects with label and id
 * @param {string} props.activeTab - Currently active tab id
 * @param {Function} props.onTabChange - Function called when a tab is selected
 * @param {string} props.className - Additional CSS classes
 */
const ResponsiveTabs = ({
  tabs,
  activeTab,
  onTabChange,
  className = '',
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  // Find active tab label
  const activeTabLabel = tabs.find(tab => tab.id === activeTab)?.label || tabs[0]?.label;
  
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };
  
  // Handle tab selection
  const handleSelect = (tabId) => {
    onTabChange(tabId);
    setDropdownOpen(false);
  };
  
  return (
    <div className={`${className}`}>
      {/* Mobile Tabs as Dropdown */}
      <div className="md:hidden relative">
        <button 
          onClick={toggleDropdown}
          className="flex items-center justify-between w-full px-4 py-3 bg-white border rounded-lg shadow-sm text-left focus:outline-none focus:ring-2 focus:ring-primary-500"
          aria-expanded={dropdownOpen}
          aria-haspopup="listbox"
        >
          <span className="font-medium">{activeTabLabel}</span>
          <svg 
            className="w-5 h-5 ml-2" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d={dropdownOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} 
            />
          </svg>
        </button>
        
        {/* Dropdown Menu */}
        {dropdownOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg">
            <ul role="listbox" className="py-1">
              {tabs.map((tab, index) => (
                <li key={index}>
                  <button
                    onClick={() => handleSelect(tab.id)}
                    className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${
                      activeTab === tab.id ? 'text-primary-700 font-medium' : 'text-gray-700'
                    }`}
                    role="option"
                    aria-selected={activeTab === tab.id}
                  >
                    {tab.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      {/* Desktop Horizontal Tabs */}
      <div className="hidden md:block">
        <div className="flex border-b overflow-x-auto">
          {tabs.map((tab, index) => (
            <button 
              key={index}
              onClick={() => onTabChange(tab.id)}
              className={`px-6 py-3 font-medium whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'border-b-2 border-primary-600 text-primary-700' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              role="tab"
              aria-selected={activeTab === tab.id}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

ResponsiveTabs.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  activeTab: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default ResponsiveTabs;
