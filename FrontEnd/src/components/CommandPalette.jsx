import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Search, FileText, Bot, CalendarCheck, BarChart3, Upload, X } from 'lucide-react';

const CommandPalette = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userRole = user?.role || 'student';
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(true); // Toggle
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  let actions = [
    { title: 'Search Data Structures 2024 End Sem Paper', path: '/search?subject=Data+Structures', icon: FileText, category: 'Papers' },
    { title: 'Ask AI: What is the difference between Stack and Queue?', path: '/ai-assistant?q=Stack+vs+Queue', icon: Bot, category: 'AI Assistant' },
    { title: 'Generate Personal Study Plan', path: '/study-planner', icon: CalendarCheck, category: 'Study Planner' },
    { title: 'View Subject Wise Difficulty Analytics', path: '/analytics', icon: BarChart3, category: 'Analytics' },
    { title: 'Upload New Question Paper with OCR', path: '/upload', icon: Upload, category: 'Actions' }
  ];

  if (userRole === 'student') {
    actions = actions.filter(a => a.category !== 'Analytics');
  }

  const filtered = actions.filter(a => a.title.toLowerCase().includes(query.toLowerCase()) || a.category.toLowerCase().includes(query.toLowerCase()));

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      paddingTop: '10vh',
      zIndex: 100
    }} onClick={onClose}>
      
      <div style={{
        width: '100%',
        maxWidth: '560px',
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: '16px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
        overflow: 'hidden'
      }} onClick={e => e.stopPropagation()}>
        
        {/* Input Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.9rem 1.25rem',
          borderBottom: '1px solid var(--border-color)'
        }}>
          <Search size={18} color="var(--accent-purple)" />
          <input
            type="text"
            placeholder="Type a command or search papers, subjects, AI tools..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              backgroundColor: 'transparent',
              fontSize: '0.95rem',
              color: 'var(--text-primary)'
            }}
          />
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        {/* Results */}
        <div style={{ padding: '0.5rem', maxHeight: '340px', overflowY: 'auto' }}>
          {filtered.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              No results found for "{query}"
            </div>
          ) : (
            filtered.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  onClick={() => {
                    navigate(item.path);
                    onClose();
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--accent-light-purple)'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Icon size={18} color="var(--accent-purple)" />
                    <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)' }}>{item.title}</span>
                  </div>
                  <span style={{
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    padding: '0.15rem 0.4rem',
                    borderRadius: '6px',
                    backgroundColor: 'var(--bg-tertiary)',
                    color: 'var(--text-muted)'
                  }}>
                    {item.category}
                  </span>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
};

export default CommandPalette;
