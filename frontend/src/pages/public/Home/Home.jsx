import { useNavigate } from "react-router-dom";
import { useQuotes } from "./hooks/useQuotes";
import LoadingState from "../../../components/states/LoadingState";
import ErrorState from "../../../components/states/ErrorState";
import EmptyState from "../../../components/states/EmptyState";
import SuccessState from "../../../components/states/SuccessState";

const Home = () => {
  const navigate = useNavigate();
  const { quotes, error, isLoading, isEmpty } = useQuotes();
  const handleLogin = () => navigate("/login");

  if (isLoading) return <LoadingState onLogin={handleLogin} />;
  if (error) return <ErrorState error={error} onLogin={handleLogin} />;
  if (isEmpty) return <EmptyState onLogin={handleLogin} />;

  return <SuccessState quotes={quotes} onLogin={handleLogin} />;
};

export default Home;
