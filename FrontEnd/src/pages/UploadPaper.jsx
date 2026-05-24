import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Upload, FileText, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const UploadPaper = () => {
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    year: '',
    semester: '',
    department: ''
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== 'application/pdf') {
        toast.error('Only PDF files are allowed');
        setFile(null);
      } else {
        setFile(selectedFile);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please select a PDF file');
      return;
    }

    setLoading(true);

    const token = localStorage.getItem('token');
    
    const data = new FormData();
    data.append('title', formData.title);
    data.append('subject', formData.subject);
    data.append('year', formData.year);
    data.append('semester', formData.semester);
    data.append('department', formData.department);
    data.append('paper', file);

    try {
      await axios.post('http://localhost:3000/api/papers/upload', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      toast.success('Paper uploaded successfully!');
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload paper');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '800px', marginTop: '2rem' }}>
      <div className="glass-panel" style={{ padding: '2.5rem' }}>
        <div className="flex items-center gap-3" style={{ marginBottom: '2rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
          <div style={{ padding: '0.75rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '12px' }}>
            <Upload size={24} color="var(--primary)" />
          </div>
          <div>
            <h2 style={{ margin: 0 }}>Upload New Paper</h2>
            <p style={{ color: 'var(--text-muted)', margin: '0.25rem 0 0 0' }}>Contribute to the academic repository</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="upload-grid">
            <div className="form-group">
              <label className="input-label">Paper Title</label>
              <input type="text" name="title" className="input-field" placeholder="e.g. End Sem Data Structures" value={formData.title} onChange={handleInputChange} required />
            </div>
            
            <div className="form-group">
              <label className="input-label">Subject</label>
              <input type="text" name="subject" className="input-field" placeholder="e.g. Data Structures" value={formData.subject} onChange={handleInputChange} required />
            </div>

            <div className="form-group">
              <label className="input-label">Branch/Department</label>
              <select name="department" className="input-field" value={formData.department} onChange={handleInputChange} required>
                <option value="">Select Branch</option>
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
              <select name="semester" className="input-field" value={formData.semester} onChange={handleInputChange} required>
                <option value="">Select Semester</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="input-label">Year</label>
              <input type="number" name="year" className="input-field" placeholder="e.g. 2024" value={formData.year} onChange={handleInputChange} required min="2000" max="2030" />
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '1.5rem' }}>
            <label className="input-label">PDF File</label>
            <div style={{ 
              border: '2px dashed var(--glass-border)', borderRadius: '12px', padding: '3rem 2rem', 
              textAlign: 'center', background: 'rgba(0,0,0,0.1)', cursor: 'pointer', transition: 'all 0.3s' 
            }} onClick={() => document.getElementById('file-upload').click()}>
              <FileText size={48} color="var(--primary)" style={{ margin: '0 auto 1rem auto', opacity: 0.8 }} />
              {file ? (
                <div style={{ color: 'var(--success)', fontWeight: 500 }}>{file.name}</div>
              ) : (
                <>
                  <div style={{ fontWeight: 500, marginBottom: '0.5rem' }}>Click to select or drag and drop</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>PDF files only (max 5MB)</div>
                </>
              )}
              <input type="file" id="file-upload" accept=".pdf" style={{ display: 'none' }} onChange={handleFileChange} />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
            <button type="button" className="btn-secondary" onClick={() => navigate('/')}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Uploading...' : 'Upload Paper'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadPaper;
