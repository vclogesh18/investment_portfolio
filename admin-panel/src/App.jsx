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
import FormsManager from './pages/FormsManager';
import FormBuilder from './pages/FormBuilder';
import FormSubmissions from './pages/FormSubmissions';

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
          <Route path="forms" element={<FormsManager />} />
          <Route path="forms/new" element={<FormBuilder />} />
          <Route path="forms/:id/edit" element={<FormBuilder />} />
          <Route path="forms/:formId/submissions" element={<FormSubmissions />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;