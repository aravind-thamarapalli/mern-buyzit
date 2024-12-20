import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LiaRupeeSignSolid } from "react-icons/lia";
import "./Cart.css"; // Import the CSS file

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const jwtToken = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await fetch("http://localhost:5000/cart", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch cart items");
        }

        const data = await response.json();
        setCartItems(data);
        calculateTotal(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCartItems();
  }, [jwtToken]);

  const calculateTotal = (items) => {
    const total = items.reduce((acc, item) => {
      const discountedPrice = item.productId.discount
        ? item.productId.price -
          item.productId.price * (item.productId.discount / 100)
        : item.productId.price;
      return acc + discountedPrice * item.quantity;
    }, 0);
    setTotalAmount(total.toFixed(2));
  };

  const handleIncrement = async (productId) => {
    const updatedItems = cartItems.map((item) =>
      item.productId._id === productId
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
    setCartItems(updatedItems);
    calculateTotal(updatedItems);

    try {
      const response = await fetch(`http://localhost:5000/cart/${productId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quantity: updatedItems.find(
            (item) => item.productId._id === productId
          ).quantity,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update item quantity");
      }

      const data = await response.json();
      console.log("Quantity updated in the database:", data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDecrement = async (productId) => {
    const updatedItems = cartItems.map((item) => {
      if (item.productId._id === productId && item.quantity > 1) {
        return { ...item, quantity: item.quantity - 1 };
      }
      return item;
    });

    setCartItems(updatedItems);
    calculateTotal(updatedItems);

    try {
      const response = await fetch(`http://localhost:5000/cart/${productId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quantity: updatedItems.find(
            (item) => item.productId._id === productId
          ).quantity,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update item quantity");
      }

      const data = await response.json();
      console.log("Quantity updated in the database:", data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemove = (productId) => {
    const updatedItems = cartItems.filter(
      (item) => item.productId._id !== productId
    );
    setCartItems(updatedItems);
    calculateTotal(updatedItems);
    // Optionally, send the remove request to the server here
  };

  return (
    <div className="cart-main">
      <div className="cart-container">
        <h2 className="cart-title">Cart</h2>
        <hr className="border-gray-900 mt-4 mb-8" />

        {cartItems.length === 0 ? (
          <p className="empty-cart">No Products</p>
        ) : (
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item._id} className="cart-item">
                <div className="cart-item-image">
                  <img
                    src={require(`../../../../backend/uploads/${item.productId.imageUrl}`)}
                    alt={item.productId.name}
                    className="image"
                  />
                  <h3 className="cart-item-name">{item.productId.name}</h3>
                </div>

                <div className="cart-item-details">
                  <div className="quantity-controls">
                    <button
                      className="quantity-button"
                      onClick={() => handleDecrement(item.productId._id)}
                    >
                      -
                    </button>
                    <span className="quantity">{item.quantity}</span>
                    <button
                      className="quantity-button"
                      onClick={() => handleIncrement(item.productId._id)}
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="remove-button"
                    onClick={() => handleRemove(item.productId._id)}
                  >
                    Remove
                  </button>
                  <h4 className="cart-item-price">
                    {item.productId.discount > 0
                      ? (
                          (item.productId.price -
                            item.productId.price *
                              (item.productId.discount / 100)) *
                          item.quantity
                        ).toFixed(2)
                      : (item.productId.price * item.quantity).toFixed(2)}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="cart-total">
          <span>
            Total:{" "}
            <span>
              <LiaRupeeSignSolid className="icon" />
              {totalAmount}
            </span>
          </span>
          <div className="cart-buttons">
            <button
              type="button"
              onClick={() => navigate("/shipping-address")}
              className="checkout-button"
            >
              Checkout
            </button>
            <button type="button" className="continue-shopping-button"
              onClick={() => navigate("/")}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
