import { useEffect, useState } from 'react';
import api from '../services/api';
import 'bootstrap/dist/css/bootstrap.min.css';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMyOrders();
    }, []);

    const fetchMyOrders = async () => {
        try {
            const res = await api.get('/orders/my-orders');
            setOrders(res.data);
        } catch (err) {
            console.error("Failed to load orders", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="container mt-5">Loading your orders...</div>;

    return (
        <div className="container mt-4">
            <h2 className="mb-4">My Orders 📦</h2>

            {orders.length === 0 ? (
                <div className="alert alert-info">
                    You haven't placed any orders yet. <a href="/catalog">Go shopping!</a>
                </div>
            ) : (
                <div className="row">
                    {orders.map(order => (
                        <div key={order.id} className="col-md-6 mb-4">
                            <div className="card shadow-sm border-start border-4 border-success">
                                <div className="card-header bg-white d-flex justify-content-between align-items-center">
                                    <strong>Order #{order.id}</strong>
                                    <span className={`badge ${order.status === 'CONFIRMED' ? 'bg-success' : 'bg-warning'}`}>
                                        {order.status || 'PENDING'}
                                    </span>
                                </div>
                                <div className="card-body">
                                    <h5 className="card-title">₹{order.totalAmount}</h5>
                                    <p className="card-text text-muted mb-2">
                                        <small>Delivering to: {order.communityName}</small>
                                    </p>

                                    <ul className="list-group list-group-flush mb-3">
                                        {order.items && order.items.map((item, idx) => (
                                            <li key={idx} className="list-group-item d-flex justify-content-between px-0">
                                                <span>{item.fruitName || "Fruit"}</span>
                                                <span>{item.quantityKg} kg</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="d-grid">
                                        <button className="btn btn-outline-success btn-sm">Track Order 🚚</button>
                                    </div>
                                </div>
                                <div className="card-footer text-muted d-flex justify-content-between">
                                    <small>
                                        Ordered on: {new Date(order.orderTimestamp).toLocaleDateString('en-IN', {
                                            day: 'numeric', month: 'short', year: 'numeric',
                                            hour: '2-digit', minute: '2-digit'
                                        })}
                                    </small>
                                    <small>ID: #{order.id}</small>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Orders;