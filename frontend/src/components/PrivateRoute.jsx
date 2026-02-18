import { Navigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode"; // You might need to install this: npm install jwt-decode

const PrivateRoute = ({ children, roleRequired }) => {
    const token = localStorage.getItem('token');

    if (!token) {
        return <Navigate to="/login" />;
    }

    try {
        // Decode token to check role (Optional, if you put role in JWT)
        // const decoded = jwtDecode(token);
        // if (roleRequired && decoded.role !== roleRequired) {
        //     return <Navigate to="/catalog" />;
        // }
        
        // For now, simple token check is enough to stop guests
        return children;
    } catch (e) {
        return <Navigate to="/login" />;
    }
};

export default PrivateRoute;