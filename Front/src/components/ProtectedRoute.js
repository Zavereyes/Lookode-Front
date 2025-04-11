// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../services/authService';

const ProtectedRoute = ({ children }) => {
    const isAuthenticated = authService.isAuthenticated();
    
    if (!isAuthenticated) {
        // Redirigir a login si no está autenticado
        return <Navigate to="/login" replace />;
    }
    
    return children;
};

export default ProtectedRoute;