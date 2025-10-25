import { Tag, Quote, Users } from "lucide-react";

const menuItems = [
  { id: "kategori", label: "Kategori", icon: Tag, view: "Kategori" },
  { id: "quote", label: "Quote", icon: Quote, view: "Quote" },
  { id: "user", label: "User", icon: Users, view: "User" },
];

const MenuItems = ({ activeView, setActiveView }) => (
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
);

export default MenuItems;
