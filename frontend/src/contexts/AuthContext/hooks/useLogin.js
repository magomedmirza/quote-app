import { useState } from "react";
import { useAuth } from "../../../contexts/AuthContext/hooks/useAuth";

export const useLogin = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();

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

  return {
    formData,
    isLoading,
    error,
    handleChange,
    handleSubmit,
    setError,
  };
};
