import React, { useEffect, useState } from "react";
import axios from "axios";

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ✅ Fetch Orders from API
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/orders");
                setOrders(response.data);
                setLoading(false);
            } catch (err) {
                console.error("[Frontend] Error fetching orders:", err);
                setError("Failed to load orders");
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) return <p>Loading orders...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h2>Orders</h2>
            {orders.length === 0 ? (
                <p>No orders found.</p>
            ) : (
                <table border="1">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>User</th>
                            <th>Total Price</th>
                            <th>Status</th>
                            <th>Products</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order._id}>
                                <td>{order._id}</td>
                                <td>{order.user?.name || "Unknown User"}</td>
                                <td>${order.totalPrice.toFixed(2)}</td>
                                <td>{order.status}</td>
                                <td>
                                    <ul>
                                        {order.products.map(product => (
                                            <li key={product.productId?._id}>
                                                {product.productId?.name} - {product.quantity} pcs
                                            </li>
                                        ))}
                                    </ul>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Orders;
