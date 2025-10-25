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

// Constants untuk localStorage keys
const STORAGE_KEYS = {
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
  USER_ID: "userId",
  USER_NAME: "userName",
  USER_ROLE: "userRole",
};

// Helper function untuk logout
const logout = () => {
  console.log("🚪 Logging out...");
  Object.values(STORAGE_KEYS).forEach((key) => {
    localStorage.removeItem(key);
  });

  // Redirect ke login page
  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
};

// Helper function untuk mendapatkan access token
const getAccessToken = () => localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
const getRefreshToken = () => localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const accessToken = getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
      console.log(
        "🔄 Request dengan token:",
        config.url,
        "Token:",
        accessToken.substring(0, 20) + "..."
      );
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor - IMPROVED VERSION
api.interceptors.response.use(
  (response) => {
    console.log("✅ Response success:", response.config.url);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle network errors atau request cancelled
    if (!error.response) {
      console.log("🔴 Network error or request cancelled:", error.message);
      return Promise.reject(error);
    }

    const { status, data } = error.response;
    const isTokenError = status === 401 || status === 403;
    const shouldRetry =
      isTokenError &&
      !originalRequest?._retry &&
      originalRequest?.url &&
      !originalRequest.url.includes("/auth/") &&
      getRefreshToken(); // Hanya retry jika ada refresh token

    console.log("🔴 Interceptor Error:", {
      url: originalRequest?.url,
      status,
      message: data?.message,
      isRefreshing,
      hasRetry: originalRequest?._retry,
      shouldRetry,
    });

    if (shouldRetry) {
      console.log("🔄 Token error detected, starting token refresh...");

      if (isRefreshing) {
        console.log("⏳ Refresh already in progress, queuing request...");
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => {
            console.log("❌ Queued request failed:", err);
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log("🔄 Calling refresh token endpoint...");
        const refreshToken = getRefreshToken();

        const refreshResponse = await axios.post(
          `${API_CONFIG.baseURL}/auth/refresh`, // PERBAIKAN: path yang konsisten
          { refreshToken },
          {
            headers: {
              "Content-Type": "application/json",
            },
            timeout: 10000, // Timeout 10 detik
          }
        );

        console.log("✅ Refresh token successful");

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

        console.log("💾 Saving new tokens...");

        // Update tokens dan user data
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, newAccessToken);
        if (newRefreshToken) {
          localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);
        }
        if (nama) localStorage.setItem(STORAGE_KEYS.USER_NAME, nama);
        if (role) localStorage.setItem(STORAGE_KEYS.USER_ROLE, role);
        if (userId) localStorage.setItem(STORAGE_KEYS.USER_ID, userId);

        console.log("📝 User data updated:", { nama, role, userId });

        // Update authorization header untuk request asli
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // Process semua request yang tertahan dengan token baru
        processQueue(null, newAccessToken);

        console.log("🔄 Retrying original request...");
        return api(originalRequest);
      } catch (refreshError) {
        console.error("❌ Refresh token failed:", {
          status: refreshError.response?.status,
          data: refreshError.response?.data,
          message: refreshError.message,
        });

        // Process semua request yang tertahan dengan error
        processQueue(refreshError, null);

        // Logout hanya jika error bukan 401 dari refresh endpoint
        if (refreshError.response?.status !== 401) {
          logout();
        } else {
          // Jika refresh token juga invalid, logout
          logout();
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle token errors yang tidak bisa di-retry
    if (isTokenError && originalRequest?.url?.includes("/auth/")) {
      console.log("🔴 Auth endpoint error, logging out...");
      logout();
    }

    // Handle other errors
    return Promise.reject(error);
  }
);

// Tambahkan method untuk manual logout
api.logout = logout;

// Tambahkan method untuk check auth status
api.isAuthenticated = () => {
  return !!getAccessToken();
};

export default api;
