import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  Lock, 
  BookOpen, 
  Award, 
  Download, 
  Flame, 
  Target, 
  Layers, 
  RefreshCw, 
  ChevronDown, 
  ChevronUp, 
  FileText,
  Zap
} from 'lucide-react';
import toast from 'react-hot-toast';
import { ACADEMIC_BRANCHES } from '../constants/filterData';

const StudyPlanner = () => {
  // Helper to format ISO date string dynamically relative to today
  const getTodayISO = () => new Date().toISOString().split('T')[0];
  const getFutureISO = (daysAhead = 14) => {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    return d.toISOString().split('T')[0];
  };

  const [examDate, setExamDate] = useState(getFutureISO(14));
  const [branch, setBranch] = useState('Computer Engineering');
  const [semester, setSemester] = useState('3');
  const [subjectsText, setSubjectsText] = useState('Data Structures & Algorithms, Operating Systems, DBMS');
  const [hoursPerDay, setHoursPerDay] = useState(6);
  const [focusArea, setFocusArea] = useState('High-Weightage PYQs & Numericals');
  const [isGenerating, setIsGenerating] = useState(false);
  const [filterTab, setFilterTab] = useState('all'); // 'all', 'pending', 'completed'
  const [expandedDayIdx, setExpandedDayIdx] = useState(0);

  const [roadmap, setRoadmap] = useState([]);
  const [userXp, setUserXp] = useState(150);

  // Generate initial study roadmap dynamically on component mount
  useEffect(() => {
    generateDefaultRoadmap(getFutureISO(14), subjectsText, hoursPerDay);
  }, []);

  // Compute days remaining until exam
  const computeDaysRemaining = () => {
    const today = new Date();
    const target = new Date(examDate);
    const diff = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  };

  const generateDefaultRoadmap = (targetDateStr, subStr, hrs) => {
    const now = new Date();
    const targetDate = new Date(targetDateStr);
    const diffMs = Math.max(86400000, targetDate.getTime() - now.getTime());
    const totalDays = Math.min(30, Math.max(1, Math.ceil(diffMs / 86400000)));

    const subs = subStr.split(',').map(s => s.trim()).filter(Boolean);
    const activeSubs = subs.length > 0 ? subs : ['Data Structures & Algorithms', 'Operating Systems', 'DBMS'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const defaultTopics = [
      ['Array & Linked List Memory Representations', 'Single & Double Linked List operations', 'PYQ 7-Mark Problems'],
      ['Stack LIFO Operations & Push/Pop', 'Infix to Postfix Conversion Algorithms', 'Queue FIFO Operations'],
      ['Process Control Block & CPU Scheduling (FCFS, SJF)', 'Semaphores & Inter-Process Communication', 'Deadlock Prevention'],
      ['ER Modeling & Relational Algebra', 'SQL Joins, Views & Subqueries', 'Normalization (1NF, 2NF, 3NF, BCNF)'],
      ['Binary Tree Traversals (Inorder, Preorder, Postorder)', 'BST Insertion & Deletion', 'AVL Tree Rotations'],
      ['High Frequency 10-Year PYQ Revision', 'Formula Blitz & Time Complexity Analysis', 'PaperVault Full Mock Exam']
    ];

    const generatedDays = [];
    for (let i = 0; i < totalDays; i++) {
      const dayDate = new Date(now.getTime() + i * 86400000);
      const dateLabel = `${dayDate.getDate().toString().padStart(2, '0')} ${months[dayDate.getMonth()]}`;
      const subj = activeSubs[i % activeSubs.length];
      const topics = defaultTopics[i % defaultTopics.length];

      const isLast = i === totalDays - 1;
      const isSecondLast = i === totalDays - 2 && totalDays >= 3;

      generatedDays.push({
        day: isLast ? `Day ${i + 1} (${dateLabel}) - Final Mock Exam` : isSecondLast ? `Day ${i + 1} (${dateLabel}) - PYQ Revision Blitz` : `Day ${i + 1} - ${dateLabel}`,
        subject: isLast || isSecondLast ? `${subj} (Revision)` : subj,
        units: isLast ? 'Final Mock Test' : isSecondLast ? 'PYQ Sprint' : `Unit ${(i % 5) + 1}`,
        duration: `${hrs} Hours`,
        status: i <= 2 ? 'unlocked' : 'locked',
        completed: i === 0,
        topics: topics
      });
    }

    setRoadmap(generatedDays);
  };

  const handleGeneratePlan = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    const toastId = toast.loading('AI generating personalized study roadmap...');

    try {
      const res = await fetch('http://localhost:3000/api/ai/study-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          examDate,
          branch,
          semester,
          subjects: subjectsText,
          hoursPerDay,
          focusArea
        })
      });
      const data = await res.json();
      toast.dismiss(toastId);
      setIsGenerating(false);

      if (data.plan && data.plan.days) {
        setRoadmap(data.plan.days);
        toast.success(`AI Study Plan generated for ${data.plan.totalDays} Days! 🚀`);
      } else {
        generateDefaultRoadmap(examDate, subjectsText, hoursPerDay);
        toast.success('Custom AI Study Plan created!');
      }
    } catch (err) {
      toast.dismiss(toastId);
      setIsGenerating(false);
      generateDefaultRoadmap(examDate, subjectsText, hoursPerDay);
      toast.success('Custom AI Study Plan created!');
    }
  };

  const toggleComplete = (idx) => {
    const updated = [...roadmap];
    const isNowCompleted = !updated[idx].completed;
    updated[idx].completed = isNowCompleted;
    setRoadmap(updated);

    if (isNowCompleted) {
      setUserXp(prev => prev + 50);
      toast.success(`Day ${idx + 1} completed! +50 XP Earned 🎉`, {
        icon: '⚡'
      });
    } else {
      setUserXp(prev => Math.max(0, prev - 50));
      toast.error(`Status updated to Pending`);
    }
  };

  const handleExportPlan = () => {
    const summary = `PAPERVAULT AI STUDY PLAN\n` +
      `Branch: ${branch} | Semester: ${semester}\n` +
      `Target Exam Date: ${examDate} (${computeDaysRemaining()} Days Remaining)\n` +
      `Daily Commitment: ${hoursPerDay} Hours/Day\n\n` +
      roadmap.map((item, idx) => `[${item.completed ? 'COMPLETED' : 'PENDING'}] ${item.day}\nSubject: ${item.subject} (${item.units})\nDuration: ${item.duration}\nTopics:\n  - ${item.topics.join('\n  - ')}\n`).join('\n---\n\n');

    const element = document.createElement("a");
    const file = new Blob([summary], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `Study_Plan_${branch}_Sem${semester}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('Study Plan downloaded successfully!');
  };

  // Compute progress metrics
  const completedCount = roadmap.filter(r => r.completed).length;
  const totalDaysCount = roadmap.length || 1;
  const progressPercent = Math.round((completedCount / totalDaysCount) * 100);

  const filteredRoadmap = roadmap.filter(item => {
    if (filterTab === 'completed') return item.completed;
    if (filterTab === 'pending') return !item.completed;
    return true;
  });

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
      
      {/* Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
            <div style={{ padding: '0.4rem', borderRadius: '10px', backgroundColor: 'var(--accent-light-purple)', color: 'var(--accent-purple)', flexShrink: 0 }}>
              <Zap size={22} />
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>AI Study Planner & Exam Roadmap</h1>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Automated syllabus revision roadmap with date tracking, PYQ focus, and XP rewards.
          </p>
        </div>

        {/* Top XP & Days Stat Chips */}
        <div className="planner-stats-container">
          <div className="pv-card" style={{ padding: '0.5rem 0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Flame size={18} color="#ef4444" />
            <div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600 }}>Countdown</div>
              <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-primary)' }}>{computeDaysRemaining()} Days to Exam</div>
            </div>
          </div>

          <div className="pv-card" style={{ padding: '0.5rem 0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Award size={18} color="#f59e0b" />
            <div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600 }}>Level XP</div>
              <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#f59e0b' }}>{userXp} XP</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Input Setup Form on Left + Responsive Study Schedule on Right */}
      <div className="planner-grid">
        
        {/* Left Setup Form Card */}
        <div className="pv-card" style={{ padding: '1.25rem', height: 'fit-content' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', marginBottom: '1.15rem', color: 'var(--accent-purple)' }}>
            <Sparkles size={20} />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>Configure Revision Plan</h3>
          </div>

          <form onSubmit={handleGeneratePlan} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            {/* Target Exam Date */}
            <div>
              <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Calendar size={14} color="var(--accent-purple)" />
                Target Exam Date
              </label>
              <input
                type="date"
                className="form-input"
                min={getTodayISO()}
                value={examDate}
                onChange={e => setExamDate(e.target.value)}
                required
              />
            </div>

            {/* Branch & Semester */}
            <div className="planner-form-row">
              <div>
                <label className="input-label">Branch</label>
                <select className="form-select" value={branch} onChange={e => setBranch(e.target.value)}>
                  {ACADEMIC_BRANCHES.filter(b => b !== 'All Branches').map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="input-label">Semester</label>
                <select className="form-select" value={semester} onChange={e => setSemester(e.target.value)}>
                  {[1,2,3,4,5,6,7,8].map(s => (
                    <option key={s} value={String(s)}>Semester {s}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Subjects Input */}
            <div>
              <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <BookOpen size={14} color="var(--accent-purple)" />
                Subjects (Comma Separated)
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Data Structures, OS, DBMS, Networks"
                value={subjectsText}
                onChange={e => setSubjectsText(e.target.value)}
                required
              />
            </div>

            {/* Focus Strategy */}
            <div>
              <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Target size={14} color="var(--accent-purple)" />
                Revision Goal / Strategy
              </label>
              <select className="form-select" value={focusArea} onChange={e => setFocusArea(e.target.value)}>
                <option value="High-Weightage PYQs & Numericals">🎯 High-Weightage PYQs & Numericals</option>
                <option value="Comprehensive Syllabus Coverage">📚 Comprehensive Syllabus Coverage</option>
                <option value="7-Day Exam Sprint">⚡ 7-Day Exam Sprint</option>
              </select>
            </div>

            {/* Daily Hours Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <label className="input-label" style={{ marginBottom: 0 }}>Daily Study Hours</label>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent-purple)' }}>{hoursPerDay} Hours / Day</span>
              </div>
              <input
                type="range"
                min="2"
                max="12"
                value={hoursPerDay}
                onChange={e => setHoursPerDay(e.target.value)}
                style={{ width: '100%', accentColor: 'var(--accent-purple)' }}
              />
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={isGenerating}
              style={{ width: '100%', padding: '0.7rem', marginTop: '0.3rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              {isGenerating ? <RefreshCw size={17} className="animate-spin" /> : <Sparkles size={17} />}
              Generate AI Study Plan
            </button>
          </form>
        </div>

        {/* Right Study Roadmap Timeline */}
        <div className="pv-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          
          {/* Roadmap Header & Progress Bar */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.85rem' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Your Personalized Study Plan
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                  {branch} &bull; Semester {semester} &bull; {roadmap.length} Days Total
                </p>
              </div>

              <button 
                onClick={handleExportPlan} 
                className="btn-secondary" 
                style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <Download size={15} />
                Export Plan
              </button>
            </div>

            {/* Progress Bar Container */}
            <div style={{ backgroundColor: 'var(--bg-tertiary)', padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.4rem', flexWrap: 'wrap', gap: '0.25rem' }}>
                <span>Overall Completion</span>
                <span style={{ color: 'var(--accent-purple)' }}>{completedCount} of {totalDaysCount} Days ({progressPercent}%)</span>
              </div>
              <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-secondary)', borderRadius: '10px', overflow: 'hidden' }}>
                <div 
                  style={{ 
                    width: `${progressPercent}%`, 
                    height: '100%', 
                    backgroundColor: 'var(--accent-purple)', 
                    borderRadius: '10px', 
                    transition: 'width 0.4s ease' 
                  }} 
                />
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="planner-filter-tabs">
              {['all', 'pending', 'completed'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setFilterTab(tab)}
                  style={{
                    padding: '0.35rem 0.85rem',
                    borderRadius: '8px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    textTransform: 'capitalize',
                    border: '1px solid var(--border-color)',
                    backgroundColor: filterTab === tab ? 'var(--accent-purple)' : 'var(--bg-tertiary)',
                    color: filterTab === tab ? '#ffffff' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Daily Schedule List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {filteredRoadmap.map((item, idx) => {
              const isExpanded = expandedDayIdx === idx;
              return (
                <div
                  key={idx}
                  className={`planner-day-card ${item.completed ? 'completed' : ''}`}
                >
                  {/* Responsive Day Card Header */}
                  <div className="planner-day-header" onClick={() => setExpandedDayIdx(isExpanded ? null : idx)}>
                    
                    {/* Row 1: Checkbox + Title + Status Badge + Expand Chevron */}
                    <div className="planner-day-main-row">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: 0 }}>
                        <div
                          onClick={(e) => { e.stopPropagation(); toggleComplete(idx); }}
                          title={item.completed ? 'Mark Pending' : 'Mark Completed (+50 XP)'}
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            backgroundColor: item.completed ? '#10b981' : 'var(--bg-secondary)',
                            border: item.completed ? 'none' : '2px solid var(--border-color)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff',
                            cursor: 'pointer',
                            flexShrink: 0,
                            touchAction: 'manipulation'
                          }}
                        >
                          {item.completed && <CheckCircle2 size={19} />}
                        </div>

                        <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-primary)', textDecoration: item.completed ? 'line-through' : 'none', wordBreak: 'break-word', margin: 0 }}>
                          {item.day}
                        </h4>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                        {item.completed ? (
                          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.12)', padding: '0.2rem 0.5rem', borderRadius: '6px', whiteSpace: 'nowrap' }}>
                            +50 XP Done
                          </span>
                        ) : (
                          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                            Pending
                          </span>
                        )}

                        <div style={{ color: 'var(--text-muted)', padding: '0.2rem' }}>
                          {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </div>
                      </div>
                    </div>

                    {/* Row 2: Subject, Unit & Duration Micro Badges */}
                    <div className="planner-day-meta-row">
                      <span className="badge badge-purple" style={{ fontSize: '0.72rem' }}>
                        {item.subject}
                      </span>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '6px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                        {item.units}
                      </span>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '6px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Clock size={11} /> {item.duration}
                      </span>
                    </div>

                  </div>

                  {/* Responsive Micro-Topics Drawer */}
                  {isExpanded && item.topics && (
                    <div className="planner-topics-drawer">
                      <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <FileText size={14} color="var(--accent-purple)" />
                        Daily Study Topics & Revision Focus:
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        {item.topics.map((tp, tIdx) => (
                          <div key={tIdx} className="planner-topic-item">
                            <CheckCircle2 size={14} color="var(--accent-purple)" style={{ marginTop: '0.15rem', flexShrink: 0 }} />
                            <span>{tp}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              );
            })}
          </div>

        </div>

      </div>

    </div>
  );
};

export default StudyPlanner;
