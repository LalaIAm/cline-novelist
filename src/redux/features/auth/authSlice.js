import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Get token from localStorage
const token = localStorage.getItem('token');

// Initial state
const initialState = {
  token: token,
  isAuthenticated: !!token,
  loading: false,
  user: null,
  error: null,
  message: null,
  requiresMfa: false,
  tempToken: null,
  mfaMethod: null,
};

// Register user
export const register = createAsyncThunk(
  'auth/register',
  async (userData, thunkAPI) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        return thunkAPI.rejectWithValue(data.error || 'Registration failed');
      }

      // Save token to localStorage
      localStorage.setItem('token', data.token);

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || 'Registration failed');
    }
  }
);

// Login user
export const login = createAsyncThunk(
  'auth/login',
  async (userData, thunkAPI) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
        credentials: 'include', // Include cookies
      });

      const data = await response.json();

      if (!response.ok) {
        return thunkAPI.rejectWithValue(data.error || 'Login failed');
      }

      // Check if MFA is required
      if (data.requiresMfa) {
        return {
          requiresMfa: true,
          tempToken: data.token,
          mfaMethod: data.mfaMethod,
        };
      }

      // Save token to localStorage
      localStorage.setItem('token', data.token);

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || 'Login failed');
    }
  }
);

// Verify MFA
export const verifyMfa = createAsyncThunk(
  'auth/verifyMfa',
  async ({ token, tempToken }, thunkAPI) => {
    try {
      const response = await fetch('/api/auth/verify-mfa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, tempToken }),
        credentials: 'include', // Include cookies
      });

      const data = await response.json();

      if (!response.ok) {
        return thunkAPI.rejectWithValue(data.error || 'MFA verification failed');
      }

      // Save token to localStorage
      localStorage.setItem('token', data.token);

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || 'MFA verification failed');
    }
  }
);

// Get current user
export const getMe = createAsyncThunk(
  'auth/getMe',
  async (_, thunkAPI) => {
    try {
      // Get token from state
      const token = thunkAPI.getState().auth.token;

      if (!token) {
        return thunkAPI.rejectWithValue('No token found');
      }

      const response = await fetch('/api/auth/me', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include', // Include cookies
      });

      const data = await response.json();

      if (!response.ok) {
        // If unauthorized, clear token
        if (response.status === 401) {
          localStorage.removeItem('token');
        }
        return thunkAPI.rejectWithValue(data.error || 'Failed to get user data');
      }

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || 'Failed to get user data');
    }
  }
);

// Logout user
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, thunkAPI) => {
    try {
      // Get token from state
      const token = thunkAPI.getState().auth.token;

      if (token) {
        // Call logout endpoint
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: 'include', // Include cookies
        });
      }

      // Remove token from localStorage
      localStorage.removeItem('token');

      return { success: true };
    } catch (error) {
      // Even if server logout fails, clear local state
      localStorage.removeItem('token');
      return { success: true };
    }
  }
);

// Reset password request
export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email, thunkAPI) => {
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        return thunkAPI.rejectWithValue(data.error || 'Password reset request failed');
      }

      return { success: true, message: 'Password reset email sent' };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || 'Password reset request failed');
    }
  }
);

// Reset password
export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ resetToken, password }, thunkAPI) => {
    try {
      const response = await fetch(`/api/auth/reset-password/${resetToken}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return thunkAPI.rejectWithValue(data.error || 'Password reset failed');
      }

      // Save token to localStorage
      localStorage.setItem('token', data.token);

      return { success: true, message: 'Password reset successful' };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || 'Password reset failed');
    }
  }
);

// Update user details
export const updateUserDetails = createAsyncThunk(
  'auth/updateUserDetails',
  async (userData, thunkAPI) => {
    try {
      // Get token from state
      const token = thunkAPI.getState().auth.token;

      if (!token) {
        return thunkAPI.rejectWithValue('No token found');
      }

      const response = await fetch('/api/auth/update-details', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
        credentials: 'include', // Include cookies
      });

      const data = await response.json();

      if (!response.ok) {
        return thunkAPI.rejectWithValue(data.error || 'Failed to update user details');
      }

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || 'Failed to update user details');
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearMessage: (state) => {
      state.message = null;
    },
    resetAuth: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      state.loading = false;
      state.error = null;
      state.message = null;
      state.requiresMfa = false;
      state.tempToken = null;
      state.mfaMethod = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.message = 'Registration successful';
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        
        // Check if MFA is required
        if (action.payload.requiresMfa) {
          state.requiresMfa = true;
          state.tempToken = action.payload.tempToken;
          state.mfaMethod = action.payload.mfaMethod;
        } else {
          state.isAuthenticated = true;
          state.token = action.payload.token;
          state.requiresMfa = false;
          state.tempToken = null;
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Verify MFA
      .addCase(verifyMfa.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyMfa.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.requiresMfa = false;
        state.tempToken = null;
        state.mfaMethod = null;
      })
      .addCase(verifyMfa.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get current user
      .addCase(getMe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
      })
      .addCase(getMe.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        // If token expired or invalid, reset auth state
        if (action.payload === 'No token found' || action.payload === 'Not authorized') {
          state.isAuthenticated = false;
          state.token = null;
        }
        state.error = action.payload;
      })
      // Logout
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
        state.requiresMfa = false;
        state.tempToken = null;
        state.mfaMethod = null;
      })
      // Forgot password
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Reset password
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.message = action.payload.message;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update user details
      .addCase(updateUserDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
        state.message = 'User details updated successfully';
      })
      .addCase(updateUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearMessage, resetAuth } = authSlice.actions;

export default authSlice.reducer;
