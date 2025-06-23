import React, { useState, useEffect } from 'react';
const BACKEND_URL = 'https://mern-buyzit-backend.onrender.com'; // Update with your backend URL

const ProductFilters = ({ onCategoryChange, onPriceChange, selectedCategory, selectedPriceOrder }) => {
  const [categories, setCategories] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/categories`);
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        setCategories(data.categories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4 mb-6">
      {/* Category Filters */}
      <div className="flex flex-wrap gap-3">
        {categories.map((category, index) => (
          <button
            key={index}
            onClick={() => onCategoryChange(category)}
            className={`px-4 py-2 rounded-full border text-sm sm:text-base transition-all duration-300 ${
              selectedCategory === category
                ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-blue-100 hover:border-blue-500'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Price Sort Dropdown */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-sm font-medium text-gray-800 rounded-md hover:bg-gray-300 transition-all"
        >
          {selectedPriceOrder
            ? `Price: ${selectedPriceOrder === 'low-to-high' ? 'Low to High' : 'High to Low'}`
            : 'Sort by Price'}
          <svg
            className="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-10 z-10">
            <div className="py-1">
              <button
                onClick={() => {
                  onPriceChange('low-to-high');
                  setIsDropdownOpen(false);
                }}
                className={`w-full px-4 py-2 m-2 text-left text-sm transition ${
                  selectedPriceOrder === 'low-to-high'
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                Price: Low to High
              </button>
              <button
                onClick={() => {
                  onPriceChange('high-to-low');
                  setIsDropdownOpen(false);
                }}
                className={`w-full px-4 py-2 text-left text-sm transition ${
                  selectedPriceOrder === 'high-to-low'
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                Price: High to Low
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductFilters;
