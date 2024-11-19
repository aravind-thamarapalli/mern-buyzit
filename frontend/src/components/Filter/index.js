import React, { useState, useEffect } from 'react';

const ProductFilters = ({ onCategoryChange, onPriceChange, selectedCategory, selectedPriceOrder }) => {
  const [categories, setCategories] = useState([]); // State to store fetched categories
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    // Function to fetch categories from the API
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/categories');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data)
        setCategories(data.categories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories(); // Call the fetch function
  }, []); // Empty dependency array to run only on mount

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:justify-between mb-6">
      {/* Category Filters */}
      <div className="flex flex-wrap gap-2 mb-4 sm:mb-0">
        {categories.map((category, index) => (
          <button
            key={index}
            onClick={() => onCategoryChange(category)}
            className={`px-4 py-2 rounded-full transition duration-300 ease-in-out text-sm sm:text-base ${
              selectedCategory === category ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Price Sort Dropdown */}
      <div className="relative inline-block text-left">
        <div>
          <button
            type="button"
            onClick={toggleDropdown}
            className="inline-flex justify-between px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500"
            aria-haspopup="true"
            aria-expanded={isDropdownOpen}
          >
            {selectedPriceOrder ? `Price: ${selectedPriceOrder === 'low-to-high' ? 'Low to High' : 'High to Low'}` : 'Sort by Price'}
            <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Conditional rendering of dropdown options */}
        {isDropdownOpen && (
          <div className="absolute right-0 z-10 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
            <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
              <button
                onClick={() => {
                  onPriceChange('low-to-high');
                  setIsDropdownOpen(false);
                }}
                className={`block px-4 py-2 text-sm text-gray-700 w-full text-left ${
                  selectedPriceOrder === 'low-to-high' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
                }`}
                role="menuitem"
              >
                Price: Low to High
              </button>
              <button
                onClick={() => {
                  onPriceChange('high-to-low');
                  setIsDropdownOpen(false);
                }}
                className={`block px-4 py-2 text-sm text-gray-700 w-full text-left ${
                  selectedPriceOrder === 'high-to-low' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
                }`}
                role="menuitem"
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
