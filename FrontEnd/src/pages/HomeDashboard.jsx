import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
  FileText
} from 'lucide-react';

const HomeDashboard = () => {
  const navigate = useNavigate();

  const user = {
    name: 'Satish',
    fullName: 'Satish Rathod',
    role: 'Student'
  };

  const actionCards = [
    {
      title: 'AI Assistant',
      desc: 'Ask any academic question',
      icon: Bot,
      color: '#6366f1',
      bg: 'rgba(99, 102, 241, 0.1)',
      path: '/ai-assistant'
    },
    {
      title: 'AI Study Planner',
      desc: 'Get personalized study plan',
      icon: Calendar,
      color: '#3b82f6',
      bg: 'rgba(59, 130, 246, 0.1)',
      path: '/study-planner'
    },
    {
      title: 'Mock Test',
      desc: 'Practice with AI generated tests',
      icon: FileCheck2,
      color: '#10b981',
      bg: 'rgba(16, 185, 129, 0.1)',
      path: '/mock-tests'
    },
    {
      title: 'Paper Analysis',
      desc: 'Analyze question paper trends',
      icon: LineChart,
      color: '#f59e0b',
      bg: 'rgba(245, 158, 11, 0.1)',
      path: '/analytics'
    }
  ];

  const trendingSubjects = [
    { name: 'Data Structures', count: '12,430 Papers' },
    { name: 'Operating System', count: '9,876 Papers' },
    { name: 'DBMS', count: '11,354 Papers' },
    { name: 'Computer Networks', count: '8,736 Papers' },
    { name: 'Algorithms', count: '10,987 Papers' }
  ];

  const latestPapers = [
    { id: 'paper-101', subject: 'Data Structures', term: '2024 End Sem', university: 'SPPU', type: 'PDF' },
    { id: 'paper-105', subject: 'Operating System', term: '2024 End Sem', university: 'SPPU', type: 'PDF' },
    { id: 'paper-106', subject: 'DBMS', term: '2024 Mid Sem', university: 'SPPU', type: 'PDF' },
    { id: 'paper-107', subject: 'Computer Networks', term: '2024 End Sem', university: 'SPPU', type: 'PDF' }
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      
      {/* Top Greeting Header */}
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
          Hello, {user.name} 👋
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
          What do you want to study today?
        </p>
      </div>

      {/* Main Content Grid + Right Recommendations Panel (Matching Screen 2) */}
      <div className="home-grid">
        
        {/* Left Column: 4 Action Cards + Continue Studying + Recent Downloads + Latest Papers */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* 4 Action Cards */}
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
                    padding: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    backgroundColor: card.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '0.75rem'
                  }}>
                    <Icon size={20} color={card.color} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.2rem' }}>{card.title}</h4>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{card.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Continue Studying & Recent Downloads Split */}
          <div className="grid-2">
            
            {/* Continue Studying Card */}
            <div className="pv-card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Continue Studying</h4>
              </div>
              <div style={{
                backgroundColor: 'var(--bg-tertiary)',
                borderRadius: '12px',
                padding: '1rem',
                border: '1px solid var(--border-color)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <BookOpen size={18} color="#6366f1" />
                  </div>
                  <div>
                    <h5 style={{ fontSize: '0.9rem', fontWeight: 700 }}>Data Structures</h5>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Unit 3 - Stack</p>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                  <span>Last studied 2 hours ago</span>
                  <span style={{ fontWeight: 700, color: 'var(--accent-purple)' }}>68%</span>
                </div>
                <div style={{ height: '6px', backgroundColor: 'var(--border-color)', borderRadius: '999px', overflow: 'hidden', marginBottom: '0.85rem' }}>
                  <div style={{ width: '68%', height: '100%', backgroundColor: 'var(--accent-purple)', borderRadius: '999px' }} />
                </div>
                <button className="btn-primary" onClick={() => navigate('/paper/paper-101')} style={{ width: '100%', padding: '0.45rem', fontSize: '0.8rem' }}>
                  Continue
                </button>
              </div>
            </div>

            {/* Recent Downloads Card */}
            <div className="pv-card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Recent Downloads</h4>
              </div>
              <div style={{
                backgroundColor: 'var(--bg-tertiary)',
                borderRadius: '12px',
                padding: '1rem',
                border: '1px solid var(--border-color)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FileText size={18} color="#10b981" />
                  </div>
                  <div>
                    <h5 style={{ fontSize: '0.9rem', fontWeight: 700 }}>Operating System</h5>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>2024 End Sem</p>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                  <span>Downloaded</span>
                  <span style={{ fontWeight: 700, color: '#10b981' }}>100%</span>
                </div>
                <div style={{ height: '6px', backgroundColor: 'var(--border-color)', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ width: '100%', height: '100%', backgroundColor: '#10b981', borderRadius: '999px' }} />
                </div>
              </div>
            </div>

          </div>

          {/* Latest Papers Header & Grid (Matching Screen 2) */}
          <div className="pv-card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Latest Papers</h4>
              <Link to="/search" style={{ color: 'var(--accent-purple)', fontSize: '0.8rem', fontWeight: 700, textDecoration: 'none' }}>
                View All &rarr;
              </Link>
            </div>

            <div className="grid-4">
              {latestPapers.map((paper) => (
                <div
                  key={paper.id}
                  onClick={() => navigate(`/paper/${paper.id}`)}
                  style={{
                    backgroundColor: 'var(--bg-tertiary)',
                    borderRadius: '12px',
                    border: '1px solid var(--border-color)',
                    padding: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.4rem'
                  }}
                >
                  <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--accent-purple)', padding: '0.1rem 0.4rem', borderRadius: '4px', backgroundColor: 'var(--accent-light-purple)', width: 'fit-content' }}>
                    {paper.type}
                  </span>
                  <h6 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {paper.subject}
                  </h6>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    {paper.term}
                  </p>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    {paper.university}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Sidebar: AI Recommendations + Trending Subjects */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* AI Recommendations Box (Matching Screen 2) */}
          <div className="pv-card" style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--accent-purple)',
            padding: '1.25rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <Sparkles size={18} color="var(--accent-purple)" />
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-purple)' }}>
                AI Recommendations
              </h4>
            </div>
            
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
              You should focus on:
            </p>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
              <li style={{ fontSize: '0.82rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#6366f1' }} />
                Unit 3 - Stack <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>(DS)</span>
              </li>
              <li style={{ fontSize: '0.82rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#3b82f6' }} />
                Unit 2 - Process <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>(OS)</span>
              </li>
              <li style={{ fontSize: '0.82rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                Normalization <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>(DBMS)</span>
              </li>
            </ul>

            <button className="btn-primary" onClick={() => navigate('/study-planner')} style={{ width: '100%', padding: '0.5rem', fontSize: '0.8rem' }}>
              View Study Plan
            </button>
          </div>

          {/* Trending Subjects List */}
          <div className="pv-card" style={{ padding: '1.25rem' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem' }}>
              Trending Subjects
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {trendingSubjects.map((sub) => (
                <div 
                  key={sub.name} 
                  onClick={() => navigate(`/search?subject=${encodeURIComponent(sub.name)}`)}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', padding: '0.3rem 0' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <BookOpen size={15} color="var(--accent-purple)" />
                    <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>{sub.name}</span>
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{sub.count}</span>
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
