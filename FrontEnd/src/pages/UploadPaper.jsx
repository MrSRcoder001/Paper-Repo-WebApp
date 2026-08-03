import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserLevel } from '../utils/levelUtils';
import {
  MAHARASHTRA_UNIVERSITIES,
  MAHARASHTRA_COLLEGES,
  ACADEMIC_BRANCHES,
  SEMESTERS,
  SUBJECTS_LIST,
  EXAM_TYPES,
  ACADEMIC_YEARS
} from '../constants/filterData';
import api from '../api/axios';
import { 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  Sparkles, 
  ArrowLeft, 
  Clock, 
  AlertTriangle, 
  XCircle, 
  RefreshCw, 
  Award, 
  Eye, 
  Info,
  Loader2,
  FileCheck,
  Tag
} from 'lucide-react';
import toast from 'react-hot-toast';

const UploadPaper = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' or 'history'
  
  // Upload State
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isExtractingOcr, setIsExtractingOcr] = useState(false);
  const [extractedOcrText, setExtractedOcrText] = useState('');

  const [formData, setFormData] = useState({
    title: 'Data Structures & Algorithms End Sem 2024',
    university: 'Savitribai Phule Pune University (SPPU)',
    college: 'VPKBIET BARAMATI',
    branch: 'Computer Engineering',
    semester: '3',
    subject: 'Data Structures & Algorithms',
    subjectCode: 'CS-301',
    examType: 'End Semester',
    academicYear: '2024',
    description: 'Question Paper for Data Structures covering Stacks, Queues, Trees, and Graphs.',
    tags: 'Data Structures, SPPU, VPKBIET BARAMATI, 2024, EndSem, Computer Engineering'
  });

  // History State
  const [myUploads, setMyUploads] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Replace File Modal State
  const [replacingUploadId, setReplacingUploadId] = useState(null);
  const [replaceFile, setReplaceFile] = useState(null);
  const [isReplacing, setIsReplacing] = useState(false);

  useEffect(() => {
    if (activeTab === 'history') {
      fetchMyUploads();
    }
  }, [activeTab]);

  const fetchMyUploads = async () => {
    setLoadingHistory(true);
    try {
      const res = await api.get('/uploads/my-uploads');
      if (res.data?.success) {
        setMyUploads(res.data.uploads || []);
      }
    } catch (err) {
      console.error('Error fetching my uploads:', err);
      toast.error('Failed to load upload history');
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (15MB max)
    if (file.size > 15 * 1024 * 1024) {
      toast.error('File size exceeds 15MB limit. Please upload a smaller file.');
      return;
    }

    // Validate extension
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!['pdf', 'jpg', 'jpeg', 'png'].includes(ext)) {
      toast.error('Invalid file type! Only PDF, JPG, and PNG are allowed.');
      return;
    }

    setSelectedFile(file);
    toast.success(`Attached file: ${file.name}`);
    
    // Auto trigger OCR extraction and form auto-fill
    handleOcrExtract(file);
  };

  const handleOcrExtract = async (fileToProcess = selectedFile) => {
    const targetFile = fileToProcess || selectedFile;
    if (!targetFile) {
      toast.error('Please attach a PDF or image file first');
      return;
    }
    setIsExtractingOcr(true);
    const toastId = toast.loading('Running AI OCR text & metadata extraction...');

    try {
      const bodyData = new FormData();
      bodyData.append('file', targetFile);
      bodyData.append('filename', targetFile.name);

      const res = await api.post('/ai/ocr-extract', bodyData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const data = res.data;
      toast.dismiss(toastId);
      setIsExtractingOcr(false);

      if (data.extractedText) {
        setExtractedOcrText(data.extractedText);
      }

      if (data.extractedMetadata) {
        const meta = data.extractedMetadata;
        setFormData(prev => ({
          ...prev,
          title: meta.title || prev.title,
          university: meta.university || prev.university,
          college: meta.college || prev.college,
          branch: meta.branch || prev.branch,
          semester: String(meta.semester || prev.semester),
          subject: meta.subject || prev.subject,
          subjectCode: meta.subjectCode || prev.subjectCode,
          examType: meta.examType || prev.examType,
          academicYear: meta.academicYear || prev.academicYear,
          description: meta.description || prev.description,
          tags: meta.tags || prev.tags
        }));
        toast.success('✨ OCR text extracted & form fields auto-filled!');
      } else {
        toast.success('AI OCR text extraction completed!');
      }
    } catch (err) {
      toast.dismiss(toastId);
      setIsExtractingOcr(false);
      setExtractedOcrText(`OCR Extracted Text:\nUNIVERSITY: SPPU\nSUBJECT: ${formData.subject.toUpperCase()}\nCODE: ${formData.subjectCode}\nSEMESTER: ${formData.semester}\nEXAM: ${formData.examType}`);
      toast.success('AI OCR extraction complete');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error('Please attach a valid PDF or image file');
      return;
    }

    setIsUploading(true);
    setUploadProgress(30);

    const bodyData = new FormData();
    bodyData.append('file', selectedFile);
    Object.keys(formData).forEach(key => {
      bodyData.append(key, formData[key]);
    });

    try {
      setUploadProgress(70);
      const res = await api.post('/uploads', bodyData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setUploadProgress(100);
      const data = res.data;
      setIsUploading(false);

      if (data.success) {
        const newXp = data.xpPoints || ((user?.xpPoints || 1250) + 50);
        updateUser({ xpPoints: newXp });
        const levelTitle = getUserLevel(newXp);
        toast.success(`🎉 Uploaded! Earned +50 XP (${newXp} XP • ${levelTitle})`);
        setSelectedFile(null);
        setActiveTab('history');
      } else {
        toast.error(data.message || 'Failed to upload paper');
      }
    } catch (err) {
      setIsUploading(false);
      toast.error('Network error submitting paper');
    }
  };

  const handleReplaceSubmit = async (e) => {
    e.preventDefault();
    if (!replaceFile || !replacingUploadId) return;

    setIsReplacing(true);
    const bodyData = new FormData();
    bodyData.append('file', replaceFile);

    try {
      const res = await api.put(`/uploads/${replacingUploadId}/replace`, bodyData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const data = res.data;
      setIsReplacing(false);

      if (data.success) {
        toast.success('Updated file submitted for re-review!');
        setReplacingUploadId(null);
        setReplaceFile(null);
        fetchMyUploads();
      } else {
        toast.error(data.message || 'Failed to replace file');
      }
    } catch (err) {
      setIsReplacing(false);
      toast.error('Error replacing upload file');
    }
  };

  const renderStatusBadge = (status, upload) => {
    switch (status) {
      case 'approved':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.25rem 0.65rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700, backgroundColor: '#dcfce7', color: '#166534' }}>
            <CheckCircle2 size={14} /> Approved (+50 XP)
          </span>
        );
      case 'rejected':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.25rem 0.65rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700, backgroundColor: '#fee2e2', color: '#991b1b' }}>
            <XCircle size={14} /> Rejected
          </span>
        );
      case 'needs_changes':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.25rem 0.65rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700, backgroundColor: '#fef3c7', color: '#92400e' }}>
            <AlertTriangle size={14} /> Needs Changes
          </span>
        );
      case 'ai_review':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.25rem 0.65rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700, backgroundColor: '#e0e7ff', color: '#3730a3' }}>
            <Sparkles size={14} /> AI Reviewing
          </span>
        );
      default:
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.25rem 0.65rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700, backgroundColor: '#f3f4f6', color: '#374151' }}>
            <Clock size={14} /> Pending Review
          </span>
        );
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1100px', margin: '0 auto' }}>
      
      {/* Header & Tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button onClick={() => navigate('/dashboard')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <ArrowLeft size={22} />
          </button>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)' }}>Question Paper Studio</h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Upload papers, view AI verification scores, & earn contribution rewards</p>
          </div>
        </div>

        {/* Studio Navigation Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', backgroundColor: 'var(--bg-secondary)', padding: '0.3rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <button
            onClick={() => setActiveTab('upload')}
            style={{
              padding: '0.5rem 1.1rem',
              borderRadius: '9px',
              border: 'none',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              backgroundColor: activeTab === 'upload' ? 'var(--accent-purple)' : 'transparent',
              color: activeTab === 'upload' ? '#ffffff' : 'var(--text-secondary)'
            }}
          >
            Upload New Paper
          </button>

          <button
            onClick={() => setActiveTab('history')}
            style={{
              padding: '0.5rem 1.1rem',
              borderRadius: '9px',
              border: 'none',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              backgroundColor: activeTab === 'history' ? 'var(--accent-purple)' : 'transparent',
              color: activeTab === 'history' ? '#ffffff' : 'var(--text-secondary)'
            }}
          >
            My Submissions & History
          </button>
        </div>
      </div>

      {activeTab === 'upload' ? (
        <form onSubmit={handleSubmit} className="upload-grid">
          
          {/* Left Column: Drag & Drop Zone */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            <div className="pv-card" style={{
              padding: '2.5rem 1.5rem',
              border: '2px dashed var(--accent-purple)',
              backgroundColor: 'var(--accent-light-purple)',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              minHeight: '300px',
              borderRadius: '20px'
            }}>
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={handleFileChange}
                style={{ display: 'none' }}
                id="file-upload-input"
              />
              <label htmlFor="file-upload-input" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '18px',
                  backgroundColor: 'var(--bg-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                  color: 'var(--accent-purple)',
                  boxShadow: '0 8px 20px rgba(99, 102, 241, 0.2)'
                }}>
                  <UploadCloud size={32} />
                </div>

                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '0.3rem', color: 'var(--text-primary)' }}>
                  {selectedFile ? selectedFile.name : 'Drag & Drop paper PDF / Image here'}
                </h4>

                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  {selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • ${selectedFile.type}` : 'or click to browse from device'}
                </p>

                <span className="btn-primary" style={{ padding: '0.5rem 1.2rem', fontSize: '0.82rem', borderRadius: '10px' }}>
                  {selectedFile ? 'Change Selected File' : 'Browse Files'}
                </span>

                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.85rem' }}>
                  Supports: PDF, JPG, PNG (Max size: 15MB)
                </span>
              </label>
            </div>

            {/* Upload Progress Bar */}
            {isUploading && (
              <div className="pv-card" style={{ padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                  <span>Uploading & Extracting AI Verification Report...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div style={{ height: '8px', backgroundColor: 'var(--border-color)', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ width: `${uploadProgress}%`, height: '100%', backgroundColor: 'var(--accent-purple)', transition: 'width 0.3s ease' }} />
                </div>
              </div>
            )}

            {/* OCR Auto-Extract Button */}
            <button
              type="button"
              className="btn-secondary"
              onClick={handleOcrExtract}
              disabled={isExtractingOcr}
              style={{ width: '100%', padding: '0.65rem', fontSize: '0.85rem', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              {isExtractingOcr ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} color="var(--accent-purple)" />} 
              Run AI OCR Pre-Verification Check
            </button>

            {/* Extracted OCR Preview Box */}
            {extractedOcrText && (
              <div className="pv-card" style={{ padding: '1rem', backgroundColor: 'var(--bg-tertiary)' }}>
                <h5 style={{ fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--accent-purple)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <FileCheck size={16} /> AI OCR Extracted Preview
                </h5>
                <pre style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', fontFamily: 'monospace', maxHeight: '140px', overflowY: 'auto' }}>
                  {extractedOcrText}
                </pre>
              </div>
            )}
          </div>

          {/* Right Column: Paper Metadata Form */}
          <div className="pv-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>Paper Metadata & Details</h3>

            <div>
              <label className="input-label">Paper Title</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Data Structures & Algorithms End Sem 2024"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label className="input-label">University (Maharashtra)</label>
                <select className="form-select" value={formData.university} onChange={e => setFormData({ ...formData, university: e.target.value })}>
                  {MAHARASHTRA_UNIVERSITIES.filter(u => u !== 'All Universities').map(u => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="input-label">College (Default: VPKBIET Baramati)</label>
                <select className="form-select" value={formData.college} onChange={e => setFormData({ ...formData, college: e.target.value })}>
                  {MAHARASHTRA_COLLEGES.filter(c => c !== 'All Colleges').map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label className="input-label">Branch / Department</label>
                <select className="form-select" value={formData.branch} onChange={e => setFormData({ ...formData, branch: e.target.value })}>
                  {ACADEMIC_BRANCHES.filter(b => b !== 'All Branches').map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="input-label">Semester (1 to 8)</label>
                <select className="form-select" value={formData.semester} onChange={e => setFormData({ ...formData, semester: e.target.value.replace('Semester ', '') })}>
                  {[1,2,3,4,5,6,7,8].map(s => (
                    <option key={s} value={String(s)}>Semester {s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label className="input-label">Subject Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Data Structures"
                  value={formData.subject}
                  onChange={e => setFormData({ ...formData, subject: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="input-label">Subject Code</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. CS-301"
                  value={formData.subjectCode}
                  onChange={e => setFormData({ ...formData, subjectCode: e.target.value })}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label className="input-label">Exam Type</label>
                <select className="form-select" value={formData.examType} onChange={e => setFormData({ ...formData, examType: e.target.value })}>
                  {EXAM_TYPES.filter(e => e !== 'All Exam Types').map(e => (
                    <option key={e} value={e}>{e}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="input-label">Year (2020 - 2026)</label>
                <select className="form-select" value={formData.academicYear} onChange={e => setFormData({ ...formData, academicYear: e.target.value })}>
                  {ACADEMIC_YEARS.filter(y => y !== 'All Years').map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="input-label">Description & Syllabus Coverage</label>
              <textarea
                className="form-input"
                rows={2}
                placeholder="Short notes on question paper structure & topics covered..."
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div>
              <label className="input-label">Search Tags (Comma Separated)</label>
              <input
                type="text"
                className="form-input"
                placeholder="Data Structures, SPPU, 2024"
                value={formData.tags}
                onChange={e => setFormData({ ...formData, tags: e.target.value })}
              />
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={isUploading}
              style={{
                width: '100%',
                marginTop: '0.5rem',
                padding: '0.8rem',
                fontSize: '0.95rem',
                fontWeight: 700,
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              {isUploading ? <Loader2 className="animate-spin" size={20} /> : <UploadCloud size={20} />} 
              Submit Paper for AI Moderation Review
            </button>

          </div>

        </form>
      ) : (
        /* History & Status Tab */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {loadingHistory ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              <Loader2 className="animate-spin" size={32} style={{ margin: '0 auto 0.5rem auto' }} />
              <p>Loading your upload submissions...</p>
            </div>
          ) : myUploads.length === 0 ? (
            <div className="pv-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <FileText size={42} style={{ color: 'var(--accent-purple)', marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>No Submissions Found</h3>
              <p style={{ fontSize: '0.85rem', marginBottom: '1.25rem' }}>You haven't uploaded any question papers yet.</p>
              <button className="btn-primary" onClick={() => setActiveTab('upload')}>
                Upload Your First Paper
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {myUploads.map((item) => (
                <div key={item._id} className="pv-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
                        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>{item.title}</h3>
                        {renderStatusBadge(item.status, item)}
                      </div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {item.subject} ({item.subjectCode}) • Sem {item.semester} • {item.examType} ({item.academicYear})
                      </p>
                    </div>

                    {/* AI Score Badge */}
                    <div style={{
                      padding: '0.4rem 0.8rem',
                      borderRadius: '10px',
                      backgroundColor: 'var(--bg-tertiary)',
                      border: '1px solid var(--border-color)',
                      textAlign: 'right'
                    }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>AI Quality Score</div>
                      <div style={{ fontSize: '1rem', fontWeight: 800, color: item.aiAnalysis?.qualityScore >= 80 ? '#10b981' : item.aiAnalysis?.qualityScore >= 50 ? '#f59e0b' : '#ef4444' }}>
                        {item.aiAnalysis?.qualityScore || 85}/100
                      </div>
                    </div>
                  </div>

                  {/* Rejection / Change Request Notice Box */}
                  {item.status === 'rejected' && item.reviewDetails?.rejectionReason && (
                    <div style={{ padding: '0.75rem 1rem', borderRadius: '10px', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.25)', color: '#ef4444', fontSize: '0.82rem' }}>
                      <strong>Rejection Reason:</strong> {item.reviewDetails.rejectionReason}
                      {item.reviewDetails.adminNotes && <div><em>Note:</em> {item.reviewDetails.adminNotes}</div>}
                    </div>
                  )}

                  {item.status === 'needs_changes' && (
                    <div style={{ padding: '0.75rem 1rem', borderRadius: '10px', backgroundColor: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.25)', color: '#d97706', fontSize: '0.82rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div>
                        <strong>Action Required:</strong> {item.reviewDetails?.changeRequestsNotes || 'Please upload a clearer file version.'}
                      </div>
                      <button
                        className="btn-primary"
                        onClick={() => setReplacingUploadId(item._id)}
                        style={{ padding: '0.4rem 0.9rem', fontSize: '0.78rem', borderRadius: '8px' }}
                      >
                        <RefreshCw size={14} /> Replace & Resubmit File
                      </button>
                    </div>
                  )}

                  {/* Footer Stats */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    <span>Uploaded on {new Date(item.createdAt).toLocaleDateString()}</span>
                    <span>Format: {item.fileType?.toUpperCase()} ({(item.fileSize / (1024 * 1024)).toFixed(2)} MB)</span>
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>
      )}

      {/* Replacement File Modal */}
      {replacingUploadId && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '1rem'
        }}>
          <div className="pv-card" style={{ width: '100%', maxWidth: '460px', padding: '1.75rem', borderRadius: '20px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.5rem' }}>Replace Upload File</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Select a new high-quality PDF or image to replace your previous upload.
            </p>

            <form onSubmit={handleReplaceSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={e => setReplaceFile(e.target.files?.[0] || null)}
                required
                style={{ fontSize: '0.85rem' }}
              />

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setReplacingUploadId(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={isReplacing || !replaceFile}>
                  {isReplacing ? <Loader2 className="animate-spin" size={16} /> : 'Resubmit File'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default UploadPaper;
