import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext/hooks/useAuth";

export const useAdmin = () => {
  const [activeView, setActiveView] = useState("Kategori");
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
      navigate("/login");
    }
  };

  return {
    activeView,
    setActiveView,
    handleLogout,
    user,
  };
};
