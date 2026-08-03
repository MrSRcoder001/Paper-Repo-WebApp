import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, Filter, Download, Bookmark, Eye, FileText, X, ChevronDown, RefreshCw } from 'lucide-react';
import {
  MAHARASHTRA_UNIVERSITIES,
  MAHARASHTRA_COLLEGES,
  ACADEMIC_BRANCHES,
  SEMESTERS,
  SUBJECTS_LIST,
  EXAM_TYPES,
  ACADEMIC_YEARS
} from '../constants/filterData';
import toast from 'react-hot-toast';

const SmartSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [query, setQuery] = useState(searchParams.get('query') || '');
  const [university, setUniversity] = useState(searchParams.get('university') || 'All Universities');
  const [college, setCollege] = useState(searchParams.get('college') || 'VPKBIET BARAMATI');
  const [branch, setBranch] = useState(searchParams.get('branch') || 'All Branches');
  const [semester, setSemester] = useState(searchParams.get('semester') || 'All Semesters');
  const [subject, setSubject] = useState(searchParams.get('subject') || 'All Subjects');
  const [examType, setExamType] = useState(searchParams.get('examType') || 'All Exam Types');
  const [year, setYear] = useState(searchParams.get('year') || 'All Years');

  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bookmarkedIds, setBookmarkedIds] = useState([]);
  const [sortBy, setSortBy] = useState('relevant'); // 'relevant', 'downloads', 'newest'

  const sortedPapers = [...papers].sort((a, b) => {
    if (sortBy === 'downloads') return (b.downloadsCount || 0) - (a.downloadsCount || 0);
    if (sortBy === 'newest') return (b.year || 2024) - (a.year || 2024);
    return 0;
  });

  // Dynamically compute active filter badges
  const activeTags = [
    university !== 'All Universities' && { label: university, key: 'university', reset: () => setUniversity('All Universities') },
    college !== 'VPKBIET BARAMATI' && { label: college, key: 'college', reset: () => setCollege('VPKBIET BARAMATI') },
    college === 'VPKBIET BARAMATI' && { label: 'VPKBIET BARAMATI', key: 'collegeDefault', reset: null },
    branch !== 'All Branches' && { label: branch, key: 'branch', reset: () => setBranch('All Branches') },
    semester !== 'All Semesters' && { label: semester, key: 'semester', reset: () => setSemester('All Semesters') },
    subject !== 'All Subjects' && { label: subject, key: 'subject', reset: () => setSubject('All Subjects') },
    examType !== 'All Exam Types' && { label: examType, key: 'examType', reset: () => setExamType('All Exam Types') },
    year !== 'All Years' && { label: year, key: 'year', reset: () => setYear('All Years') }
  ].filter(Boolean);

  const fetchPapers = async () => {
    setLoading(true);
    try {
      const paramsObj = {};
      if (query) paramsObj.query = query;
      if (university && university !== 'All Universities') paramsObj.university = university;
      if (college) paramsObj.college = college;
      if (branch && branch !== 'All Branches') paramsObj.branch = branch;
      if (semester && semester !== 'All Semesters') paramsObj.semester = semester;
      if (subject && subject !== 'All Subjects') paramsObj.subject = subject;
      if (examType && examType !== 'All Exam Types') paramsObj.examType = examType;
      if (year && year !== 'All Years') paramsObj.year = year;

      const queryStr = new URLSearchParams(paramsObj).toString();
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
    toast.success('Search filters applied');
  };

  const handleClearFilters = () => {
    setQuery('');
    setUniversity('All Universities');
    setCollege('VPKBIET BARAMATI');
    setBranch('All Branches');
    setSemester('All Semesters');
    setSubject('All Subjects');
    setExamType('All Exam Types');
    setYear('All Years');
    fetchPapers();
    toast.success('Filters reset to default');
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
            placeholder="Search papers by subject, title, university, course code..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && fetchPapers()}
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

      {/* Active Filter Badges Strip */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginRight: '0.2rem' }}>Active Filters:</span>
        {activeTags.map((tag) => (
          <span
            key={tag.key}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.3rem 0.75rem',
              borderRadius: '20px',
              backgroundColor: 'var(--accent-light-purple)',
              border: '1px solid var(--border-color)',
              fontSize: '0.78rem',
              fontWeight: 600,
              color: 'var(--accent-purple)'
            }}
          >
            {tag.label}
            {tag.reset && (
              <X 
                size={13} 
                style={{ cursor: 'pointer' }} 
                onClick={() => {
                  tag.reset();
                  setTimeout(fetchPapers, 50);
                }} 
              />
            )}
          </span>
        ))}
      </div>

      {/* Main Grid: Filter Sidebar on Left + Search Results on Right */}
      <div className="search-grid">
        
        {/* Left Filter Sidebar */}
        <div className="pv-card" style={{ padding: '1.25rem', height: 'fit-content' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>Search Filters</h3>
            <button onClick={handleClearFilters} style={{ background: 'none', border: 'none', color: 'var(--accent-purple)', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <RefreshCw size={13} /> Reset
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* University Dropdown */}
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>University (Maharashtra)</label>
              <select className="form-select" value={university} onChange={e => setUniversity(e.target.value)}>
                {MAHARASHTRA_UNIVERSITIES.map(u => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>

            {/* College Dropdown (Default VPKBIET BARAMATI) */}
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>College (Default: VPKBIET Baramati)</label>
              <select className="form-select" value={college} onChange={e => setCollege(e.target.value)}>
                {MAHARASHTRA_COLLEGES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Branch Dropdown */}
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>Branch / Department</label>
              <select className="form-select" value={branch} onChange={e => setBranch(e.target.value)}>
                {ACADEMIC_BRANCHES.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            {/* Semester Dropdown (8 Semesters) */}
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>Semester (1 to 8)</label>
              <select className="form-select" value={semester} onChange={e => setSemester(e.target.value)}>
                {SEMESTERS.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Subject Dropdown */}
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>Subject</label>
              <select className="form-select" value={subject} onChange={e => setSubject(e.target.value)}>
                {SUBJECTS_LIST.map(sub => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>

            {/* Exam Type Dropdown */}
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>Exam Type</label>
              <select className="form-select" value={examType} onChange={e => setExamType(e.target.value)}>
                {EXAM_TYPES.map(e => (
                  <option key={e} value={e}>{e}</option>
                ))}
              </select>
            </div>

            {/* Year Dropdown (2020 to 2026) */}
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>Year (2020 - 2026)</label>
              <select className="form-select" value={year} onChange={e => setYear(e.target.value)}>
                {ACADEMIC_YEARS.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            <button className="btn-primary" onClick={handleApplyFilters} style={{ width: '100%', marginTop: '0.5rem', padding: '0.65rem' }}>
              Apply Search Filters
            </button>
          </div>
        </div>

        {/* Right Search Results */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* Results Bar Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {loading ? (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                  <RefreshCw size={15} className="animate-spin" color="var(--accent-purple)" />
                  Searching papers...
                </span>
              ) : (
                `${papers.length} paper${papers.length === 1 ? '' : 's'} found`
              )}
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <span>Sort by:</span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                style={{
                  padding: '0.25rem 0.6rem',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  fontWeight: 700,
                  fontSize: '0.78rem',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="relevant">Most Relevant</option>
                <option value="downloads">Most Downloaded</option>
                <option value="newest">Newest Year</option>
              </select>
            </div>
          </div>

          {/* Empty State when 0 papers found */}
          {!loading && sortedPapers.length === 0 && (
            <div className="pv-card" style={{ padding: '3rem 1.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'var(--accent-light-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-purple)' }}>
                <Search size={28} />
              </div>
              <div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '0.35rem' }}>No Question Papers Found</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '420px', margin: '0 auto' }}>
                  No question papers strictly match all your current filter selections. Try broadening your filters or resetting to default.
                </p>
              </div>
              <button className="btn-primary" onClick={handleClearFilters} style={{ padding: '0.55rem 1.25rem', fontSize: '0.82rem', borderRadius: '10px' }}>
                Reset All Filters
              </button>
            </div>
          )}

          {/* Results List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {sortedPapers.map((paper) => {
              const isBookmarked = bookmarkedIds.includes(paper._id);
              return (
                <div
                  key={paper._id || paper.title}
                  className="pv-card paper-result-card"
                  style={{
                    padding: '1rem 1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s ease'
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
                      <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
                        <span style={{ fontWeight: 600, color: 'var(--accent-purple)' }}>{paper.university || 'SPPU'}</span>
                        <span>&bull;</span>
                        <span>{paper.college || 'VPKBIET BARAMATI'}</span>
                        <span>&bull;</span>
                        <span>{paper.department || 'Computer Engineering'} (Sem {paper.semester || 3})</span>
                        <span>&bull;</span>
                        <span style={{ backgroundColor: 'var(--bg-tertiary)', padding: '0.1rem 0.45rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}>{paper.examType || 'End Semester'}</span>
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
