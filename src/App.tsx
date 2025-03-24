import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import Chat from './components/Chat'
import Login from './components/Login'
import { useEffect, useState } from 'react'

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    useEffect(() => {
        const token = localStorage.getItem('token')
        setIsAuthenticated(!!token)
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
