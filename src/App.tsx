// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Chat from './components/Chat';
import Login from './components/Login';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // Note: useNavigate now works because it's inside BrowserRouter.
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const parsedToken = JSON.parse(token);
        const remainingTime = parsedToken.expires - Date.now();
        if (remainingTime <= 0) {
          localStorage.removeItem('authToken');
          setIsAuthenticated(false);
          navigate('/login');
        } else {
          setIsAuthenticated(true);
          const logoutTimer = setTimeout(() => {
            localStorage.removeItem('authToken');
            setIsAuthenticated(false);
            navigate('/login');
          }, remainingTime);
          return () => clearTimeout(logoutTimer);
        }
      } catch (err) {
        localStorage.removeItem('authToken');
        setIsAuthenticated(false);
        navigate('/login');
      }
    }
  }, [navigate]);

  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
}

export default App;
