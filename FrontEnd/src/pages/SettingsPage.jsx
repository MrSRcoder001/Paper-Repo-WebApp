import React, { useState } from 'react';
import { User, Bell, Lock, Globe, Shield, Smartphone } from 'lucide-react';
import toast from 'react-hot-toast';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('Profile');
  const [profile, setProfile] = useState({
    name: 'Satish Rathod',
    email: 'satish.rathod@vpkbiet.edu.in',
    college: 'Pune Engineering College',
    university: 'SPPU',
    branch: 'Computer Engineering',
    semester: '3'
  });

  const handleSave = (e) => {
    e.preventDefault();
    toast.success('Profile settings updated successfully!');
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '900px' }}>
      <div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Settings</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Manage your account, preferences, and security options</p>
      </div>

      <div className="pv-card" style={{ padding: '1.5rem' }}>
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Profile Information</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="grid-2">
            <div>
              <label className="input-label">Full Name</label>
              <input type="text" className="form-input" value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} />
            </div>

            <div>
              <label className="input-label">Email Address</label>
              <input type="email" className="form-input" value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })} />
            </div>

            <div>
              <label className="input-label">College</label>
              <input type="text" className="form-input" value={profile.college} onChange={e => setProfile({ ...profile, college: e.target.value })} />
            </div>

            <div>
              <label className="input-label">University</label>
              <input type="text" className="form-input" value={profile.university} onChange={e => setProfile({ ...profile, university: e.target.value })} />
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ width: 'fit-content', padding: '0.6rem 1.5rem' }}>
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default SettingsPage;
