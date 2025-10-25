import HeroHeader from "../../components/layout/HeroHeader.jsx";

const LoadingState = ({ onLogin }) => (
  <div className="min-h-screen bg-gray-950 text-white font-['Inter']">
    <HeroHeader subtitle="Mengambil Inspirasi Baru..." onLogin={onLogin} />
    <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 px-4 sm:px-6 lg:px-8">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="bg-gray-800 p-6 rounded-3xl shadow-xl h-40 border border-gray-700 animate-pulse"
        >
          <div className="h-6 bg-gray-700 rounded w-4/5 mb-6"></div>
          <div className="h-3 bg-gray-700 rounded w-1/4 mb-2"></div>
          <div className="h-3 bg-gray-700 rounded w-1/3"></div>
        </div>
      ))}
    </div>
  </div>
);

export default LoadingState;
