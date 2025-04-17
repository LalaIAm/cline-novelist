import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';

// Authentication pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import PrivateRoute from './components/auth/PrivateRoute';

// Import pages as they are created
import EditorComparisonPage from './pages/EditorComparisonPage';
import CharacterManagementPage from './pages/CharacterManagementPage';
import PlotManagementPage from './pages/PlotManagementPage';
import ResponsiveWireframesPage from './pages/ResponsiveWireframesPage';
import WritingWorkspacePage from './pages/WritingWorkspacePage';

// Import actions
import { getMe } from './redux/features/auth/authSlice';

// Placeholder components for initial setup
const PlaceholderPage = ({ title }) => (
  <div className="flex flex-col items-center justify-center min-h-screen p-4">
    <h1 className="text-3xl font-bold text-primary-700 mb-4">{title}</h1>
    <p className="text-lg text-gray-600">This page is under construction.</p>
  </div>
);

const HomePage = () => <PlaceholderPage title="Novylist - Home" />;
const DashboardPage = () => <PlaceholderPage title="Dashboard" />;

function App() {
  const dispatch = useDispatch();

  // Check if user is authenticated on app load
  useEffect(() => {
    if (localStorage.getItem('token')) {
      dispatch(getMe());
    }
  }, [dispatch]);

  return (
    <div className="app">
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:resettoken" element={<ResetPasswordPage />} />
        <Route path="/editor-comparison" element={<EditorComparisonPage />} />
        <Route path="/responsive-wireframes" element={<ResponsiveWireframesPage />} />
        <Route path="/writing-workspace" element={<WritingWorkspacePage />} />
        
        {/* Protected routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/characters" element={<CharacterManagementPage />} />
          <Route path="/plot" element={<PlotManagementPage />} />
          <Route path="/write" element={<WritingWorkspacePage />} />
        </Route>
        
        {/* Catch all */}
        <Route path="*" element={<PlaceholderPage title="404 - Page Not Found" />} />
      </Routes>
    </div>
  );
}

export default App;
