import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { StoreContext } from '../contexts/StoreContext';

function AdminRoute({ children }) {
  const { state } = useContext(StoreContext);
  const { userInfo } = state;

  return userInfo && userInfo.isAdmin ? children : <Navigate to="/signin" />;
}

export default AdminRoute;
