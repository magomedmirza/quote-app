// src/components/ui/QuoteSkeleton.jsx

const QuoteSkeleton = () => (
  // Meniru struktur QuoteCard
  <div className="bg-white rounded-lg p-6 h-48 shadow-lg border border-gray-100 animate-pulse">
    {/* Siluet Kategori */}
    <div className="h-4 w-1/4 bg-gray-200 rounded-full mb-6"></div>

    {/* Siluet Quote (3 baris) */}
    <div className="space-y-3">
      <div className="h-4 bg-gray-200 rounded"></div>
      <div className="h-4 w-11/12 bg-gray-200 rounded"></div>
      <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
    </div>

    {/* Siluet Author */}
    <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end">
      <div className="h-4 w-1/3 bg-gray-300 rounded"></div>
    </div>
  </div>
);

// Gabungkan dalam satu komponen untuk dipanggil di Suspense
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

export default HomeSkeleton;
