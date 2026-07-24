import React, { useState, useEffect } from 'react';
import { Users, FileText, Building2, AlertTriangle, ShieldCheck, CheckCircle2, XCircle, Eye, Settings, BarChart3, GraduationCap } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [stats, setStats] = useState({
    totalUsers: '125,430',
    totalPapers: '2,45,678',
    totalColleges: '1,245',
    reportsCount: '432'
  });

  const [uploads, setUploads] = useState([
    {
      id: 'p1',
      title: 'Data Structures – End Sem – 2024',
      college: 'VIT College',
      university: 'SPPU',
      timeAgo: '18 mins ago',
      status: 'Approved'
    },
    {
      id: 'p2',
      title: 'Operating System – Mid Sem – 2024',
      college: 'VIT College',
      university: 'SPPU',
      timeAgo: '25 mins ago',
      status: 'Pending'
    },
    {
      id: 'p3',
      title: 'DBMS – End Sem – 2024',
      college: 'COEP Pune',
      university: 'SPPU',
      timeAgo: '1 hour ago',
      status: 'Pending'
    }
  ]);

  useEffect(() => {
    fetch('http://localhost:3000/api/admin/pending-uploads')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setUploads(data);
      })
      .catch(err => console.log('Admin mock active'));
  }, []);

  const tabs = [
    { name: 'Dashboard', icon: ShieldCheck },
    { name: 'Users', icon: Users },
    { name: 'Colleges', icon: Building2 },
    { name: 'Universities', icon: GraduationCap },
    { name: 'Subjects', icon: FileText },
    { name: 'Reports', icon: AlertTriangle },
    { name: 'Analytics', icon: BarChart3 },
    { name: 'Settings', icon: Settings }
  ];

  const handleApprove = (id) => {
    setUploads(uploads.map(u => u.id === id ? { ...u, status: 'Approved' } : u));
    toast.success('Paper approved and published!');
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '10px',
          backgroundColor: 'var(--accent-purple)',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <ShieldCheck size={20} />
        </div>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Admin Dashboard</h1>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Enterprise Platform Governance & Review Portal</p>
        </div>
      </div>

      {/* Admin KPI Stat Cards (Matching Screen 10) */}
      <div className="grid-4">
        
        <div className="pv-card" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)' }}>Total Users</span>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0.4rem 0 0.2rem 0' }}>{stats.totalUsers}</h2>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent-green)' }}>+12.5%</span>
        </div>

        <div className="pv-card" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)' }}>Total Papers</span>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0.4rem 0 0.2rem 0' }}>{stats.totalPapers}</h2>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent-green)' }}>+8.4%</span>
        </div>

        <div className="pv-card" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)' }}>Total Colleges</span>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0.4rem 0 0.2rem 0' }}>{stats.totalColleges}</h2>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent-purple)' }}>+6.2%</span>
        </div>

        <div className="pv-card" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)' }}>Reports</span>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0.4rem 0 0.2rem 0' }}>{stats.reportsCount}</h2>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#ef4444' }}>+3.1%</span>
        </div>

      </div>

      {/* Tabs Navigation Bar (Matching Screen 10) */}
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
                padding: '0.5rem 1rem',
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

      {/* Main Grid: Recent Uploads Table + Quick Actions */}
      <div className="admin-grid">
        
        {/* Recent Uploads Table Card */}
        <div className="pv-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1rem' }}>Recent Uploads</h3>

          <div style={{ overflowX: 'auto' }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Paper Title</th>
                  <th>College / University</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {uploads.map((item) => (
                  <tr key={item.id}>
                    <td style={{ fontWeight: 700 }}>{item.title}</td>
                    <td>{item.college} &bull; {item.university}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{item.timeAgo}</td>
                    <td>
                      <span className={item.status === 'Approved' ? 'badge badge-green' : 'badge badge-amber'}>
                        {item.status}
                      </span>
                    </td>
                    <td>
                      {item.status === 'Pending' ? (
                        <button
                          onClick={() => handleApprove(item.id)}
                          style={{
                            padding: '0.3rem 0.65rem',
                            borderRadius: '6px',
                            backgroundColor: 'var(--accent-purple)',
                            color: '#fff',
                            border: 'none',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          Approve
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Completed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions Panel (Matching Screen 10) */}
        <div className="pv-card" style={{ padding: '1.25rem', height: 'fit-content' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Quick Actions</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button className="btn-secondary" style={{ width: '100%', justifyContent: 'flex-start', fontSize: '0.85rem' }}>
              <CheckCircle2 size={16} color="var(--accent-green)" /> Approve Papers
            </button>

            <button className="btn-secondary" style={{ width: '100%', justifyContent: 'flex-start', fontSize: '0.85rem' }}>
              <Users size={16} color="var(--accent-blue)" /> Manage Users
            </button>

            <button className="btn-secondary" style={{ width: '100%', justifyContent: 'flex-start', fontSize: '0.85rem' }}>
              <Building2 size={16} color="var(--accent-purple)" /> Manage Colleges
            </button>

            <button className="btn-secondary" style={{ width: '100%', justifyContent: 'flex-start', fontSize: '0.85rem' }}>
              <AlertTriangle size={16} color="var(--accent-amber)" /> View Reports
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;
