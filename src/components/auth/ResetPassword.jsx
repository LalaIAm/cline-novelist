import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { resetPassword, clearMessage, clearError } from '../../redux/features/auth/authSlice';

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);

  const { resettoken } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { loading, error, isAuthenticated, message } = useSelector((state) => state.auth);

  // Redirect if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Clear message and error when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearMessage());
      dispatch(clearError());
    };
  }, [dispatch]);

  // Form validation and password strength calculation
  useEffect(() => {
    const newErrors = {};
    
    // Password validation
    if (touched.password && !formData.password) {
      newErrors.password = 'Password is required';
    } else if (touched.password) {
      const strength = calculatePasswordStrength(formData.password);
      setPasswordStrength(strength);
      
      // Password requirements
      if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      } else if (!/[A-Za-z]/.test(formData.password)) {
        newErrors.password = 'Password must contain at least one letter';
      } else if (!/\d/.test(formData.password)) {
        newErrors.password = 'Password must contain at least one number';
      } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
        newErrors.password = 'Password must contain at least one special character';
      }
    }

    if (touched.confirmPassword && !formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (
      touched.confirmPassword &&
      formData.password !== formData.confirmPassword
    ) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
  }, [formData, touched]);

  const calculatePasswordStrength = (password) => {
    if (!password) return 0;
    
    let strength = 0;
    
    // Length
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;
    
    // Contains letter
    if (/[A-Za-z]/.test(password)) strength += 1;
    
    // Contains number
    if (/\d/.test(password)) strength += 1;
    
    // Contains special character
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 1;
    
    // Mix of uppercase and lowercase
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 1;

    return Math.min(strength, 5);
  };

  const getStrengthText = () => {
    switch (passwordStrength) {
      case 0:
        return '';
      case 1:
        return 'Very Weak';
      case 2:
        return 'Weak';
      case 3:
        return 'Moderate';
      case 4:
        return 'Strong';
      case 5:
        return 'Very Strong';
      default:
        return '';
    }
  };

  const getStrengthColor = () => {
    switch (passwordStrength) {
      case 1:
        return 'bg-red-500';
      case 2:
        return 'bg-orange-500';
      case 3:
        return 'bg-yellow-500';
      case 4:
        return 'bg-green-500';
      case 5:
        return 'bg-green-600';
      default:
        return 'bg-gray-300';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setTouched({
      ...touched,
      [name]: true,
    });
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({
      ...touched,
      [name]: true,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Touch all fields to show errors
    const newTouched = {
      password: true,
      confirmPassword: true,
    };
    setTouched(newTouched);
    
    // Check for errors
    if (
      !formData.password ||
      !formData.confirmPassword ||
      formData.password !== formData.confirmPassword ||
      passwordStrength < 3 // Require at least moderate strength
    ) {
      return;
    }
    
    // Dispatch reset password action
    dispatch(resetPassword({ resetToken: resettoken, password: formData.password }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Set New Password</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {message ? (
          <div className="text-center">
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
              {message}
            </div>
            <p className="text-gray-600 mb-6">
              Your password has been successfully reset. You can now log in with your new password.
            </p>
            <div className="mt-6">
              <Link
                to="/login"
                className="w-full inline-block py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-center transition duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
              >
                Return to Login
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="password">
                New Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-2 border rounded-lg ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
              
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-sm text-gray-600">Password Strength:</div>
                    <div className={`text-sm font-medium ${
                      passwordStrength <= 2 ? 'text-red-600' : 
                      passwordStrength === 3 ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {getStrengthText()}
                    </div>
                  </div>
                  <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${getStrengthColor()}`} 
                      style={{ width: `${passwordStrength * 20}%` }}
                    ></div>
                  </div>
                  <ul className="mt-2 text-xs text-gray-500 space-y-1">
                    <li className={formData.password.length >= 8 ? 'text-green-600' : ''}>
                      • At least 8 characters
                    </li>
                    <li className={/[A-Za-z]/.test(formData.password) ? 'text-green-600' : ''}>
                      • At least one letter
                    </li>
                    <li className={/\d/.test(formData.password) ? 'text-green-600' : ''}>
                      • At least one number
                    </li>
                    <li className={/[!@#$%^&*(),.?":{}|<>]/.test(formData.password) ? 'text-green-600' : ''}>
                      • At least one special character
                    </li>
                  </ul>
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="confirmPassword">
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-2 border rounded-lg ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                placeholder="••••••••"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
              )}
            </div>
            
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
              >
                {loading ? 'Updating Password...' : 'Reset Password'}
              </button>
            </div>
            
            <div className="text-center mt-4">
              <Link to="/login" className="text-sm text-indigo-600 hover:text-indigo-800">
                Return to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
