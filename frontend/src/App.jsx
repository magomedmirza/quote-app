import "./App.css";

import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AuthProvider } from "./contexts/AuthContext/AuthProvider";
import AppSkeleton from "./components/layout/AppSkeleton";
import ProtectedRoute from "./components/ProtectedRoute";

// Lazy loaded pages
const Home = lazy(() => import("./pages/public/Home/Home"));
const Login = lazy(() => import("./pages/public/Login"));
const Admin = lazy(() => import("./pages/admin/index"));
const Penulis = lazy(() => import("./pages/penulis/Penulis")); // ✅ PATH BENAR

// Route configuration
const routes = [
  // Public routes
  { path: "/", element: Home, public: true },
  { path: "/login", element: Login, public: true },

  // Admin routes
  { path: "/admin", element: Admin, role: "Admin" },

  // Penulis routes
  { path: "/penulis", element: Penulis, role: "Penulis" },
];

function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<AppSkeleton />}>
        <Routes>
          {routes.map(({ path, element: Element, public: isPublic, role }) => (
            <Route
              key={path}
              path={path}
              element={
                isPublic ? (
                  <Element />
                ) : (
                  <ProtectedRoute requiredRole={role}>
                    <Element />
                  </ProtectedRoute>
                )
              }
            />
          ))}
          {/* 404 Route */}
          <Route path="*" element={<div>404 - Page Not Found</div>} />
        </Routes>
      </Suspense>
    </AuthProvider>
  );
}

export default App;
