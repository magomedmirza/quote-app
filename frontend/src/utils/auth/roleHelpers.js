// Role checking utilities
export const roleHelpers = {
  isAdmin: (user) => user?.role === "Admin",
  isPenulis: (user) => user?.role === "Penulis",
  hasRole: (user, requiredRole) => user?.role === requiredRole,
  isAuthenticated: (user) => !!user?.userId,
};
