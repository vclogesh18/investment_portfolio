import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import TeamManager from './pages/TeamManager';
import PortfolioManager from './pages/PortfolioManager';
import InvestmentManager from './pages/InvestmentManager';
import BlogManager from './pages/BlogManager';
import MediaLibrary from './pages/MediaLibrary';
import PagesManager from './pages/PagesManager';
import BrandingManager from './pages/BrandingManager';

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="team" element={<TeamManager />} />
          <Route path="portfolio" element={<PortfolioManager />} />
          <Route path="investments" element={<InvestmentManager />} />
          <Route path="blog" element={<BlogManager />} />
          <Route path="media" element={<MediaLibrary />} />
          <Route path="pages" element={<PagesManager />} />
          <Route path="branding" element={<BrandingManager />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;