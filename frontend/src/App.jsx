import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import FruitCatalog from './pages/FruitCatalog';
import Checkout from './pages/Checkout'; // Import Checkout
import AdminDashboard from './pages/AdminDashboard'; // Import Admin Dashboard
import PrivateRoute from './components/PrivateRoute'; // Import PrivateRoute
import Navbar from './components/Navbar';
import Signup from './pages/Signup'; // Import Signup
import Orders from './pages/Orders'; // Import Orders

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/catalog" element={<FruitCatalog />} />
        
        {/* NEW ROUTE */}
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/orders" element={<Orders />} />

        <Route 
          path="/admin" 
          element={
            <PrivateRoute roleRequired="ADMIN">
              <AdminDashboard />
            </PrivateRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;