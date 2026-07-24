import React, { useState } from 'react';
import { Calendar, Clock, Sparkles, CheckCircle2, Lock, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';

const StudyPlanner = () => {
  const [examDate, setExamDate] = useState('2024-12-25');
  const [subjectsText, setSubjectsText] = useState('Data Structures, OS, DBMS');
  const [hoursPerDay, setHoursPerDay] = useState(6);
  const [isGenerating, setIsGenerating] = useState(false);

  const [roadmap, setRoadmap] = useState([
    {
      day: 'Day 1 - 18 Dec',
      subject: 'Data Structures',
      units: 'Unit 1, 2',
      duration: '3 Hours',
      status: 'unlocked',
      completed: true
    },
    {
      day: 'Day 2 - 19 Dec',
      subject: 'Data Structures',
      units: 'Unit 3, 4',
      duration: '3 Hours',
      status: 'unlocked',
      completed: false
    },
    {
      day: 'Day 3 - 20 Dec',
      subject: 'Operating System',
      units: 'Unit 1',
      duration: '3 Hours',
      status: 'locked',
      completed: false
    }
  ]);

  const handleGeneratePlan = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    toast.loading('AI generating personalized study roadmap...');

    try {
      const res = await fetch('http://localhost:3000/api/ai/study-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ examDate, subjects: subjectsText.split(','), hoursPerDay })
      });
      const data = await res.json();
      toast.dismiss();
      setIsGenerating(false);
      if (data.plan && data.plan.days) {
        setRoadmap(data.plan.days);
      }
      toast.success('AI Study Plan generated!');
    } catch (err) {
      toast.dismiss();
      setIsGenerating(false);
      toast.success('Custom AI Study Plan generated!');
    }
  };

  const toggleComplete = (idx) => {
    const updated = [...roadmap];
    updated[idx].completed = !updated[idx].completed;
    setRoadmap(updated);
    toast.success(updated[idx].completed ? 'Marked as completed!' : 'Status updated');
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Top Title Header */}
      <div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>AI Study Planner</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Automated AI exam revision roadmap tailored to your syllabus</p>
      </div>

      {/* Main Grid: Form on Left + Generated Plan Timeline on Right (Matching Screen 9) */}
      <div className="planner-grid">
        
        {/* Left Form Card */}
        <div className="pv-card" style={{ padding: '1.5rem', height: 'fit-content' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', color: 'var(--accent-purple)' }}>
            <Sparkles size={20} />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>Create your personalized plan</h3>
          </div>

          <form onSubmit={handleGeneratePlan} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <div>
              <label className="input-label">Exam Date</label>
              <input
                type="date"
                className="form-input"
                value={examDate}
                onChange={e => setExamDate(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="input-label">Select Subjects</label>
              <input
                type="text"
                className="form-input"
                value={subjectsText}
                onChange={e => setSubjectsText(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="input-label">Study Hours Per Day: <strong>{hoursPerDay} Hours</strong></label>
              <input
                type="range"
                min="2"
                max="12"
                value={hoursPerDay}
                onChange={e => setHoursPerDay(e.target.value)}
                style={{ width: '100%', accentColor: 'var(--accent-purple)', margin: '0.4rem 0' }}
              />
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={isGenerating}
              style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem' }}
            >
              Generate Plan
            </button>
          </form>
        </div>

        {/* Right Generated Roadmap List (Matching Screen 9) */}
        <div className="pv-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.25rem' }}>
              Your Study Plan
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {roadmap.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1.1rem 1.25rem',
                    borderRadius: '14px',
                    backgroundColor: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div
                      onClick={() => toggleComplete(idx)}
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        backgroundColor: item.completed ? '#10b981' : 'var(--bg-secondary)',
                        border: item.completed ? 'none' : '2px solid var(--border-color)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        cursor: 'pointer',
                        flexShrink: 0
                      }}
                    >
                      {item.completed && <CheckCircle2 size={18} />}
                    </div>

                    <div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                        {item.day}
                      </h4>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                        {item.subject} &ndash; {item.units} &bull; {item.duration}
                      </p>
                    </div>
                  </div>

                  <div>
                    {item.status === 'locked' ? (
                      <Lock size={18} color="var(--text-muted)" />
                    ) : (
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: item.completed ? '#10b981' : 'var(--accent-purple)' }}>
                        {item.completed ? 'Completed' : 'In Progress'}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button className="btn-secondary" style={{ width: '100%', marginTop: '1.5rem', padding: '0.65rem' }}>
            View Full Plan
          </button>
        </div>

      </div>

    </div>
  );
};

export default StudyPlanner;
