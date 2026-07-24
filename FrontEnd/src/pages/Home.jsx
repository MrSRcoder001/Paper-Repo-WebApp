import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Filter, FileText, Calendar, BookOpen, Layers, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import PdfViewerModal from '../components/PdfViewerModal';

const Home = () => {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  
  // Filters
  const [branch, setBranch] = useState('');
  const [semester, setSemester] = useState('');
  const [year, setYear] = useState('');

  useEffect(() => {
    fetchPapers();
  }, [branch, semester, year]);

  const fetchPapers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (branch) params.append('branch', branch);
      if (semester) params.append('semester', semester);
      if (year) params.append('year', year);

      const response = await axios.get(`http://localhost:3000/api/papers?${params.toString()}`);
      setPapers(response.data);
    } catch (error) {
      toast.error('Error fetching papers');
    } finally {
      setLoading(false);
    }
  };

  const addToFavorites = async (e, paperId) => {
    e.stopPropagation();
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to save favorites');
      navigate('/login');
      return;
    }
    
    try {
      await axios.post(`http://localhost:3000/api/users/favorites/${paperId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Added to favorites!');
    } catch (error) {
      toast.error('Failed to add favorite');
    }
  };

  const handlePaperClick = (paper) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to view papers');
      navigate('/login');
      return;
    }
    setSelectedPaper(paper);
  };

  const filteredPapers = papers.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Hero Section */}
      <div style={{ textAlign: 'center', padding: '4rem 1rem', marginBottom: '2rem' }}>
        <h1 className="hero-title" style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>
          Discover <span className="text-gradient">Academic Excellence</span>
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
          Access the largest repository of previous year question papers. Prepare smarter, score higher.
        </p>
        
        <div style={{ maxWidth: '600px', margin: '2rem auto 0 auto', position: 'relative' }}>
          <Search size={24} style={{ position: 'absolute', left: '1.5rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }} />
          <input 
            type="text" 
            placeholder="Search papers by title or subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ 
              width: '100%', padding: '1.25rem 1.5rem 1.25rem 4rem', fontSize: '1.1rem',
              background: 'var(--glass-bg)', border: '1px solid var(--glass-border)',
              borderRadius: '999px', color: 'var(--text-color)', outline: 'none',
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
            }}
          />
        </div>
      </div>

      <div className="container home-grid" style={{ marginTop: '2rem' }}>
        {/* Sidebar Filters */}
        <aside>
          <div className="glass-panel" style={{ padding: '1.5rem', position: 'sticky', top: '90px' }}>
            <div className="flex items-center gap-2 mb-4" style={{ marginBottom: '1.5rem' }}>
              <Filter size={20} className="text-gradient" />
              <h3 style={{ margin: 0 }}>Filters</h3>
            </div>
            
            <div className="form-group">
              <label className="input-label">Branch</label>
              <select className="input-field" value={branch} onChange={(e) => setBranch(e.target.value)}>
                <option value="">All Branches</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Information Technology">Information Technology</option>
                <option value="E&TC">E&TC</option>
                <option value="Mechanical">Mechanical</option>
                <option value="Civil">Civil</option>
                <option value="AI & DS">AI & DS</option>
              </select>
            </div>

            <div className="form-group">
              <label className="input-label">Semester</label>
              <select className="input-field" value={semester} onChange={(e) => setSemester(e.target.value)}>
                <option value="">All Semesters</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                  <option key={s} value={s}>Semester {s}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="input-label">Year</label>
              <select className="input-field" value={year} onChange={(e) => setYear(e.target.value)}>
                <option value="">All Years</option>
                {[2024, 2023, 2022, 2021, 2020].map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main>
          <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 className="text-gradient" style={{ margin: 0 }}>Paper Archive</h2>
            <div style={{ color: 'var(--text-muted)' }}>
              Showing {filteredPapers.length} results
            </div>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
              <div className="loading-spinner">Loading...</div>
            </div>
          ) : filteredPapers.length === 0 ? (
            <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
              <FileText size={48} color="var(--text-muted)" style={{ marginBottom: '1rem', opacity: 0.5 }} />
              <h3>No papers found</h3>
              <p style={{ color: 'var(--text-muted)' }}>Try adjusting your search or filters.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {filteredPapers.map(paper => (
                <div key={paper._id} className="glass-panel" style={{ padding: '1.5rem', cursor: 'pointer', position: 'relative' }} onClick={() => handlePaperClick(paper)}>
                  <button 
                    onClick={(e) => addToFavorites(e, paper._id)}
                    style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', cursor: 'pointer', zIndex: 10 }}
                    title="Add to Favorites"
                  >
                    <Heart size={20} color="var(--text-muted)" />
                  </button>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{ 
                      padding: '1rem', background: 'rgba(99, 102, 241, 0.1)', 
                      borderRadius: '12px', color: 'var(--primary)' 
                    }}>
                      <FileText size={24} />
                    </div>
                    <div style={{ paddingRight: '2rem' }}>
                      <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>{paper.title}</h3>
                      <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.875rem' }}>{paper.subject}</p>
                    </div>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '1.5rem' }}>
                    <div className="flex items-center gap-2" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      <Layers size={14} /> {paper.department}
                    </div>
                    <div className="flex items-center gap-2" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      <BookOpen size={14} /> Sem {paper.semester}
                    </div>
                    <div className="flex items-center gap-2" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      <Calendar size={14} /> {paper.year}
                    </div>
                    <div className="flex items-center gap-2" style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>
                      View PDF
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>

        <PdfViewerModal paper={selectedPaper} onClose={() => setSelectedPaper(null)} />
      </div>
    </>
  );
};

export default Home;
