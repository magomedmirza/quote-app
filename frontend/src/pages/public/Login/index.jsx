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
  const { formData, isLoading, error, handleChange, handleSubmit } = useLogin();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect based on role after login
  useEffect(() => {
    if (isAuthenticated && user) {
      const from = location.state?.from?.pathname;

      if (from) {
        navigate(from, { replace: true });
      } else {
        const redirectPath =
          user.role === "Admin"
            ? "/admin"
            : user.role === "Penulis"
            ? "/penulis"
            : "/";
        navigate(redirectPath, { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate, location]);

  // Show loading while checking auth status
  if (authLoading) return <AuthLoading />;

  // Show redirect loading if already authenticated
  if (isAuthenticated) return <RedirectLoading />;

  // Main login form
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 p-4 font-['Inter']">
      <div className="w-full max-w-md bg-gray-800 rounded-3xl shadow-2xl shadow-indigo-500/20 p-8 md:p-10 border border-gray-700 transition duration-300 hover:shadow-teal-500/10 relative">
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
