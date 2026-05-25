import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Shield, Trash2, FileText, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const [usersRes, papersRes] = await Promise.all([
        axios.get('http://localhost:3000/api/users/admin/users', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:3000/api/papers')
      ]);
      setUsers(usersRes.data);
      setPapers(papersRes.data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const updateRole = async (userId, newRole) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:3000/api/users/admin/users/${userId}/role`, { role: newRole }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('User role updated');
      fetchData();
    } catch (error) {
      toast.error('Failed to update role');
    }
  };

  const deletePaper = async (paperId) => {
    if (!window.confirm('Are you sure you want to delete this paper?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/api/papers/${paperId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Paper deleted successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete paper');
    }
  };

  return (
    <div className="container" style={{ marginTop: '2rem' }}>
      <div className="flex items-center gap-3 mb-4" style={{ marginBottom: '2rem' }}>
        <Shield size={32} className="text-gradient" />
        <h2 style={{ margin: 0 }}>Admin Dashboard</h2>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
          <div className="loading-spinner">Loading...</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
          
          {/* Users Section */}
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <div className="flex items-center gap-2 mb-4" style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
              <Users size={24} color="var(--primary)" />
              <h3 style={{ margin: 0 }}>User Management</h3>
            </div>
            
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '1rem' }}>Username</th>
                    <th style={{ padding: '1rem' }}>Email</th>
                    <th style={{ padding: '1rem' }}>Role</th>
                    <th style={{ padding: '1rem' }}>Joined</th>
                    <th style={{ padding: '1rem' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '1rem' }}>{u.username}</td>
                      <td style={{ padding: '1rem' }}>{u.email}</td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ 
                          padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600,
                          background: u.role === 'admin' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                          color: u.role === 'admin' ? 'var(--primary)' : 'var(--text-color)'
                        }}>
                          {u.role.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: '1rem' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td style={{ padding: '1rem' }}>
                        <select 
                          className="input-field" 
                          style={{ padding: '0.5rem', width: 'auto' }}
                          value={u.role}
                          onChange={(e) => updateRole(u._id, e.target.value)}
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Papers Section */}
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <div className="flex items-center gap-2 mb-4" style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
              <FileText size={24} color="var(--primary)" />
              <h3 style={{ margin: 0 }}>Paper Management</h3>
            </div>
            
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '1rem' }}>Title</th>
                    <th style={{ padding: '1rem' }}>Subject</th>
                    <th style={{ padding: '1rem' }}>Branch</th>
                    <th style={{ padding: '1rem' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {papers.map(p => (
                    <tr key={p._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '1rem' }}>{p.title}</td>
                      <td style={{ padding: '1rem' }}>{p.subject}</td>
                      <td style={{ padding: '1rem' }}>{p.department}</td>
                      <td style={{ padding: '1rem' }}>
                        <button onClick={() => deletePaper(p._id)} className="btn-secondary" style={{ padding: '0.5rem', color: 'var(--danger)', border: 'none' }}>
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
