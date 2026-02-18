import { useState } from 'react';
import api from '../services/api'; // Use your API service
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');


    const navigate = useNavigate(); // Hook for navigation

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/login', {
                username: phone, 
                password: password
            });

            // 1. Save Token
            localStorage.setItem('token', res.data.token);
            
            // 2. Check Role and Redirect
            const role = res.data.role; // Now available!
            
            if (role === 'ROLE_ADMIN') {
                navigate('/admin'); // Go to Dashboard
            } else {
                navigate('/catalog'); // Go to Shop
            }
            
        } catch (err) {
            setError('Invalid phone number or password');
            console.error(err);
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4 shadow" style={{ width: '400px' }}>
                <h3 className="text-center mb-3">FreshFruits Login</h3>
                
                {error && <div className="alert alert-danger">{error}</div>}
                
                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label className="form-label">Phone Number</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="9876543210"
                            required 
                        />
                    </div>
                    
                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input 
                            type="password" 
                            className="form-control" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required 
                        />
                    </div>
                    
                    <button type="submit" className="btn btn-success w-100">Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;