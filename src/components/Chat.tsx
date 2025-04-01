
import { useState, useRef, useEffect } from 'react';
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
  };
}

interface AnonymizationMapping {
  type: string;
  original: string;
  anonymized: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/process';

  // Add input ref
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Suggested prompts array
  const suggestedPrompts = [
    "Process customer support ticket #45621 from Emily Johnson (ejohnson@acmeinc.com, 555-987-6543) regarding transaction 4111-1111-1111-1111 on October 15th 2023",
    "Generate a contract for Michael Chen (michael.chen@globex.com) at 1600 Amphitheatre Parkway, Mountain View to receive $15,000.50 monthly payments starting 2024-01-01",
    "Analyze network logs from 2023-12-24T08:45:00Z showing access from 192.168.1.15 to secureportal.internalcorp.com by user ID 123-45-6789",
    "Create an invoice for TechSolutions Ltd (contact@techsolutions.co.uk) covering services from March 1st to March 31st 2024 totaling €20,000.00",
    "Document HR case for Sarah O'Reilly (sarah.oreilly@example.org, +1-416-555-1234) regarding benefits enrollment in Toronto, ON",
    "Process payment authorization from David Martínez (david.martinez@bancorp.es) for account 5500 0000 0000 0004 expiring 12/25 through payment.example-services.com",
    "Format sales report for Q2 2024 showing $1.2M revenue from Acme Corp (sales@acmecorp.com) with key contact James Wilson (555) 123-4567",
    "Analyze security incident from 2023-11-05 14:30 involving IP 203.0.113.42 accessing confidential docs at docs.corporatenet.com/user/789",
    "Prepare employment contract for Dr. Alice Tanaka (alice.tanaka@researchlab.jp) with annual salary ¥12,500,000 starting April 1st 2024",
    "Document customer complaint from Maria Silva (maria.silva@braskem.com.br, +55-11-98765-4321) regarding shipment #78945 delayed since 2023-12-15"
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    setTimeout(() => {
      const firstMessage = document.querySelector('.message');
      firstMessage?.scrollIntoView({ behavior: 'auto' });
    }, 100);
  }, []);

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
      }>(API_URL, { prompt: input });

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
      {/* Single header with logo/branding text */}
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
        </div>
      </header>

      <div className="messages-container">

        {messages.length === 0 && !loading && (
          <div className="suggestions-container">
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
            {msg.text}
            {msg.details && <ResponseDetails details={msg.details} />}
          </div>
        ))}
        {loading && (
          <div className="loading-indicator">
            <div className="spinner"></div>
            Generating response...
          </div>
        )}
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
