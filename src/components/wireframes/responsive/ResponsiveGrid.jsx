import React from 'react';
import PropTypes from 'prop-types';

/**
 * ResponsiveGrid provides a responsive grid layout for various content types.
 * It adapts columns based on screen size, with options for different breakpoints.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child elements to render within the grid
 * @param {string} props.className - Additional CSS classes
 * @param {number} props.xs - Number of columns on extra small screens (default: 1)
 * @param {number} props.sm - Number of columns on small screens (default: 1)
 * @param {number} props.md - Number of columns on medium screens (default: 2)
 * @param {number} props.lg - Number of columns on large screens (default: 3)
 * @param {number} props.xl - Number of columns on extra large screens (default: 4)
 * @param {string} props.gap - Gap size between grid items (default: 'normal')
 */
const ResponsiveGrid = ({
  children,
  className = '',
  xs = 1,
  sm = 1,
  md = 2,
  lg = 3,
  xl = 4,
  gap = 'normal',
  ...props
}) => {
  // Map gap size to tailwind classes
  const gapSizeMap = {
    small: 'gap-2',
    normal: 'gap-4',
    large: 'gap-6',
    xlarge: 'gap-8',
  };
  
  // Get gap class or default to 'normal' if not found
  const gapClass = gapSizeMap[gap] || gapSizeMap.normal;
  
  // Create grid columns based on props
  const gridCols = `grid-cols-${xs} sm:grid-cols-${sm} md:grid-cols-${md} lg:grid-cols-${lg} xl:grid-cols-${xl}`;
  
  return (
    <div className={`grid ${gridCols} ${gapClass} ${className}`} {...props}>
      {children}
    </div>
  );
};

ResponsiveGrid.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  xs: PropTypes.number,
  sm: PropTypes.number,
  md: PropTypes.number,
  lg: PropTypes.number,
  xl: PropTypes.number,
  gap: PropTypes.oneOf(['small', 'normal', 'large', 'xlarge']),
};

export default ResponsiveGrid;
