import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80vh',
        gap: '1rem',
        color: 'var(--text-muted)'
      }}>
        <Loader2 className="animate-spin" size={36} style={{ color: 'var(--accent-purple, #6366f1)' }} />
        <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>Authenticating session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = user?.role === 'college_admin' ? 'admin' : (user?.role || 'student');
    const isAuthorized = allowedRoles.includes(userRole) || userRole === 'admin';

    if (!isAuthorized) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '70vh',
          textAlign: 'center',
          padding: '2rem'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '20px',
            background: 'rgba(239, 68, 68, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ef4444',
            marginBottom: '1rem'
          }}>
            <ShieldAlert size={36} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Access Restricted</h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', maxWidth: '420px', marginBottom: '1.5rem' }}>
            Your account role (<strong style={{ textTransform: 'capitalize' }}>{user?.role}</strong>) does not have permission to view this page. Contact an administrator if you believe this is an error.
          </p>
          <button 
            className="btn-primary" 
            onClick={() => window.location.href = '/dashboard'}
            style={{ padding: '0.6rem 1.5rem', borderRadius: '10px' }}
          >
            Return to Home Dashboard
          </button>
        </div>
      );
    }
  }

  return children;
};

export default ProtectedRoute;
