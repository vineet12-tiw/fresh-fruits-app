import { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const FruitCatalog = () => {
    const [fruits, setFruits] = useState([]);
    const [cart, setCart] = useState({}); // { fruitId: quantity }
    const navigate = useNavigate();

    // 1. Fetch Fruits on Load
    useEffect(() => {
        fetchFruits();
    }, []);

    const fetchFruits = async () => {
        try {
            const res = await api.get('/fruits');
            setFruits(res.data);
        } catch (err) {
            console.error("Error fetching fruits", err);
        }
    };

    // 2. Handle Add to Cart
    const addToCart = (fruitId) => {
        setCart(prev => ({
            ...prev,
            [fruitId]: (prev[fruitId] || 0) + 1
        }));
    };

    // 3. Go to Checkout
    const handleCheckout = () => {
        // Save cart to local storage so we can use it on the Checkout page
        localStorage.setItem('cart', JSON.stringify(cart));
        navigate('/checkout'); // We will build this next!
    };

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Fresh Fruits 🍎</h2>
                <button className="btn btn-primary" onClick={handleCheckout}>
                    Checkout ({Object.values(cart).reduce((a, b) => a + b, 0)} items)
                </button>
            </div>

            <div className="row">
                {fruits.map(fruit => (
                    <div className="col-md-4 mb-4" key={fruit.id}>
                        <div className="card shadow-sm">
                            {/* Placeholder Image until you have real ones */}
                            <img 
                                src={`https://placehold.co/300x200?text=${fruit.name}`} 
                                className="card-img-top" 
                                alt={fruit.name} 
                            />
                            <div className="card-body">
                                <h5 className="card-title">{fruit.name}</h5>
                                <p className="card-text text-muted">{fruit.description}</p>
                                <div className="d-flex justify-content-between align-items-center">
                                    <span className="h5 text-success">₹{fruit.pricePerKg}/kg</span>
                                    
                                    {cart[fruit.id] ? (
                                        <div className="btn-group">
                                            <button className="btn btn-outline-secondary">-</button>
                                            <button className="btn btn-secondary" disabled>{cart[fruit.id]} kg</button>
                                            <button className="btn btn-outline-secondary" onClick={() => addToCart(fruit.id)}>+</button>
                                        </div>
                                    ) : (
                                        <button className="btn btn-success" onClick={() => addToCart(fruit.id)}>
                                            Add to Cart
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FruitCatalog;