import React from 'react';
import PropTypes from 'prop-types';

/**
 * ResponsiveContainer component provides consistent responsive behavior for wireframes.
 * It includes common padding and layout adjustments for different screen sizes.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child elements to render within the container
 * @param {string} props.className - Additional CSS classes to apply
 * @param {boolean} props.fluid - Whether the container should be fluid width (full width)
 * @param {string} props.as - HTML element or component to render as
 * @param {Object} props.style - Additional inline styles
 */
const ResponsiveContainer = ({ 
  children, 
  className = '',
  fluid = false,
  as: Component = 'div',
  style = {},
  ...props
}) => {
  // Base classes that apply to all containers
  const baseClasses = "px-4 py-6 md:py-8";
  
  // Container width classes
  const containerClasses = fluid 
    ? "w-full" 
    : "w-full mx-auto max-w-7xl";
    
  // Combine all classes
  const combinedClasses = `${baseClasses} ${containerClasses} ${className}`;
  
  return (
    <Component className={combinedClasses} style={style} {...props}>
      {children}
    </Component>
  );
};

ResponsiveContainer.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  fluid: PropTypes.bool,
  as: PropTypes.elementType,
  style: PropTypes.object
};

export default ResponsiveContainer;
