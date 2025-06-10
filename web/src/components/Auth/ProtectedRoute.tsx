import React from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // Simplified version for Electron app - always allow access
  // In a real app, you would check authentication state here
  const isAuthenticated = true;

  if (!isAuthenticated) {
    return <div>Please log in to access this content.</div>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;