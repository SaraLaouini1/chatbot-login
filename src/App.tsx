import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Chat from './components/Chat'
import Login from './components/Login'
import { useEffect, useState } from 'react'

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token')
)

    useEffect(() => {
        const checkAuth = () => {
            setIsAuthenticated(!!localStorage.getItem('token'))
        };
        
        window.addEventListener('storage', checkAuth)
        return () => window.removeEventListener('storage', checkAuth)
    }, [])

    return (
        <Router>
            <Routes>
                <Route 
                    path="/chat" 
                    element={isAuthenticated ? <Chat /> : <Navigate to="/login" />} 
                />
                <Route 
                    path="/login" 
                    element={!isAuthenticated ? <Login /> : <Navigate to="/chat" />} 
                />
                <Route path="/" element={<Navigate to="/chat" />} />
            </Routes>
        </Router>
    )
}

export default App
