import React, { useState } from 'react';
import CartPopup from '../CartPopup';
import './AddressForm.css';
import { useNavigate } from 'react-router-dom';
import { addressAPI, cartAPI } from '../../services/api'; 

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
  const [cartDetails, setCartDetails] = useState({ items: [], total: 0 }); // Updated structure
  const paymentOptions = ['Credit Card', 'Debit Card', 'PayPal', 'Cash On Delivery'];
  const navigate = useNavigate();

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
      // 1. Submit address
      const response = await addressAPI.add(formData);

      if (!response.ok) throw new Error('Failed to submit address');
      await response.json();

      // 2. Fetch cart
      const cartResponse = await cartAPI.get();

      if (!cartResponse.ok) throw new Error('Failed to fetch cart details');
      const cartData = await cartResponse.json();

      // 3. Update state with cart items
      setCartDetails({
        items: cartData.items || [],
        total: cartData.totalPrice || 0,
      });

      setShowPopup(true); // Show popup
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
      alert('Failed to submit address or fetch cart');
    }
  };

  const handleClosePopup = () => setShowPopup(false);

  const handlePayment = () => {
    navigate('/my-orders');
    alert('Payment processing...');
    setShowPopup(false);
  };

  return (
    <>
      <div className="address-page">
        <form onSubmit={handleSubmit} className="address-form">
          <h2>Delivery Address</h2>
          {[
            ['recipientName', 'Recipient Name'],
            ['doorNo', 'Door No'],
            ['buildingName', 'Building Name'],
            ['street', 'Street'],
            ['landmark', 'Landmark'],
            ['pinCode', 'Pin Code'],
          ].map(([name, label]) => (
            <div className="form-group" key={name}>
              <label htmlFor={name}>{label}</label>
              <input
                type="text"
                id={name}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                required={name !== 'buildingName' && name !== 'landmark'}
              />
            </div>
          ))}

          <div className="form-group">
            <label htmlFor="label">Label</label>
            <select
              id="label"
              name="label"
              value={formData.label}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Select Address Label</option>
              <option value="Home">Home</option>
              <option value="Work">Work</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <button type="submit" className="submit-button">Submit Address</button>
          </div>
        </form>

        {showPopup && (
          <CartPopup
            cartDetails={cartDetails.items}
            totalPrice={cartDetails.total}
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
