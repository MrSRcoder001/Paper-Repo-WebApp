import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Search, 
  Bot, 
  FolderKanban, 
  Bookmark, 
  Download, 
  CalendarCheck, 
  FileCheck2, 
  BarChart3, 
  Users, 
  ShieldCheck, 
  Bell, 
  Settings, 
  Sun, 
  Moon,
  Sparkles,
  GraduationCap
} from 'lucide-react';

const Sidebar = ({ theme, toggleTheme, userRole = 'student' }) => {
  const location = useLocation();

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Search Papers', path: '/search', icon: Search },
    { name: 'AI Assistant', path: '/ai-assistant', icon: Bot, badge: 'AI' },
    { name: 'My Library', path: '/library', icon: FolderKanban },
    { name: 'Bookmarks', path: '/bookmarks', icon: Bookmark },
    { name: 'Downloads', path: '/downloads', icon: Download },
    { name: 'Study Planner', path: '/study-planner', icon: CalendarCheck },
    { name: 'Mock Tests', path: '/mock-tests', icon: FileCheck2 },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Community', path: '/community', icon: Users },
  ];

  if (userRole === 'admin' || localStorage.getItem('userRole') === 'admin') {
    navLinks.push({ name: 'Admin Dashboard', path: '/admin', icon: ShieldCheck, badge: 'Admin' });
  }

  const secondaryLinks = [
    { name: 'Notifications', path: '/notifications', icon: Bell },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside style={{
      width: '240px',
      backgroundColor: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      position: 'sticky',
      top: 0,
      zIndex: 40,
      flexShrink: 0
    }} className="hide-on-mobile">
      
      {/* Brand Logo */}
      <div style={{
        padding: '1.25rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
        }}>
          <GraduationCap size={22} />
        </div>
        <div>
          <span style={{ fontSize: '1.15rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
            PaperVault<span style={{ color: '#6366f1' }}>.AI</span>
          </span>
        </div>
      </div>

      {/* Nav Items List */}
      <div style={{ flex: 1, padding: '1rem 0.75rem', overflowY: 'auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <NavLink
                key={item.name}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.6rem 0.85rem',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? '#ffffff' : 'var(--text-secondary)',
                  backgroundColor: isActive ? 'var(--accent-purple)' : 'transparent',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Icon size={18} color={isActive ? '#ffffff' : 'var(--text-muted)'} />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span style={{
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    padding: '0.15rem 0.45rem',
                    borderRadius: '6px',
                    backgroundColor: isActive ? 'rgba(255,255,255,0.25)' : 'var(--accent-light-purple)',
                    color: isActive ? '#ffffff' : 'var(--accent-purple)'
                  }}>
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

        <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '1rem 0' }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {secondaryLinks.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.6rem 0.85rem',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? '#ffffff' : 'var(--text-secondary)',
                  backgroundColor: isActive ? 'var(--accent-purple)' : 'transparent',
                }}
              >
                <Icon size={18} color={isActive ? '#ffffff' : 'var(--text-muted)'} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Footer Theme Toggle */}
      <div style={{
        padding: '1rem 0.85rem',
        borderTop: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <button
          onClick={toggleTheme}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            padding: '0.5rem',
            borderRadius: '10px',
            border: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-tertiary)',
            color: 'var(--text-primary)',
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          {theme === 'dark' ? (
            <>
              <Sun size={16} color="#fbbf24" />
              <span>Light Mode</span>
            </>
          ) : (
            <>
              <Moon size={16} color="#6366f1" />
              <span>Dark Mode</span>
            </>
          )}
        </button>
      </div>

    </aside>
  );
};

export default Sidebar;
