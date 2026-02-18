import { useEffect, useState } from 'react';
import api from '../services/api';
import 'bootstrap/dist/css/bootstrap.min.css';

const AdminDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [fruits, setFruits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('ALL'); // 'ALL', 'PACKING', 'INVENTORY'
    
    // --- Date Filter State ---
    const getTomorrow = () => {
        const d = new Date();
        d.setDate(d.getDate() + 1);
        return d.toISOString().split('T')[0];
    };
    const [selectedDeliveryDate, setSelectedDeliveryDate] = useState(getTomorrow());

    // --- Inventory State ---
    const [newFruit, setNewFruit] = useState({ name: '', pricePerKg: '', stockQuantity: '' });
    const [stockUpdates, setStockUpdates] = useState({}); 

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [orderRes, fruitRes] = await Promise.all([
                api.get('/orders/all'),
                api.get('/fruits')
            ]);
            setOrders(orderRes.data);
            setFruits(fruitRes.data);
        } catch (err) {
            console.error("Failed to load data", err);
        } finally {
            setLoading(false);
        }
    };

    // --- Logic: Calculate Delivery Date ---
    const calculateDeliveryDate = (orderTimestamp) => {
        const orderDate = new Date(orderTimestamp);
        const cutoffHour = 20; // 8:00 PM
        const deliveryDate = new Date(orderDate);
        
        if (orderDate.getHours() < cutoffHour) {
            deliveryDate.setDate(orderDate.getDate() + 1);
        } else {
            deliveryDate.setDate(orderDate.getDate() + 2);
        }
        return deliveryDate.toISOString().split('T')[0];
    };

    // --- Filter Orders by Date ---
    const getFilteredOrders = () => {
        return orders.filter(order => {
            const actualDeliveryDate = calculateDeliveryDate(order.orderTimestamp);
            return actualDeliveryDate === selectedDeliveryDate;
        });
    };

    // --- Group Orders by Community ---
    const getOrdersByCommunity = () => {
        const relevantOrders = getFilteredOrders();
        return relevantOrders.reduce((groups, order) => {
            const key = order.communityName || 'Unspecified';
            if (!groups[key]) groups[key] = [];
            groups[key].push(order);
            return groups;
        }, {});
    };

    // --- Inventory Handlers ---
    const handleAddFruit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/fruits', newFruit);
            alert('Fruit Added!');
            setNewFruit({ name: '', pricePerKg: '', stockQuantity: '' });
            fetchData();
        } catch (err) { alert('Failed to add fruit'); }
    };
    const handleUpdateStock = async (id) => {
        try {
            await api.put(`/fruits/${id}/stock`, null, { params: { quantity: stockUpdates[id] } });
            alert('Stock Updated!');
            setStockUpdates({ ...stockUpdates, [id]: '' });
            fetchData();
        } catch (err) { alert('Failed to update stock'); }
    };
    const handleDeleteFruit = async (id) => {
        if (!window.confirm("Delete?")) return;
        try { await api.delete(`/fruits/${id}`); fetchData(); } 
        catch (err) { alert('Failed to delete'); }
    };
    const downloadGatePass = async () => {
        try {
            const response = await api.get('/admin/gate-pass', { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `GatePass_${selectedDeliveryDate}.csv`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (err) { alert("Download failed"); }
    };

    const calculateCommunityTotal = (communityOrders) => {
        return communityOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    };

    return (
        <div className="container mt-4 mb-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Admin Dashboard 👮‍♂️</h2>
                <div className="btn-group">
                    <button className={`btn ${view === 'ALL' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setView('ALL')}>Orders</button>
                    <button className={`btn ${view === 'PACKING' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setView('PACKING')}>Packing 📦</button>
                    <button className={`btn ${view === 'INVENTORY' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setView('INVENTORY')}>Inventory</button>
                    <button className="btn btn-success" onClick={downloadGatePass}>CSV 📄</button>
                </div>
            </div>

            {loading ? <p>Loading...</p> : (
                <>
                    {/* VIEW 1: ALL ORDERS LIST */}
                    {view === 'ALL' && (
                        <div className="card shadow-sm">
                            <div className="card-body p-0">
                                <table className="table table-hover mb-0">
                                    <thead className="bg-light">
                                        <tr>
                                            <th>ID</th>
                                            <th>Delivery Date</th>
                                            <th>Customer</th>
                                            <th>Items</th>
                                            <th>Amount</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map(order => (
                                            <tr key={order.id}>
                                                <td>#{order.id}</td>
                                                <td className="text-primary fw-bold">
                                                    {calculateDeliveryDate(order.orderTimestamp)}
                                                </td>
                                                <td>{order.customerName}<br/><small className="text-muted">{order.customerPhone}</small></td>
                                                <td>{order.items.length} items</td>
                                                <td>₹{order.totalAmount}</td>
                                                <td>{order.status}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* VIEW 2: PACKING MODE (CLEANER UI) */}
                    {view === 'PACKING' && (
                        <div>
                            <div className="card mb-4 bg-light border-0">
                                <div className="card-body d-flex align-items-center">
                                    <label className="fw-bold me-3">📅 Packing For:</label>
                                    <input 
                                        type="date" 
                                        className="form-control w-auto" 
                                        value={selectedDeliveryDate} 
                                        onChange={(e) => setSelectedDeliveryDate(e.target.value)} 
                                    />
                                    <span className="ms-3 text-muted">
                                        ({getFilteredOrders().length} orders found)
                                    </span>
                                </div>
                            </div>

                            <div className="row">
                                {Object.keys(getOrdersByCommunity()).length === 0 ? (
                                    <div className="col-12 text-center text-muted mt-4">
                                        <h4>No orders for {selectedDeliveryDate} 😴</h4>
                                    </div>
                                ) : (
                                    Object.entries(getOrdersByCommunity()).map(([community, communityOrders]) => (
                                        <div key={community} className="col-12 mb-4">
                                            <div className="card border-warning shadow-sm">
                                                <div className="card-header bg-warning text-dark d-flex justify-content-between align-items-center">
                                                    <h5 className="mb-0">📍 {community}</h5>
                                                    <strong>Total: ₹{calculateCommunityTotal(communityOrders)}</strong>
                                                </div>
                                                <div className="card-body p-0">
                                                    <div className="row p-2">
                                                        {communityOrders.map(order => (
                                                            <div key={order.id} className="col-md-4 mb-3">
                                                                <div className="card h-100 border-secondary">
                                                                    {/* CLEAN HEADER: JUST ID & NAME */}
                                                                    <div className="card-header py-2 bg-light d-flex justify-content-between align-items-center">
                                                                        <span className="fw-bold">#{order.id} {order.customerName}</span>
                                                                        <span className="badge bg-secondary">₹{order.totalAmount}</span>
                                                                    </div>
                                                                    
                                                                    <ul className="list-group list-group-flush">
                                                                        {order.items.map((item, idx) => (
                                                                            <li key={idx} className="list-group-item d-flex justify-content-between py-1">
                                                                                <span>{item.fruit.name}</span>
                                                                                <strong>{item.quantityKg} kg</strong>
                                                                            </li>
                                                                        ))}
                                                                    </ul>

                                                                    <div className="card-footer p-1">
                                                                        <input type="checkbox" className="btn-check" id={`check-${order.id}`} autoComplete="off" />
                                                                        <label className="btn btn-outline-success btn-sm w-100" htmlFor={`check-${order.id}`}>Mark Packed ✅</label>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    {/* VIEW 3: INVENTORY */}
                    {view === 'INVENTORY' && (
                        <div className="row">
                            <div className="col-md-4">
                                <div className="card shadow-sm mb-4">
                                    <div className="card-header bg-success text-white">Add New Fruit</div>
                                    <div className="card-body">
                                        <form onSubmit={handleAddFruit}>
                                            <div className="mb-2">
                                                <label>Name</label>
                                                <input type="text" className="form-control" required value={newFruit.name} onChange={e => setNewFruit({...newFruit, name: e.target.value})} />
                                            </div>
                                            <div className="mb-2">
                                                <label>Price</label>
                                                <input type="number" className="form-control" required value={newFruit.pricePerKg} onChange={e => setNewFruit({...newFruit, pricePerKg: e.target.value})} />
                                            </div>
                                            <div className="mb-3">
                                                <label>Stock</label>
                                                <input type="number" className="form-control" required value={newFruit.stockQuantity} onChange={e => setNewFruit({...newFruit, stockQuantity: e.target.value})} />
                                            </div>
                                            <button className="btn btn-success w-100">Add</button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-8">
                                <table className="table table-bordered bg-white">
                                    <thead className="table-light"><tr><th>Fruit</th><th>Price</th><th>Stock</th><th>Action</th></tr></thead>
                                    <tbody>
                                        {fruits.map(fruit => (
                                            <tr key={fruit.id}>
                                                <td>{fruit.name}</td>
                                                <td>₹{fruit.pricePerKg}</td>
                                                <td>{fruit.stockQuantity} kg</td>
                                                <td>
                                                    <div className="input-group input-group-sm">
                                                        <input type="number" className="form-control" placeholder="+Qty" value={stockUpdates[fruit.id] || ''} onChange={(e) => setStockUpdates({...stockUpdates, [fruit.id]: e.target.value})} />
                                                        <button className="btn btn-outline-primary" onClick={() => handleUpdateStock(fruit.id)}>Add</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default AdminDashboard;