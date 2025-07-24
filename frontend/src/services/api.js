// Central API service for all backend communications
const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || 
  (import.meta.env.PROD 
    ? 'https://mern-buyzit-backend.onrender.com' 
    : ''); // Use relative URLs in development for proxy

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

// Helper function to get auth headers for file upload (no Content-Type)
const getAuthHeadersForUpload = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`
  };
};

// Helper function for API calls with error handling
const apiCall = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
      }
    });
    
    if (!response.ok) {
      console.error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    return response;
  } catch (error) {
    console.error('Network Error:', error);
    throw error;
  }
};

// Authentication APIs
export const authAPI = {
  // User registration
  register: async (userData) => {
    return await apiCall(`${BACKEND_URL}/api/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });
  },

  // User login
  login: async (credentials) => {
    return await apiCall(`${BACKEND_URL}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    });
  }
};

// Product APIs
export const productAPI = {
  // Get all products
  getAll: async () => {
    return await apiCall(`${BACKEND_URL}/api/get-products`);
  },

  // Get single product by ID
  getById: async (id) => {
    return await apiCall(`${BACKEND_URL}/api/products/${id}`);
  },

  // Add new product (Admin only)
  add: async (formData) => {
    return await apiCall(`${BACKEND_URL}/api/add-products`, {
      method: 'POST',
      headers: getAuthHeadersForUpload(),
      body: formData
    });
  },

  // Update product image (Admin only)
  updateImage: async (id, formData) => {
    return await apiCall(`${BACKEND_URL}/api/products/${id}/image`, {
      method: 'PUT',
      headers: getAuthHeadersForUpload(),
      body: formData
    });
  },

  // Delete product (Admin only)
  delete: async (id) => {
    return await apiCall(`${BACKEND_URL}/api/products/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
  }
};

// Category APIs
export const categoryAPI = {
  // Get all categories
  getAll: async () => {
    return await apiCall(`${BACKEND_URL}/api/categories`);
  },

  // Add new category (Admin only)
  add: async (categoryData) => {
    return await apiCall(`${BACKEND_URL}/api/categories`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(categoryData)
    });
  },

  // Delete category (Admin only)
  delete: async (id) => {
    return await apiCall(`${BACKEND_URL}/api/categories/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
  }
};

// Cart APIs
export const cartAPI = {
  // Add item to cart
  addItem: async (productId, quantity = 1) => {
    const response = await fetch(`${BACKEND_URL}/cart/add`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ productId, quantity })
    });
    return response;
  },

  // Alternative add to cart endpoint (used in some components)
  addItemAlt: async (productId, quantity = 1) => {
    const response = await fetch(`${BACKEND_URL}/api/cart/add`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ productId, quantity })
    });
    return response;
  },

  // Get cart items
  get: async () => {
    const response = await fetch(`${BACKEND_URL}/cart`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return response;
  },

  // Update cart item quantity
  updateQuantity: async (productId, quantity) => {
    const response = await fetch(`${BACKEND_URL}/cart/${productId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ quantity })
    });
    return response;
  }
};

// Order APIs
export const orderAPI = {
  // Create new order
  create: async (orderData) => {
    const response = await fetch(`${BACKEND_URL}/order`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(orderData)
    });
    return response;
  },

  // Get user's orders
  getUserOrders: async () => {
    const response = await fetch(`${BACKEND_URL}/orders`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return response;
  },

  // Get all orders (Admin only)
  getAll: async () => {
    const response = await fetch(`${BACKEND_URL}/all-orders`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return response;
  },

  // Update order status (Admin only)
  updateStatus: async (orderId, status) => {
    const response = await fetch(`${BACKEND_URL}/all-orders/${orderId}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status })
    });
    return response;
  }
};

// User APIs
export const userAPI = {
  // Get all users (Admin only)
  getAll: async () => {
    const response = await fetch(`${BACKEND_URL}/api/users`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return response;
  },

  // Delete user (Admin only)
  delete: async (id) => {
    const response = await fetch(`${BACKEND_URL}/api/users/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return response;
  }
};

// Address APIs
export const addressAPI = {
  // Add new address
  add: async (addressData) => {
    const response = await fetch(`${BACKEND_URL}/add-address`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(addressData)
    });
    return response;
  }
};

// Export the backend URL for any special cases
export const BACKEND_URL_EXPORT = BACKEND_URL;
