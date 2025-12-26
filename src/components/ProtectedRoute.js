// ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    // User not logged in, redirect to login page
    return <Navigate to="/admin" replace />;
  }

  // User logged in, allow access
  return children;
};

export default ProtectedRoute;
