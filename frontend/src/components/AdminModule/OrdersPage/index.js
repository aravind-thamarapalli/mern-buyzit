import React, { useState, useEffect } from 'react';
import './index.css';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:5000/all-orders',{
          method:"GET",
          headers:{
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
        const data = await response.json();
        console.log(data)
        setOrders(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, orderStatus: newStatus } : order
        )
      );
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="orders-container">
      <h1 className="orders-title">Orders List</h1>
      <div className="orders-table">
        {orders.map((order) => (
          <div key={order._id} className="order-card">
            <div className="order-header">
              <h2>Order ID: {order._id}</h2>
              <p>
                User: {order.user.name} ({order.user.email})
              </p>
              <p>Total Amount: ${order.totalAmount.toFixed(2)}</p>
            </div>
            <div className="od-products-list">
              {order.products.map((item) => (
                <div key={item.product._id} className="od-product-card">
                  <img src={require(`../../../../../backend/uploads/${item.product.imageUrl}`)} alt={item.product.name} />
                  <div className="od-product-details">
                    <p>{item.product.name}</p>
                    <p>Quantity: {item.quantity}</p>
                    <p>Price: ${item.price}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="order-status">
              <p>Current Status: {order.orderStatus}</p>
              <select
                value={order.orderStatus}
                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                className="status-dropdown"
              >
                <option value="pending">Pending</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="canceled">Canceled</option>
              </select>
            </div>

            <div className="order-footer">
              <p>Payment Method: {order.paymentMethod}</p>
              <p>Created At: {new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;