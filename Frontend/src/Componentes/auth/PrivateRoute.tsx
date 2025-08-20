import React from 'react';
import { Navigate } from 'react-router-dom';

function isAuthenticated() {
  const user = localStorage.getItem('user');
  return !!user;
}

export default function PrivateRoute({ children }: { children: React.ReactNode }) {
  return isAuthenticated() ? children : <Navigate to="/" />;
}
