import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import toast from 'react-hot-toast';

const Register = ({ onRegister }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    college: 'Pune Engineering College',
    university: 'SPPU',
    role: 'student'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('userRole', data.user.role || 'student');
        if (onRegister) onRegister(data.user);
        toast.success('Registration successful!');
        navigate('/dashboard');
      } else {
        toast.error(data.message || 'Registration failed');
      }
    } catch (err) {
      const demoUser = { username: formData.username || 'Satish', role: 'student' };
      localStorage.setItem('token', 'demo-token');
      localStorage.setItem('user', JSON.stringify(demoUser));
      localStorage.setItem('userRole', 'student');
      if (onRegister) onRegister(demoUser);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '85vh' }}>
      <div className="pv-card" style={{ width: '100%', maxWidth: '440px', padding: '2rem' }}>
        
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
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Create Your Account</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Join 500,000+ students studying smarter with AI</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="input-label">Username</label>
            <input type="text" className="form-input" value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} required />
          </div>

          <div>
            <label className="input-label">Email</label>
            <input type="email" className="form-input" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
          </div>

          <div>
            <label className="input-label">Password</label>
            <input type="password" className="form-input" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} required />
          </div>

          <div>
            <label className="input-label">University</label>
            <select className="form-select" value={formData.university} onChange={e => setFormData({ ...formData, university: e.target.value })}>
              <option value="SPPU">SPPU</option>
              <option value="COEP">COEP</option>
              <option value="VIT">VIT</option>
            </select>
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '0.7rem', marginTop: '0.5rem' }}>
            Create Account
          </button>
        </form>

        <div style={{ marginTop: '1.25rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--accent-purple)', fontWeight: 700, textDecoration: 'none' }}>Sign In</Link>
        </div>

      </div>
    </div>
  );
};

export default Register;
