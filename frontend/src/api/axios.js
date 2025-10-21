import axios from "axios";
import API_CONFIG from "../config/api";

const api = axios.create({
  baseURL: API_CONFIG.baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
      console.log(
        "🔄 Request dengan token:",
        accessToken.substring(0, 20) + "..."
      );
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor - UPDATED FOR USER DATA
api.interceptors.response.use(
  (response) => {
    console.log("✅ Response success:", response.config.url);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    console.log("🔴 Interceptor Error:", {
      url: originalRequest?.url,
      status: error.response?.status,
      message: error.response?.data?.message,
      isRefreshing,
      hasRetry: originalRequest?._retry,
    });

    // Handle both 401 AND 403 for token issues
    const isTokenError =
      error.response?.status === 401 || error.response?.status === 403;
    const shouldRetry =
      isTokenError &&
      !originalRequest?._retry &&
      originalRequest?.url &&
      !originalRequest.url.includes("/auth/");

    if (shouldRetry) {
      console.log(
        "🔄 Token error detected (401/403), starting token refresh..."
      );

      if (isRefreshing) {
        console.log("⏳ Refresh already in progress, queuing request...");
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        console.log("❌ No refresh token found");
        logout();
        return Promise.reject(error);
      }

      try {
        console.log("🔄 Calling refresh token endpoint...");

        // Use direct axios to avoid interceptor loop
        const refreshResponse = await axios.post(
          `${API_CONFIG.baseURLServer}/api/auth/refresh`,
          { refreshToken },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log("✅ Refresh response:", refreshResponse.data);

        // PERBAIKAN: Ambil semua data user dari response
        const {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
          nama,
          role,
          userId,
        } = refreshResponse.data;

        if (!newAccessToken) {
          throw new Error("No access token in refresh response");
        }

        console.log("💾 Saving new tokens and user data to localStorage...");

        // Simpan semua data
        localStorage.setItem("accessToken", newAccessToken);
        if (newRefreshToken) {
          localStorage.setItem("refreshToken", newRefreshToken);
        }
        // Simpan data user jika ada
        if (nama) {
          localStorage.setItem("userName", nama);
        }
        if (role) {
          localStorage.setItem("userRole", role);
        }
        if (userId) {
          localStorage.setItem("userId", userId);
        }

        console.log("📝 User data updated:", { nama, role, userId });

        // Update the failed request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // Process any queued requests
        processQueue(null, newAccessToken);

        console.log("🔄 Retrying original request...");
        return api(originalRequest);
      } catch (refreshError) {
        console.error("❌ Refresh token failed:", {
          status: refreshError.response?.status,
          data: refreshError.response?.data,
          message: refreshError.message,
        });

        // Process queue with error
        processQueue(refreshError, null);
        logout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // For other errors, just reject
    return Promise.reject(error);
  }
);

const logout = () => {
  console.log("🚪 Logging out...");
  // PERBAIKAN: Hapus semua data user
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("userId");
  localStorage.removeItem("userName");
  localStorage.removeItem("userRole");
  window.location.href = "/login";
};

export default api;
