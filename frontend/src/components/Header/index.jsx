import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import ThemeToggle from "../ThemeToggle";
import "./Header.css"; // Import the CSS file

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Manage user login state
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove the token from localStorage
    setIsLoggedIn(false);
    navigate("/"); // Redirect to home page after logout
  };

  return (
    <nav className="header-nav">
      <div className="header-container">
        <Link to="/" className="header-logo">
          BUYZIT
        </Link>
        <div className="hamburger" onClick={toggleMenu}>
          <div className={`bar ${isOpen ? "active" : ""}`}></div>
          <div className={`bar ${isOpen ? "active" : ""}`}></div>
          <div className={`bar ${isOpen ? "active" : ""}`}></div>
        </div>
        <div className={`nav ${isOpen ? "open" : ""}`}>
          <ul className="nav-list">
            {isLoggedIn ? (
              <>
                <li>
                  <Link to="/my-orders" className="nav-link">
                    My Orders
                  </Link>
                </li>
                <li>
                  <Link to="/cart" className="nav-link">
                    Cart
                  </Link>
                </li>
                <li>
                  <ThemeToggle />
                </li>
                <li>
                  <button onClick={handleLogout} className="nav-button">
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <button
                    onClick={() => navigate("/login")}
                    className="nav-button"
                  >
                    Sign In
                  </button>
                </li>
                <li>
                  <Link to="/signup" className="nav-link">
                    Sign Up
                  </Link>
                </li>
                <li>
                  <ThemeToggle />
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
