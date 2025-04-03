import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

interface LoginProps {
  setIsAuthenticated: (value: boolean) => void;
}



export default function Login({ setIsAuthenticated }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // In Login.tsx replace handleSubmit with:
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://chatbot-backend-dikk.onrender.com/login", {
        username,
        password
      });
      const token = response.data.access_token;
      if (token) {
        localStorage.setItem('authToken', token);
        setIsAuthenticated(true);
        navigate('/');
      }
    } catch (err) {
      setError('Invalid credentials');
      setUsername('');
      setPassword('');
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>🔒 Secure Access Portal</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="login-button">
            Authenticate
          </button>
        </form>
        
      </div>
    </div>
  );
}
