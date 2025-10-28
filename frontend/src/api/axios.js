import axios from "axios";
import API_CONFIG from "../config/api";
import { authStorage } from "../utils/auth/storage";

const api = axios.create({
  baseURL: API_CONFIG.baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
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

const getAccessToken = () => authStorage.get("accessToken");
const getRefreshToken = () => authStorage.get("refreshToken");

// ✅ TOKEN EXPIRY CHECK FUNCTION
const isTokenExpired = (token) => {
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const expiry = payload.exp * 1000;
    const now = Date.now();
    const isExpired = now >= expiry;

    console.log("🔍 Token expiry check:", {
      expiry: new Date(expiry),
      now: new Date(now),
      isExpired,
      timeRemaining: isExpired
        ? "EXPIRED"
        : Math.floor((expiry - now) / 1000) + " seconds",
    });

    return isExpired;
  } catch (error) {
    console.error("❌ Error checking token expiry:", error);
    return true;
  }
};

// ✅ GET TOKEN PAYLOAD INFO (for debugging)
const getTokenInfo = (token) => {
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return {
      userId: payload.userId,
      nama: payload.nama,
      role: payload.role,
      issuedAt: new Date(payload.iat * 1000),
      expiresAt: new Date(payload.exp * 1000),
      isExpired: Date.now() >= payload.exp * 1000,
    };
  } catch (error) {
    console.error("❌ Error parsing token:", error);
    return null;
  }
};

const logout = () => {
  console.log("🚪 Logging out...");
  authStorage.clear();

  // Delay sedikit untuk memastikan storage cleared
  setTimeout(() => {
    window.location.href = window.location.origin + "/";
  }, 100);
};

// ✅ REQUEST INTERCEPTOR
api.interceptors.request.use(
  (config) => {
    const accessToken = getAccessToken();

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;

      // ✅ CHECK TOKEN EXPIRY BEFORE REQUEST
      const isExpired = isTokenExpired(accessToken);
      const tokenInfo = getTokenInfo(accessToken);

      console.log("🔐 Request with token:", {
        url: config.url,
        tokenPreview: accessToken.substring(0, 20) + "...",
        isExpired,
        userId: tokenInfo?.userId,
        expiresIn: tokenInfo
          ? Math.floor((tokenInfo.expiresAt - Date.now()) / 1000) + "s"
          : "N/A",
      });

      // ✅ TANDAI JIKA TOKEN SUDAH EXPIRED (untuk response interceptor)
      if (isExpired) {
        config._tokenExpired = true;
      }
    } else {
      console.log(`🔓 Request without token: ${config.url}`);
    }

    return config;
  },
  (error) => {
    console.error("❌ Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// ✅ RESPONSE INTERCEPTOR - COMPLETE VERSION
api.interceptors.response.use(
  (response) => {
    console.log(`✅ Response success: ${response.config.url}`, response.status);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    console.log("🔴 INTERCEPTOR TRIGGERED:", {
      url: originalRequest?.url,
      status: error.response?.status,
      message: error.response?.data?.message,
      config: {
        hasRetry: originalRequest?._retry,
        tokenExpired: originalRequest?._tokenExpired,
      },
    });

    // Handle network errors
    if (!error.response) {
      console.log("🌐 Network error:", error.message);
      return Promise.reject(error);
    }

    const { status, data } = error.response;
    const accessToken = getAccessToken();
    const refreshToken = getRefreshToken();

    // ✅ CHECK TOKEN EXPIRY FROM REQUEST CONFIG OR RESPONSE
    const isAccessTokenExpired =
      originalRequest?._tokenExpired || isTokenExpired(accessToken);

    console.log("🔍 Token Status Check:", {
      hasAccessToken: !!accessToken,
      hasRefreshToken: !!refreshToken,
      isAccessTokenExpired,
      status,
      shouldRefresh:
        (status === 401 || isAccessTokenExpired) && !originalRequest?._retry,
    });

    // ✅ CONDITION FOR REFRESH TOKEN
    const shouldRefresh =
      (status === 401 || isAccessTokenExpired) &&
      originalRequest &&
      !originalRequest._retry &&
      refreshToken;

    if (shouldRefresh) {
      console.log("🔄 Token refresh required:", {
        reason: status === 401 ? "401 Response" : "Token Expired",
        url: originalRequest.url,
      });

      // ✅ EXCLUDE AUTH ENDPOINTS (except refresh itself)
      const isAuthEndpoint = originalRequest.url.includes("/auth/");
      const isRefreshEndpoint = originalRequest.url.includes("/auth/refresh");

      if (isAuthEndpoint && !isRefreshEndpoint) {
        console.log("⏩ Skip refresh for auth endpoint");
        return Promise.reject(error);
      }

      if (isRefreshing) {
        console.log("⏳ Refresh in progress, queuing request...");
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            console.log("🎯 Processing queued request with new token");
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => {
            console.error("❌ Queued request failed:", err);
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log("🔄 Starting token refresh process...");

        const refreshResponse = await axios.post(
          `${API_CONFIG.baseURL}/auth/refresh`,
          { refreshToken },
          {
            headers: {
              "Content-Type": "application/json",
            },
            timeout: 10000,
          }
        );

        console.log("✅ Refresh token SUCCESS:", {
          status: refreshResponse.status,
          data: {
            hasAccessToken: !!refreshResponse.data.accessToken,
            hasRefreshToken: !!refreshResponse.data.refreshToken,
            userId: refreshResponse.data.userId,
            nama: refreshResponse.data.nama,
          },
        });

        const {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
          nama,
          role,
          userId,
        } = refreshResponse.data;

        if (!newAccessToken) {
          throw new Error("No access token received from refresh endpoint");
        }

        // ✅ UPDATE AUTH STORAGE
        authStorage.setUserData({
          userId,
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
          nama,
          role,
        });

        console.log("💾 Tokens updated in storage:", {
          newAccessToken: newAccessToken.substring(0, 20) + "...",
          newRefreshToken: newRefreshToken
            ? newRefreshToken.substring(0, 20) + "..."
            : "No new refresh token",
        });

        // ✅ VERIFY STORAGE UPDATE
        const storedAccessToken = authStorage.get("accessToken");
        console.log("🔍 Storage verification:", {
          storedToken: storedAccessToken?.substring(0, 20) + "...",
          matches: storedAccessToken === newAccessToken,
        });

        // ✅ UPDATE HEADER FOR RETRY
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // ✅ PROCESS ALL QUEUED REQUESTS
        processQueue(null, newAccessToken);

        console.log("🔄 Retrying original request with new token...");
        const retryResponse = await api(originalRequest);
        console.log("✅ Retry request SUCCESS");

        return retryResponse;
      } catch (refreshError) {
        console.error("❌ REFRESH TOKEN FAILED:", {
          status: refreshError.response?.status,
          data: refreshError.response?.data,
          message: refreshError.message,
          config: refreshError.config,
        });

        // ✅ PROCESS QUEUE WITH ERROR
        processQueue(refreshError, null);

        // ✅ AUTO LOGOUT ON INVALID REFRESH TOKEN
        if (refreshError.response?.status === 401) {
          console.log("🛑 Refresh token invalid or expired - AUTO LOGOUT");
          logout();
        } else if (refreshError.code === "ECONNABORTED") {
          console.log("⏰ Refresh request timeout");
        } else {
          console.log("⚠️ Refresh failed for other reason");
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // ✅ HANDLE OTHER 401 ERRORS (Non-retryable)
    if (status === 401 && !originalRequest?._retry) {
      console.log("🔴 Non-retryable 401 - Redirecting to login");

      // Check if we have any tokens at all
      if (!accessToken && !refreshToken) {
        console.log("🔓 No tokens available - already logged out");
      } else {
        logout();
      }
    }

    // ✅ HANDLE TOKEN EXPIRED WITHOUT REFRESH TOKEN
    if (isAccessTokenExpired && !refreshToken) {
      console.log("🔴 Access token expired but no refresh token available");
      logout();
    }

    return Promise.reject(error);
  }
);

// ✅ MANUAL TOKEN REFRESH FUNCTION
export const manualTokenRefresh = async () => {
  try {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    console.log("🔄 Manual token refresh initiated...");

    const response = await axios.post(
      `${API_CONFIG.baseURL}/auth/refresh`,
      { refreshToken },
      {
        headers: { "Content-Type": "application/json" },
        timeout: 10000,
      }
    );

    const {
      accessToken,
      refreshToken: newRefreshToken,
      nama,
      role,
      userId,
    } = response.data;

    authStorage.setUserData({
      userId,
      accessToken,
      refreshToken: newRefreshToken,
      nama,
      role,
    });

    console.log("✅ Manual token refresh SUCCESS");

    return {
      accessToken,
      refreshToken: newRefreshToken,
      userId,
      nama,
      role,
    };
  } catch (error) {
    console.error("❌ Manual token refresh FAILED:", error);

    if (error.response?.status === 401) {
      console.log("🛑 Refresh token invalid during manual refresh");
      logout();
    }

    throw error;
  }
};

// ✅ TOKEN INFO FUNCTION (for debugging)
export const getCurrentTokenInfo = () => {
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();

  return {
    accessToken: {
      token: accessToken ? accessToken.substring(0, 20) + "..." : null,
      info: getTokenInfo(accessToken),
    },
    refreshToken: {
      token: refreshToken ? refreshToken.substring(0, 20) + "..." : null,
      info: getTokenInfo(refreshToken),
    },
    storage: {
      userId: authStorage.get("userId"),
      userName: authStorage.get("userName"),
      userRole: authStorage.get("userRole"),
    },
  };
};

// ✅ ADD METHODS TO API INSTANCE
api.manualTokenRefresh = manualTokenRefresh;
api.getCurrentTokenInfo = getCurrentTokenInfo;
api.isAuthenticated = () => !!getAccessToken() && !!getRefreshToken();
api.logout = logout;

export default api;
