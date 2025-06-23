import React from 'react';
import './CartSummary.css'; // Add a separate CSS file for CartSummary

const CartSummary = ({ totalItems, totalPrice, onCheckout }) => {
  return (
    <div className="cart-summary-container">
      <h3 className="cart-summary-title">Cart Summary</h3>
      <div className="cart-summary-details">
        <p>Total Items: {totalItems}</p>
        <p>Total Price: ${totalPrice.toFixed(2)}</p>
      </div>
      <button className="checkout-button" onClick={onCheckout}>
        Checkout
      </button>
    </div>
  );
};

export default CartSummary;
