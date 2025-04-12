import { createSlice } from '@reduxjs/toolkit';

/**
 * UI slice for managing UI state across the application
 * This includes responsive preferences, theme settings, etc.
 */
const initialState = {
  theme: 'light',
  sidebarOpen: false,
  screenSize: 'desktop', // desktop, tablet, mobile
  // Add other UI state as needed
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setScreenSize: (state, action) => {
      state.screenSize = action.payload;
    },
    // Add other UI actions as needed
  },
});

export const { toggleTheme, toggleSidebar, setScreenSize } = uiSlice.actions;

export default uiSlice.reducer;
