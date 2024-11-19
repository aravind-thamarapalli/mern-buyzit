import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
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
    const noHeaderPaths = ['/admin/add-product', '/admin/all-orders'];

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
    return (
        <Router>
            <AppRoutes />
        </Router>
    );
};

export default App;
