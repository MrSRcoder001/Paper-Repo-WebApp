import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Monitor, Smartphone, Globe, LogOut, Trash2, Clock, AlertTriangle, KeyRound } from 'lucide-react';
import toast from 'react-hot-toast';

const SessionsPage = () => {
  const { getSessions, revokeSession, logoutAll, user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSessionsList = async () => {
    setLoading(true);
    const data = await getSessions();
    setSessions(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchSessionsList();
  }, []);

  const handleRevoke = async (id) => {
    const success = await revokeSession(id);
    if (success) {
      setSessions(prev => prev.filter(s => s.id !== id));
    }
  };

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '900px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'rgba(99, 102, 241, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-purple, #6366f1)'
          }}>
            <KeyRound size={22} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Session Management & Security</h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Manage active logins across browser sessions and devices.
            </p>
          </div>
        </div>
      </div>

      {/* Top Banner Actions */}
      <div className="pv-card" style={{
        padding: '1.5rem',
        borderRadius: '16px',
        border: '1px solid var(--border-color)',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(168, 85, 247, 0.05) 100%)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <ShieldCheck size={32} style={{ color: '#22c55e' }} />
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Security Status</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Logged in as <strong>{user?.name}</strong> ({user?.email}) • Role: <strong style={{ textTransform: 'capitalize' }}>{user?.role}</strong>
            </p>
          </div>
        </div>

        <button
          className="btn-secondary"
          onClick={logoutAll}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.6rem 1.2rem',
            borderRadius: '10px',
            color: '#ef4444',
            borderColor: 'rgba(239, 68, 68, 0.3)',
            fontWeight: 600
          }}
        >
          <LogOut size={16} /> Logout from All Devices
        </button>
      </div>

      {/* Sessions List */}
      <div className="pv-card" style={{ padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          Active Devices & Refresh Sessions ({sessions.length})
        </h2>

        {loading ? (
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Loading active sessions...</p>
        ) : sessions.length === 0 ? (
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No active secondary sessions found.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {sessions.map(session => {
              const isMobile = session.deviceInfo?.deviceType === 'Mobile';
              return (
                <div
                  key={session.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem',
                    borderRadius: '12px',
                    border: session.isCurrent ? '1.5px solid var(--accent-purple, #6366f1)' : '1px solid var(--border-color)',
                    backgroundColor: session.isCurrent ? 'rgba(99, 102, 241, 0.04)' : 'transparent'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '10px',
                      backgroundColor: 'var(--bg-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--text-primary)'
                    }}>
                      {isMobile ? <Smartphone size={20} /> : <Monitor size={20} />}
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                          {session.deviceInfo?.browser || 'Browser'} on {session.deviceInfo?.os || 'OS'}
                        </span>
                        {session.isCurrent && (
                          <span style={{
                            padding: '0.15rem 0.5rem',
                            borderRadius: '20px',
                            backgroundColor: '#22c55e',
                            color: '#fff',
                            fontSize: '0.7rem',
                            fontWeight: 700
                          }}>
                            Current Device
                          </span>
                        )}
                      </div>

                      <div style={{ display: 'flex', gap: '1rem', fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Globe size={12} /> IP: {session.deviceInfo?.ip || '127.0.0.1'}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Clock size={12} /> Last active: {new Date(session.lastActive).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {!session.isCurrent && (
                    <button
                      onClick={() => handleRevoke(session.id)}
                      style={{
                        padding: '0.4rem 0.75rem',
                        borderRadius: '8px',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        backgroundColor: 'transparent',
                        color: '#ef4444',
                        cursor: 'pointer',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem'
                      }}
                    >
                      <Trash2 size={14} /> Revoke
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};

export default SessionsPage;
