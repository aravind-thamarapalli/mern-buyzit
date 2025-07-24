import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductFilters from "../Filter";
import BannerSlider from "../Banner";
import { LiaRupeeSignSolid } from "react-icons/lia";
import "./Home.css"; // Import the CSS file for styles
import { productAPI, categoryAPI, cartAPI } from "../../services/api";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedPriceOrder, setSelectedPriceOrder] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productAPI.getAll();
        const data = await response.json();
        console.log(data.products);
        setProducts(data.products);
        setFilteredProducts(data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await categoryAPI.getAll();
        const data = await response.json();
        setCategories(data.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchProducts();
    fetchCategories();
  }, []);

  const handleCategoryChange = (categoryId) => {
    const newCategoryId = selectedCategoryId === categoryId ? "" : categoryId;
    setSelectedCategoryId(newCategoryId);
    filterProducts(newCategoryId, selectedPriceOrder);
  };

  const handlePriceChange = (order) => {
    setSelectedPriceOrder(order);
    filterProducts(selectedCategoryId, order);
  };

  const filterProducts = (categoryId, priceOrder) => {
    let filtered = products;

    if (categoryId) {
      filtered = filtered.filter(
        (product) => product.category === categoryId._id
      );
    }

    if (priceOrder === "low-to-high") {
      filtered.sort((a, b) => {
        const priceA =
          typeof a.price === "string"
            ? parseFloat(a.price.replace(/[^0-9.-]+/g, ""))
            : a.price;
        const priceB =
          typeof b.price === "string"
            ? parseFloat(b.price.replace(/[^0-9.-]+/g, ""))
            : b.price;
        return priceA - priceB;
      });
    } else if (priceOrder === "high-to-low") {
      filtered.sort((a, b) => {
        const priceA =
          typeof a.price === "string"
            ? parseFloat(a.price.replace(/[^0-9.-]+/g, ""))
            : a.price;
        const priceB =
          typeof b.price === "string"
            ? parseFloat(b.price.replace(/[^0-9.-]+/g, ""))
            : b.price;
        return priceB - priceA;
      });
    }

    setFilteredProducts(filtered);
  };

  const handleAddToCart = async (product) => {
    const token = localStorage.getItem("token");
    try {
      const response = await cartAPI.addItem(product._id, 1);

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

  return (
    <>
      <div className="home-bg"></div>
      <div className="home-page">
        <div className="container">
          <BannerSlider />
          <ProductFilters
            categories={categories}
            onCategoryChange={handleCategoryChange}
            onPriceChange={handlePriceChange}
            selectedCategoryId={selectedCategoryId}
            selectedPriceOrder={selectedPriceOrder}
          />

          <div className="product-grid">
            {filteredProducts.length === 0 ? (
              <p className="no-products">No products found.</p>
            ) : (
              filteredProducts.map((product) => (
                <div className="product-card" key={product._id}>
                  <div className="image-container">
                    <Link to={`/product/${product._id}`}>
                      <img
                        alt={product.imageAlt || product.name}
                        src={product.imageUrl}
                        className="product-image"
                        onError={(e) => {
                          e.target.src = '/placeholder-image.jpg';
                        }}
                      />
                    </Link>
                  </div>
                  <div className="product-details">
                    <h3 className="product-name">{product.name}</h3>
                    <div className="price-info">
                      {product.discount ? (
                        <>
                          <p className="original-price">
                            <LiaRupeeSignSolid className="icon" />
                            {product.price}
                          </p>
                          <p className="discounted-price">
                            <LiaRupeeSignSolid className="icon" />
                            {(
                              product.price -
                              product.price * (product.discount / 100)
                            ).toFixed(2)}
                          </p>
                        </>
                      ) : (
                        <p className="current-price">
                          <LiaRupeeSignSolid className="icon" />
                          {product.price}
                        </p>
                      )}
                      {product.discount && (
                        <span className="discount-label">
                          -{product.discount}%
                        </span>
                      )}
                    </div>
                    <div className="product-add-btn">
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="add-to-cart-button"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
