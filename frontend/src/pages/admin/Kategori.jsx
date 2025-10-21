import React, { useState, useEffect } from "react";
import api from "../../api/axios";

function Kategori() {
  const [kategori, setKategori] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchKategori = async () => {
      try {
        const response = await api.get("http://localhost:5000/api/kategori");
        setKategori(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching kategori:", err);
        setError(err.message || "Gagal mengambil data kategori.");
        setKategori([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchKategori();
  }, []);

  // Tampilan saat loading
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <p className="text-gray-500 text-lg">Memuat kategori...</p>
      </div>
    );
  }

  // Tampilan saat error
  if (error) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded mx-auto max-w-lg mt-8">
        <h3 className="font-bold">Terjadi Kesalahan!</h3>
        <p>Gagal mengambil data: {error}</p>
      </div>
    );
  }

  // Tampilan daftar kategori
  return (
    <div className="p-6 bg-white shadow-xl rounded-lg mx-auto max-w-xl mt-10">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">
        Daftar Kategori 📚
      </h2>

      {kategori.length === 0 ? (
        <p className="text-gray-600">Tidak ada kategori ditemukan.</p>
      ) : (
        <ul className="space-y-3">
          {kategori.map((item) => (
            <li
              key={item.id}
              className="p-3 bg-gray-50 hover:bg-gray-100 rounded-md shadow-sm transition duration-150 ease-in-out flex justify-between items-center"
            >
              <span className="text-lg font-medium text-gray-700">
                {item.nama} {/* Ganti 'nama' sesuai struktur API Anda */}
              </span>
              <span className="text-sm text-blue-500 font-semibold cursor-pointer hover:text-blue-600">
                Lihat Detail
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Kategori;
