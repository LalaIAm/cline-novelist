import React from 'react';
import PropTypes from 'prop-types';

/**
 * Input component that provides consistent styling for various form fields.
 * Supports text inputs, textareas, and includes error state handling.
 */
const Input = ({
  type = 'text',
  label,
  id,
  name,
  value,
  onChange,
  placeholder = '',
  disabled = false,
  readOnly = false,
  error = null,
  helperText = null,
  className = '',
  required = false,
  min,
  max,
  rows = 3,
  ...props
}) => {
  // Generate an ID if none is provided
  const inputId = id || `input-${name}-${Math.random().toString(36).substr(2, 9)}`;
  
  // Base classes for all input types
  const baseClasses = 'block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm';
  
  // Error state classes
  const errorClasses = error ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500' : '';
  
  // Disabled state classes
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed bg-gray-100' : '';
  
  // Combined classes
  const inputClasses = `${baseClasses} ${errorClasses} ${disabledClasses} ${className}`.trim();

  // Render appropriate input element based on type
  const renderInput = () => {
    if (type === 'textarea') {
      return (
        <textarea
          id={inputId}
          name={name}
          rows={rows}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          className={inputClasses}
          {...props}
        />
      );
    }
    
    if (type === 'select') {
      return (
        <select
          id={inputId}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={inputClasses}
          {...props}
        />
      );
    }
    
    return (
      <input
        type={type}
        id={inputId}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        min={min}
        max={max}
        className={inputClasses}
        {...props}
      />
    );
  };

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {renderInput()}
      
      {helperText && !error && (
        <p className="mt-1 text-xs text-gray-500">{helperText}</p>
      )}
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

Input.propTypes = {
  /** Input type */
  type: PropTypes.oneOf(['text', 'email', 'password', 'number', 'tel', 'url', 'textarea', 'select', 'date', 'time', 'datetime-local']),
  /** Input label */
  label: PropTypes.string,
  /** Input id (will be generated if not provided) */
  id: PropTypes.string,
  /** Input name attribute */
  name: PropTypes.string.isRequired,
  /** Input value */
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /** Input change handler */
  onChange: PropTypes.func,
  /** Input placeholder */
  placeholder: PropTypes.string,
  /** Whether the input is disabled */
  disabled: PropTypes.bool,
  /** Whether the input is read-only */
  readOnly: PropTypes.bool,
  /** Error message (if any) */
  error: PropTypes.string,
  /** Helper text to display below the input */
  helperText: PropTypes.string,
  /** Additional classes to apply to the input */
  className: PropTypes.string,
  /** Whether the input is required */
  required: PropTypes.bool,
  /** Minimum value (for number inputs) */
  min: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /** Maximum value (for number inputs) */
  max: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /** Number of rows (for textarea) */
  rows: PropTypes.number,
};

export default Input;
