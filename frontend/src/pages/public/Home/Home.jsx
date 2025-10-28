import { useNavigate } from "react-router-dom";
import { useQuotes } from "./hooks/useQuotes";
import LoadingState from "../../../components/states/LoadingState";
import ErrorState from "../../../components/states/ErrorState";
import EmptyState from "../../../components/states/EmptyState";
import SuccessState from "../../../components/states/SuccessState";
import Footer from "../../../components/layout/Footer";

const Home = () => {
  const navigate = useNavigate();
  const { quotes, error, isLoading, isEmpty } = useQuotes();
  const handleLogin = () => navigate("/login");

  // ✅ PASTIKAN SEMUA STATE PUNYA BACKGROUND YANG SAMA
  if (isLoading)
    return (
      <div className="min-h-screen bg-gray-950">
        <LoadingState onLogin={handleLogin} />
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-gray-950">
        <ErrorState error={error} onLogin={handleLogin} />
      </div>
    );

  if (isEmpty)
    return (
      <div className="min-h-screen bg-gray-950">
        <EmptyState onLogin={handleLogin} />
      </div>
    );

  // ✅ SUCCESS STATE DENGAN FOOTER
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <div className="flex-1">
        <SuccessState quotes={quotes} onLogin={handleLogin} />
      </div>
      <Footer />
    </div>
  );
};

export default Home;
