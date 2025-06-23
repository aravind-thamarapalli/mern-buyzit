import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./ProductDetails.css"; // Import the CSS file

const BACKEND_URL = "https://mern-buyzit-backend.onrender.com"; // Update with your backend URL

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleAddToCart = async (product) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${BACKEND_URL}/api/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: product._id, quantity: 1 }),
      });

      if (!response.ok) {
        throw new Error("Failed to add to cart");
      }

      const data = await response.json();
      console.log(data);
      alert(`${product.name} added to cart`);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };


  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(
          `${BACKEND_URL}/api/products/${id}`
        );
        if (!response.ok) {
          throw new Error("Product not found");
        }
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!product) {
    return <p>No product found</p>;
  }

  return (
    <section className="product-details-section">
      <div className="container">
        <div className="full-product-details">
          <div className="image-container">
            <img
              className="full-product-image"
              src={`${product.imageUrl}`}
              alt={product.name}
            />
          </div>

          <div className="full-product-info">
            <h1 className="full-product-name">{product.name}</h1>
            <div className="full-price-details">
              <p className="full-original-price">₹{product.price}</p>
              <p className="full-discounted-price">
                ₹
                {(
                  product.price -
                  product.price * (product.discount / 100)
                ).toFixed(2)}
              </p>
            </div>
            <div className="full-rating-details">
              <div className="stars">
                {[...Array(5)].map((star, index) => (
                  <svg
                    key={index}
                    className={`star ${index < product.rating ? "filled" : ""}`}
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" />
                  </svg>
                ))}
              </div>
              <p className="rating-text">({product.rating})</p>
              <span className="reviews-text">{product.reviews} Reviews</span>
            </div>

            <div className="action-buttons">
              <button
                className="favorites-button"
                onClick={() => console.log("Add to favorites clicked")}
              >
                Add to favorites
              </button>

              <button
                className="full-cart-button"
                onClick={() => handleAddToCart(product)}
              >
                Add to cart
              </button>
            </div>

            <hr className="separator" />

            <p className="description-text">{product.description}</p>
            <p className="details-text">{product.details}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetails;
