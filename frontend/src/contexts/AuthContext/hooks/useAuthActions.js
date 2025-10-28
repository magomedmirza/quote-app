import api from "../../../api/axios";
import { authStorage } from "../../../utils/auth/storage";

export const useAuthActions = () => {
  const login = async (userData) => {
    try {
      console.log("🔄 Attempting login for:", userData.username);

      const response = await api.post("/auth/login", userData);

      console.log("✅ Login API success:", response.data);

      const { userId, accessToken, refreshToken, nama, role } = response.data;

      // Save to storage
      authStorage.setUserData({
        userId,
        accessToken,
        refreshToken,
        nama,
        role,
      });

      // ✅ FIX: Return data untuk diproses di component
      return {
        userId,
        nama,
        role,
        accessToken,
        refreshToken,
      };
    } catch (error) {
      console.error("❌ Login API failed:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });

      // ✅ FIX: Clear storage jika login gagal
      authStorage.clear();

      // ✅ FIX: Throw error agar bisa ditangkap di component
      throw error;
    }
  };

  const logout = async () => {
    try {
      const refreshToken = authStorage.get("refreshToken");

      if (refreshToken) {
        // ✅ HANDLE 404 - TETAP LANJUT LOGOUT MESKI 404
        await api.post("/auth/logout", { refreshToken }).catch((err) => {
          if (err.response?.status === 404) {
            console.log("Logout endpoint not found - continuing logout");
            return; // Lanjut logout meski 404
          }
          throw err; // Throw other errors
        });
      }
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      authStorage.clear();
      window.location.href = window.location.origin + "/";
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
