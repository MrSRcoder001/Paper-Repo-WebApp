import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, GraduationCap, ArrowRight, BookOpen, Users, Building2, CheckCircle2, Star, Sparkles, Shield, ChevronDown, ChevronUp } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFaq, setActiveFaq] = useState(null);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate('/search');
    }
  };

  const popularSubjects = [
    { title: 'Data Structures', papersCount: '12,430 Papers', color: '#6366f1' },
    { title: 'Operating System', papersCount: '9,876 Papers', color: '#3b82f6' },
    { title: 'DBMS', papersCount: '11,354 Papers', color: '#10b981' },
    { title: 'Computer Networks', papersCount: '8,736 Papers', color: '#f59e0b' },
    { title: 'Algorithms', papersCount: '10,987 Papers', color: '#ec4899' },
  ];

  const colleges = ['SPPU', 'COEP', 'VIT', 'PICT', 'SRM', 'MIT WPU'];

  const faqs = [
    { q: 'How does PaperVault AI predict exam questions?', a: 'Our AI analyzes over 10+ years of previous question papers using machine learning & natural language processing to identify recurring topics, question weightage, and faculty pattern trends.' },
    { q: 'Is PaperVault AI free for college students?', a: 'Yes! Students can access, search, and preview question papers for free. Premium features like advanced AI Question Bank Generation and Personal Study Planner are included in the Pro Scholar plan.' },
    { q: 'Can I upload papers from my university?', a: 'Absolutely! Students and faculty members can upload papers. Our integrated OCR automatically detects the subject, semester, and tags.' }
  ];

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh', color: 'var(--text-primary)' }}>
      
      {/* Landing Navbar */}
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1.2rem 3rem',
        borderBottom: '1px solid var(--border-color)',
        backgroundColor: 'var(--bg-secondary)',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff'
          }}>
            <GraduationCap size={22} />
          </div>
          <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            PaperVault<span style={{ color: '#6366f1' }}>.AI</span>
          </span>
        </div>

        <div style={{ display: 'flex', gap: '2rem', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }} className="hide-on-mobile">
          <a href="#features" style={{ textDecoration: 'none', color: 'inherit' }}>Features</a>
          <a href="#universities" style={{ textDecoration: 'none', color: 'inherit' }}>Universities</a>
          <a href="#subjects" style={{ textDecoration: 'none', color: 'inherit' }}>Subjects</a>
          <a href="#testimonials" style={{ textDecoration: 'none', color: 'inherit' }}>Testimonials</a>
          <a href="#about" style={{ textDecoration: 'none', color: 'inherit' }}>About</a>
        </div>

        <div style={{ display: 'flex', gap: '0.85rem' }}>
          <Link to="/login">
            <button className="btn-secondary" style={{ padding: '0.5rem 1.25rem' }}>Login</button>
          </Link>
          <Link to="/register">
            <button className="btn-primary" style={{ padding: '0.5rem 1.25rem' }}>Get Started</button>
          </Link>
        </div>
      </nav>

      {/* Hero Section (Matching Screen 1 in reference image) */}
      <section style={{
        padding: '5rem 2rem 3rem 2rem',
        maxWidth: '1200px',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.4rem 1rem',
          borderRadius: '30px',
          backgroundColor: 'var(--accent-light-purple)',
          color: 'var(--accent-purple)',
          fontSize: '0.85rem',
          fontWeight: 700,
          marginBottom: '1.5rem'
        }}>
          <Sparkles size={16} /> #1 AI Exam Companion for College Students
        </div>

        <h1 style={{
          fontSize: '3.6rem',
          fontWeight: 800,
          lineHeight: 1.15,
          letterSpacing: '-0.03em',
          marginBottom: '1.25rem'
        }}>
          All Previous Year Question Papers.<br />
          One <span className="gradient-text">Smart Platform.</span>
        </h1>

        <p style={{
          fontSize: '1.2rem',
          color: 'var(--text-secondary)',
          maxWidth: '680px',
          margin: '0 auto 2.5rem auto',
          lineHeight: 1.6
        }}>
          Find, analyze and prepare smarter with AI. Your ultimate exam preparation companion.
        </p>

        {/* Hero Search Box */}
        <form onSubmit={handleSearchSubmit} style={{
          maxWidth: '620px',
          margin: '0 auto 3.5rem auto',
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          padding: '0.4rem 0.5rem 0.4rem 1.25rem',
          boxShadow: '0 10px 30px rgba(99, 102, 241, 0.12)'
        }}>
          <Search size={20} color="var(--text-muted)" style={{ marginRight: '0.75rem' }} />
          <input
            type="text"
            placeholder="Search subjects, papers, topics..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              backgroundColor: 'transparent',
              fontSize: '1rem',
              color: 'var(--text-primary)'
            }}
          />
          <button type="submit" className="btn-primary" style={{ padding: '0.75rem 1.75rem', borderRadius: '12px' }}>
            Search
          </button>
        </form>

        {/* Statistics Bar (Matching Screen 1) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1.5rem',
          maxWidth: '1000px',
          margin: '0 auto 4rem auto'
        }} className="grid-4">
          <div className="pv-card" style={{ textAlign: 'center', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-purple)' }}>2M+</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Question Papers</p>
          </div>
          <div className="pv-card" style={{ textAlign: 'center', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-blue)' }}>500K+</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Students</p>
          </div>
          <div className="pv-card" style={{ textAlign: 'center', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-green)' }}>1200+</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Colleges</p>
          </div>
          <div className="pv-card" style={{ textAlign: 'center', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-amber)' }}>50+</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Universities</p>
          </div>
        </div>

      </section>

      {/* Popular Subjects (Matching Screen 1 in reference image) */}
      <section id="subjects" style={{ padding: '3rem 2rem', backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Popular Subjects</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Browse question papers across top engineering branches</p>
            </div>
            <Link to="/search" style={{ color: 'var(--accent-purple)', fontWeight: 700, textDecoration: 'none', fontSize: '0.9rem' }}>
              View All &rarr;
            </Link>
          </div>

          <div className="grid-5" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1.25rem' }}>
            {popularSubjects.map(sub => (
              <div 
                key={sub.title} 
                className="pv-card" 
                onClick={() => navigate(`/search?subject=${encodeURIComponent(sub.title)}`)}
                style={{ cursor: 'pointer', padding: '1.25rem', textAlign: 'left' }}
              >
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--accent-light-purple)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem'
                }}>
                  <BookOpen size={20} color={sub.color} />
                </div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.3rem' }}>{sub.title}</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{sub.papersCount}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trusted Colleges */}
      <section id="universities" style={{ padding: '3rem 2rem', borderBottom: '1px solid var(--border-color)', textAlign: 'center' }}>
        <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.5rem' }}>
          Trusted by Students from Top Universities & Colleges
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '3rem', flexWrap: 'wrap' }}>
          {colleges.map(c => (
            <span key={c} style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-secondary)', opacity: 0.8 }}>
              🎓 {c}
            </span>
          ))}
        </div>
      </section>

      {/* FAQ Accordion */}
      <section style={{ padding: '4rem 2rem', maxWidth: '800px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, textAlign: 'center', marginBottom: '2rem' }}>
          Frequently Asked Questions
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {faqs.map((faq, idx) => (
            <div key={idx} className="pv-card" style={{ padding: '1.25rem', cursor: 'pointer' }} onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>{faq.q}</h4>
                {activeFaq === idx ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>
              {activeFaq === idx && (
                <p style={{ marginTop: '0.75rem', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', padding: '2.5rem 2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        <p>© 2026 PaperVault AI. All rights reserved. Built for College Students Worldwide.</p>
      </footer>

    </div>
  );
};

export default LandingPage;
