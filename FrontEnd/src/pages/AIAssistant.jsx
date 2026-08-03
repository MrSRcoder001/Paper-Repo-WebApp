import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send, Plus, Mic, Sparkles, Volume2, ThumbsUp, Copy, Check, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const AIAssistant = () => {
  const [messages, setMessages] = useState([
    {
      sender: 'user',
      text: 'What is the difference between stack and queue?'
    },
    {
      sender: 'ai',
      text: 'Here is a detailed comparison with comparison table.',
      table: {
        headers: ['Feature', 'Stack', 'Queue'],
        rows: [
          ['Order', 'LIFO (Last In First Out)', 'FIFO (First In First Out)'],
          ['Insertion', 'At Top (Push)', 'At Rear (Enqueue)'],
          ['Deletion', 'At Top (Pop)', 'At Front (Dequeue)'],
          ['Example', 'Function Call Stack', 'Printer Queue']
        ]
      },
      footer: 'Would you like a diagram as well?'
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  const promptChips = [
    'Explain Stack',
    'Applications of Stack',
    'Stack vs Queue',
    'Important Questions'
  ];

  const handleSend = async (queryText) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim()) return;

    const newMsgList = [...messages, { sender: 'user', text: textToSend }];
    setMessages(newMsgList);
    setInputQuery('');
    setIsThinking(true);

    try {
      const res = await fetch('http://localhost:3000/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend })
      });
      const data = await res.json();
      setIsThinking(false);

      setMessages([
        ...newMsgList,
        {
          sender: 'ai',
          text: data.reply || 'AI Assistant analysis completed.',
          table: data.table,
          footer: 'Would you like to generate practice MCQs for this topic?'
        }
      ]);
    } catch (err) {
      setIsThinking(false);
      setMessages([
        ...newMsgList,
        {
          sender: 'ai',
          text: `Here is the AI breakdown for "${textToSend}":\n\nA Stack operates on Last-In-First-Out (LIFO), whereas a Queue operates on First-In-First-Out (FIFO). In SPPU exams, this question carries 5 marks in Unit 3.`
        }
      ]);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    toast.success('Started new AI chat session');
  };

  const handleVoiceToggle = () => {
    setIsListening(!isListening);
    if (!isListening) {
      toast.success('Voice Assistant Listening...');
      setTimeout(() => {
        setInputQuery('Explain Tower of Hanoi recursion step by step');
        setIsListening(false);
      }, 2500);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', height: 'calc(100vh - 110px)' }}>
      
      {/* Top AI Assistant Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'var(--bg-secondary)',
        padding: '0.85rem 1.25rem',
        borderRadius: '14px',
        border: '1px solid var(--border-color)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff'
          }}>
            <Bot size={20} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800 }}>AI Assistant</h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Powered by PaperVault Academic RAG Engine</p>
          </div>
        </div>

        <button className="btn-secondary" onClick={handleNewChat} style={{ padding: '0.45rem 0.9rem', fontSize: '0.8rem' }}>
          <Plus size={15} /> New Chat
        </button>
      </div>

      {/* Main Chat Conversation Container */}
      <div className="pv-card" style={{
        flex: 1,
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        overflow: 'hidden'
      }}>
        
        {/* Messages Stream with Hidden Scrollbars */}
        <div 
          className="no-scrollbar"
          style={{ 
            flex: 1, 
            overflowY: 'auto', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1.25rem', 
            paddingRight: '0.2rem',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          {messages.map((msg, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                justify: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                gap: '0.75rem'
              }}
            >
              {msg.sender === 'ai' && (
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--accent-light-purple)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-purple)',
                  flexShrink: 0
                }}>
                  <Sparkles size={16} />
                </div>
              )}

              <div style={{
                maxWidth: '92%',
                backgroundColor: msg.sender === 'user' ? 'var(--accent-purple)' : 'var(--bg-tertiary)',
                color: msg.sender === 'user' ? '#ffffff' : 'var(--text-primary)',
                padding: '1rem 1.25rem',
                borderRadius: msg.sender === 'user' ? '18px 18px 2px 18px' : '18px 18px 18px 2px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.04)',
                border: msg.sender === 'ai' ? '1px solid var(--border-color)' : 'none'
              }}>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.5, marginBottom: msg.table ? '0.85rem' : 0 }}>
                  {msg.text}
                </p>

                {/* Structured Markdown Table matching Screen 5 */}
                {msg.table && (
                  <div className="no-scrollbar" style={{ margin: '0.75rem 0', overflowX: 'auto', borderRadius: '10px', border: '1px solid var(--border-color)', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    <table className="custom-table">
                      <thead>
                        <tr>
                          {msg.table.headers.map((h, i) => (
                            <th key={i}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {msg.table.rows.map((row, rIdx) => (
                          <tr key={rIdx}>
                            {row.map((cell, cIdx) => (
                              <td key={cIdx} style={{ fontWeight: cIdx === 0 ? 700 : 500 }}>
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {msg.footer && (
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.6rem', fontStyle: 'italic' }}>
                    {msg.footer}
                  </p>
                )}
              </div>
            </div>
          ))}

          {/* AI Thinking Loading State */}
          {isThinking && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'var(--accent-light-purple)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-purple)',
                flexShrink: 0
              }}>
                <Sparkles size={16} className="animate-spin" />
              </div>
              <div style={{
                backgroundColor: 'var(--bg-tertiary)',
                color: 'var(--text-muted)',
                padding: '0.75rem 1.1rem',
                borderRadius: '18px 18px 18px 2px',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <Loader2 size={16} className="animate-spin" color="var(--accent-purple)" />
                <span>AI Assistant is generating answer...</span>
              </div>
            </div>
          )}

          {/* Scroll Anchor */}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips (Matching Screen 5) */}
        <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {promptChips.map((chip) => (
              <button
                key={chip}
                onClick={() => handleSend(chip)}
                style={{
                  padding: '0.35rem 0.85rem',
                  borderRadius: '20px',
                  backgroundColor: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--accent-purple)',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            backgroundColor: 'var(--bg-tertiary)',
            border: '1px solid var(--border-color)',
            borderRadius: '14px',
            padding: '0.4rem 0.5rem 0.4rem 1rem'
          }}>
            <input
              type="text"
              placeholder="Ask anything..."
              value={inputQuery}
              onChange={e => setInputQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                backgroundColor: 'transparent',
                fontSize: '0.9rem',
                color: 'var(--text-primary)'
              }}
            />
            
            <button
              onClick={handleVoiceToggle}
              title="Voice Assistant"
              style={{
                padding: '0.5rem',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: isListening ? '#ef4444' : 'transparent',
                color: isListening ? '#fff' : 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              <Mic size={18} />
            </button>

            <button
              onClick={() => handleSend()}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: 'var(--accent-purple)',
                color: '#fff',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
              }}
            >
              <Send size={16} />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};

export default AIAssistant;
