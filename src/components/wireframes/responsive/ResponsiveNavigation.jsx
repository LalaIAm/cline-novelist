import React, { useState } from 'react';
import PropTypes from 'prop-types';

/**
 * ResponsiveNavigation provides a navigation component that adapts to different screen sizes.
 * On mobile, it collapses to a hamburger menu, while on desktop it shows horizontal navigation.
 * 
 * @param {Object} props - Component props
 * @param {Array} props.items - Navigation items with label and optional active state
 * @param {Function} props.onSelect - Function called when an item is selected
 * @param {string} props.activeItem - Currently active item identifier
 * @param {string} props.className - Additional CSS classes
 */
const ResponsiveNavigation = ({
  items,
  onSelect,
  activeItem,
  className = '',
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  
  // Handle item selection
  const handleSelect = (item) => {
    onSelect(item);
    setMenuOpen(false);
  };
  
  return (
    <div className={`relative ${className}`}>
      {/* Mobile Navigation */}
      <div className="md:hidden">
        <button 
          onClick={toggleMenu}
          className="flex items-center p-3 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg"
          aria-expanded={menuOpen}
          aria-label="Toggle navigation menu"
        >
          <svg 
            className="w-6 h-6" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            {menuOpen ? (
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M6 18L18 6M6 6l12 12" 
              />
            ) : (
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 6h16M4 12h16M4 18h16" 
              />
            )}
          </svg>
          <span className="ml-2 font-medium">Menu</span>
        </button>
        
        {/* Mobile Menu */}
        {menuOpen && (
          <div className="absolute top-full left-0 right-0 z-20 mt-1 border rounded-lg shadow-lg bg-white py-2">
            {items.map((item, index) => (
              <button
                key={index}
                onClick={() => handleSelect(item.id || item.label)}
                className={`block w-full text-left px-4 py-3 hover:bg-gray-100
                  ${activeItem === (item.id || item.label) ? 'text-primary-700 font-medium' : 'text-gray-700'}
                `}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
      
      {/* Desktop Navigation */}
      <div className="hidden md:flex flex-wrap gap-2">
        {items.map((item, index) => (
          <button 
            key={index}
            onClick={() => onSelect(item.id || item.label)}
            className={`px-4 py-2 rounded-md ${
              activeItem === (item.id || item.label) 
                ? 'bg-primary-600 text-white' 
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};

ResponsiveNavigation.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  onSelect: PropTypes.func.isRequired,
  activeItem: PropTypes.string,
  className: PropTypes.string,
};

export default ResponsiveNavigation;
