import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Download, 
  Printer, 
  Maximize2, 
  Bookmark, 
  Heart, 
  Share2, 
  AlertTriangle, 
  Bot, 
  ChevronLeft, 
  ChevronRight,
  FileText,
  Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';

const PaperViewer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [liked, setLiked] = useState(false);

  const paperDetails = {
    title: "Data Structures – End Sem – 2024",
    subject: "Data Structures",
    subjectCode: "CS301",
    semester: "Semester 3",
    examType: "End Semester",
    year: "2024",
    college: "Pune Engineering College",
    university: "SPPU",
    department: "Computer Engineering",
    time: "3 Hours",
    maxMarks: 70
  };

  const handleAiExplain = () => {
    navigate(`/ai-assistant?q=Explain+Data+Structures+End+Sem+2024+questions`);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      
      {/* Top Bar: Title & Breadcrumbs + Top Action Toolbar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'var(--bg-secondary)',
        padding: '0.85rem 1.25rem',
        borderRadius: '14px',
        border: '1px solid var(--border-color)'
      }}>
        <div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', gap: '0.4rem', marginBottom: '0.2rem' }}>
            <span>{paperDetails.university}</span> &gt;
            <span>{paperDetails.college}</span> &gt;
            <span>{paperDetails.department}</span> &gt;
            <span>{paperDetails.semester}</span>
          </div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{paperDetails.title}</h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <button className="btn-primary" onClick={() => toast.success('Downloading PDF...')} style={{ padding: '0.45rem 0.9rem', fontSize: '0.8rem' }}>
            <Download size={15} /> Download
          </button>
          
          <button 
            onClick={() => { setIsBookmarked(!isBookmarked); toast.success(isBookmarked ? 'Removed Bookmark' : 'Bookmarked!'); }}
            style={{
              padding: '0.45rem 0.75rem',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              backgroundColor: isBookmarked ? 'var(--accent-light-purple)' : 'var(--bg-tertiary)',
              color: isBookmarked ? 'var(--accent-purple)' : 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              fontSize: '0.8rem',
              fontWeight: 600
            }}
          >
            <Bookmark size={15} fill={isBookmarked ? 'var(--accent-purple)' : 'none'} /> Bookmark
          </button>

          <button onClick={() => toast.success('Link copied to clipboard!')} style={{ padding: '0.45rem', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            <Share2 size={16} />
          </button>
        </div>
      </div>

      {/* Main 3-Column Viewer Layout (Thumbnails | PDF Content Canvas | Metadata Panel) */}
      <div className="viewer-grid" style={{ minHeight: '680px' }}>
        
        {/* Left Thumbnails Panel */}
        <div className="pv-card viewer-thumbnails" style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)' }}>PAGES (5)</span>
          {[1, 2, 3, 4, 5].map((pageNum) => (
            <div
              key={pageNum}
              onClick={() => setCurrentPage(pageNum)}
              style={{
                width: '90px',
                height: '115px',
                backgroundColor: 'var(--bg-tertiary)',
                border: currentPage === pageNum ? '2px solid var(--accent-purple)' : '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '0.4rem',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.65rem',
                color: 'var(--text-muted)'
              }}
            >
              <div style={{ width: '100%', height: '80px', backgroundColor: 'var(--bg-secondary)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileText size={20} color="var(--text-muted)" />
              </div>
              <span>Page {pageNum}</span>
            </div>
          ))}
        </div>

        {/* Center Paper Canvas Document Rendering (Matching Screen 4 exam layout) */}
        <div className="pv-card" style={{
          padding: '2.5rem',
          backgroundColor: '#ffffff',
          color: '#0f172a',
          borderRadius: '14px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          
          {/* Exam Header */}
          <div>
            <div style={{ textAlign: 'center', borderBottom: '2px solid #0f172a', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Data Structures</h2>
              <p style={{ fontSize: '0.9rem', fontWeight: 600, color: '#475569', marginTop: '0.2rem' }}>End Semester Examination – 2024</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.8rem', fontSize: '0.85rem', fontWeight: 700 }}>
                <span>Time: 3 Hours</span>
                <span>Max. Marks: 70</span>
              </div>
            </div>

            <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#475569', marginBottom: '1.5rem', fontStyle: 'italic' }}>
              Instructions:<br />
              1. All questions are compulsory.<br />
              2. Assume suitable data if required.
            </div>

            {/* Questions List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: '0.9rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                  <span>Q1. (a) Define Stack. Explain its operations.</span>
                  <span>(5)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, marginTop: '0.4rem' }}>
                  <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(b) Implement stack using array.</span>
                  <span>(5)</span>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                  <span>Q2. (a) Convert the following infix expression to postfix.</span>
                  <span>(5)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, marginTop: '0.4rem' }}>
                  <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(b) Evaluate the postfix expression.</span>
                  <span>(5)</span>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                  <span>Q3. (a) Explain applications of stack.</span>
                  <span>(5)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, marginTop: '0.4rem' }}>
                  <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(b) Implement stack using linked list.</span>
                  <span>(10)</span>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                  <span>Q4. (a) Explain Tower of Hanoi problem.</span>
                  <span>(5)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, marginTop: '0.4rem' }}>
                  <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(b) Write recursive solution.</span>
                  <span>(5)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Page Footer Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '1rem', marginTop: '2rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>Page {currentPage} of 5</span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                style={{ padding: '0.3rem 0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', cursor: 'pointer' }}
              >
                <ChevronLeft size={16} />
              </button>
              <button 
                onClick={() => setCurrentPage(Math.min(5, currentPage + 1))}
                style={{ padding: '0.3rem 0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', cursor: 'pointer' }}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

        </div>

        {/* Right Details & Actions Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* Details Card */}
          <div className="pv-card" style={{ padding: '1.25rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              Details
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.82rem' }}>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block' }}>Subject</span>
                <span style={{ fontWeight: 700 }}>{paperDetails.subject}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block' }}>Semester</span>
                <span style={{ fontWeight: 700 }}>{paperDetails.semester}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block' }}>Exam Type</span>
                <span style={{ fontWeight: 700 }}>{paperDetails.examType}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block' }}>Year</span>
                <span style={{ fontWeight: 700 }}>{paperDetails.year}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block' }}>College</span>
                <span style={{ fontWeight: 700 }}>{paperDetails.college}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block' }}>University</span>
                <span style={{ fontWeight: 700 }}>{paperDetails.university}</span>
              </div>
            </div>
          </div>

          {/* AI Helper Card */}
          <div className="pv-card" style={{ padding: '1.25rem', backgroundColor: 'var(--accent-light-purple)', border: '1px solid var(--accent-purple)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--accent-purple)' }}>
              <Sparkles size={18} />
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700 }}>AI Study Tools</h4>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.85rem' }}>
              Get instant step-by-step AI answers & solutions for all questions in this paper.
            </p>
            <button className="btn-primary" onClick={handleAiExplain} style={{ width: '100%', padding: '0.5rem', fontSize: '0.8rem' }}>
              <Bot size={16} /> Explain Questions with AI
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};

export default PaperViewer;
