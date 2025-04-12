import React from 'react';
import { Routes, Route } from 'react-router-dom';
// Import pages as they are created
// import HomePage from './pages/HomePage';
// import LoginPage from './pages/auth/LoginPage';
// import RegisterPage from './pages/auth/RegisterPage';
// import DashboardPage from './pages/dashboard/DashboardPage';
import EditorComparisonPage from './pages/EditorComparisonPage';
import CharacterManagementPage from './pages/CharacterManagementPage';
import PlotManagementPage from './pages/PlotManagementPage';
import ResponsiveWireframesPage from './pages/ResponsiveWireframesPage';

// Placeholder components for initial setup
const PlaceholderPage = ({ title }) => (
  <div className="flex flex-col items-center justify-center min-h-screen p-4">
    <h1 className="text-3xl font-bold text-primary-700 mb-4">{title}</h1>
    <p className="text-lg text-gray-600">This page is under construction.</p>
  </div>
);

const HomePage = () => <PlaceholderPage title="Novylist - Home" />;
const LoginPage = () => <PlaceholderPage title="Login" />;
const RegisterPage = () => <PlaceholderPage title="Register" />;
const DashboardPage = () => <PlaceholderPage title="Dashboard" />;

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/editor-comparison" element={<EditorComparisonPage />} />
        <Route path="/characters" element={<CharacterManagementPage />} />
        <Route path="/plot" element={<PlotManagementPage />} />
        <Route path="/responsive-wireframes" element={<ResponsiveWireframesPage />} />
        {/* Add more routes as pages are created */}
        <Route path="*" element={<PlaceholderPage title="404 - Page Not Found" />} />
      </Routes>
    </div>
  );
}

export default App;
