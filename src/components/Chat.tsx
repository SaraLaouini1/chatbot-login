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
    anonymizedPrompt: string;
    raw: string;
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
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';


  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    navigate('/login');  // Use React Router navigation
  };

  // Suggested prompts array
  const suggestedPrompts = [
    
  "Create a non-compete agreement for Alice Dupont (CEO) valid until 2026-06-30 covering Europe regions",
    
  // Strategic Analysis
  "Simulate an interpretation conflict on the French clause between Acme Corp and Global Industries according to Paris jurisprudence post-2025-06-01",
  "Assess the risk of reclassifying the service contract as an employment relationship for John Doe working from London",

  // Tax Optimization
  "Compare the tax optimization of the $100,000 clauses between Acme Corp vs Global Industries for a US-Europe investment",

  // Complex Negotiation
  "Draft a basket-and-collar adjustment mechanism for an earn-out of $200,000-$300,000 in Acme Corp acquisition",


  // Predictive Litigation
  "Calculate the probability of success for a termination action for Acme Corp based on 20 similar contracts post-2025-05-01"
];





  useEffect(() => {
    setTimeout(() => {
      const firstMessage = document.querySelector('.message');
      firstMessage?.scrollIntoView({ behavior: 'auto' });
    }, 100);
  }, []);

  // Scroll handling useEffect
  useEffect(() => {
    if (messages.length === 0) return;

    const lastMessage = messages[messages.length - 1];
    if (!lastMessage.isUser) {
      const messageElements = document.querySelectorAll('.message');
      if (messageElements.length > 0) {
        const lastBotMessage = messageElements[messageElements.length - 1];
        lastBotMessage.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    
    setLoading(true);
    setError(null);
    
    try {
      setMessages(prev => [
        ...prev, 
        { text: input, isUser: true, id: Date.now() }
      ]);

      const response = await axios.post<{
        response: string;
        llm_raw: string;
        llm_after_recontext: string;
        anonymized_prompt: string;
        mapping: AnonymizationMapping[];
      }>(API_URL + '/process', { prompt: input });

      setMessages(prev => [
        ...prev, 
        {
          text: response.data.response,
          isUser: false,
          id: Date.now() + 1,
          details: {
            anonymizedPrompt: response.data.anonymized_prompt,
            raw: response.data.llm_raw,
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
