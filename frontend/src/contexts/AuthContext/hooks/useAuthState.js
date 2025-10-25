import { useState, useEffect } from "react";
import { authStorage } from "../../../utils/auth/storage";

export const useAuthState = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = () => {
    const { token, userId, userName, userRole } = authStorage.getUserData();

    if (token && userId) {
      setUser({
        userId,
        nama: userName,
        role: userRole,
      });
    }

    setIsLoading(false);
  };

  const updateUser = (userData) => {
    setUser(userData);
  };

  const clearUser = () => {
    setUser(null);
  };

  return {
    user,
    isLoading,
    updateUser,
    clearUser,
    setIsLoading,
  };
};
