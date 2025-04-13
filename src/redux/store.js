import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

// Import reducers here as they are created
import authReducer from './features/auth/authSlice';
import uiReducer from './features/ui/uiSlice';

export const store = configureStore({
  reducer: {
    // Add reducers here as they are created
    auth: authReducer,
    ui: uiReducer,
  },
  // Adding middleware for RTK Query
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

// Enable listener behavior for RTK Query
setupListeners(store.dispatch);
