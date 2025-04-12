import React from 'react';
import PropTypes from 'prop-types';

/**
 * Badge component for displaying status indicators, counts, or labels.
 * Supports different variants, sizes, and appearance options.
 */
const Badge = ({
  children,
  variant = 'default',
  size = 'medium',
  rounded = 'full',
  className = '',
  ...props
}) => {
  // Base classes for all badges
  const baseClasses = 'inline-flex items-center justify-center font-medium';
  
  // Size classes
  const sizeClasses = {
    small: 'px-1.5 py-0.5 text-xs',
    medium: 'px-2.5 py-0.5 text-sm',
    large: 'px-3 py-1 text-base'
  };
  
  // Variant-specific classes (color schemes)
  const variantClasses = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-primary-100 text-primary-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    outline: 'bg-white border border-gray-300 text-gray-700',
  };
  
  // Rounded corner classes
  const roundedClasses = {
    none: 'rounded-none',
    small: 'rounded-sm',
    medium: 'rounded-md',
    large: 'rounded-lg',
    full: 'rounded-full'
  };
  
  // Combine all classes
  const badgeClasses = `
    ${baseClasses} 
    ${sizeClasses[size]} 
    ${variantClasses[variant]} 
    ${roundedClasses[rounded]}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <span className={badgeClasses} {...props}>
      {children}
    </span>
  );
};

Badge.propTypes = {
  /** Badge content */
  children: PropTypes.node.isRequired,
  /** Badge color scheme */
  variant: PropTypes.oneOf(['default', 'primary', 'success', 'warning', 'danger', 'info', 'outline']),
  /** Badge size */
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  /** Rounded corner style */
  rounded: PropTypes.oneOf(['none', 'small', 'medium', 'large', 'full']),
  /** Additional classes to apply */
  className: PropTypes.string,
};

export default Badge;
