import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { 
  Users, 
  FileText, 
  Building2, 
  AlertTriangle, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  Settings, 
  BarChart3, 
  GraduationCap, 
  Sparkles, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Maximize2, 
  RefreshCw, 
  FileCheck2, 
  Trash2, 
  Edit3, 
  MessageSquare,
  Award,
  Loader2,
  Search,
  Filter
} from 'lucide-react';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('Paper Moderation Queue');
  const [statusFilter, setStatusFilter] = useState('pending');
  const [searchQuery, setSearchQuery] = useState('');

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    needsChanges: 0
  });

  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(false);

  // Selected Upload Modal State
  const [selectedUpload, setSelectedUpload] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [rotationDegree, setRotationDegree] = useState(0);

  // Action Modals State
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('Blurred Content');
  const [adminNotes, setAdminNotes] = useState('');

  const [showChangesModal, setShowChangesModal] = useState(false);
  const [changeNotes, setChangeNotes] = useState('');

  const [isProcessingAction, setIsProcessingAction] = useState(false);

  const tabs = [
    { name: 'Paper Moderation Queue', icon: FileCheck2 },
    { name: 'Users & Roles', icon: Users },
    { name: 'Colleges', icon: Building2 },
    { name: 'Universities', icon: GraduationCap },
    { name: 'Analytics', icon: BarChart3 },
    { name: 'Settings', icon: Settings }
  ];

  useEffect(() => {
    fetchUploadsQueue();
  }, [statusFilter]);

  const fetchUploadsQueue = async () => {
    setLoading(true);
    try {
      const url = `/admin/uploads?status=${statusFilter}&search=${encodeURIComponent(searchQuery)}`;
      const res = await api.get(url);
      if (res.data?.success) {
        setUploads(res.data.uploads || []);
        if (res.data.stats) setStats(res.data.stats);
      }
    } catch (err) {
      console.error('Error fetching admin uploads:', err);
      toast.error('Failed to load uploads moderation queue');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenStudioModal = async (uploadItem) => {
    setSelectedUpload(uploadItem);
    setZoomLevel(100);
    setRotationDegree(0);
    
    // Fetch Audit Logs for this submission
    try {
      const res = await api.get(`/admin/uploads/${uploadItem._id}`);
      if (res.data?.success && res.data.auditLogs) {
        setAuditLogs(res.data.auditLogs);
      }
    } catch (err) {
      console.log('Error fetching audit logs');
    }
  };

  // 1. Approve Action
  const handleApprovePaper = async () => {
    if (!selectedUpload) return;
    setIsProcessingAction(true);
    toast.loading('Approving paper, publishing to repository & awarding +50 XP...');

    try {
      const res = await api.put(`/admin/uploads/${selectedUpload._id}/approve`, {
        adminNotes: 'Verified and approved by Admin'
      });
      const data = res.data;
      toast.dismiss();
      setIsProcessingAction(false);

      if (data.success) {
        toast.success('Paper approved & published! +50 XP awarded to student 🎉');
        setSelectedUpload(null);
        fetchUploadsQueue();
      } else {
        toast.error(data.message || 'Failed to approve upload');
      }
    } catch (err) {
      toast.dismiss();
      setIsProcessingAction(false);
      toast.error('Error executing approval action');
    }
  };

  // 2. Reject Action
  const handleRejectPaper = async (e) => {
    e.preventDefault();
    if (!selectedUpload || !rejectionReason) return;

    setIsProcessingAction(true);
    try {
      const res = await api.put(`/admin/uploads/${selectedUpload._id}/reject`, {
        rejectionReason, adminNotes
      });
      const data = res.data;
      setIsProcessingAction(false);

      if (data.success) {
        toast.success('Upload submission rejected and student notified.');
        setShowRejectModal(false);
        setSelectedUpload(null);
        fetchUploadsQueue();
      } else {
        toast.error(data.message || 'Failed to reject upload');
      }
    } catch (err) {
      setIsProcessingAction(false);
      toast.error('Error executing rejection');
    }
  };

  // 3. Request Changes Action
  const handleRequestChanges = async (e) => {
    e.preventDefault();
    if (!selectedUpload || !changeNotes) return;

    setIsProcessingAction(true);
    try {
      const res = await api.put(`/admin/uploads/${selectedUpload._id}/request-changes`, {
        changeRequestsNotes: changeNotes
      });
      const data = res.data;
      setIsProcessingAction(false);

      if (data.success) {
        toast.success('Change request notes sent to student uploader.');
        setShowChangesModal(false);
        setSelectedUpload(null);
        fetchUploadsQueue();
      } else {
        toast.error(data.message || 'Failed to request changes');
      }
    } catch (err) {
      setIsProcessingAction(false);
      toast.error('Error submitting change request');
    }
  };

  // Delete Action
  const handleDeleteUpload = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this submission?')) return;
    try {
      const res = await api.delete(`/admin/uploads/${id}`);
      const data = res.data;
      if (data.success) {
        toast.success('Upload submission deleted');
        if (selectedUpload?._id === id) setSelectedUpload(null);
        fetchUploadsQueue();
      }
    } catch (err) {
      toast.error('Error deleting upload record');
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '12px',
          backgroundColor: 'var(--accent-purple)',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)'
        }}>
          <ShieldCheck size={22} />
        </div>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)' }}>Admin Studio & Moderation Portal</h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Review uploaded question papers, AI quality analysis, & publish to repository</p>
        </div>
      </div>

      {/* Admin KPI Stat Cards */}
      <div className="grid-4">
        
        <div className="pv-card" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)' }}>Pending Submissions</span>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0.4rem 0 0.2rem 0', color: '#f59e0b' }}>{stats.pending}</h2>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)' }}>Requires Moderation</span>
        </div>

        <div className="pv-card" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)' }}>Approved Papers</span>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0.4rem 0 0.2rem 0', color: '#10b981' }}>{stats.approved}</h2>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#10b981' }}>Publicly Searchable</span>
        </div>

        <div className="pv-card" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)' }}>Rejected Uploads</span>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0.4rem 0 0.2rem 0', color: '#ef4444' }}>{stats.rejected}</h2>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#ef4444' }}>Quality / Spam Filtered</span>
        </div>

        <div className="pv-card" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)' }}>Needs Changes</span>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0.4rem 0 0.2rem 0', color: '#3b82f6' }}>{stats.needsChanges}</h2>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#3b82f6' }}>Student Re-upload Awaited</span>
        </div>

      </div>

      {/* Navigation Tabs Bar */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        backgroundColor: 'var(--bg-secondary)',
        padding: '0.4rem',
        borderRadius: '12px',
        border: '1px solid var(--border-color)',
        overflowX: 'auto'
      }}>
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.name;
          return (
            <button
              key={t.name}
              onClick={() => setActiveTab(t.name)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.5rem 1.1rem',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: isActive ? 'var(--accent-purple)' : 'transparent',
                color: isActive ? '#fff' : 'var(--text-secondary)',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              <Icon size={16} /> {t.name}
            </button>
          );
        })}
      </div>

      {/* Main Moderation Table Grid */}
      <div className="pv-card" style={{ padding: '1.5rem' }}>
        
        {/* Search & Filter Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>Status Filter:</span>
            {['pending', 'all', 'approved', 'rejected', 'needs_changes'].map((statusKey) => (
              <button
                key={statusKey}
                onClick={() => setStatusFilter(statusKey)}
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  textTransform: 'capitalize',
                  cursor: 'pointer',
                  backgroundColor: statusFilter === statusKey ? 'var(--accent-purple)' : 'transparent',
                  color: statusFilter === statusKey ? '#ffffff' : 'var(--text-secondary)'
                }}
              >
                {statusKey.replace('_', ' ')}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Search subject, title, student..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && fetchUploadsQueue()}
                style={{
                  padding: '0.4rem 0.8rem 0.4rem 2rem',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-tertiary)',
                  fontSize: '0.82rem',
                  color: 'var(--text-primary)',
                  width: '240px'
                }}
              />
              <Search size={14} style={{ position: 'absolute', left: '0.6rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
            <button className="btn-secondary" onClick={fetchUploadsQueue} style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}>
              <RefreshCw size={14} /> Refresh
            </button>
          </div>
        </div>

        {/* Submissions Moderation Table */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            <Loader2 className="animate-spin" size={30} style={{ margin: '0 auto 0.5rem auto' }} />
            <p>Loading moderation queue...</p>
          </div>
        ) : uploads.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            <CheckCircle2 size={36} color="var(--accent-green)" style={{ margin: '0 auto 0.5rem auto' }} />
            <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Queue Clear!</h4>
            <p style={{ fontSize: '0.82rem' }}>No uploads found matching filter "{statusFilter}".</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Question Paper & Subject</th>
                  <th>Uploader Student</th>
                  <th>AI Score & Quality</th>
                  <th>Format / Size</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {uploads.map((item) => {
                  const aiScore = item.aiAnalysis?.qualityScore || 85;
                  return (
                    <tr key={item._id}>
                      <td>
                        <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{item.title}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {item.subject} ({item.subjectCode}) • Sem {item.semester} • {item.examType}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>{item.uploaderName}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{item.uploaderEmail}</div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span style={{
                            fontSize: '0.82rem',
                            fontWeight: 800,
                            color: aiScore >= 80 ? '#10b981' : aiScore >= 50 ? '#f59e0b' : '#ef4444'
                          }}>
                            {aiScore}/100
                          </span>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                            ({item.aiAnalysis?.recommendation || 'Review'})
                          </span>
                        </div>
                      </td>
                      <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {item.fileType?.toUpperCase()} • {(item.fileSize / (1024 * 1024)).toFixed(1)} MB
                      </td>
                      <td>
                        <span style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          padding: '0.2rem 0.5rem',
                          borderRadius: '6px',
                          textTransform: 'capitalize',
                          backgroundColor: item.status === 'approved' ? '#dcfce7' : item.status === 'rejected' ? '#fee2e2' : item.status === 'needs_changes' ? '#fef3c7' : '#f3f4f6',
                          color: item.status === 'approved' ? '#166534' : item.status === 'rejected' ? '#991b1b' : item.status === 'needs_changes' ? '#92400e' : '#374151'
                        }}>
                          {item.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <button
                            className="btn-primary"
                            onClick={() => handleOpenStudioModal(item)}
                            style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', borderRadius: '7px', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                          >
                            <Eye size={14} /> Review Studio
                          </button>
                          <button
                            onClick={() => handleDeleteUpload(item._id)}
                            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.2rem' }}
                            title="Delete Upload"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* Built-in Document Viewer & AI Moderation Studio Modal */}
      {selectedUpload && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '1.5rem'
        }}>
          <div className="pv-card" style={{
            width: '100%',
            maxWidth: '1200px',
            height: '90vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            borderRadius: '20px'
          }}>
            
            {/* Studio Header Toolbar */}
            <div style={{
              padding: '1rem 1.5rem',
              borderBottom: '1px solid var(--border-color)',
              display: 'flex',
              justify: 'space-between',
              alignItems: 'center',
              backgroundColor: 'var(--bg-secondary)'
            }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {selectedUpload.title}
                </h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Submitted by {selectedUpload.uploaderName} ({selectedUpload.uploaderEmail}) • {new Date(selectedUpload.createdAt).toLocaleString()}
                </p>
              </div>

              {/* Action Toolbar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <button
                  className="btn-primary"
                  onClick={handleApprovePaper}
                  disabled={isProcessingAction}
                  style={{ backgroundColor: '#10b981', padding: '0.45rem 1rem', fontSize: '0.82rem', borderRadius: '9px', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <CheckCircle2 size={16} /> Approve & Publish (+50 XP)
                </button>

                <button
                  onClick={() => setShowChangesModal(true)}
                  style={{ backgroundColor: '#f59e0b', color: '#fff', border: 'none', padding: '0.45rem 0.9rem', fontSize: '0.82rem', fontWeight: 700, borderRadius: '9px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <MessageSquare size={16} /> Request Changes
                </button>

                <button
                  onClick={() => setShowRejectModal(true)}
                  style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '0.45rem 0.9rem', fontSize: '0.82rem', fontWeight: 700, borderRadius: '9px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <XCircle size={16} /> Reject
                </button>

                <button
                  onClick={() => setSelectedUpload(null)}
                  style={{ background: 'none', border: '1px solid var(--border-color)', color: 'var(--text-muted)', padding: '0.45rem 0.75rem', borderRadius: '9px', cursor: 'pointer', fontSize: '0.82rem' }}
                >
                  Close
                </button>
              </div>
            </div>

            {/* Split Screen Body: Left Document Viewer + Right AI Analysis Report */}
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 380px', overflow: 'hidden' }}>
              
              {/* Left Column: Built-in PDF/Image Document Viewer */}
              <div style={{ display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--border-color)', backgroundColor: '#0f172a' }}>
                
                {/* Viewer Controls */}
                <div style={{
                  padding: '0.6rem 1rem',
                  backgroundColor: '#1e293b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  color: '#94a3b8',
                  fontSize: '0.8rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <button onClick={() => setZoomLevel(prev => Math.max(50, prev - 25))} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><ZoomOut size={18} /></button>
                    <span>{zoomLevel}%</span>
                    <button onClick={() => setZoomLevel(prev => Math.min(200, prev + 25))} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><ZoomIn size={18} /></button>
                    <button onClick={() => setRotationDegree(prev => (prev + 90) % 360)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }} title="Rotate 90 deg"><RotateCw size={18} /></button>
                  </div>

                  <span>Format: {selectedUpload.fileType?.toUpperCase()}</span>
                </div>

                {/* Document Display Window */}
                <div style={{ flex: 1, overflow: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                  {selectedUpload.fileType === 'pdf' ? (
                    <iframe
                      src={`http://localhost:3000${selectedUpload.fileUrl}`}
                      title="PDF Preview"
                      style={{
                        width: `${zoomLevel}%`,
                        height: '100%',
                        border: 'none',
                        transform: `rotate(${rotationDegree}deg)`,
                        transition: 'all 0.2s ease'
                      }}
                    />
                  ) : (
                    <img
                      src={`http://localhost:3000${selectedUpload.fileUrl}`}
                      alt="Paper Document"
                      style={{
                        maxWidth: `${zoomLevel}%`,
                        maxHeight: '100%',
                        objectFit: 'contain',
                        transform: `rotate(${rotationDegree}deg)`,
                        transition: 'all 0.2s ease'
                      }}
                    />
                  )}
                </div>

              </div>

              {/* Right Column: AI Analysis Report & Metadata Inspector */}
              <div style={{ padding: '1.25rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem', backgroundColor: 'var(--bg-secondary)' }}>
                
                {/* AI Quality Gauge Card */}
                <div style={{ padding: '1rem', borderRadius: '14px', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
                    <Sparkles size={18} color="var(--accent-purple)" />
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--accent-purple)' }}>
                      AI Quality Score Report
                    </h4>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Readability & Clarity</span>
                    <span style={{ fontSize: '1.2rem', fontWeight: 900, color: selectedUpload.aiAnalysis?.qualityScore >= 80 ? '#10b981' : '#f59e0b' }}>
                      {selectedUpload.aiAnalysis?.qualityScore || 85} / 100
                    </span>
                  </div>

                  <div style={{ height: '8px', backgroundColor: 'var(--border-color)', borderRadius: '999px', overflow: 'hidden', marginBottom: '0.75rem' }}>
                    <div style={{ width: `${selectedUpload.aiAnalysis?.qualityScore || 85}%`, height: '100%', backgroundColor: selectedUpload.aiAnalysis?.qualityScore >= 80 ? '#10b981' : '#f59e0b' }} />
                  </div>

                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    <strong>AI Recommendation:</strong> {selectedUpload.aiAnalysis?.recommendation || 'Manual Review'}
                  </div>
                </div>

                {/* OCR Text Extracted Preview */}
                <div style={{ padding: '1rem', borderRadius: '14px', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
                  <h5 style={{ fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.4rem' }}>Extracted OCR Content</h5>
                  <pre style={{ fontSize: '0.72rem', color: 'var(--text-muted)', whiteSpace: 'pre-wrap', maxHeight: '120px', overflowY: 'auto', fontFamily: 'monospace' }}>
                    {selectedUpload.aiAnalysis?.ocrExtractedText || 'OCR Content ready'}
                  </pre>
                </div>

                {/* Paper Details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.8rem' }}>
                  <h5 style={{ fontSize: '0.85rem', fontWeight: 700 }}>Paper Details</h5>
                  <div><strong>University:</strong> {selectedUpload.university}</div>
                  <div><strong>College:</strong> {selectedUpload.college}</div>
                  <div><strong>Branch:</strong> {selectedUpload.branch}</div>
                  <div><strong>Subject Code:</strong> {selectedUpload.subjectCode}</div>
                  <div><strong>Academic Year:</strong> {selectedUpload.academicYear}</div>
                </div>

                {/* Audit Logs */}
                {auditLogs.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <h5 style={{ fontSize: '0.85rem', fontWeight: 700 }}>Audit History</h5>
                    {auditLogs.map((log) => (
                      <div key={log._id} style={{ fontSize: '0.72rem', color: 'var(--text-muted)', padding: '0.3rem 0', borderBottom: '1px dashed var(--border-color)' }}>
                        <strong>{log.action}:</strong> {log.actorName} ({new Date(log.createdAt).toLocaleTimeString()})
                      </div>
                    ))}
                  </div>
                )}

              </div>

            </div>

          </div>
        </div>
      )}

      {/* Reject Reason Modal */}
      {showRejectModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 110, padding: '1rem' }}>
          <div className="pv-card" style={{ width: '100%', maxWidth: '440px', padding: '1.5rem', borderRadius: '18px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.4rem', color: '#ef4444' }}>Reject Upload Submission</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Select a clear reason to notify the uploader.</p>

            <form onSubmit={handleRejectPaper} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label className="input-label">Rejection Reason</label>
                <select className="form-select" value={rejectionReason} onChange={e => setRejectionReason(e.target.value)}>
                  <option value="Blurred Content">Blurred Content / Unreadable</option>
                  <option value="Duplicate Upload">Duplicate Upload</option>
                  <option value="Wrong Subject / Metadata">Wrong Subject / Metadata</option>
                  <option value="Missing Pages">Missing Pages</option>
                  <option value="Corrupted PDF / Image">Corrupted PDF / Image</option>
                  <option value="Spam / Inappropriate Content">Spam / Inappropriate Content</option>
                </select>
              </div>

              <div>
                <label className="input-label">Additional Admin Notes (Optional)</label>
                <textarea
                  className="form-input"
                  rows={2}
                  placeholder="Explain why this paper was rejected..."
                  value={adminNotes}
                  onChange={e => setAdminNotes(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowRejectModal(false)}>Cancel</button>
                <button type="submit" style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }} disabled={isProcessingAction}>
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Request Changes Modal */}
      {showChangesModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 110, padding: '1rem' }}>
          <div className="pv-card" style={{ width: '100%', maxWidth: '440px', padding: '1.5rem', borderRadius: '18px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.4rem', color: '#f59e0b' }}>Request File Changes</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Provide notes explaining what the student should fix before re-submitting.</p>

            <form onSubmit={handleRequestChanges} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label className="input-label">Change Instructions for Student</label>
                <textarea
                  className="form-input"
                  rows={3}
                  placeholder="e.g. Please re-scan Page 2 as it is upside down..."
                  value={changeNotes}
                  onChange={e => setChangeNotes(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowChangesModal(false)}>Cancel</button>
                <button type="submit" style={{ backgroundColor: '#f59e0b', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }} disabled={isProcessingAction}>
                  Send Request Notes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
