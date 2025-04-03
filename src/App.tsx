// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Chat from './components/Chat';
import Login from './components/Login';
import Register from './components/Register';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // In App.tsx useEffect:
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      // Add proper JWT validation check here
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/register" 
          element={
            isAuthenticated ? (
              <Navigate to="/" replace />
            ) : (
              <Register setIsAuthenticated={setIsAuthenticated} />
            )
          } 
        />
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
