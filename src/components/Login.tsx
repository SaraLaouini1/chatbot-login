import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [isLogin, setIsLogin] = useState(true);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const url = isLogin ? '/login' : '/register';
            const response = await axios.post(
                import.meta.env.VITE_API_URL + url,
                formData
            );
            
            if (isLogin) {
                sessionStorage.setItem('token', response.data.access_token);
                navigate('/chat');
            } else {
                setIsLogin(true);
                alert('Registration successful! Please login');
            }
        } catch (error) {
            alert(isLogin ? 'Login failed' : 'Registration failed');
        }
    };

    return (
        <div className="auth-container">
            <h2>{isLogin ? 'Login' : 'Register'}</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Username"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required
                />
                <button type="submit">{isLogin ? 'Sign In' : 'Create Account'}</button>
            </form>
            <button onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
            </button>
        </div>
    );
}
