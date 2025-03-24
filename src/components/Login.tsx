import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './Login.css'

export default function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [isRegistering, setIsRegistering] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const endpoint = isRegistering ? '/register' : '/login'
        
        try {
            const response = await axios.post(endpoint, { username, password })
            
            if (isRegistering) {
                setIsRegistering(false)
                setError('')
                return
            }

            localStorage.setItem('token', response.data.access_token)
            navigate('/chat')
        } catch (err) {
            setError(axios.isAxiosError(err) 
                ? err.response?.data?.error || 'Authentication failed'
                : 'Authentication failed'
            )
        }
    }

    return (
        <div className="login-container">
            <div className="auth-card">
                <h2>{isRegistering ? 'Create Account' : 'Welcome Back'}</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                        required
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                    />
                    <button type="submit">
                        {isRegistering ? 'Register' : 'Login'}
                    </button>
                    {error && <div className="error-message">{error}</div>}
                </form>
                <button 
                    className="toggle-auth"
                    onClick={() => setIsRegistering(!isRegistering)}
                >
                    {isRegistering 
                        ? 'Already have an account? Login'
                        : 'Need an account? Register'}
                </button>
            </div>
        </div>
    )
}
