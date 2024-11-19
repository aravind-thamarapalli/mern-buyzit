import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store JWT token in local storage
        localStorage.setItem('token', data.token);
        alert('Login successful!');

        if(data.user.isAdmin){
            navigate('/admin/add-product',{replace:true});
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
    <div className="">
      <div className="login-1">
        <div className="login-main">
          <div className="signup-container">
            <form className="form-container" onSubmit={handleSubmit}>
              <h2 className="signup-header">Sign in your account</h2>
              <label className="signup-labels">User name</label>
              <div>
                <input
                  name="username"
                  type="text"
                  required
                  className="signup-inputs"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div>
                <label className="signup-labels">Password</label>
                <input
                  name="password"
                  type="password"
                  required
                  className="signup-inputs"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div>
                <a href="javascript:void(0);" className="signup-links">
                  Forgot your password?
                </a>
              </div>

              <div>
                <button
                  type="submit"
                  className="signup-btns"
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign in"}
                </button>
              </div>
              <p className="signup-links">
                Don't have an account?{" "}
                <a href="javascript:void(0);" className="signup-links">
                  Register here
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
