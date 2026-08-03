import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  GraduationCap, 
  ArrowRight, 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  Loader2,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginWithGoogle } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const redirectUserByRole = (userRole) => {
    const from = location.state?.from?.pathname;
    if (from && from !== '/login') {
      navigate(from, { replace: true });
    } else if (userRole === 'admin' || userRole === 'college_admin') {
      navigate('/admin', { replace: true });
    } else {
      navigate('/dashboard', { replace: true });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    
    if (!username.trim() || !password) {
      setErrorMessage('Please enter your email or username and password.');
      return;
    }

    setSubmitting(true);
    const result = await login(username, password, rememberMe);
    setSubmitting(false);

    if (result.success) {
      redirectUserByRole(result.user?.role);
    } else {
      setErrorMessage(result.message || 'Authentication failed');
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleSubmitting(true);
    setErrorMessage('');

    const googleMockUser = {
      googleId: `g_${Date.now()}`,
      email: username.includes('@') ? username : `${username || 'google_user'}@gmail.com`,
      name: username ? username.charAt(0).toUpperCase() + username.slice(1) : 'Google Scholar',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'
    };

    const result = await loginWithGoogle(googleMockUser);
    setGoogleSubmitting(false);

    if (result?.success) {
      redirectUserByRole(result.user?.role);
    } else {
      setErrorMessage(result?.message || 'Google OAuth sign in failed.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem',
      background: 'radial-gradient(circle at 50% 20%, rgba(99, 102, 241, 0.12) 0%, transparent 60%)'
    }}>
      <div className="pv-card" style={{
        width: '100%',
        maxWidth: '440px',
        padding: '2.5rem 2rem',
        borderRadius: '24px',
        border: '1px solid var(--border-color)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
        backdropFilter: 'blur(16px)',
        animation: 'fadeIn 0.3s ease-in-out'
      }}>
        
        {/* Header Icon & Title */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            marginBottom: '1rem',
            boxShadow: '0 8px 20px rgba(99, 102, 241, 0.3)'
          }}>
            <GraduationCap size={30} />
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.4rem' }}>
            Welcome Back
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Sign in to access your secure exam repository & AI tools
          </p>
        </div>

        {/* Error Alert Box */}
        {errorMessage && (
          <div style={{
            padding: '0.75rem 1rem',
            borderRadius: '12px',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            color: '#ef4444',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            marginBottom: '1.25rem'
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Google OAuth Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={googleSubmitting || submitting}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            padding: '0.75rem 1rem',
            borderRadius: '12px',
            border: '1px solid var(--border-color)',
            backgroundColor: 'var(--card-bg, #ffffff)',
            color: 'var(--text-primary)',
            fontSize: '0.9rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            marginBottom: '1.25rem'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          {googleSubmitting ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
          )}
          Continue with Google
        </button>

        {/* Divider */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          margin: '1.25rem 0',
          color: 'var(--text-muted)',
          fontSize: '0.8rem'
        }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }} />
          <span>OR SIGN IN WITH EMAIL</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }} />
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          <div>
            <label className="input-label" style={{ fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.4rem', display: 'block' }}>
              Email or Username
            </label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                className="form-input"
                placeholder="e.g. name@vpkbiet.edu or username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                style={{ paddingLeft: '2.4rem', width: '100%', height: '44px', borderRadius: '10px' }}
                required
              />
            </div>
          </div>

          <div>
            <label className="input-label" style={{ fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.4rem', display: 'block' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{ paddingLeft: '2.4rem', paddingRight: '2.4rem', width: '100%', height: '44px', borderRadius: '10px' }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Remember Me Checkbox */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'var(--text-primary)' }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                style={{ borderRadius: '4px', accentColor: 'var(--accent-purple, #6366f1)', cursor: 'pointer' }}
              />
              Remember Me (30 days)
            </label>
            <a href="#forgot" onClick={(e) => { e.preventDefault(); toast('Password reset instructions emailed!', { icon: '📧' }); }} style={{ color: 'var(--accent-purple, #6366f1)', textDecoration: 'none', fontWeight: 600 }}>
              Forgot password?
            </a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn-primary"
            disabled={submitting}
            style={{
              width: '100%',
              height: '46px',
              borderRadius: '12px',
              fontSize: '0.95rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              marginTop: '0.5rem',
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              border: 'none',
              boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)'
            }}
          >
            {submitting ? (
              <>
                <Loader2 className="animate-spin" size={18} /> Authenticating...
              </>
            ) : (
              <>
                Sign In <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Register Link Footer */}
        <div style={{ marginTop: '1.75rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--accent-purple, #6366f1)', fontWeight: 700, textDecoration: 'none' }}>
            Create an Account
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;
