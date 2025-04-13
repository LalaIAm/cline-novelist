import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login, clearError, verifyMfa } from '../../redux/features/auth/authSlice';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  const [mfaCode, setMfaCode] = useState('');
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { loading, error, isAuthenticated, requiresMfa, tempToken, mfaMethod } = useSelector(
    (state) => state.auth
  );

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Clear error when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  // Form validation
  useEffect(() => {
    const newErrors = {};
    
    if (touched.email && !formData.email) {
      newErrors.email = 'Email is required';
    } else if (touched.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (touched.password && !formData.password) {
      newErrors.password = 'Password is required';
    }

    if (touched.mfaCode && !mfaCode) {
      newErrors.mfaCode = 'Verification code is required';
    }

    setErrors(newErrors);
  }, [formData, touched, mfaCode]);

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

  const handleMfaChange = (e) => {
    setMfaCode(e.target.value);
    setTouched({
      ...touched,
      mfaCode: true,
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
    
    // Validate form
    const newTouched = {
      email: true,
      password: true,
    };
    setTouched(newTouched);
    
    // Check for errors
    if (!formData.email || !formData.password) {
      return;
    }
    
    // Dispatch login action
    dispatch(login(formData));
  };

  const handleMfaSubmit = (e) => {
    e.preventDefault();
    
    // Validate MFA code
    setTouched({
      ...touched,
      mfaCode: true,
    });
    
    if (!mfaCode) {
      return;
    }
    
    // Dispatch MFA verification action
    dispatch(verifyMfa({ token: mfaCode, tempToken }));
  };

  const getMfaMethodText = () => {
    switch (mfaMethod) {
      case 'app':
        return 'Enter the code from your authenticator app';
      case 'email':
        return 'Enter the code sent to your email';
      case 'sms':
        return 'Enter the code sent to your phone';
      default:
        return 'Enter verification code';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Log In to Novylist</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {requiresMfa ? (
          // MFA Verification Form
          <form onSubmit={handleMfaSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="mfaCode">
                {getMfaMethodText()}
              </label>
              <input
                id="mfaCode"
                name="mfaCode"
                type="text"
                autoComplete="one-time-code"
                value={mfaCode}
                onChange={handleMfaChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-2 border rounded-lg ${
                  errors.mfaCode ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                placeholder="Enter code"
              />
              {errors.mfaCode && (
                <p className="text-red-500 text-sm mt-1">{errors.mfaCode}</p>
              )}
            </div>
            
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
              >
                {loading ? 'Verifying...' : 'Verify Code'}
              </button>
            </div>
          </form>
        ) : (
          // Login Form
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
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-2 border rounded-lg ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <label className="block text-gray-700" htmlFor="password">
                  Password
                </label>
                <Link to="/forgot-password" className="text-sm text-indigo-600 hover:text-indigo-800">
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
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
            </div>
            
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
              >
                {loading ? 'Logging in...' : 'Log In'}
              </button>
            </div>
            
            <div className="flex items-center justify-center space-x-6 mt-6">
              <button
                type="button"
                className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                onClick={() => window.location.href = '/api/auth/google'}
              >
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <path
                    d="M12.545,12.151L12.545,12.151c0,1.054,0.855,1.909,1.909,1.909h3.536c-0.428,1.981-2.166,3.461-4.26,3.461 c-2.387,0-4.325-1.934-4.325-4.326s1.938-4.326,4.325-4.326c1.149,0,2.196,0.447,2.969,1.188l2.029-2.028 c-1.306-1.218-3.06-1.968-4.998-1.968c-4.037,0-7.306,3.268-7.306,7.306s3.269,7.306,7.306,7.306c4.037,0,7.306-3.268,7.306-7.306 v-1.311h-5.481C13.4,12.057,12.545,12.057,12.545,12.151z"
                    fill="#DB4437"
                  />
                  <path
                    d="M12.545,12.151c0-0.094,0.855-0.094,0.855-0.094h5.481v1.311c0,4.037-3.269,7.306-7.306,7.306 c-4.037,0-7.306-3.268-7.306-7.306s3.269-7.306,7.306-7.306c1.938,0,3.691,0.75,4.998,1.968l-2.029,2.028 c-0.773-0.741-1.82-1.188-2.969-1.188c-2.387,0-4.325,1.934-4.325,4.326s1.938,4.326,4.325,4.326c2.094,0,3.832-1.48,4.26-3.461 h-3.536C13.4,14.06,12.545,13.205,12.545,12.151z"
                    fill="#4285F4"
                  />
                </svg>
                Sign in with Google
              </button>
              
              <button
                type="button"
                className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                onClick={() => window.location.href = '/api/auth/linkedin'}
              >
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="#0077B5">
                  <path d="M19,3H5C3.895,3,3,3.895,3,5v14c0,1.105,0.895,2,2,2h14c1.105,0,2-0.895,2-2V5C21,3.895,20.105,3,19,3z M9,17H6.477v-7H9V17z M7.694,8.717c-0.771,0-1.286-0.514-1.286-1.2s0.514-1.2,1.371-1.2c0.771,0,1.286,0.514,1.286,1.2S8.551,8.717,7.694,8.717z M18,17h-2.442v-3.826c0-1.058-0.651-1.302-0.895-1.302s-1.058,0.163-1.058,1.302c0,0.163,0,3.826,0,3.826h-2.523v-7h2.523v0.977C13.93,10.407,14.581,10,15.802,10C17.023,10,18,10.977,18,13.174V17z" />
                </svg>
                Sign in with LinkedIn
              </button>
            </div>
            
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-800">
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
