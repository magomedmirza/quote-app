import CategoryManagement from "../../../components/Admin/CategoryManagement";
import QuoteManagement from "../../../components/Admin/QuoteManagement";
import UserManagement from "../../../components/Admin/UserManagement";

const ContentArea = ({ activeView }) => {
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
    <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8">
      <div className="max-w-full mx-auto">{renderContent()}</div>
    </main>
  );
};

export default ContentArea;
