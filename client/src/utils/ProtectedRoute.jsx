import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useContext(AuthContext);

  // Wait for loading to complete
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  // Redirect to login if user is not authenticated
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Redirect to home if admin-only route and user is not an admin
  if (adminOnly && !user.isAdmin) {
    return <Navigate to="/" />;
  }

  // Render children if user is authenticated and passes admin check
  return children;
};

export default ProtectedRoute;