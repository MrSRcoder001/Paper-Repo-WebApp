import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';

// Layout & Navigation Components
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import CommandPalette from './components/CommandPalette';
import MobileBottomNav from './components/MobileBottomNav';

// Pages
import LandingPage from './pages/LandingPage';
import HomeDashboard from './pages/HomeDashboard';
import SmartSearch from './pages/SmartSearch';
import PaperViewer from './pages/PaperViewer';
import AIAssistant from './pages/AIAssistant';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import UploadPaper from './pages/UploadPaper';
import StudyPlanner from './pages/StudyPlanner';
import AdminDashboard from './pages/AdminDashboard';
import Community from './pages/Community';
import Favorites from './pages/Favorites';
import SettingsPage from './pages/SettingsPage';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import SessionsPage from './pages/SessionsPage';

function AppContent() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [theme, setTheme] = useState(localStorage.getItem('pv_theme') || 'light');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('pv_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Public/guest pages (Landing, Login, Register, Verify Email) when NOT logged in
  const isGuestRoute = ['/', '/login', '/register', '/verify-email'].includes(location.pathname);
  const showAppLayout = isAuthenticated || !isGuestRoute;

  return (
    <div className="app-layout" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', minHeight: '100vh' }}>
      
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            backgroundColor: 'var(--card-bg, #ffffff)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-color)',
            boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
            borderRadius: '12px',
            fontSize: '0.85rem',
            fontWeight: 600
          }
        }} 
      />

      {/* Global Command Palette (Ctrl+K) */}
      <CommandPalette 
        isOpen={isCommandPaletteOpen} 
        onClose={(val) => setIsCommandPaletteOpen(typeof val === 'boolean' ? val : false)} 
      />

      {/* Main Layout Container */}
      {showAppLayout ? (
        <div style={{ display: 'flex', width: '100%', minHeight: '100vh' }}>
          
          {/* Left Sidebar Navigation */}
          <Sidebar theme={theme} toggleTheme={toggleTheme} />

          <div className="main-content">
            {/* Top Navbar Header */}
            <Navbar 
              theme={theme}
              toggleTheme={toggleTheme}
              onOpenCommandPalette={() => setIsCommandPaletteOpen(true)} 
            />

            {/* Protected Page Router */}
            <main className="page-container">
              <Routes>
                <Route path="/dashboard" element={<ProtectedRoute><HomeDashboard /></ProtectedRoute>} />
                <Route path="/search" element={<ProtectedRoute><SmartSearch /></ProtectedRoute>} />
                <Route path="/paper/:id" element={<ProtectedRoute><PaperViewer /></ProtectedRoute>} />
                <Route path="/ai-assistant" element={<ProtectedRoute><AIAssistant /></ProtectedRoute>} />
                <Route path="/analytics" element={
                  <ProtectedRoute allowedRoles={['faculty', 'admin', 'college_admin']}>
                    <AnalyticsDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/upload" element={<ProtectedRoute><UploadPaper /></ProtectedRoute>} />
                <Route path="/study-planner" element={<ProtectedRoute><StudyPlanner /></ProtectedRoute>} />
                
                {/* Admin Portal (RBAC Protected: Admin Only) */}
                <Route path="/admin" element={
                  <ProtectedRoute allowedRoles={['admin', 'college_admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />

                <Route path="/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
                <Route path="/library" element={<ProtectedRoute><Favorites type="library" /></ProtectedRoute>} />
                <Route path="/bookmarks" element={<ProtectedRoute><Favorites type="bookmarks" /></ProtectedRoute>} />
                <Route path="/downloads" element={<ProtectedRoute><Favorites type="downloads" /></ProtectedRoute>} />
                <Route path="/mock-tests" element={<ProtectedRoute><AIAssistant /></ProtectedRoute>} />
                <Route path="/sessions" element={<ProtectedRoute><SessionsPage /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
                
                {/* If authenticated user visits login/register/landing, PublicRoute will redirect them back to dashboard */}
                <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
                <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
                <Route path="/verify-email" element={<PublicRoute><VerifyEmail /></PublicRoute>} />

                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </main>
          </div>

          {/* Mobile Bottom Navigation Bar */}
          <MobileBottomNav />

        </div>
      ) : (
        /* Unauthenticated Guest Pages (Landing, Login, Register, Verify Email) */
        <div style={{ width: '100%' }}>
          <Routes>
            <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
            <Route path="/verify-email" element={<PublicRoute><VerifyEmail /></PublicRoute>} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      )}

    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
