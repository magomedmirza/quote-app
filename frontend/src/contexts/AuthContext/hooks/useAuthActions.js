import api from "../../../api/axios";
import { authStorage } from "../../../utils/auth/storage";

export const useAuthActions = () => {
  const login = async (userData) => {
    try {
      const response = await api.post("/auth/login", userData);
      const { userId, accessToken, refreshToken, nama, role } = response.data;

      // Save to storage
      authStorage.setUserData({
        userId,
        accessToken,
        refreshToken,
        nama,
        role,
      });

      return {
        userId,
        nama,
        role,
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      const refreshToken = authStorage.get("refreshToken");

      if (refreshToken) {
        await api.post("/auth/logout", { refreshToken });
      }
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      authStorage.clear();
      window.location.href = "/login";
    }
  };

  const refreshToken = async () => {
    // Implement token refresh logic if needed
  };

  return {
    login,
    logout,
    refreshToken,
  };
};
