import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Search, Bot, Bookmark, Upload } from 'lucide-react';

const MobileBottomNav = () => {
  const items = [
    { name: 'Home', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Search', path: '/search', icon: Search },
    { name: 'AI Chat', path: '/ai-assistant', icon: Bot },
    { name: 'Bookmarks', path: '/bookmarks', icon: Bookmark },
    { name: 'Upload', path: '/upload', icon: Upload },
  ];

  return (
    <nav style={{
      display: 'none',
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'var(--bg-secondary)',
      borderTop: '1px solid var(--border-color)',
      padding: '0.4rem 0.5rem',
      justifyContent: 'space-around',
      alignItems: 'center',
      zIndex: 50,
      boxShadow: '0 -4px 15px rgba(0,0,0,0.06)'
    }} className="show-on-mobile-flex">
      {items.map(item => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.name}
            to={item.path}
            style={({ isActive }) => ({
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.2rem',
              textDecoration: 'none',
              fontSize: '0.7rem',
              fontWeight: 600,
              flex: 1,
              padding: '0.35rem 0',
              borderRadius: '8px',
              color: isActive ? 'var(--accent-purple)' : 'var(--text-muted)',
              backgroundColor: isActive ? 'var(--accent-light-purple)' : 'transparent',
              transition: 'all 0.15s ease'
            })}
          >
            <Icon size={20} color={undefined} />
            <span style={{ fontSize: '0.68rem', fontWeight: 600 }}>{item.name}</span>
          </NavLink>
        );
      })}
    </nav>
  );
};

export default MobileBottomNav;
