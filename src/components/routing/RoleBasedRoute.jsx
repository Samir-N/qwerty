import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const RoleBasedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, userRole, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/Login" replace />;
  }

  if (!allowedRoles.includes(userRole)) {
    // Redirect based on user role if they don't have access to this route
    if (userRole === 'student') {
      return <Navigate to="/studentDashboard" replace />;
    } else if (userRole === 'tutor') {
      return <Navigate to="/tutorDashboard" replace />;
    } else {
      return <Navigate to="/studentRegistration" replace />;
    }
  }

  return children;
};

export default RoleBasedRoute;
