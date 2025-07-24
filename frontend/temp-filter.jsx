import React, { useState, useEffect } from 'react';
import { categoryAPI } from '../../services/api';
import './Filter.css';

const ProductFilters = ({ onCategoryChange, onPriceChange, selectedCategoryId, selectedPriceOrder }) => {
  const [categories, setCategories] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryAPI.getAll();
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        setCategories(data.categories || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="filter-container">
      <div className="filter-header">
        <h3 className="filter-title">🎯 Filters</h3>
        <button 
          className="filter-toggle"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          {isDropdownOpen ? '▲' : '▼'}
        </button>
      </div>
      
      <div className={`filter-content ${isDropdownOpen ? '' : 'collapsed'}`}>
        {/* Category Filters */}
        <div className="filter-group">
          <h4 className="filter-group-title">📂 Categories</h4>
          <div className="filter-buttons">
            <button
              onClick={() => onCategoryChange('')}
              className={`filter-btn ${
                !selectedCategoryId ? 'active' : ''
              }`}
            >
              All Categories
            </button>
            {categories.map((category) => (
              <button
                key={category._id}
                onClick={() => onCategoryChange(category._id)}
                className={`filter-btn ${
                  selectedCategoryId === category._id ? 'active' : ''
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Price Sort */}
        <div className="filter-group">
          <h4 className="filter-group-title">💰 Sort by Price</h4>
          <select
            value={selectedPriceOrder}
            onChange={(e) => onPriceChange(e.target.value)}
            className="filter-select"
          >
            <option value="">Default</option>
            <option value="low-to-high">Price: Low to High</option>
            <option value="high-to-low">Price: High to Low</option>
          </select>
        </div>

        {/* Filter Actions */}
        <div className="filter-actions">
          <button 
            className="clear-filters-btn"
            onClick={() => {
              onCategoryChange('');
              onPriceChange('');
            }}
          >
            Clear All Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;
