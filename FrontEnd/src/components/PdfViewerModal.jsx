import React from 'react';
import { X, Download } from 'lucide-react';

const PdfViewerModal = ({ paper, onClose }) => {
  if (!paper) return null;

  const pdfUrl = `http://localhost:3000/${paper.filePath.replace('\\', '/')}`;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(4px)',
      zIndex: 100,
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      padding: '2rem'
    }}>
      <div className="glass-panel" style={{
        width: '100%', maxWidth: '900px', height: '100%',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: '1rem 1.5rem', borderBottom: '1px solid var(--glass-border)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <h3 style={{ margin: 0 }}>{paper.title}</h3>
          <div className="flex gap-2">
            <a href={pdfUrl} download className="btn-secondary" style={{ padding: '0.5rem' }} title="Download">
              <Download size={20} />
            </a>
            <button onClick={onClose} className="btn-secondary" style={{ padding: '0.5rem', color: 'var(--danger)' }}>
              <X size={20} />
            </button>
          </div>
        </div>
        <div style={{ flex: 1, backgroundColor: '#fff' }}>
          <iframe 
            src={pdfUrl} 
            title={paper.title}
            style={{ width: '100%', height: '100%', border: 'none' }}
          />
        </div>
      </div>
    </div>
  );
};

export default PdfViewerModal;
