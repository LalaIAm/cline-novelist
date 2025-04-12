import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

/**
 * Modal component that provides a consistent overlay dialog.
 * Includes focus trapping and keyboard navigation for accessibility.
 */
const Modal = ({
  isOpen = false,
  onClose,
  title,
  children,
  size = 'medium',
  closeOnOverlayClick = true,
  footer,
  className = '',
  closeButtonLabel = 'Close',
  ...props
}) => {
  const modalRef = useRef(null);
  
  // Size classes
  const sizeClasses = {
    small: 'max-w-md',
    medium: 'max-w-lg',
    large: 'max-w-2xl',
    fullWidth: 'max-w-full mx-4'
  };
  
  // Handle escape key press
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscapeKey);
    
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);
  
  // Focus modal when it opens
  useEffect(() => {
    if (isOpen && modalRef.current) {
      // Save active element to restore focus when modal closes
      const activeElement = document.activeElement;
      
      // Focus the modal
      modalRef.current.focus();
      
      return () => {
        // Restore focus when modal closes
        if (activeElement) {
          activeElement.focus();
        }
      };
    }
  }, [isOpen]);
  
  // Handle overlay click
  const handleOverlayClick = (event) => {
    if (closeOnOverlayClick && event.target === event.currentTarget) {
      onClose();
    }
  };
  
  // Don't render anything if modal is not open
  if (!isOpen) return null;
  
  // Modal markup
  const modalContent = (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-50 flex items-center justify-center"
      onClick={handleOverlayClick}
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
    >
      <div 
        className={`bg-white rounded-lg shadow-xl transform transition-all w-full ${sizeClasses[size]} ${className}`}
        ref={modalRef}
        tabIndex="-1"
        {...props}
      >
        {/* Modal header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 id="modal-title" className="text-lg font-medium text-gray-900">
            {title}
          </h3>
          <button
            type="button"
            className="text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500 transition"
            onClick={onClose}
            aria-label={closeButtonLabel}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Modal content */}
        <div className="px-6 py-4">
          {children}
        </div>
        
        {/* Modal footer */}
        {footer && (
          <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
  
  // Use portal to render modal at the end of the document body
  return ReactDOM.createPortal(
    modalContent,
    document.body
  );
};

Modal.propTypes = {
  /** Whether the modal is visible */
  isOpen: PropTypes.bool,
  /** Function called when modal should close */
  onClose: PropTypes.func.isRequired,
  /** Modal title */
  title: PropTypes.node.isRequired,
  /** Modal content */
  children: PropTypes.node.isRequired,
  /** Modal size */
  size: PropTypes.oneOf(['small', 'medium', 'large', 'fullWidth']),
  /** Whether clicking the overlay should close the modal */
  closeOnOverlayClick: PropTypes.bool,
  /** Optional footer content */
  footer: PropTypes.node,
  /** Additional classes to apply */
  className: PropTypes.string,
  /** Accessible label for the close button */
  closeButtonLabel: PropTypes.string,
};

export default Modal;
