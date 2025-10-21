import useSWR from "swr";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

// Fungsi Fetcher tidak diubah
const fetcher = (url) =>
  api
    .get(url)
    .then((res) => res.data)
    .catch((err) => {
      if (err.response && err.response.status === 404) {
        return [];
      }
      throw err;
    });

// 🎨 Komponen Hero Header Modern DENGAN TOMBOL LOGIN
const HeroHeader = ({ title = "Quote Apps", subtitle }) => {
  const navigate = useNavigate();

  return (
    <header className="pt-8 pb-12 md:pt-10 md:pb-16 mb-10 bg-gray-900 shadow-2xl rounded-b-[3rem] border-b-4 border-teal-500/50 relative">
      {/* Tombol Login di Kanan Atas */}
      <div className="absolute top-5 right-6 md:right-10 z-10">
        <button
          className="px-5 py-2 text-sm font-semibold text-gray-900 bg-teal-400 rounded-full transition duration-300 ease-in-out hover:bg-teal-300 hover:shadow-lg hover:shadow-teal-500/40 transform hover:scale-105"
          onClick={() => navigate("/login")}
        >
          Login
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-indigo-400 tracking-tight mb-2">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xl text-gray-400 mt-3 max-w-2xl mx-auto font-light">
            {subtitle}
          </p>
        )}
      </div>
    </header>
  );
};

// 🌟 Quote Card Component Modern (Tidak Berubah)
const QuoteCard = ({ quote, author, categoryName, userName }) => (
  <div className="bg-gray-800 p-6 rounded-3xl shadow-2xl hover:shadow-teal-500/30 transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-[1.02] border border-gray-700/50">
    <p className="text-xl italic text-gray-200 mb-5 font-serif leading-relaxed">
      "{quote}"
    </p>
    <div className="flex justify-between items-end text-sm text-gray-400 pt-4 border-t border-gray-700">
      <div>
        <span className="font-semibold text-teal-400 text-lg">~ {author}</span>
        <span className="ml-3 mt-1 inline-block px-3 py-1 text-xs bg-indigo-600/70 text-white rounded-full font-medium tracking-wider shadow-md">
          {categoryName}
        </span>
      </div>
      <p className="text-xs text-gray-500">by: {userName}</p>
    </div>
  </div>
);

// 💀 Skeleton Loading Component Modern (Tidak Berubah)
const HomeSkeleton = () => (
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
);

const Home = () => {
  // SWR Fetching
  const {
    data: quotes,
    error,
    isLoading,
  } = useSWR("/quote", fetcher, {
    refreshInterval: 5000,
    revalidateOnFocus: true,
  });

  const containerClasses = "min-h-screen bg-gray-950 text-white font-['Inter']";

  // 1. Loading state
  if (isLoading || !quotes) {
    return (
      <div className={containerClasses}>
        <HeroHeader subtitle="Mengambil Inspirasi Baru..." />
        <HomeSkeleton />
      </div>
    );
  }

  // 2. Error state
  if (error) {
    return (
      <div className={containerClasses}>
        <HeroHeader />
        <div className="flex items-start justify-center pt-10 px-4 sm:px-6 lg:px-8">
          <div className="text-center p-8 bg-red-900/50 border-l-4 border-red-500 text-red-300 max-w-lg mx-auto rounded-xl shadow-2xl">
            <p className="font-bold text-xl mb-3">Koneksi Gagal 📡</p>
            <p>
              {error.message ||
                "Gagal memuat data dari server. Cek koneksi Anda."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 3. Empty state
  if (quotes.length === 0) {
    return (
      <div className={containerClasses}>
        <HeroHeader />
        <div className="text-center p-10 bg-yellow-900/50 border-l-4 border-yellow-500 text-yellow-300 max-w-lg mx-auto rounded-xl shadow-2xl">
          <p className="font-bold text-2xl">Kosong Melompong 🏜️</p>
          <p className="mt-3">
            Sepertinya belum ada Quote yang ditambahkan oleh penulis manapun.
          </p>
        </div>
      </div>
    );
  }

  // 4. Success state
  return (
    <div className={containerClasses}>
      <HeroHeader subtitle={`Ditemukan ${quotes.length} Quote Inspiratif`} />

      <main className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 px-4 sm:px-6 lg:px-8 pb-16">
        {quotes.map((item) => (
          <QuoteCard
            key={item.id}
            quote={item.quote}
            author={item.author}
            categoryName={item.kategori?.nama || "Umum"}
            userName={item.user?.nama || "Anonim"}
          />
        ))}
      </main>
    </div>
  );
};

export default Home;
