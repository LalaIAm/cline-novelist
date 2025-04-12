import React, { useState } from 'react';
import PropTypes from 'prop-types';

/**
 * ResponsiveVisualization provides adaptable display of complex visualizations
 * across different screen sizes. It handles mobile-friendly alternatives for
 * complex desktop visualizations like relationship maps, timelines, etc.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.desktopVisualization - Complex visualization for desktop
 * @param {React.ReactNode} props.mobileVisualization - Simplified visualization for mobile
 * @param {React.ReactNode} props.fallbackContent - Content to display if mobile visualization not provided
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.withToggle - Allow users to toggle between views even on desktop (for testing)
 */
const ResponsiveVisualization = ({
  desktopVisualization,
  mobileVisualization,
  fallbackContent,
  className = '',
  withToggle = false,
}) => {
  const [forceMobileView, setForceMobileView] = useState(false);
  
  // If mobile visualization isn't provided, use fallback content
  const mobileContent = mobileVisualization || (
    <div className="p-4 border rounded-lg bg-gray-50">
      <div className="text-center mb-3 text-gray-600">
        <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
        <p className="font-medium">Simplified View</p>
      </div>
      {fallbackContent || (
        <p className="text-sm text-gray-500 text-center">
          This visualization is simplified on mobile devices. 
          For the full experience, please view on a larger screen.
        </p>
      )}
    </div>
  );
  
  return (
    <div className={`${className}`}>
      {/* Toggle option for testing */}
      {withToggle && (
        <div className="mb-4 flex justify-end">
          <button 
            onClick={() => setForceMobileView(!forceMobileView)}
            className="text-sm px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-700"
          >
            {forceMobileView ? 'Show Desktop View' : 'Show Mobile View'}
          </button>
        </div>
      )}
      
      {/* Desktop visualization, hidden on small screens or if forced to mobile */}
      <div className={`${(forceMobileView ? 'hidden' : 'hidden md:block')}`}>
        {desktopVisualization}
      </div>
      
      {/* Mobile visualization, shown only on small screens or if forced to mobile */}
      <div className={`${(forceMobileView ? 'block' : 'block md:hidden')}`}>
        {mobileContent}
      </div>
    </div>
  );
};

ResponsiveVisualization.propTypes = {
  desktopVisualization: PropTypes.node.isRequired,
  mobileVisualization: PropTypes.node,
  fallbackContent: PropTypes.node,
  className: PropTypes.string,
  withToggle: PropTypes.bool,
};

export default ResponsiveVisualization;
