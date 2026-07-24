import React from 'react';
import { Trophy, Award, Star, MessageSquare, ThumbsUp, Users, Sparkles } from 'lucide-react';

const Community = () => {
  const topContributors = [
    { rank: 1, name: 'Dr. A. K. Sharma', role: 'Faculty', uploads: 142, points: '4,850 XP', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250' },
    { rank: 2, name: 'Satish Rathod', role: 'Student', uploads: 89, points: '3,200 XP', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=250' },
    { rank: 3, name: 'Priya Verma', role: 'Student', uploads: 64, points: '2,450 XP', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250' },
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Academic Community & Leaderboard</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Connect, collaborate, upload papers, and earn academic achievements</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.5rem' }} className="grid-2">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="pv-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1rem' }}>Community Discussions</h3>
            <div style={{ padding: '1rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>SPPU 2024 End Sem Data Structures Paper Discussion</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>2 hours ago</span>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                Q3(b) regarding Linked List implementation of Stack had a tricky edge case. Here is the step-by-step solution breakdown...
              </p>
            </div>
          </div>
        </div>

        <div className="pv-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', color: 'var(--accent-purple)' }}>
            <Trophy size={20} />
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Top Contributors</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {topContributors.map((c) => (
              <div key={c.rank} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.65rem', borderRadius: '10px', backgroundColor: 'var(--bg-tertiary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--accent-purple)', width: '18px' }}>#{c.rank}</span>
                  <img src={c.avatar} alt={c.name} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                  <div>
                    <h5 style={{ fontSize: '0.85rem', fontWeight: 700 }}>{c.name}</h5>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{c.uploads} Uploads</span>
                  </div>
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-green)' }}>{c.points}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
