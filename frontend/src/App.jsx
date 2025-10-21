import "./App.css";
import { Routes, Route } from "react-router-dom";
import React, { lazy, Suspense } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import HomeSkeleton from "./components/ui/QuoteSkeleton";
import ProtectedRoute from "./components/ProtectedRoute";

// Lazy imports
const Home = lazy(() => import("./pages/public/Home"));
const Login = lazy(() => import("./pages/public/Login"));
const Admin = lazy(() => import("./pages/admin/Admin"));
const Kategori = lazy(() => import("./pages/admin/Kategori"));
const Penulis = lazy(() => import("./pages/penulis/Penulis"));

function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<HomeSkeleton />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          {/* Admin Only Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="Admin">
                <Admin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/kategori"
            element={
              <ProtectedRoute requiredRole="Admin">
                <Kategori />
              </ProtectedRoute>
            }
          />

          {/* Penulis Only Routes */}
          <Route
            path="/penulis"
            element={
              <ProtectedRoute requiredRole="Penulis">
                <Penulis />
              </ProtectedRoute>
            }
          />

          {/* 404 Page */}
          <Route path="*" element={<div>404 - Page Not Found</div>} />
        </Routes>
      </Suspense>
    </AuthProvider>
  );
}

export default App;
