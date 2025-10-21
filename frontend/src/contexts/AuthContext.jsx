import React, { createContext, useState, useContext, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    const token = localStorage.getItem("accessToken");
    const userId = localStorage.getItem("userId");
    const userRole = localStorage.getItem("userRole");
    const userName = localStorage.getItem("userName");

    if (token && userId) {
      setUser({
        userId,
        nama: userName,
        role: userRole,
      });
      setIsAuthenticated(true);
    }

    setIsLoading(false);
  };

  const login = async (userData) => {
    try {
      const response = await api.post("/auth/login", userData);
      const { userId, accessToken, refreshToken, nama, role } = response.data;

      // Save to localStorage
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("userId", userId);
      localStorage.setItem("userName", nama);
      localStorage.setItem("userRole", role);

      // Update state
      setUser({ userId, nama, role });
      setIsAuthenticated(true);

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");

      if (refreshToken) {
        await api.post("/auth/logout", { refreshToken });
      }
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      // Clear localStorage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userId");
      localStorage.removeItem("userName");
      localStorage.removeItem("userRole");

      // Update state
      setUser(null);
      setIsAuthenticated(false);

      // Redirect to login
      window.location.href = "/login";
    }
  };

  // Role checking functions
  const isAdmin = () => user?.role === "Admin";
  const isPenulis = () => user?.role === "Penulis";
  const hasRole = (requiredRole) => user?.role === requiredRole;

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkAuthStatus,
    isAdmin,
    isPenulis,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
