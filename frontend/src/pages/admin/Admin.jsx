import React, { useState } from "react";
import { Users, Tag, Quote, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

import CategoryManagement from "../../components/Admin/CategoryManagement";
import QuoteManagement from "../../components/Admin/QuoteManagement";
import UserManagement from "../../components/Admin/UserManagement";

const Sidebar = ({ activeView, setActiveView, onLogout, user }) => {
  const menuItems = [
    { id: "kategori", label: "Kategori", icon: Tag, view: "Kategori" },
    { id: "quote", label: "Quote", icon: Quote, view: "Quote" },
    { id: "user", label: "User", icon: Users, view: "User" },
  ];

  return (
    <div className="w-64 bg-gray-800 text-white flex-shrink-0 h-full p-4 flex flex-col justify-between hidden md:flex">
      <div>
        <div className="text-2xl font-extrabold text-indigo-400 mb-4 border-b border-gray-700 pb-3">
          Admin Panel
        </div>

        {/* User Info */}
        <div className="mb-6 p-3 bg-gray-700 rounded-lg">
          <p className="text-sm text-gray-300">Welcome,</p>
          <p className="font-semibold text-white">{user?.nama || "Admin"}</p>
          <p className="text-xs text-gray-400 capitalize">
            {user?.role || "Administrator"}
          </p>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const isActive = activeView === item.view;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.view)}
                className={`
                  w-full flex items-center p-3 rounded-lg transition duration-150 text-left
                  ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-lg"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }
                `}
              >
                <Icon className="w-5 h-5 mr-3" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tombol Logout (Desktop) */}
      <div className="mt-8 pt-4 border-t border-gray-700">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center p-3 rounded-lg transition duration-150 text-white bg-red-600 hover:bg-red-700 font-semibold"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
};

function Admin() {
  const [activeView, setActiveView] = useState("Kategori");
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      // Tidak perlu navigate karena logout() sudah handle redirect
    } catch (error) {
      console.error("Logout error:", error);
      // Fallback: redirect manual jika logout gagal
      navigate("/login");
    }
  };

  const renderContent = () => {
    switch (activeView) {
      case "Kategori":
        return <CategoryManagement />;
      case "Quote":
        return <QuoteManagement />;
      case "User":
        return <UserManagement />;
      default:
        return <CategoryManagement />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 font-['Inter']">
      {/* Sidebar */}
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        onLogout={handleLogout}
        user={user}
      />

      {/* Konten Utama */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header Mobile */}
        <header className="bg-white shadow-md p-4 md:hidden flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
            <p className="text-sm text-gray-600">
              Welcome, {user?.nama || "Admin"}
            </p>
          </div>

          {/* Tombol Logout Mobile */}
          <button
            onClick={handleLogout}
            className="flex items-center p-2 text-sm rounded-lg text-white bg-red-600 hover:bg-red-700 font-semibold"
          >
            <LogOut className="w-4 h-4 mr-1" />
            Logout
          </button>
        </header>

        {/* Menu Dropdown untuk Mobile */}
        <div className="p-4 bg-white border-b border-gray-100 md:hidden">
          <select
            value={activeView}
            onChange={(e) => setActiveView(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg bg-white focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="Kategori">Kategori</option>
            <option value="Quote">Quote</option>
            <option value="User">User</option>
          </select>
        </div>

        {/* Area Konten Scrollable */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8">
          <div className="max-w-full mx-auto">{renderContent()}</div>
        </main>
      </div>
    </div>
  );
}

export default Admin;
