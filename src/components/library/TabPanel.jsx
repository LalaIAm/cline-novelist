import React, { useState } from 'react';
import PropTypes from 'prop-types';

/**
 * TabPanel component that provides a consistent tabbed interface.
 * Manages tab selection and content display.
 */
const TabPanel = ({
  tabs,
  initialTab = 0,
  orientation = 'horizontal',
  variant = 'default',
  className = '',
  onChange,
  ...props
}) => {
  const [activeTabIndex, setActiveTabIndex] = useState(initialTab);
  
  // Handle tab click
  const handleTabClick = (index) => {
    setActiveTabIndex(index);
    if (onChange) {
      onChange(index);
    }
  };
  
  // Base classes
  const baseContainerClasses = 'w-full';
  
  // Tab list classes based on orientation
  const tabListClasses = {
    horizontal: 'flex overflow-x-auto border-b',
    vertical: 'flex flex-col border-r'
  };
  
  // Tab classes based on orientation and variant
  const getTabClasses = (index, isActive) => {
    const baseTabClasses = 'font-medium transition-colors duration-200 ease-in-out';
    
    const orientationClasses = {
      horizontal: 'px-4 py-3 text-center',
      vertical: 'px-4 py-3 text-left'
    };
    
    const variantClasses = {
      default: {
        active: 'border-b-2 border-primary-600 text-primary-700',
        inactive: 'text-gray-600 hover:text-gray-800 hover:border-gray-300'
      },
      pills: {
        active: 'bg-primary-100 text-primary-800 rounded-md',
        inactive: 'text-gray-600 hover:bg-gray-100 rounded-md'
      },
      underlined: {
        active: 'border-b-2 border-primary-600 text-primary-700',
        inactive: 'text-gray-600 hover:text-gray-800'
      }
    };
    
    const state = isActive ? 'active' : 'inactive';
    
    return `
      ${baseTabClasses}
      ${orientationClasses[orientation]}
      ${variantClasses[variant][state]}
    `.trim().replace(/\s+/g, ' ');
  };
  
  return (
    <div className={`${baseContainerClasses} ${className}`} {...props}>
      {/* Tab list */}
      <div className={tabListClasses[orientation]}>
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => handleTabClick(index)}
            className={getTabClasses(index, activeTabIndex === index)}
            aria-selected={activeTabIndex === index}
            role="tab"
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      {/* Tab content */}
      <div className="mt-4">
        {tabs[activeTabIndex]?.content}
      </div>
    </div>
  );
};

TabPanel.propTypes = {
  /** Array of tab objects with label and content properties */
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.node.isRequired,
      content: PropTypes.node.isRequired
    })
  ).isRequired,
  /** Index of the initially active tab */
  initialTab: PropTypes.number,
  /** Orientation of the tabs */
  orientation: PropTypes.oneOf(['horizontal', 'vertical']),
  /** Visual style variant */
  variant: PropTypes.oneOf(['default', 'pills', 'underlined']),
  /** Additional classes to apply to the container */
  className: PropTypes.string,
  /** Callback fired when the active tab changes */
  onChange: PropTypes.func,
};

export default TabPanel;
