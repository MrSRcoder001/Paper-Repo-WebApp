import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, Upload, Bell, Settings, User, Command, Plus, LogOut } from 'lucide-react';

const Navbar = ({ onOpenCommandPalette, user }) => {
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const currentUser = user || {
    name: 'Satish Rathod',
    role: 'Student',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <header style={{
      height: 'var(--nav-height)',
      backgroundColor: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border-color)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 1.75rem',
      position: 'sticky',
      top: 0,
      zIndex: 30
    }}>
      {/* Search Input Bar (matching screenshot top search bar) */}
      <div 
        onClick={onOpenCommandPalette}
        className="navbar-search"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          backgroundColor: 'var(--bg-tertiary)',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          padding: '0.45rem 0.9rem',
          width: '380px',
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
      >
        <Search size={17} color="var(--text-muted)" />
        <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', flex: 1 }}>
          Search subjects, papers, topics...
        </span>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.2rem',
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: '6px',
          padding: '0.1rem 0.4rem',
          fontSize: '0.7rem',
          color: 'var(--text-muted)',
          fontWeight: 600
        }}>
          <Command size={11} /> K
        </div>
      </div>

      {/* Right User Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        
        {/* Upload Paper Button */}
        <Link to="/upload" style={{ textDecoration: 'none' }}>
          <button style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.45rem 0.85rem',
            borderRadius: '10px',
            border: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-tertiary)',
            color: 'var(--text-primary)',
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: 'pointer'
          }}>
            <Upload size={16} color="var(--accent-purple)" />
            <span className="hide-on-mobile">Upload Paper</span>
          </button>
        </Link>

        {/* Notifications Icon */}
        <button style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          border: '1px solid var(--border-color)',
          backgroundColor: 'var(--bg-tertiary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-secondary)',
          cursor: 'pointer',
          position: 'relative'
        }}>
          <Bell size={17} />
          <span style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            backgroundColor: '#ef4444'
          }} />
        </button>

        {/* Settings Icon */}
        <Link to="/settings">
          <button style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            border: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-tertiary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)',
            cursor: 'pointer'
          }}>
            <Settings size={17} />
          </button>
        </Link>

        {/* User Profile Info */}
        <div style={{ position: 'relative' }}>
          <div 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              cursor: 'pointer',
              padding: '0.2rem 0.4rem',
              borderRadius: '10px'
            }}
          >
            <img 
              src={currentUser.avatar} 
              alt={currentUser.name} 
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid var(--accent-purple)'
              }} 
            />
            <div style={{ display: 'flex', flexDirection: 'column' }} className="hide-on-mobile">
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                {currentUser.name}
              </span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                {currentUser.role || 'Student'}
              </span>
            </div>
          </div>

          {/* Profile Dropdown */}
          {showProfileMenu && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: '48px',
              width: '180px',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
              padding: '0.5rem',
              zIndex: 50
            }}>
              <Link to="/settings" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem',
                fontSize: '0.85rem',
                color: 'var(--text-primary)',
                textDecoration: 'none',
                borderRadius: '8px'
              }}>
                <User size={15} /> My Profile
              </Link>
              <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '0.3rem 0' }} />
              <button 
                onClick={handleLogout}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem',
                  fontSize: '0.85rem',
                  color: '#ef4444',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                <LogOut size={15} /> Logout
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};

export default Navbar;
