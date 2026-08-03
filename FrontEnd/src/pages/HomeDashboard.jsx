import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserLevel } from '../utils/levelUtils';
import { 
  Bot, 
  Calendar, 
  FileCheck2, 
  LineChart, 
  Download, 
  Sparkles, 
  ArrowRight, 
  BookOpen, 
  Eye, 
  Bookmark,
  CheckCircle2,
  FileText,
  Upload,
  Flame,
  Search,
  Zap,
  TrendingUp,
  Clock,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import toast from 'react-hot-toast';

const HomeDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeSubjectTab, setActiveSubjectTab] = useState('All');

  const displayName = user?.name || user?.username || 'Scholar';
  const userRole = user?.role || 'student';
  const userXp = user?.xpPoints ?? 1250;
  const userLevel = getUserLevel(userXp);

  const actionCards = [
    {
      title: 'AI Assistant',
      desc: 'Ask instant academic & exam questions',
      icon: Bot,
      color: '#6366f1',
      bg: 'rgba(99, 102, 241, 0.12)',
      path: '/ai-assistant'
    },
    {
      title: 'Search Question Papers',
      desc: 'Access 10,000+ verified PYQs',
      icon: Search,
      color: '#3b82f6',
      bg: 'rgba(59, 130, 246, 0.12)',
      path: '/search'
    },
    {
      title: 'AI Study Planner',
      desc: 'Generate customized revision schedule',
      icon: Calendar,
      color: '#10b981',
      bg: 'rgba(16, 185, 129, 0.12)',
      path: '/study-planner'
    },
    ...(userRole === 'student' ? [
      {
        title: 'My Library & Downloads',
        desc: 'Access offline saved papers & notes',
        icon: Bookmark,
        color: '#f59e0b',
        bg: 'rgba(245, 158, 11, 0.12)',
        path: '/library'
      }
    ] : [
      {
        title: 'Upload Exam Papers',
        desc: 'Publish new question papers with OCR',
        icon: Upload,
        color: '#a855f7',
        bg: 'rgba(168, 85, 247, 0.12)',
        path: '/upload'
      }
    ])
  ];

  const trendingSubjects = [
    { name: 'Data Structures & Algorithms', count: '12,430 Papers', code: 'CS-201' },
    { name: 'Operating Systems', count: '9,876 Papers', code: 'CS-202' },
    { name: 'Database Management Systems', count: '11,354 Papers', code: 'CS-203' },
    { name: 'Computer Networks', count: '8,736 Papers', code: 'CS-204' },
    { name: 'Software Engineering', count: '7,420 Papers', code: 'CS-205' }
  ];

  const latestPapers = [
    { id: 'paper-101', subject: 'Data Structures', term: '2024 End Sem', university: 'SPPU', type: 'PDF', branch: 'Computer' },
    { id: 'paper-105', subject: 'Operating Systems', term: '2024 End Sem', university: 'SPPU', type: 'PDF', branch: 'Computer' },
    { id: 'paper-106', subject: 'DBMS', term: '2024 Mid Sem', university: 'SPPU', type: 'PDF', branch: 'IT' },
    { id: 'paper-107', subject: 'Computer Networks', term: '2024 End Sem', university: 'SPPU', type: 'PDF', branch: 'Computer' }
  ];

  const filteredPapers = activeSubjectTab === 'All' 
    ? latestPapers 
    : latestPapers.filter(p => p.subject.toLowerCase().includes(activeSubjectTab.toLowerCase()));

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      
      {/* Top Banner Greeting */}
      <div style={{
        padding: '1.75rem 2rem',
        borderRadius: '20px',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.15) 100%)',
        border: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              Welcome back, {displayName}! 👋
            </h1>
            <span style={{
              fontSize: '0.7rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              padding: '0.2rem 0.6rem',
              borderRadius: '999px',
              backgroundColor: 'var(--accent-purple)',
              color: '#ffffff'
            }}>
              {userRole}
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Prepare smarter with AI-extracted solution keys & university question archives.
          </p>
        </div>

        {/* Study Streak & XP Points */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            padding: '0.6rem 1rem',
            borderRadius: '14px',
            backgroundColor: 'var(--card-bg)',
            border: '1px solid var(--border-color)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
          }}>
            <Flame size={22} color="#f97316" />
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 800 }}>5 Day Streak</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Keep learning daily!</div>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            padding: '0.6rem 1rem',
            borderRadius: '14px',
            backgroundColor: 'var(--card-bg)',
            border: '1px solid var(--border-color)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
          }}>
            <Zap size={22} color="#eab308" />
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 800 }}>{userXp.toLocaleString()} XP</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{userLevel}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="home-grid">
        
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Action Cards */}
          <div className="grid-4">
            {actionCards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.title}
                  className="pv-card"
                  onClick={() => navigate(card.path)}
                  style={{
                    cursor: 'pointer',
                    padding: '1.1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    backgroundColor: card.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '0.85rem'
                  }}>
                    <Icon size={22} color={card.color} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.92rem', fontWeight: 700, marginBottom: '0.25rem' }}>{card.title}</h4>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.3' }}>{card.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Continue Studying & Quick Download Progress Split */}
          <div className="grid-2">
            
            {/* Continue Studying Card */}
            <div className="pv-card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Continue Revision</h4>
                <Clock size={16} color="var(--text-muted)" />
              </div>
              <div style={{
                backgroundColor: 'var(--bg-tertiary)',
                borderRadius: '14px',
                padding: '1.1rem',
                border: '1px solid var(--border-color)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <BookOpen size={20} color="#6366f1" />
                  </div>
                  <div>
                    <h5 style={{ fontSize: '0.92rem', fontWeight: 700 }}>Data Structures & Algorithms</h5>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Unit 3: Stacks & Queues Revision</p>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                  <span>Last studied today</span>
                  <span style={{ fontWeight: 700, color: 'var(--accent-purple)' }}>68% Completed</span>
                </div>
                <div style={{ height: '7px', backgroundColor: 'var(--border-color)', borderRadius: '999px', overflow: 'hidden', marginBottom: '0.9rem' }}>
                  <div style={{ width: '68%', height: '100%', backgroundColor: 'var(--accent-purple)', borderRadius: '999px' }} />
                </div>
                <button className="btn-primary" onClick={() => navigate('/paper/paper-101')} style={{ width: '100%', padding: '0.5rem', fontSize: '0.82rem', borderRadius: '10px' }}>
                  Resume Study Session
                </button>
              </div>
            </div>

            {/* Offline Saved Papers */}
            <div className="pv-card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Recently Downloaded</h4>
                <Download size={16} color="var(--text-muted)" />
              </div>
              <div style={{
                backgroundColor: 'var(--bg-tertiary)',
                borderRadius: '14px',
                padding: '1.1rem',
                border: '1px solid var(--border-color)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FileText size={20} color="#10b981" />
                  </div>
                  <div>
                    <h5 style={{ fontSize: '0.92rem', fontWeight: 700 }}>Operating Systems</h5>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>2024 End Sem Question Paper</p>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                  <span>Offline Ready</span>
                  <span style={{ fontWeight: 700, color: '#10b981' }}>100% Downloaded</span>
                </div>
                <div style={{ height: '7px', backgroundColor: 'var(--border-color)', borderRadius: '999px', overflow: 'hidden', marginBottom: '0.9rem' }}>
                  <div style={{ width: '100%', height: '100%', backgroundColor: '#10b981', borderRadius: '999px' }} />
                </div>
                <button 
                  className="btn-secondary" 
                  onClick={() => navigate('/library')} 
                  style={{ width: '100%', padding: '0.5rem', fontSize: '0.82rem', borderRadius: '10px' }}
                >
                  View All Downloads
                </button>
              </div>
            </div>

          </div>

          {/* Latest Question Papers Section */}
          <div className="pv-card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 800 }}>Latest Question Papers</h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Recently uploaded university exam solutions</p>
              </div>
              
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                {['All', 'Data Structures', 'DBMS'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveSubjectTab(tab)}
                    style={{
                      padding: '0.3rem 0.7rem',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      backgroundColor: activeSubjectTab === tab ? 'var(--accent-purple)' : 'transparent',
                      color: activeSubjectTab === tab ? '#ffffff' : 'var(--text-secondary)'
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid-4">
              {filteredPapers.map((paper) => (
                <div
                  key={paper.id}
                  onClick={() => navigate(`/paper/${paper.id}`)}
                  style={{
                    backgroundColor: 'var(--bg-tertiary)',
                    borderRadius: '12px',
                    border: '1px solid var(--border-color)',
                    padding: '0.9rem',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.45rem',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent-purple)'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--accent-purple)', padding: '0.15rem 0.45rem', borderRadius: '6px', backgroundColor: 'var(--accent-light-purple)' }}>
                      {paper.type}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{paper.branch}</span>
                  </div>
                  <h6 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
                    {paper.subject}
                  </h6>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {paper.term} • {paper.university}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: AI Recommendations + Trending Subjects */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* AI Smart Recommendations */}
          <div className="pv-card" style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--accent-purple)',
            padding: '1.25rem',
            background: 'linear-gradient(180deg, rgba(99, 102, 241, 0.08) 0%, transparent 100%)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <Sparkles size={18} color="var(--accent-purple)" />
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-purple)' }}>
                AI Prep Recommendations
              </h4>
            </div>
            
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>
              High frequency exam topics predicted for end-sem preparation:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.1rem' }}>
              <div style={{ padding: '0.5rem 0.75rem', borderRadius: '10px', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700 }}>Unit 3 - Stack & Queues</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>85% probability in End-Sem</div>
                </div>
                <ChevronRight size={16} color="var(--text-muted)" />
              </div>

              <div style={{ padding: '0.5rem 0.75rem', borderRadius: '10px', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700 }}>Process Synchronization</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>78% probability in End-Sem</div>
                </div>
                <ChevronRight size={16} color="var(--text-muted)" />
              </div>

              <div style={{ padding: '0.5rem 0.75rem', borderRadius: '10px', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700 }}>B-Trees & Indexing</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>72% probability in End-Sem</div>
                </div>
                <ChevronRight size={16} color="var(--text-muted)" />
              </div>
            </div>

            <button className="btn-primary" onClick={() => navigate('/study-planner')} style={{ width: '100%', padding: '0.55rem', fontSize: '0.82rem', borderRadius: '10px' }}>
              Generate Study Plan
            </button>
          </div>

          {/* Popular Trending Subjects */}
          <div className="pv-card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>
                Popular Subjects
              </h4>
              <TrendingUp size={16} color="var(--accent-purple)" />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {trendingSubjects.map((sub) => (
                <div 
                  key={sub.name} 
                  onClick={() => navigate(`/search?subject=${encodeURIComponent(sub.name)}`)}
                  style={{
                    display: 'flex',
                    justify: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    padding: '0.5rem 0.6rem',
                    borderRadius: '8px',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '6px', backgroundColor: 'var(--accent-light-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <BookOpen size={14} color="var(--accent-purple)" />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>{sub.name}</div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{sub.code}</div>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--accent-purple)' }}>{sub.count}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default HomeDashboard;
