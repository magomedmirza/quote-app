import HeroHeader from "../../components/layout/HeroHeader.jsx";

const ErrorState = ({ error, onLogin }) => (
  <div className="min-h-screen bg-gray-950 text-white font-['Inter']">
    <HeroHeader onLogin={onLogin} />
    <div className="flex items-start justify-center pt-10 px-4 sm:px-6 lg:px-8">
      <div className="text-center p-8 bg-red-900/50 border-l-4 border-red-500 text-red-300 max-w-lg mx-auto rounded-xl shadow-2xl">
        <p className="font-bold text-xl mb-3">Koneksi Gagal 📡</p>
        <p>
          {error?.message || "Gagal memuat data dari server. Cek koneksi Anda."}
        </p>
      </div>
    </div>
  </div>
);

export default ErrorState;
