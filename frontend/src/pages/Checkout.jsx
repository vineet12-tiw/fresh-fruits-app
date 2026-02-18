import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import 'bootstrap/dist/css/bootstrap.min.css';

const Checkout = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    // Hardcoded Communities for now (Matches your Milk Run logic)
    const communities = [
        "My Home Avatar",
        "Aparna Sarovar",
        "Rajapushpa Provincia",
        "Lanco Hills",
        "Rainbow Vistas",
        "Aparna Serenity"
    ];

    const [formData, setFormData] = useState({
        customerName: '',
        customerPhone: '',
        communityName: communities[0], // Default to first
        blockName: '',
        flatNo: ''
    });

    useEffect(() => {
        loadCart();
    }, []);

    const loadCart = async () => {
        const storedCart = JSON.parse(localStorage.getItem('cart') || '{}');
        const fruitIds = Object.keys(storedCart);

        if (fruitIds.length === 0) {
            alert("Your cart is empty!");
            navigate('/catalog');
            return;
        }

        try {
            const res = await api.get('/fruits');
            const allFruits = res.data;
            const items = [];
            let calcTotal = 0;

            fruitIds.forEach(id => {
                const fruit = allFruits.find(f => f.id == id);
                if (fruit) {
                    const qty = storedCart[id];
                    const cost = fruit.pricePerKg * qty;
                    items.push({ ...fruit, qty, cost });
                    calcTotal += cost;
                }
            });

            setCartItems(items);
            setTotal(calcTotal);
        } catch (err) {
            console.error("Error loading cart", err);
        }
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setLoading(true);

        // 1. Prepare Data for Backend
        const orderRequest = {
            customerName: formData.customerName,
            customerPhone: formData.customerPhone,
            communityName: formData.communityName,
            blockName: formData.blockName,
            flatNo: formData.flatNo,
            items: cartItems.map(item => ({
                fruitId: item.id,
                quantityKg: item.qty
            }))
        };

        try {
            // 2. Send to Backend
            // NOTE: This currently creates the order directly. 
            // We will add Razorpay HERE later.
            const res = await api.post('/orders', orderRequest);
            
            // 3. Success!
            alert(res.data); // Shows: "Order placed! Delivery Date: ..."
            localStorage.removeItem('cart'); // Clear cart
            navigate('/catalog'); // Go back to shop
            
        } catch (err) {
            console.error(err);
            alert("Order Failed: " + (err.response?.data || "Unknown Error"));
        } finally {
            setLoading(false);
        }
    };

    // Calculate Delivery Date (Visual Only)
    const getDeliveryDate = () => {
        const date = new Date();
        const currentHour = date.getHours();
        // If ordered after 8 PM, delivery is Day after Tomorrow
        // If before 8 PM, delivery is Tomorrow
        date.setDate(date.getDate() + (currentHour >= 20 ? 2 : 1));
        return date.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' });
    };

    return (
        <div className="container mt-5 mb-5">
            <h2 className="mb-4">Secure Checkout 🔒</h2>
            
            <div className="row">
                {/* LEFT: Order Summary */}
                <div className="col-md-5 order-md-2 mb-4">
                    <h4 className="d-flex justify-content-between align-items-center mb-3">
                        <span className="text-muted">Your Cart</span>
                        <span className="badge bg-primary rounded-pill">{cartItems.length}</span>
                    </h4>
                    <ul className="list-group mb-3 shadow-sm">
                        {cartItems.map((item, idx) => (
                            <li key={idx} className="list-group-item d-flex justify-content-between lh-sm">
                                <div>
                                    <h6 className="my-0">{item.name}</h6>
                                    <small className="text-muted">{item.qty} kg x ₹{item.pricePerKg}</small>
                                </div>
                                <span className="text-muted">₹{item.cost}</span>
                            </li>
                        ))}
                        <li className="list-group-item d-flex justify-content-between bg-light">
                            <div className="text-success">
                                <h6 className="my-0">Promo code</h6>
                                <small>EXAMPLECODE</small>
                            </div>
                            <span className="text-success">-₹0</span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between">
                            <span>Total (INR)</span>
                            <strong>₹{total}</strong>
                        </li>
                    </ul>
                    
                    <div className="card bg-info text-white">
                        <div className="card-body">
                            <h6 className="card-title">🚚 Estimated Delivery</h6>
                            <p className="card-text mb-0 fw-bold">{getDeliveryDate()}</p>
                            <small>Between 7:00 AM - 11:00 AM</small>
                        </div>
                    </div>
                </div>

                {/* RIGHT: Address Form */}
                <div className="col-md-7 order-md-1">
                    <h4 className="mb-3">Delivery Address</h4>
                    <form className="needs-validation" onSubmit={handlePlaceOrder}>
                        <div className="row g-3">
                            <div className="col-12">
                                <label className="form-label">Full Name</label>
                                <input type="text" className="form-control" required 
                                    value={formData.customerName}
                                    onChange={e => setFormData({...formData, customerName: e.target.value})}
                                />
                            </div>

                            <div className="col-12">
                                <label className="form-label">Phone Number <span className="text-muted">(for delivery updates)</span></label>
                                <input type="tel" className="form-control" required placeholder="9876543210"
                                    value={formData.customerPhone}
                                    onChange={e => setFormData({...formData, customerPhone: e.target.value})}
                                />
                            </div>

                            <div className="col-12">
                                <label className="form-label">Community / Society</label>
                                <select className="form-select" required
                                    value={formData.communityName}
                                    onChange={e => setFormData({...formData, communityName: e.target.value})}
                                >
                                    {communities.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>

                            <div className="col-sm-6">
                                <label className="form-label">Block / Tower</label>
                                <input type="text" className="form-control" required placeholder="e.g. Block A"
                                    value={formData.blockName}
                                    onChange={e => setFormData({...formData, blockName: e.target.value})}
                                />
                            </div>

                            <div className="col-sm-6">
                                <label className="form-label">Flat Number</label>
                                <input type="text" className="form-control" required placeholder="e.g. 402"
                                    value={formData.flatNo}
                                    onChange={e => setFormData({...formData, flatNo: e.target.value})}
                                />
                            </div>
                        </div>

                        <hr className="my-4" />

                        <button className="w-100 btn btn-primary btn-lg" type="submit" disabled={loading}>
                            {loading ? "Processing..." : `Pay ₹${total} & Place Order`}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Checkout;