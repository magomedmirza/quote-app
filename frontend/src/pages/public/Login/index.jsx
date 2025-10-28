import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext/hooks/useAuth";
import { useLogin } from "../../../contexts/AuthContext/hooks/useLogin";
import BackButton from "./components/BackButton";
import LoginHeader from "./components/LoginHeader";
import ErrorAlert from "./components/ErrorAlert";
import LoginForm from "./components/LoginForm";

// Loading Components
const AuthLoading = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-950">
    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-teal-500"></div>
  </div>
);

const RedirectLoading = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-950">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-teal-500 mx-auto mb-4"></div>
      <p className="text-teal-400 font-medium">
        Mengautentikasi dan Mengalihkan...
      </p>
    </div>
  </div>
);

const Login = () => {
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const {
    formData,
    isLoading,
    error,
    isSuccess, 
    handleChange,
    handleSubmit,
  } = useLogin();

  const navigate = useNavigate();
  const location = useLocation();


  useEffect(() => {
    if (isSuccess && isAuthenticated && user) {
      console.log("🔄 Redirecting after successful login");

      const from = location.state?.from?.pathname;
      const redirectPath =
        from ||
        (user.role === "Admin"
          ? "/admin"
          : user.role === "Penulis"
          ? "/penulis"
          : "/dashboard");

      navigate(redirectPath, { replace: true });
    }
  }, [isSuccess, isAuthenticated, user, navigate, location]);

  // Show loading while checking auth status
  if (authLoading) return <AuthLoading />;



  // Debug info
  console.log("🔍 Login State:", {
    isAuthenticated,
    isSuccess,
    isLoading,
    error,
    user: user?.role,
  });

  // Main login form
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 p-4">
      <div className="w-full max-w-md bg-gray-800 rounded-3xl shadow-2xl p-8 md:p-10 border border-gray-700">
        <BackButton />
        <LoginHeader />
        <ErrorAlert error={error} />
        <LoginForm
          formData={formData}
          isLoading={isLoading}
          error={error}
          onChange={handleChange}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default Login;
