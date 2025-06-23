import React, { useState, useEffect } from "react";
import "./index.css";

const BACKEND_URL = "https://mern-buyzit-backend.onrender.com"; // Update with your backend URL

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Authentication token is missing");

        const response = await fetch(`${BACKEND_URL}/orders`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch orders. Please check the server.");
        }

        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p className="loading-msg">Loading orders...</p>;
  if (error) return <p className="error-msg">Error: {error}</p>;
  if (orders.length === 0) return <p className="empty-msg">No orders found.</p>;

  return (
    <section className="orders-section">
      <div className="orders-container">
        <h2 className="orders-main-title">My Orders</h2>

        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <h3>Order Summary</h3>
                <p className="order-id">Order ID: {order._id}</p>
              </div>

              <div className="order-data">
                {order.products.map((item) => (
                  <div key={item._id} className="order-item clean-layout">
                    <div className="item-name">{item.product.name}</div>
                    <div className="item-details">
                      <span>Qty: {item.quantity}</span>
                      <span>Price: ${item.price.toFixed(2)}</span>
                      <span className="item-total">
                        Total: ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="order-footer">
                <div className="order-meta">
                  <span>Status:</span>
                  <strong className="status-text">{order.orderStatus}</strong>
                </div>
                <div className="order-meta">
                  <span>Payment:</span>
                  <strong>{order.paymentMethod}</strong>
                </div>
                <div className="order-meta">
                  <span>Date:</span>
                  <strong>{new Date(order.createdAt).toLocaleDateString()}</strong>
                </div>
                <div className="order-meta total">
                  <span>Total:</span>
                  <strong>${order.totalAmount.toFixed(2)}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MyOrders;
