import { LogOut } from "lucide-react";
import MenuItems from "./MenuItems";
import UserInfo from "./UserInfo";

const Sidebar = ({ activeView, setActiveView, onLogout, user }) => (
  <div className="w-64 bg-gray-800 text-white flex-shrink-0 h-full p-4 flex flex-col justify-between hidden md:flex">
    <div>
      <div className="text-2xl font-extrabold text-indigo-400 mb-4 border-b border-gray-700 pb-3">
        Admin Panel
      </div>
      <UserInfo user={user} />
      <MenuItems activeView={activeView} setActiveView={setActiveView} />
    </div>

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

export default Sidebar;
