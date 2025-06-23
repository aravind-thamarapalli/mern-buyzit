import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import './signup.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    cpassword: ''
  });

  const navigate = useNavigate()
  
  const [errors, setErrors] = useState({});
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username) newErrors.username = 'User Name is required';
    if (!formData.email) {
      newErrors.email = 'Email Id is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.phone) {
      newErrors.phone = 'Mobile No. is required';
    } else if (formData.phone.length < 10) {
      newErrors.phone = 'Mobile No. must be at least 10 digits';
    }
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password !== formData.cpassword) {
      newErrors.cpassword = 'Passwords do not match';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: formData.username,
          phone: formData.phone,
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message); // You can replace this with your success handling
        setFormData({
          username: '',
          email: '',
          phone: '',
          password: '',
          cpassword: ''
        });
        navigate("/login",{replace:true})
        setErrors({});
      } else {
        alert(data.error); // Handle errors from the server
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An unexpected error occurred');
    }
  };

  return (
    <div className="signup-container">
      <form onSubmit={handleSubmit}>
        <div className="form-container">
          <div className="signup-1">
            <h4 className="signup-header">Sign up new account</h4>
          </div>
          <div>
            <label className="signup-labels">User Name</label>
            <input
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              className="signup-inputs"
            />
            {errors.username && (
              <p className="text-red-500 text-xs mt-1">{errors.username}</p>
            )}
          </div>

          <div>
            <label className="signup-labels">Email Id</label>
            <input
              name="email"
              type="text"
              value={formData.email}
              onChange={handleChange}
              className="signup-inputs"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>
          <div>
            <label className="signup-labels">Mobile No.</label>
            <input
              name="phone"
              type="text"
              value={formData.phone}
              onChange={handleChange}
              className="signup-inputs"
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
            )}
          </div>
          <div>
            <label className="signup-labels">Password</label>
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="signup-inputs"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>
          <div>
            <label className="signup-labels">Confirm Password</label>
            <input
              name="cpassword"
              type="password"
              value={formData.cpassword}
              onChange={handleChange}
              className="signup-inputs"
            />
            {errors.cpassword && (
              <p className="text-red-500 text-xs mt-1">{errors.cpassword}</p>
            )}
          </div>
          <div className="signup-submit">
            <button type="submit" className="signup-btns">
              Sign up
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Signup;
