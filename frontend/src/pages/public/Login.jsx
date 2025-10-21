import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { ArrowLeft } from "lucide-react";

function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { login, isAuthenticated, isLoading: authLoading, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect berdasarkan role setelah login
  useEffect(() => {
    if (isAuthenticated && user) {
      const from = location.state?.from?.pathname;

      if (from) {
        navigate(from, { replace: true });
      } else {
        if (user.role === "Admin") {
          navigate("/admin", { replace: true });
        } else if (user.role === "Penulis") {
          navigate("/penulis", { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      }
    }
  }, [isAuthenticated, user, navigate, location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(formData);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Terjadi kesalahan saat login";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Tampilkan loading jika auth masih checking
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-teal-500"></div>
      </div>
    );
  }

  // Jangan render form jika sudah authenticated
  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-teal-500 mx-auto mb-4"></div>
          <p className="text-teal-400 font-medium">
            Mengautentikasi dan Mengalihkan...
          </p>
        </div>
      </div>
    );
  }

  // Login Form Utama
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 p-4 font-['Inter']">
      <div className="w-full max-w-md bg-gray-800 rounded-3xl shadow-2xl shadow-indigo-500/20 p-8 md:p-10 border border-gray-700 transition duration-300 hover:shadow-teal-500/10 relative">
        {/* Tombol Kembali ke Home */}
        <Link
          to="/"
          className="absolute top-4 left-4 flex items-center text-gray-400 hover:text-teal-400 transition duration-200 group"
        >
          <ArrowLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm">Kembali ke Home</span>
        </Link>

        <div className="text-center mb-10 mt-4">
          <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-indigo-400 tracking-tight">
            Masuk ke Quote App
          </h2>
          <p className="mt-3 text-sm text-gray-400">
            Silakan masukkan username dan password Anda.
          </p>
        </div>

        {error && (
          <div className="p-4 mb-6 text-sm text-red-300 bg-red-900/50 rounded-lg border-l-4 border-red-500 shadow-md">
            <span className="font-bold">Gagal Masuk:</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              value={formData.username}
              onChange={handleChange}
              placeholder="username Anda"
              className="w-full px-4 py-3 bg-gray-700 text-gray-200 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition duration-200 shadow-inner placeholder:text-gray-500"
              disabled={isLoading}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-gray-700 text-gray-200 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition duration-200 shadow-inner placeholder:text-gray-500"
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-xl text-gray-900 font-bold tracking-wider uppercase transition duration-300 transform shadow-lg ${
              isLoading
                ? "bg-teal-600/50 cursor-not-allowed"
                : "bg-teal-400 hover:bg-teal-300 hover:scale-[1.01] hover:shadow-teal-500/50"
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-900"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Memproses...
              </div>
            ) : (
              "Masuk Sekarang"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
