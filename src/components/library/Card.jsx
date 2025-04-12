import React from 'react';
import PropTypes from 'prop-types';

/**
 * Card component that provides a consistent container for content blocks.
 * Supports different padding levels, hover effects, and borders.
 */
const Card = ({
  children,
  title,
  subtitle,
  padding = 'medium',
  variant = 'default',
  hover = false,
  className = '',
  footer,
  onClick,
  ...props
}) => {
  // Base classes for all cards
  const baseClasses = 'bg-white rounded-lg overflow-hidden';
  
  // Padding variations
  const paddingClasses = {
    none: '',
    small: 'p-3',
    medium: 'p-5',
    large: 'p-7'
  };
  
  // Variant-specific classes
  const variantClasses = {
    default: 'border border-gray-200 shadow-sm',
    outline: 'border border-gray-300',
    elevated: 'shadow-md',
    flat: ''
  };
  
  // Hover effect
  const hoverClasses = hover ? 'transition duration-200 ease-in-out hover:shadow-lg' : '';
  
  // Cursor pointer for clickable cards
  const cursorClasses = onClick ? 'cursor-pointer' : '';
  
  // Combine all classes
  const cardClasses = `
    ${baseClasses} 
    ${variantClasses[variant]} 
    ${hoverClasses} 
    ${cursorClasses} 
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div 
      className={cardClasses}
      onClick={onClick}
      {...props}
    >
      {/* Card header */}
      {(title || subtitle) && (
        <div className={`border-b border-gray-200 ${paddingClasses[padding]}`}>
          {title && <h3 className="text-lg font-medium text-gray-800">{title}</h3>}
          {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
        </div>
      )}
      
      {/* Card content */}
      <div className={paddingClasses[padding]}>
        {children}
      </div>
      
      {/* Card footer */}
      {footer && (
        <div className={`border-t border-gray-200 ${paddingClasses[padding]}`}>
          {footer}
        </div>
      )}
    </div>
  );
};

Card.propTypes = {
  /** Card content */
  children: PropTypes.node.isRequired,
  /** Card title */
  title: PropTypes.node,
  /** Card subtitle */
  subtitle: PropTypes.node,
  /** Amount of padding to apply */
  padding: PropTypes.oneOf(['none', 'small', 'medium', 'large']),
  /** Visual style variant */
  variant: PropTypes.oneOf(['default', 'outline', 'elevated', 'flat']),
  /** Whether to apply hover effects */
  hover: PropTypes.bool,
  /** Additional classes to apply */
  className: PropTypes.string,
  /** Optional footer content */
  footer: PropTypes.node,
  /** Click handler (makes the card interactive) */
  onClick: PropTypes.func,
};

export default Card;
