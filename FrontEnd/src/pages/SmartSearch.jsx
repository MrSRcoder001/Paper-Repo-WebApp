import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, Filter, Download, Bookmark, Eye, FileText, X, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';

const SmartSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [query, setQuery] = useState(searchParams.get('query') || '');
  const [university, setUniversity] = useState(searchParams.get('university') || 'SPPU');
  const [college, setCollege] = useState(searchParams.get('college') || 'Pune Engineering College');
  const [branch, setBranch] = useState(searchParams.get('branch') || 'Computer Engineering');
  const [semester, setSemester] = useState(searchParams.get('semester') || '3');
  const [subject, setSubject] = useState(searchParams.get('subject') || 'Data Structures');
  const [examType, setExamType] = useState(searchParams.get('examType') || 'End Semester');
  const [year, setYear] = useState(searchParams.get('year') || '2024');

  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bookmarkedIds, setBookmarkedIds] = useState([]);

  // Active filter tags matching Screen 3
  const activeTags = [
    { label: 'SPPU', key: 'university' },
    { label: 'Pune Engineering College', key: 'college' },
    { label: 'Computer Engineering', key: 'branch' },
    { label: 'Sem 3', key: 'semester' },
    { label: 'Data Structures', key: 'subject' },
    { label: '2024', key: 'year' }
  ];

  const fetchPapers = async () => {
    setLoading(true);
    try {
      const queryStr = new URLSearchParams({
        university,
        college,
        branch,
        semester,
        subject,
        examType,
        year,
        query
      }).toString();

      const res = await fetch(`http://localhost:3000/api/papers?${queryStr}`);
      const data = await res.json();
      setPapers(data.papers || data || []);
    } catch (err) {
      console.log('Error fetching papers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPapers();
  }, [searchParams]);

  const handleApplyFilters = () => {
    fetchPapers();
    toast.success('Filters applied successfully');
  };

  const handleClearFilters = () => {
    setQuery('');
    setUniversity('');
    setCollege('');
    setBranch('');
    setSemester('');
    setSubject('');
    setExamType('');
    setYear('');
    fetchPapers();
    toast.success('Filters cleared');
  };

  const toggleBookmark = (id) => {
    if (bookmarkedIds.includes(id)) {
      setBookmarkedIds(bookmarkedIds.filter(b => b !== id));
      toast.success('Removed from bookmarks');
    } else {
      setBookmarkedIds([...bookmarkedIds, id]);
      toast.success('Saved to bookmarks');
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Top Search Input Bar */}
      <div style={{
        display: 'flex',
        gap: '0.75rem',
        backgroundColor: 'var(--bg-secondary)',
        padding: '0.5rem',
        borderRadius: '14px',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--card-shadow)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, paddingLeft: '0.75rem' }}>
          <Search size={20} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search papers by subject, title, university, code..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{
              width: '100%',
              border: 'none',
              outline: 'none',
              backgroundColor: 'transparent',
              fontSize: '0.95rem',
              color: 'var(--text-primary)'
            }}
          />
        </div>
        <button className="btn-primary" onClick={fetchPapers} style={{ padding: '0.6rem 1.5rem', borderRadius: '10px' }}>
          Search
        </button>
      </div>

      {/* Active Filter Badges Strip (Matching Screen 3) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
        {activeTags.map((tag) => (
          <span
            key={tag.label}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.3rem 0.75rem',
              borderRadius: '20px',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              fontSize: '0.78rem',
              fontWeight: 600,
              color: 'var(--text-secondary)'
            }}
          >
            {tag.label}
            <X size={12} style={{ cursor: 'pointer' }} />
          </span>
        ))}
      </div>

      {/* Main Grid: Filter Sidebar on Left + Search Results on Right (Matching Screen 3) */}
      <div className="search-grid">
        
        {/* Left Filter Sidebar */}
        <div className="pv-card" style={{ padding: '1.25rem', height: 'fit-content' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Filters</h3>
            <button onClick={handleClearFilters} style={{ background: 'none', border: 'none', color: 'var(--accent-purple)', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}>
              Clear All
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>University</label>
              <select className="form-select" value={university} onChange={e => setUniversity(e.target.value)}>
                <option value="SPPU">SPPU</option>
                <option value="COEP">COEP University</option>
                <option value="VIT">VIT Pune</option>
                <option value="SRM">SRM Institute</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>College</label>
              <select className="form-select" value={college} onChange={e => setCollege(e.target.value)}>
                <option value="Pune Engineering College">Pune Engineering College</option>
                <option value="COEP Engineering College">COEP Engineering College</option>
                <option value="VIT College">VIT College</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>Branch</label>
              <select className="form-select" value={branch} onChange={e => setBranch(e.target.value)}>
                <option value="Computer Engineering">Computer Engineering</option>
                <option value="Information Technology">Information Technology</option>
                <option value="ENTC Engineering">ENTC Engineering</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>Semester</label>
              <select className="form-select" value={semester} onChange={e => setSemester(e.target.value)}>
                <option value="3">Semester 3</option>
                <option value="4">Semester 4</option>
                <option value="5">Semester 5</option>
                <option value="6">Semester 6</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>Subject</label>
              <select className="form-select" value={subject} onChange={e => setSubject(e.target.value)}>
                <option value="Data Structures">Data Structures</option>
                <option value="Operating System">Operating System</option>
                <option value="DBMS">DBMS</option>
                <option value="Computer Networks">Computer Networks</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>Exam Type</label>
              <select className="form-select" value={examType} onChange={e => setExamType(e.target.value)}>
                <option value="End Semester">End Semester</option>
                <option value="Mid Semester">Mid Semester</option>
                <option value="In Semester">In Semester</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>Year</label>
              <select className="form-select" value={year} onChange={e => setYear(e.target.value)}>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
                <option value="2021">2021</option>
              </select>
            </div>

            <button className="btn-primary" onClick={handleApplyFilters} style={{ width: '100%', marginTop: '0.5rem', padding: '0.6rem' }}>
              Apply Filters
            </button>
          </div>
        </div>

        {/* Right Search Results */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* Results Bar Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              120 results found
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <span>Sort by:</span>
              <span style={{ fontWeight: 700, color: 'var(--text-primary)', cursor: 'pointer' }}>Most Relevant &#9660;</span>
            </div>
          </div>

          {/* Results List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {papers.map((paper) => {
              const isBookmarked = bookmarkedIds.includes(paper._id);
              return (
                <div
                  key={paper._id}
                  className="pv-card paper-result-card"
                  style={{
                    padding: '1rem 1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(239, 68, 68, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <FileText size={22} color="#ef4444" />
                    </div>
                    <div>
                      <h4 
                        onClick={() => navigate(`/paper/${paper._id}`)}
                        style={{ fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer', color: 'var(--text-primary)' }}
                      >
                        {paper.title}
                      </h4>
                      <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem', flexWrap: 'wrap' }}>
                        <span>{paper.university || 'SPPU'} &bull; {paper.college || 'Pune Engineering College'}</span>
                        <span>PDF &bull; {paper.fileSize || '2.4 MB'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="paper-result-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <button
                      onClick={() => navigate(`/paper/${paper._id}`)}
                      title="Preview PDF"
                      style={{
                        padding: '0.45rem',
                        borderRadius: '8px',
                        border: '1px solid var(--border-color)',
                        backgroundColor: 'var(--bg-tertiary)',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer'
                      }}
                    >
                      <Eye size={17} />
                    </button>
                    
                    <button
                      onClick={() => toggleBookmark(paper._id)}
                      title="Bookmark"
                      style={{
                        padding: '0.45rem',
                        borderRadius: '8px',
                        border: '1px solid var(--border-color)',
                        backgroundColor: isBookmarked ? 'var(--accent-light-purple)' : 'var(--bg-tertiary)',
                        color: isBookmarked ? 'var(--accent-purple)' : 'var(--text-secondary)',
                        cursor: 'pointer'
                      }}
                    >
                      <Bookmark size={17} fill={isBookmarked ? 'var(--accent-purple)' : 'none'} />
                    </button>

                    <button
                      onClick={() => toast.success(`Downloading ${paper.title}...`)}
                      title="Download PDF"
                      style={{
                        padding: '0.45rem',
                        borderRadius: '8px',
                        border: '1px solid var(--border-color)',
                        backgroundColor: 'var(--bg-tertiary)',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer'
                      }}
                    >
                      <Download size={17} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>

    </div>
  );
};

export default SmartSearch;
