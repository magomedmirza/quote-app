import React from "react";
import { BookOpen, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

// Components untuk Penulis
import MyQuotesManagement from "../../components/Penulis/MyQuotesManagement";

const Sidebar = ({ onLogout, user }) => {
  return (
    <div className="w-64 bg-green-800 text-white flex-shrink-0 h-full p-4 flex flex-col justify-between hidden md:flex">
      <div>
        <div className="text-2xl font-extrabold text-green-300 mb-4 border-b border-green-700 pb-3">
          Penulis Panel
        </div>

        {/* User Info */}
        <div className="mb-6 p-3 bg-green-700 rounded-lg">
          <p className="text-sm text-green-200">Selamat Datang,</p>
          <p className="font-semibold text-white">{user?.nama || "Penulis"}</p>
          <p className="text-xs text-green-300 capitalize">
            {user?.role || "Penulis"}
          </p>
        </div>

        <nav className="space-y-2">
          {/* Single Active Menu Item */}
          <div className="w-full flex items-center p-3 rounded-lg bg-green-600 text-white shadow-lg">
            <BookOpen className="w-5 h-5 mr-3" />
            <span className="font-medium">Quotes Saya</span>
          </div>
        </nav>
      </div>

      {/* Tombol Logout (Desktop) */}
      <div className="mt-8 pt-4 border-t border-green-700">
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

function Penulis() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
      navigate("/login");
    }
  };

  return (
    <div className="flex h-screen bg-green-50 font-['Inter']">
      {/* Sidebar */}
      <Sidebar onLogout={handleLogout} user={user} />

      {/* Konten Utama */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header Mobile */}
        <header className="bg-white shadow-md p-4 md:hidden flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Penulis Panel</h1>
            <p className="text-sm text-gray-600">
              Welcome, {user?.nama || "Penulis"}
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

        {/* Area Konten Scrollable */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8">
          <div className="max-w-full mx-auto">
            <MyQuotesManagement />
          </div>
        </main>
      </div>
    </div>
  );
}

export default Penulis;
