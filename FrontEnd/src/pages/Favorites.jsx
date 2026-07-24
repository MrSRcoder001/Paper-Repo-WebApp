import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, Download, FileText, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

const Favorites = ({ type = 'bookmarks' }) => {
  const navigate = useNavigate();

  const savedPapers = [
    { id: 'paper-101', title: 'Data Structures – End Sem – 2024', university: 'SPPU', college: 'Pune Engineering College', fileSize: '2.4 MB' },
    { id: 'paper-105', title: 'Operating System – End Sem – 2024', university: 'SPPU', college: 'Pune Engineering College', fileSize: '2.5 MB' }
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>
          {type === 'downloads' ? 'My Downloads' : 'My Bookmarks & Favorites'}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          Access your saved previous year question papers offline
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {savedPapers.map((p) => (
          <div key={p.id} className="pv-card" style={{ padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <FileText size={24} color="#6366f1" />
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer' }} onClick={() => navigate(`/paper/${p.id}`)}>
                  {p.title}
                </h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.university} &bull; {p.college} &bull; {p.fileSize}</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn-secondary" onClick={() => navigate(`/paper/${p.id}`)} style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}>
                <Eye size={15} /> Preview
              </button>
              <button className="btn-primary" onClick={() => toast.success('Downloading...')} style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}>
                <Download size={15} /> Download
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Favorites;
