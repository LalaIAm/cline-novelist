import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { forgotPassword, clearMessage, clearError } from '../../redux/features/auth/authSlice';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState('');

  const dispatch = useDispatch();
  const { loading, message, error: reduxError } = useSelector((state) => state.auth);

  // Clear message and error when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearMessage());
      dispatch(clearError());
    };
  }, [dispatch]);

  // Form validation
  useEffect(() => {
    if (touched && !email) {
      setError('Email is required');
    } else if (touched && !/^\S+@\S+\.\S+$/.test(email)) {
      setError('Invalid email format');
    } else {
      setError('');
    }
  }, [email, touched]);

  const handleChange = (e) => {
    setEmail(e.target.value);
    setTouched(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate email
    setTouched(true);
    
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return;
    }
    
    // Dispatch forgot password action
    dispatch(forgotPassword(email));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Reset Your Password</h2>
        
        {reduxError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {reduxError}
          </div>
        )}
        
        {message ? (
          <div className="text-center">
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
              {message}
            </div>
            <p className="text-gray-600 mb-6">
              If an account exists with this email, you will receive instructions to reset your password.
              Please check your email and follow the instructions.
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
              <label className="block text-gray-700 mb-2" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg ${
                  error ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                placeholder="you@example.com"
              />
              {error && (
                <p className="text-red-500 text-sm mt-1">{error}</p>
              )}
            </div>
            
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
              >
                {loading ? 'Sending...' : 'Send Reset Instructions'}
              </button>
            </div>
            
            <div className="flex items-center justify-center mt-6">
              <Link to="/login" className="text-sm text-indigo-600 hover:text-indigo-800">
                Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
