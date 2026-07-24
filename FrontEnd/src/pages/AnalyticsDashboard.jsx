import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, HelpCircle, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';

const AnalyticsDashboard = () => {
  const [data, setData] = useState({
    totalPapers: '2,45,678',
    papersGrowth: '+12.5% from last month',
    mostRepeatedQuestionsCount: '15,432',
    questionsGrowth: '+8.2% from last month',
    predictedQuestions: '1,245',
    predictedProbability: 'High probability',
    avgPaperDifficulty: '6.4 / 10',
    difficultyRating: 'Moderate',

    questionFrequency: [
      { unit: 'Unit 1', frequency: 210 },
      { unit: 'Unit 2', frequency: 285 },
      { unit: 'Unit 3', frequency: 340 },
      { unit: 'Unit 4', frequency: 260 },
      { unit: 'Unit 5', frequency: 295 },
      { unit: 'Unit 6', frequency: 240 }
    ],

    mostRepeatedQuestionsList: [
      { id: 1, text: '1. Explain Stack and its operations.', count: 'Asked 8 times' },
      { id: 2, text: '2. Write a note on Infix to Postfix conversion.', count: 'Asked 7 times' },
      { id: 3, text: '3. Implement Stack using array.', count: 'Asked 6 times' }
    ]
  });

  useEffect(() => {
    fetch('http://localhost:3000/api/analytics/overview')
      .then(res => res.json())
      .then(resData => {
        if (resData && resData.totalPapers) {
          setData(prev => ({
            ...prev,
            totalPapers: Number(resData.totalPapers).toLocaleString(),
            papersGrowth: resData.papersGrowth || prev.papersGrowth,
            mostRepeatedQuestionsCount: Number(resData.mostRepeatedQuestions || 15432).toLocaleString(),
            questionsGrowth: resData.questionsGrowth || prev.questionsGrowth,
            predictedQuestions: Number(resData.predictedQuestions || 1245).toLocaleString(),
            predictedProbability: resData.predictedProbability || prev.predictedProbability,
            avgPaperDifficulty: `${resData.avgPaperDifficulty || 6.4} / 10`,
            difficultyRating: resData.difficultyRating || prev.difficultyRating,
            questionFrequency: resData.questionFrequency || prev.questionFrequency,
            mostRepeatedQuestionsList: (resData.topRepeatedQuestions && Array.isArray(resData.topRepeatedQuestions))
              ? resData.topRepeatedQuestions.map((q, idx) => ({
                  id: q.id || idx,
                  text: `${idx + 1}. ${q.text}`,
                  count: q.frequencyText || `${q.count} times`
                }))
              : prev.mostRepeatedQuestionsList
          }));
        }
      })
      .catch(err => console.log('Using local analytics dataset'));
  }, []);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Top Header */}
      <div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Analytics</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Comprehensive Question Frequency & Exam Difficulty Insights</p>
      </div>

      {/* 4 Metric Cards (Matching Screen 6) */}
      <div className="grid-4">
        
        {/* Card 1: Total Papers */}
        <div className="pv-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Total Papers</span>
            <FileText size={18} color="var(--accent-purple)" />
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0.5rem 0 0.2rem 0' }}>{data.totalPapers}</h2>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-green)' }}>{data.papersGrowth}</span>
        </div>

        {/* Card 2: Most Repeated Questions */}
        <div className="pv-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Most Repeated Questions</span>
            <HelpCircle size={18} color="var(--accent-blue)" />
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0.5rem 0 0.2rem 0' }}>{data.mostRepeatedQuestionsCount}</h2>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-green)' }}>{data.questionsGrowth}</span>
        </div>

        {/* Card 3: Predicted Questions */}
        <div className="pv-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Predicted Questions</span>
            <TrendingUp size={18} color="var(--accent-amber)" />
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0.5rem 0 0.2rem 0' }}>{data.predictedQuestions}</h2>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-purple)' }}>{data.predictedProbability}</span>
        </div>

        {/* Card 4: Avg Paper Difficulty */}
        <div className="pv-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Avg. Paper Difficulty</span>
            <AlertCircle size={18} color="var(--accent-pink)" />
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0.5rem 0 0.2rem 0' }}>{data.avgPaperDifficulty}</h2>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>{data.difficultyRating}</span>
        </div>

      </div>

      {/* Row 2: Bar Chart + Donut Chart (Matching Screen 6) */}
      <div className="grid-2">
        
        {/* Question Frequency Bar Chart */}
        <div className="pv-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.5rem' }}>
            Question Frequency (Last 10 Years)
          </h3>

          {/* SVG Custom High-Performance Bar Chart */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '200px', padding: '0 1rem', borderBottom: '1px solid var(--border-color)' }}>
            {(data.questionFrequency || []).map((item) => {
              const barPx = Math.max(20, Math.round((item.frequency / 360) * 160));
              return (
                <div key={item.unit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', width: '45px' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--accent-purple)' }}>{item.frequency}</span>
                  <div style={{
                    width: '100%',
                    height: `${barPx}px`,
                    backgroundColor: 'var(--accent-purple)',
                    borderRadius: '8px 8px 0 0',
                    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
                  }} />
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>{item.unit}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Difficulty Distribution Donut Chart */}
        <div className="pv-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, width: '100%', textAlign: 'left', marginBottom: '1rem' }}>
            Difficulty Distribution
          </h3>

          {/* SVG Donut Chart */}
          <div style={{ position: 'relative', width: '150px', height: '150px' }}>
            <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
              <circle cx="18" cy="18" r="15.9" fill="transparent" stroke="#10b981" strokeWidth="4" strokeDasharray="28 72" strokeDashoffset="0" />
              <circle cx="18" cy="18" r="15.9" fill="transparent" stroke="#6366f1" strokeWidth="4" strokeDasharray="46 54" strokeDashoffset="-28" />
              <circle cx="18" cy="18" r="15.9" fill="transparent" stroke="#ef4444" strokeWidth="4" strokeDasharray="26 74" strokeDashoffset="-74" />
            </svg>
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.1rem'
            }}>
              100%
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.78rem', fontWeight: 600, marginTop: '1rem' }}>
            <span style={{ color: '#10b981' }}>Easy (28%)</span>
            <span style={{ color: '#6366f1' }}>Medium (46%)</span>
            <span style={{ color: '#ef4444' }}>Hard (26%)</span>
          </div>
        </div>

      </div>

      {/* Row 3: Most Repeated Questions + Subject Wise Trend Line Chart */}
      <div className="grid-2">
        
        {/* Most Repeated Questions */}
        <div className="pv-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Most Repeated Questions</h3>
            <span style={{ color: 'var(--accent-purple)', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}>View All</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {(data.mostRepeatedQuestionsList || []).map((q) => (
              <div key={q.id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.75rem',
                borderRadius: '10px',
                backgroundColor: 'var(--bg-tertiary)',
                border: '1px solid var(--border-color)'
              }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{q.text}</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-purple)', padding: '0.2rem 0.6rem', borderRadius: '12px', backgroundColor: 'var(--accent-light-purple)', flexShrink: 0 }}>
                  {q.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Subject Wise Trend Line Chart */}
        <div className="pv-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Subject Wise Trend</h3>
          
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '160px', padding: '0 1rem', borderBottom: '1px solid var(--border-color)' }}>
            {['2020', '2021', '2022', '2023', '2024'].map((yr, i) => (
              <div key={yr} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
                <div style={{ display: 'flex', gap: '4px', alignItems: 'flex-end', height: '120px' }}>
                  <div style={{ width: '8px', height: `${(i + 1) * 18}%`, backgroundColor: '#6366f1', borderRadius: '4px' }} />
                  <div style={{ width: '8px', height: `${(i + 1) * 15}%`, backgroundColor: '#3b82f6', borderRadius: '4px' }} />
                  <div style={{ width: '8px', height: `${(i + 1) * 20}%`, backgroundColor: '#10b981', borderRadius: '4px' }} />
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{yr}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', fontSize: '0.78rem', fontWeight: 600, marginTop: '0.75rem' }}>
            <span style={{ color: '#6366f1' }}>● DS</span>
            <span style={{ color: '#3b82f6' }}>● OS</span>
            <span style={{ color: '#10b981' }}>● DBMS</span>
          </div>
        </div>

      </div>

    </div>
  );
};

export default AnalyticsDashboard;
