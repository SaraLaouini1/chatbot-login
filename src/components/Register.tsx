// src/components/Register.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css'; // Reuse or create new styles

interface RegisterProps {
  setIsAuthenticated: (value: boolean) => void;
}

export default function Register({ setIsAuthenticated }: RegisterProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://chatbot-backend-dikk.onrender.com/register", {
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
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || 'Registration failed');
      } else {
        setError('Registration failed');
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Create Account</h2>
        <form onSubmit={handleRegister}>
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
              autoComplete="new-password"
              required
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="login-button">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
