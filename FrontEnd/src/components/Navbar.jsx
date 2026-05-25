// import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Upload, User as UserIcon, Heart, Shield } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="glass-nav">
      <div className="container flex justify-between items-center nav-content" style={{ height: '70px' }}>
        <Link to="/" className="flex items-center gap-2" style={{ textDecoration: 'none' }}>
          <img src="/images/vpkbiet.png" alt="VPKBIET" style={{ height: '40px' }} />
          <div>
            <h1 style={{ fontSize: '1.2rem', color: 'white', margin: 0 }}>PAPER BOX</h1>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>Academic Repository</p>
          </div>
        </Link>

        <div className="flex items-center gap-4 nav-links">
          {token ? (
            <>
              {user?.role === 'admin' && (
                <Link to="/admin" className="btn-secondary" style={{ textDecoration: 'none', padding: '0.5rem 1rem' }}>
                  <Shield size={18} color="var(--primary)" />
                  <span className="nav-btn-text">Admin</span>
                </Link>
              )}
              <Link to="/favorites" className="btn-secondary" style={{ textDecoration: 'none', padding: '0.5rem 1rem' }}>
                <Heart size={18} color="#f43f5e" />
                <span className="nav-btn-text">Favorites</span>
              </Link>
              <Link to="/upload" className="btn-secondary" style={{ textDecoration: 'none', padding: '0.5rem 1rem' }}>
                <Upload size={18} />
                <span className="nav-btn-text">Upload</span>
              </Link>
              <div className="flex items-center gap-2" style={{ borderLeft: '1px solid var(--glass-border)', paddingLeft: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <UserIcon size={18} color="var(--primary)" />
                  <span className="nav-btn-text" style={{ fontWeight: 500 }}>{user?.username}</span>
                </div>
                <button onClick={handleLogout} className="btn-secondary" style={{ padding: '0.5rem', border: 'none' }} title="Logout">
                  <LogOut size={18} color="var(--danger)" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex gap-2">
              <Link to="/login" className="btn-secondary" style={{ textDecoration: 'none' }}>
                Login
              </Link>
              <Link to="/register" className="btn-primary" style={{ textDecoration: 'none' }}>
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
