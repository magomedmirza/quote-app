const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL,
  baseURLServer: import.meta.env.VITE_BASE_URL,
  appName: import.meta.env.VITE_APP_NAME || "QuoteApp",

  // Validation
  validateConfig() {
    if (!this.baseURL) {
      console.warn("VITE_API_URL is not defined in environment variables");
    }
  },
};

// Validate on import
API_CONFIG.validateConfig();

export default API_CONFIG;
