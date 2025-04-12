import React from 'react';
import PropTypes from 'prop-types';

/**
 * Button component that provides consistent styling across the application.
 * Supports different variants, sizes, and states.
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  type = 'button',
  onClick,
  className = '',
  ...props
}) => {
  // Base classes that are common to all button variants
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md transition focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  // Size-specific classes
  const sizeClasses = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg'
  };
  
  // Variant-specific classes
  const variantClasses = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 border border-transparent',
    secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-300 border border-gray-300',
    outline: 'bg-transparent text-primary-600 hover:bg-primary-50 focus:ring-primary-500 border border-primary-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 border border-transparent',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 border border-transparent',
    text: 'bg-transparent text-primary-600 hover:text-primary-800 hover:underline focus:ring-0 border-0 shadow-none',
  };
  
  // Disabled state overrides
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
  
  // Full width override
  const widthClasses = fullWidth ? 'w-full' : '';
  
  // Combine all classes
  const buttonClasses = `
    ${baseClasses} 
    ${sizeClasses[size]} 
    ${variantClasses[variant]} 
    ${disabledClasses} 
    ${widthClasses} 
    ${className}
  `.trim().replace(/\s+/g, ' '); // Clean up whitespace

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  /** Button content */
  children: PropTypes.node.isRequired,
  /** Button visual style */
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'danger', 'success', 'text']),
  /** Button size */
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  /** Whether the button should take full width of its container */
  fullWidth: PropTypes.bool,
  /** Whether the button is disabled */
  disabled: PropTypes.bool,
  /** Button type attribute */
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  /** Click handler */
  onClick: PropTypes.func,
  /** Additional classes to apply */
  className: PropTypes.string,
};

export default Button;
