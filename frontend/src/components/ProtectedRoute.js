import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ element }) => {
    const { user } = useContext(AuthContext);
    return user ? element : <Navigate to="/login" />;
};

export default ProtectedRoute;
