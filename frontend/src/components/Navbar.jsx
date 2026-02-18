import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    // Check if user is logged in
    const isLoggedIn = !!token;

    const handleLogout = () => {
        // 1. Clear Data
        localStorage.removeItem('token');
        localStorage.removeItem('cart'); // Optional: Clear cart on logout

        // 2. Redirect to Login
        navigate('/login');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-success mb-4">
            <div className="container">
                <Link className="navbar-brand fw-bold" to="/catalog">🍏 FreshFruits</Link>

                <div className="d-flex">
                    {isLoggedIn ? (
                        <>
                            <Link to="/orders" className="btn btn-outline-light btn-sm me-2">
                                My Orders 📦
                            </Link>
                            {/* Show distinct links based on role (optional enhancement later) */}
                            <button onClick={handleLogout} className="btn btn-outline-light btn-sm">
                                Logout 🚪
                            </button>
                        </>
                    ) : (
                        <Link to="/login" className="btn btn-outline-light btn-sm">Login</Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;