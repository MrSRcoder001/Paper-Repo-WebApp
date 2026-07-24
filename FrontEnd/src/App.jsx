import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

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

function AppContent() {
  const location = useLocation();
  const [theme, setTheme] = useState(localStorage.getItem('pv_theme') || 'light');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem('user') || 'null') || {
    name: 'Satish Rathod',
    role: 'student'
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('pv_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Hide sidebar and top header on public Landing page, Login, and Register
  const isPublicPage = location.pathname === '/' || location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="app-layout" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', minHeight: '100vh' }}>
      
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            backgroundColor: 'var(--card-bg)',
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
      {!isPublicPage ? (
        <div style={{ display: 'flex', width: '100%', minHeight: '100vh' }}>
          
          {/* Left Sidebar Navigation (Screens 2, 3, 5, 6, 8, 9, 10) */}
          <Sidebar theme={theme} toggleTheme={toggleTheme} userRole={user.role} />

          <div className="main-content">
            {/* Top Navbar Header */}
            <Navbar 
              onOpenCommandPalette={() => setIsCommandPaletteOpen(true)} 
              user={user} 
            />

            {/* Page Router */}
            <main className="page-container">
              <Routes>
                <Route path="/dashboard" element={<HomeDashboard />} />
                <Route path="/search" element={<SmartSearch />} />
                <Route path="/paper/:id" element={<PaperViewer />} />
                <Route path="/ai-assistant" element={<AIAssistant />} />
                <Route path="/analytics" element={<AnalyticsDashboard />} />
                <Route path="/upload" element={<UploadPaper />} />
                <Route path="/study-planner" element={<StudyPlanner />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/community" element={<Community />} />
                <Route path="/library" element={<Favorites type="library" />} />
                <Route path="/bookmarks" element={<Favorites type="bookmarks" />} />
                <Route path="/downloads" element={<Favorites type="downloads" />} />
                <Route path="/mock-tests" element={<AIAssistant />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </main>
          </div>

          {/* Mobile Bottom Navigation Bar (Screen 7) */}
          <MobileBottomNav />

        </div>
      ) : (
        /* Public Pages (Landing, Login, Register) */
        <div style={{ width: '100%' }}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      )}

    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
