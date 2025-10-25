import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext/hooks/useAuth";

// Loading Component
const RouteLoading = () => (
  <div className="min-h-screen bg-gray-950 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-400 mx-auto mb-4"></div>
      <p className="text-white text-lg">Loading...</p>
    </div>
  </div>
);

// Access Denied Component
const AccessDenied = () => (
  <div className="min-h-screen bg-gray-950 flex items-center justify-center">
    <div className="text-white text-center p-8 max-w-md">
      <div className="text-6xl mb-4">🚫</div>
      <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
      <p className="text-gray-400 mb-6">
        You don't have permission to access this page.
      </p>
      <Navigate to="/" replace />
    </div>
  </div>
);

// Main ProtectedRoute Component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, isAuthenticated, isLoading, hasRole } = useAuth();

  // Show loading while checking authentication
  if (isLoading) {
    return <RouteLoading />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check role-based access
  if (requiredRole && !hasRole(requiredRole)) {
    return <AccessDenied />;
  }

  // Render protected content
  return children;
};

export default ProtectedRoute;
