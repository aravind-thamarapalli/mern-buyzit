import React from 'react';
import { Navigate } from 'react-router-dom';

const isAuthenticated = () => {
    const token = localStorage.getItem('token'); // Assumes token is stored in localStorage
    return !!token; // Returns true if token exists, false otherwise
};

// PrivateRoute component to protect routes
const PrivateRoute = ({ element: Component }) => {
    return isAuthenticated() ? Component : <Navigate to="/login" />;
};

export default PrivateRoute;
