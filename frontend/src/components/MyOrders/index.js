import React, { useState, useEffect } from "react";
import "./index.css"; // Ensure you have the correct path to your CSS file

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");

        // Check if token is available
        if (!token) {
          throw new Error("Authentication token is missing");
        }

        const response = await fetch("http://localhost:5000/orders", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // Include token in the headers
            "Content-Type": "application/json",
          },
        });

        // Check if the response is not ok and log details
        if (!response.ok) {
          console.error(`Error: ${response.status} - ${response.statusText}`);
          throw new Error("Failed to fetch orders. Please check the server.");
        }

        // Parse the JSON data
        const data = await response.json();
        console.log("Fetched Orders:", data);

        // Set orders and stop loading
        setOrders(data);
        setLoading(false);
      } catch (err) {
        console.error("Fetch error:", err); // Log the error
        setError(err.message);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  // If no orders are found
  if (orders.length === 0) {
    return <p>No orders found.</p>;
  }

  return (
    <section className="orders-section">
      <div className="orders-container">
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <h2 className="order-summary-title">Order Summary</h2>
              <div className="order-data">
                {order.products.map((item) => (
                  <div key={item._id} className="order-item">
                    <p className="order-item-name">
                      {item.product.name} (Qty: {item.quantity})
                    </p>
                    <p className="order-item-price">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="order-total">
                <p className="total-label">Total Amount</p>
                <h5 className="total-amount">
                  ${order.totalAmount.toFixed(2)}
                </h5>
              </div>
              <div className="order-detail">
                <p className="detail-label">Payment Method</p>
                <h5 className="detail-value">{order.paymentMethod}</h5>
              </div>
              <div className="order-detail">
                <p className="detail-label">Order Status</p>
                <h5 className="detail-value">{order.orderStatus}</h5>
              </div>
              <div className="order-detail">
                <p className="detail-label">Order Date</p>
                <h5 className="detail-value">
                  {new Date(order.createdAt).toLocaleDateString()}
                </h5>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MyOrders;
