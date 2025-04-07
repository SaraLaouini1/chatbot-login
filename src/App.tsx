// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Chat from './components/Chat';
import Login from './components/Login';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Auto logout effect based on token expiration
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const parsedToken = JSON.parse(token);
        const remainingTime = parsedToken.expires - Date.now();

        // If token is already expired, log out immediately
        if (remainingTime <= 0) {
          localStorage.removeItem('authToken');
          setIsAuthenticated(false);
          navigate('/login');
        } else {
          setIsAuthenticated(true);
          // Set a timer to log out when the token expires
          const logoutTimer = setTimeout(() => {
            localStorage.removeItem('authToken');
            setIsAuthenticated(false);
            navigate('/login');
          }, remainingTime);

          // Cleanup timer on unmount
          return () => clearTimeout(logoutTimer);
        }
      } catch (err) {
        // If token parsing fails, remove the token and log out
        localStorage.removeItem('authToken');
        setIsAuthenticated(false);
        navigate('/login');
      }
    }
  }, [navigate]);

  return (
    <Routes>
      <Route 
        path="/login" 
        element={
          isAuthenticated ? (
            <Navigate to="/" replace />
          ) : (
            <Login setIsAuthenticated={setIsAuthenticated} />
          )
        } 
      />
      <Route 
        path="/" 
        element={
          isAuthenticated ? (
            <Chat setIsAuthenticated={setIsAuthenticated} />
          ) : (
            <Navigate to="/login" replace />
          )
        } 
      />
    </Routes>
  );
}

export default App;
