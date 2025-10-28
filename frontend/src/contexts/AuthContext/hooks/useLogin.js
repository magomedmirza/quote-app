import { useState } from "react";
import { useAuth } from "../../../contexts/AuthContext/hooks/useAuth";

export const useLogin = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false); // ✅ TAMBAH INI

  const { login, clearUser } = useAuth(); // ✅ PASTIKAN clearUser ada

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(""); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.username || !formData.password) {
      setError("Username dan password harus diisi");
      return;
    }

    setError("");
    setIsLoading(true);
    setIsSuccess(false); // ✅ RESET SUCCESS STATE

    try {
      console.log("🔄 useLogin: Attempting login...");
      await login(formData);

      // ✅ SET SUCCESS STATE - login berhasil
      console.log("✅ useLogin: Login successful");
      setIsSuccess(true);
    } catch (err) {
      console.error("❌ useLogin: Login failed", err);

      // ✅ CLEAR USER DATA dari context
      clearUser();

      const errorMessage =
        err.response?.data?.message || "Terjadi kesalahan saat login";
      setError(errorMessage);
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    isLoading,
    error,
    isSuccess, // ✅ EXPOSE SUCCESS STATE
    handleChange,
    handleSubmit,
    setError,
  };
};
