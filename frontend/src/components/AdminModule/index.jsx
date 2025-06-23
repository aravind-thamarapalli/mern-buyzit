// AdminSideBar.js
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import ProductForm from "./AddProduct";
import AddCategory from "./AddCategory";
import OrdersPage from "./OrdersPage";
import Dashboard from "./Dashboard";
import "./AdminSideBar.css"; // Import the CSS file

const AdminSideBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { id } = useParams();
  console.log(id);

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <>
      <button
        type="button"
        className={`toggle-button ${isOpen ? "hidden" : "block"}`}
        onClick={toggleSidebar}
      >
        <span className="sr-only">
          {isOpen ? "Close sidebar" : "Open sidebar"}
        </span>
        <svg
          className="icon"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          {isOpen ? (
            <path
              clipRule="evenodd"
              fillRule="evenodd"
              d="M10 8.586l4.293-4.293a1 1 0 0 1 1.414 1.414L11.414 10l4.293 4.293a1 1 0 0 1-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 0 1-1.414-1.414L8.586 10 4.293 5.707a1 1 0 0 1 1.414-1.414L10 8.586z"
            />
          ) : (
            <path
              clipRule="evenodd"
              fillRule="evenodd"
              d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
            />
          )}
        </svg>
      </button>

      <aside
        className={`sidebar ${isOpen ? "open" : "closed"}`}
        aria-label="Sidebar"
      >
        <div className="sidebar-content">
          {/* Close button to close the sidebar */}
          <button
            type="button"
            className="close-button"
            onClick={toggleSidebar}
          >
            <span className="sr-only">Close sidebar</span>
            <svg
              className="icon"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                clipRule="evenodd"
                fillRule="evenodd"
                d="M10 8.586l4.293-4.293a1 1 0 0 1 1.414 1.414L11.414 10l4.293 4.293a1 1 0 0 1-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 0 1-1.414-1.414L8.586 10 4.293 5.707a1 1 0 0 1 1.414-1.414L10 8.586z"
              />
            </svg>
          </button>

          <ul className="menu">
            <li>
              <a href="dashboard" className="menu-item">
                Dashboard
              </a>
            </li>
            <li>
              <a href="add-product" className="menu-item">
                Add Products
              </a>
            </li>
            <li>
              <a href="add-category" className="menu-item">
                Add Category
              </a>
            </li>
            <li>
              <a href="all-orders" className="menu-item">
                All Orders
              </a>
            </li>
            <li>
              <a href="/login" className="menu-item">
                Logout
              </a>
            </li>
          </ul>
        </div>
      </aside>

      <div className="content">
        <div className="content-container">
          {id === "dashboard" && <Dashboard />}
          {id === "add-product" && <ProductForm />}
          {id === "add-category" && <AddCategory />}
          {id === "all-orders" && <OrdersPage />}
        </div>
      </div>
    </>
  );
};

export default AdminSideBar;
