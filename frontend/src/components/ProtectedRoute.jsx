import { useNavigate } from "react-router-dom";
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

// Access Denied Component - FIXED
const AccessDenied = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/", { replace: true });
  };

  const handleGoBack = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-white text-center p-8 max-w-md">
        <div className="text-6xl mb-4">🚫</div>
        <h1 className="text-2xl font-bold mb-4">Akses Ditolak</h1>
        <p className="text-gray-400 mb-6">
          Anda tidak memiliki izin untuk mengakses halaman ini.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={handleGoBack}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Kembali
          </button>
          <button
            onClick={handleGoHome}
            className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Ke Beranda
          </button>
        </div>
      </div>
    </div>
  );
};

// Main ProtectedRoute Component - FIXED
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, isAuthenticated, isLoading, hasRole } = useAuth();

  // Show loading while checking authentication
  if (isLoading) {
    return <RouteLoading />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    console.log("🔐 ProtectedRoute: Not authenticated, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  // Check if user data is available
  if (!user) {
    console.log("🔐 ProtectedRoute: No user data, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  // Check role-based access
  if (requiredRole && !hasRole(requiredRole)) {
    console.log(
      `🔐 ProtectedRoute: Role access denied. Required: ${requiredRole}, User: ${user.role}`
    );
    return <AccessDenied />;
  }

  // Debug log for successful access
  console.log(
    `🔐 ProtectedRoute: Access granted for ${user.role} to ${window.location.pathname}`
  );

  // Render protected content
  return children;
};

export default ProtectedRoute;
