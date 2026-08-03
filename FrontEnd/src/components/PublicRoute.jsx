import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

/**
 * PublicRoute prevents logged-in users from visiting auth pages (Login, Register).
 * If user is authenticated, it redirects them to /dashboard or /admin.
 */
const PublicRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: 'var(--bg-primary)'
      }}>
        <Loader2 className="animate-spin" size={32} style={{ color: 'var(--accent-purple, #6366f1)' }} />
      </div>
    );
  }

  if (isAuthenticated) {
    const targetPath = (user?.role === 'admin' || user?.role === 'college_admin') ? '/admin' : '/dashboard';
    return <Navigate to={targetPath} replace />;
  }

  return children;
};

export default PublicRoute;
