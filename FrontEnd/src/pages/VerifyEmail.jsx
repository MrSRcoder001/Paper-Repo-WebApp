import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MailCheck, ArrowRight, RefreshCw, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyEmail, resendVerificationCode, user } = useAuth();

  const email = location.state?.email || user?.email || 'user@papervault.edu';
  const initialCode = location.state?.verificationCode || '';

  const [code, setCode] = useState(initialCode);
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(t => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!code || code.length < 6) {
      toast.error('Please enter the complete 6-digit verification code');
      return;
    }

    setSubmitting(true);
    const result = await verifyEmail(email, code);
    setSubmitting(false);

    if (result?.success) {
      navigate('/dashboard', { replace: true });
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;
    setResending(true);
    const res = await resendVerificationCode(email);
    setResending(false);

    if (res?.success) {
      if (res.verificationCode) setCode(res.verificationCode);
      setTimer(60);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem',
      background: 'radial-gradient(circle at 50% 20%, rgba(34, 197, 94, 0.12) 0%, transparent 60%)'
    }}>
      <div className="pv-card" style={{
        width: '100%',
        maxWidth: '440px',
        padding: '2.5rem 2rem',
        borderRadius: '24px',
        border: '1px solid var(--border-color)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
        backdropFilter: 'blur(16px)',
        textAlign: 'center',
        animation: 'fadeIn 0.3s ease-in-out'
      }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #22c55e 0%, #10b981 100%)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          marginBottom: '1rem',
          boxShadow: '0 8px 20px rgba(34, 197, 94, 0.3)'
        }}>
          <MailCheck size={32} />
        </div>

        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.4rem' }}>
          Verify Your Email
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          We've sent a 6-digit verification code to <br />
          <strong style={{ color: 'var(--text-primary)' }}>{email}</strong>
        </p>

        {initialCode && (
          <div style={{
            padding: '0.6rem 1rem',
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            border: '1px border var(--accent-purple)',
            borderRadius: '10px',
            fontSize: '0.8rem',
            color: 'var(--accent-purple, #6366f1)',
            marginBottom: '1.25rem',
            fontWeight: 600
          }}>
            🔑 Demo Code Generated: <strong>{initialCode}</strong>
          </div>
        )}

        <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <input
              type="text"
              maxLength={6}
              className="form-input"
              placeholder="1 2 3 4 5 6"
              value={code}
              onChange={e => setCode(e.target.value.replace(/[^0-9]/g, ''))}
              style={{
                fontSize: '1.5rem',
                letterSpacing: '0.5rem',
                textAlign: 'center',
                fontWeight: 800,
                height: '54px',
                borderRadius: '12px'
              }}
              required
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={submitting}
            style={{
              height: '46px',
              borderRadius: '12px',
              fontSize: '0.95rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              background: 'linear-gradient(135deg, #22c55e 0%, #10b981 100%)',
              border: 'none',
              boxShadow: '0 4px 14px rgba(34, 197, 94, 0.4)'
            }}
          >
            {submitting ? (
              <>
                <Loader2 className="animate-spin" size={18} /> Verifying...
              </>
            ) : (
              <>
                Verify Code <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Didn't receive code?{' '}
          <button
            type="button"
            onClick={handleResend}
            disabled={timer > 0 || resending}
            style={{
              background: 'none',
              border: 'none',
              color: timer > 0 ? 'var(--text-muted)' : 'var(--accent-purple, #6366f1)',
              fontWeight: 700,
              cursor: timer > 0 ? 'default' : 'pointer'
            }}
          >
            {resending ? 'Sending...' : timer > 0 ? `Resend in ${timer}s` : 'Resend Code'}
          </button>
        </div>

        <div style={{ marginTop: '1.5rem' }}>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate('/dashboard')}
            style={{ padding: '0.4rem 1rem', fontSize: '0.8rem', borderRadius: '8px' }}
          >
            Skip for Now
          </button>
        </div>

      </div>
    </div>
  );
};

export default VerifyEmail;
