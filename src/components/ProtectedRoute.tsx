import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
    const navigate = useNavigate();
    
    useEffect(() => {
        if (!sessionStorage.getItem('token')) {
            navigate('/login');
        }
    }, [navigate]);

    return children;
}
