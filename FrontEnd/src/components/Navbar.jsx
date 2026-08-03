import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { Search, Upload, Bell, Settings, User, Command, KeyRound, LogOut, ShieldAlert, CheckCircle2, AlertTriangle, Sparkles, XCircle, Sun, Moon, GraduationCap } from 'lucide-react';
import toast from 'react-hot-toast';

const Navbar = ({ onOpenCommandPalette, theme, toggleTheme }) => {
  const navigate = useNavigate();
  const { user: authUser, logout, logoutAll } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotificationsMenu, setShowNotificationsMenu] = useState(false);

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const currentUser = authUser || {
    name: 'Satish Rathod',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'
  };

  useEffect(() => {
    if (authUser) {
      fetchNotifications();
    }
  }, [authUser]);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      if (res.data?.success) {
        setNotifications(res.data.notifications || []);
        setUnreadCount(res.data.unreadCount || 0);
      }
    } catch (err) {
      console.log('Notice: Notifications API fallback active');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setUnreadCount(0);
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.log('Error marking notifications as read');
    }
  };

  const handleLogout = async () => {
    setShowProfileMenu(false);
    await logout();
    navigate('/login');
  };

  const handleLogoutAll = async () => {
    setShowProfileMenu(false);
    await logoutAll();
    navigate('/login');
  };

  const renderNotificationIcon = (type) => {
    switch (type) {
      case 'upload_approved':
        return <CheckCircle2 size={16} color="#10b981" />;
      case 'upload_rejected':
        return <XCircle size={16} color="#ef4444" />;
      case 'changes_requested':
        return <AlertTriangle size={16} color="#f59e0b" />;
      case 'reward_earned':
        return <Sparkles size={16} color="#8b5cf6" />;
      default:
        return <Bell size={16} color="#6366f1" />;
    }
  };

  return (
    <header className="navbar-container" style={{
      height: 'var(--nav-height, 64px)',
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
      {/* Mobile Brand Logo */}
      <Link to="/dashboard" style={{ textDecoration: 'none', display: 'none' }} className="show-on-mobile-flex">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff'
          }}>
            <GraduationCap size={18} />
          </div>
          <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            PaperVault<span style={{ color: 'var(--accent-purple, #6366f1)' }}>.AI</span>
          </span>
        </div>
      </Link>

      {/* Search Bar */}
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
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
        
        {/* Mobile & Desktop Theme Mode Toggle */}
        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle Theme Mode"
          style={{
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
            transition: 'all 0.2s ease'
          }}
        >
          {theme === 'dark' ? (
            <Sun size={18} color="#fbbf24" />
          ) : (
            <Moon size={18} color="#6366f1" />
          )}
        </button>

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
            <Upload size={16} color="var(--accent-purple, #6366f1)" />
            <span className="hide-on-mobile">Upload Paper</span>
          </button>
        </Link>

        {/* Notifications Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => {
              setShowNotificationsMenu(!showNotificationsMenu);
              setShowProfileMenu(false);
            }}
            style={{
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
            }}
          >
            <Bell size={17} />
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-2px',
                right: '-2px',
                minWidth: '16px',
                height: '16px',
                borderRadius: '999px',
                backgroundColor: '#ef4444',
                color: '#ffffff',
                fontSize: '0.65rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 3px'
              }}>
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Popup */}
          {showNotificationsMenu && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: '48px',
              width: '320px',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: '16px',
              boxShadow: '0 15px 35px rgba(0,0,0,0.22)',
              overflow: 'hidden',
              zIndex: 50
            }}>
              <div style={{
                padding: '0.8rem 1rem',
                borderBottom: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <span style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Notifications ({notifications.length})
                </span>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    style={{ background: 'none', border: 'none', color: 'var(--accent-purple)', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
                {notifications.length === 0 ? (
                  <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                    No recent notifications
                  </div>
                ) : (
                  notifications.map((item) => (
                    <div
                      key={item._id || item.id}
                      style={{
                        padding: '0.75rem 1rem',
                        borderBottom: '1px solid var(--border-color)',
                        backgroundColor: item.isRead ? 'transparent' : 'var(--accent-light-purple)',
                        display: 'flex',
                        gap: '0.65rem'
                      }}
                    >
                      <div style={{ marginTop: '0.15rem' }}>{renderNotificationIcon(item.type)}</div>
                      <div>
                        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.15rem' }}>
                          {item.title}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.3' }}>
                          {item.message}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

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

        {/* User Profile Dropdown */}
        <div style={{ position: 'relative' }}>
          <div 
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotificationsMenu(false);
            }}
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
              src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'} 
              alt={currentUser.name} 
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid var(--accent-purple, #6366f1)'
              }} 
            />
            <div style={{ display: 'flex', flexDirection: 'column' }} className="hide-on-mobile">
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                {currentUser.name}
              </span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'capitalize' }}>
                {currentUser.role || 'student'}
              </span>
            </div>
          </div>

          {/* Profile Menu Popup */}
          {showProfileMenu && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: '48px',
              width: '210px',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: '14px',
              boxShadow: '0 12px 30px rgba(0,0,0,0.18)',
              padding: '0.5rem',
              zIndex: 50
            }}>
              <Link 
                to="/settings" 
                onClick={() => setShowProfileMenu(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '0.55rem 0.75rem',
                  fontSize: '0.85rem',
                  color: 'var(--text-primary)',
                  textDecoration: 'none',
                  borderRadius: '8px'
                }}
              >
                <User size={15} /> My Profile & Settings
              </Link>

              <Link 
                to="/sessions" 
                onClick={() => setShowProfileMenu(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '0.55rem 0.75rem',
                  fontSize: '0.85rem',
                  color: 'var(--text-primary)',
                  textDecoration: 'none',
                  borderRadius: '8px'
                }}
              >
                <KeyRound size={15} /> Active Sessions
              </Link>

              <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '0.3rem 0' }} />

              <button 
                onClick={handleLogout}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '0.55rem 0.75rem',
                  fontSize: '0.85rem',
                  color: '#ef4444',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <LogOut size={15} /> Logout
              </button>

              <button 
                onClick={handleLogoutAll}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '0.55rem 0.75rem',
                  fontSize: '0.8rem',
                  color: '#ef4444',
                  backgroundColor: 'rgba(239, 68, 68, 0.08)',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  marginTop: '0.2rem'
                }}
              >
                <ShieldAlert size={14} /> Logout All Devices
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};

export default Navbar;
