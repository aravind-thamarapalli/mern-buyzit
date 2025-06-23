import React, { useState } from 'react';
import './index.css';
import { useNavigate } from 'react-router-dom';
const BACKEND_URL = 'https://mern-buyzit-backend.onrender.com'; // Update with your backend URL

const CartPopup = ({ cartDetails, paymentOptions, onClose, onPay }) => {
  const [selectedPayment, setSelectedPayment] = useState(paymentOptions[0]); // Default to the first payment option
  const navigate= useNavigate()

  const handlePaymentChange = (e) => {
    setSelectedPayment(e.target.value); // Update selected payment method
  };

  const handleOrder = async () => {
    try {
      // Prepare order details
      const orderDetails = {
        products: cartDetails.map(item => ({
          productId: item.productId._id,
          quantity: item.quantity,
          price: (item.productId.price - (item.productId.price * (item.productId.discount / 100))) * item.quantity, // Discount percentage
        })),
        totalAmount: cartDetails.reduce((acc, item) => acc + ((item.productId.price - (item.productId.price * (item.productId.discount / 100))) * item.quantity), 0),
        paymentMethod: selectedPayment,
      };

      const response = await fetch(`${BACKEND_URL}/order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming JWT is stored in localStorage
        },
        body: JSON.stringify(orderDetails),
      });

      if (!response.ok) {
        throw new Error('Failed to place order');
      }

      const data = await response.json();
      console.log(data)
      alert('Order placed successfully!');
      
      onClose();
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    }
  };

  return (
    <div className="cart-popup-overlay">
      <div className="cart-popup">
        <h2>Cart Details</h2>
        <div className="cart-details-pop">
          {cartDetails.map((item, index) => {
            const totalPrice = (item.productId.price - (item.productId.price * (item.productId.discount / 100))) * item.quantity; // Calculate total price with percentage discount
            return (
              <div key={index} className="cart-item-pop">
                <span>{item.productId.name} - Quantity: {item.quantity} - Total Price: Rs {totalPrice.toFixed(2)}</span>
              </div>
            );
          })}
        </div>
        <div className="payment-section">
          <label htmlFor="paymentOptions">Select Payment Method:</label>
          <select id="paymentOptions" name="paymentOptions" value={selectedPayment} onChange={handlePaymentChange}>
            {paymentOptions.map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
        </div>
        <button 
  onClick={() => {
    if (selectedPayment === 'Cash On Delivery') {
      handleOrder(); // Handle the order logic here
      navigate('/my-orders'); // Navigate to the my-order page
    } else {
      onPay(); // Call the payment function for other methods
    }
  }} 
  className="pay-button">
  {selectedPayment === 'Cash On Delivery' ? 'Order' : 'Pay'}
</button>
        <button onClick={onClose} className="close-button">Close</button>
      </div>
    </div>
  );
};

export default CartPopup;
