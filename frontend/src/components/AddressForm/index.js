import React, { useState } from 'react';
import CartPopup from '../CartPopup'; // Import the CartPopup component
import './index.css';
import { useNavigate } from 'react-router-dom';


const AddressForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    recipientName: '',
    doorNo: '',
    buildingName: '',
    street: '',
    landmark: '',
    pinCode: '',
    label: '',
  });

  const [showPopup, setShowPopup] = useState(false);
  const [cartDetails, setCartDetails] = useState([]); // Sample cart details
  const paymentOptions = ['Credit Card', 'Debit Card', 'PayPal',"Cash On Delivery"]; // Sample payment options

  const navigate =useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Submit address
      const response = await fetch('http://localhost:5000/add-address', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      await response.json(); // Handle the response if necessary

      // Fetch cart details from API after successful address submission
      const cartResponse = await fetch('http://localhost:5000/cart', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!cartResponse.ok) {
        throw new Error('Failed to fetch cart details');
      }

      const cartData = await cartResponse.json();
      console.log(cartData);
      setCartDetails(cartData); // Set cart details from API
      setShowPopup(true); // Show the popup after fetching cart details

      setFormData({
        recipientName: '',
        doorNo: '',
        buildingName: '',
        street: '',
        landmark: '',
        pinCode: '',
        label: '',
      });

      alert("Address Submitted");

    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handlePayment = () => {
    // Add your payment handling logic here
    navigate('/my-orders')
    alert('Payment processing...');
    setShowPopup(false); // Close popup after payment
  };

  return (
    <>
      <div className="address-page">
        <form onSubmit={handleSubmit} className="address-form">
          <h2>Delivery Address</h2>
          <div className="form-group">
            <label htmlFor="recipientName">Recipient Name</label>
            <input
              type="text"
              id="recipientName"
              name="recipientName"
              value={formData.recipientName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="doorNo">Door No</label>
            <input
              type="text"
              id="doorNo"
              name="doorNo"
              value={formData.doorNo}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="buildingName">Building Name</label>
            <input
              type="text"
              id="buildingName"
              name="buildingName"
              value={formData.buildingName}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="street">Street</label>
            <input
              type="text"
              id="street"
              name="street"
              value={formData.street}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="landmark">Landmark</label>
            <input
              type="text"
              id="landmark"
              name="landmark"
              value={formData.landmark}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="pinCode">Pin Code</label>
            <input
              type="text"
              id="pinCode"
              name="pinCode"
              value={formData.pinCode}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="label">Label</label>
            <select
              id="label"
              name="label"
              value={formData.label}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Select Address Label
              </option>
              <option value="Home">Home</option>
              <option value="Work">Work</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <button type="submit" className="submit-button">
              Submit Address
            </button>
          </div>
        </form>

        {showPopup && (
          <CartPopup
            cartDetails={cartDetails}
            paymentOptions={paymentOptions}
            onClose={handleClosePopup}
            onPay={handlePayment}
          />
        )}
      </div>
    </>
  );
};

export default AddressForm;
