# 🛒 Buyzit - API Documentation

This document provides a comprehensive overview of all APIs used in the Buyzit MERN stack application.

## 🌐 Base URL
**Backend API**: `https://mern-buyzit-backend.onrender.com`

## 🔧 Centralized API Service
All API calls are now centralized in `/frontend/src/services/api.js` for better maintainability and consistency.

---

## 📁 Table of Contents
1. [API Service Structure](#api-service-structure)
2. [Authentication APIs](#authentication-apis)
3. [Product Management APIs](#product-management-apis)
4. [Category Management APIs](#category-management-apis)
5. [Cart Management APIs](#cart-management-apis)
6. [Order Management APIs](#order-management-apis)
7. [User Management APIs](#user-management-apis)
8. [Address Management APIs](#address-management-apis)
9. [Usage Examples](#usage-examples)

---

## 🏗️ API Service Structure

The centralized API service (`/frontend/src/services/api.js`) provides organized modules:

```javascript
import { 
  authAPI, 
  productAPI, 
  categoryAPI, 
  cartAPI, 
  orderAPI, 
  userAPI, 
  addressAPI 
} from '../services/api';
```

### Helper Functions
- `getAuthHeaders()`: Returns headers with JWT token for authenticated requests
- `getAuthHeadersForUpload()`: Returns headers for file uploads (no Content-Type)

---

## 🔐 Authentication APIs

### `authAPI.register(userData)`
- **Endpoint**: `POST /api/register`
- **Access**: Public
- **Used in**: `Signup.jsx`
- **Purpose**: Register a new user account
- **Parameters**: 
  ```javascript
  {
    username: "string",
    phone: "string", 
    email: "string",
    password: "string"
  }
  ```
- **Usage**:
  ```javascript
  const response = await authAPI.register(userData);
  ```

### `authAPI.login(credentials)`
- **Endpoint**: `POST /api/login`
- **Access**: Public
- **Used in**: `Login.jsx`
- **Purpose**: Authenticate user and get JWT token
- **Parameters**:
  ```javascript
  {
    username: "string",
    password: "string"
  }
  ```
- **Usage**:
  ```javascript
  const response = await authAPI.login({ username, password });
  ```

---

## 🛍️ Product Management APIs

### `productAPI.getAll()`
- **Endpoint**: `GET /api/get-products`
- **Access**: Public
- **Used in**: `Home.jsx`, `Dashboard.jsx`
- **Purpose**: Fetch all products with category information
- **Usage**:
  ```javascript
  const response = await productAPI.getAll();
  const data = await response.json();
  ```

### `productAPI.getById(id)`
- **Endpoint**: `GET /api/products/:id`
- **Access**: Public
- **Used in**: `ProductDetails.jsx`
- **Purpose**: Get detailed information about a specific product
- **Usage**:
  ```javascript
  const response = await productAPI.getById(productId);
  ```

### `productAPI.add(formData)` (Admin)
- **Endpoint**: `POST /api/add-products`
- **Access**: Admin only
- **Used in**: `AddProduct.jsx`
- **Purpose**: Create a new product with image upload
- **Parameters**: FormData with product details and image file
- **Usage**:
  ```javascript
  const formData = new FormData();
  formData.append('name', productName);
  formData.append('image', imageFile);
  // ... other fields
  const response = await productAPI.add(formData);
  ```

### `productAPI.updateImage(id, formData)` (Admin)
- **Endpoint**: `PUT /api/products/:id/image`
- **Access**: Admin only
- **Purpose**: Update product image

### `productAPI.delete(id)` (Admin)
- **Endpoint**: `DELETE /api/products/:id`
- **Access**: Admin only
- **Used in**: `Dashboard.jsx`
- **Purpose**: Remove a product from the system
- **Usage**:
  ```javascript
  const response = await productAPI.delete(productId);
  ```

---

## 📂 Category Management APIs

### `categoryAPI.getAll()`
- **Endpoint**: `GET /api/categories`
- **Access**: Public
- **Used in**: `Home.jsx`, `Filter.jsx`, `AddProduct.jsx`
- **Purpose**: Fetch all product categories
- **Usage**:
  ```javascript
  const response = await categoryAPI.getAll();
  ```

### `categoryAPI.add(categoryData)` (Admin)
- **Endpoint**: `POST /api/categories`
- **Access**: Admin only
- **Used in**: `AddCategory.jsx`
- **Purpose**: Create a new product category
- **Parameters**:
  ```javascript
  {
    name: "string",
    description: "string"
  }
  ```
- **Usage**:
  ```javascript
  const response = await categoryAPI.add(categoryData);
  ```

### `categoryAPI.delete(id)` (Admin)
- **Endpoint**: `DELETE /api/categories/:id`
- **Access**: Admin only
- **Used in**: `Dashboard.jsx`
- **Purpose**: Remove a category

---

## 🛒 Cart Management APIs

### `cartAPI.addItem(productId, quantity)`
- **Endpoint**: `POST /cart/add`
- **Access**: Authenticated users
- **Used in**: `Home.jsx`
- **Purpose**: Add products to user's cart
- **Usage**:
  ```javascript
  const response = await cartAPI.addItem(product._id, 1);
  ```

### `cartAPI.addItemAlt(productId, quantity)`
- **Endpoint**: `POST /api/cart/add` 
- **Access**: Authenticated users
- **Used in**: `ProductDetails.jsx`
- **Purpose**: Alternative endpoint for adding to cart

### `cartAPI.get()`
- **Endpoint**: `GET /cart`
- **Access**: Authenticated users
- **Used in**: `Cart.jsx`, `AddressForm.jsx`
- **Purpose**: Retrieve user's cart items with product details
- **Usage**:
  ```javascript
  const response = await cartAPI.get();
  ```

### `cartAPI.updateQuantity(productId, quantity)`
- **Endpoint**: `PUT /cart/:productId`
- **Access**: Authenticated users
- **Used in**: `Cart.jsx`
- **Purpose**: Update quantity of items in cart
- **Usage**:
  ```javascript
  const response = await cartAPI.updateQuantity(productId, newQuantity);
  ```

---

## 📦 Order Management APIs

### `orderAPI.create(orderData)`
- **Endpoint**: `POST /order`
- **Access**: Authenticated users
- **Used in**: `CartPopup.jsx`
- **Purpose**: Place a new order from cart items
- **Parameters**:
  ```javascript
  {
    products: [
      {
        productId: "string",
        quantity: "number",
        price: "number"
      }
    ],
    totalAmount: "number",
    paymentMethod: "string"
  }
  ```
- **Usage**:
  ```javascript
  const response = await orderAPI.create(orderData);
  ```

### `orderAPI.getUserOrders()`
- **Endpoint**: `GET /orders`
- **Access**: Authenticated users
- **Used in**: `MyOrders.jsx`
- **Purpose**: Get all orders for the authenticated user
- **Usage**:
  ```javascript
  const response = await orderAPI.getUserOrders();
  ```

### `orderAPI.getAll()` (Admin)
- **Endpoint**: `GET /all-orders`
- **Access**: Admin only
- **Used in**: `OrdersPage.jsx`, `Dashboard.jsx`
- **Purpose**: Get all orders in the system for admin management

### `orderAPI.updateStatus(orderId, status)` (Admin)
- **Endpoint**: `PUT /all-orders/:orderId/status`
- **Access**: Admin only
- **Used in**: `OrdersPage.jsx`
- **Purpose**: Update order status
- **Usage**:
  ```javascript
  const response = await orderAPI.updateStatus(orderId, 'shipped');
  ```

---

## 👥 User Management APIs

### `userAPI.getAll()` (Admin)
- **Endpoint**: `GET /api/users`
- **Access**: Admin only
- **Used in**: `Dashboard.jsx`
- **Purpose**: Get all registered users for admin dashboard

### `userAPI.delete(id)` (Admin)
- **Endpoint**: `DELETE /api/users/:id`
- **Access**: Admin only
- **Used in**: `Dashboard.jsx`
- **Purpose**: Remove a user account

---

## 📍 Address Management APIs

### `addressAPI.add(addressData)`
- **Endpoint**: `POST /add-address`
- **Access**: Authenticated users
- **Used in**: `AddressForm.jsx`
- **Purpose**: Add shipping address for orders
- **Parameters**:
  ```javascript
  {
    label: "string",
    recipientName: "string",
    doorNo: "string",
    buildingName: "string",
    street: "string",
    landmark: "string",
    pinCode: "string"
  }
  ```
- **Usage**:
  ```javascript
  const response = await addressAPI.add(addressData);
  ```

---

## 💡 Usage Examples

### Component Integration Example
```javascript
// In any component
import { productAPI, cartAPI } from '../services/api';

const MyComponent = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productAPI.getAll();
        const data = await response.json();
        setProducts(data.products);
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = async (productId) => {
    try {
      const response = await cartAPI.addItem(productId, 1);
      if (response.ok) {
        alert('Added to cart!');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
};
```

### Error Handling Pattern
```javascript
try {
  const response = await productAPI.getAll();
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  const data = await response.json();
  // Handle success
} catch (error) {
  console.error('Error:', error);
  // Handle error
}
```

---

## 🔒 Authentication & Authorization

### JWT Token Management
- **Storage**: Automatically handled by the API service using `localStorage`
- **Header Format**: `Authorization: Bearer <token>`
- **Expiration**: 24 hours
- **Auto-Inclusion**: Auth headers are automatically added to protected endpoints

### Protected Routes
- All cart operations require authentication
- All order operations require authentication  
- Admin endpoints require both authentication and admin role
- Product viewing and category listing are public

---

## � Benefits of Centralized API Service

1. **Single Source of Truth**: All API endpoints defined in one place
2. **Consistent Error Handling**: Standardized approach across components
3. **Easy Maintenance**: Update URLs or logic in one file
4. **Type Safety**: Clear function signatures and parameters
5. **Reusability**: Same functions used across multiple components
6. **Authentication**: Automatic handling of JWT tokens
7. **Testing**: Easier to mock and test API calls

---

## � Migration Notes

All components have been updated to use the centralized API service:
- Removed individual `BACKEND_URL` constants
- Replaced `fetch()` calls with service functions
- Maintained existing functionality while improving maintainability
- Preserved all error handling and loading states
