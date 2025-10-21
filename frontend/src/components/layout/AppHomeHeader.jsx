import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";

const AppHeader = ({ subtitle }) => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    // Navigasi ke halaman login
    navigate("/login");
  };

  return (
    <header className="max-w-4xl mx-auto mb-10 border-b-2 pb-4 border-blue-200 flex justify-between items-center">
      <div className="text-left">
        <h1 className="text-4xl font-extrabold text-gray-900">Quote App</h1>
        {subtitle && <p className="text-sm text-gray-500 mt-2">{subtitle}</p>}
      </div>

      <Button onClick={handleLoginClick}>Login</Button>
    </header>
  );
};

export default AppHeader;
