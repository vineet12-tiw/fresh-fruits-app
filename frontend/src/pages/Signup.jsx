import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import 'bootstrap/dist/css/bootstrap.min.css';

const Signup = () => {
    const navigate = useNavigate();
    
    // State matches your RegisterRequest DTO
    const [formData, setFormData] = useState({
        username: '', 
        password: ''
    });
    
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // MATCHING YOUR BACKEND ENDPOINT:
            // Controller: @PostMapping("/signup") inside /api/auth
            await api.post('/auth/signup', formData);
            
            alert("Registration Successful! Please Login.");
            navigate('/login'); 
            
        } catch (err) {
            console.error("Signup Error:", err);
            // Show the exact error message from backend ("Username already taken!")
            setError(err.response?.data || "Registration failed. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card shadow p-4" style={{ maxWidth: '400px', width: '100%' }}>
                <h3 className="text-center mb-4 text-success">Join FreshFruits 🍏</h3>
                
                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleSignup}>
                    <div className="mb-3">
                        <label className="form-label">Phone Number</label>
                        <input 
                            type="tel" 
                            className="form-control" 
                            placeholder="9876543210"
                            required
                            pattern="[0-9]{10}"
                            value={formData.username}
                            onChange={(e) => setFormData({...formData, username: e.target.value})}
                        />
                        <div className="form-text">This will be your login ID.</div>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input 
                            type="password" 
                            className="form-control" 
                            placeholder="******"
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                        />
                    </div>

                    <button type="submit" className="btn btn-success w-100" disabled={loading}>
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>
                
                <div className="text-center mt-3">
                    <small>Already have an account? <Link to="/login" className="text-decoration-none">Login here</Link></small>
                </div>
            </div>
        </div>
    );
};

export default Signup;