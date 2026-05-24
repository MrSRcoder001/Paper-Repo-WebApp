import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Heart, FileText, Layers, BookOpen, Calendar, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import PdfViewerModal from '../components/PdfViewerModal';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPaper, setSelectedPaper] = useState(null);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/api/users/favorites', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFavorites(response.data);
    } catch (error) {
      toast.error('Failed to load favorites');
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (e, paperId) => {
    e.stopPropagation();
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/api/users/favorites/${paperId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Removed from favorites');
      fetchFavorites();
    } catch (error) {
      toast.error('Failed to remove favorite');
    }
  };

  return (
    <div className="container" style={{ marginTop: '2rem' }}>
      <div className="flex items-center gap-3 mb-4" style={{ marginBottom: '2rem' }}>
        <Heart size={32} className="text-gradient" />
        <h2 style={{ margin: 0 }}>My Favorites</h2>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
          <div className="loading-spinner">Loading...</div>
        </div>
      ) : favorites.length === 0 ? (
        <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
          <Heart size={48} color="var(--text-muted)" style={{ marginBottom: '1rem', opacity: 0.5 }} />
          <h3>No favorites yet</h3>
          <p style={{ color: 'var(--text-muted)' }}>Bookmark papers to find them quickly later.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {favorites.map(paper => (
            <div key={paper._id} className="glass-panel" style={{ padding: '1.5rem', cursor: 'pointer', position: 'relative' }} onClick={() => setSelectedPaper(paper)}>
              
              <button 
                onClick={(e) => removeFavorite(e, paper._id)}
                style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', cursor: 'pointer' }}
              >
                <Trash2 size={20} color="var(--danger)" />
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

      <PdfViewerModal paper={selectedPaper} onClose={() => setSelectedPaper(null)} />
    </div>
  );
};

export default Favorites;
