import { useAdmin } from "./hooks/useAdmin";
import AdminLayout from "./components/AdminLayout";

const Admin = () => {
  const { activeView, setActiveView, handleLogout, user } = useAdmin();

  return (
    <AdminLayout
      activeView={activeView}
      setActiveView={setActiveView}
      onLogout={handleLogout}
      user={user}
    />
  );
};

export default Admin;
