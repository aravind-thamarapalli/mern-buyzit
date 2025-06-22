import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiTrash2 } from 'react-icons/fi';
import './index.css';

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [productRes, orderRes, categoryRes, usersRes] = await Promise.all([
          fetch('http://localhost:5000/api/get-products', { headers }),
          fetch('http://localhost:5000/all-orders', { headers }),
          fetch('http://localhost:5000/api/categories', { headers }),
          fetch('http://localhost:5000/api/users', { headers }),
        ]);

        if (!productRes.ok || !orderRes.ok || !categoryRes.ok || !usersRes.ok) {
          throw new Error('One or more requests failed');
        }

        const [productsData, ordersData, categoriesData, usersData] = await Promise.all([
          productRes.json(),
          orderRes.json(),
          categoryRes.json(),
          usersRes.json(),
        ]);

        setProducts(productsData.products);
        setOrders(ordersData);
        setCategories(categoriesData.categories);
        setUsers(usersData);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const confirmAndDelete = async (url, id, updateStateFn) => {
    const confirm = window.confirm('Are you sure you want to delete this item? This action is irreversible!');
    if (!confirm) return;

    try {
      const response = await fetch(`${url}/${id}`, {
        method: 'DELETE',
        headers
      });

      if (!response.ok) {
        throw new Error('Failed to delete');
      }

      updateStateFn(prev => prev.filter(item => item._id !== id));
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete item');
    }
  };

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Admin Dashboard</h1>

      <div className="dashboard-buttons">
        <button onClick={() => navigate('/admin/add-product')}>+ Add Product</button>
        <button onClick={() => navigate('/admin/add-category')}>+ Add Category</button>
      </div>

      <div className="dashboard-sections">
        <div className="dashboard-section">
          <h2>All Products ({products.length})</h2>
          <div className="mini-list">
            {products.map((p) => (
              <div key={p._id} className="mini-item">
                {p.name} - ₹{p.price}
                <button onClick={() => confirmAndDelete('http://localhost:5000/api/products', p._id, setProducts)} className="delete-btn"><FiTrash2 /></button>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-section">
          <h2>All Orders ({orders.length})</h2>
          <div className="mini-list">
            {orders.map((o) => (
              <div key={o._id} className="mini-item">
                {o.user.name} - ₹{o.totalAmount} - {o.orderStatus}
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-section">
          <h2>All Categories ({categories.length})</h2>
          <div className="mini-list">
            {categories.map((c) => (
              <div key={c._id} className="mini-item">
                {c.name}
                <button onClick={() => confirmAndDelete('http://localhost:5000/api/categories', c._id, setCategories)} className="delete-btn"><FiTrash2 /></button>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-section">
          <h2>All Users ({users.length})</h2>
          <div className="mini-list">
            {users.map((u) => (
              <div key={u._id} className="mini-item">
                {u.username} ({u.email})
                <button onClick={() => confirmAndDelete('http://localhost:5000/api/users', u._id, setUsers)} className="delete-btn"><FiTrash2 /></button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
