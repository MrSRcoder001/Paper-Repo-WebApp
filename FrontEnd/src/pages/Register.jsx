import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  GraduationCap, 
  ArrowRight, 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Check, 
  X, 
  Loader2, 
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Password Strength Calculations
  const hasMinLength = formData.password.length >= 8;
  const hasUppercase = /[A-Z]/.test(formData.password);
  const hasLowercase = /[a-z]/.test(formData.password);
  const hasNumber = /[0-9]/.test(formData.password);

  const isPasswordValid = hasMinLength && hasUppercase && hasLowercase && hasNumber;
  const passwordsMatch = formData.password && formData.password === formData.confirmPassword;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.name.trim() || !formData.email.trim()) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (!isPasswordValid) {
      setErrorMessage('Password does not meet complexity requirements.');
      return;
    }

    if (!passwordsMatch) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setSubmitting(true);

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      password: formData.password
    };

    const result = await register(payload);
    setSubmitting(false);

    if (result.success) {
      // Navigate to email verification modal/page
      navigate('/verify-email', { 
        state: { 
          email: formData.email,
          verificationCode: result.verificationCode 
        } 
      });
    } else {
      setErrorMessage(result.message || 'Registration failed.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem',
      background: 'radial-gradient(circle at 50% 20%, rgba(168, 85, 247, 0.12) 0%, transparent 60%)'
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
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            marginBottom: '1rem',
            boxShadow: '0 8px 20px rgba(168, 85, 247, 0.3)'
          }}>
            <GraduationCap size={30} />
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.4rem' }}>
            Create Your Account
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Join PaperVault AI to unlock smart exam preparation
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

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          
          {/* Full Name */}
          <div>
            <label className="input-label" style={{ fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.35rem', display: 'block' }}>
              Full Name
            </label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                name="name"
                className="form-input"
                placeholder="e.g. Satish Rathod"
                value={formData.name}
                onChange={handleChange}
                style={{ paddingLeft: '2.4rem', width: '100%', height: '44px', borderRadius: '10px' }}
                required
              />
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label className="input-label" style={{ fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.35rem', display: 'block' }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="email"
                name="email"
                className="form-input"
                placeholder="name@edu.in"
                value={formData.email}
                onChange={handleChange}
                style={{ paddingLeft: '2.4rem', width: '100%', height: '44px', borderRadius: '10px' }}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="input-label" style={{ fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.35rem', display: 'block' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                className="form-input"
                placeholder="Minimum 8 characters"
                value={formData.password}
                onChange={handleChange}
                style={{ paddingLeft: '2.4rem', paddingRight: '2.4rem', width: '100%', height: '44px', borderRadius: '10px' }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Password Strength Checklist */}
            {formData.password && (
              <div style={{
                marginTop: '0.5rem',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.3rem',
                fontSize: '0.73rem'
              }}>
                <span style={{ color: hasMinLength ? '#22c55e' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  {hasMinLength ? <Check size={12} /> : <X size={12} />} 8+ characters
                </span>
                <span style={{ color: hasUppercase ? '#22c55e' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  {hasUppercase ? <Check size={12} /> : <X size={12} />} 1 Uppercase letter
                </span>
                <span style={{ color: hasNumber ? '#22c55e' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  {hasNumber ? <Check size={12} /> : <X size={12} />} 1 Number
                </span>
                <span style={{ color: passwordsMatch ? '#22c55e' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  {passwordsMatch ? <Check size={12} /> : <X size={12} />} Passwords match
                </span>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="input-label" style={{ fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.35rem', display: 'block' }}>
              Confirm Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                className="form-input"
                placeholder="Re-enter password"
                value={formData.confirmPassword}
                onChange={handleChange}
                style={{ paddingLeft: '2.4rem', width: '100%', height: '44px', borderRadius: '10px' }}
                required
              />
            </div>
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
              background: 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)',
              border: 'none',
              boxShadow: '0 4px 14px rgba(168, 85, 247, 0.4)'
            }}
          >
            {submitting ? (
              <>
                <Loader2 className="animate-spin" size={18} /> Creating Account...
              </>
            ) : (
              <>
                Create Account <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--accent-purple, #6366f1)', fontWeight: 700, textDecoration: 'none' }}>
            Sign In
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Register;
