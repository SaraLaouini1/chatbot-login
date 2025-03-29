import { useState, useRef, useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';
import axios from 'axios';
import { FiSend } from 'react-icons/fi';
import './Chat.css';
import ResponseDetails from './ResponseDetails';

interface Message {
  text: string;
  isUser: boolean;
  id: number;
  details?: {
    anonymizedPrompt: string;
    raw: string;
    final: string;
  };
}

export default function Chat() {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/process';

  // Enhanced scroll behavior
  useEffect(() => {
    const scroll = () => {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end"
      });
    };
    scroll();
    window.addEventListener('resize', scroll);
    return () => window.removeEventListener('resize', scroll);
  }, [messages, loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const newMessage = { 
        text: input, 
        isUser: true, 
        id: Date.now() 
      };
      setMessages(prev => [...prev, newMessage]);

      const response = await axios.post(API_URL, { prompt: input });
      
      setMessages(prev => [...prev, {
        text: response.data.response,
        isUser: false,
        id: Date.now() + 1,
        details: {
          anonymizedPrompt: response.data.anonymized_prompt,
          raw: response.data.llm_raw,
          final: response.data.response
        }
      }]);
      
    } catch (err) {
      const errorMessage = axios.isAxiosError(err) 
        ? err.response?.data?.error || err.message 
        : 'Failed to send message';
      setError(errorMessage);
    } finally {
      setLoading(false);
      setInput('');
    }
  };

  // Add mobile-specific touch handling
  const handleTouchEnd = (e: React.TouchEvent) => {
    const touch = e.changedTouches[0];
    const target = document.elementFromPoint(touch.clientX, touch.clientY);
    
    if (target?.className.includes('send-button')) {
      handleSubmit(e);
    }
  };

  return (
    <div className="chat-container" onTouchEnd={handleTouchEnd}>
      <header className="chat-header">
        <div className="title-container">
          <h1 className="chat-title">Private Prompt</h1>
          <span className="lock-logo animated-lock" aria-hidden="true">🔒</span>
        </div>
      </header>

      <div className="messages-container">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`message ${msg.isUser ? 'user' : 'bot'}`}
          >
            <div className="message-content">{msg.text}</div>
            {msg.details && <ResponseDetails details={msg.details} isMobile={isMobile} />}
          </div>
        ))}
        {loading && (
          <div className="loading-indicator">
            <div className="spinner"></div>
            <span>Generating response...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {error && (
        <div className="error-message">
          <svg xmlns="http://www.w3.org/2000/svg" className="alert-icon" viewBox="0 0 24 24">
            <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <div className="input-container">
        <form onSubmit={handleSubmit} className="input-wrapper">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={loading}
            className="chat-input"
            inputMode="text"
            enterKeyHint="send"
            autoCorrect="on"
            autoCapitalize="sentences"
          />
          <button
            type="submit"
            disabled={loading}
            className="send-button"
            aria-label="Send message"
          >
            {isMobile ? <FiSend className="send-icon" /> : 'Send Message'}
          </button>
        </form>
      </div>
    </div>
  );
}
