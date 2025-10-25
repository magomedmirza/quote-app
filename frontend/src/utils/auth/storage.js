// LocalStorage management
export const authStorage = {
  get: (key) => localStorage.getItem(key),

  set: (key, value) => localStorage.setItem(key, value),

  remove: (key) => localStorage.removeItem(key),

  clear: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
  },

  getUserData: () => ({
    token: localStorage.getItem("accessToken"),
    userId: localStorage.getItem("userId"),
    userName: localStorage.getItem("userName"),
    userRole: localStorage.getItem("userRole"),
  }),

  setUserData: ({ userId, accessToken, refreshToken, nama, role }) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("userId", userId);
    localStorage.setItem("userName", nama);
    localStorage.setItem("userRole", role);
  },
};
