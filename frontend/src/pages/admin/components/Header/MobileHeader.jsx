import { LogOut } from "lucide-react";

const MobileHeader = ({ user, onLogout }) => (
  <header className="bg-white shadow-md p-4 md:hidden flex justify-between items-center">
    <div>
      <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
      <p className="text-sm text-gray-600">Welcome, {user?.nama || "Admin"}</p>
    </div>

    <button
      onClick={onLogout}
      className="flex items-center p-2 text-sm rounded-lg text-white bg-red-600 hover:bg-red-700 font-semibold"
    >
      <LogOut className="w-4 h-4 mr-1" />
      Logout
    </button>
  </header>
);

export default MobileHeader;
