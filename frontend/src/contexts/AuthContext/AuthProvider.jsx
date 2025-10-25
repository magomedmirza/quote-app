import { createContext, useMemo } from "react";
import { useAuthState } from "./hooks/useAuthState";
import { useAuthActions } from "./hooks/useAuthActions";
import { roleHelpers } from "../../utils/auth/roleHelpers";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { user, isLoading, updateUser, clearUser, setIsLoading } =
    useAuthState();
  const { login, logout, refreshToken } = useAuthActions();

  // Enhanced login with state update
  const handleLogin = async (userData) => {
    try {
      setIsLoading(true);
      const userInfo = await login(userData);
      updateUser({
        userId: userInfo.userId,
        nama: userInfo.nama,
        role: userInfo.role,
      });
      return userInfo;
    } finally {
      setIsLoading(false);
    }
  };

  // Enhanced logout with state cleanup
  const handleLogout = async () => {
    await logout();
    clearUser();
  };

  // Memoized context value
  const value = useMemo(
    () => ({
      // State
      user,
      isLoading,
      isAuthenticated: roleHelpers.isAuthenticated(user),

      // Actions
      login: handleLogin,
      logout: handleLogout,
      refreshToken,

      // Role helpers
      isAdmin: () => roleHelpers.isAdmin(user),
      isPenulis: () => roleHelpers.isPenulis(user),
      hasRole: (requiredRole) => roleHelpers.hasRole(user, requiredRole),
    }),
    [user, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
