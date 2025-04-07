// src/components/Chat.tsx
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { FiSend } from 'react-icons/fi';
import './Chat.css';
import ResponseDetails from './ResponseDetails';
import { useNavigate } from 'react-router-dom';

interface Message {
  text: string;
  isUser: boolean;
  id: number;
  details?: {
    anonymizedPrompt?: string;
    raw?: string;
  };
}

interface AnonymizationMapping {
  type: string;
  original: string;
  anonymized: string;
}

interface ChatProps {
  setIsAuthenticated: (value: boolean) => void;
}

export default function Chat({ setIsAuthenticated }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/process';

  const navigate = useNavigate();

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) return;
        
        const response = await axios.post(API_URL + '/history', {}, {
          headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        setMessages(response.data.history.map((msg: any) => ({
          text: msg.text,
          isUser: msg.isUser,
          id: Date.now() + Math.random(),
          details: msg.details
        })));
      } catch (err) {
        console.error('Error loading history:', err);
      }
    };

    loadHistory();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    
    setLoading(true);
    setError(null);
    
    const newUserMessageId = Date.now();
    
    // Add optimistic user message
    setMessages(prev => [
      ...prev, 
      { 
        text: input, 
        isUser: true, 
        id: newUserMessageId,
        details: {} 
      }
    ]);

    try {
      const authToken = localStorage.getItem('authToken');
      const response = await axios.post<{
        response: string;
        llm_raw: string;
        llm_after_recontext: string;
        anonymized_prompt: string;
        mapping: AnonymizationMapping[];
      }>(API_URL, { 
        prompt: input,
        history: messages.map(msg => ({
          isUser: msg.isUser,
          text: msg.isUser ? msg.details?.anonymizedPrompt : msg.details?.raw
        }))
      }, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });

      // Update user message with anonymized data
      setMessages(prev => prev.map(msg => {
        if (msg.id === newUserMessageId) {
          return {
            ...msg,
            details: {
              ...msg.details,
              anonymizedPrompt: response.data.anonymized_prompt
            }
          };
        }
        return msg;
      }));

      // Add bot response
      setMessages(prev => [
        ...prev,
        {
          text: response.data.response,
          isUser: false,
          id: Date.now() + 1,
          details: {
            raw: response.data.llm_raw,
            anonymizedPrompt: response.data.anonymized_prompt
          }
        }
      ]);
    } catch (err) {
      let errorMessage = 'Failed to send message';
      if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.error || err.message;
      }
      setError(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
      setInput('');
    }
  };

   return (
    <div className="chat-container">
      <header className="chat-header">
        <div className="header-content">
          <div className="cyber-border"></div>
          <div className="brand-container">
            <span className="decorative-left">
              Zyn0Q9🗝️kbMz!7rfS0Gv🗝️#K!nrynLx82?f🛡️S09k%LwNj7Dbc🛡️T&AV@0qZ94e
            </span>
            <h1 className="brand-title">
              <span className="lock-icon">🔒</span>
              <span className="gradient-text">Private Prompt</span>
              <span className="lock-icon">🔒</span>
            </h1>
            <span className="decorative-right">
              JaS9Lg0m4T1G🔒HxahUbkNZ94pRnA🔒vzke?JG5rG$a~d🔑#fHS9LQhUpi🔑4T1GpRnxf
            </span>
          </div>
          <div className="cyber-border"></div>

          <div className="header-right">
            <button 
              onClick={handleLogout} 
              className="logout-button"
              aria-label="Logout"
            >
              <span className="logout-text">Logout</span>
              <span className="logout-icon">🚪</span>
            </button>
          </div>

          
        </div>
      </header>

      <div className="messages-container">
        {messages.length === 0 && !loading && (
          <div className="suggestions-container">
            <div className="intro-text">
              Take control of your privacy and use Private-Prompt.com to anonymize your AI messages!
            </div>
            <h3>Try one of these prompts or write your own:</h3>
            <div className="suggestions-list">
              {suggestedPrompts.map((prompt, index) => (
                <button
                  key={index}
                  className="suggestion-button"
                  onClick={() => {
                    setInput(prompt);
                    inputRef.current?.focus();
                  }}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.isUser ? 'user' : 'bot'}`}>
            {msg.details && <ResponseDetails details={msg.details} />}
            {msg.text}
            
          </div>
        ))}

        {loading && (
          <div className="loading-indicator">
            <div className="spinner"></div>
            Generating response...
          </div>
        )}

        {/* Scroll anchor placed at the bottom of messages container */}
        <div ref={messagesEndRef} />
      </div>

      {error && (
        <div className="error-message">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          {error}
        </div>
      )}

      <div className="input-container">
        <form onSubmit={handleSubmit} className="input-wrapper">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={loading}
            className="chat-input"
          />
          <button type="submit" disabled={loading} className="send-button">
            <FiSend className="send-icon" />
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
