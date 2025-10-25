import Sidebar from "./Sidebar";
import MobileHeader from "./Header/MobileHeader";
import MobileMenu from "./Header/MobileMenu";
import ContentArea from "./ContentArea";

const AdminLayout = ({ activeView, setActiveView, onLogout, user }) => (
  <div className="flex h-screen bg-gray-100 font-['Inter']">
    <Sidebar
      activeView={activeView}
      setActiveView={setActiveView}
      onLogout={onLogout}
      user={user}
    />

    <div className="flex-1 flex flex-col overflow-hidden">
      <MobileHeader user={user} onLogout={onLogout} />
      <MobileMenu activeView={activeView} setActiveView={setActiveView} />
      <ContentArea activeView={activeView} />
    </div>
  </div>
);

export default AdminLayout;
