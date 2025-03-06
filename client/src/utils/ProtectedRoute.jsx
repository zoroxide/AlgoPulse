import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    // User is not authenticated, redirect to login page
    return <Navigate to="/login" />;
  }

  if (adminOnly && !user.isAdmin) {
    // User is not an admin, redirect to home page or show an error message
    return <Navigate to="/" />;
  }

  // User is authenticated (and an admin if required), render the children components
  return children;
};

export default ProtectedRoute;