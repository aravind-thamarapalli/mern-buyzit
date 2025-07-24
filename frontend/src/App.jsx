import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import { ThemeProvider } from './contexts/ThemeContext';
import './App.css'; // Import your global styles
import './styles/theme.css'; // Import theme styles
// Import API test utility in development
import { testAPIConnection } from './utils/apiTest';
// Import your other components
import Login from './components/Login';
import Signup from './components/Signup';
import MyOrders from './components/MyOrders'; 
import Cart from './components/Cart';
import HomePage from './components/Home';
import ProductDetails from './components/ProductDetails';
import AdminSideBar from './components/AdminModule';
import { useLocation } from 'react-router-dom';
import AddressForm from './components/AddressForm';
import PrivateRoute from './components/PrivateRoute'; // Import PrivateRoute

const AppRoutes = () => {
    const location = useLocation();
    const noHeaderPaths = ['/admin/add-product', '/admin/all-orders', '/admin/add-category', '/admin/dashboard', '/signup', '/login'];

    return (
        <>
            {!noHeaderPaths.includes(location.pathname) && <Header />}
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                {/* Protecting the following routes */}
                <Route path="/my-orders" element={<PrivateRoute element={<MyOrders />} />} />
                <Route path="/cart" element={<PrivateRoute element={<Cart />} />} />
                <Route path='/shipping-address' element={<PrivateRoute element={<AddressForm />} />} />
                
                {/* Admin routes */}
                <Route path="/admin/:id" element={<PrivateRoute element={<AdminSideBar />} />} />

                <Route path="/product/:id" element={<ProductDetails />} />
            </Routes>
        </>
    );
};

const App = () => {
    // Test API connection in development mode
    useEffect(() => {
        if (import.meta.env.DEV) {
            console.log('🚀 MERN BuyZit - Development Mode');
            console.log('🔌 Testing API Connection...');
            testAPIConnection().then(result => {
                if (result.success) {
                    console.log('✅ API Connection Successful');
                } else {
                    console.log('❌ API Connection Failed:', result.error || result.status);
                }
            });
        }
    }, []);

    return (
        <ThemeProvider>
            <AppRoutes />
        </ThemeProvider>
    );
};

export default App;
