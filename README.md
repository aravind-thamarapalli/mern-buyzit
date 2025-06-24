# 🛒 Buyzit - Grocery Delivery Service

**Buyzit** is a full-stack web application built using the **MERN stack** (MongoDB, Express.js, React, Node.js) to streamline grocery shopping and delivery. The platform allows users to browse products, manage carts, and place orders seamlessly, while admins maintain inventory and orders.

---

## 🌐 Live Demo

- **Frontend**: [https://buyzit.vercel.app](https://buyzit.vercel.app)
- **Backend API**: [https://buyzit-api.onrender.com](https://buyzit-api.onrender.com)

---

## ✨ Features

### 👥 User Authentication
- Secure signup and login using **JWT (JSON Web Tokens)**.
- Role-based access control for **Admins** and **Customers**.

### 🛍️ Product Management
- Admins can **add**, **edit**, or **remove** products.
- Categorized product listings for easy browsing.

### 🛒 Shopping Cart
- Users can add/remove items dynamically.
- Live cart total calculation.

### 📦 Order Management
- Customers can view their **order history**.
- Admin dashboard to **manage all orders**.

### 📱 Responsive UI
- Optimized for **mobile** and **desktop** using modern UI libraries.

---

## 🛠️ Tech Stack

| Layer        | Technologies                         |
|--------------|--------------------------------------|
| Frontend     | React.js, Bootstrap / Material-UI    |
| Backend      | Node.js, Express.js                  |
| Database     | MongoDB                              |
| Authentication | JSON Web Tokens (JWT)              |
| File Uploads | Cloudinary (via multer)              |

---

## 🚀 Installation & Setup

### Step 1: Clone the repository
```bash
git clone https://github.com/aravind-thamarapalli/buyzit.git
cd buyzit
```
### Step 2: Setup Backend
```bash
cd backend
npm install
```
### Step 3: Create .env in the backend 
```bash
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### Step 4: Setup Frontend
```bash
cd ../frontend
npm install
npm start
```
---

### BOOM !!! Ready to use your project!!!

---

### Future Enhancements
- Razorpay/Stripe Payment Gateway Integration
- Email & SMS notifications for order updates
- Real-time delivery tracking (Maps API)
- Multi-language and multi-currency support
- Analytics dashboard for admins

---

### 📬 Contact
- Made with ❤️ by Aravind Thamarapalli
- Feel free to reach out for collaborations, improvements, or just to say hi!

