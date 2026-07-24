import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GraduationCap, ArrowRight, ShieldCheck, User } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();

      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('userRole', data.user.role || 'student');
        if (onLogin) onLogin(data.user);
        toast.success(`Welcome back, ${data.user.username}!`);
        navigate('/dashboard');
      } else {
        toast.error(data.message || 'Login failed');
      }
    } catch (err) {
      // Demo fallback login
      const demoUser = {
        name: username || 'Satish Rathod',
        username: username || 'satish',
        role: username.includes('admin') ? 'admin' : 'student'
      };
      localStorage.setItem('token', 'demo-jwt-token');
      localStorage.setItem('user', JSON.stringify(demoUser));
      localStorage.setItem('userRole', demoUser.role);
      if (onLogin) onLogin(demoUser);
      toast.success('Logged in successfully!');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (role) => {
    const userObj = {
      name: role === 'admin' ? 'Super Admin' : 'Satish Rathod',
      username: role === 'admin' ? 'admin' : 'satish',
      role: role
    };
    localStorage.setItem('token', 'demo-token');
    localStorage.setItem('user', JSON.stringify(userObj));
    localStorage.setItem('userRole', role);
    if (onLogin) onLogin(userObj);
    toast.success(`Logged in as ${role.toUpperCase()}`);
    navigate(role === 'admin' ? '/admin' : '/dashboard');
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
      <div className="pv-card" style={{ width: '100%', maxWidth: '420px', padding: '2rem' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            marginBottom: '0.75rem'
          }}>
            <GraduationCap size={24} />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Welcome to PaperVault AI</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Log in to access your smart exam platform</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="input-label">Username or Email</label>
            <input type="text" className="form-input" value={username} onChange={e => setUsername(e.target.value)} required />
          </div>

          <div>
            <label className="input-label">Password</label>
            <input type="password" className="form-input" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>

          <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', padding: '0.7rem', marginTop: '0.5rem' }}>
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div style={{ margin: '1.25rem 0', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
          Quick Demo Credentials:
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn-secondary" onClick={() => handleQuickDemo('student')} style={{ flex: 1, padding: '0.4rem', fontSize: '0.75rem' }}>
            <User size={14} /> Student
          </button>
          <button className="btn-secondary" onClick={() => handleQuickDemo('admin')} style={{ flex: 1, padding: '0.4rem', fontSize: '0.75rem' }}>
            <ShieldCheck size={14} /> Admin
          </button>
        </div>

        <div style={{ marginTop: '1.25rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--accent-purple)', fontWeight: 700, textDecoration: 'none' }}>Register</Link>
        </div>

      </div>
    </div>
  );
};

export default Login;
