const EmptyState = ({ onAddClick }) => (
  <div className="p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-lg">
    <p className="mb-2">Tidak ada kategori ditemukan.</p>
    <button
      onClick={onAddClick}
      className="text-yellow-800 underline hover:text-yellow-900 font-medium"
    >
      Klik di sini untuk menambahkan kategori pertama
    </button>
  </div>
);

export default EmptyState;
