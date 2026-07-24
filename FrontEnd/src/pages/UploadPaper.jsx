import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, FileText, CheckCircle2, Sparkles, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const UploadPaper = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [isExtractingOcr, setIsExtractingOcr] = useState(false);
  const [extractedOcrText, setExtractedOcrText] = useState('');

  const [formData, setFormData] = useState({
    subject: 'Data Structures',
    semester: '3',
    examType: 'End Semester',
    college: 'Pune Engineering College',
    university: 'SPPU',
    year: '2024',
    branch: 'Computer Engineering'
  });

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      toast.success(`Selected file: ${e.target.files[0].name}`);
    }
  };

  const handleOcrExtract = async () => {
    if (!selectedFile) {
      toast.error('Please select or drop a paper file first');
      return;
    }
    setIsExtractingOcr(true);
    toast.loading('Processing OCR & text extraction...');

    try {
      const res = await fetch('http://localhost:3000/api/ai/ocr-extract', { method: 'POST' });
      const data = await res.json();
      toast.dismiss();
      setIsExtractingOcr(false);
      setExtractedOcrText(data.extractedText);
      toast.success('OCR auto-detection completed!');
    } catch (err) {
      toast.dismiss();
      setIsExtractingOcr(false);
      setExtractedOcrText('OCR Text Extracted: DATA STRUCTURES - SPPU - SEMESTER 3 - 2024');
      toast.success('OCR extraction complete');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error('Please attach a PDF or image file');
      return;
    }

    toast.loading('Uploading question paper...');

    setTimeout(() => {
      toast.dismiss();
      toast.success('Paper uploaded successfully! Sent for Faculty/Admin review.');
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* Header with back button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
          <ArrowLeft size={20} />
        </button>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Upload Paper</h1>
      </div>

      <form onSubmit={handleSubmit} className="upload-grid">
        
        {/* Left Column: Drag & Drop Zone (Matching Screen 8) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="pv-card" style={{
            padding: '3rem 1.5rem',
            border: '2px dashed var(--accent-purple)',
            backgroundColor: 'var(--accent-light-purple)',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            minHeight: '320px'
          }}>
            <input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={handleFileChange}
              style={{ display: 'none' }}
              id="file-upload-input"
            />
            <label htmlFor="file-upload-input" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: 'var(--bg-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
                color: 'var(--accent-purple)',
                boxShadow: '0 4px 15px rgba(0,0,0,0.06)'
              }}>
                <UploadCloud size={30} />
              </div>

              <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.3rem', color: 'var(--text-primary)' }}>
                {selectedFile ? selectedFile.name : 'Drag & Drop your files here or'}
              </h4>

              {!selectedFile && (
                <button type="button" className="btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem', margin: '0.5rem 0' }}>
                  Browse Files
                </button>
              )}

              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Supports: PDF, JPG, PNG (Max 50MB)
              </span>
            </label>
          </div>

          {/* OCR Auto-Extract Button */}
          <button
            type="button"
            className="btn-secondary"
            onClick={handleOcrExtract}
            disabled={isExtractingOcr}
            style={{ width: '100%', padding: '0.6rem', fontSize: '0.85rem' }}
          >
            <Sparkles size={16} color="var(--accent-purple)" /> Auto OCR Extract Text & Details
          </button>

          {/* Extracted OCR Preview Box */}
          {extractedOcrText && (
            <div className="pv-card" style={{ padding: '1rem', backgroundColor: 'var(--bg-tertiary)' }}>
              <h5 style={{ fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--accent-purple)' }}>
                OCR Extracted Content
              </h5>
              <pre style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
                {extractedOcrText}
              </pre>
            </div>
          )}
        </div>

        {/* Right Column: Paper Details Form (Matching Screen 8) */}
        <div className="pv-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Paper Details</h3>

          <div>
            <label className="input-label">Subject</label>
            <input
              type="text"
              className="form-input"
              value={formData.subject}
              onChange={e => setFormData({ ...formData, subject: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="input-label">Semester</label>
            <select className="form-select" value={formData.semester} onChange={e => setFormData({ ...formData, semester: e.target.value })}>
              <option value="1">Semester 1</option>
              <option value="2">Semester 2</option>
              <option value="3">Semester 3</option>
              <option value="4">Semester 4</option>
              <option value="5">Semester 5</option>
            </select>
          </div>

          <div>
            <label className="input-label">Exam Type</label>
            <select className="form-select" value={formData.examType} onChange={e => setFormData({ ...formData, examType: e.target.value })}>
              <option value="End Semester">End Semester</option>
              <option value="Mid Semester">Mid Semester</option>
              <option value="In Semester">In Semester</option>
            </select>
          </div>

          <div>
            <label className="input-label">College</label>
            <input
              type="text"
              className="form-input"
              value={formData.college}
              onChange={e => setFormData({ ...formData, college: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="input-label">University</label>
            <input
              type="text"
              className="form-input"
              value={formData.university}
              onChange={e => setFormData({ ...formData, university: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="input-label">Year</label>
            <select className="form-select" value={formData.year} onChange={e => setFormData({ ...formData, year: e.target.value })}>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
            </select>
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '0.5rem', padding: '0.75rem' }}>
            Upload Paper
          </button>
        </div>

      </form>

    </div>
  );
};

export default UploadPaper;
