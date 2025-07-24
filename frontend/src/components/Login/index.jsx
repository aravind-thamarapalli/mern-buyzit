import React, { useState,useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../../services/api';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authAPI.login({ username, password });

      const data = await response.json();

      if (response.ok) {
        // Store JWT token in local storage
        localStorage.setItem('token', data.token);
        alert('Login successful!');

        if(data.user.isAdmin){
            navigate('/admin/dashboard',{replace:true});
        }
        else{
            navigate("/",{replace:true})
        }
       
      } else {
        // Show error message
        alert(data.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2 className="login-title">Sign in your account</h2>
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">User name</label>
            <input
              name="username"
              type="text"
              required
              className="form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              name="password"
              type="password"
              required
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <span className="forgot-password" onClick={() => alert('Password reset functionality not implemented yet')}>
              Forgot your password?
            </span>
          </div>

          <div className="form-group">
            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </div>
          
          <p className="login-links">
            Don't have an account?{" "}
            <Link to="/signup" className="signup-link">
              Register here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
