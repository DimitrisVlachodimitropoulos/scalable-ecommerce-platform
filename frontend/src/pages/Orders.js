import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const Orders = () => {
    const { token } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [cart, setCart] = useState(JSON.parse(localStorage.getItem("cart")) || []);
    const [loading, setLoading] = useState(true);

    // ✅ Fetch User's Orders
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/orders", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setOrders(response.data);
                setLoading(false);
            } catch (error) {
                console.error("[Frontend] Error fetching orders:", error);
                setLoading(false);
            }
        };
        fetchOrders();
    }, [token]);

    // ✅ Place Order from Cart
    const placeOrder = async () => {
        if (cart.length === 0) {
            alert("Your cart is empty!");
            return;
        }

        if (!token) {
            alert("You must be logged in to place an order!");
            return;
        }

        const orderData = {
            products: cart.map(item => ({
                productId: item._id,
                quantity: item.quantity,
            })),
            totalPrice: cart.reduce((acc, item) => acc + item.price * item.quantity, 0)
        };

        try {
            const response = await axios.post(
                "http://localhost:5000/api/orders",
                orderData,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            alert("Order placed successfully!");
            localStorage.removeItem("cart");
            setCart([]);
            setOrders([...orders, response.data]); // ✅ Add the new order to state
        } catch (error) {
            console.error("[Frontend] Error placing order:", error);
            alert("Failed to place order.");
        }
    };

    // ✅ Delete an Order
    const handleDeleteOrder = async (orderId) => {
        if (!window.confirm("Are you sure you want to delete this order?")) return;

        try {
            await axios.delete(`http://localhost:5000/api/orders/${orderId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setOrders(orders.filter(order => order._id !== orderId));
            alert("Order deleted successfully!");
        } catch (error) {
            console.error("[Frontend] Error deleting order:", error);
            alert("Failed to delete order.");
        }
    };

    // ✅ Update Order Status
    const handleUpdateStatus = async (orderId, newStatus) => {
        try {
            const response = await axios.put(
                `http://localhost:5000/api/orders/${orderId}`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setOrders(orders.map(order => (order._id === orderId ? { ...order, status: response.data.status } : order)));
        } catch (error) {
            console.error("[Frontend] Error updating order status:", error);
            alert("Failed to update order status.");
        }
    };

    // ✅ Remove an Item from Cart
    const removeFromCart = (index) => {
        const updatedCart = [...cart];
        updatedCart.splice(index, 1);
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
    };

    if (loading) return <p>Loading orders...</p>;

    return (
        <div>
            <h2>My Orders</h2>

            {/* ✅ Cart Section (Placing an Order) */}
            <div>
                <h3>Cart</h3>
                {cart.length === 0 ? (
                    <p>Your cart is empty.</p>
                ) : (
                    <>
                        <ul>
                            {cart.map((item, index) => (
                                <li key={index}>
                                    {item.name} - ${item.price} x {item.quantity}
                                    <button onClick={() => removeFromCart(index)} style={{ marginLeft: "10px", backgroundColor: "red", color: "white" }}>Remove</button>
                                </li>
                            ))}
                        </ul>
                        <button onClick={placeOrder}>Place Order</button>
                    </>
                )}
            </div>

            {/* ✅ Orders Table */}
            <h3>Your Orders</h3>
            {orders.length === 0 ? (
                <p>You have no past orders.</p>
            ) : (
                <table border="1">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Total Price</th>
                            <th>Status</th>
                            <th>Products</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order._id}>
                                <td>{order._id}</td>
                                <td>${order.totalPrice.toFixed(2)}</td>
                                <td>
                                    <select value={order.status} onChange={(e) => handleUpdateStatus(order._id, e.target.value)}>
                                        <option value="pending">Pending</option>
                                        <option value="processing">Processing</option>
                                        <option value="shipped">Shipped</option>
                                        <option value="delivered">Delivered</option>
                                    </select>
                                </td>
                                <td>
                                    <ul>
                                        {order.products.map((product, index) => (
                                            <li key={index}>{product.productId?.name} - {product.quantity} pcs</li>
                                        ))}
                                    </ul>
                                </td>
                                <td>
                                    <button onClick={() => handleDeleteOrder(order._id)}>Delete</button>
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
