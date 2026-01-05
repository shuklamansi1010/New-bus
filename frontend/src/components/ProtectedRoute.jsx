import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AppContext } from "../context/AppContext"; 

const ProtectedRoute = ({ children, admin = false }) => {
  const { token, aToken, userData } = useContext(AppContext);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (admin && !aToken) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;